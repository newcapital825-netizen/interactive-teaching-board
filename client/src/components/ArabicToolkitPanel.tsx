import { useEffect, useMemo, useState } from "react";
import { BookOpen, Check, Highlighter, MessageSquarePlus, Play, Save, Target } from "lucide-react";
import { createArabicSource, createGrammarLens, evaluateAnswer, type ActivityDefinition, type GrammarLens } from "@/lib/gate4bTeaching";
import { createObject, persistDocument, restoreDocument, type BoardDocument } from "@/lib/coreBoard";

/* Bounded Arabic teaching tooling over the canonical Grammar Lens; unsupported text never receives an invented analysis. */
type ReadingState = { text: string; selection: string; note: string; prompt: string; expectedAnswer: string; studentAnswer: string; result: string };
const KEY = "gate6-arabic-toolkit";
const initial: ReadingState = { text: "كتبَ الطالبُ الدرسَ.", selection: "الطالبُ", note: "لاحظ الفاعل وعلاقته بالفعل.", prompt: "من قام بالفعل؟", expectedAnswer: "الطالبُ", studentAnswer: "", result: "" };
const SUPPORTED_SENTENCES = new Set(["كتبَ الطالبُ الدرسَ.", "العلمُ نورٌ.", "مررتُ بالبيتِ.", "قرأَ الطفلُ.", "يكتبُ الطالبُ.", "اكتبْ الدرسَ.", "جاءَ الطالبُ المجتهدُ.", "كتابُ الطالبِ جديدٌ."]);
const normalize = (value: string) => value.trim().replace(/[ًٌٍَُِّْـ]/g, "").replace(/[إأآ]/g, "ا");

export default function ArabicToolkitPanel() {
  const [state, setState] = useState<ReadingState>(() => { try { return { ...initial, ...(JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<ReadingState> | null) }; } catch { return initial; } });
  const [notice, setNotice] = useState("اكتب مصدرًا، حدّد عبارة، ثم حلّلها من الأمثلة المثبتة أو حوّلها إلى تدريب.");
  const [analysisRequested, setAnalysisRequested] = useState(false);
  const selectedIndex = useMemo(() => state.text.indexOf(state.selection), [state.text, state.selection]);
  const grammarLens = useMemo<GrammarLens | null>(() => {
    const sentence = state.text.trim();
    if (!SUPPORTED_SENTENCES.has(sentence)) return null;
    return createGrammarLens(createArabicSource(sentence), "productization-arabic");
  }, [state.text]);
  const selectedWord = grammarLens?.words.find((word) => word.text === state.selection.trim()) ?? grammarLens?.words[1] ?? null;

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);
  const update = (patch: Partial<ReadingState>) => { setState((current) => ({ ...current, ...patch, result: patch.studentAnswer !== undefined ? "" : current.result })); if (patch.text !== undefined) setAnalysisRequested(false); };

  function analyzeSentence() {
    if (!grammarLens) { setAnalysisRequested(true); setNotice("هذا النص خارج الأمثلة العربية المثبتة حاليًا؛ لم يُنشأ تحليل أو إعراب تخميني."); return; }
    setAnalysisRequested(true);
    setNotice("ظهر التحليل من Grammar Lens الحتمي لهذا المثال؛ راجع المعلم قبل اعتماده للطلاب.");
  }

  function addSentenceToBoard() {
    const document = restoreDocument();
    if (!document) return setNotice("احفظ الدرس أولًا من الشريط العلوي لإضافة المحتوى.");
    const page = document.pages.find((item) => item.id === document.activePageId) ?? document.pages[0];
    const sentence = createObject("SentenceObject", state.text, 72, 180);
    const start = Math.max(0, selectedIndex);
    const annotation = createObject("TextObject", state.note, 72, 310);
    sentence.metadata = { ...sentence.metadata, sourceRange: { start: 0, end: state.text.length }, annotationIds: [annotation.id] };
    sentence.source = { kind: "teacher", reference: `source:${sentence.id}:v${sentence.metadata.version}` };
    annotation.metadata = { ...annotation.metadata, annotationOf: sentence.id, sourceRange: { start, end: start + state.selection.length }, kind: "arabic-teaching-annotation" };
    const next: BoardDocument = { ...document, pages: document.pages.map((item) => item.id === page.id ? { ...item, objects: [...item.objects, sentence, annotation] } : item) };
    const saved = persistDocument(next);
    setNotice(saved.ok ? "أضيف المصدر إلى الصفحة الحالية مع حفظ مرجعه." : "تعذر إضافة المصدر إلى اللوحة.");
  }

  function assessReading() {
    const activity: ActivityDefinition = { id: "reading_activity", subject: "arabic", prompt: state.prompt, interactionKind: "classify", sourceObjectId: "reading_source", lensId: "reading_lens", expectedAnswer: normalize(state.expectedAnswer), acceptedAnswers: [normalize(state.expectedAnswer)], answer: normalize(state.studentAnswer), attemptCount: 0, completionState: "incomplete", assessmentId: null, feedbackId: null, i3rab: undefined, createdAt: "gate6", updatedAt: "gate6" };
    const result = evaluateAnswer(activity, state.studentAnswer);
    update({ result: result.state });
    setNotice(result.state === "correct" ? "إجابة صحيحة ضمن الإجابة التي حدّدها المعلم." : "الإجابة تحتاج مراجعة؛ لا يوجد تخمين خارج مصدر المعلم.");
  }

  return <section className="arabic-toolkit-panel" aria-label="أدوات العربية للمعلم"><div className="arabic-toolkit-heading"><div><span className="teacher-product-kicker">مِداد · أدوات العربية</span><h2>من النص إلى نشاط الفهم</h2><p>أدوات محددة المصدر: لا تُنشئ معنى خارج ما كتبه المعلم.</p></div><div className="arabic-toolkit-status"><Check size={15} /> مصدر المحتوى محفوظ</div></div><div className="arabic-toolkit-grid"><div className="arabic-toolkit-source"><label><span>النص أو الفقرة</span><textarea value={state.text} onChange={(event) => update({ text: event.target.value })} aria-label="النص أو الفقرة" /></label><div className="arabic-toolkit-selection"><label><span>النص المحدد</span><input value={state.selection} onChange={(event) => update({ selection: event.target.value })} aria-label="النص المحدد" /></label><span className="arabic-toolkit-range">{selectedIndex >= 0 ? `نطاق المصدر ${selectedIndex}–${selectedIndex + state.selection.length}` : "العبارة غير موجودة في المصدر"}</span></div><label><span>ملاحظة تعليمية</span><input value={state.note} onChange={(event) => update({ note: event.target.value })} aria-label="ملاحظة تعليمية" /></label><div className="arabic-toolkit-actions"><button className="gate4b-primary-button" onClick={addSentenceToBoard}><Save size={14} /> إضافة المصدر للوحة</button><button className="gate4b-quiet-button" onClick={() => setNotice("التمييز محفوظ محليًا كتعليق مع نطاق المصدر.")}><Highlighter size={14} /> تمييز العبارة</button><button className="gate4b-quiet-button" onClick={analyzeSentence} data-testid="arabic-analyze-button"><BookOpen size={14} /> تحليل وإعراب</button><span><MessageSquarePlus size={14} /> ملاحظة محفوظة</span></div>{analysisRequested && grammarLens && <div className="arabic-analysis-card" data-testid="arabic-analysis"><div className="arabic-toolkit-section-title"><span><BookOpen size={15} /> تحليل وإعراب</span><small>Grammar Lens · مثال مثبت</small></div><div className="arabic-analysis-words">{grammarLens.words.map((word) => <button key={word.id} type="button" className={word.text === selectedWord?.text ? "selected" : ""} onClick={() => update({ selection: word.text })}>{word.text}</button>)}</div>{selectedWord && <div className="arabic-i3rab-result" data-testid="arabic-i3rab"><strong>{selectedWord.text}</strong><span>{selectedWord.grammaticalRole} · {selectedWord.caseMark}</span><p>{selectedWord.explanation}</p><small>المصدر: النص الذي أدخله المعلم · المراجعة البشرية مطلوبة</small></div>}</div>}{analysisRequested && !grammarLens && <div className="arabic-analysis-card unsupported" data-testid="arabic-analysis-unsupported" role="status">لا يوجد تحليل مثبت لهذا النص حاليًا؛ لم تُخترع نتيجة.</div>}</div><div className="arabic-toolkit-reading"><div className="arabic-toolkit-section-title"><span><BookOpen size={15} /> فهم مقروء</span><small>سؤال من مصدر المعلم</small></div><label><span>السؤال</span><input value={state.prompt} onChange={(event) => update({ prompt: event.target.value })} aria-label="سؤال الفهم" /></label><label><span>الإجابة المقبولة التي يحددها المعلم</span><input value={state.expectedAnswer} onChange={(event) => update({ expectedAnswer: event.target.value })} aria-label="الإجابة المقبولة" /></label><div className="arabic-toolkit-student"><div><span>معاينة الطالب</span><strong>{state.prompt}</strong></div><label><span>إجابة الطالب</span><input value={state.studentAnswer} onChange={(event) => update({ studentAnswer: event.target.value })} aria-label="إجابة الطالب" placeholder="اكتب الإجابة من النص" /></label><button className="gate4b-primary-button" onClick={assessReading}><Play size={14} /> تقييم حتمي</button>{state.result && <div className={`arabic-toolkit-result ${state.result}`} role="status" aria-live="polite"><Target size={15} />{state.result === "correct" ? "صحيحة" : state.result === "partially-correct" ? "جزئية" : "غير صحيحة"}</div>}</div></div></div><p className="arabic-toolkit-notice" role="status">{notice}</p></section>;
}
