# Whiteboard UX — Gate 3B

## Design intent

السبورة مساحة تدريس هادئة وليست لوحة تحكم إدارية. يبدأ الاستخدام من canvas واضح، وتظهر الأدوات حسب السياق بدل كشف كل الإمكانات دفعة واحدة. الهوية البصرية warm paper/olive/coral موروثة من المشروع، لكن hierarchy أصبح أوضح: عنوان ومساحة حالة، toolbar أساسي، contextual strip، صفحات، canvas، ثم inspector.

## Teacher journey

المسار المقصود هو: **إنشاء → تنظيم → شرح → تفاعل → حفظ → تقديم**. الأدوات الظاهرة تستخدم لغة عربية بسيطة؛ لا تظهر كلمات Registry أو Adapter أو Capability أو Serialization في سطح المعلم.

## Responsive behavior

على desktop تظهر pages وinspector حول canvas. على tablet يتحول inspector إلى صف لاحق ويصبح toolbar قابلاً للتمرير أفقيًا. على mobile تصبح pages شريطًا أفقيًا، وتكبر أهداف اللمس، وتبقى contextual actions قابلة للتمرير دون تصغير سطح اللوحة إلى حجم غير قابل للاستخدام.

## Scope boundary

هذه تجربة subject-agnostic. Question/Activity/Equation/Graph هنا عناصر عامة أو proof objects فقط؛ لا توجد Arabic Engine أو Math Solver أو AI أو OCR أو collaboration.

## Verification boundary

تم التحقق من العرض في preview وإضافة QuestionObject تفاعليًا. اختبارات touch/stylus وUI automation وreal browser performance ليست ادعاءات؛ تسجل كتحديات تحقق مستقلة.
