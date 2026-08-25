import { describe, expect, it } from "vitest";
import { createLesson, createMathSource, deserializeLesson, serializeLesson } from "../client/src/lib/gate4bTeaching";
import {
  applyMathStepTeacherOverride,
  assessMathFinalAnswer,
  assessMathStep,
  createAlternativeSolutionSteps,
  createMathGoldenDataset,
  createMathProblem,
  createSolutionSteps,
  deserializeMathProblem,
  deserializeMathStepSession,
  regenerateMathVisualizationLens,
  validateMathStepSequence,
  verifyMathAnswer,
} from "../client/src/lib/mathStepSlice";

describe("Gate 4C-B Mathematics step-by-step vertical slice", () => {
  it("creates the bounded problem and canonical steps over EquationObject", () => {
    const source = createMathSource("2x + 3 = 11");
    const problem = createMathProblem(source, "2026-01-01T00:00:00.000Z");
    const steps = createSolutionSteps(problem);
    expect(problem.sourceObject.type).toBe("EquationObject");
    expect(problem.equation).toBe("2x + 3 = 11");
    expect(steps.map((step) => step.expressionAfter)).toEqual(["2x = 8", "x = 4"]);
    expect(steps.every((step) => step.sourceProblemId === problem.id && step.provenance.sourceObjectId === problem.id)).toBe(true);
  });

  it("accepts canonical and equivalent alternative paths without fuzzy matching", () => {
    const problem = createMathProblem(createMathSource());
    const canonical = assessMathStep(problem, createSolutionSteps(problem)[0], problem.provenance, 5);
    const alternative = assessMathStep(problem, createAlternativeSolutionSteps(problem)[0], problem.provenance, 3);
    const normalizedAlternative = assessMathStep(problem, { ...createAlternativeSolutionSteps(problem)[0], operation: "Move 3 to the other side" }, problem.provenance, 3);
    const nearMiss = assessMathStep(problem, { ...createSolutionSteps(problem)[0], expressionAfter: "2x = 8.0" }, problem.provenance, 3);
    expect(canonical.evaluation).toBe("correct");
    expect(alternative.evaluation).toBe("valid-alternative");
    expect(alternative.diagnostic).toBe("correct-alternative");
    expect(normalizedAlternative.evaluation).toBe("valid-alternative");
    expect(nearMiss.evaluation).toBe("incorrect");
    expect(assessMathFinalAnswer(problem, "x = 4").correct).toBe(true);
    expect(assessMathFinalAnswer(problem, "x = 5").correct).toBe(false);
  });

  it("assesses arithmetic, sign, transformation, incomplete, and unsupported cases at step level", () => {
    const problem = createMathProblem(createMathSource());
    const base = createSolutionSteps(problem)[0];
    const cases = [
      [{ ...base, expressionAfter: "2x = 9" }, "arithmetic-error"],
      [{ ...base, expressionAfter: "-2x = 8" }, "sign-error"],
      [{ ...base, expressionAfter: "2x = 4" }, "transformation-error"],
      [{ ...base, operation: "", mathematicalJustification: "" }, "incomplete-step"],
      [{ ...base, stepNumber: 3 as 1 | 2 }, "unsupported-reasoning"],
    ] as const;
    for (const [submitted, diagnostic] of cases) expect(assessMathStep(problem, submitted, problem.provenance).diagnostic).toBe(diagnostic);
  });

  it("progressively discloses validity, hint, principle, and corrected step", () => {
    const problem = createMathProblem(createMathSource());
    const wrong = { ...createSolutionSteps(problem)[0], expressionAfter: "2x = 9" };
    expect(assessMathStep(problem, wrong, problem.provenance, 1).feedback.hint).toBeUndefined();
    expect(assessMathStep(problem, wrong, problem.provenance, 3).feedback.hint).toContain("11");
    expect(assessMathStep(problem, wrong, problem.provenance, 5).feedback.correctedStep?.expressionAfter).toBe("2x = 8");
  });

  it("keeps final answer separate from substitution verification", () => {
    const problem = createMathProblem(createMathSource());
    const valid = verifyMathAnswer(problem, "2(4) + 3 = 11");
    const invalid = verifyMathAnswer(problem, "2(5) + 3 = 11");
    expect(problem.expectedAnswer).toBe("x = 4");
    expect(valid.valid).toBe(true);
    expect(invalid.valid).toBe(false);
    expect(invalid.diagnostic).toBe("verification-failure");
  });

  it("regenerates one traceable visualization lens from the same problem", () => {
    const problem = createMathProblem(createMathSource());
    const first = regenerateMathVisualizationLens(problem);
    const changedProblem = { ...problem, sourceObject: { ...problem.sourceObject, version: 2 }, updatedAt: "2026-01-02T00:00:00.000Z" };
    const second = regenerateMathVisualizationLens(changedProblem);
    expect(first.sourceObjectId).toBe(problem.sourceObject.id);
    expect(first.operationSteps).toHaveLength(2);
    expect(second.sourceVersion).toBe(2);
    expect(second.provenance.sourceObjectId).toBe(problem.sourceObject.id);
    expect(createSolutionSteps(changedProblem)[0].provenance.sourceVersion).toBe(2);
  });

  it("contains the required ten deterministic golden cases", () => {
    const dataset = createMathGoldenDataset(createMathSource());
    expect(dataset.length).toBeGreaterThanOrEqual(10);
    expect(new Set(dataset.map((item) => item.id)).size).toBe(dataset.length);
    expect(dataset.every((item) => item.problem.provenance.sourceObjectId === item.problem.sourceObject.id)).toBe(true);
    expect(dataset.map((item) => item.expectedDiagnostic)).toEqual(expect.arrayContaining(["sign-error", "arithmetic-error", "transformation-error", "incomplete-step", "verification-failure", "unsupported-reasoning"]));
    expect(dataset.map((item) => item.category)).toEqual(expect.arrayContaining(["positive-coefficients", "negative-coefficient", "negative-constant", "fractional-coefficient", "equivalent-transformation", "invalid-transformation", "incomplete-step", "wrong-intermediate-correct-final", "wrong-final-correct-intermediate", "alternative-valid-path"]));
  });

  it("proves every golden negative case is rejected and verification failure is not bypassed", () => {
    const dataset = createMathGoldenDataset(createMathSource());
    for (const item of dataset) for (const invalid of item.invalidSteps) expect(["incorrect", "incomplete"]).toContain(assessMathStep(item.problem, invalid, item.provenance).evaluation);
    const invalidIntermediate = dataset.find((item) => item.id === "math-golden-invalid-intermediate");
    expect(invalidIntermediate && assessMathStep(invalidIntermediate.problem, invalidIntermediate.invalidSteps[0], invalidIntermediate.provenance).score).toBe(0);
    expect(verifyMathAnswer(dataset[0].problem, "2(5) + 3 = 11").valid).toBe(false);
  });

  it("keeps system assessment separate from direct teacher override and persists independent events", () => {
    const problem = createMathProblem(createMathSource());
    const assessment = assessMathStep(problem, { ...createSolutionSteps(problem)[0], expressionAfter: "2x = 9" }, problem.provenance);
    const overridden = applyMathStepTeacherOverride(assessment, "correct", "قبول تربوي بعد مراجعة كتابة الطالب", "teacher-qa");
    expect(overridden.evaluation).toBe("incorrect");
    expect(overridden.effectiveEvaluation).toBe("correct");
    expect(overridden.teacherOverride?.originalAssessment.evaluation).toBe("incorrect");
    expect(overridden.teacherOverride?.teacherDecision).toBe("correct");
    expect(overridden.teacherOverride?.actorContext).toBe("teacher-qa");
    expect(overridden.events.map((event) => event.eventType)).toEqual(["system-assessment", "teacher-override"]);
    expect(overridden.teacherOverride?.provenance.teacherApproved).toBe(true);
  });

  it("rejects duplicate step IDs and broken provenance without crashing", () => {
    const problem = createMathProblem(createMathSource());
    const steps = createSolutionSteps(problem);
    expect(validateMathStepSequence(steps)).toBe(true);
    expect(validateMathStepSequence([{ ...steps[0], id: steps[1].id }, steps[1]])).toBe(false);
    expect(validateMathStepSequence([{ ...steps[0], provenance: { ...steps[0].provenance, sourceVersion: 99 } }, steps[1]])).toBe(false);
    expect(assessMathStep(problem, { ...steps[0], sourceProblemId: "unknown-problem" }, problem.provenance).diagnostic).toBe("unsupported-reasoning");
  });

  it("round-trips stable problem and step provenance through JSON and rejects malformed payloads safely", () => {
    const problem = createMathProblem(createMathSource());
    const restored = deserializeMathProblem(JSON.parse(JSON.stringify(problem)));
    expect(restored?.id).toBe(problem.id);
    expect(restored?.provenance.sourceObjectId).toBe(problem.provenance.sourceObjectId);
    expect(deserializeMathProblem(null)).toBeNull();
    expect(deserializeMathProblem({ id: "bad", equation: "x + y = 1" })).toBeNull();
    expect(deserializeMathProblem({ id: problem.id, equation: problem.equation, expectedAnswer: problem.expectedAnswer, sourceObject: problem.sourceObject, provenance: { ...problem.provenance, sourceObjectId: "broken" } })).toBeNull();
    expect(deserializeMathProblem({ id: problem.id, equation: problem.equation, expectedAnswer: problem.expectedAnswer, sourceObject: problem.sourceObject, provenance: problem.provenance, unknownField: true })).not.toBeNull();
  });

  it("preserves the shared math session and teacher override through lesson save, migration, and restore", () => {
    const lesson = createLesson();
    const session = lesson.mathematics.mathStepSession!;
    const assessment = assessMathStep(session.problem, session.steps[0], session.problem.provenance);
    const overridden = applyMathStepTeacherOverride(assessment, "correct", "اعتماد المعلم بعد مراجعة التبرير", "teacher-qa");
    lesson.mathematics.mathStepSession = { ...session, assessments: [overridden] };
    const raw = JSON.parse(serializeLesson(lesson)) as Record<string, any>;
    raw.schemaVersion = 1;
    const restored = deserializeLesson(JSON.stringify(raw));
    expect(restored?.mathematics.mathStepSession?.problem.id).toBe(session.problem.id);
    expect(restored?.mathematics.mathStepSession?.steps).toHaveLength(2);
    expect(restored?.mathematics.mathStepSession?.steps[0].provenance.sourceObjectId).toBe(session.problem.id);
    expect(restored?.mathematics.mathStepSession?.assessments[0].evaluation).toBe("correct");
    expect(restored?.mathematics.mathStepSession?.assessments[0].effectiveEvaluation).toBe("correct");
    expect(restored?.mathematics.mathStepSession?.assessments[0].teacherOverride?.teacherDecision).toBe("correct");
    expect(restored?.mathematics.mathStepSession?.assessments[0].events.map((event) => event.eventType)).toEqual(["system-assessment", "teacher-override"]);
  });

  it("fails safely for malformed math sessions, invalid steps, invalid assessments, and broken provenance", () => {
    const session = createLesson().mathematics.mathStepSession!;
    expect(deserializeMathStepSession(null)).toBeNull();
    expect(deserializeMathStepSession({ ...session, steps: [{ ...session.steps[0], id: session.steps[1].id }, session.steps[1]] })).toBeNull();
    expect(deserializeMathStepSession({ ...session, steps: [{ ...session.steps[0], provenance: { ...session.steps[0].provenance, sourceVersion: 99 } }, session.steps[1]] })).toBeNull();
    expect(deserializeMathStepSession({ ...session, assessments: [{ problemId: session.problem.id, events: [] }] })).toBeNull();
    expect(deserializeMathStepSession({ ...session, problem: { ...session.problem, provenance: { ...session.problem.provenance, sourceObjectId: "broken" } } })).toBeNull();
    const oldLesson = JSON.parse(serializeLesson(createLesson())) as Record<string, any>;
    oldLesson.schemaVersion = 1;
    delete oldLesson.mathematics.mathStepSession;
    expect(deserializeLesson(JSON.stringify(oldLesson))?.mathematics.mathStepSession?.problem.equation).toBe("2x + 3 = 11");
  });

  it("records reproducible NODE/VITEST benchmarks for 100, 250, and 500 objects/steps", () => {
    const source = createMathSource();
    const measurements = [100, 250, 500].map((count) => {
      const started = performance.now();
      const problem = createMathProblem(source);
      const steps = createSolutionSteps(problem);
      const assessments = Array.from({ length: count }, (_, index) => assessMathStep(problem, { ...steps[index % 2], id: `${steps[index % 2].id}_${count}_${index}` }, problem.provenance));
      const serialized = JSON.stringify({ problem, steps, assessments, lens: regenerateMathVisualizationLens(problem), verification: verifyMathAnswer(problem, "2(4) + 3 = 11") });
      const restored = JSON.parse(serialized) as { problem: typeof problem; assessments: typeof assessments };
      const elapsedMs = Number((performance.now() - started).toFixed(3));
      expect(restored.problem.id).toBe(problem.id);
      expect(restored.assessments).toHaveLength(count);
      expect(assessments.every((assessment) => assessment.feedback.title === "خطوة صحيحة")).toBe(true);
      return { count, elapsedMs };
    });
    console.log(JSON.stringify({ environment: "NODE/VITEST BENCHMARK", operations: ["creation", "serialization", "restore", "assessment", "feedback", "verification"], measurements }));
    expect(measurements.every(({ elapsedMs }) => elapsedMs < 1000)).toBe(true);
  });

  it("keeps assessment deterministic for the same structured input", () => {
    const problem = createMathProblem(createMathSource());
    const step = createSolutionSteps(problem)[0];
    const first = assessMathStep(problem, step, problem.provenance, 4, "2026-01-01T00:00:00.000Z");
    const second = assessMathStep(problem, step, problem.provenance, 4, "2026-01-01T00:00:00.000Z");
    expect({ evaluation: first.evaluation, diagnostic: first.diagnostic, feedback: first.feedback }).toEqual({ evaluation: second.evaluation, diagnostic: second.diagnostic, feedback: second.feedback });
  });
});
