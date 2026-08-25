import { useEffect, useMemo, useState } from "react";
import { BookOpen, Eye, FilePlus2, Gauge, Plus, Save, Square, Type, Undo2 } from "lucide-react";
import Gate4BWorkspace from "@/components/Gate4BWorkspace";
import { createDocument, createObject, createPage, getActivePage, persistDocument, restoreDocument, type BoardDocument, type CoreObjectType } from "@/lib/coreBoard";

/* Gate 5 productization reminder: this shell exposes existing Core Board primitives; it owns no subject registry, engine, assessment, feedback, or persistence model. */
const PRODUCT_STORAGE_KEY = "gate5-teacher-product";
const objectLabels: Record<CoreObjectType, string> = { TextObject: "نص", SentenceObject: "جملة", EquationObject: "معادلة", ShapeObject: "شكل" } as Record<CoreObjectType, string>;
const objectSeed: Record<CoreObjectType, string> = { TextObject: "ملاحظة تعليمية جديدة", SentenceObject: "جملة عربية قابلة للتحليل", EquationObject: "2x + 3 = 11", ShapeObject: "شكل تعليمي" } as Record<CoreObjectType, string>;

export default function TeacherProductShell() {
  const [board, setBoard] = useState<BoardDocument>(() => restoreDocument() ?? createDocument());
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("أنشئ درسًا، أضف محتوى، ثم افتح أدوات المادة.");
  const [saveState, setSaveState] = useState<"saved" | "unsaved">("unsaved");
  const activePage = getActivePage(board);
  const activeObjects = activePage?.objects ?? [];
  const [meta, setMeta] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY) ?? "null") as { title?: string; grade?: string; objective?: string } | null;
      return { title: stored?.title ?? board.title, grade: stored?.grade ?? "المرحلة المتوسطة", objective: stored?.objective ?? "شرح الفكرة ثم التحقق من الفهم" };
    } catch { return { title: board.title, grade: "المرحلة المتوسطة", objective: "شرح الفكرة ثم التحقق من الفهم" }; }
  });
  const pageNumber = useMemo(() => board.pages.findIndex((page) => page.id === board.activePageId) + 1, [board]);

  useEffect(() => { localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(meta)); }, [meta]);

  function updateBoard(next: BoardDocument, message: string) { setBoard({ ...next, updatedAt: new Date().toISOString() }); setSaveState("unsaved"); setNotice(message); }
  function updateMeta(field: keyof typeof meta, value: string) { setMeta((current) => ({ ...current, [field]: value })); setBoard((current) => ({ ...current, title: field === "title" ? value : current.title, updatedAt: new Date().toISOString() })); setSaveState("unsaved"); }
  function addPage() { const page = createPage(`Page ${board.pages.length + 1}`); updateBoard({ ...board, pages: [...board.pages, page], activePageId: page.id }, "أضيفت صفحة جديدة للدرس."); }
  function addContent(type: CoreObjectType) { const item = createObject(type, objectSeed[type], 54 + (activeObjects.length % 3) * 190, 52 + Math.floor(activeObjects.length / 3) * 100); const pages = board.pages.map((page) => page.id === board.activePageId ? { ...page, objects: [...page.objects, item] } : page); updateBoard({ ...board, pages }, `${objectLabels[type]} أضيفت إلى الصفحة ${pageNumber}.`); }
  function selectPage(pageId: string) { setBoard((current) => ({ ...current, activePageId: pageId })); setNotice("تم فتح الصفحة المحددة."); }
  function saveProduct() { const result = persistDocument({ ...board, title: meta.title }); localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(meta)); setSaveState(result.ok ? "saved" : "unsaved"); setNotice(result.ok ? "حُفظ الدرس والمحتوى محليًا." : "تعذر حفظ الدرس؛ حاول مرة أخرى."); }

  if (preview) return <main dir="rtl" className="teacher-product-preview"><header><div className="teacher-product-preview-brand"><div className="teacher-product-mark" aria-hidden="true"><i /><b /><span /></div><div><span className="teacher-product-kicker">مِداد · معاينة الطالب</span><h1>{meta.title}</h1><p>{meta.grade} · {meta.objective}</p></div></div><button className="gate4b-quiet-button" onClick={() => setPreview(false)}><Undo2 size={15} /> العودة إلى المعلم</button></header><section className="teacher-preview-paper"><span className="teacher-product-kicker">صفحة {pageNumber} من {board.pages.length}</span><h2>ماذا نتعلم اليوم؟</h2><p className="teacher-preview-objective">{meta.objective}</p><div className="teacher-preview-content">{activeObjects.length ? activeObjects.map((item) => <article key={item.id}><small>{objectLabels[item.type] ?? "عنصر"}</small><strong>{item.content}</strong></article>) : <article><small>مساحة الدرس</small><strong>لم يضف المعلم محتوى بعد.</strong></article>}</div><div className="teacher-preview-footer"><span>المحتوى الذي أضافه المعلم يظهر هنا.</span><span>عرض الطالب · دون أدوات تحرير</span></div></section></main>;

  return <div dir="rtl" className="teacher-product-shell"><header className="teacher-product-bar"><div className="teacher-product-heading"><div className="teacher-product-mark" aria-hidden="true"><i /><b /><span /></div><div><span className="teacher-product-kicker">مِداد · ورشة المخطوط الحي</span><h1>مساحة إعداد الدرس</h1><p>أنشئ المحتوى أولًا، ثم استخدم عدسة العربية أو الرياضيات للتفاعل والتقييم.</p></div></div><div className="teacher-product-actions"><span className={`teacher-product-save ${saveState}`}><span />{saveState === "saved" ? "محفوظ" : "مسودة محلية"}</span><button className="gate4b-quiet-button" onClick={() => setPreview(true)}><Eye size={15} /> معاينة الطالب</button><button className="gate4b-primary-button" onClick={saveProduct}><Save size={15} /> حفظ الدرس</button></div></header><section className="teacher-product-setup"><div className="teacher-product-fields"><label><span>عنوان الدرس</span><input value={meta.title} onChange={(event) => updateMeta("title", event.target.value)} /></label><label><span>الفئة</span><input value={meta.grade} onChange={(event) => updateMeta("grade", event.target.value)} /></label><label className="wide"><span>هدف الدرس</span><input value={meta.objective} onChange={(event) => updateMeta("objective", event.target.value)} /></label></div><div className="teacher-product-pages"><div className="teacher-product-section-heading"><span>صفحات الدرس</span><button className="teacher-product-icon" onClick={addPage} aria-label="إضافة صفحة"><FilePlus2 size={15} /></button></div><div className="teacher-product-page-list">{board.pages.map((page, index) => <button key={page.id} className={page.id === board.activePageId ? "active" : ""} onClick={() => selectPage(page.id)}><span>{String(index + 1).padStart(2, "0")}</span>{page.name}<small>{page.objects.length} عناصر</small></button>)}</div></div><div className="teacher-product-content"><div className="teacher-product-section-heading"><span>إضافة محتوى</span><small>عناصر اللوحة المشتركة</small></div><div className="teacher-product-adds"><button onClick={() => addContent("TextObject")}><Type size={15} />نص</button><button onClick={() => addContent("SentenceObject")}><BookOpen size={15} />جملة</button><button onClick={() => addContent("EquationObject")}><Gauge size={15} />معادلة</button><button onClick={() => addContent("ShapeObject")}><Square size={15} />شكل</button></div><p className="teacher-product-notice">{notice}</p></div></section><Gate4BWorkspace /></div>;
}
