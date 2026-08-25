/**
 * Gate 4C-B Mathematics Step-by-Step Vertical Slice.
 * Design reminder: Arabic-first, calm paper-and-olive teaching instrument. This
 * module is a bounded deterministic subject contract over the canonical
 * EducationalObject and Provenance types; it is not a second board, registry,
 * assessment engine, feedback engine, or symbolic mathematics engine.
 */
import type { EducationalObject } from "./educationalObjects";
import type { Assessment, AssessmentDiagnostic, Feedback, FeedbackState, Provenance } from "./gate4bTeaching";

export type MathValidityState = "valid" | "valid-alternative" | "invalid" | "incomplete" | "unsupported" | "needs-review";
export type MathStepDiagnostic = "operation-error" | "arithmetic-error" | "sign-error" | "transformation-error" | "incomplete-step" | "invalid-step" | "unsupported-reasoning" | "correct-alternative" | "correct-step" | "verification-failure";
export type MathDisclosureLevel = 1 | 2 | 3 | 4 | 5;

export type MathProblemObject = {
  id: string;
  sourceObject: EducationalObject<"EquationObject", string>;
  equation: "2x + 3 = 11";
  expectedAnswer: "x = 4";
  learningObjective: "حل معادلة خطية من خطوتين مع تبرير كل تحويل والتحقق بالتعويض";
  provenance: Provenance;
  createdAt: string;
  updatedAt: string;
};

export type SolutionStepObject = {
  id: string;
  sourceProblemId: string;
  stepNumber: 1 | 2;
  expressionBefore: string;
  operation: string;
  expressionAfter: string;
  mathematicalJustification: string;
  validityState: MathValidityState;
  provenance: Provenance;
};

export type MathVerification = {
  id: string;
  problemId: string;
  expression: string;
  expectedExpression: "2(4) + 3 = 11";
  valid: boolean;
  diagnostic: MathStepDiagnostic;
  provenance: Provenance;
};

export type MathStepFeedback = Feedback & {
  level: MathDisclosureLevel;
  correctedStep?: SolutionStepObject;
  nextStep?: string;
};

export type MathStepAssessment = Assessment & {
  problemId: string;
  stepNumber: number;
  submitted: SolutionStepObject;
  validityState: MathValidityState;
  feedback: MathStepFeedback;
};

export type MathGoldenCase = {
  id: string;
  label: string;
  problem: MathProblemObject;
  expectedSteps: SolutionStepObject[];
  acceptableAlternatives: SolutionStepObject[];
  invalidSteps: SolutionStepObject[];
  expectedDiagnostic: MathStepDiagnostic;
  expectedFeedback: string;
  explanation: string;
  source: string;
  sourceVersion: number;
  provenance: Provenance;
};

const now = () => new Date().toISOString();
const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/[\s،؛,.]/g, "");
const stepId = (problemId: string, number: number, suffix = "canonical") => `${problemId}_step_${number}_${suffix}`;
const provenanceFor = (sourceObjectId: string, sourceVersion: number, derivationType: string): Provenance => ({ sourceObjectId, sourceRange: { start: 0, end: 10 }, sourceVersion, derivationType, teacherApproved: false });

export const createMathProblem = (sourceObject: EducationalObject<"EquationObject", string>, at = now()): MathProblemObject => {
  if (sourceObject.content !== "2x + 3 = 11") throw new Error("Gate 4C-B supports only the canonical equation 2x + 3 = 11");
  return {
    id: `${sourceObject.id}_math-problem`,
    sourceObject,
    equation: "2x + 3 = 11",
    expectedAnswer: "x = 4",
    learningObjective: "حل معادلة خطية من خطوتين مع تبرير كل تحويل والتحقق بالتعويض",
    provenance: provenanceFor(sourceObject.id, sourceObject.version, "deterministic-math-problem"),
    createdAt: at,
    updatedAt: at,
  };
};

const canonicalSteps = (problem: MathProblemObject): SolutionStepObject[] => [
  { id: stepId(problem.id, 1), sourceProblemId: problem.id, stepNumber: 1, expressionBefore: "2x + 3 = 11", operation: "subtract 3 from both sides", expressionAfter: "2x = 8", mathematicalJustification: "Subtracting the same quantity from both sides preserves equality.", validityState: "valid", provenance: provenanceFor(problem.id, 1, "deterministic-solution-step") },
  { id: stepId(problem.id, 2), sourceProblemId: problem.id, stepNumber: 2, expressionBefore: "2x = 8", operation: "divide both sides by 2", expressionAfter: "x = 4", mathematicalJustification: "Dividing both sides by the same non-zero quantity preserves equality.", validityState: "valid", provenance: provenanceFor(problem.id, 1, "deterministic-solution-step") },
];

const alternativeSteps = (problem: MathProblemObject): SolutionStepObject[] => [
  { id: stepId(problem.id, 1, "alternative"), sourceProblemId: problem.id, stepNumber: 1, expressionBefore: "2x + 3 = 11", operation: "move 3 to the other side", expressionAfter: "2x = 11 - 3", mathematicalJustification: "Moving a term is shorthand for subtracting 3 from both sides.", validityState: "valid-alternative", provenance: provenanceFor(problem.id, 1, "deterministic-alternative-step") },
  { id: stepId(problem.id, 2, "alternative"), sourceProblemId: problem.id, stepNumber: 2, expressionBefore: "2x = 11 - 3", operation: "divide both sides by 2", expressionAfter: "x = 4", mathematicalJustification: "Dividing both sides by the same non-zero quantity preserves equality.", validityState: "valid-alternative", provenance: provenanceFor(problem.id, 1, "deterministic-alternative-step") },
];

export type MathStepSession = { problem: MathProblemObject; steps: SolutionStepObject[]; currentStep: 1 | 2; assessments: MathStepAssessment[]; verification: MathVerification | null; disclosureLevel: MathDisclosureLevel; mode: "teacher" | "student" };

export const createMathStepSession = (sourceObject: EducationalObject<"EquationObject", string>, at = now()): MathStepSession => {
  const problem = createMathProblem(sourceObject, at);
  return { problem, steps: createSolutionSteps(problem), currentStep: 1, assessments: [], verification: null, disclosureLevel: 1, mode: "student" };
};

export const createSolutionSteps = (problem: MathProblemObject): SolutionStepObject[] => canonicalSteps(problem);
export const createAlternativeSolutionSteps = (problem: MathProblemObject): SolutionStepObject[] => alternativeSteps(problem);

const feedbackFor = (state: MathValidityState, diagnostic: MathStepDiagnostic, level: MathDisclosureLevel, corrected?: SolutionStepObject, assessmentId = "pending", at = now()): MathStepFeedback => {
  if (level === 1) return { id: `${assessmentId}_feedback`, assessmentId, state: state === "valid" ? "correct" : state === "valid-alternative" ? "valid-alternative" : state === "incomplete" ? "incomplete" : "incorrect", title: state === "valid" || state === "valid-alternative" ? "الخطوة صالحة" : "الخطوة تحتاج مراجعة", explanation: "نحدد صلاحية التحويل قبل كشف الحل.", retryAllowed: state !== "valid" && state !== "valid-alternative", teacherNote: "تغذية راجعة رياضية deterministic ضمن Gate 4C-B.", createdAt: at, level };
  if (state === "valid-alternative") return { id: `${assessmentId}_feedback`, assessmentId, state: "valid-alternative", title: "طريقة بديلة صحيحة", explanation: "هذه صيغة مختصرة لتحويل مكافئ يحافظ على مساواة الطرفين.", hint: level >= 3 ? "فكّر في العملية المكافئة التي تمثلها عبارة نقل الحد." : undefined, nextStep: "تابع إلى قسمة الطرفين على 2.", retryAllowed: false, teacherNote: "تغذية راجعة رياضية deterministic ضمن Gate 4C-B.", createdAt: at, level };
  if (state === "valid") return { id: `${assessmentId}_feedback`, assessmentId, state: "correct", title: "خطوة صحيحة", explanation: "العملية طُبقت على الطرفين مع تبرير يحافظ على التكافؤ.", nextStep: "اكتب الخطوة التالية أو انتقل إلى التحقق.", retryAllowed: false, teacherNote: "تغذية راجعة رياضية deterministic ضمن Gate 4C-B.", createdAt: at, level };
  const messages: Record<MathStepDiagnostic, { title: string; explanation: string; hint: string }> = {
    "operation-error": { title: "راجع العملية", explanation: "العملية المكتوبة لا تطابق التحويل المطلوب في هذه المرحلة.", hint: "اسأل: ما العملية التي تطبق على الطرفين معًا؟" },
    "arithmetic-error": { title: "خطأ حسابي", explanation: "فكرة العملية صحيحة، لكن نتيجة الحساب بعد تنفيذها غير صحيحة.", hint: "احسب 11 − 3 مرة أخرى." },
    "sign-error": { title: "راجع الإشارة", explanation: "تغيّرت إشارة حد أو ناتج دون تحويل مكافئ يحافظ على المعادلة.", hint: "طبّق العملية نفسها على الطرفين ولا تغيّر الإشارة منفردًا." },
    "transformation-error": { title: "تحويل غير مكافئ", explanation: "التعبير الجديد لا ينتج عن عملية قانونية على طرفي المعادلة.", hint: "قارن الطرفين قبل وبعد التحويل." },
    "incomplete-step": { title: "الخطوة غير مكتملة", explanation: "ينقص الخطوة تعبير أو عملية أو تبرير رياضي.", hint: "أكمل: قبل العملية، العملية، بعدها، ولماذا." },
    "invalid-step": { title: "خطوة غير صالحة", explanation: "هذه الخطوة لا تحافظ على قيمة المعادلة.", hint: "تحقق من التكافؤ قبل متابعة الحل." },
    "unsupported-reasoning": { title: "طريقة خارج النطاق المثبت", explanation: "الصيغة قد تحتاج مراجعة المعلم لأنها ليست من الطرق المحددة لهذه الشريحة.", hint: "استخدم طرح 3 ثم القسمة على 2." },
    "correct-alternative": { title: "طريقة بديلة صحيحة", explanation: "التحويل مكافئ للطريقة canonical ومقبول ضمن هذه الشريحة.", hint: "يمكنك متابعة الخطوة التالية." },
    "correct-step": { title: "خطوة صحيحة", explanation: "تم الحفاظ على التكافؤ الرياضي.", hint: "تابع." },
    "verification-failure": { title: "فشل التحقق", explanation: "التعويض لا يعيد المعادلة الأصلية إلى مساواة صحيحة.", hint: "عوّض القيمة في 2x + 3 = 11." },
  };
  const message = messages[diagnostic];
  return { id: `${assessmentId}_feedback`, assessmentId, state: state === "incomplete" ? "incomplete" : "incorrect", title: message.title, explanation: message.explanation, hint: level >= 3 ? message.hint : undefined, correctedStep: level === 5 ? corrected : undefined, nextStep: level >= 4 ? "استخدم التبرير الرياضي ثم أعد المحاولة." : undefined, retryAllowed: true, teacherNote: "تغذية راجعة رياضية deterministic ضمن Gate 4C-B.", createdAt: at, level };

};

const classifyStep = (problem: MathProblemObject, submitted: SolutionStepObject): { state: MathValidityState; diagnostic: MathStepDiagnostic; score: number; corrected: SolutionStepObject } => {
  const canonical = canonicalSteps(problem)[submitted.stepNumber - 1];
  const alternative = alternativeSteps(problem)[submitted.stepNumber - 1];
  if (!canonical || submitted.sourceProblemId !== problem.id) return { state: "unsupported", diagnostic: "unsupported-reasoning", score: 0, corrected: canonicalSteps(problem)[0] };
  if (!submitted.expressionBefore.trim() || !submitted.operation.trim() || !submitted.expressionAfter.trim() || !submitted.mathematicalJustification.trim()) return { state: "incomplete", diagnostic: "incomplete-step", score: 0, corrected: canonical };
  if (normalize(submitted.expressionBefore) === normalize(canonical.expressionBefore) && normalize(submitted.expressionAfter) === normalize(canonical.expressionAfter) && normalize(submitted.operation) === normalize(canonical.operation) && normalize(submitted.mathematicalJustification) === normalize(canonical.mathematicalJustification)) return { state: "valid", diagnostic: "correct-step", score: 1, corrected: canonical };
  if (normalize(submitted.expressionBefore) === normalize(alternative.expressionBefore) && normalize(submitted.expressionAfter) === normalize(alternative.expressionAfter) && normalize(submitted.operation) === normalize(alternative.operation) && normalize(submitted.mathematicalJustification) === normalize(alternative.mathematicalJustification)) return { state: "valid-alternative", diagnostic: "correct-alternative", score: 1, corrected: alternative };
  const after = normalize(submitted.expressionAfter);
  const operation = normalize(submitted.operation);
  if (submitted.stepNumber === 1 && (after === "2x=9" || after === "2x=10")) return { state: "invalid", diagnostic: "arithmetic-error", score: 0, corrected: canonical };
  if (after.includes("-2x") || after.includes("-8")) return { state: "invalid", diagnostic: "sign-error", score: 0, corrected: canonical };
  if (operation.includes("add") || operation.includes("multiply") || after === "x=8") return { state: "invalid", diagnostic: "operation-error", score: 0, corrected: canonical };
  if (after === "2x=4" || after === "x=8/2") return { state: "invalid", diagnostic: "transformation-error", score: 0, corrected: canonical };
  return { state: "invalid", diagnostic: "invalid-step", score: 0, corrected: canonical };
};

export const assessMathStep = (problem: MathProblemObject, submitted: SolutionStepObject, provenance = problem.provenance, level: MathDisclosureLevel = 2, at = now()): MathStepAssessment => {
  const result = classifyStep(problem, submitted);
  const evaluation: FeedbackState = result.state === "valid" ? "correct" : result.state === "valid-alternative" ? "valid-alternative" : result.state === "incomplete" ? "incomplete" : "incorrect";
  const assessmentId = `${submitted.id}_assessment`;
  const feedback = feedbackFor(result.state, result.diagnostic, level, result.corrected, assessmentId, at);
  return { id: assessmentId, activityId: `${problem.id}_step-activity`, attemptId: `${assessmentId}_attempt`, answer: JSON.stringify(submitted), createdAt: at, problemId: problem.id, stepNumber: submitted.stepNumber, submitted: { ...submitted, validityState: result.state }, evaluation, effectiveEvaluation: evaluation, validityState: result.state, score: result.score, maxScore: 1, feedbackId: feedback.id, systemFeedbackId: feedback.id, diagnostic: result.diagnostic, reviewState: result.state === "unsupported" ? "unsupported" : "supported", events: [{ id: `${assessmentId}_system-assessment`, eventType: "system-assessment", assessmentId, state: evaluation, createdAt: at }], feedback, provenance: { ...provenance, derivationType: "deterministic-math-step-assessment" } };
};

export const verifyMathAnswer = (problem: MathProblemObject, expression: string, provenance = problem.provenance, at = now()): MathVerification => {
  const valid = normalize(expression) === normalize("2(4) + 3 = 11") || normalize(expression) === normalize("2 * 4 + 3 = 11");
  return { id: `${problem.id}_verification_${at.replace(/[^0-9]/g, "").slice(-8)}`, problemId: problem.id, expression, expectedExpression: "2(4) + 3 = 11", valid, diagnostic: valid ? "correct-step" : "verification-failure", provenance: { ...provenance, derivationType: "deterministic-substitution-verification" } };
};

export const regenerateMathVisualizationLens = (problem: MathProblemObject) => ({
  id: `${problem.id}_visualization`,
  type: "MathVisualizationLens" as const,
  subject: "mathematics" as const,
  equation: problem.equation,
  operationSteps: createSolutionSteps(problem).map((step) => ({ label: step.operation, equation: step.expressionAfter })),
  answer: problem.expectedAnswer,
  sourceObjectId: problem.sourceObject.id,
  sourceRange: problem.provenance.sourceRange,
  sourceVersion: problem.sourceObject.version,
  provenance: { ...problem.provenance, derivationType: "deterministic-math-visualization-lens" },
});

const invalid = (problem: MathProblemObject, step: SolutionStepObject, diagnostic: MathStepDiagnostic): SolutionStepObject => ({ ...step, id: `${step.id}_${diagnostic}`, validityState: "invalid", provenance: { ...problem.provenance, derivationType: "golden-invalid-step" } });

export const createMathGoldenDataset = (sourceObject: EducationalObject<"EquationObject", string>): MathGoldenCase[] => {
  const problem = createMathProblem(sourceObject, "2026-01-01T00:00:00.000Z");
  const expected = createSolutionSteps(problem);
  const alternatives = createAlternativeSolutionSteps(problem);
  return [
    { id: "math-golden-one-step", label: "one-step linear equation boundary", problem, expectedSteps: [expected[0]], acceptableAlternatives: [alternatives[0]], invalidSteps: [], expectedDiagnostic: "correct-step", expectedFeedback: "خطوة صحيحة", explanation: "يثبت العقد خطوة طرح 3 من الطرفين.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-two-step", label: "canonical two-step solution", problem, expectedSteps: expected, acceptableAlternatives: alternatives, invalidSteps: [], expectedDiagnostic: "correct-step", expectedFeedback: "خطوة صحيحة", explanation: "المسار الأساسي يطرح 3 ثم يقسم على 2.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-negative-sign", label: "negative sign case", problem, expectedSteps: expected, acceptableAlternatives: [], invalidSteps: [invalid(problem, { ...expected[0], expressionAfter: "-2x = 8" }, "sign-error")], expectedDiagnostic: "sign-error", expectedFeedback: "راجع الإشارة", explanation: "لا يجوز تغيير إشارة طرف منفردًا.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-incomplete", label: "incomplete solution", problem, expectedSteps: expected, acceptableAlternatives: [], invalidSteps: [{ ...expected[0], id: `${expected[0].id}_incomplete`, operation: "", mathematicalJustification: "", validityState: "incomplete" }], expectedDiagnostic: "incomplete-step", expectedFeedback: "الخطوة غير مكتملة", explanation: "ينقص المحاولة العملية والتبرير.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-arithmetic", label: "arithmetic mistake", problem, expectedSteps: expected, acceptableAlternatives: [], invalidSteps: [invalid(problem, { ...expected[0], expressionAfter: "2x = 9" }, "arithmetic-error")], expectedDiagnostic: "arithmetic-error", expectedFeedback: "خطأ حسابي", explanation: "طرح 3 من 11 يساوي 8.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-transformation", label: "invalid transformation", problem, expectedSteps: expected, acceptableAlternatives: [], invalidSteps: [invalid(problem, { ...expected[0], expressionAfter: "2x = 4" }, "transformation-error")], expectedDiagnostic: "transformation-error", expectedFeedback: "تحويل غير مكافئ", explanation: "الناتج لا يتبع من طرح 3 على الطرفين.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-alternative", label: "correct alternative path", problem, expectedSteps: expected, acceptableAlternatives: alternatives, invalidSteps: [], expectedDiagnostic: "correct-alternative", expectedFeedback: "طريقة بديلة صحيحة", explanation: "نقل الحد اختصار لتحويل مكافئ.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-invalid-intermediate", label: "correct answer after invalid intermediate", problem, expectedSteps: expected, acceptableAlternatives: [], invalidSteps: [invalid(problem, { ...expected[0], expressionAfter: "2x = 9" }, "arithmetic-error")], expectedDiagnostic: "arithmetic-error", expectedFeedback: "خطأ حسابي", explanation: "لا يكفي الوصول إلى x = 4 إذا كانت الخطوة الوسيطة غير صحيحة.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-malformed", label: "malformed solution payload", problem, expectedSteps: expected, acceptableAlternatives: [], invalidSteps: [], expectedDiagnostic: "unsupported-reasoning", expectedFeedback: "طريقة خارج النطاق المثبت", explanation: "payload ناقص أو غير منظم يحتاج مراجعة.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
    { id: "math-golden-verification", label: "verification failure", problem, expectedSteps: expected, acceptableAlternatives: [], invalidSteps: [], expectedDiagnostic: "verification-failure", expectedFeedback: "فشل التحقق", explanation: "الإجابة منفصلة عن اختبار التعويض.", source: "Gate 4C-B controlled dataset", sourceVersion: 1, provenance: problem.provenance },
  ];
};

export const deserializeMathProblem = (raw: unknown): MathProblemObject | null => {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<MathProblemObject>;
  if (typeof value.id !== "string" || value.equation !== "2x + 3 = 11" || value.expectedAnswer !== "x = 4" || !value.sourceObject || !value.provenance) return null;
  return value as MathProblemObject;
};
