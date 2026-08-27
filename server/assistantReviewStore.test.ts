import { describe, expect, it, beforeEach } from "vitest";
import { readAssistantReviewSnapshot, writeAssistantReviewSnapshot, type AssistantReviewSnapshot } from "../client/src/lib/assistantReviewStore";

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  });
});

describe("assistant review store", () => {
  it("round-trips teacher-led review state locally", () => {
    const snapshot: AssistantReviewSnapshot = {
      messages: [{ role: "user", content: "اشرح" }],
      lastEvidence: null,
      reviewState: "accepted",
      correction: "صياغة أوضح",
      providedSource: "مرجع قدمه المعلم",
      intent: "explain",
    };
    writeAssistantReviewSnapshot("assistant", snapshot);
    expect(readAssistantReviewSnapshot("assistant")).toMatchObject(snapshot);
  });

  it("rejects malformed values and bounds user-entered strings", () => {
    storage.set("assistant", JSON.stringify({
      messages: [{ role: "system", content: "غير مسموح" }, { role: "assistant", content: "مقبول" }],
      reviewState: "unknown",
      intent: "chat",
      correction: "x".repeat(3000),
      providedSource: "y".repeat(600),
    }));
    const result = readAssistantReviewSnapshot("assistant");
    expect(result?.messages).toEqual([{ role: "assistant", content: "مقبول" }]);
    expect(result?.reviewState).toBeUndefined();
    expect(result?.intent).toBeUndefined();
    expect(result?.correction).toHaveLength(2000);
    expect(result?.providedSource).toHaveLength(500);
  });
});
