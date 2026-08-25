/** Gate 3B runtime benchmark: measured Node/Vitest timings, not real browser performance. */
import { describe, expect, it } from "vitest";
import { createDocument, createObject, cloneDocument, type CoreObject } from "@/lib/coreBoard";

function makeBoard(count: number): CoreObject[] {
  return Array.from({ length: count }, (_, index) => createObject(index % 3 === 0 ? "TextObject" : index % 3 === 1 ? "ShapeObject" : "EquationObject", `object-${index}`, (index % 25) * 42, Math.floor(index / 25) * 70));
}

function elapsed(start: number) { return Number((performance.now() - start).toFixed(3)); }

describe("Gate 3B whiteboard runtime baseline", () => {
  it.each([100, 250, 500])("measures %i objects without mutating semantic content", (count) => {
    const createStart = performance.now();
    const objects = makeBoard(count);
    const creationMs = elapsed(createStart);
    const selectionStart = performance.now();
    const selected = objects.filter((_, index) => index % 5 === 0);
    const selectionMs = elapsed(selectionStart);
    const moveStart = performance.now();
    const moved = objects.map((item, index) => index < 20 ? { ...item, position: { x: item.position.x + 8, y: item.position.y + 8 } } : item);
    const movementMs = elapsed(moveStart);
    const duplicateStart = performance.now();
    const duplicate = selected.map((item, index) => ({ ...item, id: `${item.id}_copy_${index}` }));
    const duplicationMs = elapsed(duplicateStart);
    const serializeStart = performance.now();
    const serialized = JSON.stringify({ ...createDocument(), pages: [{ ...createDocument().pages[0], objects: moved }] });
    const serializationMs = elapsed(serializeStart);
    const restoreStart = performance.now();
    const restored = JSON.parse(serialized);
    const restorationMs = elapsed(restoreStart);
    const zoomStart = performance.now();
    const zoomed = moved.map((item) => ({ ...item, position: { x: item.position.x * 1.1, y: item.position.y * 1.1 } }));
    const zoomMs = elapsed(zoomStart);
    const cloneStart = performance.now();
    const cloned = cloneDocument({ ...createDocument(), pages: [{ ...createDocument().pages[0], objects: zoomed }] });
    const cloneMs = elapsed(cloneStart);
    expect(objects).toHaveLength(count);
    expect(restored.pages[0].objects).toHaveLength(count);
    expect(cloned.pages[0].objects.map((item: CoreObject) => item.content)).toEqual(objects.map((item) => item.content));
    expect(new Set(duplicate.map((item) => item.id)).size).toBe(duplicate.length);
    console.log(JSON.stringify({ count, creationMs, selectionMs, movementMs, duplicationMs, serializationMs, restorationMs, zoomMs, cloneMs }));
  });
});
