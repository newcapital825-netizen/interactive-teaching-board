import { beforeEach, describe, expect, it } from "vitest";
import { createDocument, createObject, createPage, type BoardDocument } from "../client/src/lib/coreBoard";
import { safeParseBoardDocument } from "../client/src/lib/objectMigrations";
import { exportLesson, importLesson, readRecoverySnapshot, saveRecoverySnapshot } from "../client/src/lib/lessonTransfer";

const storage = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { setItem: (key: string, value: string) => storage.set(key, value), getItem: (key: string) => storage.get(key) ?? null, removeItem: (key: string) => storage.delete(key), clear: () => storage.clear() } });

describe("Gate 10 safe local data", () => {
  let document: BoardDocument;
  beforeEach(() => { storage.clear(); document = createDocument(); });

  it("round-trips a lesson envelope without semantic loss", () => {
    const page = createPage("نشاط");
    const equation = createObject("EquationObject", "2x + 3 = 11", 100, 120);
    const enriched = { ...document, title: "درس المعادلات", pages: [...document.pages, { ...page, objects: [equation] }] };
    const imported = importLesson(exportLesson(enriched));
    expect(imported).not.toBeNull();
    expect(imported?.id).toBe(enriched.id);
    expect(imported?.title).toBe(enriched.title);
    expect(imported?.pages[1].objects[0].id).toBe(equation.id);
    expect(imported?.pages[1].objects[0].style).toEqual(equation.style);
    expect(imported?.pages[1].objects[0].zIndex).toBe(equation.zIndex);
  });

  it("rejects corruption, unsafe payloads, duplicate identities, and missing metadata", () => {
    expect(importLesson("not-json")).toBeNull();
    expect(importLesson('{"__proto__":{},"format":"medad-lesson","formatVersion":1}')).toBeNull();
    const exported = JSON.parse(exportLesson(document)) as { format: string; formatVersion: number; document: BoardDocument };
    exported.document.pages[0].objects.push({ ...exported.document.pages[0].objects[0], id: exported.document.pages[0].objects[0].id });
    expect(importLesson(JSON.stringify(exported))).toBeNull();
    delete (exported.document.pages[0].objects[0] as Partial<typeof exported.document.pages[0].objects[0]>).metadata;
    expect(importLesson(JSON.stringify(exported))).toBeNull();
  });

  it("accepts the supported legacy board shape through the canonical v1→v2 migration", () => {
    const legacy = { id: document.id, title: document.title, version: 1, pages: [{ id: "legacy-page", name: "Legacy", objects: [{ id: "legacy-text", type: "TextObject", content: "نص قديم", position: { x: 0, y: 0 }, dimensions: { width: 120, height: 60 } }] }], activePageId: "legacy-page" };
    const migrated = safeParseBoardDocument(JSON.stringify(legacy));
    expect(migrated?.schemaVersion).toBe(2);
    expect(migrated?.pages[0].objects[0].id).toBe("legacy-text");
    expect(migrated?.pages[0].objects[0].metadata.locked).toBe(false);
  });

  it("preserves recovery snapshots separately from the normal saved state", () => {
    expect(saveRecoverySnapshot(document).ok).toBe(true);
    const recovered = readRecoverySnapshot();
    expect(recovered?.id).toBe(document.id);
    expect(recovered?.pages[0].objects[0].content).toBe(document.pages[0].objects[0].content);
  });
});
