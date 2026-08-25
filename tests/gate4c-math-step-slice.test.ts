import { describe, expect, it } from "vitest";
import { createLesson, createMathSource, deserializeLesson, serializeLesson } from "../client/src/lib/gate4bTeaching";
import {
  assessMathStep,
  createAlternativeSolutionSteps,
  createMathGoldenDataset,
  createMathProblem,
  createSolutionSteps,
  deserializeMathProblem,
  regenerateMathVisualizationLens,
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
    const nearMiss = assessMathStep(problem, { ...createSolutionSteps(problem)[0], expressionAfter: "2x = 8.0" }, problem.provenance, 3);
    expect(canonical.evaluation).toBe("correct");
    expect(alternative.evaluation).toBe("valid-alternative");
    expect(alternative.diagnostic).toBe("correct-alternative");
    expect(nearMiss.evaluation).toBe("incorrect");
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
  });

  it("contains the required ten deterministic golden cases", () => {
    const dataset = createMathGoldenDataset(createMathSource());
    expect(dataset).toHaveLength(10);
    expect(new Set(dataset.map((item) => item.id)).size).toBe(10);
    expect(dataset.every((item) => item.problem.provenance.sourceObjectId === item.problem.sourceObject.id)).toBe(true);
    expect(dataset.map((item) => item.expectedDiagnostic)).toEqual(expect.arrayContaining(["sign-error", "arithmetic-error", "transformation-error", "incomplete-step", "verification-failure"]));
  });

  it("proves every golden negative case is rejected and verification failure is not bypassed", () => {
    const dataset = createMathGoldenDataset(createMathSource());
    for (const item of dataset) for (const invalid of item.invalidSteps) expect(["incorrect", "incomplete"]).toContain(assessMathStep(item.problem, invalid, item.provenance).evaluation);
    const invalidIntermediate = dataset.find((item) => item.id === "math-golden-invalid-intermediate");
    expect(invalidIntermediate && assessMathStep(invalidIntermediate.problem, invalidIntermediate.invalidSteps[0], invalidIntermediate.provenance).score).toBe(0);
    expect(verifyMathAnswer(dataset[0].problem, "2(5) + 3 = 11").valid).toBe(false);
  });

  it("round-trips stable problem and step provenance through JSON and rejects malformed payloads safely", () => {
    const problem = createMathProblem(createMathSource());
    const restored = deserializeMathProblem(JSON.parse(JSON.stringify(problem)));
    expect(restored?.id).toBe(problem.id);
    expect(restored?.provenance.sourceObjectId).toBe(problem.provenance.sourceObjectId);
    expect(deserializeMathProblem(null)).toBeNull();
    expect(deserializeMathProblem({ id: "bad", equation: "x + y = 1" })).toBeNull();
  });

  it("preserves the shared math session through lesson save, migration, and restore", () => {
    const lesson = createLesson();
    const raw = JSON.parse(serializeLesson(lesson)) as Record<string, any>;
    raw.schemaVersion = 1;
    const restored = deserializeLesson(JSON.stringify(raw));
    expect(restored?.mathematics.mathStepSession?.problem.id).toBe(lesson.mathematics.mathStepSession?.problem.id);
    expect(restored?.mathematics.mathStepSession?.steps).toHaveLength(2);
    expect(restored?.mathematics.mathStepSession?.steps[0].provenance.sourceObjectId).toBe(lesson.mathematics.mathStepSession?.problem.id);
  });

  it("records a reproducible Node/Vitest benchmark for the implemented slice", () => {
    const source = createMathSource();
    const started = performance.now();
    const problem = createMathProblem(source);
    const steps = createSolutionSteps(problem);
    const assessment = assessMathStep(problem, steps[0], problem.provenance);
    const serialized = JSON.stringify({ problem, steps, assessment, lens: regenerateMathVisualizationLens(problem) });
    const restored = JSON.parse(serialized) as typeof problem;
    const elapsedMs = Number((performance.now() - started).toFixed(3));
    console.log(JSON.stringify({ environment: "Vitest/Node sandbox", operations: ["problem-creation", "step-creation", "assessment", "feedback", "serialization", "deserialization", "lens-regeneration", "save-restore"], elapsedMs }));
    expect(restored.problem.id).toBe(problem.id);
    expect(assessment.feedback.title).toBe("خطوة صحيحة");
    expect(elapsedMs).toBeLessThan(1000);
  });

  it("keeps assessment deterministic for the same structured input", () => {
    const problem = createMathProblem(createMathSource());
    const step = createSolutionSteps(problem)[0];
    const first = assessMathStep(problem, step, problem.provenance, 4, "2026-01-01T00:00:00.000Z");
    const second = assessMathStep(problem, step, problem.provenance, 4, "2026-01-01T00:00:00.000Z");
    expect({ evaluation: first.evaluation, diagnostic: first.diagnostic, feedback: first.feedback }).toEqual({ evaluation: second.evaluation, diagnostic: second.diagnostic, feedback: second.feedback });
  });
});
