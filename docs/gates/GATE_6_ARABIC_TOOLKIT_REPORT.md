# GATE 6 — Arabic Teaching Toolkit Report

## Implemented

أضيفت طبقة عربية source-first داخل Universal Teacher Workspace. يستطيع المعلم كتابة جملة أو فقرة، تحديد كلمة أو عبارة بنطاق مصدر، إضافة annotation تعليمية مرتبطة بالمصدر، وحفظ المصدر والملاحظة داخل Core Board canonical. أضيف كذلك workflow محدود لفهم المقروء: يكتب المعلم السؤال والإجابة المقبولة من المصدر، يعرض معاينة الطالب، ثم يستخدم التقييم deterministic المشترك مع تطبيع عربي محدود للحركات وبعض أشكال الألف.

## Tested

| Area | Evidence |
|---|---|
| Arabic toolkit contracts | 3 tests في `gate6-arabic-toolkit.test.ts` |
| Full regression | 15 test files، 82 tests، كلها PASS |
| TypeScript | `pnpm check` PASS |
| Build | `pnpm build` PASS؛ تحذير bundle فوق 500 kB موثق |
| Diff check | `git diff --check` PASS |
| Visual QA | desktop/mobile screenshots محفوظة في `docs/qa/GATE_6_ARABIC_TOOLKIT_VISUAL_QA.md` |
| Architecture scan | لا يوجد Arabic Registry/Factory/Assessment/Persistence/Provenance duplicate في production code |

## Evidence Classification

| Capability | Classification | Notes |
|---|---|---|
| Sentence / paragraph authoring | PROVEN within product shell | textarea محفوظ محليًا |
| Word / phrase selection | PROVEN within bounded source range | sourceRange محفوظ مع annotation |
| Annotation | PROVEN within bounded flow | annotation object يحمل annotationOf وsourceRange |
| I3rab | PROVEN within 10-case vertical slice | ليس Arabic NLP عام |
| Grammar roles | PARTIALLY PROVEN | الأدوار المثبتة ضمن Golden Dataset فقط |
| Reading comprehension | PROVEN for teacher-defined expected answers | لا يخلق محتوى خارج المصدر |
| Morphology | PARTIALLY PROVEN | fixtures تعليمية محدودة |
| Spelling | PARTIALLY PROVEN | fixtures تعليمية محدودة |
| Vocabulary | PARTIALLY PROVEN | لا تُخترع المعاني |
| Writing | PARTIALLY PROVEN | structural checks وteacher review فقط |
| Deterministic assessment | PROVEN for covered workflows | uncertain/general cases لا تُقدَّم كيقين |
| Diagnostic feedback | PROVEN in existing shared activity path | توسعة القراءة الحالية محدودة |
| Teacher override | PROVEN in existing Arabic/math workspace | أصل النظام والقرار الفعال منفصلان |
| Provenance | PROVEN for source → annotation and existing lens/activity paths | لا يوجد cloud provenance |
| Save / Restore | PROVEN locally | localStorage فقط |
| Migration | PARTIALLY PROVEN | يعتمد على مسارات Gate 4 السابقة؛ لا migration schema جديد هنا |
| RTL / Arabic-first UX | PARTIALLY PROVEN | static desktop/mobile evidence |
| Accessibility | PARTIALLY PROVEN | labels/focus/contrast intent؛ دون WCAG claim |
| Touch | NOT VERIFIED | hardware unavailable |
| Stylus | NOT VERIFIED | hardware unavailable |
| Screen Reader | NOT VERIFIED | no real screen-reader run |
| UI Automation | NOT VERIFIED | runner unavailable |
| Browser Performance | NOT VERIFIED | Node/Vitest only |
| General Arabic NLP | NOT PROVEN | خارج النطاق عمدًا |

## Golden Dataset Coverage

تمت إضافة `arabic-toolkit.golden.ts` وفيها **52 حالة teacher-authored**، أي أكثر من الحد الأدنى المطلوب 50، موزعة على grammar وI3rab وmorphology وspelling وreading وvocabulary وwriting. تغطي الحالات `valid` و`invalid` و`alternative` و`incomplete` و`boundary` و`unsupported`. حجم dataset دليل تغطية تعليمية محدودة فقط، وليس دليلًا على Arabic NLP generality.

## Teacher Usability

المعلم يستطيع كتابة المصدر، تحديد العبارة، إضافة ملاحظة، إضافة المصدر إلى الصفحة، بناء سؤال فهم بإجابة يحددها بنفسه، ثم معاينة إجابة الطالب وتقييمها. ما يزال التحويل المباشر من كل كائن إلى كل نشاط غير موحد في shell؛ الأدوات المتقدمة للـCore Board تبقى داخل المكوّن الحالي وليست كلها exposed كـcontextual actions في شريط العربية.

## Known Risks

التقييم القرائي يستخدم إجابة المعلم المصرح بها، لذلك لا يثبت الاستدلال الدلالي أو قبول المرادفات غير المصرح بها. تخزين annotation يتم محليًا ولا يوفر تعاونًا أو cloud sync. كما أن dynamic code splitting لم يُضف، ولذلك بقي تحذير bundle موثقًا.

## Release Readiness

| Dimension | Status |
|---|---|
| Arabic bounded toolkit | GREEN within covered fixtures |
| Teacher workflow | YELLOW; useful but partial |
| Deterministic correctness | GREEN within supported cases |
| Architecture | GREEN |
| Persistence | YELLOW; local-only |
| Accessibility | YELLOW / NOT VERIFIED for assistive tech |
| Classroom hardware | NOT VERIFIED |
| Production release | RED / DEFERRED |

## Decision

لا يوجد Critical Data Loss أو Security Blocker أو Canonical Architecture Break أو Unsafe Migration أو Deterministic Result معروض كيقين خارج الحالات المثبتة. لذلك تُعد Gate 6 **PASSED FOR ROADMAP CONTINUATION** وليست Release Ready. يمكن الانتقال إلى Gate 7 Mathematics Toolkit على فرع مستقل، مع إبقاء كل الخدمات المحظورة خارج النطاق.

## References

[1]: https://github.com/newcapital825-netizen/interactive-teaching-board/tree/feature/gate-6-arabic-toolkit "Gate 6 branch"

[2]: https://github.com/newcapital825-netizen/interactive-teaching-board/blob/feature/gate-6-arabic-toolkit/client/src/components/ArabicToolkitPanel.tsx "Arabic toolkit panel"
