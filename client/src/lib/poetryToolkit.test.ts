import { describe, expect, it } from "vitest";
import { analyzePoetry } from "./poetryToolkit";

describe("poetry toolkit", () => {
  it("reports only deterministic surface facts and never claims a meter", () => {
    const result = analyzePoetry("قفا نبك من ذكرى حبيب ومنزل\nبسقط اللوى بين الدخول فحومل");
    expect(result.lineCount).toBe(2);
    expect(result.wordCount).toBe(10);
    expect(result.characterCount).toBeGreaterThan(0);
    expect(result.meterStatus).toBe("غير متحقق");
    expect(result.literaryStatus).toBe("مراجعة المعلم مطلوبة");
    expect(result.provenance).toBe("نص أدخله المعلم");
  });

  it("handles empty input without inventing content", () => {
    expect(analyzePoetry(" ")).toMatchObject({ verse: "", lineCount: 0, wordCount: 0, characterCount: 0 });
  });
});
