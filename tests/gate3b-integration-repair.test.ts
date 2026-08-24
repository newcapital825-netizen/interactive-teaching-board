import { describe, expect, it } from "vitest";
import { createObject, createPage, persistDocument, restoreDocument, resizeObject, type BoardDocument } from "../client/src/lib/coreBoard";
import { describeTransformation, supportedRepresentations } from "../client/src/lib/objectTransformations";
import { getObjectDefinition, listObjectDefinitions } from "../client/src/lib/objectRegistry";

describe("Gate 3B integration repair", () => {
  it("creates the whiteboard insertion surface from the canonical registry", () => {
    const registeredTypes = listObjectDefinitions().map((definition) => definition.type);
    expect(registeredTypes).toEqual(expect.arrayContaining(["TextObject", "SentenceObject", "EquationObject", "GraphObject", "QuestionObject", "ActivityObject"]));
    expect(getObjectDefinition("QuestionObject")?.capabilities).toContain("assessable");
    expect(getObjectDefinition("ActivityObject")?.capabilities).toContain("interactive");

    const sentence = createObject("SentenceObject", "قرأَ الطالبُ الكتابَ", 10, 20);
    const equation = createObject("EquationObject", "2x + 5 = 15", 40, 20);
    const graph = createObject("GraphObject", "خريطة مفاهيم", 70, 20);
    const question = createObject("QuestionObject", { prompt: "ما الفكرة؟", answerModel: { kind: "text" }, interactionType: "open", validationState: "unvalidated" }, 100, 20);
    const activity = createObject("ActivityObject", { activityType: "discussion", instructions: "ناقش الفكرة.", objectIds: [], interactionState: "not-started", completionState: "incomplete", assessmentState: "unassessed" }, 130, 20);

    expect(sentence.capabilities).toContain("interactive");
    expect(equation.metadata.renderer).toBe("equation");
    expect(graph.metadata.renderer).toBe("graph");
    expect(question.capabilities).toContain("assessable");
    expect(activity.capabilities).toContain("interactive");
    expect([sentence, equation, graph, question, activity].every((object) => object.schemaVersion === 2)).toBe(true);
  });

  it("keeps grouping, child scaling, and controlled representations on canonical objects", () => {
    const childA = createObject("SentenceObject", "جملة", 20, 20);
    const childB = createObject("EquationObject", "x + 1 = 2", 100, 70);
    const group = createObject("GroupObject", "مجموعة", 20, 20);
    group.childIds = [childA.id, childB.id];
    group.children = [{ ...childA, position: { x: 0, y: 0 } }, { ...childB, position: { x: 80, y: 50 } }];
    group.size = { width: 260, height: 180 };
    const resized = resizeObject(group, 520, 360);
    const representation = describeTransformation(childA, { sourceObjectId: childA.id, sourceType: childA.type, representation: "activity", reason: "teach" });

    expect(resized.childIds).toEqual([childA.id, childB.id]);
    expect(resized.children?.[1].position).toEqual({ x: 160, y: 100 });
    expect(resized.children?.[1].id).toBe(childB.id);
    expect(resized.children?.[1].capabilities).toEqual(childB.capabilities);
    expect(supportedRepresentations("SentenceObject")).toContain("activity");
    expect(representation.payload.sourceObjectId).toBe(childA.id);
    expect(representation.status).toBe("described");
  });

  it("preserves canonical semantic objects through save and restore", () => {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { setItem: (key: string, value: string) => storage.set(key, value), getItem: (key: string) => storage.get(key) ?? null } });
    const objects = [
      createObject("TextObject", "نص", 10, 10),
      createObject("SentenceObject", "جملة عربية", 20, 20),
      createObject("EquationObject", "x + 1 = 2", 30, 30),
      createObject("GraphObject", "مفاهيم", 40, 40),
      createObject("QuestionObject", { prompt: "سؤال", answerModel: { kind: "text" }, interactionType: "open", validationState: "unvalidated" }, 50, 50),
      createObject("ActivityObject", { activityType: "discussion", instructions: "نشاط", objectIds: [], interactionState: "not-started", completionState: "incomplete", assessmentState: "unassessed" }, 60, 60),
    ];
    const document: BoardDocument = { id: "integration_board", title: "Integration", version: 1, schemaVersion: 2, pages: [createPage("Integrated", objects)], activePageId: "unused", updatedAt: new Date().toISOString() };
    const result = persistDocument(document);
    const restored = restoreDocument();

    expect(result.ok).toBe(true);
    expect(restored?.pages[0].objects.map((object) => object.id)).toEqual(objects.map((object) => object.id));
    expect(restored?.pages[0].objects.map((object) => object.capabilities)).toEqual(objects.map((object) => object.capabilities));
    expect(restored?.pages[0].objects.map((object) => object.position)).toEqual(objects.map((object) => object.position));
    expect(restored?.pages[0].objects.map((object) => object.metadata.renderer)).toEqual(["text", "sentence", "equation", "graph", "question", "activity"]);
  });
});
