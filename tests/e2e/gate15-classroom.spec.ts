import { expect, test, type Page, type TestInfo } from "@playwright/test";

/* Gate 15 reminder: real Chromium evidence over canonical product flows; no unit test is treated as E2E evidence. */
const browserErrors = new WeakMap<Page, string[]>();
const knownExternalConsoleMessages = ["https://manus-analytics.com/umami", "manus-analytics.com/umami"];
const knownExternalResponseUrls = ["https://manus-analytics.com/umami", "/__manus__/logs"];

async function openWorkspace(page: Page) {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => { if (message.type() === "error" && !knownExternalConsoleMessages.some((known) => message.text().includes(known)) && !message.text().includes("Failed to load resource: the server responded with a status of 404 (Not Found)")) errors.push(`console: ${message.text()}`); });
  page.on("response", (response) => { if (response.status() >= 400 && !knownExternalResponseUrls.some((known) => response.url().includes(known))) errors.push(`http-${response.status()}: ${response.url()}`); });
  page.on("requestfailed", (request) => errors.push(`requestfailed: ${request.url()} — ${request.failure()?.errorText ?? "unknown"}`));
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await expect(page.getByTestId("teacher-workspace")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
}

async function addObjects(page: Page) {
  await page.getByTestId("add-sentence-object").click();
  await page.getByTestId("add-equation-object").click();
  await expect(page.getByTestId("canvas-object").filter({ hasText: "جملة عربية قابلة للتحليل" })).toHaveCount(1);
  await expect(page.getByTestId("canvas-object").filter({ hasText: "2x + 3 = 11" })).toHaveCount(1);
}

test.afterEach(async ({ page }, testInfo: TestInfo) => {
  const errors = browserErrors.get(page) ?? [];
  if (errors.length) await testInfo.attach("browser-errors", { body: Buffer.from(errors.join("\n")), contentType: "text/plain" });
  expect(errors, "unexpected browser errors").toEqual([]);
});

test("Journey A: teacher creates Arabic and Mathematics lesson with provenance activity", async ({ page }) => {
  await openWorkspace(page);
  await page.getByRole("textbox", { name: "عنوان الدرس" }).fill("درس التحقق المتكامل");
  await page.getByRole("button", { name: "إضافة صفحة" }).click();
  await addObjects(page);

  const sentence = page.getByTestId("canvas-object").filter({ hasText: "جملة عربية قابلة للتحليل" }).first();
  await sentence.click();
  await expect(page.getByTestId("contextual-actions")).toBeVisible();
  await expect(page.getByTestId("contextual-action-convert-to-activity")).toBeEnabled();
  await page.getByTestId("contextual-action-convert-to-activity").click();
  await expect(page.getByTestId("classroom-activity")).toHaveCount(1);
  await expect(page.getByTestId("classroom-loop-teacher")).toContainText("المصدر:");
  await page.getByTestId("save-lesson-button").click();
  await expect(page.getByRole("status").filter({ hasText: "حُفظ" })).toBeVisible();
});

test("Journey B: direct canvas interaction changes state and restores with undo/redo", async ({ page }) => {
  await openWorkspace(page);
  await addObjects(page);
  const objects = page.getByTestId("canvas-object");
  const first = objects.filter({ hasText: "جملة عربية قابلة للتحليل" }).first();
  const second = objects.filter({ hasText: "2x + 3 = 11" }).first();
  const beforeCount = await objects.count();
  await first.click();
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await second.click({ modifiers: ["Control"] });
  await expect(page.getByText("محدد: 2").first()).toBeVisible();
  await page.getByRole("button", { name: "تجميع" }).click();
  await expect(page.getByTestId("canvas-object")).toHaveCount(beforeCount - 1);
  await page.getByRole("button", { name: "فك", exact: true }).click();
  await expect(page.getByTestId("canvas-object")).toHaveCount(beforeCount);

  const restoredFirst = page.getByTestId("canvas-object").first();
  const before = await restoredFirst.getAttribute("style");
  await restoredFirst.click();
  await page.getByRole("button", { name: "تحريك", exact: true }).first().click();
  const afterMove = await page.getByTestId("canvas-object").first().getAttribute("style");
  expect(afterMove).not.toBe(before);
  await page.keyboard.press("Control+z");
  await expect(page.getByTestId("canvas-object").first()).toHaveAttribute("style", before!);
  await page.keyboard.press("Control+Shift+z");
  await expect(page.getByTestId("canvas-object").first()).toHaveAttribute("style", afterMove!);
});

test("Journeys C–F: Arabic activity reaches student attempt, deterministic review, and override", async ({ page }) => {
  await openWorkspace(page);
  await page.getByTestId("add-sentence-object").click();
  await page.getByTestId("canvas-object").filter({ hasText: "جملة عربية قابلة للتحليل" }).first().click();
  await page.getByTestId("contextual-action-convert-to-activity").click();
  const activity = page.getByTestId("classroom-activity").first();
  await activity.click();
  await page.getByRole("button", { name: "تجهيز للطالب" }).click();
  await page.getByRole("button", { name: "فتح للطالب" }).click();
  await page.getByTestId("student-preview-button").click();
  await expect(page.getByTestId("classroom-loop-student")).toBeVisible();
  await expect(page.getByTestId("classroom-loop-student")).toContainText("مساحة إجابة الطالب");
  await page.getByRole("textbox", { name: "الإجابة النهائية" }).fill("الطالبُ، فاعل، مرفوع، الضمة، لأنه فاعل");
  const submitAttempt = page.getByRole("button", { name: "إرسال الإجابة" });
  await submitAttempt.scrollIntoViewIfNeeded();
  await submitAttempt.press("Enter");
  const backToTeacher = page.getByRole("button", { name: "العودة إلى المعلم" });
  await backToTeacher.focus();
  await backToTeacher.press("Enter");
  await expect(page.getByTestId("teacher-workspace")).toBeVisible();
  const reviewedActivity = page.getByTestId("classroom-activity").first();
  await reviewedActivity.click();
  await reviewedActivity.getByRole("button", { name: /تقييم حتمي/ }).click();
  await page.getByRole("button", { name: "فتح للمراجعة" }).click();
  await reviewedActivity.getByRole("textbox", { name: "سبب قرار المعلم" }).fill("قبول تربوي موثق");
  await reviewedActivity.getByRole("textbox", { name: "ملاحظة المعلم" }).fill("تأكيد المسار العربي");
  await reviewedActivity.getByRole("button", { name: "حفظ قرار المعلم" }).click();
  await expect(page.getByTestId("classroom-loop-teacher")).toContainText("تأكيد المسار العربي");
});

test("Journey D/G/H/I/J/K: Mathematics, persistence, export/import, recovery guard, and presentation", async ({ page }) => {
  await openWorkspace(page);
  await page.getByTestId("add-equation-object").click();
  const equation = page.getByTestId("canvas-object").filter({ hasText: "2x + 3 = 11" }).first();
  await expect(equation).toContainText("2x + 3 = 11");
  await equation.click();
  await page.getByTestId("contextual-action-convert-to-activity").click();
  const activity = page.getByTestId("classroom-activity").first();
  await activity.click();
  await page.getByRole("button", { name: "تجهيز للطالب" }).click();
  await page.getByRole("button", { name: "فتح للطالب" }).click();
  await page.getByTestId("student-preview-button").click();
  await expect(page.getByTestId("classroom-loop-student")).toContainText("الخطوة 1");
  await page.getByRole("textbox", { name: "الإجابة النهائية" }).fill("x = 4");
  const submitAttempt = page.getByRole("button", { name: "إرسال الإجابة" });
  await submitAttempt.scrollIntoViewIfNeeded();
  await submitAttempt.press("Enter");
  const backToTeacher = page.getByRole("button", { name: "العودة إلى المعلم" });
  await backToTeacher.focus();
  await backToTeacher.press("Enter");
  await page.getByTestId("save-lesson-button").click();
  await expect(page.getByRole("status").filter({ hasText: "حُفظ" })).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("teacher-workspace")).toBeVisible();
  await expect.poll(() => page.getByTestId("canvas-object").count()).toBeGreaterThanOrEqual(2);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "تصدير" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  await page.locator('input[type="file"]').setInputFiles(path!);
  await expect(page.getByRole("status").filter({ hasText: "استُورد" })).toBeVisible();
  await page.getByRole("button", { name: "عرض الدرس" }).click();
  await expect(page.locator("main.presentation-mode")).toBeVisible();
  await expect(page.locator("main.presentation-mode")).toContainText("2x + 3 = 11");
  const exitPresentation = page.getByRole("button", { name: "خروج" });
  await exitPresentation.focus();
  await exitPresentation.press("Enter");
  await expect(page.getByTestId("teacher-workspace")).toBeVisible();
});

test("Journey L: lesson context survives export/import in the rendered UI", async ({ page }) => {
  await openWorkspace(page);
  await page.getByRole("textbox", { name: "عنوان الدرس" }).fill("المفعول به");
  await page.getByRole("button", { name: "الرياضيات", exact: true }).click();
  await page.getByRole("button", { name: "ثانوي", exact: true }).click();
  await page.getByRole("combobox", { name: "الصف / المستوى" }).selectOption({ label: "الصف الأول الثانوي" });
  await expect(page.getByRole("textbox", { name: "عنوان الدرس" })).toHaveValue("المفعول به");
  await expect(page.getByRole("button", { name: "الرياضيات", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "ثانوي", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("combobox", { name: "الصف \/ المستوى" })).toHaveValue("الصف الأول الثانوي");
  await page.getByTestId("save-lesson-button").click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "تصدير" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  await page.getByRole("button", { name: "الرياضيات", exact: true }).click();
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles(path!);
  await expect(page.getByRole("status").filter({ hasText: "استُورد" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "عنوان الدرس" })).toHaveValue("المفعول به");
  await expect(page.getByRole("button", { name: "الرياضيات", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "ثانوي", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("combobox", { name: "الصف \/ المستوى" })).toHaveValue("الصف الأول الثانوي");
});

test("Journey M: legacy document renders safely without invented context", async ({ page }) => {
  await openWorkspace(page);
  const legacy = { format: "medad-lesson", formatVersion: 1, document: { id: "legacy-board", title: "درس قديم", version: 1, pages: [{ id: "legacy-page", name: "صفحة قديمة", objects: [{ id: "legacy-text", type: "TextObject", content: "محتوى قديم", position: { x: 20, y: 20 }, dimensions: { width: 160, height: 60 } }] }], activePageId: "legacy-page" } };
  await page.locator('input[type="file"]').setInputFiles({ name: "legacy.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(legacy)) });
  await expect(page.getByRole("status").filter({ hasText: "استُورد" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "عنوان الدرس" })).toHaveValue("درس قديم");
  await expect(page.getByRole("button", { name: "العربية", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: "الرياضيات", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: "ابتدائي", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: "إعدادي", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("combobox", { name: "الصف \/ المستوى" })).toHaveValue("");
  await expect(page.getByTestId("canvas-object").filter({ hasText: "محتوى قديم" })).toHaveCount(1);
});

test("Journey N: accessibility pre-pilot surface and keyboard controls", async ({ page }) => {
  await openWorkspace(page);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("textbox", { name: "عنوان الدرس" })).toBeVisible();
  await expect(page.getByRole("radiogroup", { name: "المادة" })).toBeVisible();
  await expect(page.getByRole("radiogroup", { name: "الفئة" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "الصف / المستوى" })).toBeVisible();
  await expect(page.locator('[aria-live="polite"]')).toHaveCount(3);

  const subject = page.getByRole("button", { name: "الرياضيات", exact: true });
  await subject.focus();
  await expect.poll(() => subject.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await subject.press("Space");
  await expect(subject).toHaveAttribute("aria-pressed", "true");

  const category = page.getByRole("button", { name: "ثانوي", exact: true });
  await category.focus();
  await category.press("Enter");
  await expect(category).toHaveAttribute("aria-pressed", "true");

  const level = page.getByRole("combobox", { name: "الصف / المستوى" });
  await level.focus();
  await level.press("ArrowDown");
  await expect(level).toHaveValue("الصف الثاني الثانوي");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("teacher-workspace")).toBeVisible();

  await page.getByTestId("student-preview-button").focus();
  await page.getByTestId("student-preview-button").press("Enter");
  await expect(page.getByRole("main")).toContainText("معاينة الطالب");
  await page.getByRole("button", { name: "العودة إلى المعلم" }).focus();
  await page.getByRole("button", { name: "العودة إلى المعلم" }).press("Enter");
  await expect(page.getByTestId("teacher-workspace")).toBeVisible();
});

test("Journey J: keyboard selection, Escape, and text-editing isolation", async ({ page }) => {
  await openWorkspace(page);
  await page.getByTestId("add-text-object").click();
  const object = page.getByTestId("canvas-object").first();
  await object.focus();
  await page.keyboard.press("Enter");
  await expect(object).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(object).toHaveAttribute("aria-pressed", "false");
  await object.focus();
  await page.keyboard.press("Enter");
  const editor = page.getByRole("textbox", { name: "تحرير محتوى العنصر المحدد" });
  await editor.fill("نص keyboard محفوظ");
  await page.keyboard.press("ArrowLeft");
  await expect(editor).toHaveValue("نص keyboard محفوظ");
});


test("Productization: poetry safety, external references, and teacher review controls", async ({ page }) => {
  await openWorkspace(page);
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await page.locator("details.teacher-product-secondary").first().locator("summary").click();
  await expect(page.getByRole("heading", { name: "حلّل النص دون ادعاء غير متحقق" })).toBeVisible();
  await page.getByRole("textbox", { name: "البيت أو المقطع" }).fill("قفا نبك من ذكرى حبيب ومنزل");
  await page.getByRole("button", { name: "تحليل آمن" }).click();
  const poetryResult = page.getByRole("region", { name: "أداة الشعر" }).getByRole("status");
  await expect(poetryResult).toContainText("الوزن");
  await expect(poetryResult).toContainText("غير متحقق");
  await expect(page.getByRole("link", { name: /موارد العربية/ })).toHaveAttribute("href", /illinois\.edu/);
  await expect(page.getByRole("textbox", { name: "مصدر يقدمه المعلم \(اختياري\)" })).toBeVisible();
});
