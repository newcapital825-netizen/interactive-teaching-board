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
export type FeedbackState = "correct" | "partially-correct" | "incorrect";
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

export type Assessment = {
  id: string;
  activityId: string;
  attemptId: string;
  answer: string;
  evaluation: FeedbackState;
  score: number;
  maxScore: number;
  feedbackId: string;
  createdAt: string;
  provenance: Provenance;
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

export type Gate4BLesson = {
  schemaVersion: number;
  lessonId: string;
  title: string;
  arabic: JourneyState;
  mathematics: JourneyState;
  savedAt: string;
};

const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const normalize = (value: string) => value.trim().replace(/\s+/g, "").toLocaleLowerCase();

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
  id: id("activity"), subject, prompt: "حل المعادلة: 2x + 3 = 11", interactionKind: "solve", sourceObjectId: source.id, lensId: lens.id, expectedAnswer: "4", acceptedAnswers: ["4", "x=4", "x = 4"], answer: "", attemptCount: 0, completionState: "incomplete", assessmentId: null, feedbackId: null, createdAt: at, updatedAt: at,
};

export const evaluateAnswer = (activity: ActivityDefinition, answer: string): { state: FeedbackState; score: number } => {
  const submitted = normalize(answer);
  if (!submitted) return { state: "incorrect", score: 0 };
  if (activity.acceptedAnswers.some((candidate) => normalize(candidate) === submitted)) return { state: "correct", score: 1 };
  if (activity.subject === "arabic" && (submitted === "word_1" || submitted === "word_3" || submitted.includes("فعل") || submitted.includes("مفعول"))) return { state: "partially-correct", score: 0.5 };
  if (activity.subject === "mathematics" && (submitted === "8" || submitted.includes("2"))) return { state: "partially-correct", score: 0.5 };
  return { state: "incorrect", score: 0 };
};

export const createFeedback = (assessment: Assessment, activity: ActivityDefinition): Feedback => {
  const common = { id: id("feedback"), assessmentId: assessment.id, state: assessment.evaluation, retryAllowed: assessment.evaluation !== "correct", teacherNote: activity.subject === "arabic" ? "تذكير للمعلم: الفاعل هو من قام بالفعل." : "تذكير للمعلم: حافظ على تكافؤ الطرفين في كل خطوة.", createdAt: nowIso() };
  if (assessment.evaluation === "correct") return { ...common, title: "إجابة صحيحة", explanation: activity.subject === "arabic" ? "أحسنت؛ الطالبُ هو الفاعل لأنه قام بالقراءة." : "أحسنت؛ بعد طرح 3 ثم القسمة على 2، يكون x = 4." };
  if (assessment.evaluation === "partially-correct") return { ...common, title: "إجابة جزئية", explanation: activity.subject === "arabic" ? "بدأت من اتجاه صحيح، لكن اختر الكلمة التي تؤدي الفعل لا وصف الفعل أو المفعول به." : "الخطوة الوسطى قريبة؛ بعد طرح 3 يصبح الطرف الأيسر 2x والطرف الأيمن 8.", hint: activity.subject === "arabic" ? "اسأل: من قام بالفعل؟" : "نفّذ العملية نفسها على الطرفين." };
  return { ...common, title: "لنحاول مرة أخرى", explanation: activity.subject === "arabic" ? "الإجابة ليست الفاعل. اقرأ الجملة واسأل: من قام بالفعل؟" : "ابدأ بطرح 3 من الطرفين، ثم اقسم الناتج على 2.", hint: activity.subject === "arabic" ? "الكلمة الثانية هي المرشح الصحيح." : "بعد طرح 3: 2x = 8." };
};

export const assessActivity = (activity: ActivityDefinition, answer: string, provenance: Provenance, at = nowIso()): { activity: ActivityDefinition; assessment: Assessment; feedback: Feedback } => {
  const result = evaluateAnswer(activity, answer);
  const assessmentId = id("assessment");
  const nextActivity: ActivityDefinition = { ...activity, answer, attemptCount: activity.attemptCount + 1, completionState: result.state === "correct" ? "complete" : "incomplete", assessmentId, feedbackId: null, updatedAt: at };
  const assessment: Assessment = { id: assessmentId, activityId: activity.id, attemptId: id("attempt"), answer, evaluation: result.state, score: result.score, maxScore: 1, feedbackId: "pending", createdAt: at, provenance: clone(provenance) };
  const feedback = createFeedback(assessment, nextActivity);
  return { activity: { ...nextActivity, feedbackId: feedback.id }, assessment: { ...assessment, feedbackId: feedback.id }, feedback };
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

export const createLesson = (): Gate4BLesson => ({ schemaVersion: EDUCATIONAL_OBJECT_SCHEMA_VERSION, lessonId: id("lesson"), title: "درس تطبيقي — من الإنشاء إلى التغذية الراجعة", arabic: createJourney("arabic"), mathematics: createJourney("mathematics"), savedAt: nowIso() });

export const serializeLesson = (lesson: Gate4BLesson): string => JSON.stringify({ ...clone(lesson), savedAt: nowIso() });
export const deserializeLesson = (raw: string): Gate4BLesson | null => {
  try {
    const value = JSON.parse(raw) as Gate4BLesson;
    if (!value || value.schemaVersion !== EDUCATIONAL_OBJECT_SCHEMA_VERSION || !value.lessonId || !value.arabic?.source?.id || !value.mathematics?.source?.id) return null;
    return value;
  } catch { return null; }
};

export const updateLensSelection = (lens: GrammarLens, wordId: string): GrammarLens => ({ ...lens, selectedWordId: wordId, updatedAt: nowIso() });
export const toggleLensAnswer = <T extends GrammarLens | MathVisualizationLens>(lens: T): T => ({ ...lens, revealAnswer: !lens.revealAnswer, updatedAt: nowIso() });
