export type PoetryAnalysis = {
  verse: string;
  lineCount: number;
  wordCount: number;
  characterCount: number;
  meterStatus: "غير متحقق";
  literaryStatus: "مراجعة المعلم مطلوبة";
  provenance: "نص أدخله المعلم";
};

export function analyzePoetry(verse: string): PoetryAnalysis {
  const normalized = verse.trim();
  const lines = normalized ? normalized.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) : [];
  const words = normalized ? normalized.split(/\s+/).filter(Boolean) : [];
  return {
    verse: normalized,
    lineCount: lines.length,
    wordCount: words.length,
    characterCount: normalized.length,
    meterStatus: "غير متحقق",
    literaryStatus: "مراجعة المعلم مطلوبة",
    provenance: "نص أدخله المعلم",
  };
}
