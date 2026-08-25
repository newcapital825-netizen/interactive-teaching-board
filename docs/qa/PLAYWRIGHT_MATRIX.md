# Gate 15 — Playwright Classroom QA Matrix

## نطاق المصفوفة

هذه المصفوفة توثق اختبار Chromium حقيقي قابل لإعادة التشغيل فوق المسار canonical في «مِداد». استخدمت الاختبارات locators دلالية أولًا، ثم `data-testid` ثابتة فقط حيث توجد عناصر متكررة أو لا يوجد اسم دلالي كافٍ. لم تُعامل اختبارات Vitest أو فحص DOM وحده كدليل Browser E2E.

| Journey | المسار المثبت | Development | Production | Viewports | Evidence |
|---|---|---:|---:|---|---|
| A | إنشاء درس، إضافة SentenceObject وEquationObject، تحويل المصدر إلى Activity، حفظ الدرس | PROVEN | PROVEN | Desktop Chrome + Pixel 5 | 2/2 passed |
| B | تحديد مباشر، multi-select، تجميع/فك، تحريك، undo/redo | PROVEN | PROVEN | Desktop Chrome + Pixel 5 | 2/2 passed |
| C–F | Arabic Activity: تجهيز، فتح للطالب، إرسال محاولة، تقييم deterministic، مراجعة، Teacher Override | PROVEN | PROVEN | Desktop Chrome + Pixel 5 | 2/2 passed |
| D/G/H/I/J/K | Mathematics Activity، answer `x = 4`، Math steps، save/reload، export/import، presentation | PROVEN | PROVEN | Desktop Chrome + Pixel 5 | 2/2 passed |
| J | Keyboard selection، Escape، وتحرير النص مع عزل ArrowLeft داخل editor | PROVEN | PROVEN | Desktop Chrome + Pixel 5 | 2/2 passed |

## إعداد التشغيل

| البند | القيمة |
|---|---|
| Test runner | `@playwright/test` 1.62.1 |
| Browser | Chromium project، Chrome for Testing 151.0.7922.34 |
| Desktop viewport | Playwright `Desktop Chrome` |
| Mobile viewport | Playwright `Pixel 5` emulation |
| Development target | `http://127.0.0.1:3000` |
| Production target | `http://127.0.0.1:4173` بعد `pnpm build` و`NODE_ENV=production` |
| Workers | 1، لتثبيت local-first state ونتائج قابلة للتكرار |
| Failure artifacts | screenshot/video/trace retain-on-failure؛ لم تُنتج failures في الجولة النهائية |

## حدود الدليل

الـPixel 5 هنا **محاكاة متصفح** وليست touch hardware؛ لذلك يبقى Touch hardware وStylus **NOT VERIFIED — HARDWARE UNAVAILABLE**. كما أن Screen Reader وUI automation خارج Playwright وhuman classroom validation وbrowser performance benchmarking تبقى **NOT VERIFIED**. أما 404 الخاص بـ`manus-analytics.com/umami` و`/__manus__/logs` فهو harness/telemetry خارجي معروف، مع بقاء أي response 4xx/5xx آخر فشلًا صريحًا في الاختبار.
