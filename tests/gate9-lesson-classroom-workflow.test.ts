import { beforeEach, describe, expect, it } from "vitest";
import { copyObjectBetweenPages, createDocument, createPage, deletePage, duplicateDocument, duplicatePage, renamePage, reorderPage } from "../client/src/lib/coreBoard";

describe("Gate 9 lesson builder and classroom workflow", () => {
  let document = createDocument();
  beforeEach(() => { document = createDocument(); });

  it("creates, renames, reorders, duplicates and deletes pages", () => {
    const second = createPage("صفحة 2");
    const withSecond = { ...document, pages: [...document.pages, second], activePageId: second.id };
    const renamed = renamePage(withSecond, second.id, "نشاط القراءة");
    const duplicated = duplicatePage(renamed, second.id);
    expect(duplicated.pages).toHaveLength(3);
    expect(duplicated.pages[2].name).toContain("نسخة");
    const reordered = reorderPage(duplicated, duplicated.pages[2].id, 0);
    expect(reordered.pages[0].id).toBe(duplicated.pages[2].id);
    const removed = deletePage(reordered, second.id);
    expect(removed.pages.some((page) => page.id === second.id)).toBe(false);
  });

  it("copies a selected object between pages with a new id and source link", () => {
    const target = createPage("هدف");
    const sourcePage = document.pages[0];
    const sourceObject = sourcePage.objects[0];
    const withTarget = { ...document, pages: [...document.pages, target] };
    const copied = copyObjectBetweenPages(withTarget, sourceObject.id, sourcePage.id, target.id);
    const copy = copied.pages[1].objects[0];
    expect(copy.id).not.toBe(sourceObject.id);
    expect(copy.metadata.sourceObjectId).toBe(sourceObject.id);
    expect(copied.pages[0].objects[0].content).toBe(sourceObject.content);
  });

  it("duplicates a lesson as an independent entity with isolated page and object ids", () => {
    const duplicate = duplicateDocument(document);
    expect(duplicate.id).not.toBe(document.id);
    expect(duplicate.title).toContain("نسخة");
    expect(duplicate.pages[0].id).not.toBe(document.pages[0].id);
    expect(duplicate.pages[0].objects[0].id).not.toBe(document.pages[0].objects[0].id);
    const originalTitle = document.title;
    const changed = { ...duplicate, title: "نسخة معدلة" };
    expect(document.title).toBe(originalTitle);
    expect(changed.title).not.toBe(document.title);
  });
});
