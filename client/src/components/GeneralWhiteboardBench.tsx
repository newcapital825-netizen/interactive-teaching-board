/**
 * Gate 1B general whiteboard benchmark.
 * All entries use one vendor-neutral EducationalObject shape; this is evidence UI, not production.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Edit3, Eye, Image, Maximize2, Play, Plus, Redo2, Save, Square, Trash2, Undo2 } from "lucide-react";

type Kind = "Text" | "Drawing" | "Shape" | "Image" | "SentenceObject" | "EquationObject" | "ConceptGraphObject";
type EducationalObject = { id: string; type: Kind; content: string; x: number; y: number; width: number; height: number; metadata: string };
type BenchSnapshot = { objects: EducationalObject[]; selectedId: string; presentation: boolean };

const seed: EducationalObject[] = [
  { id: "text_01", type: "Text", content: "اكتب فكرة الدرس هنا", x: 26, y: 54, width: 190, height: 86, metadata: "generic / editable" },
  { id: "drawing_01", type: "Drawing", content: "✎", x: 236, y: 54, width: 140, height: 86, metadata: "pointer stroke placeholder" },
  { id: "shape_01", type: "Shape", content: "◇", x: 396, y: 54, width: 140, height: 86, metadata: "selectable shape" },
  { id: "image_01", type: "Image", content: "صورة تعليمية", x: 26, y: 160, width: 190, height: 86, metadata: "image placeholder" },
  { id: "sentence_01", type: "SentenceObject", content: "قرأَ الطالبُ الكتابَ", x: 236, y: 160, width: 300, height: 86, metadata: "Arabic engine object" },
  { id: "equation_01", type: "EquationObject", content: "2x + 5 = 15", x: 26, y: 266, width: 190, height: 86, metadata: "Math engine object" },
  { id: "graph_01", type: "ConceptGraphObject", content: "الجملة → المعنى", x: 236, y: 266, width: 300, height: 86, metadata: "Graph Adapter object" },
];

const copy = (value: EducationalObject[]) => JSON.parse(JSON.stringify(value)) as EducationalObject[];

export default function GeneralWhiteboardBench() {
  const [objects, setObjects] = useState(seed);
  const [selectedId, setSelectedId] = useState(seed[4].id);
  const [history, setHistory] = useState<BenchSnapshot[]>([]);
  const [future, setFuture] = useState<BenchSnapshot[]>([]);
  const [presentation, setPresentation] = useState(false);
  const [notice, setNotice] = useState("7 كائنات جاهزة للاختبار");
  const drag = useRef<{ id: string; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const snapshot = useMemo(() => ({ objects, selectedId, presentation }), [objects, selectedId, presentation]);

  useEffect(() => {
    const saved = localStorage.getItem("gate1b-general-whiteboard");
    if (!saved) return;
    try { const parsed = JSON.parse(saved) as BenchSnapshot; setObjects(parsed.objects); setSelectedId(parsed.selectedId); setPresentation(false); setNotice("تمت استعادة اللوحة العامة"); } catch { setNotice("تعذر استعادة اللوحة العامة"); }
  }, []);

  useEffect(() => {
    if (!drag.current) return;
    const move = (event: PointerEvent) => {
      const active = drag.current;
      if (!active) return;
      const dx = event.clientX - active.startX;
      const dy = event.clientY - active.startY;
      setObjects((current) => current.map((item) => item.id === active.id ? { ...item, x: Math.max(8, active.originX + dx), y: Math.max(8, active.originY + dy) } : item));
    };
    const up = () => { drag.current = null; };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up, { once: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [drag.current]);

  function commit(next: EducationalObject[], message: string) { setHistory((current) => [...current.slice(-19), { objects: copy(objects), selectedId, presentation }]); setFuture([]); setObjects(next); setNotice(message); }
  function selected() { return objects.find((item) => item.id === selectedId); }
  function updateSelected(patch: Partial<EducationalObject>, message: string) { if (!selected()) return; commit(objects.map((item) => item.id === selectedId ? { ...item, ...patch } : item), message); }
  function duplicate() { const item = selected(); if (!item) return; const next = { ...item, id: `${item.type.toLowerCase()}_${Date.now()}`, x: item.x + 18, y: item.y + 18 }; setSelectedId(next.id); commit([...objects, next], "تم تكرار الكائن مع حفظ هويته الجديدة"); }
  function remove() { if (!selected()) return; commit(objects.filter((item) => item.id !== selectedId), "تم حذف الكائن"); setSelectedId(objects.find((item) => item.id !== selectedId)?.id ?? ""); }
  function undo() { const previous = history.at(-1); if (!previous) return setNotice("لا توجد خطوة للتراجع"); setFuture((current) => [snapshot, ...current]); setHistory((current) => current.slice(0, -1)); setObjects(previous.objects); setSelectedId(previous.selectedId); setPresentation(previous.presentation); setNotice("تراجع على اللوحة العامة"); }
  function redo() { const next = future[0]; if (!next) return setNotice("لا توجد خطوة للإعادة"); setHistory((current) => [...current, snapshot]); setFuture((current) => current.slice(1)); setObjects(next.objects); setSelectedId(next.selectedId); setPresentation(next.presentation); setNotice("إعادة على اللوحة العامة"); }
  function save() { localStorage.setItem("gate1b-general-whiteboard", JSON.stringify(snapshot)); setNotice("حُفظت الكائنات والمواضع والحالة"); }
  function startMove(event: React.PointerEvent, item: EducationalObject) { setSelectedId(item.id); drag.current = { id: item.id, startX: event.clientX, startY: event.clientY, originX: item.x, originY: item.y }; }

  return <section className={presentation ? "general-bench presentation" : "general-bench"} dir="ltr">
    <div className="general-header"><div><span className="kicker">04 / General whiteboard benchmark</span><h2>لوحة تعليمية واحدة · كائنات متعددة</h2><p>Text · Drawing · Shape · Image · Sentence · Equation · Concept Graph</p></div><span className="general-status">{notice}</span></div>
    {!presentation && <div className="general-toolbar"><button onClick={undo} aria-label="تراجع"><Undo2 size={14} /></button><button onClick={redo} aria-label="إعادة"><Redo2 size={14} /></button><span className="toolbar-divider" /><button onClick={() => updateSelected({ x: (selected()?.x ?? 0) - 12 }, "تم تحريك الكائن")}>تحريك</button><button onClick={() => updateSelected({ width: (selected()?.width ?? 100) + 24, height: (selected()?.height ?? 80) + 8 }, "تم تغيير حجم الكائن")}>تغيير الحجم</button><button onClick={duplicate}><Copy size={14} /> تكرار</button><button onClick={remove}><Trash2 size={14} /> حذف</button><button onClick={save}><Save size={14} /> حفظ</button><button onClick={() => { setPresentation(true); setNotice("وضع العرض — الأدوات مخفية"); }}><Play size={14} /> عرض</button></div>}
    {presentation && <div className="presentation-bar"><span>Presentation Mode · الكائنات تحتفظ بسلوكها</span><button onClick={() => { setPresentation(false); setNotice("عادت أدوات التحرير"); }}><Edit3 size={14} /> تحرير</button></div>}
    <div className="general-stage" aria-label="General educational whiteboard"><div className="stage-grid" />{objects.map((item) => <button key={item.id} className={`general-object kind-${item.type.toLowerCase()} ${selectedId === item.id ? "selected" : ""}`} style={{ left: item.x, top: item.y, width: item.width, height: item.height }} onPointerDown={(event) => startMove(event, item)} onClick={() => setSelectedId(item.id)} aria-label={`${item.type}: ${item.content}`}><span className="general-object-type">{item.type}</span><strong>{item.type === "Drawing" ? <Edit3 size={24} /> : item.type === "Shape" ? <Square size={23} /> : item.type === "Image" ? <Image size={22} /> : item.type === "EquationObject" ? "∑" : item.content}</strong><small>{item.metadata}</small><i><Maximize2 size={12} /></i></button>)}</div>
    <div className="general-footer"><span><b>{objects.length}</b> objects</span><span>selected: <b>{selected()?.type ?? "none"}</b></span><span>move · resize · duplicate · delete · undo · redo · save · reload · presentation</span></div>
  </section>;
}
