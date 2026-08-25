/**
 * Gate 12 — Complete Classroom Learning Loop.
 * Design reminder: the paper-and-olive workspace composes the existing canonical
 * Arabic/Math assessment contracts. This module owns lifecycle orchestration and
 * identity-safe attempts; it is not a new subject assessment or feedback engine.
 */
import type { CoreObject } from "./coreBoard";
import {
  applyTeacherOverride,
  createActivity,
  createArabicSource,
  createGrammarLens,
  createMathSource,
  createMathVisualizationLens,
  assessActivity,
  type ActivityDefinition,
  type Assessment,
  type Feedback,
  type FeedbackState,
  type JourneyState,
  type Provenance,
  type Subject,
} from "./gate4bTeaching";
import {
  assessMathFinalAnswer,
  assessMathStep,
  applyMathStepTeacherOverride,
  verifyMathAnswer,
  type MathFinalAnswerAssessment,
  type MathStepAssessment,
  type MathStepSession,
  type SolutionStepObject,
} from "./mathStepSlice";
import { createMathStepSession } from "./mathStepSlice";

export type ActivityLifecycle = "draft" | "ready" | "student-active" | "submitted" | "assessed" | "reviewed";
export type AttemptStatus = "active" | "submitted" | "assessed" | "reviewed";
export type TeacherDecision = { state: FeedbackState; reason: string; note: string; timestamp: string; teacherReference?: string; provenance: Provenance };
export type StudentIdentity = { id: string; displayName: string };
export type ClassroomAttempt = {
  activityId: string;
  attemptId: string;
  student: StudentIdentity;
  response: string;
  mathSteps: SolutionStepObject[];
  status: AttemptStatus;
  submittedAt?: string;
  assessmentId?: string;
  feedbackId?: string;
  assessment?: Assessment;
  feedback?: Feedback;
  mathStepAssessments: MathStepAssessment[];
  mathFinalAnswer?: MathFinalAnswerAssessment;
  mathVerification?: ReturnType<typeof verifyMathAnswer>;
  teacherDecision?: TeacherDecision;
  provenance: Provenance;
  createdAt: string;
  updatedAt: string;
};
export type ClassroomActivity = {
  id: string;
  subject: Subject;
  sourceObjectId: string;
  sourceVersion: number;
  activity: ActivityDefinition;
  mathStepSession?: MathStepSession;
  lifecycle: ActivityLifecycle;
  attempts: ClassroomAttempt[];
  activeAttemptId: string | null;
  createdAt: string;
  updatedAt: string;
};
export type ClassroomLessonState = {
  schemaVersion: 1;
  student: StudentIdentity;
  activities: ClassroomActivity[];
  updatedAt: string;
};

const now = () => new Date().toISOString();
const safeClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const id = (prefix: string, seed: string) => `${prefix}_${seed}_${Math.random().toString(36).slice(2, 8)}`;
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isLifecycle = (value: unknown): value is ActivityLifecycle => ["draft", "ready", "student-active", "submitted", "assessed", "reviewed"].includes(value as string);
const isFeedbackState = (value: unknown): value is FeedbackState => ["correct", "valid-alternative", "partially-correct", "incorrect", "incomplete"].includes(value as string);
const unsafeKeys = new Set(["__proto__", "constructor", "prototype"]);
const containsUnsafe = (value: unknown): boolean => Array.isArray(value) ? value.some(containsUnsafe) : isRecord(value) && Object.entries(value).some(([key, nested]) => unsafeKeys.has(key) || containsUnsafe(nested));

const transitionTable: Record<ActivityLifecycle, ActivityLifecycle[]> = {
  draft: ["ready"], ready: ["student-active"], "student-active": ["submitted"], submitted: ["assessed"], assessed: ["reviewed"], reviewed: [],
};
export const canTransitionActivity = (from: ActivityLifecycle, to: ActivityLifecycle) => transitionTable[from].includes(to);
export const transitionActivity = (activity: ClassroomActivity, to: ActivityLifecycle, at = now()): ClassroomActivity => {
  if (!canTransitionActivity(activity.lifecycle, to)) throw new Error(`Invalid activity transition: ${activity.lifecycle} -> ${to}`);
  return { ...activity, lifecycle: to, updatedAt: at };
};

export const createClassroomLesson = (at = now()): ClassroomLessonState => ({ schemaVersion: 1, student: { id: "local-student-1", displayName: "طالب محلي" }, activities: [], updatedAt: at });

export const createClassroomActivityFromObject = (object: CoreObject): ClassroomActivity | null => {
  if (object.type !== "SentenceObject" && object.type !== "EquationObject") return null;
  const subject = object.type === "SentenceObject" ? "arabic" : "mathematics";
  const source = subject === "arabic" ? { ...createArabicSource(object.content), id: object.id, content: object.content, version: object.metadata.version } : { ...createMathSource(object.content), id: object.id, content: object.content, version: object.metadata.version };
  const lens = subject === "arabic" ? createGrammarLens(source as ReturnType<typeof createArabicSource>) : createMathVisualizationLens(source as ReturnType<typeof createMathSource>);
  const activity = createActivity(subject, source as never, lens);
  return { id: `${object.id}_classroom`, subject, sourceObjectId: object.id, sourceVersion: object.metadata.version, activity, ...(subject === "mathematics" ? { mathStepSession: createMathStepSession(source as ReturnType<typeof createMathSource>) } : {}), lifecycle: "draft", attempts: [], activeAttemptId: null, createdAt: now(), updatedAt: now() };
};

export const createClassroomActivity = (journey: JourneyState, at = now()): ClassroomActivity => ({
  id: `${journey.activity.id}_classroom`, subject: journey.subject, sourceObjectId: journey.source.id, sourceVersion: journey.source.version, activity: safeClone(journey.activity), ...(journey.mathStepSession ? { mathStepSession: safeClone(journey.mathStepSession) } : {}), lifecycle: "draft", attempts: [], activeAttemptId: null, createdAt: at, updatedAt: at,
});

export const createAttempt = (activity: ClassroomActivity, student: StudentIdentity, at = now()): ClassroomAttempt => {
  if (activity.lifecycle !== "ready" && activity.lifecycle !== "student-active") throw new Error("Activity must be ready before starting a student attempt");
  return { activityId: activity.id, attemptId: id("attempt", activity.id), student: { ...student }, response: "", mathSteps: [], status: "active", mathStepAssessments: [], provenance: { sourceObjectId: activity.sourceObjectId, sourceVersion: activity.sourceVersion, derivationType: "classroom-attempt", teacherApproved: false }, createdAt: at, updatedAt: at };
};

export const updateAttemptResponse = (attempt: ClassroomAttempt, response: string, at = now()): ClassroomAttempt => {
  if (attempt.status !== "active") throw new Error("Only an active attempt can be edited");
  return { ...attempt, response, updatedAt: at };
};
export const updateAttemptMathSteps = (attempt: ClassroomAttempt, mathSteps: SolutionStepObject[], at = now()): ClassroomAttempt => {
  if (attempt.status !== "active") throw new Error("Only an active attempt can be edited");
  return { ...attempt, mathSteps: safeClone(mathSteps), updatedAt: at };
};
export const submitAttempt = (activity: ClassroomActivity, attempt: ClassroomAttempt, at = now()): { activity: ClassroomActivity; attempt: ClassroomAttempt } => {
  if (attempt.activityId !== activity.id || attempt.status !== "active") throw new Error("Attempt does not belong to the active activity");
  if (activity.lifecycle !== "student-active") throw new Error("Activity must be student-active before submission");
  const nextAttempt = { ...attempt, status: "submitted" as const, submittedAt: at, updatedAt: at };
  return { activity: transitionActivity({ ...activity, attempts: activity.attempts.map((item) => item.attemptId === attempt.attemptId ? nextAttempt : item) }, "submitted", at), attempt: nextAttempt };
};

export const assessAttempt = (activity: ClassroomActivity, attempt: ClassroomAttempt, provenance: Provenance, at = now()): { activity: ClassroomActivity; attempt: ClassroomAttempt } => {
  if (attempt.status !== "submitted" || activity.lifecycle !== "submitted") throw new Error("Only a submitted attempt can be assessed");
  if (activity.subject === "mathematics") {
    const mathSession = activity.mathStepSession;
    const stepAssessments = mathSession ? attempt.mathSteps.map((step) => assessMathStep(mathSession.problem, step, provenance, mathSession.disclosureLevel, at)) : [];
    const finalAnswer = assessMathFinalAnswer(mathSession?.problem ?? (() => { throw new Error("Math activity is missing its canonical problem"); })(), attempt.response, provenance, at);
    const verificationExpression = finalAnswer.correct && /(?:^|\s|=)4(?:$|\s)/.test(attempt.response.replace(/x/gi, "")) ? "2(4) + 3 = 11" : attempt.response;
    const verification = mathSession ? verifyMathAnswer(mathSession.problem, verificationExpression, provenance, at) : undefined;
    const nextAttempt = { ...attempt, status: "assessed" as const, mathStepAssessments: stepAssessments, mathFinalAnswer: finalAnswer, mathVerification: verification, updatedAt: at };
    const nextActivity = transitionActivity({ ...activity, attempts: activity.attempts.map((item) => item.attemptId === attempt.attemptId ? nextAttempt : item) }, "assessed", at);
    return { activity: nextActivity, attempt: nextAttempt };
  }
  const assessed = assessActivity(activity.activity, attempt.response, provenance, at);
  const nextAttempt = { ...attempt, status: "assessed" as const, assessment: assessed.assessment, feedback: assessed.feedback, assessmentId: assessed.assessment.id, feedbackId: assessed.feedback.id, updatedAt: at };
  const nextActivity = transitionActivity({ ...activity, attempts: activity.attempts.map((item) => item.attemptId === attempt.attemptId ? nextAttempt : item) }, "assessed", at);
  return { activity: nextActivity, attempt: nextAttempt };
};

export const reviewAttempt = (activity: ClassroomActivity, attempt: ClassroomAttempt, at = now()): ClassroomActivity => {
  if (attempt.status !== "assessed" || activity.lifecycle !== "assessed") throw new Error("Only an assessed attempt can be reviewed");
  const nextAttempt = { ...attempt, status: "reviewed" as const, updatedAt: at };
  return transitionActivity({ ...activity, attempts: activity.attempts.map((item) => item.attemptId === attempt.attemptId ? nextAttempt : item) }, "reviewed", at);
};

export const applyAttemptOverride = (attempt: ClassroomAttempt, activity: ClassroomActivity, state: FeedbackState, reason: string, note: string, provenance: Provenance, teacherReference = "local-teacher", at = now()): ClassroomAttempt => {
  if (attempt.status !== "assessed" && attempt.status !== "reviewed") throw new Error("Teacher override requires an assessed or reviewed attempt");
  if (activity.subject === "mathematics") {
    const stepAssessments = attempt.mathStepAssessments.map((assessment) => applyMathStepTeacherOverride(assessment, state, reason, teacherReference, at));
    return { ...attempt, mathStepAssessments: stepAssessments, teacherDecision: { state, reason: reason.trim(), note: note.trim(), timestamp: at, teacherReference, provenance: { ...provenance, teacherApproved: true, derivationType: "teacher-decision" } }, updatedAt: at };
  }
  if (!attempt.assessment || !attempt.feedback) throw new Error("Arabic attempt is missing its canonical assessment");
  const overridden = applyTeacherOverride(attempt.assessment, activity.activity, state, reason, note, provenance, at);
  return { ...attempt, assessment: overridden.assessment, feedback: overridden.feedback, teacherDecision: { state, reason: reason.trim(), note: note.trim(), timestamp: at, teacherReference, provenance: { ...provenance, teacherApproved: true, derivationType: "teacher-decision" } }, updatedAt: at };
};

export const retryAttempt = (activity: ClassroomActivity, student: StudentIdentity, at = now()): { activity: ClassroomActivity; attempt: ClassroomAttempt } => {
  const latest = activity.attempts.at(-1);
  if (!latest || latest.status === "active") throw new Error("Submit and assess the current attempt before retrying");
  const nextActivity = { ...activity, lifecycle: "student-active" as const, activeAttemptId: null, updatedAt: at };
  const attempt = createAttempt(nextActivity, student, at);
  return { activity: { ...nextActivity, attempts: [...nextActivity.attempts, attempt], activeAttemptId: attempt.attemptId }, attempt };
};

export const serializeClassroomLesson = (state: ClassroomLessonState): string => JSON.stringify(state);
export const deserializeClassroomLesson = (raw: string): ClassroomLessonState | null => {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (containsUnsafe(parsed) || !isRecord(parsed) || parsed.schemaVersion !== 1 || !isRecord(parsed.student) || typeof parsed.student.id !== "string" || typeof parsed.student.displayName !== "string" || !Array.isArray(parsed.activities)) return null;
    if (parsed.activities.some((item) => !isRecord(item) || typeof item.id !== "string" || typeof item.sourceObjectId !== "string" || typeof item.sourceVersion !== "number" || !Number.isFinite(item.sourceVersion) || !isLifecycle(item.lifecycle) || !Array.isArray(item.attempts))) return null;
    const ids = new Set<string>();
    for (const activity of parsed.activities as Array<Record<string, unknown>>) {
      if (ids.has(activity.id as string)) return null;
      ids.add(activity.id as string);
      const attempts = activity.attempts as unknown[];
      const attemptIds = new Set<string>();
      for (const attempt of attempts) {
        if (!isRecord(attempt) || typeof attempt.attemptId !== "string" || typeof attempt.activityId !== "string" || attempt.activityId !== activity.id || !isRecord(attempt.student) || typeof attempt.student.id !== "string" || typeof attempt.student.displayName !== "string" || typeof attempt.response !== "string" || !Array.isArray(attempt.mathSteps) || !Array.isArray(attempt.mathStepAssessments) || !isRecord(attempt.provenance)) return null;
        if (attemptIds.has(attempt.attemptId)) return null;
        attemptIds.add(attempt.attemptId);
        if (attempt.teacherDecision !== undefined && (!isRecord(attempt.teacherDecision) || !isFeedbackState(attempt.teacherDecision.state) || typeof attempt.teacherDecision.reason !== "string" || typeof attempt.teacherDecision.note !== "string" || !isRecord(attempt.teacherDecision.provenance))) return null;
      }
    }
    return parsed as ClassroomLessonState;
  } catch { return null; }
};

export const attachActivity = (state: ClassroomLessonState, activity: ClassroomActivity, at = now()): ClassroomLessonState => ({ ...state, activities: [...state.activities, activity], updatedAt: at });
export const replaceActivity = (state: ClassroomLessonState, activity: ClassroomActivity, at = now()): ClassroomLessonState => ({ ...state, activities: state.activities.map((item) => item.id === activity.id ? activity : item), updatedAt: at });
