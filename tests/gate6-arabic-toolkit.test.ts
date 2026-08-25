import { beforeEach, describe, expect, it } from "vitest";
import { createDocument, createObject, getActivePage, persistDocument, restoreDocument } from "../client/src/lib/coreBoard";
import { evaluateAnswer, type ActivityDefinition } from "../client/src/lib/gate4bTeaching";
import { arabicToolkitGoldenDataset } from "./fixtures/arabic-toolkit.golden";

const activity = (expectedAnswer: string, answer: string): ActivityDefinition => ({ id: "reading", subject: "arabic", prompt: "من قام بالفعل؟", interactionKind: "classify", sourceObjectId: "source_1", lensId: "lens_1", expectedAnswer, acceptedAnswers: [expectedAnswer], answer, attemptCount: 1, completionState: "incomplete", assessmentId: null, feedbackId: null, createdAt: "gate6", updatedAt: "gate6" });

describe("Gate 6 bounded Arabic toolkit", () => {
  beforeEach(() => { const values = new Map<string, string>(); Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => values.delete(key), clear: () => values.clear() } }); });

  it("reuses canonical deterministic assessment for source-defined comprehension answers", () => {
    expect(evaluateAnswer(activity("الطالب", "الطالب"), "الطالب").state).toBe("correct");
    expect(evaluateAnswer(activity("الطالب", "المعلم"), "المعلم").state).toBe("incorrect");
    expect(evaluateAnswer(activity("الطالب", ""), "").state).toBe("incomplete");
  });

  it("covers 50 teacher-authored Arabic fixtures across domains and evidence categories", () => {
    expect(arabicToolkitGoldenDataset.length).toBeGreaterThanOrEqual(50);
    expect(new Set(arabicToolkitGoldenDataset.map((item) => item.domain))).toEqual(new Set(["grammar", "i3rab", "morphology", "spelling", "reading", "vocabulary", "writing"]));
    expect(new Set(arabicToolkitGoldenDataset.map((item) => item.expectation))).toEqual(new Set(["valid", "invalid", "alternative", "incomplete", "boundary", "unsupported"]));
    expect(new Set(arabicToolkitGoldenDataset.map((item) => item.id)).size).toBe(arabicToolkitGoldenDataset.length);
    expect(arabicToolkitGoldenDataset.every((item) => item.source.length > 0 && item.prompt.length > 0 && item.note.length > 0)).toBe(true);
  });

  it("preserves a bounded annotation chain on the canonical board", () => {
    const document = createDocument();
    const page = getActivePage(document)!;
    const source = createObject("SentenceObject", "كتبَ الطالبُ الدرسَ", 72, 180);
    const annotation = createObject("TextObject", "هذه ملاحظة", 72, 310);
    source.metadata = { ...source.metadata, sourceRange: { start: 0, end: source.content.length }, annotationIds: [annotation.id] };
    annotation.metadata = { ...annotation.metadata, annotationOf: source.id, sourceRange: { start: 6, end: 13 }, kind: "arabic-teaching-annotation" };
    page.objects.push(source, annotation);
    expect(persistDocument(document).ok).toBe(true);
    const restored = restoreDocument()!;
    const restoredSource = restored.pages[0].objects.find((item) => item.id === source.id)!;
    const restoredAnnotation = restored.pages[0].objects.find((item) => item.id === annotation.id)!;
    expect(restoredSource.metadata.annotationIds).toEqual([annotation.id]);
    expect(restoredAnnotation.metadata.annotationOf).toBe(source.id);
    expect(restoredAnnotation.metadata.sourceRange).toEqual({ start: 6, end: 13 });
  });
});
