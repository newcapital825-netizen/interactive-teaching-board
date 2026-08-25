# Gate 4B Provenance Trace

## القاعدة

كل representation مشتق في Gate 4B يعلن مصدره صراحة. لا تُقبل علاقة ضمنية بين SentenceObject أو EquationObject والـlens أو النشاط.

```text
sourceObjectId
sourceRange (عند توفره)
sourceVersion
 derivationType
 teacherApproved
```

## مسار العربية

`GrammarLens.provenance.sourceObjectId` يساوي `SentenceObject.id`، و`sourceRange` يغطي النص من 0 إلى طوله، و`sourceVersion` يساوي version المصدر. `ActivityDefinition.sourceObjectId` يساوي المصدر نفسه، و`lensId` يربطه بالتحويل. عندما يُنشأ Assessment، تُنسخ provenance من lens إلى assessment دون تغيير.

## مسار الرياضيات

`MathVisualizationLens.provenance.sourceObjectId` يساوي `EquationObject.id`، والنطاق يغطي المعادلة، وderivation type يعلن `deterministic-equation-visualization`. النشاط والتقييم يحملان نفس مصدر المعادلة عبر lens.

## save / restore

`serializeLesson` يحفظ lesson كاملة كنص JSON محلي. `deserializeLesson` يتحقق من JSON وschemaVersion ووجود lessonId ومصدري الرحلتين؛ عند فشل التحقق يعيد `null`. لا تُستدعى وظائف أو تُنفذ strings أثناء الاستعادة. اختبار round-trip يقارن semantic state للمصدر والعدسة والنشاط ويحافظ على IDs وcapabilities وحالة التقييم.

## قرار teacher approval

الحقل موجود في Provenance ويفتح حدًا واضحًا لمرحلة مستقبلية؛ في Gate 4B تظل representations deterministic وغير معتمدة خارجيًا، لذلك قيمته `false`. لا ينبغي تفسيرها على أنها WCAG أو صلاحية نشر.

## الحدود

التخزين محلي للمتصفح وليس backend أو collaboration. لم تُدّعَ قابلية الاستعادة بين أجهزة أو متصفحات مختلفة، ولم تُنفذ migrations جديدة لأن payload الشريحة يستخدم schemaVersion canonical الحالي.
