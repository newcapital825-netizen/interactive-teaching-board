/**
 * Gate 4B teacher workspace.
 * Design reminder: Arabic-first, calm paper-and-olive instrument, asymmetric
 * teacher workspace; the core surface stays subject-agnostic while toolkits
 * provide the domain lens and activity.
 */
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Check, Eye, EyeOff, FileDown, Gauge, Layers3, LockKeyhole, Play, RotateCcw, Save, Sparkles, Target, Undo2 } from "lucide-react";
import {
  advanceDisclosure,
  applyTeacherOverride,
  assessActivity,
  createLesson,
  deserializeLesson,
  serializeLesson,
  toggleLensAnswer,
  updateI3rabField,
  updateI3rabTarget,
  updateLensSelection,
  type FeedbackState,
  type Gate4BLesson,
  type GrammarLens,
  type I3rabField,
  type JourneyState,
  type MathVisualizationLens,
  type Subject,
} from "@/lib/gate4bTeaching";
import { applyMathStepTeacherOverride, assessMathStep, verifyMathAnswer, type MathStepSession, type SolutionStepObject } from "@/lib/mathStepSlice";
import { hasCapability } from "@/lib/educationalObjects";

const STORAGE_KEY = "gate4b-controlled-vertical-slice";
const statusLabel: Record<FeedbackState, string> = { correct: "صحيحة", "valid-alternative": "بديلة صحيحة", "partially-correct": "جزئية", incorrect: "غير صحيحة", incomplete: "غير مكتملة" };
const reviewLabel = { supported: "مدعومة ضمن المجموعة", unsupported: "خارج النطاق المثبت", "needs-review": "تحتاج مراجعة" } as const;
const subjectLabel: Record<Subject, string> = { arabic: "العربية", mathematics: "الرياضيات" };

const shortId = (value: string) => `${value.slice(0, 13)}…`;

export default function Gate4BWorkspace() {
  const [lesson, setLesson] = useState<Gate4BLesson>(() => createLesson());
  const [activeSubject, setActiveSubject] = useState<Subject>("arabic");
  const [presentation, setPresentation] = useState(false);
  const [notice, setNotice] = useState("الدرس جاهز: أنشئ، اشرح، تفاعل ثم قيّم.");
  const [saveState, setSaveState] = useState<"saved" | "unsaved">("unsaved");
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = deserializeLesson(raw);
    if (saved) {
      setLesson(saved);
      setSaveState("saved");
      setRestored(true);
      setNotice("استُعيدت حالة الدرس مع بقاء المعرّفات والمراجع.");
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && presentation) setPresentation(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveLesson();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const journey = activeSubject === "arabic" ? lesson.arabic : lesson.mathematics;
  const activityDone = Boolean(journey.assessment);
  const lensReady = journey.lens.provenance.sourceObjectId === journey.source.id;
  const objectCapability = useMemo(() => hasCapability(journey.source, "interactive"), [journey.source]);

  function updateJourney(subject: Subject, updater: (current: JourneyState) => JourneyState) {
    setLesson((current) => subject === "arabic"
      ? { ...current, arabic: updater(current.arabic), savedAt: new Date().toISOString() }
      : { ...current, mathematics: updater(current.mathematics), savedAt: new Date().toISOString() });
    setSaveState("unsaved");
  }

  function chooseSubject(subject: Subject) {
    setActiveSubject(subject);
    setNotice(subject === "arabic" ? "حزمة العربية: الجملة ثم عدسة النحو." : "حزمة الرياضيات: المعادلة ثم تمثيل الحل.");
  }

  function saveLesson() {
    localStorage.setItem(STORAGE_KEY, serializeLesson(lesson));
    setSaveState("saved");
    setRestored(false);
    setNotice("تم حفظ الدرس محليًا؛ يمكن إغلاق الصفحة واستعادته لاحقًا.");
  }

  function restoreLesson() {
    const saved = deserializeLesson(localStorage.getItem(STORAGE_KEY) ?? "");
    if (!saved) return setNotice("لا توجد نسخة محفوظة قابلة للاستعادة بعد.");
    setLesson(saved);
    setSaveState("saved");
    setRestored(true);
    setNotice("تمت الاستعادة دون فقدان IDs أو provenance أو حالة التقييم.");
  }

  function beginStage(stage: JourneyState["selectedStage"]) {
    updateJourney(activeSubject, (current) => ({ ...current, selectedStage: stage }));
    setNotice(stage === "lens" ? "العدسة مشتقة من المصدر وتحافظ على provenance." : stage === "activity" ? "النشاط جاهز للمحاولة." : "وضع العرض يركّز على التعلم.");
  }

  function revealLens() {
    updateJourney(activeSubject, (current) => ({ ...current, lens: activeSubject === "arabic" ? advanceDisclosure(current.lens as GrammarLens) : toggleLensAnswer(current.lens), selectedStage: "lens" }));
  }

  function setArabicMode(mode: GrammarLens["mode"]) {
    updateJourney("arabic", (current) => ({ ...current, lens: advanceDisclosure(current.lens as GrammarLens, mode), selectedStage: "lens" }));
  }

  function selectArabicWord(wordId: string) {
    updateJourney("arabic", (current) => ({ ...current, lens: updateLensSelection(current.lens as GrammarLens, wordId), activity: updateI3rabTarget(current.activity, current.lens as GrammarLens, wordId), selectedStage: "activity" }));
    setNotice("اختيرت الكلمة؛ أكمل الدور والحالة والعلامة والسبب.");
  }

  function setI3rabField(field: I3rabField, value: string) {
    updateJourney("arabic", (current) => ({ ...current, activity: updateI3rabField(current.activity, field, value), selectedStage: "activity" }));
  }

  function setAnswer(answer: string) {
    updateJourney(activeSubject, (current) => ({ ...current, activity: { ...current.activity, answer, updatedAt: new Date().toISOString() }, selectedStage: "activity" }));
  }

  function submitAnswer() {
    const result = assessActivity(journey.activity, journey.activity.answer, journey.lens.provenance);
    updateJourney(activeSubject, (current) => ({ ...current, activity: result.activity, assessment: result.assessment, feedback: result.feedback, selectedStage: "feedback" }));
    setNotice(result.assessment.evaluation === "correct" ? "تم التقييم: إجابة صحيحة." : "تم التقييم؛ راجع التغذية الراجعة ثم أعد المحاولة إن لزم.");
  }

  function submitMathStep(step: SolutionStepObject) {
    const current = journey.mathStepSession;
    if (!current) return;
    const assessed = assessMathStep(current.problem, step, current.problem.provenance, current.disclosureLevel);
    updateJourney("mathematics", (value) => ({ ...value, mathStepSession: { ...current, assessments: [...current.assessments, assessed], currentStep: assessed.evaluation === "correct" || assessed.evaluation === "valid-alternative" ? (current.currentStep === 1 ? 2 : 2) : current.currentStep }, selectedStage: "feedback" }));
    setNotice(assessed.evaluation === "correct" || assessed.evaluation === "valid-alternative" ? "تم تقييم الخطوة؛ تابع البناء التدريجي." : "تم تحديد موضع المشكلة في هذه الخطوة.");
  }

  function overrideMathStep(decision: FeedbackState, reason: string) {
    const current = journey.mathStepSession;
    const latest = current?.assessments[current.assessments.length - 1];
    if (!current || !latest) return;
    const overridden = applyMathStepTeacherOverride(latest, decision, reason, "teacher-workspace");
    updateJourney("mathematics", (value) => ({ ...value, mathStepSession: { ...current, assessments: [...current.assessments.slice(0, -1), overridden] }, selectedStage: "feedback" }));
    setNotice("حُفظ قرار المعلم منفصلًا عن تقييم النظام مع بقاء الأصل والأثر الزمني.");
  }

  function verifyMath(expression: string) {
    const current = journey.mathStepSession;
    if (!current) return;
    const verification = verifyMathAnswer(current.problem, expression, current.problem.provenance);
    updateJourney("mathematics", (value) => ({ ...value, mathStepSession: { ...current, verification }, selectedStage: "feedback" }));
    setNotice(verification.valid ? "نجح التحقق بالتعويض." : "فشل التحقق؛ راجع التعويض.");
  }

  function applyOverride(state: FeedbackState, reason: string, note: string) {
    if (!journey.assessment) return;
    const result = applyTeacherOverride(journey.assessment, journey.activity, state, reason, note, journey.lens.provenance);
    updateJourney(activeSubject, (current) => ({ ...current, assessment: result.assessment, feedback: result.feedback, selectedStage: "feedback" }));
    setNotice("حُفظ قرار المعلم منفصلًا عن نتيجة النظام مع بقاء سجل التقييم الأصلي.");
  }

  function retry() {
    updateJourney(activeSubject, (current) => ({ ...current, activity: { ...current.activity, answer: "", assessmentId: null, feedbackId: null, updatedAt: new Date().toISOString() }, assessment: null, feedback: null, selectedStage: "activity" }));
    setNotice("بدأت محاولة جديدة؛ أرسل إجابة أخرى عندما تكون مستعدًا.");
  }

  return (
    <main dir="rtl" className={`gate4b-shell ${presentation ? "is-presenting" : ""}`}>
      <header className="gate4b-topbar">
        <div className="gate4b-brand">
          <div className="gate4b-brand-mark" aria-hidden="true"><span>◒</span></div>
          <div><span className="gate4b-eyebrow">UNIVERSAL TEACHER WORKSPACE · GATE 4B</span><h1>لوحة تشرح الفكرة وتختبر الفهم</h1></div>
        </div>
        <div className="gate4b-header-actions">
          <span className="gate4b-save-indicator"><span className={saveState === "saved" ? "saved-dot" : "unsaved-dot"} />{saveState === "saved" ? "محفوظ محليًا" : "تغييرات غير محفوظة"}</span>
          {!presentation && <button className="gate4b-quiet-button" onClick={restoreLesson} aria-label="استعادة الدرس"><RotateCcw size={16} /> استعادة</button>}
          {!presentation && <button className="gate4b-primary-button" onClick={saveLesson} aria-label="حفظ الدرس"><Save size={16} /> حفظ الدرس</button>}
          <button className="gate4b-present-button" onClick={() => { setPresentation((value) => !value); setNotice(presentation ? "عادت أدوات المعلم." : "وضع العرض مفعّل؛ اضغط Escape للعودة."); }} aria-pressed={presentation}><Play size={15} /> {presentation ? "إنهاء العرض" : "تقديم"}</button>
        </div>
      </header>

      <section className="gate4b-workspace" aria-label="مساحة التدريس التفاعلية">
        <aside className="gate4b-rail">
          <span className="gate4b-rail-number">04</span><span className="gate4b-rail-line" /><span className="gate4b-rail-label">TEACH · INTERACT · ASSESS</span>
          <div className="gate4b-rail-footer"><LockKeyhole size={14} /> محلي</div>
        </aside>

        <section className="gate4b-canvas-column">
          <div className="gate4b-heading-row"><div><span className="gate4b-kicker">CONTROLLED VERTICAL SLICE</span><h2>{presentation ? "اتبع خطوات الفهم" : "من المصدر إلى الدليل"}</h2><p>{presentation ? "اختر، أجب، ثم ناقش التغذية الراجعة." : "سطح واحد؛ أدوات موضوعية تظهر عند الحاجة فقط."}</p></div><div className="gate4b-lesson-stamp"><span>LESSON</span><strong>{shortId(lesson.lessonId)}</strong><small>{restored ? "RESTORED" : "LOCAL DRAFT"}</small></div></div>

          <div className="gate4b-subject-switcher" role="tablist" aria-label="حزم المواد">
            <button className={activeSubject === "arabic" ? "active" : ""} onClick={() => chooseSubject("arabic")} role="tab" aria-selected={activeSubject === "arabic"}><BookOpen size={17} /><span><b>العربية</b><small>Grammar Lens · تحديد وتصنيف</small></span><em>A</em></button>
            <button className={activeSubject === "mathematics" ? "active" : ""} onClick={() => chooseSubject("mathematics")} role="tab" aria-selected={activeSubject === "mathematics"}><Gauge size={17} /><span><b>الرياضيات</b><small>Visual Lens · حل وتحقق</small></span><em>∑</em></button>
          </div>

          <div className="gate4b-flow" aria-label="مسار الرحلة التعليمية">
            {(["create", "lens", "activity", "presentation", "feedback", "restore"] as const).map((stage, index) => <button key={stage} className={journey.selectedStage === stage ? "active" : journey.selectedStage === "feedback" && index < 4 ? "done" : ""} onClick={() => beginStage(stage)}><span>{index + 1}</span>{stage === "create" ? "إنشاء" : stage === "lens" ? "عدسة" : stage === "activity" ? "تفاعل" : stage === "presentation" ? "عرض" : stage === "feedback" ? "تقييم" : "استعادة"}</button>)}
          </div>

          <div className="gate4b-canvas" aria-live="polite">
            <div className="gate4b-canvas-topline"><span><Layers3 size={15} /> UNIVERSAL BOARD / {subjectLabel[activeSubject]}</span><span className="gate4b-canvas-note">{objectCapability ? "الكائن يدعم التفاعل" : "كائن عرض"} · {lensReady ? "مرجع المصدر سليم" : "تحقق من المصدر"}</span></div>
            <div className="gate4b-source-card">
              <div className="gate4b-card-label"><span>01 · SOURCE OBJECT</span><b>{journey.source.type}</b></div>
              <div className={`gate4b-source-content ${activeSubject === "mathematics" ? "math-source" : ""}`}>
                {activeSubject === "arabic" ? <><p className="gate4b-arabic-sentence">{String(journey.source.content)}</p><small>sentence id · {shortId(journey.source.id)} · version {journey.source.version}</small></> : <><p className="gate4b-equation">{String(journey.source.content)}</p><small>equation id · {shortId(journey.source.id)} · version {journey.source.version}</small></>}
              </div>
              {!presentation && <button className="gate4b-card-action" onClick={() => beginStage("lens")}><Sparkles size={14} /> افتح العدسة</button>}
            </div>

            {activeSubject === "arabic" ? <ArabicLensCard journey={journey as JourneyState & { lens: GrammarLens }} presentation={presentation} onSelectWord={selectArabicWord} onReveal={revealLens} onMode={setArabicMode} /> : <MathLensCard journey={journey as JourneyState & { lens: MathVisualizationLens }} presentation={presentation} onReveal={revealLens} />}
            {activeSubject === "mathematics" && journey.mathStepSession && <MathStepCard session={journey.mathStepSession} presentation={presentation} onSubmit={submitMathStep} onVerify={verifyMath} onOverride={overrideMathStep} />}
            <ActivityCard journey={journey} presentation={presentation} onAnswer={setAnswer} onI3rabField={setI3rabField} onSubmit={submitAnswer} onRetry={retry} />
            {journey.feedback && <FeedbackCard journey={journey} presentation={presentation} onOverride={applyOverride} />}
            <div className="gate4b-canvas-footer"><span>{notice}</span><span className="gate4b-provenance-mark"><Check size={13} /> provenance محفوظ</span></div>
          </div>
        </section>

        {!presentation && <aside className="gate4b-inspector" aria-label="لوحة المعلم"><div className="gate4b-inspector-head"><span className="gate4b-kicker">TEACHER PANEL</span><h2>لوحة الدليل</h2><p>نفس Interaction · Assessment · Feedback للمادتين.</p></div><div className="gate4b-metric"><span>المصدر</span><strong>{journey.source.type}</strong><small>{shortId(journey.source.id)}</small></div><div className="gate4b-metric"><span>التحويل</span><strong>{journey.lens.type}</strong><small>{journey.lens.provenance.derivationType}</small></div><div className="gate4b-metric"><span>النشاط</span><strong>{journey.activity.completionState === "complete" ? "مكتمل" : "بانتظار الإجابة"}</strong><small>{journey.activity.attemptCount} محاولات</small></div><div className="gate4b-note"><Target size={16} /><p><b>حدود هذه الشريحة</b> تحليل عربي ومعادلة محددان مسبقًا للتأكد من الصحة التعليمية دون أدوات توليدية.</p></div><div className="gate4b-checklist"><span>OWNER REVIEW SIGNALS</span><p><Check size={13} /> canonical EducationalObject</p><p><Check size={13} /> deterministic evaluation</p><p><Check size={13} /> save / restore round-trip</p></div><button className="gate4b-outline-button" onClick={saveLesson}><FileDown size={15} /> حفظ الحالة الحالية</button><div className="gate4b-shortcut"><Undo2 size={14} /> <span>Ctrl / ⌘ + S<br /><small>اختصار الحفظ</small></span></div></aside>}
      </section>
      <footer className="gate4b-footer"><span>Professional teaching instrument · Arabic-first · RTL-aware</span><span>TOUCH / STYLUS · NOT VERIFIED — HARDWARE UNAVAILABLE</span><span>Gate 4B · Owner review required</span></footer>
    </main>
  );
}

function ArabicLensCard({ journey, presentation, onSelectWord, onReveal, onMode }: { journey: JourneyState & { lens: GrammarLens }; presentation: boolean; onSelectWord: (wordId: string) => void; onReveal: () => void; onMode: (mode: GrammarLens["mode"]) => void }) {
  const selected = journey.lens.words.find((word) => word.id === journey.lens.selectedWordId);
  return <section className="gate4b-lens-card"><div className="gate4b-card-label"><span>02 · GRAMMAR LENS</span><b>sourceRange {journey.lens.sourceRange?.start}–{journey.lens.sourceRange?.end} · guided {journey.lens.disclosureLevel}/5</b></div><div className="gate4b-lens-heading"><div><h3>من قام بالفعل؟</h3><p>انقر كلمة لربطها بدورها النحوي.</p></div>{!presentation && <><button className="gate4b-icon-action" onClick={onReveal} aria-label={journey.lens.revealAnswer ? "إخفاء الإجابة" : "الانتقال إلى مستوى الكشف التالي"}>{journey.lens.revealAnswer ? <EyeOff size={16} /> : <Eye size={16} />} {journey.lens.revealAnswer ? "إخفاء" : `المستوى ${journey.lens.disclosureLevel + 1 > 5 ? 1 : journey.lens.disclosureLevel + 1}`}</button><button className="gate4b-quiet-button" onClick={() => onMode(journey.lens.mode === "teacher" ? "student" : "teacher")} aria-pressed={journey.lens.mode === "teacher"}>{journey.lens.mode === "teacher" ? "وضع الطالب" : "وضع المعلم"}</button></>}</div><div className="gate4b-word-row">{journey.lens.words.map((word) => <button key={word.id} className={word.id === journey.lens.selectedWordId ? "selected" : ""} onClick={() => onSelectWord(word.id)} aria-label={`اختيار كلمة ${word.text}`}><span>{word.text}</span>{journey.lens.disclosureLevel >= 2 && <small>{word.grammaticalRole}</small>}</button>)}</div>{selected && <div className="gate4b-selected-word"><b>{selected.text}</b><span>{journey.lens.disclosureLevel >= 3 ? selected.caseMark : journey.lens.disclosureLevel >= 2 ? selected.grammaticalRole : "اضغط كشف الإجابة لرؤية الدور"}</span><small>{journey.lens.disclosureLevel >= 5 ? selected.explanation : journey.lens.disclosureLevel >= 4 ? "اسأل: لماذا تحمل الكلمة هذا الدور؟" : `word range ${selected.start}–${selected.end}`}</small>{journey.lens.disclosureLevel >= 3 && <div className="gate4b-i3rab-reveal" aria-label="تفاصيل الإعراب"><span><b>الدور</b>{journey.lens.disclosureLevel >= 2 ? selected.grammaticalRole : "مخفي"}</span><span><b>الحالة</b>{journey.lens.disclosureLevel >= 3 ? (selected.grammaticalRole === "مفعول به" ? "منصوب" : "مرفوع") : "مخفي"}</span><span><b>العلامة</b>{journey.lens.disclosureLevel >= 3 ? selected.caseMark.replace("مرفوع · ", "").replace("منصوب · ", "") : "مخفي"}</span><span><b>السبب</b>{journey.lens.disclosureLevel >= 5 ? (selected.explanation.split(" — ")[1] ?? selected.explanation) : "مخفي حتى مستوى لماذا"}</span></div>}</div>}<div className="gate4b-trace-line"><span>PROVENANCE</span><strong>{shortId(journey.lens.provenance.sourceObjectId)} ← SentenceObject</strong><i>{journey.lens.provenance.teacherApproved ? "approved" : "derived · deterministic"}</i></div></section>;
}

function MathLensCard({ journey, presentation, onReveal }: { journey: JourneyState & { lens: MathVisualizationLens }; presentation: boolean; onReveal: () => void }) {
  return <section className="gate4b-lens-card math-lens-card"><div className="gate4b-card-label"><span>02 · VISUALIZATION LENS</span><b>equation ↔ representation</b></div><div className="gate4b-lens-heading"><div><h3>وازن الطرفين، ثم تحقق</h3><p>تمثيل بصري صغير يثبت نقطة الحل.</p></div>{!presentation && <button className="gate4b-icon-action" onClick={onReveal} aria-label={journey.lens.revealAnswer ? "إخفاء خطوات الحل" : "إظهار خطوات الحل"}>{journey.lens.revealAnswer ? <EyeOff size={16} /> : <Eye size={16} />} {journey.lens.revealAnswer ? "إخفاء" : "كشف الخطوات"}</button>}</div><div className="gate4b-graph"><svg viewBox="0 0 480 132" role="img" aria-label="تمثيل نقطة الحل x يساوي 4"><path d="M34 92H454M76 18V113" /><path className="curve" d="M76 94L150 78L224 62L298 46L372 30L446 14" /><circle cx="372" cy="30" r="6" /><text x="362" y="18">x = 4</text><text x="444" y="111">x</text><text x="48" y="26">y</text></svg><div><span>نقطة التحقق</span><strong>(4, 0)</strong></div></div>{journey.lens.revealAnswer && <div className="gate4b-step-row">{journey.lens.operationSteps.map((step, index) => <div key={step.equation}><span>0{index + 1}</span><b>{step.equation}</b><small>{step.label}</small></div>)}</div>}<div className="gate4b-trace-line"><span>PROVENANCE</span><strong>{shortId(journey.lens.provenance.sourceObjectId)} ← EquationObject</strong><i>derived · deterministic</i></div></section>;
}

function ActivityCard({ journey, presentation, onAnswer, onI3rabField, onSubmit, onRetry }: { journey: JourneyState; presentation: boolean; onAnswer: (value: string) => void; onI3rabField: (field: I3rabField, value: string) => void; onSubmit: () => void; onRetry: () => void }) {
  const arabic = journey.subject === "arabic";
  const challenge = journey.activity.i3rab;
  const response = challenge?.response;
  const arabicReady = Boolean(response?.wordId && response.grammaticalRole && response.case && response.caseMarker && response.reason);
  const ready = arabic ? arabicReady : Boolean(journey.activity.answer);
  const selectField = (field: I3rabField, label: string, options: string[], value?: string) => <label className="gate4b-i3rab-field" key={field}><span>{label}</span><select value={value ?? ""} onChange={(event) => onI3rabField(field, event.target.value)} aria-label={label}><option value="">اختر…</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
  return <section className="gate4b-activity-card"><div className="gate4b-card-label"><span>03 · INTERACTIVE ACTIVITY</span><b>{journey.activity.interactionKind}</b></div><div className="gate4b-activity-main"><div><span className="gate4b-activity-kicker">{arabic ? "I3RAB" : "SOLVE"}</span><h3>{journey.activity.prompt}</h3><p>{arabic ? "أكمل نوع الكلمة وموقعها وحالتها وعلامتها وسببها." : "أدخل قيمة x ثم تحقق من التكافؤ."}</p></div>{!presentation && <span className="gate4b-attempt-count">{journey.activity.attemptCount} محاولات</span>}</div>{arabic ? <div className="gate4b-i3rab-form" aria-label="إجابة الإعراب المنظمة">{selectField("grammaticalRole", "الدور النحوي", challenge?.options.roles ?? [], response?.grammaticalRole)}{selectField("case", "الحالة الإعرابية", challenge?.options.cases ?? [], response?.case)}{selectField("caseMarker", "علامة الإعراب", challenge?.options.markers ?? [], response?.caseMarker)}{selectField("reason", "السبب", challenge?.options.reasons ?? [], response?.reason)}</div> : <div className="gate4b-answer-input"><label htmlFor="math-answer">قيمة x</label><input id="math-answer" inputMode="decimal" value={journey.activity.answer} onChange={(event) => onAnswer(event.target.value)} placeholder="مثال: 4" /><span>2x + 3 = 11</span></div>}<div className="gate4b-activity-actions">{!presentation && <button className="gate4b-primary-button" onClick={onSubmit} disabled={!ready}><Check size={15} /> إرسال الإجابة</button>}{journey.assessment && !["correct", "valid-alternative"].includes(journey.assessment.evaluation) && <button className="gate4b-quiet-button" onClick={onRetry}><RotateCcw size={15} /> إعادة المحاولة</button>}<span className="gate4b-assessment-status">{journey.assessment ? `التقييم: ${statusLabel[journey.assessment.evaluation]}` : "لم يُقيّم بعد"}</span></div></section>;
}

function FeedbackCard({ journey, presentation, onOverride }: { journey: JourneyState; presentation: boolean; onOverride: (state: FeedbackState, reason: string, note: string) => void }) {
  const [overrideState, setOverrideState] = useState<FeedbackState>(journey.assessment?.effectiveEvaluation ?? "correct");
  const [reason, setReason] = useState("مراجعة المعلم للسياق التعليمي");
  const [note, setNote] = useState("قرار المعلم محفوظ كحدث مستقل عن تقييم النظام.");
  if (!journey.feedback || !journey.assessment) return null;
  const positive = journey.feedback.state === "correct" || journey.feedback.state === "valid-alternative";
  return <section className={`gate4b-feedback-card ${journey.feedback.state}`}><div className="gate4b-card-label"><span>04 · FEEDBACK</span><b>{positive ? "COMPLETED" : "RETRY AVAILABLE"}</b></div><div className="gate4b-feedback-content"><div className="gate4b-feedback-icon">{positive ? <Check size={20} /> : <Target size={19} />}</div><div><span>{journey.feedback.state === "correct" || journey.feedback.state === "valid-alternative" ? "دليل واضح" : journey.feedback.state === "partially-correct" ? "إشارة مفيدة" : "مساحة للمحاولة"}</span><h3>{journey.feedback.title}</h3><p>{journey.feedback.explanation}</p>{journey.feedback.hint && <small><b>تلميح:</b> {journey.feedback.hint}</small>}{journey.feedback.nextStep && <small><b>الخطوة التالية:</b> {journey.feedback.nextStep}</small>}</div><div className="gate4b-score"><strong>{Math.round((journey.assessment.effectiveEvaluation === "correct" || journey.assessment.effectiveEvaluation === "valid-alternative" ? 1 : journey.assessment.score) * 100)}%</strong><span>effective score</span></div></div><div className="gate4b-feedback-meta"><span>assessment · {shortId(journey.assessment.id)}</span><span>system · {statusLabel[journey.assessment.evaluation]}</span><span>effective · {statusLabel[journey.assessment.effectiveEvaluation]}</span><span>events · {journey.assessment.events.length}</span><span>diagnostic · {journey.assessment.diagnostic}</span><span>review · {reviewLabel[journey.assessment.reviewState]}</span></div>{!presentation && <div className="gate4b-override-panel" aria-label="اعتماد المعلم"><div><b>قرار المعلم</b><small>لا يحذف نتيجة النظام؛ يضيف حدث teacher-override قابلًا للتتبع.</small></div><select value={overrideState} onChange={(event) => setOverrideState(event.target.value as FeedbackState)} aria-label="الحالة الفعالة"><option value="correct">صحيحة</option><option value="valid-alternative">بديلة صحيحة</option><option value="partially-correct">جزئية</option><option value="incorrect">غير صحيحة</option><option value="incomplete">غير مكتملة</option></select><input value={reason} onChange={(event) => setReason(event.target.value)} aria-label="سبب قرار المعلم" /><input value={note} onChange={(event) => setNote(event.target.value)} aria-label="ملاحظة قرار المعلم" /><button className="gate4b-quiet-button" onClick={() => onOverride(overrideState, reason, note)}><Check size={14} /> حفظ قرار المعلم</button></div>}</section>;
}


/**
 * Gate 4C-B UI reminder: the math card is a subject lens inside the shared
 * Arabic-first workspace; it owns no board, registry, persistence, or scoring engine.
 */
function MathStepCard({ session, presentation, onSubmit, onVerify, onOverride }: { session: MathStepSession; presentation: boolean; onSubmit: (step: SolutionStepObject) => void; onVerify: (expression: string) => void; onOverride: (decision: FeedbackState, reason: string) => void }) {
  const canonical = session.steps[session.currentStep - 1];
  const [expressionBefore, setExpressionBefore] = useState(canonical?.expressionBefore ?? "");
  const [operation, setOperation] = useState("");
  const [expressionAfter, setExpressionAfter] = useState("");
  const [justification, setJustification] = useState("");
  const [verification, setVerification] = useState("2(4) + 3 = 11");
  const [mode, setMode] = useState<"teacher" | "student">(session.mode);
  const [teacherDecision, setTeacherDecision] = useState<FeedbackState>("correct");
  const [teacherReason, setTeacherReason] = useState("مراجعة المعلم لسياق الخطوة");
  useEffect(() => {
    setExpressionBefore(canonical?.expressionBefore ?? "");
    setOperation("");
    setExpressionAfter("");
    setJustification("");
  }, [session.currentStep, canonical?.expressionBefore]);
  const latest = session.assessments[session.assessments.length - 1];
  return <section className="gate4b-activity-card math-step-card" aria-label="نشاط الحل خطوة بخطوة">
    <div className="gate4b-card-label"><span>03 · STEP-BY-STEP SOLUTION</span><b>STEP {session.currentStep} / 2</b></div>
    <div className="gate4b-activity-main"><div><span className="gate4b-activity-kicker">MATH PROBLEM</span><h3>{session.problem.equation}</h3><p>ابنِ الحل خطوة خطوة؛ لا يكفي تطابق الإجابة النهائية.</p></div>{!presentation && <button className="gate4b-quiet-button" onClick={() => setMode(mode === "teacher" ? "student" : "teacher")} aria-pressed={mode === "teacher"}>{mode === "teacher" ? "وضع الطالب" : "وضع المعلم"}</button>}</div>
    <div className="gate4b-i3rab-form math-step-form" aria-label="إجابة الخطوة المنظمة">
      <label className="gate4b-i3rab-field"><span>قبل العملية</span><input value={expressionBefore} onChange={(event) => setExpressionBefore(event.target.value)} aria-label="التعبير قبل العملية" /></label>
      <label className="gate4b-i3rab-field"><span>العملية</span><input value={operation} onChange={(event) => setOperation(event.target.value)} placeholder="مثال: subtract 3 from both sides" aria-label="العملية الرياضية" /></label>
      <label className="gate4b-i3rab-field"><span>بعد العملية</span><input value={expressionAfter} onChange={(event) => setExpressionAfter(event.target.value)} placeholder="مثال: 2x = 8" aria-label="التعبير بعد العملية" /></label>
      <label className="gate4b-i3rab-field"><span>التبرير</span><input value={justification} onChange={(event) => setJustification(event.target.value)} placeholder="لماذا يحافظ التحويل على المساواة؟" aria-label="التبرير الرياضي" /></label>
    </div>
    {!presentation && <div className="gate4b-activity-actions"><button className="gate4b-primary-button" onClick={() => onSubmit({ ...canonical, expressionBefore, operation, expressionAfter, mathematicalJustification: justification, validityState: "needs-review" })}><Check size={15} /> تقييم الخطوة</button><span className="gate4b-assessment-status">{latest ? `التشخيص: ${latest.diagnostic}` : "لم تُقيّم الخطوة بعد"}</span></div>}
    {latest && <div className={`gate4b-selected-word math-step-feedback`}><b>{latest.feedback.title}</b><span>{latest.feedback.explanation}</span>{latest.feedback.hint && session.disclosureLevel >= 2 && <small><b>تلميح:</b> {latest.feedback.hint}</small>}{mode === "teacher" && latest.feedback.correctedStep && <small><b>التصحيح:</b> {latest.feedback.correctedStep.expressionBefore} → {latest.feedback.correctedStep.expressionAfter}</small>}{mode === "teacher" && !presentation && <div className="math-teacher-override" aria-label="اعتماد المعلم للخطوة"><small><b>الأصل:</b> {latest.evaluation} · {latest.diagnostic} · score {latest.score}</small><select value={teacherDecision} onChange={(event) => setTeacherDecision(event.target.value as FeedbackState)} aria-label="قرار المعلم"><option value="correct">قبول الخطوة</option><option value="valid-alternative">قبول كبديل</option><option value="partially-correct">قبول جزئيًا</option><option value="incorrect">رفض الخطوة</option><option value="incomplete">اعتبارها غير مكتملة</option></select><input value={teacherReason} onChange={(event) => setTeacherReason(event.target.value)} aria-label="سبب قرار المعلم" /><button className="gate4b-quiet-button" onClick={() => onOverride(teacherDecision, teacherReason)}>حفظ قرار المعلم</button><small><b>الفعال:</b> {latest.effectiveEvaluation} · events {latest.events.length}</small></div>}</div>}
    {session.currentStep === 2 && <div className="gate4b-answer-input"><label htmlFor="math-verification">التحقق بالتعويض</label><input id="math-verification" value={verification} onChange={(event) => setVerification(event.target.value)} aria-label="تعبير التحقق بالتعويض" /><span>{session.verification ? session.verification.valid ? "تحقق ناجح" : "تحقق يحتاج مراجعة" : "2(4) + 3 = 11"}</span>{!presentation && <button className="gate4b-quiet-button" onClick={() => onVerify(verification)}>تحقق</button>}</div>}
    <div className="gate4b-trace-line"><span>PROVENANCE</span><strong>{shortId(session.problem.id)} ← EquationObject</strong><i>{session.assessments.length} step assessments · {session.mode}</i></div>
  </section>;
}
