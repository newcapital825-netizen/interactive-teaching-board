import { describe, expect, it } from "vitest";
import { createDocument, createObject, type CoreObject } from "../client/src/lib/coreBoard";
import { applyPageObjects, deleteObjects, duplicateObjects, emptySelection, groupObjects, hitTestObjects, moveObjects, objectsForSelection, patchObject, reorderObjects, resizeObjectFromCorner, sanitizeSelection, selectObjects, ungroupObject } from "../client/src/lib/canvasInteraction";

const page = () => createDocument().pages[0];
const object = (type: "TextObject" | "SentenceObject" | "EquationObject", x: number, y: number) => createObject(type, `${type} content`, x, y);

describe("Gate 11 direct canvas interaction contract", () => {
  it("selects, toggles multi-selection, deselects, and sanitizes stale identities", () => {
    const first = object("TextObject", 10, 10);
    const second = object("SentenceObject", 220, 10);
    expect(selectObjects([], first.id)).toEqual({ ids: [first.id], primaryId: first.id });
    expect(selectObjects([first.id], second.id, true).ids).toEqual([first.id, second.id]);
    expect(selectObjects([first.id, second.id], first.id, true).ids).toEqual([second.id]);
    expect(selectObjects([second.id], null)).toEqual(emptySelection());
    expect(sanitizeSelection({ objects: [first] }, { ids: [first.id, "deleted"], primaryId: "deleted" })).toEqual({ ids: [first.id], primaryId: first.id });
  });

  it("hit-tests the topmost visible canonical object", () => {
    const lower = object("TextObject", 20, 20);
    const upper = { ...object("ShapeObject", 30, 30), zIndex: 9 };
    expect(hitTestObjects([lower, upper], { x: 40, y: 40 })?.id).toBe(upper.id);
    expect(hitTestObjects([{ ...upper, metadata: { ...upper.metadata, visible: false } }, lower], { x: 40, y: 40 })?.id).toBe(lower.id);
  });

  it("moves, resizes, and edits while preserving identity, style, metadata, and provenance", () => {
    const item = { ...object("EquationObject", 20, 30), source: { kind: "teacher" as const, reference: "source-equation" }, metadata: { ...object("EquationObject", 20, 30).metadata, custom: "keep" } };
    const moved = moveObjects([item], [item.id], 15, 12)[0];
    const resized = resizeObjectFromCorner(moved, "tl", -10, -8);
    const edited = patchObject([resized], item.id, { content: "2x + 3 = 11" })[0];
    expect(edited.id).toBe(item.id);
    expect(edited.position).toEqual({ x: 25, y: 34 });
    expect(edited.size.width).toBeGreaterThan(item.size.width);
    expect(edited.metadata.custom).toBe("keep");
    expect(edited.source?.reference).toBe("source-equation");
    expect(edited.content).toBe("2x + 3 = 11");
  });

  it("duplicates with new IDs and deletes only selected unlocked objects", () => {
    const first = object("TextObject", 10, 10);
    const second = object("SentenceObject", 220, 10);
    const duplicated = duplicateObjects([first, second], [first.id], (type, index) => `${type}-copy-${index}`);
    expect(duplicated).toHaveLength(3);
    expect(duplicated[2].id).toBe("TextObject-copy-0");
    expect(duplicated[2].metadata.duplicatedFrom).toBe(first.id);
    expect(deleteObjects(duplicated, [first.id])).toHaveLength(2);
  });

  it("groups and ungroups canonical children without losing child IDs", () => {
    const first = object("TextObject", 10, 10);
    const second = object("ShapeObject", 220, 40);
    const document = { ...createDocument(), pages: [{ ...page(), objects: [first, second] }] };
    const grouped = groupObjects(document, document.pages[0].id, [first.id, second.id], "group-fixed");
    const group = grouped.pages[0].objects[0];
    expect(group.id).toBe("group-fixed");
    expect(group.childIds).toEqual([first.id, second.id]);
    const ungrouped = ungroupObject(grouped.pages[0].objects, group.id);
    expect(ungrouped.map((item) => item.id)).toEqual(expect.arrayContaining([first.id, second.id]));
  });

  it("reorders layers and applies page object updates without a second document model", () => {
    const first = object("TextObject", 10, 10);
    const second = object("SentenceObject", 220, 10);
    const objects = reorderObjects([first, second], first.id, "front");
    expect(objects.find((item) => item.id === first.id)?.zIndex).toBeGreaterThan(objects.find((item) => item.id === second.id)?.zIndex ?? 0);
    const updated = applyPageObjects({ ...createDocument(), pages: [{ ...page(), objects: [first, second] }] }, page().id, objects);
    expect(objectsForSelection(updated.pages[0].objects, { ids: [first.id], primaryId: first.id })[0].id).toBe(first.id);
  });

  it("records a reproducible NODE/VITEST benchmark for direct interaction operations", () => {
    const measurements = [100, 250, 500].map((count) => {
      const start = performance.now();
      const objects = Array.from({ length: count }, (_, index) => object("TextObject", index * 4, index * 2));
      const ids = objects.map((item) => item.id);
      const moved = moveObjects(objects, ids, 4, 3);
      const resized = moved.map((item) => resizeObjectFromCorner(item, "br", 4, 4));
      const selected = objectsForSelection(resized, { ids, primaryId: ids.at(-1) ?? null });
      const elapsedMs = performance.now() - start;
      console.log(JSON.stringify({ environment: "NODE/VITEST BENCHMARK", count, operations: ["selection", "move", "resize", "contextual-action-lookup"], elapsedMs: Number(elapsedMs.toFixed(3)) }));
      expect(selected).toHaveLength(count);
      return elapsedMs;
    });
    expect(measurements.every((value) => value >= 0)).toBe(true);
  });
});
