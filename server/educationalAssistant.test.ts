import { describe, expect, it, vi } from "vitest";

const { invokeLLM } = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("./_core/llm", () => ({ invokeLLM }));

import { educationalAssistInput, runEducationalAssistant } from "./educationalAssistant";

describe("educational assistant contract", () => {
  it("accepts a bounded teacher question", () => {
    const result = educationalAssistInput.safeParse({ question: "اشرح الفكرة", subject: "العربية" });
    expect(result.success).toBe(true);
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

    const result = await runEducationalAssistant({ question: "اشرح", subject: "العربية" });
    expect(result.answer).toBe("الإجابة التعليمية");
    expect(result.teacherReviewRequired).toBe(true);
    expect(result.sources[0]?.kind).toBe("teacher_context");
  });

  it("fails closed when the model response is malformed", async () => {
    invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: "not-json" } }] });
    const result = await runEducationalAssistant({ question: "هل هذا مؤكد؟", subject: "الرياضيات" });
    expect(result.provenanceStatus).toBe("غير متحقق");
    expect(result.confidence).toBe("منخفض");
    expect(result.teacherReviewRequired).toBe(true);
  });
});
