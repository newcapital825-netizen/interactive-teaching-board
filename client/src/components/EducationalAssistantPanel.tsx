import { useState } from "react";
import { AlertTriangle, BookOpenCheck, Check, ChevronDown, Pencil, ShieldCheck, X } from "lucide-react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { resourcesForSubject, sourceTierLabel } from "@/lib/teachingResources";
import { reviewLabel, type TeacherReviewState } from "@/lib/teacherReview";

type EducationalAssistantPanelProps = {
  subject: string;
  level: string;
  lessonContext: string;
  selectedContent?: string;
};

export default function EducationalAssistantPanel({ subject, level, lessonContext, selectedContent }: EducationalAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastEvidence, setLastEvidence] = useState<{
    confidence: string;
    provenanceStatus: string;
    sources: Array<{ label: string; kind: string; note: string }>;
    limitations: string[];
    teacherReviewRequired: boolean;
  } | null>(null);
  const [reviewState, setReviewState] = useState<TeacherReviewState>("pending");
  const [correction, setCorrection] = useState("");
  const [providedSource, setProvidedSource] = useState("");
  const [intent, setIntent] = useState<"explain" | "analyze" | "question" | "activity" | "clarify">("explain");
  const resources = resourcesForSubject(subject);
  const assist = trpc.educational.assist.useMutation({
    onSuccess: (result, variables) => {
      setMessages((current) => [...current, { role: "user", content: variables.question }, { role: "assistant", content: `${result.answer}\n\n**لماذا؟** ${result.why}\n\n**شرح تعليمي:** ${result.explanation}` }]);
      setLastEvidence(result);
      setReviewState("pending");
      setCorrection("");
    },
    onError: () => {
      setMessages((current) => [...current, { role: "assistant", content: "تعذر تشغيل المساعد الآن. لم تُعرض إجابة غير متحققة." }]);
      setLastEvidence(null);
      setReviewState("pending");
    },
  });

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || assist.isPending) return;
    assist.mutate({ question: trimmed, subject, level, lessonContext, selectedContent, providedSource: providedSource.trim() || undefined, intent });
  }

  function applyCorrection() {
    const trimmed = correction.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "assistant", content: `تصحيح المعلم:\n${trimmed}` }]);
    setReviewState("corrected");
    setCorrection("");
  }

  return (
    <section className="educational-assistant-panel" aria-label="المساعد التعليمي">
      <div className="educational-assistant-heading">
        <div>
          <span className="teacher-product-kicker"><BookOpenCheck size={14} /> مساعد داخل الدرس</span>
          <h3>اسأل، ثم راجع قبل العرض</h3>
          <p>يعمل المساعد ضمن سياق الدرس، ويعرض حدود التحقق بدل اختلاق مصدر.</p>
        </div>
        <span className="educational-assistant-badge"><ShieldCheck size={14} /> المعلم صاحب القرار</span>
      </div>
      {resources.length > 0 && (
        <div className="educational-assistant-resources" aria-label="مراجع خارجية للمادة">
          <div className="educational-assistant-resources-heading">مراجع مقترحة للمراجعة</div>
          {resources.map((resource) => (
            <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer" className="educational-assistant-resource-link">
              <strong>{resource.title}</strong>
              <span>{resource.description}</span>
              <small>{resource.verification}</small>
              <small>{sourceTierLabel(resource.tier)} · {resource.authority}</small>
              <small>العلاقة بالمنهج: {resource.curriculumRelationship} · {resource.freshness}</small>
            </a>
          ))}
        </div>
      )}
      <div className="educational-assistant-source">
        <label htmlFor="assistant-source">مصدر يقدمه المعلم (اختياري)</label>
        <input id="assistant-source" value={providedSource} onChange={(event) => setProvidedSource(event.target.value)} placeholder="عنوان أو مرجع للمراجعة، لا يتم التحقق منه تلقائيًا" />
      </div>
      <div className="educational-assistant-intent">
        <label htmlFor="assistant-intent">ما الذي تريده من المساعد؟</label>
        <select id="assistant-intent" value={intent} onChange={(event) => setIntent(event.target.value as typeof intent)}>
          <option value="explain">شرح الفكرة</option>
          <option value="analyze">تحليل المحتوى</option>
          <option value="question">إنشاء سؤال</option>
          <option value="activity">اقتراح نشاط</option>
          <option value="clarify">تبسيط الشرح</option>
        </select>
      </div>
      <AIChatBox
        messages={messages}
        onSendMessage={ask}
        isLoading={assist.isPending}
        height={"min(430px, 52vh)"}
        placeholder="اسأل عن الشرح أو الخطوة التالية…"
        emptyStateMessage="ابدأ بسؤال تعليمي مرتبط بالدرس"
        suggestedPrompts={["اشرح الفكرة بطريقة أبسط", "ما الخطوة التالية؟", "أنشئ سؤالًا للتأكد من الفهم"]}
        className="educational-assistant-chat"
      />
      {lastEvidence && (
        <details className="educational-assistant-evidence" open>
          <summary><ChevronDown size={15} /> دليل الإجابة وحدودها</summary>
          <div className="educational-assistant-evidence-grid">
            <span><strong>الثقة:</strong> {lastEvidence.confidence}</span>
            <span><strong>الحالة:</strong> {lastEvidence.provenanceStatus}</span>
            <span><strong>المصادر:</strong> {lastEvidence.sources.map((source) => source.label).join("، ")}</span>
            <span><strong>قرار المعلم:</strong> {reviewLabel(reviewState)}</span>
          </div>
          {lastEvidence.teacherReviewRequired && <p className="educational-assistant-warning"><AlertTriangle size={15} /> تحتاج هذه الإجابة إلى مراجعة المعلم قبل اعتمادها.</p>}
          {lastEvidence.limitations.length > 0 && <ul>{lastEvidence.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>}
          <div className="educational-assistant-review" aria-label="مراجعة إجابة المساعد">
            <div className="educational-assistant-review-actions">
              <button type="button" onClick={() => setReviewState("accepted")} aria-label="اعتماد إجابة المساعد"><Check size={14} /> اعتماد</button>
              <button type="button" onClick={() => setReviewState("rejected")} aria-label="رفض إجابة المساعد"><X size={14} /> رفض</button>
            </div>
            <div className="educational-assistant-correction">
              <label htmlFor="assistant-correction"><Pencil size={14} /> تصحيح المعلم</label>
              <textarea id="assistant-correction" value={correction} onChange={(event) => setCorrection(event.target.value)} placeholder="اكتب التصحيح قبل اعتماد الشرح…" rows={2} />
              <button type="button" onClick={applyCorrection} disabled={!correction.trim()} aria-label="حفظ تصحيح المعلم">حفظ التصحيح</button>
            </div>
          </div>
        </details>
      )}
    </section>
  );
}
