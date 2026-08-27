import { describe, expect, it } from "vitest";
import { createObject } from "../client/src/lib/coreBoard";
import { createContextualIntelligenceResult } from "../client/src/lib/contextualIntelligence";
import { recognizeContent } from "../client/src/lib/contentRecognition";

const supportedSentence = "كتبَ الطالبُ الدرسَ.";

describe("Master product coherence contracts", () => {
  it("recognizes supported Arabic sentence input without leaving the board", () => {
    const result = recognizeContent(supportedSentence);
    expect(result.kind).toBe("arabic-sentence");
    expect(result.confidence).toBe("high");
    expect(result.recommendedObjectType).toBe("SentenceObject");
    expect(result.actions).toContain("إعراب");
  });

  it("returns a reusable I3rab object from the canonical Arabic lens", () => {
    const source = createObject("SentenceObject", supportedSentence, 0, 0);
    const result = createContextualIntelligenceResult(source, "analyze");
    expect(result.status).toBe("supported");
    expect(result.createdObject?.type).toBe("I3rabObject");
    expect(result.createdObject?.metadata.sourceObjectId).toBe(source.id);
    expect(result.details.join(" ")).toContain("فاعل");
    expect(result.provenanceLabel).toContain("حتمي");
  });

  it("builds a bounded word map only for the known word example", () => {
    const source = createObject("TextObject", "المعلم", 0, 0);
    const result = createContextualIntelligenceResult(source, "word-map");
    expect(result.status).toBe("supported");
    expect(result.createdObject?.type).toBe("WordObject");
    expect(result.summary).toContain("يعلّم");
    expect(result.details.join(" ")).toContain("ع ل م");
  });

  it("uses deterministic math fixtures and refuses unsupported equations", () => {
    const supported = createObject("EquationObject", "2x + 3 = 11", 0, 0);
    const supportedResult = createContextualIntelligenceResult(supported, "analyze");
    expect(supportedResult.status).toBe("supported");
    expect(supportedResult.createdObject?.type).toBe("SolutionStepsObject");
    expect(supportedResult.details.join(" ")).toContain("x = 4");

    const unsupported = createObject("EquationObject", "3x + 1 = 10", 0, 0);
    const unsupportedResult = createContextualIntelligenceResult(unsupported, "analyze");
    expect(unsupportedResult.status).toBe("uncertain");
    expect(unsupportedResult.createdObject).toBeUndefined();
    expect(unsupportedResult.safeMessage).toContain("لم أجد");
  });

  it("keeps poetry evidence-bounded and visibly reviewable", () => {
    const source = createObject("TextObject", "وإذا أتتك مذمتي من ناقص", 0, 0);
    const result = createContextualIntelligenceResult(source, "analyze");
    expect(result.status).toBe("uncertain");
    expect(result.createdObject?.type).toBe("PoetryObject");
    expect(result.safeMessage).toContain("مراجعة المعلم");
    expect(result.details.join(" ")).toContain("غير متحقق");
  });

  it("does not guess for unknown content", () => {
    const result = recognizeContent("unclassified draft");
    expect(result.confidence).toBe("low");
    expect(result.safeMessage).toBeTruthy();
    expect(result.recommendedObjectType).toBe("TextObject");
  });
});
