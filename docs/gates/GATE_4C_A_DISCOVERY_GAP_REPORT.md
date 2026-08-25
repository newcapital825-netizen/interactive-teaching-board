# Gate 4C-A — Discovery and Gap Report

## Executive Summary

Gate 4C-A لا يعيد بناء Arabic Engine. الهدف هو اختبار دفاعية شريحة I3rab الحالية تربويًا ولغويًا ضمن نطاق محدود، مع توسيع الأدلة فقط إلى حالات عربية مضبوطة يمكن شرحها وتقييمها deterministic. القراءة الحالية تثبت أن البنية التقنية قابلة للتوسعة، لكنها لا تثبت بعد صلاحية عامة خارج fixture محدود من جملة فعلية واحدة.

## Baseline

| الحقل | الحالة |
| --- | --- |
| Branch | `feature/gate-4c-arabic-i3rab-hardening` |
| Base | `9284db52a1d198bec9fb98aef2bf70f4f16d1608` |
| Source slice | `feature/gate-4c-arabic-i3rab-slice` |
| Main | `ee646db6863ef494ddfcb954ac1823413d37db1f` — unchanged |
| Existing Arabic cases | فاعل ومفعول به فقط في جملة فعلية واحدة |
| Existing interaction | target word + structured role/case/marker/reason |
| Existing assessment states | correct, valid-alternative, partially-correct, incorrect, incomplete |
| Existing disclosure | revealAnswer boolean؛ لا توجد مستويات 1–5 صريحة |

## Proven

المصدر هو `SentenceObject` canonical، و`GrammarLens` مشتقة منه، وتحمل `sourceObjectId` و`sourceRange` و`sourceVersion` وprovenance. النشاط يحتفظ بـI3rab response منظم، والتقييم يميز أخطاء الدور والحالة والعلامة والسبب، ويعيد feedback وnext step. teacher override منفصل auditably عن system result، وmigration ترفض malformed payload وتعيد بناء challenge القديم عند غياب الحقل.

## Partially Proven

الشرح التعليمي موجود ولكنه عام ومحدود بجملة واحدة. progressive disclosure مرئي للعدسة عبر reveal، لكنه لا يميز صراحة بين student guided sequence وteacher complete explanation. قبول البدائل صريح في بعض المسارات لكنه غير ممثل بعد كبيانات golden مستقلة لكل نوع لغوي. teacher workflow موجود كشريحة واجهة، لكنه لا يثبت اختيار learning objective وdifficulty/disclosure level كإعدادات محفوظة مستقلة.

## Not Proven

لم تثبت الشريحة بعد: المبتدأ والخبر والاسم المجرور والنعت والمضاف إليه والأفعال الثلاثة كحالات golden مستقلة، ولا correctness عامة لهذه الفئات. كما لم تثبت ambiguous/unsupported answers كحالات تعليمية منفصلة عن incorrect. لا يوجد corpus خارجي أو حكم لغوي عام؛ لذلك يجب أن تبقى الحالات الجديدة explicit fixtures موثقة، لا inference مفتوحًا.

## Required Hardening

| الفجوة | المعالجة المحدودة |
| --- | --- |
| dataset ضيق | إضافة عشر fixtures deterministic، مع توضيح أن كل fixture قاعدة محلية مدعومة |
| diagnostics عامة | إضافة diagnostics تعليمية لحالات unsupported/ambiguous/irrelevant explanation عند الحاجة |
| البدائل | تمثيل acceptable alternatives وinvalid alternatives صراحة في dataset والتحقق منها بلا fuzzy matching |
| disclosure | إضافة مستوى تعليمي محفوظ يحدد ما يظهر للطالب وما يظهر للمعلم |
| evidence | حفظ `source`, `sourceVersion`, `provenance` في كل fixture |
| regression | اختبارات golden وnegative وassessment→feedback وround-trip وmigration |

## Safety Boundary

لا يجوز أن تقبل الشريحة إجابة عربية لمجرد التشابه النصي. أي صيغة لا تملك expected result أو alternative صريحًا تُصنف `unsupported` أو `needs-review` في طبقة dataset، ولا تتحول تلقائيًا إلى correct. وبسبب عدم وجود `unsupported` في enum الحالي، يجب تنفيذ ذلك بأقل إضافة متوافقة أو بتسجيله كحالة مراجعة خارج الخمس حالات المشتركة، دون إنشاء محرك تقييم ثانٍ.

## Stop Decision for Discovery

Discovery مكتمل. يمكن تنفيذ hardening محدود على branch الحالي، مع عدم بناء NLP أو morphology أو rhetoric أو AI أو Math أو OCR. القرار التعليمي النهائي يجب أن يبقى **CONDITIONAL** حتى بعد نجاح الاختبارات، لأن golden fixtures المحدودة لا تساوي صحة عربية عامة.
