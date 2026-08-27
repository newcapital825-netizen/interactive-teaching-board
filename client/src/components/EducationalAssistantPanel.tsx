import { useState } from "react";
import { AlertTriangle, BookOpenCheck, ChevronDown, ShieldCheck } from "lucide-react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";

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
  const assist = trpc.educational.assist.useMutation({
    onSuccess: (result, variables) => {
      setMessages((current) => [...current, { role: "user", content: variables.question }, { role: "assistant", content: `${result.answer}\n\n**لماذا؟** ${result.why}\n\n**شرح تعليمي:** ${result.explanation}` }]);
      setLastEvidence(result);
    },
    onError: () => {
      setMessages((current) => [...current, { role: "assistant", content: "تعذر تشغيل المساعد الآن. لم تُعرض إجابة غير متحققة." }]);
      setLastEvidence(null);
    },
  });

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || assist.isPending) return;
    assist.mutate({ question: trimmed, subject, level, lessonContext, selectedContent });
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
          </div>
          {lastEvidence.teacherReviewRequired && <p className="educational-assistant-warning"><AlertTriangle size={15} /> تحتاج هذه الإجابة إلى مراجعة المعلم قبل اعتمادها.</p>}
          {lastEvidence.limitations.length > 0 && <ul>{lastEvidence.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>}
        </details>
      )}
    </section>
  );
}
