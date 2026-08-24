import { describe, expect, it } from "vitest";
import { createRegisteredEducationalObject, getObjectDefinition, listObjectDefinitions, validateRegisteredObject } from "../client/src/lib/objectRegistry";
import { assertCapability, duplicateEducationalObject, lifecycleFor, toEnvelope, validateEducationalObject } from "../client/src/lib/educationalObjects";
import { migrateBoardDocument, migrateCoreObject, safeParseBoardDocument } from "../client/src/lib/objectMigrations";
import { applyCanvasRepresentation, createCanvasRepresentation, createGraphRepresentation } from "../client/src/lib/objectAdapters";
import { describeTransformation, supportedRepresentations } from "../client/src/lib/objectTransformations";
import { createActivityObject, createCrossSubjectProof, createQuestionObject, registerGeometryProof } from "../client/src/lib/genericObjects";
import { createDocument, persistDocument, restoreDocument } from "../client/src/lib/coreBoard";

describe("Gate 3A Educational Object Engine", () => {
  it("supports the documented lifecycle and stable/new identity rules", () => {
    const object = createRegisteredEducationalObject("TextObject", "lesson", 10, 20, "text_1");
    expect(validateEducationalObject(object).valid).toBe(true);
    expect(lifecycleFor("validated", object).metadata.lifecycleStage).toBe("validated");
    expect(duplicateEducationalObject(object, "text_2").id).toBe("text_2");
    expect(duplicateEducationalObject(object, "text_2").metadata.duplicatedFrom).toBe("text_1");
    expect(toEnvelope(object).schemaVersion).toBe(2);
  });

  it("resolves explicit capabilities and rejects unsupported operations", () => {
    const sentence = createRegisteredEducationalObject("SentenceObject", "قرأَ الطالبُ الكتابَ", 0, 0, "sentence_1");
    const question = createQuestionObject();
    assertCapability(sentence, "interactive");
    assertCapability(question, "assessable");
    expect(() => assertCapability(sentence, "assessable")).toThrow("does not support assessable");
    expect(validateRegisteredObject(question).valid).toBe(true);
  });

  it("keeps the registry extensible and registers a new type without Core Board changes", () => {
    expect(getObjectDefinition("QuestionObject")?.renderer).toBe("question");
    expect(getObjectDefinition("ActivityObject")?.renderer).toBe("activity");
    const before = listObjectDefinitions().length;
    const geometry = registerGeometryProof();
    expect(geometry.type).toBe("GeometryObject");
    expect(listObjectDefinitions().length).toBe(before + 1);
    expect(getObjectDefinition("GeometryObject")?.capabilities).toContain("resizable");
  });

  it("migrates legacy objects, preserves IDs, and retains unknown content safely", () => {
    const legacy = migrateCoreObject({ id: "legacy_1", type: "TextObject", content: "old", position: { x: 4, y: 5 }, size: { width: 100, height: 60 }, metadata: { locked: false, visible: true, version: 1 } });
    const unknown = migrateCoreObject({ id: "foreign_1", type: "FutureObject", content: { payload: "keep me" } });
    expect(legacy?.id).toBe("legacy_1");
    expect(legacy?.schemaVersion).toBe(2);
    expect(unknown?.id).toBe("foreign_1");
    expect(unknown?.metadata.unknownType).toBe("FutureObject");
    expect(unknown?.metadata.locked).toBe(true);
    expect(unknown?.data).toEqual({ payload: "keep me" });
  });

  it("migrates a board document and safely rejects malformed JSON", () => {
    const restored = safeParseBoardDocument(JSON.stringify({ id: "board_1", title: "Lesson", version: 1, pages: [{ id: "page_1", name: "One", objects: [{ id: "text_1", type: "TextObject", content: "hello" }], viewport: { x: 0, y: 0, zoom: 1 } }], activePageId: "page_1" }));
    expect(restored?.schemaVersion).toBe(2);
    expect(restored?.pages[0].objects[0].id).toBe("text_1");
    expect(migrateBoardDocument({ pages: [] })).toBeNull();
    expect(safeParseBoardDocument("not-json")).toBeNull();
  });

  it("does not execute or alter unsafe content during validation", () => {
    const unsafeLooking = "<script>window.__shouldNotRun = true</script>";
    const object = createRegisteredEducationalObject("TextObject", unsafeLooking, 0, 0, "safe_text");
    expect(object.content).toBe(unsafeLooking);
    expect(validateRegisteredObject(object).valid).toBe(true);
    expect(Object.keys(object)).not.toContain("execute");
  });

  it("keeps adapter and transformation boundaries as plain data", () => {
    const graph = createRegisteredEducationalObject("GraphObject", { nodes: [{ id: "a", label: "A" }], edges: [] }, 1, 2, "graph_1");
    const canvas = createCanvasRepresentation(graph);
    const graphView = createGraphRepresentation(graph as typeof graph & { type: "GraphObject" });
    const transformation = describeTransformation(graph, { sourceObjectId: graph.id, sourceType: graph.type, representation: "graph", reason: "render" });
    expect(canvas.objectId).toBe("graph_1");
    const moved = applyCanvasRepresentation({ ...canvas, position: { x: 30, y: 40 } }, graph);
    expect(moved.position).toEqual({ x: 30, y: 40 });
    expect(graphView.nodes).toHaveLength(1);
    expect(transformation.payload.sourceObjectId).toBe("graph_1");
    expect(supportedRepresentations("GraphObject")).toContain("graph");
  });

  it("preserves semantic state through local-first save and restore", () => {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { setItem: (key: string, value: string) => storage.set(key, value), getItem: (key: string) => storage.get(key) ?? null } });
    const document = createDocument();
    const result = persistDocument(document);
    const restored = restoreDocument();
    expect(result.ok).toBe(true);
    expect(restored?.id).toBe(document.id);
    expect(restored?.pages[0].objects[0].id).toBe(document.pages[0].objects[0].id);
    expect(restored?.pages[0].objects[0].capabilities).toContain("editable");
    expect(restored?.schemaVersion).toBe(2);
  });

  it("records a reproducible 100-object engine baseline", () => {
    const started = performance.now();
    const objects = Array.from({ length: 100 }, (_, index) => createRegisteredEducationalObject(index % 2 ? "TextObject" : "ShapeObject", `object-${index}`, index, index, `bench_${index}`));
    const creationMs = performance.now() - started;
    const serializeStarted = performance.now();
    const serialized = JSON.stringify(objects);
    const serializeMs = performance.now() - serializeStarted;
    const restoreStarted = performance.now();
    const restored = JSON.parse(serialized) as typeof objects;
    const restoreMs = performance.now() - restoreStarted;
    const duplicateStarted = performance.now();
    const duplicate = duplicateEducationalObject(restored[0], "bench_duplicate");
    const duplicateMs = performance.now() - duplicateStarted;
    console.log(JSON.stringify({ datasetObjects: objects.length, creationMs: Number(creationMs.toFixed(3)), serializeMs: Number(serializeMs.toFixed(3)), restoreMs: Number(restoreMs.toFixed(3)), duplicateMs: Number(duplicateMs.toFixed(3)) }));
    expect(objects).toHaveLength(100);
    expect(restored[99].id).toBe("bench_99");
    expect(duplicate.id).toBe("bench_duplicate");
    expect(Number.isFinite(creationMs)).toBe(true);
  });

  it("proves one board can host Arabic, mathematics, science, question, and activity objects", () => {
    const proof = createCrossSubjectProof();
    expect(proof.arabic.type).toBe("SentenceObject");
    expect(proof.mathematics.content).toBe("2x + 5 = 15");
    expect(proof.science.type).toBe("GraphObject");
    expect(createActivityObject().content.activityType).toBe("discussion");
    expect(createQuestionObject().content.validationState).toBe("unvalidated");
  });
});
