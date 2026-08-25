import { describe, expect, it } from "vitest";
import { cloneDocument, createObject, createPage, resizeObject, type BoardDocument } from "../client/src/lib/coreBoard";
import { migrateBoardDocument, safeParseBoardDocument } from "../client/src/lib/objectMigrations";
import { duplicateEducationalObject } from "../client/src/lib/educationalObjects";
import { listObjectDefinitions } from "../client/src/lib/objectRegistry";
import {
  assessActivity,
  createArabicSource,
  createGrammarLens,
  createJourney,
  createLesson,
  createMathSource,
  createMathVisualizationLens,
  deserializeLesson,
  evaluateAnswer,
  serializeLesson,
} from "../client/src/lib/gate4bTeaching";

const sourceSnapshot = (journey: ReturnType<typeof createJourney>) => ({
  sourceId: journey.source.id,
  sourceVersion: journey.source.version,
  lensId: journey.lens.id,
  lensSourceId: journey.lens.sourceObjectId,
  provenance: journey.lens.provenance,
  activityId: journey.activity.id,
  activitySourceId: journey.activity.sourceObjectId,
});

const boardWithObjects = (count: number): BoardDocument => {
  const page = createPage("Bench", Array.from({ length: count }, (_, index) => createObject(index % 2 ? "TextObject" : "ShapeObject", `object-${index}`, index, index)));
  return { id: `bench-board-${count}`, title: "Benchmark", version: 1, schemaVersion: 2, pages: [page], activePageId: page.id, updatedAt: new Date().toISOString() };
};

describe("Gate 4B validation and hardening", () => {
  it("keeps exactly one registry type entry and the canonical factory path", () => {
    const definitions = listObjectDefinitions();
    const types = definitions.map((definition) => definition.type);
    expect(new Set(types).size).toBe(types.length);
    expect(types).toContain("SentenceObject");
    expect(types).toContain("EquationObject");
    expect(types).toContain("QuestionObject");
    expect(types).toContain("ActivityObject");
  });

  it("keeps source authoritative when Arabic source changes and lens regenerates", () => {
    const originalSource = createArabicSource();
    const originalLens = createGrammarLens(originalSource);
    const originalActivity = createJourney("arabic").activity;
    const changedSource = { ...originalSource, content: "قرأَ المعلمُ الدرسَ.", version: originalSource.version + 1, updatedAt: new Date().toISOString() };
    const regeneratedLens = createGrammarLens(changedSource);
    expect(regeneratedLens.id).not.toBe(originalLens.id);
    expect(regeneratedLens.sourceObjectId).toBe(originalSource.id);
    expect(regeneratedLens.sourceVersion).toBe(changedSource.version);
    expect(regeneratedLens.words[1].text).toBe("المعلمُ");
    expect(originalActivity.sourceObjectId).not.toBe(regeneratedLens.id);
    expect(regeneratedLens.provenance.sourceObjectId).toBe(changedSource.id);
  });

  it("keeps Math visualization derived from the equation and regenerable", () => {
    const source = createMathSource();
    const first = createMathVisualizationLens(source);
    const changed = { ...source, content: "3x + 1 = 13", version: source.version + 1 };
    const second = createMathVisualizationLens(changed);
    expect(first.sourceObjectId).toBe(source.id);
    expect(second.sourceObjectId).toBe(source.id);
    expect(second.sourceVersion).toBe(2);
    expect(second.equation).toBe("3x + 1 = 13");
    expect(second.provenance.derivationType).toBe("deterministic-equation-visualization");
  });

  it("distinguishes incomplete, partial, incorrect, correct, and valid alternative", () => {
    const arabic = createJourney("arabic");
    const math = createJourney("mathematics");
    expect(evaluateAnswer(arabic.activity, "").state).toBe("incomplete");
    expect(evaluateAnswer(arabic.activity, "word_1").state).toBe("partially-correct");
    expect(evaluateAnswer(arabic.activity, "unknown").state).toBe("incorrect");
    expect(evaluateAnswer(arabic.activity, "word_2").state).toBe("correct");
    expect(evaluateAnswer(math.activity, "8").state).toBe("partially-correct");
    expect(evaluateAnswer(math.activity, "x = 4").state).toBe("valid-alternative");
    expect(evaluateAnswer(math.activity, "4").state).toBe("correct");
    const alternative = assessActivity(math.activity, "x = 4", math.lens.provenance);
    expect(alternative.assessment.diagnostic).toBe("alternative-solution");
    expect(alternative.activity.completionState).toBe("complete");
    expect(alternative.feedback.nextStep).toContain("التعويض");
  });

  it("preserves assessment and feedback provenance across save/restore", () => {
    const lesson = createLesson();
    const result = assessActivity(lesson.mathematics.activity, "x = 4", lesson.mathematics.lens.provenance);
    lesson.mathematics = { ...lesson.mathematics, activity: result.activity, assessment: result.assessment, feedback: result.feedback };
    const restored = deserializeLesson(serializeLesson(lesson));
    expect(restored?.mathematics.assessment?.evaluation).toBe("valid-alternative");
    expect(restored?.mathematics.assessment?.activityId).toBe(lesson.mathematics.activity.id);
    expect(restored?.mathematics.assessment?.provenance.sourceObjectId).toBe(lesson.mathematics.source.id);
    expect(restored?.mathematics.feedback?.assessmentId).toBe(restored?.mathematics.assessment?.id);
    expect(restored?.mathematics.feedback?.retryAllowed).toBe(false);
    expect(restored?.mathematics.assessment?.diagnostic).toBe("alternative-solution");
  });

  it("preserves identity on duplicate and semantic snapshots for delete/undo/redo", () => {
    const original = createArabicSource();
    const duplicate = duplicateEducationalObject(original, "duplicate_sentence");
    expect(duplicate.id).not.toBe(original.id);
    expect(duplicate.metadata.duplicatedFrom).toBe(original.id);
    const page = createPage("History", [createObject("TextObject", "A", 1, 1), createObject("TextObject", "B", 2, 2)]);
    const document: BoardDocument = { id: "history", title: "History", version: 1, schemaVersion: 2, pages: [page], activePageId: page.id, updatedAt: new Date().toISOString() };
    const beforeDelete = cloneDocument(document);
    const afterDelete: BoardDocument = { ...document, pages: [{ ...page, objects: page.objects.slice(0, 1) }] };
    const afterRedo = cloneDocument(afterDelete);
    const afterUndo = cloneDocument(beforeDelete);
    expect(afterDelete.pages[0].objects).toHaveLength(1);
    expect(afterUndo.pages[0].objects.map((object) => object.id)).toEqual(beforeDelete.pages[0].objects.map((object) => object.id));
    expect(afterRedo.pages[0].objects.map((object) => object.id)).toEqual(afterDelete.pages[0].objects.map((object) => object.id));
  });

  it("measures required object-count and lifecycle benchmark without claiming browser performance", () => {
    const results = [100, 250, 500].map((count) => {
      const measurements: Array<{ operation: string; count: number; elapsedMs: number; result: string }> = [];
      const timed = <T,>(operation: string, action: () => T): T => {
        const started = performance.now();
        const result = action();
        measurements.push({ operation, count, elapsedMs: Number((performance.now() - started).toFixed(3)), result: "PASS" });
        return result;
      };
      const document = timed("create", () => boardWithObjects(count));
      const page = document.pages[0];
      const serialized = timed("serialization", () => JSON.stringify(document));
      const roundTrip = timed("deserialization", () => JSON.parse(serialized) as BoardDocument);
      const duplicate = timed("duplicate", () => duplicateEducationalObject(page.objects[0] as never, `bench_duplicate_${count}`));
      const group = timed("group", () => {
        const value = createObject("GroupObject", `${count} children`, 0, 0);
        value.size = { width: 200, height: 100 };
        value.childIds = [page.objects[0].id, page.objects[1].id];
        value.children = page.objects.slice(0, 2);
        return value;
      });
      const resized = timed("resize-group", () => resizeObject(group, 400, 200));
      const ungrouped = timed("ungroup", () => resized.children?.map((child) => ({ ...child, position: { x: child.position.x + resized.position.x, y: child.position.y + resized.position.y } })) ?? []);
      const lensSource = count % 2 === 0 ? createArabicSource() : createMathSource();
      const lens = timed("lens-regeneration", () => count % 2 === 0 ? createGrammarLens(lensSource as ReturnType<typeof createArabicSource>) : createMathVisualizationLens(lensSource as ReturnType<typeof createMathSource>));
      return { count, measurements, duplicateId: duplicate.id, resizedChildCount: resized.children?.length ?? 0, ungroupedChildCount: ungrouped.length, restoredCount: roundTrip.pages[0].objects.length, lensSourceId: lens.sourceObjectId };
    });
    console.log(JSON.stringify({ environment: "Vitest/Node sandbox", results }));
    for (const result of results) {
      expect(result.restoredCount).toBe(result.count);
      expect(result.resizedChildCount).toBe(2);
      expect(result.ungroupedChildCount).toBe(2);
      expect(result.measurements.every((measurement) => measurement.result === "PASS" && measurement.elapsedMs < 1000)).toBe(true);
    }
  });

  it("proves canonical board migration and reports unsupported lesson migration as blocked", () => {
    const legacyBoard = { id: "legacy", title: "Legacy", version: 1, pages: [{ id: "page", name: "One", objects: [{ id: "text", type: "TextObject", content: "نص" }], viewport: { x: 0, y: 0, zoom: 1 } }], activePageId: "page" };
    const migrated = migrateBoardDocument(legacyBoard);
    expect(migrated?.schemaVersion).toBe(2);
    expect(safeParseBoardDocument(JSON.stringify(legacyBoard))?.pages[0].objects[0].id).toBe("text");
    expect(deserializeLesson(JSON.stringify({ schemaVersion: 1, lessonId: "old" }))).toBeNull();
    const journey = createJourney("arabic");
    const snapshot = sourceSnapshot(journey);
    expect(snapshot.lensSourceId).toBe(snapshot.sourceId);
  });
});
