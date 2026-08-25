import { describe, expect, it } from "vitest";
import { applyTeacherOverride, assessActivity, createLesson, createMathSource, createArabicSource, createGrammarLens, createMathVisualizationLens, deserializeLesson, serializeLesson } from "../client/src/lib/gate4bTeaching";
import { applyMathStepTeacherOverride, assessMathStep, createSolutionSteps } from "../client/src/lib/mathStepSlice";
import { getObjectDefinition } from "../client/src/lib/objectRegistry";
import { hasCapability } from "../client/src/lib/educationalObjects";

/* Gate 4C integration reminder: this file proves composition only; it defines no subject engine, registry, factory, assessment, feedback, event, or persistence model. */
describe("Gate 4C final Arabic + Mathematics integration", () => {
  it("uses the same canonical object, registry, factory, and capability boundaries", () => {
    const arabic = createArabicSource();
    const math = createMathSource();
    expect(getObjectDefinition("SentenceObject")?.renderer).toBe("sentence");
    expect(getObjectDefinition("EquationObject")?.renderer).toBe("equation");
    expect([arabic.type, math.type]).toEqual(["SentenceObject", "EquationObject"]);
    expect(arabic.schemaVersion).toBe(math.schemaVersion);
    expect(hasCapability(arabic, "interactive")).toBe(true);
    expect(hasCapability(math, "interactive")).toBe(true);
  });

  it("keeps Arabic and Mathematics object-to-lens-to-activity paths in one lesson", () => {
    const lesson = createLesson();
    const arabicLens = createGrammarLens(lesson.arabic.source);
    const mathLens = createMathVisualizationLens(lesson.mathematics.source);
    expect(arabicLens.sourceObjectId).toBe(lesson.arabic.source.id);
    expect(mathLens.sourceObjectId).toBe(lesson.mathematics.source.id);
    const arabicResult = assessActivity(lesson.arabic.activity, "word_2", arabicLens.provenance);
    const mathResult = assessActivity(lesson.mathematics.activity, "4", mathLens.provenance);
    expect(arabicResult.assessment.evaluation).toBe("correct");
    expect(mathResult.assessment.evaluation).toBe("correct");
    const restored = deserializeLesson(serializeLesson({
      ...lesson,
      arabic: { ...lesson.arabic, lens: arabicLens, activity: arabicResult.activity, assessment: arabicResult.assessment, feedback: arabicResult.feedback },
      mathematics: { ...lesson.mathematics, lens: mathLens, activity: mathResult.activity, assessment: mathResult.assessment, feedback: mathResult.feedback },
    }));
    expect(restored?.arabic.source.type).toBe("SentenceObject");
    expect(restored?.mathematics.source.type).toBe("EquationObject");
    expect(restored?.arabic.assessment?.provenance.sourceObjectId).toBe(lesson.arabic.source.id);
    expect(restored?.mathematics.assessment?.provenance.sourceObjectId).toBe(lesson.mathematics.source.id);
  });

  it("preserves separate Arabic and Mathematics teacher decisions over shared assessment infrastructure", () => {
    const lesson = createLesson();
    const arabicResult = assessActivity(lesson.arabic.activity, "word_1", lesson.arabic.lens.provenance);
    const arabicOverride = applyTeacherOverride(arabicResult.assessment, lesson.arabic.activity, "partially-correct", "المعلم قبل المحاولة الجزئية", "teacher-integration", lesson.arabic.lens.provenance);
    const mathSession = lesson.mathematics.mathStepSession!;
    const mathAssessment = assessMathStep(mathSession.problem, createSolutionSteps(mathSession.problem)[0], mathSession.problem.provenance);
    const mathOverride = applyMathStepTeacherOverride(mathAssessment, "correct", "اعتماد الخطوة بعد المراجعة", "teacher-integration");
    expect(arabicOverride.assessment.evaluation).toBe("partially-correct");
    expect(arabicOverride.assessment.effectiveEvaluation).toBe("partially-correct");
    expect(mathOverride.evaluation).toBe("correct");
    expect(mathOverride.effectiveEvaluation).toBe("correct");
    expect(arabicOverride.assessment.events.map((event) => event.eventType)).toEqual(["system-assessment", "teacher-override"]);
    expect(mathOverride.events.map((event) => event.eventType)).toEqual(["system-assessment", "teacher-override"]);
  });

  it("round-trips both subjects without crossing provenance or identity", () => {
    const lesson = createLesson();
    const mathSession = lesson.mathematics.mathStepSession!;
    const mathAssessment = assessMathStep(mathSession.problem, createSolutionSteps(mathSession.problem)[0], mathSession.problem.provenance);
    const payload = JSON.parse(serializeLesson({ ...lesson, mathematics: { ...lesson.mathematics, mathStepSession: { ...mathSession, assessments: [mathAssessment] } } })) as Record<string, unknown>;
    const restored = deserializeLesson(JSON.stringify(payload));
    expect(restored?.arabic.source.id).not.toBe(restored?.mathematics.source.id);
    expect(restored?.mathematics.mathStepSession?.assessments[0].problemId).toBe(restored?.mathematics.mathStepSession?.problem.id);
    expect(restored?.mathematics.mathStepSession?.assessments[0].provenance.sourceObjectId).toBe(restored?.mathematics.source.id);
  });
});
