# Gate 4C — Arabic Grammar / I3rab Vertical Slice

## STATUS

**IMPLEMENTED — READY FOR OWNER REVIEW**.

هذه شريحة عربية محدودة ومتعمدة لإثبات رحلة تعليمية واحدة من مصدر الجملة إلى الإعراب المنظم والتفاعل والتقييم والتغذية الراجعة والمراجعة والحفظ والاستعادة. لم تُنفذ Mathematics أو AI أو OCR أو Full Arabic Engine، ولم يُفتح Pull Request أو يحدث merge.

## BRANCH / BASE / HEAD

| الحقل | القيمة |
| --- | --- |
| Branch | `feature/gate-4c-arabic-i3rab-slice` |
| Base | `feature/gate-4c-discovery` عند `2f948548a30ae4219edb4b36ff15723225385747` |
| HEAD | `3e151885eb761565b77b683dc07252632f504028` |
| Clean clone | PASS من GitHub branch؛ working tree clean |
| Remote branch | يطابق HEAD `3e151885eb761565b77b683dc07252632f504028` |
| Repository | [interactive-teaching-board](https://github.com/newcapital825-netizen/interactive-teaching-board) |
| Main | لم يُعدّل |
| Pull Request | لا يوجد — `gh pr list` أعاد `[]` |
| Merge | لم يحدث |
| Main remote | `ee646db6863ef494ddfcb954ac1823413d37db1f` — unchanged |

## FILES CREATED

| الملف | الوظيفة |
| --- | --- |
| `tests/fixtures/arabic-i3rab.golden.ts` | Golden Dataset صغير للنطاق المدعوم |
| `tests/gate4c-arabic-i3rab.test.ts` | اختبارات vertical slice والتقييم والـround-trip والمigration |
| `docs/gates/GATE_4C_ARABIC_I3RAB_REPORT.md` | هذا التقرير |
| `docs/qa/GATE_4C_ARABIC_VISUAL_QA.md` | سجل الفحص البصري desktop/mobile |

## FILES MODIFIED

| الملف | التغيير |
| --- | --- |
| `client/src/lib/gate4bTeaching.ts` | إضافة I3rab structured challenge، field response، تشخيصات، تقييم deterministic، migration آمنة، وإعادة بناء challenge من lesson قديم |
| `client/src/components/Gate4BWorkspace.tsx` | تحويل Arabic activity إلى حقول role/case/marker/reason، progressive reveal، وعرض diagnostic |
| `client/src/index.css` | تنسيق RTL للنموذج والـprogressive reveal وfocus-visible |
| `todo.md` | تحديث قائمة تحقق الشريحة العربية |

## FILES DELETED

لا توجد ملفات محذوفة.

## ARCHITECTURAL CHANGES

لم يُنشأ domain model أو Registry أو Factory أو Assessment/Feedback/Persistence engine جديد. المصدر يُنشأ عبر `createRegisteredEducationalObject("SentenceObject", ...)`، وتبقى I3rab Lens representation مشتقة تحمل `lensType = "I3rab"` فوق `GrammarLens` canonical الموجودة. أضيفت `I3rabChallenge` و`I3rabResponse` كبيانات تخصصية محدودة داخل workflow المشترك، وليست محركًا منفصلًا.

## ARABIC EDUCATIONAL COVERAGE

الشريحة تدعم الجملة الفعلية المضبوطة `كتبَ الطالبُ الدرسَ.`، واختيار token، ثم إكمال role وcase وcase marker وreason من قوائم منظمة. تُعرض المعلومات تدريجيًا في العدسة: الكلمة، ثم الدور، ثم الحالة، ثم العلامة، ثم السبب. هذا ليس ادعاءً لصحة عربية عامة؛ القاعدة صحيحة فقط ضمن fixtures والقواعد المحددة هنا.

| المفهوم | الحالة |
| --- | --- |
| SentenceObject source | PROVEN |
| Token selection and source range | PROVEN |
| Subject `فاعل` | PROVEN داخل fixture المحدد |
| Object `مفعول به` | PROVEN داخل fixture المحدد |
| Case `مرفوع` / `منصوب` | PROVEN داخل fixture المحدد |
| Visible markers `الضمة` / `الفتحة` | PROVEN داخل fixture المحدد |
| Full morphology, rhetoric, literature, unrestricted parsing | NOT PROVEN |

## I3RAB COVERAGE

`I3rabChallenge` يربط target word بالـexpected role/case/marker/reason وبخيارات منظمة. لا ينسخ SentenceObject ولا يغيّر المصدر. الـLens يحتفظ بـ`sourceObjectId` و`sourceRange` و`sourceVersion` وprovenance derivation.

## ASSESSMENT COVERAGE

يُستخدم `evaluateAnswer` و`assessActivity` المشتركان. التقييم المنظم يميز `correct` و`incorrect` و`partially-correct` و`incomplete` و`valid-alternative`، ويستخدم diagnostics محددة عند الإمكان: `role-error` و`case-error` و`marker-error` و`reasoning-error` و`answer-error`. الإجابات scalar القديمة مثل `word_2` بقيت متوافقة مع Gate 4B regression.

## FEEDBACK COVERAGE

التغذية الراجعة deterministic وغير توليدية، وتعرض title وexplanation وhint وnextStep، مع diagnostic ظاهر في metadata. أمثلة الرسائل تشرح العلاقة التعليمية، مثل أن الفاعل هو من قام بالفعل، بدل الاكتفاء بعبارة رفض عامة.

## TEACHER OVERRIDE

يحافظ teacher override على `systemAssessment` ضمنيًا عبر assessment الأصلي ويفصل `effectiveEvaluation` و`teacherOverride` وevent مستقل. لا تُحذف نتيجة النظام، وتُحفظ ملاحظة وسبب المعلم مع provenance. اختُبر أن round-trip يعيد system result وeffective teacher decision وeventين منفصلين.

## PROVENANCE STATUS

**PROVEN** للسلسلة الحالية:

`SentenceObject → I3rab Lens → Activity → Student Response → Assessment → Feedback → Teacher Override`.

تحافظ الشريحة على IDs وsource references وranges وversions وlens/activity IDs خلال save/restore. cross-device audit وcloud synchronization خارج هذه الشريحة.

## MIGRATION STATUS

**PROVEN جزئيًا**. migration الحالية تستخدم `deserializeLesson` و`migrateLesson` canonical، وتعيد بناء `I3rabChallenge` من `GrammarLens.words` عند غياب الحقل في lesson v1. تُرفض malformed response والخيارات والحقول غير الآمنة بدل اختراع correctness. لا تدعي هذه الشريحة دعم سلسلة إصدارات طويلة أو cloud conflicts.

## GOLDEN DATASET STATUS

Golden Dataset صغير من حالتين: `فاعل مرفوع بالضمة` و`مفعول به منصوب بالفتحة` للجملة نفسها. لكل حالة id وinput وexpectedResult وacceptableAlternatives وincorrectCases وexplanation وsource/version. dataset يثبت subset فقط ولا يمثل العربية كاملة.

## TEST RESULTS

| الفئة | النتيجة |
| --- | --- |
| `pnpm check` | PASS |
| Full regression `pnpm test -- --run` | PASS — 11 test files، 54 tests |
| Arabic I3rab suite | PASS — 7 tests |
| Golden dataset | PASS |
| Positive/negative/partial/incomplete/alternative | PASS |
| Provenance and round-trip | PASS |
| v1→v2 migration | PASS |
| Malformed payload rejection | PASS |
| Determinism | PASS عبر الدوال المشتركة |
| `pnpm build` | PASS |
| `git diff --check` | PASS |
| Clean-clone install | PASS — `pnpm install --frozen-lockfile` |
| Clean-clone check/test/build | PASS — 11 files، 54 tests، build completed with bundle-size warning |

## PERFORMANCE RESULTS

القياسات الحالية هي Node/Vitest domain measurements الموروثة من Gate 4B، وليست browser performance claims. تظهر أحدث جولة أن full suite اكتملت خلال نحو 0.57 ثانية في sandbox، وأن عمليات 100/250/500 object بقيت ناجحة. لا توجد real-browser أو real-device measurements لهذه الشريحة.

## BROWSER STATUS

`UI AUTOMATION = NOT VERIFIED — RUNNER UNAVAILABLE`. تمت معاينة الواجهة بصريًا في desktop 1280×720 وmobile 390×844، لكن ذلك لا يساوي browser automation أو lifecycle test كامل.

## TOUCH STATUS

`TOUCH = NOT VERIFIED — HARDWARE UNAVAILABLE`.

## STYLUS STATUS

`STYLUS = NOT VERIFIED — HARDWARE UNAVAILABLE`.

## ACCESSIBILITY STATUS

RTL، semantic labels، `aria-live`، tab roles، focus-visible، وkeyboard save/Escape موجودة وتمت مراجعتها static وبصريًا. `SCREEN READER = NOT VERIFIED` و`FULL WCAG AUDIT = NOT VERIFIED`.

## SECURITY STATUS

**PARTIALLY PROVEN**. migration sanitization وsafe rejection وعدم تنفيذ payloads مثبتة ضمن المسار المحلي. لم تُنفذ threat model كاملة للـcloud sharing أو accounts أو student data، وهي خارج النطاق.

## PROVEN

Canonical model reuse، I3rab Lens derived representation، structured Arabic activity، deterministic assessment، diagnostic feedback، auditable teacher override، provenance chain، local save/restore، v1→v2 migration bounded، golden fixtures، regression suite، وRTL responsive UI review.

## PARTIALLY PROVEN

Arabic educational usefulness خارج fixture، screen-reader behavior، browser lifecycle، teacher classroom workflow، migration عبر إصدارات متعددة، وperformance خارج Node sandbox.

## NOT PROVEN

Full Arabic grammar، morphology، rhetoric، literature، unrestricted NLP، AI grading، OCR، cloud persistence، multi-user collaboration، وArabic correctness خارج القواعد والـfixtures المدعومة.

## NOT VERIFIED

UI automation، real-browser performance، touch، stylus، screen reader، وfull WCAG.

## BLOCKED

لا يوجد blocker معماري مثبت. Gate 4D وMath slice **BLOCKED BY STOP RULE** حتى Owner Review منفصل. أي توسعة عربية خارج هذا subset متوقفة.

## KNOWN LIMITATIONS

النشاط المنظم يدعم token واحدًا وإجابة واحدة محددة في كل محاولة. `reason` اختيار من قائمة، وليس نصًا حرًا أو تحليلًا لغويًا. لا يوجد تحرير جملة من المستخدم داخل هذه الشريحة؛ المصدر fixture مضبوط. كما أن punctuation جزء من token الأخير في tokenizer الحالي، وهو سلوك مقصود ومختبر لهذه الشريحة وليس tokenizer عربيًا عامًا.

## NEXT RECOMMENDATION

مراجعة Owner لهذه الشريحة فقط. إذا اعتُمدت، يمكن لاحقًا تفويض تحسين محدود واحد: إما توسيع fixtures للجملة الاسمية، أو إضافة guided I3rab step sequence، وليس بناء Full Arabic Engine. يجب أن يظل Math slice منفصلًا، ولا يُفتح Gate 4D قبل مراجعة الأدلة والقيود.

## STOP RULE

تم التوقف عند نهاية الشريحة. لا PR، لا merge، لا تعديل `main`، لا Math، لا Gate 4D، لا AI، لا OCR، لا Billing، ولا Collaboration.

## References

1. [Gate 4C Discovery Report](./GATE_4C_REPORT.md)
2. [Gate 4B Final Hardening](./GATE_4B_FINAL_HARDENING.md)
3. [Subject Engine Architecture](../architecture/SUBJECT_ENGINE_ARCHITECTURE.md)
4. [Repository](https://github.com/newcapital825-netizen/interactive-teaching-board)
