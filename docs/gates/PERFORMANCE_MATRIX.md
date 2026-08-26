# Gate 16 — مصفوفة الأداء

> **نطاق الدليل:** قياسات حقيقية من Chromium عبر Playwright، منفصلة عن قياسات Vitest/Node. لا تُعد هذه المصفوفة ميزانية إطلاق نهائية.

## Browser matrix

| حجم الوثيقة | Desktop Chromium | Mobile Chromium | الحالة | الملاحظات |
|---:|---:|---:|---|---|
| 10 | PASS | PASS | **PROVEN** | فتح fixture، تحديد، تحريك، تجميع/فك، حفظ، تصدير، واستعادة ضمن الاختبار |
| 100 | PASS | PASS | **PROVEN** | لا أخطاء page/console/request في afterEach |
| 250 | PASS | PASS | **PROVEN** | لا أخطاء page/console/request في afterEach |
| 500 | PASS | PASS | **PROVEN** | لا أخطاء page/console/request في afterEach |

شغّل الاختبار النهائي في 26 أغسطس 2026 على `tests/e2e/gate16-performance.spec.ts`. النتيجة: **20/20 اختبارًا ناجحًا**، وتشمل 10 اختبارات على كل مشروع متصفح. مسار fixture يعيد الاختبار إلى الصفحة الأولى بعد قياس إنشاء صفحة جديدة، حتى لا تُقاس صفحة فارغة بدل الوثيقة ذات الحجم المطلوب.

## قياسات Node/Vitest المساندة

| الحجم | إنشاء/تسلسل/استعادة/نسخ ضمن baseline | الحالة |
|---:|---|---|
| 100 | creation 0.662ms، selection 0.008ms، serialization 0.164ms، restoration 0.216ms، clone 0.454ms | **PROVEN** |
| 250 | creation 1.730ms، selection 0.251ms، serialization 0.707ms، restoration 0.458ms، clone 0.852ms | **PROVEN** |
| 500 | creation 1.422ms، selection 0.015ms، serialization 0.857ms، restoration 0.938ms، clone 8.473ms | **PROVEN** |

هذه أرقام بيئة Node وليست بديلًا عن زمن الرسم أو استجابة جهاز حقيقي. كما أن قيم Playwright التفصيلية لكل عملية محفوظة في مخرجات الاختبار، بينما الحكم القابل للتكرار هنا هو نجاح المصفوفة كاملة وعدم ظهور أخطاء متصفح.

## Bundle analysis

قبل التقسيم كانت حزمة JavaScript الرئيسية **831.77 kB** بعد minification، مع تحذير Vite لأكثر من 500 kB. أُضيف تقسيم محافظ في `vite.config.ts`: `vendor-react` بحجم 400.49 kB، و`vendor-ui` بحجم 105.53 kB، و`vendor-icons` بحجم 19.12 kB، وأصبحت الحزمة التطبيقية الرئيسية **305.98 kB**. استمر البناء دون فشل، ولم تُضف مكتبات أو architecture جديدة.

## حدود الدليل

لا توجد هنا ميزانية معتمدة لزمن التفاعل، ولا قياس موثوق لـ`performance.memory` في Chromium المستخدم؛ لذلك تبقى ذاكرة heap، touch hardware، stylus، screen reader، واختبار browser performance على جهاز فعلي **NOT VERIFIED**. محاكاة mobile Chromium تثبت responsive browser path فقط، ولا تثبت لمسًا فعليًا.

## Classification

**Gate 16 performance evidence: PROVEN for the bounded Playwright matrix and Node baselines; NOT VERIFIED for real-device budgets.**
