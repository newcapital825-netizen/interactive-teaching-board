import { describe, expect, it } from "vitest";

type Gate1BFrozenSentenceFixture = {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  source: { kind: string; label: string };
};

const sentenceObject: Gate1BFrozenSentenceFixture = {
  id: "sentence_01",
  type: "SentenceObject",
  content: "قرأَ الطالبُ الكتابَ",
  position: { x: 236, y: 160 },
  size: { width: 300, height: 86 },
  source: { kind: "teacher_text", label: "نص المعلم" },
};

describe("Gate 1B Educational Object contract", () => {
  it("preserves identity, content, provenance, position, and size", () => {
    expect(sentenceObject.type).toBe("SentenceObject");
    expect(sentenceObject.id).toBe("sentence_01");
    expect(sentenceObject.content).toContain("الطالبُ");
    expect(sentenceObject.source.kind).toBe("teacher_text");
    expect(sentenceObject.position.x).toBeGreaterThanOrEqual(0);
    expect(sentenceObject.size.width).toBeGreaterThan(0);
  });

  it("can be serialized and restored without losing domain identity", () => {
    const restored = JSON.parse(JSON.stringify(sentenceObject)) as Gate1BFrozenSentenceFixture;
    expect(restored).toEqual(sentenceObject);
  });
});
