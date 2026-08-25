# Gate 4B — Controlled Vertical Slice

## الغرض

هذه الشريحة تثبت أن بنية Gate 4A تنتج رحلة تعليمية قابلة للاستخدام في مادتي العربية والرياضيات، دون تحويل Core Board إلى نظام يعرف قواعد المادة. المساران يستخدمان المصدر canonical من `EducationalObject`، ثم representation مشتق، ثم النشاط والتقييم والتغذية الراجعة والحفظ المحلي.

> **حد الشريحة:** هذه ليست Arabic Engine كاملة أو Mathematics Engine كاملة. التحليل العربي والمعادلة الرياضية محددان deterministic ومقصودان لإثبات صحة المسار، ولا يوجد AI أو OCR أو حساب رمزي عام.

## الرحلتان

| المرحلة | العربية | الرياضيات |
| --- | --- | --- |
| Create | `SentenceObject` للجملة `قرأَ الطالبُ الكتابَ.` | `EquationObject` للمعادلة `2x + 3 = 11` |
| Transform | `GrammarLens` مع كلمات ونطاق مصدر | `MathVisualizationLens` مع خطوات ونقطة حل |
| Interact | اختيار كلمة وتصنيفها كفاعل | إدخال قيمة `x` |
| Assess | مقارنة deterministic مع `word_2` / `الطالبُ` | مقارنة deterministic مع `4` |
| Feedback | صحيحة، جزئية، غير صحيحة، تلميح وإعادة محاولة | صحيحة، جزئية، غير صحيحة، تلميح وإعادة محاولة |
| Save/restore | localStorage مع IDs وprovenance وحالة النشاط | localStorage مع IDs وprovenance وحالة النشاط |

## البنية المستخدمة

لا يملك Gate 4B model أو registry أو factory مستقلًا. المصدران يُنشآن عبر `createRegisteredEducationalObject` من `objectRegistry.ts`. الـlenses والأنشطة هي representations وworkflow records plain data في `gate4bTeaching.ts`؛ وهي لا تعيد تعريف `EducationalObject` ولا تستبدل `objectMigrations.ts` أو `coreBoard.ts`.

المحرك العام هو `assessActivity`. يستقبل Activity واحدة من أي مادة، ويعيد `Assessment` و`Feedback` بنفس contract. الاختلاف الموضوعي محصور في `acceptedAnswers` وقاعدة partial المحددة داخل تعريف الشريحة، وليس في assessment engine ثانٍ.

## الحالات التي يحفظها round-trip

يحفظ `serializeLesson` ويعيد `deserializeLesson` الآتي: `lessonId`، نوع ومحتوى وIDs المصدر، capabilities، lens ID، `sourceObjectId`، `sourceRange`، provenance، الإجابة، عدد المحاولات، assessment، feedback، والمرحلة المرئية. رفض payload غير صالح يعيد `null` ولا ينفذ أي محتوى مستورد.

## التشغيل

واجهة Home تعرض Universal workspace بمفتاحي مادة. في وضع المعلم تظهر لوحة الدليل وأزرار الحفظ والاستعادة والعدسة. في وضع العرض تختفي أدوات التحرير غير الضرورية، وتبقى العدسة والنشاط والتغذية الراجعة قابلين للقراءة. زر `Escape` يعيد أدوات المعلم.

## ما لم يُنفذ

لم تُنفذ التوسعات الكاملة مثل I3rab العام، morphology، spelling، rhetoric، algebra engine، geometry، AI، OCR، PDF intelligence، billing، collaboration، student accounts، أو remote persistence.
