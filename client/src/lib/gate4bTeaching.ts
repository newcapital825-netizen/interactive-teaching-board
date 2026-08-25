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

export type Subject = "arabic" | "mathematics";
export type FeedbackState = "correct" | "valid-alternative" | "partially-correct" | "incorrect" | "incomplete";
export type AssessmentDiagnostic = "answer-error" | "step-error" | "conceptual-error" | "procedural-error" | "alternative-solution" | "incomplete";
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
  grammaticalRole: "فعل" | "فاعل" | "مفعول به";
  caseMark: string;
  explanation: string;
};

export type GrammarLens = LensBase & {
  type: "GrammarLens";
  subject: "arabic";
  words: ArabicWord[];
  selectedWordId: string | null;
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
const diagnostics: AssessmentDiagnostic[] = ["answer-error", "step-error", "conceptual-error", "procedural-error", "alternative-solution", "incomplete"];
const isFeedbackState = (value: unknown): value is FeedbackState => typeof value === "string" && feedbackStates.includes(value as FeedbackState);
const readProvenance = (value: unknown): Provenance | null => {
  if (!isRecord(value) || typeof value.sourceObjectId !== "string" || typeof value.sourceVersion !== "number" || !Number.isFinite(value.sourceVersion) || typeof value.derivationType !== "string" || typeof value.teacherApproved !== "boolean") return null;
  const sourceRange = isRecord(value.sourceRange) && typeof value.sourceRange.start === "number" && typeof value.sourceRange.end === "number" ? { start: value.sourceRange.start, end: value.sourceRange.end } : undefined;
  return { sourceObjectId: value.sourceObjectId, sourceVersion: value.sourceVersion, derivationType: value.derivationType, teacherApproved: value.teacherApproved, ...(sourceRange ? { sourceRange } : {}) };
};

const wordsForSentence = (sentence: string): ArabicWord[] => {
  const source = sentence.split(" ");
  let cursor = 0;
  const roles: Array<ArabicWord["grammaticalRole"]> = ["فعل", "فاعل", "مفعول به"];
  const marks = ["فعل ماضٍ مبني على الفتح", "فاعل مرفوع وعلامة رفعه الضمة", "مفعول به منصوب وعلامة نصبه الفتحة"];
  const explanations = ["يصف الحدث الذي وقع.", "من قام بالفعل في الجملة.", "ما وقع عليه الفعل."];
  return source.map((text, index) => {
    const start = cursor;
    cursor += text.length + 1;
    return { id: `word_${index + 1}`, text, start, end: start + text.length, grammaticalRole: roles[index] ?? "فعل", caseMark: marks[index] ?? "تحليل محدد مسبقًا", explanation: explanations[index] ?? "تمثيل نحوي مشتق من الجملة." };
  });
};

export const createArabicSource = (sentence = "قرأَ الطالبُ الكتابَ."): EducationalObject<"SentenceObject", string> =>
  createRegisteredEducationalObject("SentenceObject", sentence, 72, 110, id("sentence")) as EducationalObject<"SentenceObject", string>;

export const createMathSource = (equation = "2x + 3 = 11"): EducationalObject<"EquationObject", string> =>
  createRegisteredEducationalObject("EquationObject", equation, 72, 110, id("equation")) as EducationalObject<"EquationObject", string>;

export const createGrammarLens = (source: EducationalObject<"SentenceObject", string>, at = nowIso()): GrammarLens => ({
  id: id("grammar-lens"), type: "GrammarLens", subject: "arabic", sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version,
  provenance: { sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version, derivationType: "deterministic-grammar-lens", teacherApproved: false }, revealAnswer: false, editable: true,
  words: wordsForSentence(source.content), selectedWordId: null, createdAt: at, updatedAt: at,
});

export const createMathVisualizationLens = (source: EducationalObject<"EquationObject", string>, at = nowIso()): MathVisualizationLens => ({
  id: id("math-lens"), type: "MathVisualizationLens", subject: "mathematics", sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version,
  provenance: { sourceObjectId: source.id, sourceRange: { start: 0, end: source.content.length }, sourceVersion: source.version, derivationType: "deterministic-equation-visualization", teacherApproved: false }, revealAnswer: false, editable: false,
  equation: source.content, operationSteps: [{ label: "اطرح 3 من الطرفين", equation: "2x = 8" }, { label: "اقسم الطرفين على 2", equation: "x = 4" }], points: [{ x: 4, y: 0, label: "الحل x = 4" }], solutionX: 4, createdAt: at, updatedAt: at,
});

export const createActivity = (subject: Subject, source: EducationalObject, lens: GrammarLens | MathVisualizationLens, at = nowIso()): ActivityDefinition => subject === "arabic" ? {
  id: id("activity"), subject, prompt: "حدد الفاعل في الجملة.", interactionKind: "classify", sourceObjectId: source.id, lensId: lens.id, expectedAnswer: "word_2", acceptedAnswers: ["word_2", "الطالبُ", "الطالب"], answer: "", attemptCount: 0, completionState: "incomplete", assessmentId: null, feedbackId: null, createdAt: at, updatedAt: at,
} : {
  id: id("activity"), subject, prompt: "حل المعادلة: 2x + 3 = 11", interactionKind: "solve", sourceObjectId: source.id, lensId: lens.id, expectedAnswer: "4", acceptedAnswers: ["4"], answer: "", attemptCount: 0, completionState: "incomplete", assessmentId: null, feedbackId: null, createdAt: at, updatedAt: at,
};

export const evaluateAnswer = (activity: ActivityDefinition, answer: string): { state: FeedbackState; score: number } => {
  const submitted = normalize(answer);
  if (!submitted) return { state: "incomplete", score: 0 };
  if (activity.acceptedAnswers.some((candidate) => normalize(candidate) === submitted)) return { state: "correct", score: 1 };
  if (activity.subject === "mathematics" && (submitted === "x=4" || submitted === "x=4".replace("=", " = "))) return { state: "valid-alternative", score: 1 };
  if (activity.subject === "arabic" && (submitted === "word_1" || submitted === "word_3" || submitted.includes("فعل") || submitted.includes("مفعول"))) return { state: "partially-correct", score: 0.5 };
  if (activity.subject === "mathematics" && (submitted === "8" || submitted.includes("2"))) return { state: "partially-correct", score: 0.5 };
  return { state: "incorrect", score: 0 };
};

export const createFeedback = (assessment: Assessment, activity: ActivityDefinition): Feedback => {
  const state = assessment.effectiveEvaluation ?? assessment.evaluation;
  const common = { id: id("feedback"), assessmentId: assessment.id, state, retryAllowed: !["correct", "valid-alternative"].includes(state), teacherNote: activity.subject === "arabic" ? "تذكير للمعلم: الفاعل هو من قام بالفعل." : "تذكير للمعلم: حافظ على تكافؤ الطرفين في كل خطوة.", createdAt: nowIso() };
  if (state === "correct") return { ...common, title: "إجابة صحيحة", explanation: activity.subject === "arabic" ? "أحسنت؛ الطالبُ هو الفاعل لأنه قام بالقراءة." : "أحسنت؛ بعد طرح 3 ثم القسمة على 2، يكون x = 4." };
  if (state === "valid-alternative") return { ...common, title: "حل صحيح بصيغة بديلة", explanation: "أثبتت الصيغة x = 4 القيمة نفسها؛ نحتفظ بها كطريقة تعبير صحيحة.", hint: "يمكنك الآن التحقق بالتعويض.", nextStep: "تحقق من الحل بالتعويض في المعادلة." };
  if (state === "incomplete") return { ...common, title: "لم تُرسل إجابة بعد", explanation: activity.subject === "arabic" ? "اختر كلمة من الجملة لتحديد الفاعل." : "اكتب قيمة x أو صيغة حل واضحة قبل الإرسال.", hint: activity.subject === "arabic" ? "ابدأ بالسؤال: من قام بالفعل؟" : "ابدأ بطرح 3 من الطرفين.", nextStep: "أكمل الحقل أو الاختيار ثم أرسل المحاولة." };
  if (state === "partially-correct") return { ...common, title: "إجابة جزئية", explanation: activity.subject === "arabic" ? "بدأت من اتجاه صحيح، لكن اختر الكلمة التي تؤدي الفعل لا وصف الفعل أو المفعول به." : "الخطوة الوسطى قريبة؛ بعد طرح 3 يصبح الطرف الأيسر 2x والطرف الأيمن 8.", hint: activity.subject === "arabic" ? "اسأل: من قام بالفعل؟" : "نفّذ العملية نفسها على الطرفين.", nextStep: activity.subject === "arabic" ? "اربط السؤال بمن قام بالفعل." : "راجع الخطوة الأولى قبل متابعة الحل." };
  return { ...common, title: "لنحاول مرة أخرى", explanation: activity.subject === "arabic" ? "الإجابة ليست الفاعل. اقرأ الجملة واسأل: من قام بالفعل؟" : "ابدأ بطرح 3 من الطرفين، ثم اقسم الناتج على 2.", hint: activity.subject === "arabic" ? "الكلمة الثانية هي المرشح الصحيح." : "بعد طرح 3: 2x = 8.", nextStep: activity.subject === "arabic" ? "أعد قراءة الجملة وحدد صاحب الفعل." : "نفّذ طرح 3 على الطرفين أولًا." };
};

export const assessActivity = (activity: ActivityDefinition, answer: string, provenance: Provenance, at = nowIso()): { activity: ActivityDefinition; assessment: Assessment; feedback: Feedback } => {
  const result = evaluateAnswer(activity, answer);
  const assessmentId = id("assessment");
  const nextActivity: ActivityDefinition = { ...activity, answer, attemptCount: activity.attemptCount + 1, completionState: ["correct", "valid-alternative"].includes(result.state) ? "complete" : "incomplete", assessmentId, feedbackId: null, updatedAt: at };
  const diagnostic: AssessmentDiagnostic = result.state === "valid-alternative" ? "alternative-solution" : result.state === "incomplete" ? "incomplete" : result.state === "partially-correct" ? (activity.subject === "mathematics" ? "step-error" : "conceptual-error") : result.state === "incorrect" ? "answer-error" : "procedural-error";
  const assessment: Assessment = { id: assessmentId, activityId: activity.id, attemptId: id("attempt"), answer, evaluation: result.state, effectiveEvaluation: result.state, score: result.score, maxScore: 1, feedbackId: "pending", createdAt: at, provenance: clone(provenance), diagnostic, events: [{ id: id("assessment-event"), eventType: "system-assessment", assessmentId, state: result.state, createdAt: at }] };
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
  return { subject, source, lens, activity: createActivity(subject, source, lens), assessment: null, feedback: null, selectedStage: "create" };
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
  return { ...raw, effectiveEvaluation, events: finalEvents, diagnostic, provenance, teacherOverride, feedbackId: typeof raw.feedbackId === "string" ? raw.feedbackId : "", systemFeedbackId: typeof raw.systemFeedbackId === "string" ? raw.systemFeedbackId : undefined, score: typeof raw.score === "number" && Number.isFinite(raw.score) ? raw.score : 0, maxScore: typeof raw.maxScore === "number" && Number.isFinite(raw.maxScore) ? raw.maxScore : 1, attemptId: typeof raw.attemptId === "string" ? raw.attemptId : deterministicEventId(raw.id, "attempt") } as Assessment;
};

const migrateFeedback = (raw: unknown, assessmentId: string): Feedback | null => {
  if (!isRecord(raw) || typeof raw.id !== "string" || raw.assessmentId !== assessmentId || !isFeedbackState(raw.state) || typeof raw.title !== "string" || typeof raw.explanation !== "string" || typeof raw.retryAllowed !== "boolean" || typeof raw.teacherNote !== "string") return null;
  if (raw.teacherOverride !== undefined && (!isRecord(raw.teacherOverride) || !isFeedbackState(raw.teacherOverride.state) || typeof raw.teacherOverride.note !== "string")) return null;
  return { ...raw, state: raw.state, assessmentId, retryAllowed: raw.retryAllowed, createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "" } as Feedback;
};

const migrateJourney = (raw: unknown): JourneyState | null => {
  if (!isRecord(raw) || (raw.subject !== "arabic" && raw.subject !== "mathematics") || !isRecord(raw.source) || typeof raw.source.id !== "string" || !isRecord(raw.lens) || typeof raw.lens.id !== "string" || !isRecord(raw.activity) || typeof raw.activity.id !== "string") return null;
  const assessment = raw.assessment ? migrateAssessment(raw.assessment) : null;
  if (raw.assessment && !assessment) return null;
  const feedback = raw.feedback ? migrateFeedback(raw.feedback, assessment?.id ?? "") : null;
  if (raw.feedback && !feedback) return null;
  if (assessment && feedback?.assessmentId !== assessment.id) return null;
  return { ...raw, assessment, feedback } as JourneyState;
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
export const toggleLensAnswer = <T extends GrammarLens | MathVisualizationLens>(lens: T): T => ({ ...lens, revealAnswer: !lens.revealAnswer, updatedAt: nowIso() });
