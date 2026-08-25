/** Gate 3B regression tests: pure UX operations preserve educational object identity and semantic data. */
import { describe, expect, it } from "vitest";
import { createObject, type CoreObject } from "@/lib/coreBoard";
import { alignObjects, distributeObjects, reorderObject } from "@/lib/whiteboardUx";

function fixture(): CoreObject[] {
  return [
    createObject("TextObject", "شرح", 20, 30),
    createObject("ShapeObject", "مربع", 160, 80),
    createObject("EquationObject", "2x + 5 = 15", 300, 120),
  ].map((item, index) => ({ ...item, zIndex: index + 1, style: { ...item.style, background: ["#fff", "#eef", "#fee"][index] } }));
}

describe("Gate 3B whiteboard UX helpers", () => {
  it("aligns selected objects without touching unselected objects or content", () => {
    const objects = fixture();
    const result = alignObjects(objects, new Set([objects[0].id, objects[1].id]), "top");
    expect(result[0].position.y).toBe(result[1].position.y);
    expect(result[2].position).toEqual(objects[2].position);
    expect(result.map((item) => item.id)).toEqual(objects.map((item) => item.id));
    expect(result.map((item) => item.content)).toEqual(objects.map((item) => item.content));
    expect(result.map((item) => item.style.background)).toEqual(objects.map((item) => item.style.background));
  });

  it("distributes three selected objects on one axis and preserves all IDs", () => {
    const objects = fixture();
    const result = distributeObjects(objects, new Set(objects.map((item) => item.id)), "horizontal");
    expect(result[1].position.x - result[0].position.x).toBe(result[2].position.x - result[1].position.x);
    expect(new Set(result.map((item) => item.id))).toEqual(new Set(objects.map((item) => item.id)));
  });

  it("reorders layers with contiguous z-order and no-op boundaries", () => {
    const objects = fixture();
    const front = reorderObject(objects, objects[0].id, "front");
    expect(front.map((item) => item.id)).toEqual([objects[1].id, objects[2].id, objects[0].id]);
    expect(front.map((item) => item.zIndex)).toEqual([1, 2, 3]);
    expect(reorderObject(front, objects[0].id, "front")).toBe(front);
  });
});
