import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { createDocument, createObject, type BoardDocument, type CoreObject, type CoreObjectType } from "../../client/src/lib/coreBoard";

/* Gate 16 reminder: browser timings are real Chromium evidence; NODE/Vitest benchmarks remain a separate evidence class. */
const STORAGE_KEY = "gate2-core-board-document";
const RECOVERY_STORAGE_KEY = "gate10-core-board-recovery";
const COUNTS = [10, 100, 250, 500] as const;
const objectTypes: CoreObjectType[] = ["TextObject", "SentenceObject", "EquationObject", "ShapeObject", "ActivityObject"];
const browserErrors = new WeakMap<Page, string[]>();

function makeLargeDocument(count: number): BoardDocument {
  const document = createDocument();
  const page = document.pages[0];
  const objects: CoreObject[] = Array.from({ length: count }, (_, index) => {
    const type = objectTypes[index % objectTypes.length];
    const content = type === "ActivityObject"
      ? { activityType: "practice", instructions: `تعليمات النشاط ${index}`, objectIds: [], interactionState: "not-started", completionState: "incomplete", assessmentState: "unassessed" }
      : `${type}-${index} · مصدر عربي ورياضي`;
    const object = createObject(type, content, 44 + (index % 8) * 210, 54 + Math.floor(index / 8) * 112);
    return {
      ...object,
      id: `gate16_${String(index).padStart(4, "0")}`,
      zIndex: index + 1,
      metadata: {
        ...object.metadata,
        label: `Gate 16 object ${index}`,
        source: "teacher",
        provenanceId: `provenance_${index}`,
        fixtureVersion: 1,
      },
      source: { kind: "teacher" },
    };
  });
  return {
    ...document,
    title: `Gate 16 performance fixture ${count}`,
    pages: [{ ...page, objects }],
    activePageId: page.id,
    updatedAt: new Date().toISOString(),
  };
}

async function installDocument(page: Page, document: BoardDocument) {
  await page.addInitScript(({ storageKey, recoveryKey, value }) => {
    window.localStorage.clear();
    window.localStorage.setItem(storageKey, JSON.stringify(value));
    window.localStorage.removeItem(recoveryKey);
  }, { storageKey: STORAGE_KEY, recoveryKey: RECOVERY_STORAGE_KEY, value: document });
}

async function browserMeasure(page: Page, action: () => Promise<void>) {
  const start = await page.evaluate(() => performance.now());
  await action();
  const end = await page.evaluate(() => performance.now());
  return Number((end - start).toFixed(3));
}

async function openSeeded(page: Page, document: BoardDocument) {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource: the server responded with a status of 404 (Not Found)")) errors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => errors.push(`requestfailed: ${request.url()} — ${request.failure()?.errorText ?? "unknown"}`));
  await installDocument(page, document);
  const start = Date.now();
  await page.goto("/");
  await expect(page.getByTestId("teacher-workspace")).toBeVisible();
  await expect.poll(() => page.getByTestId("canvas-object").count(), { timeout: 20_000 }).toBe(document.pages[0].objects.length);
  const navigation = await page.evaluate(() => {
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    return { domContentLoaded: entry?.domContentLoadedEventEnd ?? null, loadEvent: entry?.loadEventEnd ?? null, memory: (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory ?? null };
  });
  return {
    playwrightNavigationMs: Date.now() - start,
    browserDomContentLoadedMs: navigation.domContentLoaded,
    browserLoadEventMs: navigation.loadEvent,
    memory: navigation.memory,
  };
}

async function selectPair(page: Page) {
  const objects = page.getByTestId("canvas-object");
  const first = objects.nth(0);
  const second = objects.nth(1);
  await first.scrollIntoViewIfNeeded();
  await first.focus();
  await first.press("Enter");
  await second.evaluate((element) => (element as HTMLElement).focus());
  await page.keyboard.press("Control+Enter");
  await expect(page.getByText("محدد: 2").first()).toBeVisible();
}

test.afterEach(async ({ page }, testInfo: TestInfo) => {
  const errors = browserErrors.get(page) ?? [];
  if (errors.length) await testInfo.attach("browser-errors", { body: Buffer.from(errors.join("\n")), contentType: "text/plain" });
  expect(errors, "unexpected browser errors").toEqual([]);
});

test.describe("Gate 16 real browser performance matrix", () => {
  for (const count of COUNTS) {
    test(`browser benchmark ${count} objects`, async ({ page }, testInfo) => {
      const fixture = makeLargeDocument(count);
      const load = await openSeeded(page, fixture);
      const objects = page.getByTestId("canvas-object");
      const metrics: Record<string, number | null | string> = {
        count,
        initialLoadE2EMs: load.playwrightNavigationMs,
        browserDomContentLoadedMs: load.browserDomContentLoadedMs,
        browserLoadEventMs: load.browserLoadEventMs,
        memoryUsedJSHeapSize: load.memory?.usedJSHeapSize ?? null,
        lessonCreationMs: null,
        pageCreationMs: null,
        objectCreationMs: null,
        selectionMs: null,
        dragMs: null,
        resizeMs: null,
        groupMs: null,
        ungroupMs: null,
        lensRegeneration: "NOT VERIFIED — no lens regeneration control in current product UI",
        saveMs: null,
        restoreMs: null,
        exportMs: null,
        importMs: null,
        studentPreviewMs: null,
        assessmentMs: null,
        teacherOverrideMs: null,
      };

      metrics.lessonCreationMs = await browserMeasure(page, async () => {
        await page.getByRole("textbox", { name: "عنوان الدرس" }).fill(`Gate 16 ${count}`);
      });
      metrics.pageCreationMs = await browserMeasure(page, async () => {
        await page.getByRole("button", { name: "إضافة صفحة" }).click();
      });
      metrics.objectCreationMs = await browserMeasure(page, async () => {
        await page.getByTestId("add-sentence-object").click();
      });
      await page.locator(".teacher-product-page-list button").first().click();
      await expect.poll(() => page.getByTestId("canvas-object").count(), { timeout: 20_000 }).toBe(count);
      metrics.selectionMs = await browserMeasure(page, async () => {
        await objects.nth(0).click();
      });
      metrics.dragMs = await browserMeasure(page, async () => {
        const box = await objects.nth(0).boundingBox();
        if (!box) throw new Error("Visible canvas object has no bounding box");
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 16, box.y + box.height / 2 + 12);
        await page.mouse.up();
      });
      metrics.groupMs = await browserMeasure(page, async () => {
        await selectPair(page);
        await page.getByRole("button", { name: "تجميع", exact: true }).click();
      });
      metrics.ungroupMs = await browserMeasure(page, async () => {
        await page.getByRole("button", { name: "فك", exact: true }).click();
      });
      metrics.saveMs = await browserMeasure(page, async () => {
        await page.getByTestId("save-lesson-button").click();
        await expect(page.getByRole("status").filter({ hasText: "حُفظ" })).toBeVisible();
      });
      metrics.exportMs = await browserMeasure(page, async () => {
        const downloadPromise = page.waitForEvent("download");
        await page.getByRole("button", { name: "تصدير" }).click();
        const download = await downloadPromise;
        expect(await download.path()).toBeTruthy();
      });
      const reloadStart = await page.evaluate(() => performance.now());
      await page.reload();
      await expect(page.getByTestId("teacher-workspace")).toBeVisible();
      metrics.restoreMs = Number(((await page.evaluate(() => performance.now())) - reloadStart).toFixed(3));
      await testInfo.attach(`browser-performance-${count}`, { body: Buffer.from(JSON.stringify(metrics, null, 2)), contentType: "application/json" });
      console.log(JSON.stringify(metrics));
      expect(await page.getByTestId("canvas-object").count()).toBeGreaterThanOrEqual(count);
    });
  }
});

test("Gate 16 resilience: malformed, duplicate, unsupported, partial, and empty storage fail safe", async ({ page }, testInfo) => {
  const malformedCases = [
    "{bad-json",
    JSON.stringify({ id: "same", title: "", version: 1, schemaVersion: 999, pages: [], activePageId: "missing" }),
    JSON.stringify({ id: "same", title: "unsafe", version: 1, schemaVersion: 2, pages: [{ id: "p", name: "P", viewport: { x: 0, y: 0, zoom: 1 }, objects: [{ id: "o", type: "TextObject", position: { x: 0, y: 0 }, size: { width: 100, height: 50 }, rotation: 0, zIndex: 1, content: "x", style: { color: "#000", background: "#fff", fontSize: 12, align: "left" }, metadata: { label: "x", source: "teacher", locked: false, visible: true, version: 1, __proto__: { polluted: true } }, capabilities: [], schemaVersion: 1, transform: { rotation: 0 }, createdAt: "x", updatedAt: "x" }] }], activePageId: "p", updatedAt: "x" }),
    JSON.stringify({ id: "partial", title: "partial", version: 1, schemaVersion: 2, pages: [{ id: "p", name: "P", viewport: { x: 0, y: 0, zoom: 1 }, objects: [{ id: "duplicate", type: "TextObject", position: { x: 0, y: 0 }, size: { width: 100, height: 50 }, rotation: 0, zIndex: 1, content: "x", style: { color: "#000", background: "#fff", fontSize: 12, align: "left" }, metadata: { label: "x", source: "teacher", locked: false, visible: true, version: 1 }, capabilities: [], schemaVersion: 1, transform: { rotation: 0 }, createdAt: "x", updatedAt: "x" }, { id: "duplicate", type: "ShapeObject", position: { x: 4, y: 4 }, size: { width: 100, height: 50 }, rotation: 0, zIndex: 2, content: "x", style: { color: "#000", background: "#fff", fontSize: 12, align: "left" }, metadata: { label: "x", source: "teacher", locked: false, visible: true, version: 1 }, capabilities: [], schemaVersion: 1, transform: { rotation: 0 }, createdAt: "x", updatedAt: "x" }] }], activePageId: "p", updatedAt: "x" }),
    "",
  ];
  const outcomes: string[] = [];
  for (const payload of malformedCases) {
    await page.goto("/");
    await page.evaluate(({ storageKey, recoveryKey, value }) => { localStorage.clear(); localStorage.setItem(storageKey, value); localStorage.removeItem(recoveryKey); }, { storageKey: STORAGE_KEY, recoveryKey: RECOVERY_STORAGE_KEY, value: payload });
    await page.reload();
    await expect(page.getByTestId("teacher-workspace")).toBeVisible();
    outcomes.push(`safe-failure:${payload.length}`);
  }
  await testInfo.attach("resilience-outcomes", { body: Buffer.from(JSON.stringify(outcomes, null, 2)), contentType: "application/json" });
  expect(outcomes).toHaveLength(malformedCases.length);
});
