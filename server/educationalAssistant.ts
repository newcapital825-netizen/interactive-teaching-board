import { z } from "zod";
import { invokeLLM } from "./_core/llm";

const sourceSchema = z.object({
  label: z.string(),
  kind: z.enum(["teacher_context", "provided_source", "none"]),
  note: z.string(),
});

export const educationalAssistInput = z.object({
  question: z.string().trim().min(1).max(2000),
  subject: z.string().trim().min(1).max(80).default("غير محدد"),
  level: z.string().trim().max(120).optional(),
  lessonContext: z.string().trim().max(2000).optional(),
  selectedContent: z.string().trim().max(4000).optional(),
  providedSource: z.string().trim().max(500).optional(),
});

export const educationalAssistOutput = z.object({
  answer: z.string(),
  explanation: z.string(),
  why: z.string(),
  confidence: z.enum(["مرتفع", "متوسط", "منخفض"]),
  provenanceStatus: z.enum(["معلومة من سياق المعلم", "استدلال يحتاج مراجعة", "غير متحقق"]),
  sources: z.array(sourceSchema).max(5),
  limitations: z.array(z.string()).max(5),
  teacherReviewRequired: z.boolean(),
});

export type EducationalAssistInput = z.infer<typeof educationalAssistInput>;
export type EducationalAssistOutput = z.infer<typeof educationalAssistOutput>;

const fallback = (reason: string): EducationalAssistOutput => ({
  answer: "لم أتمكن من التحقق من إجابة تعليمية آمنة الآن.",
  explanation: "لم تُعرض نتيجة غير موثوقة على أنها حقيقة.",
  why: reason,
  confidence: "منخفض",
  provenanceStatus: "غير متحقق",
  sources: [{ label: "لا يوجد مصدر متاح", kind: "none", note: "تحتاج الإجابة إلى مصدر أو مراجعة المعلم." }],
  limitations: ["المساعد لا يجلب منهجًا رسميًا تلقائيًا في هذه الجولة.", "تجب مراجعة الإجابة قبل عرضها على الطلاب."],
  teacherReviewRequired: true,
});

export async function runEducationalAssistant(input: EducationalAssistInput): Promise<EducationalAssistOutput> {
  const normalized = educationalAssistInput.parse(input);
  const context = [
    `المادة: ${normalized.subject}`,
    normalized.level ? `المستوى: ${normalized.level}` : "المستوى: غير محدد",
    normalized.lessonContext ? `سياق الدرس الذي أدخله المعلم: ${normalized.lessonContext}` : "لا يوجد سياق درس إضافي.",
    normalized.selectedContent ? `المحتوى المحدد من المعلم: ${normalized.selectedContent}` : "لا يوجد محتوى محدد.",
    normalized.providedSource ? `مصدر قدمه المعلم للمراجعة فقط: ${normalized.providedSource}` : "لا يوجد مصدر قدمه المعلم.",
  ].join("\n");

  try {
    const response = await invokeLLM({
      model: "claude-haiku-4-5",
      maxTokens: 1400,
      messages: [
        {
          role: "system",
          content: [
            "أنت مساعد تعليمي عربي داخل سبورة للمعلم، ولست مصدر حقيقة مستقلًا.",
            "أجب فقط ضمن السؤال والسياق المقدمين. لا تخترع مصادر أو منهجًا أو اقتباسًا أو تحليلًا غير متحقق.",
            "إذا لم توجد مصادر في السياق، اجعل sources قائمة بمصدر none فقط، واجعل provenanceStatus غير متحقق أو استدلال يحتاج مراجعة.",
            "المصدر الذي يكتبه المعلم ليس تحققًا خارجيًا؛ لا تصفه كمصدر موثوق، واستخدم teacher_context أو provided_source مع teacherReviewRequired=true.",
            "أظهر الإجابة والسبب والشرح والحدود بوضوح. اجعل teacherReviewRequired=true لأي استدلال أو نقص تحقق.",
            "لا تستخدم HTML ولا تعليمات تقنية للمستخدم. أخرج JSON مطابقًا للمخطط فقط.",
          ].join("\n"),
        },
        { role: "user", content: `${context}\n\nسؤال المعلم: ${normalized.question}` },
      ],
      responseFormat: {
        type: "json_schema",
        json_schema: {
          name: "educational_assistance",
          strict: true,
          schema: {
            type: "object",
            properties: {
              answer: { type: "string" },
              explanation: { type: "string" },
              why: { type: "string" },
              confidence: { type: "string", enum: ["مرتفع", "متوسط", "منخفض"] },
              provenanceStatus: { type: "string", enum: ["معلومة من سياق المعلم", "استدلال يحتاج مراجعة", "غير متحقق"] },
              sources: { type: "array", items: { type: "object", properties: { label: { type: "string" }, kind: { type: "string", enum: ["teacher_context", "provided_source", "none"] }, note: { type: "string" } }, required: ["label", "kind", "note"], additionalProperties: false } },
              limitations: { type: "array", items: { type: "string" } },
              teacherReviewRequired: { type: "boolean" },
            },
            required: ["answer", "explanation", "why", "confidence", "provenanceStatus", "sources", "limitations", "teacherReviewRequired"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    const text = typeof content === "string" ? content : "";
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(text);
    } catch (error) {
      console.warn("[EducationalAssistant] Invalid JSON response", error instanceof Error ? error.message : "unknown error");
      return fallback("وصلت استجابة لا تطابق عقد المساعد الآمن.");
    }
    const parsed = educationalAssistOutput.safeParse(parsedJson);
    if (!parsed.success) {
      console.warn("[EducationalAssistant] Schema validation failed", parsed.error.issues.map((issue) => issue.path.join(".")).join(","));
      return fallback("وصلت استجابة لا تطابق عقد المساعد الآمن.");
    }
    return parsed.data;
  } catch (error) {
    console.warn("[EducationalAssistant] Provider request failed", error instanceof Error ? error.message : "unknown error");
    return fallback("تعذر الوصول إلى خدمة المساعد التعليمية.");
  }
}
