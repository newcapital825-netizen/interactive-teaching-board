# Gate 3B Discovery — Universal Whiteboard Experience

## Baseline and prerequisite note

يبدأ هذا الفرع من `main` عند `d24e3fcf925bc61b51e34b7aa42552fd062d1bf6` كما طلبت التعليمات. Gate 2 = PASSED، بينما Gate 3A = READY FOR OWNER REVIEW لكنه غير مدمج في `main`؛ لذلك لا تتوفر طبقة Gate 3A capability/registry داخل هذا الـbaseline. سيحافظ Gate 3B على حدود Core Board الحالية، وسيسجل هذا الاعتماد كـverification gap بدل الادعاء باستخدام طبقة غير موجودة.

الفرع المستهدف هو `feature/gate-3b-universal-whiteboard-ux`. لا تعديل على `main`، ولا PR أو merge ضمن هذا Gate.

## Current UX strengths

اللوحة الحالية تملك سطحًا canvas-first واضحًا، صفحات متعددة، local-first save/restore، أدوات رسم pen/highlighter/eraser، selection وmulti-select وgroup/ungroup، corner resize، keyboard shortcuts مع Ctrl/Meta وtext-input safety، presentation mode وfullscreen fallback. كما أن `CoreBoardBench` يحتوي على semantic buttons وlabels وvisible focus وRTL container، وتوجد اختبارات domain وperformance وkeyboard من Gate 2.

## Current UX weaknesses

الـtoolbar الحالي مسطح ومزدحم؛ الأدوات الأساسية والثانوية وأوامر الإدارة تظهر في صف واحد، وبعض الأدوات المطلوبة مثل Line/Arrow/Hand/Graph/Note غير موجودة. لا توجد contextual action strip حقيقية للكائن المحدد، ولا alignment/layer controls، ولا indicators واضحة لـSaved/Unsaved/Saving. العرض الحالي يضع pages وinspector في panels ثابتة، ما يحتاج إلى responsive behavior أكثر وضوحًا على الهاتف. Presentation mode يحتاج next/previous page keyboard navigation، بينما move interaction وpan tool وhistory boundaries تحتاج polish واختبارات أوضح.

## Reusable implementation surfaces

| Surface | Reuse decision |
|---|---|
| `CoreBoardBench.tsx` | Keep as the single proof surface; split helper functions and toolbar regions only when needed |
| `coreBoard.ts` | Preserve document/page/object model and local-first semantics |
| `keyboardCommands.ts` | Preserve resolver and text-input safety; add only board-safe commands |
| existing `Button`/Lucide setup | Use semantic buttons and icon labels; no new UI framework |
| current CSS tokens | Retain warm paper/olive/coral identity and improve hierarchy/responsiveness |
| Gate 2 tests | Treat as regression contract; no destructive rewrite |

## UX architecture decision

اعتماد بنية `Primary Tool Rail + Context Strip + Compact Utility Bar + Canvas + Collapsible Page/Inspector regions`. الأدوات الأساسية هي Select, Hand, Text, Pen, Highlighter, Eraser, Shape. الأدوات الثانوية تدخل في popover-like native details groups أو rows contextual حتى لا يزدحم السطح. عند تحديد object تظهر فقط actions المناسبة للـobject type المتاح في baseline؛ بعد دمج Gate 3A يمكن استبدال هذا fallback بالcapabilities registry دون إعادة تصميم الواجهة.

## Interaction principles

كل action mutation يجب أن يمر عبر history commit الموجود. IDs وstyles وz-order والبيانات الدلالية لا تتغير إلا عندما تكون العملية نفسها مقصودة. Copy/paste يولد IDs جديدة، بينما duplicate page لا يغير object IDs في الصفحة الأصلية. Pan وzoom يعملان داخل canvas فقط، وtouch-action يمنع scrolling العرضي أثناء السحب. keyboard shortcuts تبقى instant ولا تتدخل في input/textarea/contenteditable.

## Known regression risks

أكبر المخاطر هي كسر drag/resize بسبب إضافة pan mode، فقدان history عند alignment أو layer reorder، فقدان z-order عند group/ungroup، false Saved state، وتحول responsive layout إلى toolbar غير قابل للاستخدام. كذلك لا يمكن إثبات touch/stylus أو real browser performance أو UI automation في البيئة الحالية؛ ستبقى هذه البنود `NOT VERIFIED`.

## Implementation plan

1. إضافة helper functions محلية للترتيب والمحاذاة وreset view وpage navigation، مع الحفاظ على object identity.
2. إعادة تنظيم toolbar إلى primary tools وsecondary menu وcontext actions، وإضافة labels/tooltips نصية.
3. تحسين object manipulation بإضافة drag-to-move وlayer order وalignment/distribution مع history.
4. إضافة save-state UX وpresentation next/previous وEscape/fullscreen fallback.
5. إعادة صياغة responsive CSS للـdesktop/tablet/mobile وزيادة touch target sizes.
6. إضافة domain/regression tests للعمليات الجديدة، وقياسات runtime لـ100/250/500 object دون ادعاء browser FPS.
7. تشغيل visual QA وclean clone والتحقق من branch ثم تحديث التقرير النهائي.

## Scope exclusions

لا Arabic Engine، ولا Math Solver، ولا AI، ولا OCR/PDF Intelligence، ولا collaboration أو student accounts أو billing أو advanced analytics. لا اختيار Canvas vendor في هذا Gate.

## Discovery decision

**CONTINUE WITH CONDITIONAL DEPENDENCY NOTE.** يمكن تحسين UX فوق Core Board الحالي بأمان، لكن Gate 3B لن يدّعي اكتمال capability-registry integration إلى أن يصبح Gate 3A متاحًا على baseline أو يُفوّض owner بدمجه.
