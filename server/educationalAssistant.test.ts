import { describe, expect, it, vi } from "vitest";

const { invokeLLM } = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("./_core/llm", () => ({ invokeLLM }));

import { educationalAssistInput, runEducationalAssistant } from "./educationalAssistant";
import { reviewLabel } from "../client/src/lib/teacherReview";

describe("teacher review labels", () => {
  it("keeps teacher decisions explicit", () => {
    expect(reviewLabel("pending")).toBe("بانتظار مراجعة المعلم");
    expect(reviewLabel("accepted")).toBe("اعتمدها المعلم");
    expect(reviewLabel("rejected")).toBe("رفضها المعلم");
    expect(reviewLabel("corrected")).toBe("صححها المعلم");
  });
});

describe("educational assistant contract", () => {
  it("accepts a bounded teacher question", () => {
    const result = educationalAssistInput.safeParse({ question: "اشرح الفكرة", subject: "العربية" });
    expect(result.success).toBe(true);
  });

  it("defaults to explanation and accepts explicit educational intents", () => {
    expect(educationalAssistInput.parse({ question: "اشرح" }).intent).toBe("explain");
    expect(educationalAssistInput.parse({ question: "أنشئ سؤالًا", intent: "question" }).intent).toBe("question");
    expect(educationalAssistInput.safeParse({ question: "نفذ", intent: "chat" }).success).toBe(false);
  });

  it("returns structured evidence when the model response is valid", async () => {
    invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: JSON.stringify({
      answer: "الإجابة التعليمية",
      explanation: "شرح موجز",
      why: "لأن السياق يذكر ذلك",
      confidence: "متوسط",
      provenanceStatus: "استدلال يحتاج مراجعة",
      sources: [{ label: "سياق المعلم", kind: "teacher_context", note: "مقدم داخل السؤال" }],
      limitations: ["تحتاج مراجعة المعلم"],
      teacherReviewRequired: true,
    }) } }] });

    const result = await runEducationalAssistant({ question: "اشرح", subject: "العربية", lessonContext: "درس النحو" });
    expect(result.answer).toBe("الإجابة التعليمية");
    expect(result.teacherReviewRequired).toBe(true);
    expect(result.sources[0]?.kind).toBe("teacher_context");
  });

  it("removes unsupported source claims when no context was provided", async () => {
    invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: JSON.stringify({
      answer: "إجابة",
      explanation: "شرح",
      why: "سبب",
      confidence: "مرتفع",
      provenanceStatus: "معلومة من سياق المعلم",
      sources: [{ label: "مصدر مخترع", kind: "provided_source", note: "غير مقدم" }],
      limitations: [],
      teacherReviewRequired: false,
    }) } }] });

    const result = await runEducationalAssistant({ question: "اشرح" });
    expect(result.sources).toEqual([{ label: "لا يوجد مصدر متاح", kind: "none", note: "تحتاج الإجابة إلى مصدر أو مراجعة المعلم." }]);
    expect(result.provenanceStatus).toBe("استدلال يحتاج مراجعة");
    expect(result.teacherReviewRequired).toBe(true);
  });

  it("forces teacher review when the model reports conflicting sources", async () => {
    invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: JSON.stringify({
      answer: "إجابة متعارضة",
      explanation: "تعارضت الإشارات المتاحة",
      why: "المصدران لا يتفقان",
      confidence: "متوسط",
      provenanceStatus: "استدلال يحتاج مراجعة",
      sources: [{ label: "سياق المعلم", kind: "teacher_context", note: "مقدم داخل السؤال" }],
      limitations: ["يلزم قرار المعلم"],
      teacherReviewRequired: false,
      evidenceClass: "ai_inference",
      verificationState: "conflicting_sources",
    }) } }] });

    const result = await runEducationalAssistant({ question: "هل هذا متفق عليه؟", subject: "العربية", lessonContext: "درس تجريبي" });
    expect(result.verificationState).toBe("conflicting_sources");
    expect(result.teacherReviewRequired).toBe(true);
  });

  it("fails closed when the model response is malformed", async () => {
    invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: "not-json" } }] });
    const result = await runEducationalAssistant({ question: "هل هذا مؤكد؟", subject: "الرياضيات" });
    expect(result.provenanceStatus).toBe("غير متحقق");
    expect(result.confidence).toBe("منخفض");
    expect(result.teacherReviewRequired).toBe(true);
  });
});
