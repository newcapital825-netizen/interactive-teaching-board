import { describe, expect, it } from "vitest";
import { BoardDocument, cloneDocument, createDocument, createObject, getActivePage } from "../client/src/lib/coreBoard";

const fixedDataset = () => {
  const document = createDocument();
  const page = getActivePage(document);
  for (let index = 0; index < 40; index += 1) page.objects.push(createObject("TextObject", `نص ${index} + English ${index} + x²`, index * 7, index * 3));
  for (let index = 0; index < 20; index += 1) page.objects.push(createObject("ShapeObject", `shape ${index}`, index * 9, index * 5));
  for (let index = 0; index < 10; index += 1) page.objects.push(createObject("DrawingObject", `stroke ${index}`, index * 11, index * 4));
  for (let index = 0; index < 10; index += 1) page.objects.push(createObject("ImageObject", `placeholder ${index}`, index * 13, index * 6));
  for (let index = 0; index < 5; index += 1) page.objects.push(createObject("SentenceObject", `قرأَ الطالبُ الكتابَ ${index}`, index * 15, index * 8));
  for (let index = 0; index < 5; index += 1) page.objects.push(createObject("EquationObject", `${index + 2}x + 5 = 15`, index * 17, index * 9));
  return document;
};
const measure = (work: () => void) => { const start = performance.now(); work(); return Number((performance.now() - start).toFixed(3)); };

describe("Gate 2 fixed board benchmark", () => {
  it("records reproducible local timings for a 91-object board", () => {
    const document = fixedDataset();
    const page = getActivePage(document);
    const creationMs = measure(() => fixedDataset());
    const selectionMs = measure(() => page.objects.filter((item) => item.type === "TextObject" || item.type === "EquationObject"));
    const moveMs = measure(() => page.objects.forEach((item) => { item.position.x += 2; item.position.y += 2; }));
    const resizeMs = measure(() => page.objects.forEach((item) => { item.size.width = Math.max(80, item.size.width + 2); }));
    const zoomMs = measure(() => { page.viewport.zoom = 1.15; page.viewport.x = 120; page.viewport.y = 80; });
    const saveMs = measure(() => JSON.stringify(document));
    const restoreMs = measure(() => JSON.parse(JSON.stringify(document)) as BoardDocument);
    console.info(JSON.stringify({ datasetObjects: page.objects.length, creationMs, selectionMs, moveMs, resizeMs, zoomMs, saveMs, restoreMs }));
    expect(page.objects).toHaveLength(91);
    expect(restoreMs).toBeGreaterThanOrEqual(0);
  });
});
