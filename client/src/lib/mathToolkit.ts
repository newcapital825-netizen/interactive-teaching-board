import type { Provenance } from "@/lib/gate4bTeaching";

/* Gate 7 reminder: a teacher-facing bounded fixture set, not a general symbolic algebra engine. */
export type MathToolkitFixture = {
  id: string;
  equation: string;
  expectedAnswer: string;
  steps: Array<{ before: string; operation: string; after: string; reason: string }>;
  supported: true;
  provenance: Provenance;
};

const provenance = (id: string): Provenance => ({ sourceObjectId: id, sourceRange: { start: 0, end: 30 }, sourceVersion: 1, derivationType: "bounded-math-toolkit-fixture", teacherApproved: false });

export const mathToolkitFixtures: MathToolkitFixture[] = [
  { id: "math-toolkit-canonical", equation: "2x + 3 = 11", expectedAnswer: "x = 4", steps: [{ before: "2x + 3 = 11", operation: "طرح 3 من الطرفين", after: "2x = 8", reason: "نطرح الكمية نفسها من الطرفين." }, { before: "2x = 8", operation: "قسمة الطرفين على 2", after: "x = 4", reason: "نقسم على عدد غير صفري." }], supported: true, provenance: provenance("math-toolkit-canonical") },
  { id: "math-toolkit-negative-constant", equation: "2x - 3 = 11", expectedAnswer: "x = 7", steps: [{ before: "2x - 3 = 11", operation: "إضافة 3 إلى الطرفين", after: "2x = 14", reason: "نضيف الكمية نفسها إلى الطرفين." }, { before: "2x = 14", operation: "قسمة الطرفين على 2", after: "x = 7", reason: "نقسم على عدد غير صفري." }], supported: true, provenance: provenance("math-toolkit-negative-constant") },
  { id: "math-toolkit-fractional-coefficient", equation: "1/2x + 3 = 11", expectedAnswer: "x = 16", steps: [{ before: "1/2x + 3 = 11", operation: "طرح 3 من الطرفين", after: "1/2x = 8", reason: "نطرح الكمية نفسها من الطرفين." }, { before: "1/2x = 8", operation: "ضرب الطرفين في 2", after: "x = 16", reason: "نضرب في مقلوب المعامل غير الصفري." }], supported: true, provenance: provenance("math-toolkit-fractional-coefficient") },
];

export const getMathToolkitFixture = (id: string) => mathToolkitFixtures.find((fixture) => fixture.id === id) ?? mathToolkitFixtures[0];

export type MathToolkitLens = { id: string; type: "MathVisualizationLens"; sourceObjectId: string; sourceRange: { start: number; end: number }; sourceVersion: number; equation: string; plottedPoint: { x: number; y: number }; steps: string[]; provenance: Provenance };
export const regenerateMathToolkitLens = (fixture: MathToolkitFixture): MathToolkitLens => ({ id: `${fixture.id}-lens`, type: "MathVisualizationLens", sourceObjectId: fixture.provenance.sourceObjectId, sourceRange: fixture.provenance.sourceRange ?? { start: 0, end: fixture.equation.length }, sourceVersion: fixture.provenance.sourceVersion, equation: fixture.equation, plottedPoint: { x: Number(fixture.expectedAnswer.replace("x = ", "")), y: 0 }, steps: fixture.steps.map((step) => `${step.operation}: ${step.after}`), provenance: { ...fixture.provenance, derivationType: "bounded-math-toolkit-visualization" } });

export type MathToolkitAssessment = { state: "correct" | "valid-alternative" | "incorrect" | "incomplete" | "needs-review"; diagnostic: "correct-step" | "answer-error" | "incomplete-step" | "unsupported-reasoning"; feedback: string };
const normalizeAnswer = (value: string) => value.trim().toLowerCase().replace(/[\s،؛,.]/g, "");
export const assessMathToolkitAnswer = (fixture: MathToolkitFixture, answer: string): MathToolkitAssessment => {
  if (!answer.trim()) return { state: "incomplete", diagnostic: "incomplete-step", feedback: "أكمل قيمة الحل قبل التحقق." };
  const normalized = normalizeAnswer(answer);
  const expected = normalizeAnswer(fixture.expectedAnswer);
  if (normalized === expected) return { state: "correct", diagnostic: "correct-step", feedback: "الإجابة توافق الحل المحدد لهذه المعادلة." };
  const value = expected.replace("x=", "");
  if (normalized === `${value}=x`) return { state: "valid-alternative", diagnostic: "correct-step", feedback: "تمثيل مكافئ صحيح: قيمة الحل تساوي x." };
  if (!/^(x=)?-?\d+(=x)?$/.test(normalized)) return { state: "needs-review", diagnostic: "unsupported-reasoning", feedback: "هذه الصيغة تحتاج مراجعة المعلم خارج الحدود المثبتة." };
  return { state: "incorrect", diagnostic: "answer-error", feedback: "راجع التحويل الأخير ثم تحقق بالتعويض." };
};
