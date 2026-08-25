import { describe, expect, it } from "vitest";
import {
  applyTeacherOverride,
  assessActivity,
  createArabicSource,
  createActivity,
  createGrammarLens,
  createJourney,
  deserializeLesson,
  evaluateAnswer,
  serializeLesson,
  updateI3rabField,
  updateI3rabTarget,
  type ActivityDefinition,
  type GrammarLens,
} from "@/lib/gate4bTeaching";
import { arabicI3rabGoldenCases } from "./fixtures/arabic-i3rab.golden";

const buildArabicActivity = (sentence = "كتبَ الطالبُ الدرسَ.") => {
  const source = createArabicSource(sentence);
  const lens = createGrammarLens(source, "2026-01-01T00:00:00.000Z");
  return { source, lens, activity: createActivity("arabic", source, lens, "2026-01-01T00:00:00.000Z") };
};

const completeResponse = (activity: ActivityDefinition, lens: GrammarLens, targetWordId: string) => {
  let next = updateI3rabTarget(activity, lens, targetWordId);
  const expected = next.i3rab!.expected;
  next = updateI3rabField(next, "grammaticalRole", expected.grammaticalRole);
  next = updateI3rabField(next, "case", expected.case);
  next = updateI3rabField(next, "caseMarker", expected.caseMarker);
  return updateI3rabField(next, "reason", expected.reason);
};

describe("Gate 4C Arabic Grammar / I3rab vertical slice", () => {
  it("creates a canonical SentenceObject and a derived I3rab Lens without mutating source", () => {
    const { source, lens } = buildArabicActivity();
    expect(source.type).toBe("SentenceObject");
    expect(source.content).toBe("كتبَ الطالبُ الدرسَ.");
    expect(lens.type).toBe("GrammarLens");
    expect(lens.lensType).toBe("I3rab");
    expect(lens.provenance.sourceObjectId).toBe(source.id);
    expect(lens.sourceRange).toEqual({ start: 0, end: source.content.length });
    expect(lens.words.map((word) => word.text)).toEqual(["كتبَ", "الطالبُ", "الدرسَ."]);
    expect(source.content).toBe("كتبَ الطالبُ الدرسَ.");
  });

  it("supports the structured teacher-to-student I3rab response", () => {
    const { lens, activity } = buildArabicActivity();
    const selected = updateI3rabTarget(activity, lens, "word_2");
    expect(selected.i3rab?.targetWordId).toBe("word_2");
    expect(selected.i3rab?.response).toEqual({ wordId: "word_2" });
    const complete = completeResponse(activity, lens, "word_2");
    const result = evaluateAnswer(complete, complete.answer);
    expect(result).toEqual({ state: "correct", score: 1 });
  });

  it("evaluates role, case, marker, reasoning, incomplete, and alternative outcomes deterministically", () => {
    const { lens, activity } = buildArabicActivity();
    const correct = completeResponse(activity, lens, "word_2");
    expect(evaluateAnswer(correct, "").state).toBe("incomplete");
    expect(evaluateAnswer(updateI3rabField(correct, "grammaticalRole", "مفعول به"), updateI3rabField(correct, "grammaticalRole", "مفعول به").answer).diagnostic).toBe("role-error");
    expect(evaluateAnswer(updateI3rabField(correct, "case", "منصوب"), updateI3rabField(correct, "case", "منصوب").answer).diagnostic).toBe("case-error");
    expect(evaluateAnswer(updateI3rabField(correct, "caseMarker", "الفتحة"), updateI3rabField(correct, "caseMarker", "الفتحة").answer).diagnostic).toBe("marker-error");
    expect(evaluateAnswer(updateI3rabField(correct, "reason", "لأنه مفعول به"), updateI3rabField(correct, "reason", "لأنه مفعول به").answer).diagnostic).toBe("reasoning-error");
    const alternative = updateI3rabField(correct, "caseMarker", "ضمة");
    expect(evaluateAnswer(alternative, alternative.answer).state).toBe("valid-alternative");
  });

  it("matches the explicit golden dataset only for the supported subset", () => {
    for (const fixture of arabicI3rabGoldenCases) {
      const { lens, activity } = buildArabicActivity(fixture.input);
      const target = lens.words.find((word) => word.text === fixture.targetWord);
      expect(target, fixture.id).toBeDefined();
      const complete = completeResponse(activity, lens, target!.id);
      expect(complete.i3rab?.expected, fixture.id).toEqual(fixture.expectedResult);
      expect(evaluateAnswer(complete, complete.answer).state, fixture.id).toBe("correct");
      for (const incorrect of fixture.incorrectCases) {
        const altered = updateI3rabField(complete, incorrect.field as "grammaticalRole" | "case" | "caseMarker" | "reason", incorrect.value);
        expect(evaluateAnswer(altered, altered.answer).state, `${fixture.id}:${incorrect.field}`).toBe("partially-correct");
      }
    }
  });

  it("preserves provenance, IDs, assessment, feedback, and override through lesson round-trip", () => {
    const base = createJourney("arabic");
    const prepared = completeResponse(base.activity, base.lens as GrammarLens, "word_2");
    const assessed = assessActivity(prepared, prepared.answer, base.lens.provenance, "2026-01-01T00:00:00.000Z");
    const overridden = applyTeacherOverride(assessed.assessment, assessed.activity, "partially-correct", "مراجعة المعلم للسياق", "أحتاج إبقاء الخطوة مفتوحة للمناقشة.", base.lens.provenance, "2026-01-01T00:00:01.000Z");
    const lesson = createJourney("arabic");
    const serialized = serializeLesson({ schemaVersion: 2, lessonId: "lesson_i3rab", title: "I3rab", arabic: { ...lesson, activity: assessed.activity, assessment: overridden.assessment, feedback: overridden.feedback }, mathematics: createJourney("mathematics"), savedAt: "2026-01-01T00:00:00.000Z" });
    const restored = deserializeLesson(serialized);
    expect(restored).not.toBeNull();
    expect(restored!.arabic.source.id).toBe(lesson.source.id);
    expect(restored!.arabic.lens.provenance.sourceObjectId).toBe(lesson.source.id);
    expect(restored!.arabic.activity.i3rab?.response).toEqual(prepared.i3rab?.response);
    expect(restored!.arabic.assessment?.evaluation).toBe("correct");
    expect(restored!.arabic.assessment?.effectiveEvaluation).toBe("partially-correct");
    expect(restored!.arabic.assessment?.events.map((event) => event.eventType)).toEqual(["system-assessment", "teacher-override"]);
    expect(restored!.arabic.feedback?.teacherOverride?.state).toBe("partially-correct");
  });

  it("migrates a previous lesson payload by rebuilding the structured I3rab challenge", () => {
    const lesson = createJourney("arabic");
    const raw = JSON.parse(serializeLesson({ schemaVersion: 1, lessonId: "lesson_v1_i3rab", title: "legacy", arabic: lesson, mathematics: createJourney("mathematics"), savedAt: new Date().toISOString() }));
    delete raw.arabic.activity.i3rab;
    const restored = deserializeLesson(JSON.stringify(raw));
    expect(restored).not.toBeNull();
    expect(restored!.schemaVersion).toBe(2);
    expect(restored!.arabic.activity.i3rab?.targetWordId).toBe("word_2");
    expect(restored!.arabic.activity.i3rab?.expected.grammaticalRole).toBe("فاعل");
    expect(restored!.arabic.lens.provenance.sourceObjectId).toBe(restored!.arabic.source.id);
  });

  it("rejects malformed persisted I3rab answers safely instead of inventing correctness", () => {
    const base = createJourney("arabic");
    const raw = JSON.parse(serializeLesson({ schemaVersion: 2, lessonId: "lesson_bad_i3rab", title: "bad", arabic: base, mathematics: createJourney("mathematics"), savedAt: new Date().toISOString() }));
    raw.arabic.activity.i3rab.response = { wordId: "word_2", grammaticalRole: { injected: true } };
    const restored = deserializeLesson(JSON.stringify(raw));
    expect(restored).toBeNull();
  });
});
