# MVP UX Refinement Report

## الحالة

تم تنفيذ جولة UX/Product Refinement على الفرع `feature/mvp-ux-refinement` دون فتح Gate جديدة، ودون إنشاء محرك أو نموذج أو Registry أو Factory أو Persistence/Assessment/Feedback/Provenance architecture جديدة. الهدف كان جعل مساحة مِداد **context-first**، عربية أولًا، أوضح للمعلم، وأكثر قابلية للاستخدام على الهاتف.

## UX changes

أصبح عنوان الدرس ظاهرًا وقابلًا للتحرير مع placeholder `اكتب عنوان الدرس`، مع بقاء اسم المنصة ثابتًا بوصفه `مِداد`. أضيفت شرائط واضحة للمادة والفئة، واختيار الصف/المستوى أصبح تابعًا للفئة المحددة. المواد غير المدعومة (`العلوم` و`الإنجليزية`) تظهر بصيغة `قريبًا` ولا تفعّل أي محرك وهمي. وضعت الوحدة/الموضوع والهدف التعليمي داخل قسم تفاصيل اختياري حتى لا يزاحم رأس الدرس مساحة البناء.

أعيد ترتيب مساحة المعلم بحيث يظهر عنوان واضح لمساحة البناء قبل اللوحة، وتظل الإجراءات السياقية مرتبطة بالعنصر المحدد. طُويت أدوات الشرح المساندة ولوحة الدليل التعليمية داخل أقسام اختيارية لتقليل التشويش، مع إبقاء الوصول إليها ووظائفها الحالية. أضيفت حالات فارغة ورسائل عربية أوضح، وأضيفت أسماء وصول للعناصر الجديدة باستخدام `aria-label` و`aria-pressed` و`role="radiogroup"` حيث يلزم.

## Files changed

| الملف | نوع التغيير | النطاق |
|---|---|---|
| `client/src/components/TeacherProductShell.tsx` | Production code | context-first header، metadata المحلية، شرائط المادة والفئة، المستوى التابع للفئة، details، تنظيم workspace |
| `client/src/index.css` | Production styling | layout، mobile stacking، context choices، details، canvas-first stage، responsive correction |
| `docs/gates/MVP_UX_REFINEMENT_REPORT.md` | Documentation | هذا التقرير |

لم تُنشأ ملفات domain أو محركات موازية. لم تتغير `coreBoard` أو `lessonTransfer` أو `TeacherCanvas` أو `ClassroomLoopPanel` في هذه الجولة.

## Root cause and fix

كشف اختبار Playwright أن قاعدة CSS عامة أُضيفت بعد media query كانت تعيد `teacher-product-setup` إلى ثلاثة أعمدة على الهاتف. أدى ذلك إلى تداخل صفحات الدرس وحقول السياق واعتراض النقرات. أُضيفت media query لاحقة تعيد التخطيط إلى عمود واحد تحت `900px`. بعد الإصلاح اختفى التداخل بصريًا ونجحت مصفوفة Playwright الكاملة.

## Tests

| الفحص | النتيجة |
|---|---|
| `pnpm check` | PASS |
| `pnpm test -- --run` | PASS — 22 ملفًا / 113 اختبارًا |
| `pnpm build` | PASS |
| `git diff --check` | PASS |
| Playwright Desktop Chromium | PASS — 10/10 |
| Playwright Mobile Chromium | PASS — 10/10 |
| Playwright total | PASS — 20/20 |

## Browser verification

تم فتح مساحة العمل والتقاط فحص بصري على `1280×720` وعلى `390×844`. أظهر فحص الهاتف بعد الإصلاح عنوان الدرس، شرائط المادة والفئة، المستوى، صفحات الدرس، ومساحة البناء دون التداخل الذي ظهر في الجولة الفاشلة. اختبرت الأتمتة أيضًا الإضافة والتحديد والإجراءات السياقية والتنقل إلى معاينة الطالب والعودة، إضافة إلى سيناريوهات الحفظ والاستعادة والعرض والأداء.

هذه الأدلة هي **Browser Automation Evidence** وليست Human Validation. لا يوجد في هذه الجولة معلم أو طالب حقيقي.

## Architecture impact

الأثر المعماري: **لا يوجد**. التغييرات تستعمل `BoardDocument` و`CoreObject` و`ClassroomLessonState` والعمليات الحالية. قوائم المادة والفئة والمستوى هي ثوابت عرض قابلة للتوسعة داخل المكوّن وليست Subject Engine أو Category Engine جديدة. المواد غير المدعومة لا تنفذ أي وظيفة.

## Evidence classification

العرض العربي RTL، تنظيم الرأس، stacking على الهاتف، keyboard focus الأساسي، والتنقلات التي تغطيها Playwright مصنفة **PROVEN BOUNDED**. Touch hardware وStylus وScreen Reader وFull WCAG وReal-device performance وHuman Validation مصنفة **NOT VERIFIED**.

تُحفظ metadata الجديدة (`subject/category/level/unit/objective`) في التخزين المحلي الحالي الخاص بالمنتج، لكن نقل هذه الحقول داخل envelope التصدير/الاستيراد لم يُغيّر في هذه الجولة لأن `lessonTransfer` يعالج `BoardDocument` canonical فقط. لذلك تُصنف استعادة/نقل هذه الحقول الجديدة عبر ملف التصدير **NOT PROVEN**، ولا يُدّعى خلاف ذلك.

## Known limitations

لا توجد مصادقة متعددة المستخدمين أو Cloud Sync، والحفظ الحالي local-first على هذا الجهاز. لوحة الدليل والأدوات المساندة ما زالت موجودة كأجزاء تاريخية داخل المنتج، لكنها لم تعد مفتوحة افتراضيًا. لا توجد محركات للعلوم أو الإنجليزية. التحقق البشري معلمين وطلاب حقيقيين لم يحدث.

## Final status

**MVP UX REFINEMENT = COMPLETED WITH BOUNDED EVIDENCE**

**Human Validation = NOT VERIFIED**

توقفت الجولة هنا. لا Gate لاحقة، ولا Feature expansion، ولا PR، ولا Merge، ولا Deployment.
