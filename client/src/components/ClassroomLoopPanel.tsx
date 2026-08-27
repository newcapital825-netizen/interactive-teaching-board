/**
 * Gate 12 classroom loop UI.
 * Design reminder: calm paper-and-olive RTL workspace; teacher and student views
 * share canonical state but expose different capabilities and controls.
 */
import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, MessageCircle, RotateCcw, Send, ShieldCheck } from "lucide-react";
import { type CoreObject } from "@/lib/coreBoard";
import { type Provenance } from "@/lib/gate4bTeaching";
import { applyAttemptOverride, assessAttempt, createAttempt, createClassroomActivityFromObject, replaceActivity, retryAttempt, reviewAttempt, submitAttempt, transitionActivity, updateAttemptMathSteps, updateAttemptResponse, type ClassroomActivity, type ClassroomLessonState } from "@/lib/classroomLoop";
import type { SolutionStepObject } from "@/lib/mathStepSlice";

type Props = { state: ClassroomLessonState; onStateChange: (state: ClassroomLessonState, message: string) => void; mode: "teacher" | "student"; boardObjects: CoreObject[]; onNotice: (message: string) => void };
const at = () => new Date().toISOString();
const provenanceFor = (activity: ClassroomActivity): Provenance => ({ sourceObjectId: activity.sourceObjectId, sourceVersion: 1, derivationType: "classroom-workflow", teacherApproved: false });
const label = (activity: ClassroomActivity) => activity.subject === "arabic" ? "العربية · إعراب" : "الرياضيات · خطوات الحل";
const statusLabel: Record<ClassroomActivity["lifecycle"], string> = { draft: "مسودة", ready: "جاهز", "student-active": "نشط للطالب", submitted: "بانتظار التقييم", assessed: "تم التقييم", reviewed: "تمت المراجعة" };
const statusClass: Record<ClassroomActivity["lifecycle"], string> = { draft: "draft", ready: "ready", "student-active": "active", submitted: "submitted", assessed: "assessed", reviewed: "reviewed" };

const emptyStep = (step: SolutionStepObject): SolutionStepObject => ({ ...step, expressionBefore: "", operation: "", expressionAfter: "", mathematicalJustification: "", validityState: "incomplete" });
const learningStages = ["المحتوى", "الفهم", "النشاط", "المحاولة", "المراجعة"];
const LearningMap = ({ stage }: { stage: number }) => <nav className="classroom-learning-map" aria-label="خارطة التعلم" data-testid="learning-map">{learningStages.map((item, index) => <span className={index < stage ? "complete" : index === stage ? "current" : "upcoming"} key={item}><b>{index + 1}</b>{item}</span>)}</nav>;

export default function ClassroomLoopPanel({ state, onStateChange, mode, boardObjects, onNotice }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [stepDrafts, setStepDrafts] = useState<Record<string, SolutionStepObject[]>>({});
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideNote, setOverrideNote] = useState("");
  const selected = state.activities.find((activity) => activity.id === selectedId) ?? state.activities[0] ?? null;
  const studentActivity = state.activities.find((activity) => activity.lifecycle === "student-active") ?? selected;
  const activeAttempt = (mode === "student" ? studentActivity : selected)?.attempts.find((attempt) => attempt.attemptId === (mode === "student" ? studentActivity?.activeAttemptId : selected?.activeAttemptId)) ?? (mode === "student" ? studentActivity?.attempts.at(-1) : selected?.attempts.at(-1)) ?? null;
  const studentAttempt = studentActivity?.attempts.find((attempt) => attempt.attemptId === studentActivity.activeAttemptId) ?? null;
  const studentDrafts = studentActivity?.mathStepSession?.steps.map(emptyStep) ?? [];

  const addFromObject = (object: CoreObject) => {
    let activity: ClassroomActivity | null = null;
    try { activity = createClassroomActivityFromObject(object); } catch { return onNotice("هذا المحتوى خارج نطاق التحقق الحالي؛ لم يُنشأ نشاط."); }
    if (!activity) return onNotice("اختر جملة عربية أو معادلة لإنشاء نشاط من المصدر.");
    if (state.activities.some((item) => item.sourceObjectId === object.id)) return onNotice("لدى هذا المصدر نشاط محفوظ بالفعل.");
    onStateChange({ ...state, activities: [...state.activities, activity], updatedAt: at() }, "أُنشئ النشاط من المحتوى المحدد مع حفظ مرجعه.");
    setSelectedId(activity.id);
  };
  const changeActivity = (activity: ClassroomActivity, message: string) => onStateChange(replaceActivity(state, activity, at()), message);
  const makeReady = () => { if (!selected) return; changeActivity(transitionActivity(selected, "ready"), "أصبح النشاط جاهزًا للطالب."); };
  const startStudent = () => {
    if (!selected) return;
    const ready = selected.lifecycle === "ready" ? selected : transitionActivity(selected, "student-active");
    const active = ready.lifecycle === "student-active" ? ready : transitionActivity(ready, "student-active");
    const attempt = createAttempt(active, state.student);
    changeActivity({ ...active, attempts: [...active.attempts, attempt], activeAttemptId: attempt.attemptId }, "بدأت محاولة الطالب مع حفظها محليًا.");
    setResponse("");
    if (active.mathStepSession) setStepDrafts((current) => ({ ...current, [active.id]: active.mathStepSession!.steps.map(emptyStep) }));
  };
  const submitStudent = () => {
    if (!studentActivity || !studentAttempt) return onNotice("ابدأ نشاطًا جاهزًا قبل إرسال الإجابة.");
    let nextAttempt = updateAttemptResponse(studentAttempt, response, at());
    if (studentActivity.mathStepSession) nextAttempt = updateAttemptMathSteps(nextAttempt, stepDrafts[studentActivity.id] ?? studentDrafts, at());
    const result = submitAttempt(studentActivity, nextAttempt);
    onStateChange(replaceActivity(state, result.activity), "أُرسلت الإجابة للتقييم؛ لم تعد قابلة للتحرير.");
  };
  const assess = () => {
    if (!selected || !activeAttempt) return;
    const assessed = assessAttempt(selected, activeAttempt, provenanceFor(selected));
    onStateChange(replaceActivity(state, assessed.activity), "اكتمل التقييم الحتمي وتم إنشاء الملاحظات والتغذية الراجعة.");
  };
  const review = () => { if (!selected || !activeAttempt) return; onStateChange(replaceActivity(state, reviewAttempt(selected, activeAttempt)), "فتح المعلم نتيجة النظام للمراجعة."); };
  const override = () => {
    if (!selected || !activeAttempt || !overrideReason.trim() || !overrideNote.trim()) return onNotice("اكتب سبب قرار المعلم وملاحظته قبل الحفظ.");
    const updated = applyAttemptOverride(activeAttempt, selected, "correct", overrideReason, overrideNote, { ...provenanceFor(selected), teacherApproved: true }, "local-teacher");
    onStateChange(replaceActivity(state, { ...selected, attempts: selected.attempts.map((attempt) => attempt.attemptId === activeAttempt.attemptId ? updated : attempt) }), "حُفظ قرار المعلم مستقلًا عن نتيجة التقييم.");
    setOverrideReason(""); setOverrideNote("");
  };
  const retry = () => {
    if (!selected) return;
    const retried = retryAttempt(selected, state.student);
    onStateChange(replaceActivity(state, retried.activity), "بدأت محاولة جديدة مع إبقاء المحاولات والتقييمات السابقة.");
    setSelectedId(selected.id); setResponse("");
  };
  const updateStep = (index: number, field: keyof SolutionStepObject, value: string) => {
    if (!studentActivity) return;
    const current = stepDrafts[studentActivity.id] ?? studentDrafts;
    setStepDrafts((drafts) => ({ ...drafts, [studentActivity.id]: current.map((step, stepIndex) => stepIndex === index ? { ...step, [field]: value } : step) }));
  };
  const boardCandidates = useMemo(() => boardObjects.filter((object) => object.type === "SentenceObject" || object.type === "EquationObject"), [boardObjects]);
  const sourceLabel = (activity: ClassroomActivity) => { const source = boardObjects.find((object) => object.id === activity.sourceObjectId); return source ? `${source.type === "SentenceObject" ? "الجملة" : "المعادلة"}: ${source.content}` : "المحتوى المحدد من اللوحة"; };
  const learningStage = state.activities.some((activity) => activity.lifecycle === "reviewed") ? 5 : state.activities.some((activity) => ["assessed", "reviewed"].includes(activity.lifecycle)) ? 4 : state.activities.some((activity) => ["student-active", "submitted"].includes(activity.lifecycle)) ? 3 : state.activities.length ? 2 : boardObjects.length ? 1 : 0;

  if (mode === "student") return <section className="classroom-loop-panel student-loop" aria-label="رحلة الطالب" data-testid="classroom-loop-student"><div className="loop-heading"><div><span className="panel-kicker">رحلة الطالب</span><h2>مساحة إجابة الطالب</h2><p>اقرأ النشاط، أرسل إجابتك، ثم استقبل تغذية راجعة قابلة للتنفيذ.</p></div><span className="student-identity">{state.student.displayName}</span></div><LearningMap stage={learningStage} />{studentActivity ? <div className="student-activity-card"><div className="activity-card-top"><span>{label(studentActivity)}</span><b className={`activity-status ${statusClass[studentActivity.lifecycle]}`}>{statusLabel[studentActivity.lifecycle]}</b></div><h3>{studentActivity.activity.prompt}</h3>{studentActivity.mathStepSession && <div className="math-step-inputs">{studentActivity.mathStepSession.steps.map((step, index) => <div className="math-step-row" key={step.id}><strong>الخطوة {index + 1}</strong><input value={(stepDrafts[studentActivity.id] ?? studentDrafts)[index]?.expressionBefore ?? ""} onChange={(event) => updateStep(index, "expressionBefore", event.target.value)} placeholder="التعبير قبل العملية" aria-label={`الخطوة ${index + 1} قبل`} /><input value={(stepDrafts[studentActivity.id] ?? studentDrafts)[index]?.operation ?? ""} onChange={(event) => updateStep(index, "operation", event.target.value)} placeholder="العملية" aria-label={`الخطوة ${index + 1} العملية`} /><input value={(stepDrafts[studentActivity.id] ?? studentDrafts)[index]?.expressionAfter ?? ""} onChange={(event) => updateStep(index, "expressionAfter", event.target.value)} placeholder="التعبير بعد العملية" aria-label={`الخطوة ${index + 1} بعد`} /><input value={(stepDrafts[studentActivity.id] ?? studentDrafts)[index]?.mathematicalJustification ?? ""} onChange={(event) => updateStep(index, "mathematicalJustification", event.target.value)} placeholder="التبرير" aria-label={`الخطوة ${index + 1} التبرير`} /></div>)}</div>}<label>الإجابة النهائية<input value={response} onChange={(event) => setResponse(event.target.value)} placeholder={studentActivity.subject === "arabic" ? "مثال: الطالبُ، فاعل، مرفوع، الضمة، لأنه فاعل" : "مثال: x = 4"} /></label><button className="gate4b-primary-button" onClick={submitStudent} disabled={studentActivity.lifecycle !== "student-active"}><Send size={15} /> إرسال الإجابة</button>{activeAttempt?.feedback && <div className="student-feedback" role="status" aria-live="polite"><MessageCircle size={16} /><div><strong>{activeAttempt.feedback.title}</strong><p>{activeAttempt.feedback.explanation}</p>{activeAttempt.feedback.nextStep && <small>الخطوة التالية: {activeAttempt.feedback.nextStep}</small>}</div></div>}{studentActivity.mathStepSession && activeAttempt?.mathFinalAnswer && <div className="student-feedback" role="status" aria-live="polite"><ClipboardCheck size={16} /><div><strong>{activeAttempt.mathFinalAnswer.correct ? "الإجابة النهائية صحيحة" : "راجع الإجابة النهائية"}</strong><p>{activeAttempt.mathVerification?.valid ? "تم التحقق بالتعويض ضمن الشريحة المثبتة." : "التقييم منفصل عن التحقق؛ راجع الخطوة المطلوبة."}</p></div></div>}</div> : <p className="empty-inspector">لا يوجد نشاط نشط للطالب بعد.</p>}</section>;

  return <section className="classroom-loop-panel teacher-loop" aria-label="دورة التعلم الكاملة" data-testid="classroom-loop-teacher"><div className="loop-heading"><div><span className="panel-kicker">دورة التعلم</span><h2>رحلة من المصدر إلى قرار المعلم</h2><p>أضف نشاطًا من جملة أو معادلة، جهّزه للطالب، ثم راجع النتيجة.</p></div><span className="loop-integrity"><ShieldCheck size={15} /> حالة الدرس محفوظة</span></div><LearningMap stage={learningStage} /><div className="activity-source-row"><span>إنشاء نشاط من المصدر</span>{boardCandidates.map((object) => <button key={object.id} data-testid={`activity-source-${object.id}`} onClick={() => addFromObject(object)}>{object.type === "SentenceObject" ? "جملة" : "معادلة"}: {object.content}</button>)}</div>{state.activities.length ? <div className="classroom-activity-list">{state.activities.map((activity) => <article className={`classroom-activity-card ${selected?.id === activity.id ? "selected" : ""}`} data-testid="classroom-activity" key={activity.id} onClick={() => setSelectedId(activity.id)}><div className="activity-card-top"><span>{label(activity)}</span><b className={`activity-status ${statusClass[activity.lifecycle]}`}>{statusLabel[activity.lifecycle]}</b></div><h3>{activity.activity.prompt}</h3><p>المصدر: {sourceLabel(activity)} · المحاولات: {activity.attempts.length}</p>{selected?.id === activity.id && <div className="activity-controls" onClick={(event) => event.stopPropagation()}>{activity.lifecycle === "draft" && <button onClick={makeReady}>تجهيز للطالب</button>}{activity.lifecycle === "ready" && <button onClick={startStudent}>فتح للطالب</button>}{activity.lifecycle === "submitted" && <button onClick={assess}><CheckCircle2 size={14} /> تقييم حتمي</button>}{activity.lifecycle === "assessed" && <button onClick={review}>فتح للمراجعة</button>}{activity.lifecycle === "reviewed" && <button onClick={retry}><RotateCcw size={14} /> إعادة المحاولة</button>}{activeAttempt?.feedback && <div className="teacher-result" role="status" aria-live="polite"><strong>نتيجة النظام: {activeAttempt.assessment?.evaluation ?? activeAttempt.mathFinalAnswer?.evaluation ?? "خطوات رياضية"}</strong><span>التشخيص: {activeAttempt.assessment?.diagnostic ?? activeAttempt.mathStepAssessments.map((item) => item.diagnostic).join("، ")}</span><p>{activeAttempt.feedback?.explanation ?? (activeAttempt.mathStepAssessments[0]?.feedback.explanation ?? "تقييم الخطوات محفوظ في المحاولة.")}</p>{activeAttempt.teacherDecision && <div className="teacher-decision" data-testid="teacher-decision" role="status" aria-live="polite"><strong>قرار المعلم: {activeAttempt.teacherDecision.state}</strong><span>السبب: {activeAttempt.teacherDecision.reason}</span><p>{activeAttempt.teacherDecision.note}</p></div>}{activity.lifecycle === "reviewed" && <div className="override-box"><label>سبب قرار المعلم<input value={overrideReason} onChange={(event) => setOverrideReason(event.target.value)} placeholder="مثال: قبلت الصيغة البديلة المثبتة" /></label><label>ملاحظة المعلم<textarea value={overrideNote} onChange={(event) => setOverrideNote(event.target.value)} placeholder="قرار مستقل لا يمحو نتيجة النظام" /></label><button onClick={override}>حفظ قرار المعلم</button></div>}</div>}</div>}</article>)}</div> : <div className="empty-inspector">أضف جملة أو معادلة من اللوحة أولًا، ثم حوّلها إلى نشاط.</div>}</section>;
}
