import { beforeEach, describe, expect, it } from "vitest";
import { createDocument, createObject, createPage, getActivePage, persistDocument, restoreDocument } from "../client/src/lib/coreBoard";

describe("Gate 5 Teacher Productization contracts", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
      clear: () => { values.clear(); },
    } });
  });

  it("starts with a usable lesson title, first page, and editable teacher content", () => {
    const document = createDocument();
    const page = getActivePage(document);
    expect(document.title).toBe("درس تفاعلي جديد");
    expect(page?.name).toBe("Page 1");
    expect(page?.objects[0].type).toBe("TextObject");
    expect(page?.objects[0].metadata.source).toBe("teacher");
  });

  it("adds Arabic and Mathematics content to the same page through the canonical factory", () => {
    const document = createDocument();
    const page = getActivePage(document)!;
    const sentence = createObject("SentenceObject", "جملة عربية", 220, 54);
    const equation = createObject("EquationObject", "2x + 3 = 11", 420, 54);
    const next = { ...document, pages: document.pages.map((item) => item.id === page.id ? { ...item, objects: [...item.objects, sentence, equation] } : item) };
    const active = getActivePage(next)!;
    expect(active.objects.map((item) => item.type)).toEqual(["TextObject", "SentenceObject", "EquationObject"]);
    expect(active.objects.every((item) => item.schemaVersion === sentence.schemaVersion)).toBe(true);
    expect(new Set(active.objects.map((item) => item.id)).size).toBe(3);
  });

  it("preserves pages, title, metadata, object IDs, and z-order in local save/restore", () => {
    const document = createDocument();
    const second = createPage("Practice");
    const text = createObject("TextObject", "هدف الدرس", 40, 40);
    const saved = { ...document, title: "النحو والمعادلات", context: { subject: "العربية", category: "إعدادي", level: "الصف الثاني الإعدادي" }, pages: [...document.pages, { ...second, objects: [text] }], activePageId: second.id };
    expect(persistDocument(saved).ok).toBe(true);
    const restored = restoreDocument();
    expect(restored?.title).toBe(saved.title);
    expect(restored?.context).toEqual(saved.context);
    expect(restored?.pages.map((page) => page.name)).toEqual(["Page 1", "Practice"]);
    expect(restored?.activePageId).toBe(second.id);
    expect(restored?.pages[1].objects[0].id).toBe(text.id);
    expect(restored?.pages[1].objects[0].metadata.label).toBe(text.metadata.label);
  });
});
