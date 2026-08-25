# Gate 13 — Browser QA Test Matrix

## الهدف

تثبت هذه المصفوفة أن Universal Teacher Workspace يعمل داخل متصفح حقيقي، مع فصل واضح بين ما تم تنفيذه فعليًا وما يحتاج runner أو hardware غير متاح. كل حالة تبدأ من درس محلي جديد وتستخدم RTL وواجهة عربية.

| ID | المسار | الإجراء القابل للتنفيذ | نتيجة النجاح | الحالة الحالية |
|---|---|---|---|---|
| B01 | Load | فتح `/` | يظهر عنوان مساحة إعداد الدرس وأدوات المعلم | **PROVEN — browser smoke** |
| B02 | Lesson metadata | فحص/تعديل title, subject, grade, objective | الحقول قابلة للعرض والتحرير وتصبح الحالة غير محفوظة | **PARTIALLY PROVEN** |
| B03 | Page | إضافة/نسخ/إعادة تسمية صفحة | يتغير عداد الصفحات وتبقى الصفحة الحالية محددة | **PROVEN by existing contract; browser pending** |
| B04 | Objects | إضافة نص، جملة، معادلة، شكل | يظهر العنصر في الصفحة ويُحفظ نوعه | **PROVEN — browser smoke for Sentence/Equation** |
| B05 | Selection | تحديد عنصر Canvas ثم Escape | تظهر أدوات العنصر ثم تزول عند Escape | **PARTIALLY PROVEN — browser selection smoke** |
| B06 | Manipulation | drag, move controls, resize handles | تتغير الهندسة دون فقد ID أو metadata | **PROVEN by contract; real pointer drag pending** |
| B07 | Multi-select | Shift/Ctrl selection ثم group | تظهر مجموعة canonical وتبقى الروابط | **PROVEN by contract; browser pending** |
| B08 | Text/equation edit | تعديل content input | يتغير المصدر canonical وتظهر unsaved state | **PROVEN by contract; browser pending** |
| B09 | Contextual action | اختيار Sentence/Equation ثم action bar → create activity | تُنشأ Activity مرتبطة بـsourceObjectId | **PROVEN by contract; browser pending** |
| B10 | Student preview | الضغط على «معاينة الطالب» | يظهر المحتوى دون أدوات تحرير وزر العودة | **PROVEN — browser smoke** |
| B11 | Student attempt | فتح Activity نشطة وإرسال إجابة | يُنشأ Attempt وتظهر النتيجة | **PROVEN by contract; browser pending** |
| B12 | Assessment/feedback | تقييم Attempt ومراجعة feedback | يظهر diagnostic وfeedback deterministic | **PROVEN by contract; browser pending** |
| B13 | Teacher override | فتح review ثم تسجيل قرار المعلم | يحفظ القرار منفصلًا مع السبب والتوقيت وprovenance | **PROVEN by contract; browser pending** |
| B14 | Retry | بدء retry بعد review | Attempt جديد مع إبقاء السابق | **PROVEN by contract; browser pending** |
| B15 | Save/restore | حفظ ثم استعادة الدرس | تعود الصفحة والعناصر وclassroom state | **PROVEN by contract; browser pending** |
| B16 | Export/import | تصدير ثم استيراد envelope | يعود payload canonical أو يُرفض fail-closed | **PROVEN by contract; file picker pending** |
| B17 | Presentation | فتح عرض الدرس والعودة | يظهر العرض المبسط دون أدوات التحرير | **PROVEN by contract; browser pending** |
| B18 | Production build | `pnpm build` ثم serve `dist` | يعمل نفس smoke path من production server | **NOT VERIFIED — production server follow-up** |

## Browser Environment

تم استخدام متصفح حقيقي متصل بصفحة المعاينة الحالية. لم يتوفر Playwright/Cypress runner داخل المشروع، لذلك لا تُسجل الحالات غير المنفذة كنجاح. Touch وStylus وScreen Reader وreal-browser performance لها مصفوفات مستقلة في Gates اللاحقة.

## Acceptance Rule

لا تنتقل حالة `PARTIALLY PROVEN` أو `NOT VERIFIED` إلى `PROVEN` إلا بعد تنفيذ الخطوة في متصفح حقيقي أو runner موثق، مع الاحتفاظ بلقطة أو سجل واضح. لا تُعتبر هذه المصفوفة ادعاءً بأن المنتج Release Ready.
