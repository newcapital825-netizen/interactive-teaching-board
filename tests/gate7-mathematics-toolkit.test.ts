import { describe, expect, it } from "vitest";
import { assessMathToolkitAnswer, getMathToolkitFixture, mathToolkitFixtures, regenerateMathToolkitLens } from "../client/src/lib/mathToolkit";

describe("Gate 7 bounded mathematics toolkit", () => {
  it("provides three source-preserving bounded equation fixtures", () => {
    expect(mathToolkitFixtures).toHaveLength(3);
    expect(mathToolkitFixtures.map((item) => item.equation)).toEqual(["2x + 3 = 11", "2x - 3 = 11", "1/2x + 3 = 11"]);
    expect(mathToolkitFixtures.every((item) => item.supported && item.steps.length === 2 && item.provenance.sourceObjectId === item.id)).toBe(true);
  });

  it("regenerates a source-preserving visualization lens", () => {
    const fixture = getMathToolkitFixture("math-toolkit-canonical");
    const lens = regenerateMathToolkitLens(fixture);
    expect(lens.type).toBe("MathVisualizationLens");
    expect(lens.sourceObjectId).toBe(fixture.id);
    expect(lens.sourceVersion).toBe(1);
    expect(lens.provenance.derivationType).toBe("bounded-math-toolkit-visualization");
    expect(lens.steps).toHaveLength(2);
  });

  it("accepts canonical and equivalent final-answer representations", () => {
    const fixture = getMathToolkitFixture("math-toolkit-negative-constant");
    expect(assessMathToolkitAnswer(fixture, "x = 7").state).toBe("correct");
    expect(assessMathToolkitAnswer(fixture, "7 = x").state).toBe("valid-alternative");
    expect(assessMathToolkitAnswer(fixture, "").state).toBe("incomplete");
    expect(assessMathToolkitAnswer(fixture, "x = 8").state).toBe("incorrect");
  });

  it("keeps unsupported answer shapes in teacher review instead of claiming symbolic certainty", () => {
    const fixture = getMathToolkitFixture("math-toolkit-fractional-coefficient");
    expect(assessMathToolkitAnswer(fixture, "x = 16").state).toBe("correct");
    expect(assessMathToolkitAnswer(fixture, "sqrt(256)").state).toBe("needs-review");
    expect(assessMathToolkitAnswer(fixture, "x = 16").diagnostic).toBe("correct-step");
  });
});
