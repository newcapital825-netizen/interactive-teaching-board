import { useEffect, useMemo, useState } from "react";
import { BookOpen, Eye, EyeOff, Lightbulb, ListChecks, MessageCircle, Play, Sparkles, Target, WandSparkles } from "lucide-react";
import { convertToActivity, getContextualActions, type ContextualActionId } from "@/lib/contextualActions";
import { createContextualIntelligenceResult, type ContextualIntelligenceResult } from "@/lib/contextualIntelligence";
import { recognizeContent, recognitionConfidenceLabel } from "@/lib/contentRecognition";
import type { CoreObject } from "@/lib/coreBoard";

const icons = { explain: MessageCircle, analyze: Sparkles, "word-map": BookOpen, practice: Play, assess: Target, example: Lightbulb, compare: ListChecks, highlight: WandSparkles, "toggle-visibility": Eye, "convert-to-activity": Play, visualize: Eye } satisfies Record<ContextualActionId, typeof MessageCircle>;
type Props = { object: CoreObject | null; onNotice: (message: string) => void; onConvert: (object: CoreObject) => void; onCreateObject: (object: CoreObject) => void };
const intelligenceActions = new Set<ContextualActionId>(["analyze", "word-map", "explain", "visualize", "example"]);

export default function ContextualActionBar({ object, onNotice, onConvert, onCreateObject }: Props) {
  const [result, setResult] = useState<ContextualIntelligenceResult | null>(null);
  const recognition = useMemo(() => object ? recognizeContent(object.content) : null, [object]);
  const rawActions = useMemo(() => object ? getContextualActions(object) : [], [object]);
  const actions = useMemo(() => rawActions.map((action) => action.id === "word-map" && recognition?.kind !== "arabic-word" ? { ...action, available: false, reason: "unsupported-capability" as const } : action), [rawActions, recognition?.kind]);
  useEffect(() => { setResult(null); }, [object?.id, object?.content]);
  if (!object) return <section className="contextual-action-bar empty" aria-label="الإجراءات السياقية"><span>حدد عنصرًا من المحتوى لتظهر الإجراءات المناسبة.</span></section>;
  const selectedObject = object;

  function perform(actionId: ContextualActionId, available: boolean) {
    if (!available) return onNotice("هذا الإجراء غير متاح لهذا النوع من المحتوى.");
    if (actionId === "convert-to-activity" || actionId === "practice") {
      try { const converted = convertToActivity(selectedObject); if (converted.createdObject) onConvert(converted.createdObject); onNotice("تحوّل المحتوى إلى نشاط مع حفظ مرجعه."); } catch { onNotice("تعذر تحويل المحتوى إلى نشاط؛ راجع الخيارات المتاحة له."); }
      return;
    }
    if (intelligenceActions.has(actionId)) {
      const next = createContextualIntelligenceResult(selectedObject, actionId as "analyze" | "word-map" | "explain" | "visualize" | "example");
      setResult(next);
      if (next.createdObject) onCreateObject(next.createdObject);
      onNotice(next.safeMessage ?? next.summary);
      return;
    }
    if (actionId === "toggle-visibility") return onNotice("تغيير الظهور متاح من إجراءات المحتوى، ويُحفظ عند تطبيقه.");
    onNotice(`${actions.find((action) => action.id === actionId)?.label ?? "الإجراء"} مرتبط بالمحتوى المحدد.`);
  }

  return <section className="contextual-action-bar" aria-label="الإجراءات السياقية" data-testid="contextual-actions"><div className="contextual-action-context"><div><span>المحتوى المحدد</span><strong>{selectedObject.type === "SentenceObject" ? "جملة" : selectedObject.type === "EquationObject" ? "معادلة" : recognition?.label ?? "محتوى"} · {String(selectedObject.content).slice(0, 42)}</strong></div>{recognition && <small>{recognitionConfidenceLabel(recognition.confidence)} · {recognition.reason}</small>}</div><div className="contextual-action-list">{actions.map((action) => { const Icon = icons[action.id]; return <button key={action.id} data-testid={`contextual-action-${action.id}`} className={action.available ? "contextual-action available" : "contextual-action unavailable"} aria-disabled={!action.available} title={action.description} disabled={!action.available} onClick={() => perform(action.id, action.available)}><Icon size={14} />{action.label}{action.id === "toggle-visibility" && (selectedObject.metadata.visible ? <Eye size={11} /> : <EyeOff size={11} />)}</button>; })}</div>{result && <article className={`contextual-intelligence-result ${result.status}`} data-testid="contextual-intelligence-result" aria-live="polite"><div className="contextual-result-heading"><span><BookOpen size={15} /> {result.title}</span><small>{result.confidence}</small></div><p>{result.summary}</p>{result.details.length > 0 && <details open><summary>كيف نعرف؟</summary><div>{result.details.map((detail, index) => <p key={`${detail}-${index}`}>{detail}</p>)}</div></details>}<small className="contextual-result-provenance">المصدر: {result.provenanceLabel} · {result.status === "uncertain" ? "يحتاج إلى مراجعة المعلم" : "يمكن للمعلم تحرير النتيجة"}</small></article>}</section>;
}
