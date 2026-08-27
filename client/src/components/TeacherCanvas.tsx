/**
 * Gate 11 direct canvas interaction.
 * Design reminder: Arabic-first, paper-and-olive, asymmetric teacher workspace;
 * the canvas is the direct manipulation surface and delegates identity/capabilities
 * to the canonical CoreObject model without a second persistence or selection engine.
 */
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Copy, Group, MousePointer2, Redo2, Trash2, Ungroup, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { createObject, getActivePage, type BoardDocument, type CoreObject, type CoreObjectType } from "@/lib/coreBoard";
import { hasCapability } from "@/lib/educationalObjects";
import { resolveBoardCommand } from "@/lib/keyboardCommands";
import { alignObjects, distributeObjects, type Alignment } from "@/lib/whiteboardUx";
import { applyPageObjects, deleteObjects, duplicateObjects, emptySelection, groupObjects, moveObjects, objectsForSelection, patchObject, reorderObjects, resizeObjectFromCorner, sanitizeSelection, selectObjects, ungroupObject, type ResizeCorner, type SelectionState } from "@/lib/canvasInteraction";
import type { LayerDirection } from "@/lib/whiteboardUx";

type Props = { document: BoardDocument; selection: SelectionState; onDocumentChange: (document: BoardDocument, message: string) => void; onSelectionChange: (selection: SelectionState) => void; onNotice: (message: string) => void };
type DragState = { kind: "move" | "resize"; id: string; start: { x: number; y: number }; before: BoardDocument; origin?: { x: number; y: number }; corner?: ResizeCorner };
type HistoryState = { document: BoardDocument; selection: SelectionState };

const labels: Record<string, string> = { TextObject: "نص", SentenceObject: "جملة", EquationObject: "معادلة", ShapeObject: "شكل", GraphObject: "خريطة مفاهيم", QuestionObject: "سؤال", ActivityObject: "نشاط", GroupObject: "مجموعة", DrawingObject: "رسم", WordObject: "خريطة كلمة", I3rabObject: "إعراب", ExplanationObject: "شرح", SolutionStepsObject: "خطوات الحل", PoetryObject: "قراءة شعرية" };
const labelFor = (type: string) => labels[type] ?? "عنصر";
const contentFor = (item: CoreObject) => {
  if (item.type === "QuestionObject" && item.data && typeof item.data === "object" && "prompt" in item.data) return String((item.data as { prompt: unknown }).prompt);
  if (item.type === "ActivityObject" && item.data && typeof item.data === "object" && "instructions" in item.data) return String((item.data as { instructions: unknown }).instructions);
  if (item.data && typeof item.data === "object" && "title" in item.data && "summary" in item.data) return `${String((item.data as { title: unknown }).title)}: ${String((item.data as { summary: unknown }).summary)}`;
  return item.content;
};
const seedFor = (type: CoreObjectType): unknown => type === "SentenceObject" ? "جملة عربية قابلة للتحليل" : type === "EquationObject" ? "2x + 3 = 11" : type === "ShapeObject" ? "شكل تعليمي" : "ملاحظة تعليمية جديدة";
const idFactory = (type: CoreObjectType, index: number) => `${type.toLowerCase()}_copy_${Date.now()}_${index}`;

export default function TeacherCanvas({ document, selection, onDocumentChange, onSelectionChange, onNotice }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<"select" | "hand">("select");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<DragState | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);
  const [clipboard, setClipboard] = useState<CoreObject[]>([]);
  const page = getActivePage(document);
  const safeSelection = sanitizeSelection(page, selection);
  const selectedObjects = objectsForSelection(page.objects, safeSelection);
  const selected = safeSelection.primaryId ? page.objects.find((object) => object.id === safeSelection.primaryId) ?? null : null;

  useEffect(() => {
    if (safeSelection.ids.length !== selection.ids.length || safeSelection.primaryId !== selection.primaryId) onSelectionChange(safeSelection);
  }, [safeSelection, selection, onSelectionChange]);

  const pointerPosition = (event: ReactPointerEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    return rect ? { x: (event.clientX - rect.left - pan.x) / zoom, y: (event.clientY - rect.top - pan.y) / zoom } : { x: 0, y: 0 };
  };
  const commit = (next: BoardDocument, message: string, nextSelection = safeSelection) => {
    setHistory((current) => [...current.slice(-24), { document, selection: safeSelection }]);
    setFuture([]);
    onDocumentChange(next, message);
    onSelectionChange(nextSelection);
  };
  const updateObjects = (objects: CoreObject[], message: string, nextSelection = safeSelection) => commit(applyPageObjects(document, page.id, objects), message, nextSelection);
  const select = (event: ReactPointerEvent, id: string) => {
    event.stopPropagation();
    const item = page.objects.find((object) => object.id === id);
    if (!item) return;
    const next = selectObjects(safeSelection.ids, id, event.metaKey || event.ctrlKey);
    onSelectionChange(next);
    if (tool === "select" && !item.metadata.locked && hasCapability(item, "movable") && !event.metaKey && !event.ctrlKey) {
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setDrag({ kind: "move", id, start: pointerPosition(event), origin: { ...item.position }, before: document });
    }
  };
  const selectKeyboard = (event: ReactKeyboardEvent, id: string) => {
    if (event.key === "Escape") { event.preventDefault(); onSelectionChange(emptySelection()); onNotice("أُلغي التحديد."); return; }
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (!page.objects.some((object) => object.id === id)) return;
    const next = selectObjects(safeSelection.ids, id, event.shiftKey || event.metaKey || event.ctrlKey);
    onSelectionChange(next);
    onNotice(`تم تحديد ${next.ids.length} عنصر عبر لوحة المفاتيح.`);
  };
  const beginResize = (event: ReactPointerEvent, item: CoreObject, corner: ResizeCorner) => {
    event.stopPropagation();
    if (item.metadata.locked || !hasCapability(item, "resizable")) return onNotice("هذا العنصر مقفل أو لا يدعم تغيير الحجم");
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onSelectionChange({ ids: [item.id], primaryId: item.id });
    setDrag({ kind: "resize", id: item.id, corner, start: pointerPosition(event), before: document });
  };
  const move = (event: ReactPointerEvent) => {
    if (!drag) return;
    const point = pointerPosition(event);
    if (drag.kind === "move" && drag.origin) {
      const baseline = drag.before.pages.find((candidate) => candidate.id === page.id)?.objects ?? page.objects;
      const objects = moveObjects(baseline, [drag.id], point.x - drag.start.x, point.y - drag.start.y);
      onDocumentChange(applyPageObjects(document, page.id, objects), "");
    } else if (drag.kind === "resize" && drag.corner) {
      const source = page.objects.find((object) => object.id === drag.id);
      if (source) onDocumentChange(applyPageObjects(document, page.id, page.objects.map((object) => object.id === drag.id ? resizeObjectFromCorner(drag.before.pages.find((candidate) => candidate.id === page.id)?.objects.find((candidate) => candidate.id === drag.id) ?? source, drag.corner!, point.x - drag.start.x, point.y - drag.start.y) : object)), "");
    }
  };
  const finishDrag = () => {
    if (drag) { setHistory((current) => [...current.slice(-24), { document: drag.before, selection: safeSelection }]); setFuture([]); onNotice(drag.kind === "move" ? "تم تحريك العنصر مباشرة على اللوحة." : "تم تغيير الحجم مع الحفاظ على الهوية."); }
    setDrag(null);
  };
  const addObject = (type: CoreObjectType) => { const item = createObject(type, seedFor(type), 48 + (page.objects.length % 3) * 190, 48 + Math.floor(page.objects.length / 3) * 100); commit(applyPageObjects(document, page.id, [...page.objects, item]), `أضيف ${labelFor(type)} إلى اللوحة.`, { ids: [item.id], primaryId: item.id }); };
  const duplicate = () => { if (!safeSelection.ids.length) return onNotice("حدد عنصرًا أولًا."); const objects = duplicateObjects(page.objects, safeSelection.ids, idFactory); const ids = objects.filter((object) => !page.objects.some((prior) => prior.id === object.id)).map((object) => object.id); updateObjects(objects, "تم تكرار العنصر مع حفظ المصدر.", { ids, primaryId: ids.at(-1) ?? null }); };
  const remove = () => { if (!safeSelection.ids.length) return onNotice("حدد عنصرًا أولًا."); updateObjects(deleteObjects(page.objects, safeSelection.ids), "تم حذف العناصر المحددة.", emptySelection()); };
  const group = () => { if (selectedObjects.length < 2) return onNotice("حدد عنصرين أو أكثر للتجميع."); const id = `group_${Date.now()}`; const next = groupObjects(document, page.id, safeSelection.ids, id); if (next === document) return onNotice("لا يمكن تجميع هذا الاختيار."); commit(next, "تم تجميع العناصر فوق النموذج canonical.", { ids: [id], primaryId: id }); };
  const ungroup = () => { if (!selected || selected.type !== "GroupObject") return onNotice("حدد مجموعة لفكها."); updateObjects(ungroupObject(page.objects, selected.id), "تم فك المجموعة مع إعادة العناصر إلى الطبقة.", { ids: selected.children?.map((child) => child.id) ?? [], primaryId: selected.children?.[0]?.id ?? null }); };
  const copy = () => { if (!selectedObjects.length) return onNotice("حدد عنصرًا لنسخه."); setClipboard(selectedObjects.map((object) => ({ ...object, metadata: { ...object.metadata }, position: { ...object.position }, size: { ...object.size } }))); onNotice(`تم نسخ ${selectedObjects.length} عنصر.`); };
  const paste = () => { if (!clipboard.length) return onNotice("الحافظة فارغة."); const pasted = duplicateObjects(clipboard, clipboard.map((object) => object.id), idFactory); const fresh = pasted.slice(-clipboard.length); updateObjects([...page.objects, ...fresh], "تم لصق العناصر.", { ids: fresh.map((object) => object.id), primaryId: fresh.at(-1)?.id ?? null }); };
  const undo = () => { const previous = history.at(-1); if (!previous) return onNotice("لا توجد عملية للتراجع."); setFuture((current) => [{ document, selection: safeSelection }, ...current]); setHistory((current) => current.slice(0, -1)); onDocumentChange(previous.document, "تم التراجع عن العملية."); onSelectionChange(previous.selection); };
  const redo = () => { const next = future[0]; if (!next) return onNotice("لا توجد عملية للإعادة."); setHistory((current) => [...current, { document, selection: safeSelection }]); setFuture((current) => current.slice(1)); onDocumentChange(next.document, "تمت إعادة العملية."); onSelectionChange(next.selection); };
  const keyboard = (event: KeyboardEvent) => {
    if (event.key === "Escape") { onSelectionChange(emptySelection()); onNotice("أُلغي التحديد."); return; }
    const command = resolveBoardCommand(event);
    if (!command) return;
    const actions: Record<string, () => void> = { undo, redo, copy, paste, duplicate, delete: remove, selectAll: () => onSelectionChange({ ids: page.objects.map((object) => object.id), primaryId: page.objects.at(-1)?.id ?? null }), moveLeft: () => updateObjects(moveObjects(page.objects, safeSelection.ids, -12, 0), "تم تحريك الاختيار."), moveRight: () => updateObjects(moveObjects(page.objects, safeSelection.ids, 12, 0), "تم تحريك الاختيار."), moveUp: () => updateObjects(moveObjects(page.objects, safeSelection.ids, 0, -12), "تم تحريك الاختيار."), moveDown: () => updateObjects(moveObjects(page.objects, safeSelection.ids, 0, 12), "تم تحريك الاختيار.") };
    if (actions[command]) { event.preventDefault(); actions[command](); }
  };
  useEffect(() => { window.addEventListener("keydown", keyboard); return () => window.removeEventListener("keydown", keyboard); });

  const editContent = (event: React.ChangeEvent<HTMLInputElement>) => { if (!selected || !hasCapability(selected, "editable")) return onNotice("هذا العنصر غير قابل للتحرير."); updateObjects(patchObject(page.objects, selected.id, { content: event.target.value }), "تم تحرير المحتوى مع حفظ provenance."); };
  const resizeByKeyboard = (widthDelta: number, heightDelta: number) => {
    if (!selected) return onNotice("حدد عنصرًا قابلًا لتغيير الحجم.");
    if (!hasCapability(selected, "resizable")) return onNotice("هذا العنصر لا يدعم تغيير الحجم.");
    const next = page.objects.map((object) => object.id === selected.id ? resizeObjectFromCorner(object, "br", widthDelta, heightDelta) : object);
    updateObjects(next, "تم تغيير حجم العنصر عبر المسار القابل للوصول.");
  };
  const layer = (direction: LayerDirection) => { if (!selected) return; updateObjects(reorderObjects(page.objects, selected.id, direction), "تم تغيير ترتيب العنصر."); };
  const align = (kind: Alignment) => { if (selectedObjects.length < 2) return onNotice("حدد عنصرين أو أكثر للمحاذاة."); updateObjects(alignObjects(page.objects, new Set(safeSelection.ids), kind), "تمت محاذاة العناصر المحددة."); };
  const distribute = (axis: "horizontal" | "vertical") => { if (selectedObjects.length < 3) return onNotice("حدد ثلاثة عناصر أو أكثر للتوزيع."); updateObjects(distributeObjects(page.objects, new Set(safeSelection.ids), axis), "تم توزيع العناصر المحددة."); };

  return <section className="core-board ux-board gate11-canvas" aria-label="لوحة التفاعل المباشر" data-testid="teacher-canvas"><div className="core-board-header ux-header"><div><span className="kicker">GATE 11 · DIRECT CANVAS</span><h2>اللوحة التي تتعامل معها مباشرة</h2><p>حدد العنصر على سطح اللوحة، ثم حرّكه أو غيّر حجمه أو افتح إجراءاته.</p></div><div className="header-status"><span className="core-notice">{safeSelection.ids.length ? `محدد: ${safeSelection.ids.length}` : "لا تحديد"}</span></div></div><div className="core-toolbar ux-toolbar"><div className="toolbar-section primary-tools"><button className={`tool ${tool === "select" ? "active" : ""}`} onClick={() => setTool("select")} aria-label="تحديد"><MousePointer2 size={16} /></button><button className="tool" onClick={() => addObject("TextObject")} aria-label="إضافة نص">T</button><button className="tool" onClick={() => addObject("SentenceObject")} aria-label="إضافة جملة">ج</button><button className="tool" onClick={() => addObject("EquationObject")} aria-label="إضافة معادلة">∑</button><button className="tool" onClick={() => addObject("ShapeObject")} aria-label="إضافة شكل">□</button></div><div className="toolbar-section utility-tools"><button className="tool" onClick={undo} aria-label="تراجع"><Undo2 size={16} /></button><button className="tool" onClick={redo} aria-label="إعادة"><Redo2 size={16} /></button><button className="tool" onClick={() => setZoom((value) => Math.min(1.8, value + .1))} aria-label="تكبير"><ZoomIn size={16} /></button><button className="tool" onClick={() => setZoom((value) => Math.max(.55, value - .1))} aria-label="تصغير"><ZoomOut size={16} /></button></div></div>{selected && <div className="context-strip" role="toolbar" aria-label="إجراءات العنصر المحدد"><strong>{labelFor(selected.type)}</strong><button onClick={duplicate}><Copy size={14} /> تكرار</button><button onClick={remove}><Trash2 size={14} /> حذف</button>{selected.type === "GroupObject" ? <button onClick={ungroup}><Ungroup size={14} /> فك</button> : <button onClick={group} disabled={selectedObjects.length < 2}><Group size={14} /> تجميع</button>}</div>}<div className="core-layout ux-layout"><div className="ux-stage-wrap"><div className="stage-meta"><span>{page.name} · {document.title}</span><span>{Math.round(zoom * 100)}% · {page.objects.length} عناصر</span></div><div ref={stageRef} className="core-stage ux-stage" data-testid="canvas-stage" onPointerDown={() => onSelectionChange(emptySelection())} onPointerMove={move} onPointerUp={finishDrag} onPointerCancel={finishDrag} onWheel={(event) => { event.preventDefault(); setPan((value) => ({ x: value.x - event.deltaX, y: value.y - event.deltaY })); }} aria-label="سطح اللوحة المباشر"><div className="core-grid" />{[...page.objects].sort((a, b) => a.zIndex - b.zIndex).map((item) => item.metadata.visible && <button key={item.id} className={`core-object ux-object ${safeSelection.ids.includes(item.id) ? "selected" : ""} ${item.metadata.locked ? "locked" : ""}`} data-testid="canvas-object" style={{ right: item.position.x, top: item.position.y, width: item.size.width, height: item.size.height, transform: `rotate(${item.rotation}deg)`, color: item.style.color, background: item.style.background }} onPointerDown={(event) => select(event, item.id)} onKeyDown={(event) => selectKeyboard(event, item.id)} aria-pressed={safeSelection.ids.includes(item.id)} aria-label={`${labelFor(item.type)}: ${contentFor(item)}`}><span className="core-object-type">{labelFor(item.type)}</span><strong>{contentFor(item)}</strong><small>{safeSelection.ids.includes(item.id) ? "محدد مباشرة" : "جاهز للشرح"}</small>{safeSelection.primaryId === item.id && <><span className="resize-handle handle-tl" onPointerDown={(event) => beginResize(event, item, "tl")} aria-hidden="true" /><span className="resize-handle handle-tr" onPointerDown={(event) => beginResize(event, item, "tr")} aria-hidden="true" /><span className="resize-handle handle-bl" onPointerDown={(event) => beginResize(event, item, "bl")} aria-hidden="true" /><span className="resize-handle handle-br" onPointerDown={(event) => beginResize(event, item, "br")} aria-hidden="true" /></>}</button>)}</div></div><aside className="object-inspector ux-inspector"><div className="panel-title"><span><small className="panel-kicker">CANONICAL OBJECT</small>تفاصيل التحديد</span><span className="inspector-status">{safeSelection.ids.length}</span></div>{selected ? <div className="inspector-content"><label>المحتوى<input data-text-editor="true" value={selected.content} onChange={editContent} aria-label="تحرير محتوى العنصر المحدد" /></label><div className="inspector-grid"><button onClick={() => updateObjects(moveObjects(page.objects, safeSelection.ids, -12, 0), "تم تحريك العنصر.")}><ArrowLeft size={13} /> تحريك</button><button onClick={() => updateObjects(moveObjects(page.objects, safeSelection.ids, 12, 0), "تم تحريك العنصر.")}>تحريك <ArrowRight size={13} /></button><button onClick={() => layer("front")}>إلى الأمام</button><button onClick={() => layer("back")}>إلى الخلف</button></div><div className="inspector-grid accessible-resize-controls"><button onClick={() => resizeByKeyboard(12, 0)} aria-label="زيادة عرض العنصر">زيادة العرض</button><button onClick={() => resizeByKeyboard(-12, 0)} aria-label="تقليل عرض العنصر">تقليل العرض</button><button onClick={() => resizeByKeyboard(0, 12)} aria-label="زيادة ارتفاع العنصر">زيادة الارتفاع</button><button onClick={() => resizeByKeyboard(0, -12)} aria-label="تقليل ارتفاع العنصر">تقليل الارتفاع</button></div><div className="inspector-grid"><button onClick={() => align("left")}>محاذاة يسار</button><button onClick={() => align("center")}>توسيط</button><button onClick={() => align("top")}>محاذاة أعلى</button><button onClick={() => distribute("horizontal")}>توزيع أفقي</button></div><p className="teacher-product-notice">ID: {selected.id} · {selected.source ? `sourceObjectId محفوظ: ${selected.source.reference ?? "نعم"}` : "مصدر المعلم"}</p></div> : <div className="empty-inspector">حدد عنصرًا مباشرة من اللوحة لرؤية أدواته.</div>}</aside></div></section>;
}
