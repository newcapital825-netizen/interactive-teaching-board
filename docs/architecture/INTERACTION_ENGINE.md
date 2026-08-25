# Interaction Engine

## الهدف

طبقة تفاعل قابلة لإعادة الاستخدام تتعامل مع input وselection وgesture وcommand، وتطلب من EducationalObject capabilities بدل افتراض نوع المادة. لا تعرف الطبقة قواعد العربية أو الرياضيات.

## primitives

| Primitive | Arabic example | Math/Science example |
|---|---|---|
| click/select/multi-select | تحديد كلمة أو جملة | تحديد عدة نقاط أو خطوات |
| drag/drop | تصنيف كلمات | وضع أعداد أو تسمية diagram |
| resize/rotate/move | ترتيب بطاقة | تغيير شكل هندسي |
| draw/connect | annotation وعلاقة إعراب | graph edge أو construction |
| sort/match/classify | ترتيب جمل ومطابقة معنى | ترتيب خطوات ومطابقة representations |
| highlight/annotate/reveal/hide | إبراز شاهد أو إخفاء الإعراب | إخفاء الحل أو إظهار step |
| fill/construct/manipulate | ملء قاعدة أو بناء جملة | إنشاء shape أو equation |
| sequence/solve/compare/transform | تحويل نص إلى activity | حل متعدد الخطوات ومقارنة methods |

## state model

`idle → focused → selected → manipulating → committed → reviewed`.

الـinteraction session تحفظ pointer/keyboard context، target IDs، operation، before/after snapshots، وaccessibility announcement. لا تكتب مباشرة في renderer state. commit يمر عبر capability guard وdomain transformation ثم يسجل history.

## input and accessibility

يدعم pointer وkeyboard وwheel وRTL، مع keyboard alternatives للعمليات الأساسية، focus ring، touch target، reduced motion، وannouncements مناسبة. Touch/stylus hardware غير متحقق في Gate 4A.

## invariants

لا يفقد التفاعل ID أو style أو z-order أو source/evidence. لا ينفذ drop على capability غير مدعومة، ولا يحول unknown payload إلى HTML أو script. كل operation قابلة للاختبار كـpure command حيثما أمكن.

## حدود Gate 4A

لا توجد implementation جديدة؛ هذا contract معماري لاختيار لاحقًا بين DOM/canvas adapters.
