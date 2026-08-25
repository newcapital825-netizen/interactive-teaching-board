import { useMemo } from "react";
import { Eye, EyeOff, Lightbulb, ListChecks, MessageCircle, Play, Sparkles, Target, WandSparkles } from "lucide-react";
import { convertToActivity, getContextualActions, type ContextualActionId } from "@/lib/contextualActions";
import type { CoreObject } from "@/lib/coreBoard";

/* Gate 8 reminder: capability-driven contextual actions; unavailable actions stay explicit and never fake execution. */
const icons = { explain: MessageCircle, analyze: Sparkles, practice: Play, assess: Target, example: Lightbulb, compare: ListChecks, highlight: WandSparkles, "toggle-visibility": Eye, "convert-to-activity": Play, visualize: Eye } satisfies Record<ContextualActionId, typeof MessageCircle>;

type Props = { object: CoreObject | null; onNotice: (message: string) => void; onConvert: (object: CoreObject) => void };
export default function ContextualActionBar({ object, onNotice, onConvert }: Props) {
  const actions = useMemo(() => object ? getContextualActions(object) : [], [object]);
  if (!object) return <section className="contextual-action-bar empty" aria-label="الإجراءات السياقية"><span>حدد عنصرًا من المحتوى لتظهر الإجراءات المناسبة.</span></section>;
  const selectedObject = object;
  function perform(id: ContextualActionId, available: boolean) {
    if (!available) return onNotice("هذا الإجراء غير متاح لهذا النوع من العناصر؛ لم يُنفذ إجراء وهمي.");
    if (id === "convert-to-activity") {
      try { const result = convertToActivity(selectedObject); if (result.createdObject) onConvert(result.createdObject); onNotice("تحوّل العنصر إلى نشاط مع الحفاظ على provenance."); } catch { onNotice("تعذر تحويل العنصر؛ راجع capabilities الخاصة به."); }
      return;
    }
    if (id === "toggle-visibility") return onNotice("تغيير الظهور جاهز كإجراء سياقي؛ يُحفظ عبر Core Board عند تطبيقه.");
    onNotice(`${actions.find((action) => action.id === id)?.label ?? "الإجراء"} مرتبط بالعنصر المحدد: ${String(selectedObject.content)}.`);
  }
  return <section className="contextual-action-bar" aria-label="الإجراءات السياقية" data-testid="contextual-actions"><div className="contextual-action-context"><span>العنصر المحدد</span><strong>{object.type} · {String(object.content).slice(0, 42)}</strong></div><div className="contextual-action-list">{actions.map((action) => { const Icon = icons[action.id]; return <button key={action.id} data-testid={`contextual-action-${action.id}`} className={action.available ? "contextual-action available" : "contextual-action unavailable"} aria-disabled={!action.available} title={action.description} onClick={() => perform(action.id, action.available)}><Icon size={14} />{action.label}{action.id === "toggle-visibility" && (selectedObject.metadata.visible ? <Eye size={11} /> : <EyeOff size={11} />)}</button>; })}</div></section>;
}
