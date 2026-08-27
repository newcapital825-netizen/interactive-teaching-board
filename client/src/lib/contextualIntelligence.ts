import { createObject, type CoreObject } from "./coreBoard";
import { createArabicSource, createGrammarLens, getSupportedArabicWordMap } from "./gate4bTeaching";
import { getMathToolkitFixture, regenerateMathToolkitLens } from "./mathToolkit";
import { analyzePoetry } from "./poetryToolkit";
import { recognizeContent, recognitionConfidenceLabel } from "./contentRecognition";

export type IntelligenceAction = "analyze" | "word-map" | "explain" | "visualize" | "example";
export type IntelligenceStatus = "supported" | "uncertain" | "not-applicable";
export type ContextualIntelligenceResult = {
  status: IntelligenceStatus;
  title: string;
  summary: string;
  details: string[];
  confidence: string;
  provenanceLabel: string;
  safeMessage?: string;
  createdObject?: CoreObject;
};

const resultObject = (type: "WordObject" | "I3rabObject" | "ExplanationObject" | "SolutionStepsObject" | "PoetryObject", source: CoreObject, title: string, summary: string, details: string[], confidence: string, provenanceLabel: string) => {
  const content = { title, summary, details, sourceObjectId: source.id, sourceVersion: source.metadata.version, provenanceLabel, teacherApproved: false, confidence };
  const object = createObject(type, content, source.position.x + 28, source.position.y + source.size.height + 28);
  object.metadata = { ...object.metadata, sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, teacherReviewRequired: true, resultKind: type };
  object.source = { kind: "teacher", reference: `derived:${source.id}:v${source.metadata.version}` };
  return object;
};

const unsupported = (message: string, confidence = "يحتاج إلى تحديد"): ContextualIntelligenceResult => ({ status: "uncertain", title: "نتيجة تحتاج مراجعة", summary: message, details: [], confidence, provenanceLabel: "مصدر المعلم فقط؛ لم يثبت تحليل متخصص", safeMessage: message });

export const createContextualIntelligenceResult = (source: CoreObject, action: IntelligenceAction): ContextualIntelligenceResult => {
  const recognition = recognizeContent(source.content);
  if (source.type === "SentenceObject" || recognition.kind === "arabic-sentence") {
    if (recognition.confidence !== "high") return unsupported("يمكن حفظ الجملة، لكن لا يوجد تحليل لغوي مثبت لهذا النص حاليًا.", recognitionConfidenceLabel(recognition.confidence));
    const canonical = createArabicSource(source.content);
    const lens = createGrammarLens({ ...canonical, id: source.id, content: source.content, version: source.metadata.version });
    const details = lens.words.map((word) => `${word.text}: ${word.grammaticalRole} · ${word.caseMark} — ${word.explanation}`);
    if (action === "analyze") return { status: "supported", title: "تحليل الجملة", summary: "تظهر بنية الجملة وأدوار كلماتها من المثال المثبت.", details, confidence: "ثقة مرتفعة ضمن المثال", provenanceLabel: "تحليل حتمي من نص المعلم", createdObject: resultObject("I3rabObject", source, "إعراب الجملة", details.join("\n"), details, "ثقة مرتفعة ضمن المثال", "تحليل حتمي من نص المعلم") };
    if (action === "explain") { const selected = lens.words[1] ?? lens.words[0]; const explanation = selected ? `${selected.text} هو ${selected.grammaticalRole}؛ ${selected.explanation}` : "يعرض هذا المثال العلاقة بين الكلمات كما هي مثبتة."; return { status: "supported", title: "شرح الجملة", summary: explanation, details: ["لماذا؟ لأن الشرح مشتق من دور الكلمة في هذا المثال.", ...details], confidence: "ثقة مرتفعة ضمن المثال", provenanceLabel: "شرح مشتق من تحليل حتمي", createdObject: resultObject("ExplanationObject", source, "شرح الجملة", explanation, ["لماذا؟ لأن الشرح مشتق من دور الكلمة في هذا المثال.", ...details], "ثقة مرتفعة ضمن المثال", "شرح مشتق من تحليل حتمي") }; }
    if (action === "example") return { status: "supported", title: "مثال من الجملة", summary: "استخدم الكلمة المحددة لتدريب موجّه.", details, confidence: "ثقة مرتفعة ضمن المثال", provenanceLabel: "مثال مشتق من نص المعلم", createdObject: resultObject("WordObject", source, "كلمات الجملة", details.join("\n"), details, "ثقة مرتفعة ضمن المثال", "مثال مشتق من نص المعلم") };
    return unsupported("لا يوجد عرض بصري متخصص مثبت لهذا الإجراء في الجملة الحالية.");
  }
  if (source.type === "EquationObject" || recognition.kind === "mathematics-equation") {
    const fixture = getMathToolkitFixture(source.content);
    if (!fixture || fixture.equation !== source.content) return unsupported("لم أجد معادلة مثبتة مطابقة لهذا الإدخال؛ لم أُنشئ خطوات تخمينية.");
    const lens = regenerateMathToolkitLens(fixture);
    const details = fixture.steps.map((step) => `${step.operation}: ${step.after} — ${step.reason}`);
    if (action === "analyze" || action === "visualize") return { status: "supported", title: "خطوات الحل", summary: `الحل المحدد: ${fixture.expectedAnswer}`, details: [fixture.equation, ...details], confidence: "ثقة مرتفعة ضمن المثال", provenanceLabel: "حساب حتمي من مثال رياضي مثبت", createdObject: resultObject("SolutionStepsObject", source, "خطوات الحل", `الحل المحدد: ${fixture.expectedAnswer}`, [fixture.equation, ...details, `النقطة البصرية: x = ${lens.plottedPoint.x}`], "ثقة مرتفعة ضمن المثال", "حساب حتمي من مثال رياضي مثبت") };
    if (action === "explain") return { status: "supported", title: "شرح الحل", summary: "نطبق العملية نفسها على طرفي المعادلة في كل خطوة.", details, confidence: "ثقة مرتفعة ضمن المثال", provenanceLabel: "شرح مشتق من خطوات حتمية", createdObject: resultObject("ExplanationObject", source, "شرح المعادلة", "نطبق العملية نفسها على طرفي المعادلة في كل خطوة.", details, "ثقة مرتفعة ضمن المثال", "شرح مشتق من خطوات حتمية") };
    return unsupported("لا يوجد مثال إضافي مثبت لهذه المعادلة حاليًا.");
  }
  if (recognition.kind === "poetry-verse") {
    const analysis = analyzePoetry(source.content);
    const details = [`${analysis.lineCount} أسطر`, `${analysis.wordCount} كلمات`, `${analysis.characterCount} حرفًا`, `الوزن: ${analysis.meterStatus}`, `التحليل الأدبي: ${analysis.literaryStatus}`];
    return { status: "uncertain", title: "قراءة شعرية أولية", summary: "قياسات شكلية فقط؛ لا يوجد ادعاء بالوزن أو النسبة.", details, confidence: "يحتاج إلى مراجعة المعلم", provenanceLabel: analysis.provenance, safeMessage: "النص الشعري محتمل، لكن الوزن والتحليل الأدبي يحتاجان إلى مراجعة المعلم.", createdObject: resultObject("PoetryObject", source, "تحليل شعري أولي", "قياسات شكلية فقط؛ لا يوجد ادعاء بالوزن أو النسبة.", details, "يحتاج إلى مراجعة المعلم", analysis.provenance) };
  }
  if (recognition.kind === "arabic-word") {
    const wordMap = getSupportedArabicWordMap(source.content);
    if (action === "word-map" && wordMap) {
      const details = [`الجذر: ${wordMap.root}`, `النوع: ${wordMap.grammaticalType}`, `${wordMap.number} · ${wordMap.gender}`, `الوزن الصرفي: ${wordMap.pattern}`, `المعنى: ${wordMap.meaning}`, `المشتقات: ${wordMap.derivedForms.join("، ")}`, wordMap.contextNote];
      return { status: "supported", title: "خريطة الكلمة", summary: wordMap.meaning, details, confidence: "ثقة متوسطة ضمن المثال", provenanceLabel: wordMap.provenance, createdObject: resultObject("WordObject", source, "خريطة الكلمة", wordMap.meaning, details, "ثقة متوسطة ضمن المثال", wordMap.provenance) };
    }
    return unsupported("خريطة الجذر والصرف غير متحققة لهذا الإدخال؛ لم تُنشأ معلومات تخمينية.", recognitionConfidenceLabel(recognition.confidence));
  }
  return { status: "not-applicable", title: "استخدام المحتوى", summary: "لم يثبت التعرف على نوع تعليمي متخصص.", details: [], confidence: recognitionConfidenceLabel(recognition.confidence), provenanceLabel: "مصدر المعلم", safeMessage: recognition.safeMessage ?? "كيف تريد استخدام هذا المحتوى؟" };
};
