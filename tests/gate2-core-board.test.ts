import { beforeEach, describe, expect, it } from "vitest";
import { BoardDocument, cloneDocument, createDocument, createObject, createPage, getActivePage } from "../client/src/lib/coreBoard";

describe("Gate 2 Core Board domain", () => {
  let document: BoardDocument;

  beforeEach(() => {
    document = createDocument();
  });

  it("creates general, Arabic, math, and graph objects with stable identity", () => {
    const page = getActivePage(document);
    const objects = [
      createObject("TextObject", "العربية + English + 123 + x² + symbols", 10, 10),
      createObject("DrawingObject", "stroke", 20, 20),
      createObject("ShapeObject", "shape", 30, 30),
      createObject("ImageObject", "image placeholder", 40, 40),
      createObject("SentenceObject", "قرأَ الطالبُ الكتابَ", 50, 50),
      createObject("EquationObject", "2x + 5 = 15", 60, 60),
      createObject("GraphObject", "concept → relation", 70, 70),
    ];
    page.objects.push(...objects);
    expect(new Set(objects.map((item) => item.id)).size).toBe(objects.length);
    expect(objects.map((item) => item.type)).toContain("EquationObject");
    expect(objects.find((item) => item.type === "SentenceObject")?.content).toContain("الطالبُ");
  });

  it("preserves page ordering and viewport through serialization", () => {
    const page2 = createPage("Page 2", [createObject("ShapeObject", "shape", 12, 18)]);
    document.pages.push(page2);
    document.activePageId = page2.id;
    document.pages[1].viewport = { x: 100, y: 60, zoom: 1.25 };
    const restored = JSON.parse(JSON.stringify(cloneDocument(document))) as BoardDocument;
    expect(restored.pages.map((page) => page.name)).toEqual(["Page 1", "Page 2"]);
    expect(restored.activePageId).toBe(page2.id);
    expect(restored.pages[1].viewport.zoom).toBe(1.25);
  });

  it("keeps vector stroke data editable instead of flattening it", () => {
    const drawing = createObject("DrawingObject", "stroke", 0, 0);
    drawing.stroke = { points: [{ x: 1, y: 2 }, { x: 15, y: 20 }], color: "#314d3e", width: 3, tool: "pen" };
    const restored = JSON.parse(JSON.stringify(drawing));
    expect(restored.stroke.points).toHaveLength(2);
    expect(restored.stroke.tool).toBe("pen");
  });
});
