import { isSupportedArabicSentence } from "./gate4bTeaching";
import type { CoreObjectType } from "./coreBoard";

export type RecognizedContentKind = "arabic-word" | "arabic-sentence" | "mathematics-equation" | "poetry-verse" | "generic-text" | "unknown";
export type RecognitionConfidence = "high" | "medium" | "low";
export type RecognitionResult = {
  kind: RecognizedContentKind;
  label: string;
  confidence: RecognitionConfidence;
  reason: string;
  recommendedObjectType?: CoreObjectType;
  actions: string[];
  safeMessage?: string;
};

const arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\s،؛؟!.؟ـ]+$/;
const arabicWordPattern = /^[\u0600-\u06FF\u0750-\u077F]+$/;
const equationPattern = /^(?:[0-9٠-٩\s()+\-*/.]|[xX])+=?(?:[0-9٠-٩\s()+\-*/.]|[xX])+$/;
const knownPoetry = new Set(["وإذا أتتك مذمتي من ناقص"]);
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean);

export const recognizeContent = (input: string): RecognitionResult => {
  const value = input.trim();
  if (!value) return { kind: "unknown", label: "محتوى غير محدد", confidence: "low", reason: "لم يُدخل المعلم محتوى بعد.", actions: [], safeMessage: "اكتب أو الصق محتوى لتظهر الإجراءات المناسبة." };
  if (equationPattern.test(value) && value.includes("=")) return { kind: "mathematics-equation", label: "معادلة رياضية", confidence: "high", reason: "يتضمن الإدخال مساواة ورمزًا جبريًا ضمن النمط المدعوم.", recommendedObjectType: "EquationObject", actions: ["حل", "خطوات", "تحقق", "شرح", "تدريب"] };
  if (knownPoetry.has(value)) return { kind: "poetry-verse", label: "نص شعري محتمل", confidence: "medium", reason: "يطابق مثالًا شعريًا محفوظًا للمراجعة الشكلية فقط.", recommendedObjectType: "TextObject", actions: ["شرح", "بلاغة", "أسلوب", "تدريب"], safeMessage: "التصنيف شعري محتمل؛ الوزن والنسبة والتحليل الأدبي تحتاج مراجعة المعلم." };
  if (arabicWordPattern.test(value) && words(value).length === 1) return { kind: "arabic-word", label: "كلمة عربية", confidence: "medium", reason: "الإدخال كلمة عربية مفردة.", recommendedObjectType: "TextObject", actions: ["خريطة الكلمة", "معنى", "سياق", "تدريب"], safeMessage: "خريطة الجذر والصرف غير متحققة لهذا الإدخال ما لم يثبتها مصدر." };
  if (arabicPattern.test(value) && words(value).length >= 2) return { kind: "arabic-sentence", label: "جملة عربية", confidence: isSupportedArabicSentence(value) ? "high" : "medium", reason: isSupportedArabicSentence(value) ? "هذا المثال موجود ضمن جمل التحليل المحدودة." : "يتكون الإدخال من كلمتين عربيتين أو أكثر، لكن التحليل التفصيلي غير مثبت لهذا النص.", recommendedObjectType: "SentenceObject", actions: ["تحليل", "إعراب", "شرح", "خريطة الجملة", "تدريب"], safeMessage: isSupportedArabicSentence(value) ? undefined : "يمكن حفظ الجملة، لكن لا يوجد تحليل لغوي مثبت لها حاليًا." };
  if (arabicPattern.test(value)) return { kind: "generic-text", label: "نص عربي", confidence: "low", reason: "النص عربي لكنه لا يطابق نوعًا محددًا في النطاق الحالي.", recommendedObjectType: "TextObject", actions: ["شرح", "تمييز", "تحويل إلى سؤال"], safeMessage: "كيف تريد استخدام هذا المحتوى؟ اختر إجراءً بسيطًا أو اتركه كنص." };
  return { kind: "generic-text", label: "نص عام", confidence: "low", reason: "لم يثبت التعرف على نوع تعليمي محدد.", recommendedObjectType: "TextObject", actions: ["شرح", "تمييز", "تحويل إلى سؤال"], safeMessage: "لم أتمكن من تحديد نوع المحتوى بثقة؛ لم تُنشأ نتيجة متخصصة." };
};

export const recognitionConfidenceLabel = (confidence: RecognitionConfidence) => confidence === "high" ? "ثقة مرتفعة" : confidence === "medium" ? "ثقة متوسطة" : "يحتاج إلى تحديد";
