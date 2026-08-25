import { describe, expect, it } from "vitest";
import { hasCapability } from "../client/src/lib/educationalObjects";
import {
  assessActivity,
  createArabicSource,
  createActivity,
  createGrammarLens,
  createJourney,
  createLesson,
  createMathSource,
  createMathVisualizationLens,
  deserializeLesson,
  evaluateAnswer,
  serializeLesson,
} from "../client/src/lib/gate4bTeaching";
import { getObjectDefinition } from "../client/src/lib/objectRegistry";

const semanticJourney = (journey: ReturnType<typeof createJourney>) => ({
  subject: journey.subject,
  source: { id: journey.source.id, type: journey.source.type, content: journey.source.content, capabilities: journey.source.capabilities },
  lens: { id: journey.lens.id, type: journey.lens.type, sourceObjectId: journey.lens.sourceObjectId, sourceRange: journey.lens.sourceRange, provenance: journey.lens.provenance },
  activity: { id: journey.activity.id, sourceObjectId: journey.activity.sourceObjectId, lensId: journey.activity.lensId, prompt: journey.activity.prompt, expectedAnswer: journey.activity.expectedAnswer },
});

describe("Gate 4B controlled vertical slice", () => {
  it("creates both sources through the single canonical registry/factory", () => {
    expect(getObjectDefinition("SentenceObject")?.renderer).toBe("sentence");
    expect(getObjectDefinition("EquationObject")?.renderer).toBe("equation");
    const arabic = createArabicSource();
    const math = createMathSource();
    expect(arabic.type).toBe("SentenceObject");
    expect(math.type).toBe("EquationObject");
    expect(hasCapability(arabic, "interactive")).toBe(true);
    expect(hasCapability(math, "interactive")).toBe(true);
    expect(arabic.schemaVersion).toBe(math.schemaVersion);
  });

  it("transforms Arabic source into a traceable deterministic Grammar Lens", () => {
    const source = createArabicSource();
    const lens = createGrammarLens(source);
    expect(lens.type).toBe("GrammarLens");
    expect(lens.sourceObjectId).toBe(source.id);
    expect(lens.sourceRange).toEqual({ start: 0, end: source.content.length });
    expect(lens.provenance).toMatchObject({ sourceObjectId: source.id, sourceVersion: source.version, derivationType: "deterministic-grammar-lens" });
    expect(lens.words.map((word) => word.grammaticalRole)).toEqual(["فعل", "فاعل", "مفعول به"]);
  });

  it("transforms Math source into a traceable visualization Lens with explicit solution", () => {
    const source = createMathSource();
    const lens = createMathVisualizationLens(source);
    expect(lens.type).toBe("MathVisualizationLens");
    expect(lens.sourceObjectId).toBe(source.id);
    expect(lens.provenance.sourceRange).toEqual({ start: 0, end: source.content.length });
    expect(lens.operationSteps.map((step) => step.equation)).toEqual(["2x = 8", "x = 4"]);
    expect(lens.solutionX).toBe(4);
  });

  it("uses the same activity and assessment functions for Arabic and Mathematics", () => {
    const arabic = createJourney("arabic");
    const math = createJourney("mathematics");
    expect(evaluateAnswer(arabic.activity, "word_2")).toEqual({ state: "correct", score: 1 });
    expect(evaluateAnswer(math.activity, "4")).toEqual({ state: "correct", score: 1 });
    expect(evaluateAnswer(arabic.activity, "word_1").state).toBe("partially-correct");
    expect(evaluateAnswer(math.activity, "8").state).toBe("partially-correct");
    expect(evaluateAnswer(arabic.activity, "word_3").state).toBe("partially-correct");
    expect(evaluateAnswer(math.activity, "9").state).toBe("incorrect");

    const arabicAssessment = assessActivity(arabic.activity, "word_2", arabic.lens.provenance);
    const mathAssessment = assessActivity(math.activity, "4", math.lens.provenance);
    expect(arabicAssessment.assessment.evaluation).toBe("correct");
    expect(mathAssessment.assessment.evaluation).toBe("correct");
    expect(arabicAssessment.feedback.title).toBe("إجابة صحيحة");
    expect(mathAssessment.feedback.title).toBe("إجابة صحيحة");
    expect(arabicAssessment.assessment.provenance.sourceObjectId).toBe(arabic.source.id);
    expect(mathAssessment.assessment.provenance.sourceObjectId).toBe(math.source.id);
  });

  it("preserves IDs, source references, capabilities and assessment state through lesson round-trip", () => {
    const lesson = createLesson();
    const assessed = assessActivity(lesson.arabic.activity, "word_2", lesson.arabic.lens.provenance);
    lesson.arabic = { ...lesson.arabic, activity: assessed.activity, assessment: assessed.assessment, feedback: assessed.feedback, selectedStage: "feedback" };
    const restored = deserializeLesson(serializeLesson(lesson));
    expect(restored).not.toBeNull();
    expect(semanticJourney(restored!.arabic)).toEqual(semanticJourney(lesson.arabic));
    expect(restored!.arabic.source.id).toBe(lesson.arabic.source.id);
    expect(restored!.arabic.lens.provenance.sourceObjectId).toBe(lesson.arabic.source.id);
    expect(restored!.arabic.source.capabilities).toEqual(lesson.arabic.source.capabilities);
    expect(restored!.arabic.activity.attemptCount).toBe(1);
    expect(restored!.arabic.assessment?.id).toBe(lesson.arabic.assessment?.id);
    expect(restored!.arabic.feedback?.id).toBe(lesson.arabic.feedback?.id);
  });

  it("rejects malformed lessons without executing or silently inventing state", () => {
    expect(deserializeLesson("{}")).toBeNull();
    expect(deserializeLesson("not-json")).toBeNull();
    const activity = createActivity("arabic", createArabicSource(), createGrammarLens(createArabicSource()));
    expect(activity.expectedAnswer).toBe("word_2");
  });

  it("measures the repeatable domain path without claiming real-browser performance", () => {
    const start = performance.now();
    for (let index = 0; index < 100; index += 1) {
      const journey = createJourney(index % 2 === 0 ? "arabic" : "mathematics");
      const result = assessActivity(journey.activity, journey.subject === "arabic" ? "word_2" : "4", journey.lens.provenance);
      const restored = deserializeLesson(serializeLesson({ ...createLesson(), arabic: journey.subject === "arabic" ? { ...journey, assessment: result.assessment, feedback: result.feedback, activity: result.activity } : createJourney("arabic"), mathematics: journey.subject === "mathematics" ? { ...journey, assessment: result.assessment, feedback: result.feedback, activity: result.activity } : createJourney("mathematics") }));
      expect(restored).not.toBeNull();
    }
    const totalMs = performance.now() - start;
    console.log(JSON.stringify({ datasetJourneys: 100, createTransformAssessSerializeRestoreMs: Number(totalMs.toFixed(3)) }));
    expect(totalMs).toBeLessThan(1000);
  });
});
