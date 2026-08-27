/**
 * Gate 4B controlled vertical slice.
 * Domain reminder: this module composes the single Gate 3A EducationalObject,
 * registry, factory, capabilities, migration and adapter boundaries. It does
 * not define a second object, registry, assessment, or feedback model.
 */
import {
  type EducationalObject,
  EDUCATIONAL_OBJECT_SCHEMA_VERSION,
  nowIso,
} from "./educationalObjects";
import { createRegisteredEducationalObject } from "./objectRegistry";
import { createMathProblem, createMathStepSession, createSolutionSteps, deserializeMathStepSession, DETERMINISTIC_MATH_TIME, type MathStepSession } from "./mathStepSlice";

export type Subject = "arabic" | "mathematics";
export type FeedbackState = "correct" | "valid-alternative" | "partially-correct" | "incorrect" | "incomplete";
export type ArabicReviewState = "supported" | "unsupported" | "needs-review";
export type AssessmentDiagnostic = "answer-error" | "role-error" | "case-error" | "marker-error" | "reasoning-error" | "step-error" | "conceptual-error" | "procedural-error" | "alternative-solution" | "incomplete" | "unsupported-answer" | "ambiguous-answer" | "irrelevant-explanation" | "operation-error" | "arithmetic-error" | "sign-error" | "transformation-error" | "incomplete-step" | "invalid-step" | "unsupported-reasoning" | "correct-alternative" | "correct-step" | "verification-failure";
export type InteractionKind = "select" | "classify" | "enter" | "verify" | "solve";

export type SourceRange = { start: number; end: number };
export type Provenance = {
  sourceObjectId: string;
  sourceRange?: SourceRange;
  sourceVersion: number;
  derivationType: string;
  teacherApproved: boolean;
};

export type LensBase = {
  id: string;
  type: "GrammarLens" | "MathVisualizationLens";
  lensType: "I3rab" | "MathVisualization";
  subject: Subject;
  sourceObjectId: string;
  sourceRange?: SourceRange;
  sourceVersion: number;
  provenance: Provenance;
  revealAnswer: boolean;
  editable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ArabicWord = {
  id: string;
  text: string;
  start: number;
  end: number;
  grammaticalRole: "فعل" | "فاعل" | "مفعول به" | "مبتدأ" | "خبر" | "اسم مجرور" | "فعل ماضٍ" | "فعل مضارع" | "فعل أمر" | "نعت" | "مضاف إليه";
  caseMark: string;
  explanation: string;
};

export type GrammarLens = LensBase & {
  type: "GrammarLens";
  subject: "arabic";
  words: ArabicWord[];
  selectedWordId: string | null;
  disclosureLevel: 1 | 2 | 3 | 4 | 5;
  mode: "teacher" | "student";
};

export type MathPoint = { x: number; y: number; label?: string };
export type MathVisualizationLens = LensBase & {
  type: "MathVisualizationLens";
  subject: "mathematics";
  equation: string;
  operationSteps: Array<{ label: string; equation: string }>;
  points: MathPoint[];
  solutionX: number;
};

export type ActivityAnswer = string;
export type ArabicCase = "مرفوع" | "منصوب" | "مجرور" | "مبني";
export type I3rabField = "grammaticalRole" | "case" | "caseMarker" | "reason";
export type I3rabExpected = { grammaticalRole: ArabicWord["grammaticalRole"]; case: ArabicCase; caseMarker: string; reason: string };
export type I3rabResponse = { wordId: string; grammaticalRole?: string; case?: string; caseMarker?: string; reason?: string };
export type I3rabChallenge = { targetWordId: string; expected: I3rabExpected; response: I3rabResponse; acceptableAlternatives: Partial<Record<I3rabField, string[]>>; options: { roles: string[]; cases: string[]; markers: string[]; reasons: string[] } };
export type ActivityDefinition = {
  id: string;
  subject: Subject;
  prompt: string;
  interactionKind: InteractionKind;
  sourceObjectId: string;
  lensId: string;
  expectedAnswer: string;
  acceptedAnswers: string[];
  answer: ActivityAnswer;
  attemptCount: number;
  completionState: "incomplete" | "complete";
  assessmentId: string | null;
  feedbackId: string | null;
  i3rab?: I3rabChallenge;
  createdAt: string;
  updatedAt: string;
};

export type AssessmentEvent = {
  id: string;
  eventType: "system-assessment" | "teacher-override";
  assessmentId: string;
  state: FeedbackState;
  reason?: string;
  createdAt: string;
};

export type TeacherOverride = {
  id: string;
  assessmentId: string;
  state: FeedbackState;
  reason: string;
  note: string;
  createdAt: string;
  provenance: Provenance;
};

export type Assessment = {
  id: string;
  activityId: string;
  attemptId: string;
  answer: string;
  evaluation: FeedbackState;
  effectiveEvaluation: FeedbackState;
  score: number;
  maxScore: number;
  feedbackId: string;
  systemFeedbackId?: string;
  createdAt: string;
  provenance: Provenance;
  diagnostic: AssessmentDiagnostic;
  reviewState: ArabicReviewState;
  events: AssessmentEvent[];
  teacherOverride?: TeacherOverride;
};

export type Feedback = {
  id: string;
  assessmentId: string;
  state: FeedbackState;
  title: string;
  explanation: string;
  hint?: string;
  retryAllowed: boolean;
  teacherNote: string;
  nextStep?: string;
  misconception?: string;
  teacherOverride?: { state: FeedbackState; note: string };
  reviewState?: ArabicReviewState;
  createdAt: string;
};

export type JourneyState = {
  subject: Subject;
  source: EducationalObject;
  lens: GrammarLens | MathVisualizationLens;
  activity: ActivityDefinition;
  assessment: Assessment | null;
  feedback: Feedback | null;
  selectedStage: "create" | "lens" | "activity" | "presentation" | "feedback" | "restore";
  mathStepSession?: MathStepSession;
};

export const GATE4B_LESSON_PREVIOUS_VERSION = 1;
export const GATE4B_LESSON_SCHEMA_VERSION = 2;

export type Gate4BLesson = {
  schemaVersion: typeof GATE4B_LESSON_SCHEMA_VERSION;
  lessonId: string;
  title: string;
  arabic: JourneyState;
  mathematics: JourneyState;
  savedAt: string;
};

const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const normalize = (value: string) => value.trim().replace(/\s+/g, "").toLocaleLowerCase();
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const unsafeKeys = new Set(["__proto__", "constructor", "prototype"]);
const sanitize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !unsafeKeys.has(key)).map(([key, nested]) => [key, sanitize(nested)]));
};
const deterministicEventId = (assessmentId: string, eventType: string) => `${assessmentId}_${eventType.replace(/[^a-z-]/g, "-")}`;
const feedbackStates: FeedbackState[] = ["correct", "valid-alternative", "partially-correct", "incorrect", "incomplete"];
const diagnostics: AssessmentDiagnostic[] = ["answer-error", "role-error", "case-error", "marker-error", "reasoning-error", "step-error", "conceptual-error", "procedural-error", "alternative-solution", "incomplete", "unsupported-answer", "ambiguous-answer", "irrelevant-explanation"];
const isFeedbackState = (value: unknown): value is FeedbackState => typeof value === "string" && feedbackStates.includes(value as FeedbackState);
const readProvenance = (value: unknown): Provenance | null => {
  if (!isRecord(value) || typeof value.sourceObjectId !== "string" || typeof value.sourceVersion !== "number" || !Number.isFinite(value.sourceVersion) || typeof value.derivationType !== "string" || typeof value.teacherApproved !== "boolean") return null;
  const sourceRange = isRecord(value.sourceRange) && typeof value.sourceRange.start === "number" && typeof value.sourceRange.end === "number" ? { start: value.sourceRange.start, end: value.sourceRange.end } : undefined;
  return { sourceObjectId: value.sourceObjectId, sourceVersion: value.sourceVersion, derivationType: value.derivationType, teacherApproved: value.teacherApproved, ...(sourceRange ? { sourceRange } : {}) };
};
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
const isI3rabResponse = (value: unknown): value is I3rabResponse => isRecord(value) && typeof value.wordId === "string" && ["grammaticalRole", "case", "caseMarker", "reason"].every((field) => value[field] === undefined || typeof value[field] === "string");
const isI3rabChallenge = (value: unknown): value is I3rabChallenge => {
  if (!isRecord(value) || typeof value.targetWordId !== "string" || !isRecord(value.expected) || typeof value.expected.grammaticalRole !== "string" || typeof value.expected.case !== "string" || typeof value.expected.caseMarker !== "string" || typeof value.expected.reason !== "string" || !isI3rabResponse(value.response) || !isRecord(value.options)) return false;
  const alternatives = value.acceptableAlternatives === undefined || (isRecord(value.acceptableAlternatives) && Object.values(value.acceptableAlternatives).every((entry) => isStringArray(entry)));
  return alternatives && isStringArray(value.options.roles) && isStringArray(value.options.cases) && isStringArray(value.options.markers) && isStringArray(value.options.reasons);
};

type ArabicWordSpec = { grammaticalRole: ArabicWord["grammaticalRole"]; caseMark: string; explanation: string };
const controlledSentenceSpecs: Record<string, ArabicWordSpec[]> = {
  "كتبَ الطالبُ الدرسَ.": [
    { grammaticalRole: "فعل", caseMark: "مبني · الفتح", explanation: "يصف حدثًا وقع في الزمن الماضي." },
    { grammaticalRole: "فاعل", caseMark: "مرفوع · الضمة", explanation: "من قام بالفعل في الجملة." },
    { grammaticalRole: "مفعول به", caseMark: "منصوب · الفتحة", explanation: "ما وقع عليه الفعل." },
  ],
  "العلمُ نورٌ.": [
    { grammaticalRole: "مبتدأ", caseMark: "مرفوع · الضمة", explanation: "اسم تبدأ به الجملة الاسمية." },
    { grammaticalRole: "خبر", caseMark: "مرفوع · الضمة", explanation: "المعلومة التي تخبر عن المبتدأ." },
  ],
  "مررتُ بالبيتِ.": [
    { grammaticalRole: "فعل ماضٍ", caseMark: "مبني · الفتح", explanation: "يصف حدثًا وقع في الزمن الماضي." },
    { grammaticalRole: "اسم مجرور", caseMark: "مجرور · الكسرة", explanation: "سبقته الباء فجرته." },
  ],
  "قرأَ الطفلُ.": [
    { grammaticalRole: "فعل ماضٍ", caseMark: "مبني · الفتح", explanation: "يصف حدثًا وقع في الزمن الماضي." },
    { grammaticalRole: "فاعل", caseMark: "مرفوع · الضمة", explanation: "من قام بالفعل في الجملة." },
  ],
  "يكتبُ الطالبُ.": [
    { grammaticalRole: "فعل مضارع", caseMark: "مرفوع · الضمة", explanation: "يدل على حدث يقع في زمن الحال أو الاستقبال." },
    { grammaticalRole: "فاعل", caseMark: "مرفوع · الضمة", explanation: "من قام بالفعل في الجملة." },
  ],
  "اكتبْ الدرسَ.": [
    { grammaticalRole: "فعل أمر", caseMark: "مبني · السكون", explanation: "يدل على طلب وقوع الفعل." },
    { grammaticalRole: "مفعول به", caseMark: "منصوب · الفتحة", explanation: "ما وقع عليه الفعل." },
  ],
  "جاءَ الطالبُ المجتهدُ.": [
    { grammaticalRole: "فعل ماضٍ", caseMark: "مبني · الفتح", explanation: "يصف حدثًا وقع في الزمن الماضي." },
    { grammaticalRole: "فاعل", caseMark: "مرفوع · الضمة", explanation: "من قام بالفعل في الجملة." },
    { grammaticalRole: "نعت", caseMark: "مرفوع · الضمة", explanation: "صفة تتبع الاسم الذي قبلها في الإعراب." },
  ],
  "كتابُ الطالبِ جديدٌ.": [
    { grammaticalRole: "مبتدأ", caseMark: "مرفوع · الضمة", explanation: "اسم تبدأ به الجملة الاسمية." },
    { grammaticalRole: "مضاف إليه", caseMark: "مجرور · الكسرة", explanation: "جاء بعد اسم قبله في تركيب الإضافة." },
    { grammaticalRole: "خبر", caseMark: "مرفوع · الضمة", explanation: "المعلومة التي تخبر عن المبتدأ." },
  ],
};

export const supportedArabicSentences = Object.freeze(Object.keys(controlledSentenceSpecs));
export const isSupportedArabicSentence = (sentence: string) => supportedArabicSentences.includes(sentence.trim());

export type ArabicWordMap = { word: string; root: string; grammaticalType: string; number: string; gender: string; pattern: string; meaning: string; derivedForms: string[]; contextNote: string; provenance: string };
const controlledWordMaps: Record<string, ArabicWordMap> = {
  "المعلم": { word: "المعلم", root: "ع ل م", grammaticalType: "اسم فاعل معرّف بـ«ال»", number: "مفرد", gender: "مذكر", pattern: "مُفَعِّل", meaning: "من يعلّم أو يقدّم التعليم", derivedForms: ["معلّمون", "معلّمين", "معلّمة"], contextNote: "في سياق الدرس تشير الكلمة إلى الشخص الذي يقدّم التعليم.", provenance: "قاموس تعليمي محدود مضمّن للمثال؛ يحتاج التوسع إلى مصدر معجمي موثق" },
};
export const getSupportedArabicWordMap = (word: string) => controlledWordMaps[word.trim()];

const wordsForSentence = (sentence: string): ArabicWord[] => {
  const source = sentence.split(" ");
  let cursor = 0;
  const specs = controlledSentenceSpecs[sentence];
  return source.map((text, index) => {
    const start = cursor;
    cursor += text.length + 1;
    const spec = specs?.[index] ?? { grammaticalRole: index === 0 ? "فعل" : "فاعل", caseMark: "مرفوع · الضمة", explanation: "تمثيل نحوي مشتق من هذا المثال المحدد." };
    return { id: `word_${index + 1}`, text, start, end: start + text.length, ...spec };
  });
};

export const createArabicSource = (sentence = "كتبَ الطالبُ الدرسَ."): EducationalObject<"SentenceObject", string> =>
  createRegisteredEducationalObject("SentenceObject", sentence, 72, 110, id("sentence")) as EducationalObject<"SentenceObject", string>;

export const createMathSource = (equation = "2x + 3 = 11"): EducationalObject<"EquationObject", string> =>
  createRegisteredEducationalObject("EquationObject", equation, 72, 110, id("equation")) as EducationalObject<"EquationObject", string>;

export const createGrammarLens = (source: EducationalObject<"SentenceObject", string>, at = nowIso()): GrammarLens => ({
  id: id("grammar-lens"), type: "GrammarLens", lensType: "I3rab", subject: "arabic", sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version,
  provenance: { sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version, derivationType: "deterministic-grammar-lens", teacherApproved: false }, revealAnswer: false, editable: true,
  words: wordsForSentence(source.content), selectedWordId: null, disclosureLevel: 1, mode: "student", createdAt: at, updatedAt: at,
});

export const createMathVisualizationLens = (source: EducationalObject<"EquationObject", string>, at = nowIso()): MathVisualizationLens => {
  const supported = source.content === "2x + 3 = 11" || source.content === "2x + 5 = 15";
  if (!supported) return {
    id: id("math-lens"), type: "MathVisualizationLens", lensType: "MathVisualization", subject: "mathematics", sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version,
    provenance: { sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version, derivationType: "deterministic-equation-visualization", teacherApproved: false }, revealAnswer: false, editable: false,
    equation: source.content, operationSteps: [], points: [], solutionX: 0, createdAt: at, updatedAt: at,
  };
  const problem = createMathProblem(source, at);
  const steps = createSolutionSteps(problem);
  const solutionX = Number(problem.expectedAnswer.replace(/[^0-9.-]/g, ""));
  return {
    id: id("math-lens"), type: "MathVisualizationLens", lensType: "MathVisualization", subject: "mathematics", sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version,
    provenance: { sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version, derivationType: "deterministic-equation-visualization", teacherApproved: false }, revealAnswer: false, editable: false,
    equation: source.content, operationSteps: steps.map((step) => ({ label: step.operation, equation: step.expressionAfter })), points: [{ x: solutionX, y: 0, label: `الحل ${problem.expectedAnswer}` }], solutionX, createdAt: at, updatedAt: at,
  };
};

const i3rabForWord = (word: ArabicWord): I3rabExpected => {
  const [casePart, markerPart] = word.caseMark.split(" · ");
  const reasons: Partial<Record<ArabicWord["grammaticalRole"], string>> = { "فاعل": "لأنه فاعل", "مفعول به": "لأنه مفعول به", "مبتدأ": "لأنه مبتدأ", "خبر": "لأنه خبر", "اسم مجرور": "لأنه اسم مجرور", "فعل ماضٍ": "لأنه فعل ماضٍ", "فعل مضارع": "لأنه فعل مضارع", "فعل أمر": "لأنه فعل أمر", "نعت": "لأنه نعت", "مضاف إليه": "لأنه مضاف إليه", "فعل": "لأنه فعل" };
  return { grammaticalRole: word.grammaticalRole, case: (casePart === "مرفوع" || casePart === "منصوب" || casePart === "مجرور" || casePart === "مبني" ? casePart : "مرفوع"), caseMarker: markerPart ?? word.caseMark, reason: reasons[word.grammaticalRole] ?? "لأنه عنصر نحوي محدد" };
};
const alternativesForWord = (word: ArabicWord): Partial<Record<I3rabField, string[]>> => ({ caseMarker: word.caseMark.includes("الضمة") ? ["ضمة"] : word.caseMark.includes("الفتحة") ? ["فتحة"] : word.caseMark.includes("الكسرة") ? ["كسرة"] : word.caseMark.includes("السكون") ? ["سكون"] : [] });
const i3rabChallenge = (words: ArabicWord[], targetWordId = "word_2"): I3rabChallenge => { const target = words.find((word) => word.id === targetWordId) ?? words[1] ?? words[0];   return { targetWordId: target.id, expected: i3rabForWord(target), response: { wordId: target.id }, acceptableAlternatives: alternativesForWord(target), options: { roles: Array.from(new Set(words.map((word) => word.grammaticalRole))), cases: ["مرفوع", "منصوب", "مجرور", "مبني"], markers: ["الضمة", "الفتحة", "الكسرة", "السكون", "الفتح", "ضمة", "فتحة", "كسرة", "سكون", "فتح"], reasons: Array.from(new Set(words.map((word) => i3rabForWord(word).reason))) } }; };

export const updateI3rabTarget = (activity: ActivityDefinition, lens: GrammarLens, targetWordId: string): ActivityDefinition => {
  const word = lens.words.find((candidate) => candidate.id === targetWordId);
  if (!word || !activity.i3rab) return activity;
  const response: I3rabResponse = { wordId: targetWordId };
  return { ...activity, expectedAnswer: targetWordId, answer: JSON.stringify(response), i3rab: { ...activity.i3rab, targetWordId, expected: i3rabForWord(word), response, acceptableAlternatives: alternativesForWord(word) }, updatedAt: nowIso() };
};

export const updateI3rabField = (activity: ActivityDefinition, field: I3rabField, value: string): ActivityDefinition => {
  if (!activity.i3rab) return { ...activity, answer: value, updatedAt: nowIso() };
  const response = { ...activity.i3rab.response, [field]: value } as I3rabResponse;
  return { ...activity, answer: JSON.stringify(response), i3rab: { ...activity.i3rab, response }, updatedAt: nowIso() };
};

export const readI3rabResponse = (activity: ActivityDefinition): I3rabResponse => {
  if (!activity.i3rab) return { wordId: activity.answer };
  try { const parsed = JSON.parse(activity.answer) as I3rabResponse; return parsed && typeof parsed === "object" ? parsed : activity.i3rab.response; } catch { return activity.i3rab.response; }
};

export const createActivity = (subject: Subject, source: EducationalObject, lens: GrammarLens | MathVisualizationLens, at = nowIso()): ActivityDefinition => subject === "arabic" ? {
  id: id("activity"), subject, prompt: "أعرب الكلمة المحددة.", interactionKind: "classify", sourceObjectId: source.id, lensId: lens.id, expectedAnswer: "word_2", acceptedAnswers: ["word_2", "الطالبُ", "الطالب"], answer: JSON.stringify({ wordId: "word_2" }), attemptCount: 0, completionState: "incomplete", assessmentId: null, feedbackId: null, i3rab: i3rabChallenge((lens as GrammarLens).words), createdAt: at, updatedAt: at,
} : (() => {
  const equation = source.content;
  const config = equation === "2x + 5 = 15" ? { answer: "5", prompt: "حل المعادلة: 2x + 5 = 15" } : { answer: "4", prompt: "حل المعادلة: 2x + 3 = 11" };
  return { id: id("activity"), subject, prompt: config.prompt, interactionKind: "solve", sourceObjectId: source.id, lensId: lens.id, expectedAnswer: config.answer, acceptedAnswers: [config.answer], answer: "", attemptCount: 0, completionState: "incomplete", assessmentId: null, feedbackId: null, createdAt: at, updatedAt: at };
})();

export const evaluateAnswer = (activity: ActivityDefinition, answer: string): { state: FeedbackState; score: number; diagnostic?: AssessmentDiagnostic; reviewState?: ArabicReviewState } => {
  if (activity.subject === "arabic" && activity.i3rab) {
    const challenge = activity.i3rab;
    const submitted = normalize(answer);
    if (!submitted) return { state: "incomplete", score: 0, diagnostic: "incomplete" };
    if (!answer.trim().startsWith("{") && activity.acceptedAnswers.some((candidate) => normalize(candidate) === submitted)) return { state: "correct", score: 1 };
    if (!answer.trim().startsWith("{")) {
      if (submitted === "word_1" || submitted === "word_3" || submitted.includes("فعل") || submitted.includes("مفعول")) return { state: "partially-correct", score: 0.5, diagnostic: "role-error" };
      return { state: "incorrect", score: 0, diagnostic: "answer-error" };
    }
    let parsedResponse: unknown;
    try { parsedResponse = JSON.parse(answer); } catch { return { state: "incorrect", score: 0, diagnostic: "unsupported-answer", reviewState: "needs-review" }; }
    if (!isI3rabResponse(parsedResponse)) return { state: "incorrect", score: 0, diagnostic: "unsupported-answer", reviewState: "needs-review" };
    const response = parsedResponse;
    const unsupportedField = (response.grammaticalRole && !challenge.options.roles.includes(response.grammaticalRole)) || (response.case && !challenge.options.cases.includes(response.case)) || (response.caseMarker && !challenge.options.markers.includes(response.caseMarker) && !(challenge.acceptableAlternatives.caseMarker ?? []).includes(response.caseMarker)) || (response.reason && !challenge.options.reasons.includes(response.reason) && !(challenge.acceptableAlternatives.reason ?? []).includes(response.reason));
    if (unsupportedField) return { state: "incorrect", score: 0, diagnostic: "unsupported-answer", reviewState: "unsupported" };
    const expected = challenge.expected;
    const normalizedMarker = normalize(response.caseMarker ?? "").replace(/^ال/, "");
    const normalizedExpectedMarker = normalize(expected.caseMarker).replace(/^ال/, "");
    const matches = {
      wordId: response.wordId === activity.i3rab.targetWordId,
      grammaticalRole: normalize(response.grammaticalRole ?? "") === normalize(expected.grammaticalRole) || ((activity.i3rab.acceptableAlternatives ?? {}).grammaticalRole ?? []).some((value) => normalize(value) === normalize(response.grammaticalRole ?? "")),
      case: normalize(response.case ?? "") === normalize(expected.case) || ((activity.i3rab.acceptableAlternatives ?? {}).case ?? []).some((value) => normalize(value) === normalize(response.case ?? "")),
      caseMarker: normalizedMarker === normalizedExpectedMarker || ((activity.i3rab.acceptableAlternatives ?? {}).caseMarker ?? []).some((value) => normalize(value).replace(/^ال/, "") === normalizedMarker),
      reason: normalize(response.reason ?? "") === normalize(expected.reason) || ((activity.i3rab.acceptableAlternatives ?? {}).reason ?? []).some((value) => normalize(value) === normalize(response.reason ?? "")),
    };
    const totalMatches = Object.values(matches).filter(Boolean).length;
    if (!response.wordId || totalMatches === 0) return { state: "incomplete", score: 0, diagnostic: "incomplete" };
    const usedAlternative = (Object.keys(matches) as Array<keyof typeof matches>).some((field) => matches[field] && normalize((response as Record<string, string | undefined>)[field] ?? "") !== normalize((expected as Record<string, string>)[field] ?? "") && ((challenge.acceptableAlternatives ?? {})[field as I3rabField] ?? []).some((value) => normalize(value).replace(/^ال/, "") === normalize((response as Record<string, string | undefined>)[field] ?? "").replace(/^ال/, "")));
    if (totalMatches === 5 && usedAlternative) return { state: "valid-alternative", score: 1, diagnostic: "alternative-solution" };
    if (totalMatches === 5) return { state: "correct", score: 1 };
    const diagnostic: AssessmentDiagnostic = !matches.wordId ? "answer-error" : !matches.grammaticalRole ? "role-error" : !matches.case ? "case-error" : !matches.caseMarker ? "marker-error" : "reasoning-error";
    return { state: totalMatches > 0 ? "partially-correct" : "incorrect", score: totalMatches > 0 ? totalMatches / 5 : 0, diagnostic };
  }
  const submitted = normalize(answer);
  if (!submitted) return { state: "incomplete", score: 0, diagnostic: "incomplete" };
  if (activity.acceptedAnswers.some((candidate) => normalize(candidate) === submitted)) return { state: "correct", score: 1 };
  if (activity.subject === "mathematics") {
    const expected = normalize(activity.expectedAnswer);
    const equivalent = `x=${expected}`;
    const intermediate = expected === "5" ? "10" : "8";
    if (submitted === equivalent || submitted === `${expected}=x`) return { state: "valid-alternative", score: 1, diagnostic: "alternative-solution" };
    if (submitted === intermediate || submitted.includes("2")) return { state: "partially-correct", score: 0.5, diagnostic: "step-error" };
  }
  return { state: "incorrect", score: 0, diagnostic: "answer-error" };
};

export const createFeedback = (assessment: Assessment, activity: ActivityDefinition): Feedback => {
  const state = assessment.effectiveEvaluation ?? assessment.evaluation;
  const common = { id: id("feedback"), assessmentId: assessment.id, state, reviewState: assessment.reviewState, retryAllowed: !["correct", "valid-alternative"].includes(state), teacherNote: activity.subject === "arabic" ? "تذكير للمعلم: الفاعل هو من قام بالفعل." : "تذكير للمعلم: حافظ على تكافؤ الطرفين في كل خطوة.", createdAt: nowIso() };
  if (assessment.reviewState !== "supported") return { ...common, title: "تحتاج مراجعة المعلم", explanation: "هذه الصيغة خارج الحالات المثبتة في مجموعة الأمثلة الحالية، لذلك لم تُقبل تلقائيًا كإجابة صحيحة.", hint: "ارجع إلى النص وحدد الحقل الذي يحتاج دليلًا.", nextStep: "افحص الإجابة ثم قرر قبولها أو تعديلها يدويًا." };
  const mathSubtraction = activity.expectedAnswer === "5" ? "5" : "3";
  const mathIntermediate = activity.expectedAnswer === "5" ? "10" : "8";
  const mathAnswer = activity.expectedAnswer;
  if (state === "correct") return { ...common, title: "إجابة صحيحة", explanation: activity.subject === "arabic" ? "أحسنت؛ الطالبُ هو الفاعل لأنه قام بالقراءة." : `أحسنت؛ بعد طرح ${mathSubtraction} ثم القسمة على 2، يكون x = ${mathAnswer}.` };
  if (state === "valid-alternative") return { ...common, title: "إجابة صحيحة بصيغة مقبولة", explanation: activity.subject === "arabic" ? "استخدمت صيغة مقبولة للعلامة الإعرابية ضمن هذا المثال المحدد." : `أثبتت الصيغة x = ${mathAnswer} القيمة نفسها؛ نحتفظ بها كطريقة تعبير صحيحة.`, hint: activity.subject === "arabic" ? "قارن العلامة بالصيغة المعروضة في العدسة." : "يمكنك الآن التحقق بالتعويض.", nextStep: activity.subject === "arabic" ? "راجع سبب الرفع ثم اعتمد الصيغة المناسبة." : "تحقق من الحل بالتعويض في المعادلة." };
  if (state === "incomplete") return { ...common, title: "لم تُرسل إجابة بعد", explanation: activity.subject === "arabic" ? "اختر كلمة من الجملة لتحديد الفاعل." : "اكتب قيمة x أو صيغة حل واضحة قبل الإرسال.", hint: activity.subject === "arabic" ? "ابدأ بالسؤال: من قام بالفعل؟" : `ابدأ بطرح ${mathSubtraction} من الطرفين.`, nextStep: "أكمل الحقل أو الاختيار ثم أرسل المحاولة." };
  if (state === "partially-correct") return { ...common, title: "إجابة جزئية", explanation: activity.subject === "arabic" ? "بدأت من اتجاه صحيح، لكن اختر الكلمة التي تؤدي الفعل لا وصف الفعل أو المفعول به." : `الخطوة الوسطى قريبة؛ بعد طرح ${mathSubtraction} يصبح الطرف الأيسر 2x والطرف الأيمن ${mathIntermediate}.`, hint: activity.subject === "arabic" ? "اسأل: من قام بالفعل؟" : "نفّذ العملية نفسها على الطرفين.", nextStep: activity.subject === "arabic" ? "اربط السؤال بمن قام بالفعل." : "راجع الخطوة الأولى قبل متابعة الحل." };
  return { ...common, title: "لنحاول مرة أخرى", explanation: activity.subject === "arabic" ? "الإجابة ليست الفاعل. اقرأ الجملة واسأل: من قام بالفعل؟" : `ابدأ بطرح ${mathSubtraction} من الطرفين، ثم اقسم الناتج على 2.`, hint: activity.subject === "arabic" ? "الكلمة الثانية هي المرشح الصحيح." : `بعد طرح ${mathSubtraction}: 2x = ${mathIntermediate}.`, nextStep: activity.subject === "arabic" ? "أعد قراءة الجملة وحدد صاحب الفعل." : `نفّذ طرح ${mathSubtraction} على الطرفين أولًا.` };
};

export const assessActivity = (activity: ActivityDefinition, answer: string, provenance: Provenance, at = nowIso()): { activity: ActivityDefinition; assessment: Assessment; feedback: Feedback } => {
  const result = evaluateAnswer(activity, answer);
  const assessmentId = id("assessment");
  const nextActivity: ActivityDefinition = { ...activity, answer, attemptCount: activity.attemptCount + 1, completionState: ["correct", "valid-alternative"].includes(result.state) ? "complete" : "incomplete", assessmentId, feedbackId: null, updatedAt: at };
  const diagnostic: AssessmentDiagnostic = result.diagnostic ?? (result.state === "valid-alternative" ? "alternative-solution" : result.state === "incomplete" ? "incomplete" : result.state === "partially-correct" ? (activity.subject === "mathematics" ? "step-error" : "conceptual-error") : result.state === "incorrect" ? "answer-error" : "procedural-error");
  const assessment: Assessment = { id: assessmentId, activityId: activity.id, attemptId: id("attempt"), answer, evaluation: result.state, effectiveEvaluation: result.state, score: result.score, maxScore: 1, feedbackId: "pending", createdAt: at, provenance: clone(provenance), diagnostic, reviewState: result.reviewState ?? (activity.subject === "arabic" ? "supported" : "supported"), events: [{ id: id("assessment-event"), eventType: "system-assessment", assessmentId, state: result.state, createdAt: at }] };
  const feedback = createFeedback(assessment, nextActivity);
  return { activity: { ...nextActivity, feedbackId: feedback.id }, assessment: { ...assessment, feedbackId: feedback.id }, feedback };
};

export const applyTeacherOverride = (assessment: Assessment, activity: ActivityDefinition, state: FeedbackState, reason: string, note: string, provenance: Provenance, at = nowIso()): { assessment: Assessment; feedback: Feedback } => {
  if (!reason.trim() || !note.trim()) throw new Error("Teacher override requires a reason and note");
  const override: TeacherOverride = { id: id("teacher-override"), assessmentId: assessment.id, state, reason: reason.trim(), note: note.trim(), createdAt: at, provenance: clone(provenance) };
  const nextAssessment: Assessment = { ...assessment, effectiveEvaluation: state, teacherOverride: override, events: [...assessment.events, { id: id("assessment-event"), eventType: "teacher-override", assessmentId: assessment.id, state, reason, createdAt: at }] };
  const feedback = createFeedback(nextAssessment, activity);
  return { assessment: { ...nextAssessment, systemFeedbackId: assessment.feedbackId, feedbackId: feedback.id }, feedback: { ...feedback, teacherOverride: { state, note } } };
};

export const createJourney = (subject: Subject): JourneyState => {
  if (subject === "arabic") {
    const source = createArabicSource();
    const lens = createGrammarLens(source);
    return { subject, source, lens, activity: createActivity(subject, source, lens), assessment: null, feedback: null, selectedStage: "create" };
  }
  const source = createMathSource();
  const lens = createMathVisualizationLens(source);
  return { subject, source, lens, activity: createActivity(subject, source, lens), assessment: null, feedback: null, selectedStage: "create", mathStepSession: createMathStepSession(source) };
};

export const createLesson = (): Gate4BLesson => ({ schemaVersion: GATE4B_LESSON_SCHEMA_VERSION, lessonId: id("lesson"), title: "درس تطبيقي — من الإنشاء إلى التغذية الراجعة", arabic: createJourney("arabic"), mathematics: createJourney("mathematics"), savedAt: nowIso() });

export const serializeLesson = (lesson: Gate4BLesson): string => JSON.stringify({ ...clone(lesson), schemaVersion: GATE4B_LESSON_SCHEMA_VERSION, savedAt: nowIso() });

const migrateAssessment = (raw: unknown): Assessment | null => {
  if (!isRecord(raw) || typeof raw.id !== "string" || typeof raw.activityId !== "string" || typeof raw.answer !== "string") return null;
  if (!isFeedbackState(raw.evaluation)) return null;
  const provenance = readProvenance(raw.provenance);
  if (!provenance) return null;
  const evaluation = raw.evaluation;
  const effectiveEvaluation = raw.effectiveEvaluation === undefined ? evaluation : isFeedbackState(raw.effectiveEvaluation) ? raw.effectiveEvaluation : null;
  if (!effectiveEvaluation) return null;
  const diagnostic = diagnostics.includes(raw.diagnostic as AssessmentDiagnostic) ? raw.diagnostic as AssessmentDiagnostic : evaluation === "valid-alternative" ? "alternative-solution" : evaluation === "incomplete" ? "incomplete" : "answer-error";
  const rawEvents = Array.isArray(raw.events) ? raw.events : [];
  const events = rawEvents.filter((event): event is Record<string, unknown> => isRecord(event) && typeof event.id === "string" && event.assessmentId === raw.id && (event.eventType === "system-assessment" || event.eventType === "teacher-override") && isFeedbackState(event.state)).map((event) => ({ id: event.id as string, eventType: event.eventType as AssessmentEvent["eventType"], assessmentId: raw.id as string, state: event.state as FeedbackState, ...(typeof event.reason === "string" ? { reason: event.reason } : {}), createdAt: typeof event.createdAt === "string" ? event.createdAt : "" }));
  const normalizedEvents = events.some((event) => event.eventType === "system-assessment") ? events : [{ id: deterministicEventId(raw.id, "system-assessment"), eventType: "system-assessment" as const, assessmentId: raw.id, state: evaluation, createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "" }, ...events];
  let teacherOverride: TeacherOverride | undefined;
  if (raw.teacherOverride !== undefined) {
    if (!isRecord(raw.teacherOverride) || typeof raw.teacherOverride.id !== "string" || raw.teacherOverride.assessmentId !== raw.id || !isFeedbackState(raw.teacherOverride.state) || typeof raw.teacherOverride.reason !== "string" || typeof raw.teacherOverride.note !== "string") return null;
    const overrideProvenance = readProvenance(raw.teacherOverride.provenance);
    if (!overrideProvenance) return null;
    teacherOverride = { id: raw.teacherOverride.id, assessmentId: raw.id, state: raw.teacherOverride.state, reason: raw.teacherOverride.reason, note: raw.teacherOverride.note, createdAt: typeof raw.teacherOverride.createdAt === "string" ? raw.teacherOverride.createdAt : "", provenance: overrideProvenance };
  }
  const finalEvents = teacherOverride && !normalizedEvents.some((event) => event.eventType === "teacher-override")
    ? [...normalizedEvents, { id: teacherOverride.id, eventType: "teacher-override" as const, assessmentId: raw.id, state: teacherOverride.state, reason: teacherOverride.reason, createdAt: teacherOverride.createdAt }]
    : normalizedEvents;
  return { ...raw, effectiveEvaluation, events: finalEvents, diagnostic, reviewState: raw.reviewState === "unsupported" || raw.reviewState === "needs-review" || raw.reviewState === "supported" ? raw.reviewState : "needs-review", provenance, teacherOverride, feedbackId: typeof raw.feedbackId === "string" ? raw.feedbackId : "", systemFeedbackId: typeof raw.systemFeedbackId === "string" ? raw.systemFeedbackId : undefined, score: typeof raw.score === "number" && Number.isFinite(raw.score) ? raw.score : 0, maxScore: typeof raw.maxScore === "number" && Number.isFinite(raw.maxScore) ? raw.maxScore : 1, attemptId: typeof raw.attemptId === "string" ? raw.attemptId : deterministicEventId(raw.id, "attempt") } as Assessment;
};

const migrateFeedback = (raw: unknown, assessmentId: string): Feedback | null => {
  if (!isRecord(raw) || typeof raw.id !== "string" || raw.assessmentId !== assessmentId || !isFeedbackState(raw.state) || typeof raw.title !== "string" || typeof raw.explanation !== "string" || typeof raw.retryAllowed !== "boolean" || typeof raw.teacherNote !== "string") return null;
  if (raw.teacherOverride !== undefined && (!isRecord(raw.teacherOverride) || !isFeedbackState(raw.teacherOverride.state) || typeof raw.teacherOverride.note !== "string")) return null;
  return { ...raw, state: raw.state, assessmentId, retryAllowed: raw.retryAllowed, createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "" } as Feedback;
};

const migrateJourney = (raw: unknown): JourneyState | null => {
  if (!isRecord(raw) || (raw.subject !== "arabic" && raw.subject !== "mathematics") || !isRecord(raw.source) || typeof raw.source.id !== "string" || !isRecord(raw.lens) || typeof raw.lens.id !== "string" || !isRecord(raw.activity) || typeof raw.activity.id !== "string") return null;
  if (raw.subject === "arabic" && raw.activity.i3rab !== undefined && !isI3rabChallenge(raw.activity.i3rab)) return null;
  const legacyWords = raw.subject === "arabic" && Array.isArray(raw.lens.words) && raw.lens.words.every((word) => isRecord(word) && typeof word.id === "string" && typeof word.text === "string" && typeof word.start === "number" && typeof word.end === "number" && typeof word.grammaticalRole === "string" && typeof word.caseMark === "string" && typeof word.explanation === "string") ? raw.lens.words as ArabicWord[] : null;
  const activity = raw.subject === "arabic" && raw.activity.i3rab === undefined && legacyWords ? { ...raw.activity, i3rab: i3rabChallenge(legacyWords) } : raw.activity;
  const lens = raw.subject === "arabic" ? { ...raw.lens, disclosureLevel: raw.lens.disclosureLevel === 2 || raw.lens.disclosureLevel === 3 || raw.lens.disclosureLevel === 4 || raw.lens.disclosureLevel === 5 ? raw.lens.disclosureLevel : 1, mode: raw.lens.mode === "teacher" ? "teacher" : "student" } : raw.lens;
  let mathStepSession: MathStepSession | undefined;
  if (raw.subject === "mathematics") {
    try {
      mathStepSession = raw.mathStepSession ? deserializeMathStepSession(raw.mathStepSession) ?? undefined : createMathStepSession(raw.source as EducationalObject<"EquationObject", string>, DETERMINISTIC_MATH_TIME);
    } catch {
      return null;
    }
    if (!mathStepSession) return null;
  }
  const assessment = raw.assessment ? migrateAssessment(raw.assessment) : null;
  if (raw.assessment && !assessment) return null;
  const feedback = raw.feedback ? migrateFeedback(raw.feedback, assessment?.id ?? "") : null;
  if (raw.feedback && !feedback) return null;
  if (assessment && feedback?.assessmentId !== assessment.id) return null;
  return { ...raw, lens, activity, assessment, feedback, ...(mathStepSession ? { mathStepSession } : {}) } as JourneyState;
};

export const migrateLesson = (raw: unknown): Gate4BLesson | null => {
  const safe = sanitize(raw);
  if (!isRecord(safe) || typeof safe.lessonId !== "string" || typeof safe.title !== "string") return null;
  if (safe.schemaVersion !== GATE4B_LESSON_PREVIOUS_VERSION && safe.schemaVersion !== GATE4B_LESSON_SCHEMA_VERSION) return null;
  const arabic = migrateJourney(safe.arabic);
  const mathematics = migrateJourney(safe.mathematics);
  if (!arabic || !mathematics) return null;
  return { ...safe, schemaVersion: GATE4B_LESSON_SCHEMA_VERSION, arabic, mathematics, savedAt: typeof safe.savedAt === "string" ? safe.savedAt : nowIso() } as Gate4BLesson;
};

export const deserializeLesson = (raw: string): Gate4BLesson | null => {
  try { return migrateLesson(JSON.parse(raw)); } catch { return null; }
};

export const updateLensSelection = (lens: GrammarLens, wordId: string): GrammarLens => ({ ...lens, selectedWordId: wordId, updatedAt: nowIso() });
export const advanceDisclosure = (lens: GrammarLens, mode: GrammarLens["mode"] = lens.mode): GrammarLens => { const nextLevel = mode === "teacher" ? 5 : (lens.disclosureLevel % 5 + 1) as GrammarLens["disclosureLevel"]; return { ...lens, mode, disclosureLevel: nextLevel, revealAnswer: nextLevel === 5, updatedAt: nowIso() }; };
export const toggleLensAnswer = <T extends GrammarLens | MathVisualizationLens>(lens: T): T => ({ ...lens, revealAnswer: !lens.revealAnswer, updatedAt: nowIso() });
