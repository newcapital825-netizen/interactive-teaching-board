import { useState } from "react";
import { Feather, ShieldAlert } from "lucide-react";
import { analyzePoetry, type PoetryAnalysis } from "@/lib/poetryToolkit";

export default function PoetryToolkitPanel() {
  const [verse, setVerse] = useState("");
  const [analysis, setAnalysis] = useState<PoetryAnalysis | null>(null);

  return (
    <section className="poetry-toolkit-panel" aria-label="أداة الشعر">
      <div className="poetry-toolkit-heading">
        <div>
          <span className="teacher-product-kicker"><Feather size={14} /> أداة الشعر</span>
          <h2>حلّل النص دون ادعاء غير متحقق</h2>
          <p>تعرض الأداة قياسات شكلية فقط، وتترك الوزن والتحليل الأدبي لمراجعة المعلم.</p>
        </div>
        <span className="poetry-toolkit-status"><ShieldAlert size={14} /> الوزن: غير متحقق</span>
      </div>
      <label className="poetry-toolkit-field">
        <span>البيت أو المقطع</span>
        <textarea value={verse} onChange={(event) => setVerse(event.target.value)} rows={4} placeholder="اكتب البيت أو المقطع هنا…" />
      </label>
      <button type="button" className="gate4b-primary-button" onClick={() => setAnalysis(analyzePoetry(verse))} disabled={!verse.trim()}>تحليل آمن</button>
      {analysis && (
        <div className="poetry-toolkit-result" role="status" aria-live="polite">
          <div><strong>النتيجة الشكلية</strong><span>{analysis.lineCount} أسطر · {analysis.wordCount} كلمات · {analysis.characterCount} حرفًا</span></div>
          <div><strong>الوزن</strong><span>{analysis.meterStatus}</span></div>
          <div><strong>التحليل الأدبي</strong><span>{analysis.literaryStatus}</span></div>
          <small>المصدر: {analysis.provenance}</small>
        </div>
      )}
    </section>
  );
}
