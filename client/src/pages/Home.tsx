/**
 * Gate 1 Spike — ورشة المخطوط الحي.
 * Architecture reminder: domain data is independent from canvas state and graph presentation.
 * This is disposable evidence, not production UI or a complete Arabic parser.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  Grip,
  Hand,
  Maximize2,
  MousePointer2,
  Redo2,
  RotateCcw,
  Save,
  ScanText,
  Sparkles,
  Undo2,
} from "lucide-react";

type Analysis = {
  token: string;
  lexicalCategory: string;
  grammaticalRole: string;
  grammaticalState: string;
  ending: string;
  confidence: "HIGH_CONFIDENCE" | "CANDIDATE";
  method: string;
};

type SentenceObject = {
  id: string;
  type: "SentenceObject";
  sentence: string;
  source: { kind: "teacher_text"; label: string };
  analysis: Analysis;
  views: string[];
};

type CanvasState = { x: number; y: number; width: number; height: number; zIndex: number };
type Snapshot = { object: SentenceObject; canvas: CanvasState };

const sentence = "قرأَ الطالبُ الكتابَ";
const words = [
  { value: "قرأَ", label: "فعل ماضٍ", role: "فعل" },
  { value: "الطالبُ", label: "اسم", role: "فاعل / مرفوع" },
  { value: "الكتابَ", label: "اسم", role: "مفعول به / منصوب" },
];
const defaultObject: SentenceObject = {
  id: "sentence_obj_01",
  type: "SentenceObject",
  sentence,
  source: { kind: "teacher_text", label: "نص المعلم — المثال الحتمي" },
  analysis: {
    token: "الطالبُ",
    lexicalCategory: "اسم",
    grammaticalRole: "فاعل",
    grammaticalState: "مرفوع",
    ending: "الضمة الظاهرة",
    confidence: "HIGH_CONFIDENCE",
    method: "قاعدة توضيحية ثابتة — ليست محللًا كاملًا",
  },
  views: ["Text View", "Grammar View", "I3rab View"],
};
const defaultCanvas: CanvasState = { x: 94, y: 128, width: 510, height: 314, zIndex: 2 };

function cloneSnapshot(snapshot: Snapshot): Snapshot {
  return JSON.parse(JSON.stringify(snapshot)) as Snapshot;
}

export default function Home() {
  const [object, setObject] = useState<SentenceObject>(defaultObject);
  const [canvas, setCanvas] = useState<CanvasState>(defaultCanvas);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [activeWord, setActiveWord] = useState("الطالبُ");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [notice, setNotice] = useState("جاهز للاختبار");
  const [dragMode, setDragMode] = useState<"move" | "resize" | null>(null);
  const dragOrigin = useRef({ x: 0, y: 0, canvas: defaultCanvas });

  const snapshot = useMemo(() => ({ object, canvas }), [object, canvas]);

  useEffect(() => {
    const saved = window.localStorage.getItem("arabic-core-object-snapshot");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Snapshot;
        setObject(parsed.object);
        setCanvas(parsed.canvas);
        setSavedAt("مستعاد من التخزين المحلي");
        setNotice("تمت استعادة كائن التطبيق، لا حالة المكتبة فقط");
      } catch {
        setNotice("تعذر قراءة النسخة المحلية");
      }
    }
  }, []);

  useEffect(() => {
    if (!dragMode) return;
    const onMove = (event: PointerEvent) => {
      const dx = event.clientX - dragOrigin.current.x;
      const dy = event.clientY - dragOrigin.current.y;
      if (dragMode === "move") {
        setCanvas((current) => ({ ...current, x: Math.max(22, dragOrigin.current.canvas.x + dx), y: Math.max(76, dragOrigin.current.canvas.y + dy) }));
      } else {
        setCanvas((current) => ({ ...current, width: Math.max(360, dragOrigin.current.canvas.width + dx), height: Math.max(250, dragOrigin.current.canvas.height + dy) }));
      }
    };
    const onUp = () => setDragMode(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragMode]);

  function commit(nextObject = object, nextCanvas = canvas, message = "تم تحديث الكائن") {
    setHistory((current) => [...current.slice(-19), cloneSnapshot(snapshot)]);
    setFuture([]);
    setObject(nextObject);
    setCanvas(nextCanvas);
    setNotice(message);
  }

  function selectWord(word: (typeof words)[number]) {
    const next = { ...object, analysis: { ...object.analysis, token: word.value, grammaticalRole: word.value === "الطالبُ" ? "فاعل" : word.role, lexicalCategory: word.value === "قرأَ" ? "فعل" : "اسم", grammaticalState: word.value === "الكتابَ" ? "منصوب" : word.value === "قرأَ" ? "—" : "مرفوع", ending: word.value === "الكتابَ" ? "الفتحة الظاهرة" : word.value === "الطالبُ" ? "الضمة الظاهرة" : "—" } };
    setActiveWord(word.value);
    commit(next, canvas, "تم اختيار كلمة واشتقاق بطاقة دليل تجريبية");
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return setNotice("لا توجد خطوة للتراجع");
    setFuture((current) => [cloneSnapshot(snapshot), ...current]);
    setHistory((current) => current.slice(0, -1));
    setObject(previous.object);
    setCanvas(previous.canvas);
    setNotice("تراجع على مستوى الكائن واللوحة");
  }

  function redo() {
    const next = future[0];
    if (!next) return setNotice("لا توجد خطوة للإعادة");
    setHistory((current) => [...current, cloneSnapshot(snapshot)]);
    setFuture((current) => current.slice(1));
    setObject(next.object);
    setCanvas(next.canvas);
    setNotice("إعادة على مستوى الكائن واللوحة");
  }

  function save() {
    window.localStorage.setItem("arabic-core-object-snapshot", JSON.stringify(snapshot));
    const label = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    setSavedAt(label);
    setNotice("حُفظت تمثيلات Domain Data وPresentation وCanvas State");
  }

  function exportSnapshot() {
    const blob = new Blob([JSON.stringify({ ...snapshot, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "arabic-core-object-snapshot.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("تم تصدير تمثيل التطبيق المستقل عن المكتبة");
  }

  function startDrag(event: React.PointerEvent, mode: "move" | "resize") {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragOrigin.current = { x: event.clientX, y: event.clientY, canvas: { ...canvas } };
    setHistory((current) => [...current.slice(-19), cloneSnapshot(snapshot)]);
    setFuture([]);
    setDragMode(mode);
  }

  return (
    <main dir="rtl" className="spike-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-mark" src="/manus-storage/arabic-spike-mark_96f4c041.png" alt="" />
          <div><span className="eyebrow">GATE 1 · TECHNOLOGY SPIKE</span><h1>السبورة العربية الذكية</h1></div>
        </div>
        <div className="topbar-status"><span className="status-dot" /> <span>{notice}</span><strong>غير إنتاجي</strong></div>
      </header>

      <div className="workspace-grid">
        <aside className="rail">
          <div className="rail-index">01</div>
          <div className="rail-copy"><span>ARABIC CORE</span><strong>OBJECT<br />PROTOTYPE</strong></div>
          <div className="rail-line" />
          <div className="rail-foot">RTL<br />α 0.1</div>
        </aside>

        <section className="board-column">
          <div className="section-heading"><div><span className="kicker">01 / لغة المصدر</span><h2>اختبر حياة الكلمة داخل اللوحة</h2></div><span className="source-chip"><Check size={13} /> مصدر المعلم محفوظ</span></div>
          <div className="source-strip">
            <div className="source-label"><ScanText size={16} /><span>Arabic Text</span></div>
            <div className="sentence-line" aria-label="نص عربي قابل لاختيار الكلمات">{words.map((word) => <button key={word.value} className={activeWord === word.value ? "word active" : "word"} onClick={() => selectWord(word)}>{word.value}</button>)}</div>
            <div className="source-meta"><span>مثال حتمي</span><span>٣ كلمات</span></div>
          </div>

          <div className="canvas-frame" style={{ backgroundImage: "url('/manus-storage/arabic-spike-canvas-texture_1da3d7e9.png')" }}>
            <div className="canvas-toolbar"><span><MousePointer2 size={14} /> Canvas Adapter</span><span className="toolbar-divider" /><button onClick={undo} aria-label="تراجع"><Undo2 size={15} /></button><button onClick={redo} aria-label="إعادة"><Redo2 size={15} /></button><span className="toolbar-note">DOM proof surface</span></div>
            <div className="canvas-badge"><span>CANVAS STATE</span><strong>move · resize · edit</strong></div>
            <div className="educational-card" style={{ left: canvas.x, top: canvas.y, width: canvas.width, height: canvas.height, zIndex: canvas.zIndex }}>
              <div className="object-handle" onPointerDown={(event) => startDrag(event, "move")}><Grip size={16} /><span>Educational Object</span><span className="object-id">{object.id}</span></div>
              <div className="object-content">
                <div className="object-kicker"><span className="object-type">{object.type}</span><span>نسخة {object.id.slice(-2)}</span></div>
                <div className="object-word">{object.analysis.token}</div>
                <div className="object-role">{object.analysis.grammaticalRole} <span>·</span> {object.analysis.grammaticalState}</div>
                <div className="object-divider" />
                <div className="object-trace"><div><span>المصدر</span><strong>{object.source.label}</strong></div><div><span>الحالة</span><strong className="olive">{object.analysis.confidence}</strong></div></div>
              </div>
              <div className="resize-handle" onPointerDown={(event) => startDrag(event, "resize")}><Maximize2 size={14} /></div>
            </div>
            <div className="canvas-coordinates">x {Math.round(canvas.x)} · y {Math.round(canvas.y)} · {Math.round(canvas.width)}×{Math.round(canvas.height)} px</div>
          </div>

          <div className="board-actions"><button className="primary-action" onClick={save}><Save size={16} /> حفظ الكائن</button><button className="secondary-action" onClick={exportSnapshot}><Download size={16} /> تصدير JSON</button><span className="save-state">{savedAt ? `آخر حفظ: ${savedAt}` : "لم يُحفظ بعد"}</span></div>
        </section>

        <aside className="inspector">
          <div className="inspector-heading"><div><span className="kicker">02 / طبقة الدليل</span><h2>Graph Adapter</h2></div><button className="icon-button" aria-label="مساعدة"><CircleHelp size={17} /></button></div>
          <div className="lens-tabs"><button className="lens-tab active">I3rab View</button><button className="lens-tab">Grammar View</button><button className="lens-tab">Text View</button></div>
          <div className="graph-card"><div className="graph-header"><span>Visual Tree</span><span className="mini-state"><span className="status-dot" /> مستقل عن اللوحة</span></div><svg className="grammar-graph" viewBox="0 0 340 218" role="img" aria-label="شجرة إعراب تجريبية">
            <path d="M170 42 V68 M170 68 H78 V98 M170 68 H170 V98 M170 68 H262 V98" className="graph-edge" />
            <g><rect x="111" y="10" width="118" height="34" rx="4" className="graph-node root" /><text x="170" y="32" textAnchor="middle">الجملة</text></g>
            <g><rect x="28" y="98" width="100" height="56" rx="4" className={activeWord === "قرأَ" ? "graph-node selected" : "graph-node"} /><text x="78" y="120" textAnchor="middle">قرأَ</text><text x="78" y="140" textAnchor="middle" className="sub">فعل ماضٍ</text></g>
            <g><rect x="120" y="98" width="100" height="56" rx="4" className={activeWord === "الطالبُ" ? "graph-node selected" : "graph-node"} /><text x="170" y="120" textAnchor="middle">الطالبُ</text><text x="170" y="140" textAnchor="middle" className="sub">فاعل / مرفوع</text></g>
            <g><rect x="212" y="98" width="100" height="56" rx="4" className={activeWord === "الكتابَ" ? "graph-node selected" : "graph-node"} /><text x="262" y="120" textAnchor="middle">الكتابَ</text><text x="262" y="140" textAnchor="middle" className="sub">مفعول به</text></g>
          </svg><div className="graph-caption"><span>nodes 04</span><span>relations 03</span><span>RTL layout</span></div></div>
          <div className="analysis-card"><div className="analysis-title"><Sparkles size={15} /><span>Basic Language Analysis</span><span className="confidence">{object.analysis.confidence}</span></div><dl><div><dt>token</dt><dd>{object.analysis.token}</dd></div><div><dt>lexical category</dt><dd>{object.analysis.lexicalCategory}</dd></div><div><dt>grammatical role</dt><dd>{object.analysis.grammaticalRole}</dd></div><div><dt>state / ending</dt><dd>{object.analysis.grammaticalState} · {object.analysis.ending}</dd></div></dl><p className="disclaimer">هذه بنية توضيحية ثابتة لإثبات الفصل المعماري، وليست محللًا عربيًا كاملًا.</p></div>
          <div className="flow-note"><span>نفس الكائن · ثلاث عدسات</span><strong>SentenceObject → Text · Grammar · I3rab</strong><ChevronDown size={15} /></div>
        </aside>
      </div>
      <footer className="bottom-bar"><span><Hand size={14} /> pointer / touch surface evaluated</span><span>Canvas Adapter <b>↔</b> Educational Object <b>↔</b> Graph Adapter</span><span>Gate 1 · disposable evidence</span></footer>
    </main>
  );
}
