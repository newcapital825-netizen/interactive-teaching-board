import { describe, expect, it } from "vitest";
import { createObject } from "../client/src/lib/coreBoard";
import { actionSupports, convertToActivity, getContextualActions } from "../client/src/lib/contextualActions";

describe("Gate 8 contextual teaching actions", () => {
  it("shows Arabic actions for a sentence and does not invent math actions", () => {
    const sentence = createObject("SentenceObject", "قرأ الطالب النص", 0, 0);
    const actions = getContextualActions(sentence);
    expect(actions.map((action) => action.id)).toContain("analyze");
    expect(actions.map((action) => action.id)).toContain("convert-to-activity");
    expect(actions.map((action) => action.id)).not.toContain("visualize");
  });

  it("shows mathematics actions for an equation", () => {
    const equation = createObject("EquationObject", "2x + 3 = 11", 0, 0);
    expect(actionSupports(equation, "visualize")).toBe(true);
    expect(actionSupports(equation, "assess")).toBe(false);
    expect(getContextualActions(equation).map((action) => action.id)).toContain("practice");
  });

  it("converts supported content into a canonical activity with provenance", () => {
    const sentence = createObject("SentenceObject", "جملة مصدر", 10, 10);
    const result = convertToActivity(sentence, { sourceRange: { start: 0, end: 5 } });
    expect(result.createdObject?.type).toBe("ActivityObject");
    expect(result.createdObject?.metadata.sourceObjectId).toBe(sentence.id);
    expect(result.provenance.sourceObjectId).toBe(sentence.id);
    expect(result.provenance.sourceRange).toEqual({ start: 0, end: 5 });
  });

  it("keeps unsupported activity conversion safe", () => {
    const shape = createObject("ShapeObject", "rectangle", 0, 0);
    expect(() => convertToActivity(shape)).toThrow(/does not support/);
    expect(getContextualActions(shape).find((action) => action.id === "convert-to-activity")).toBeUndefined();
  });
});
