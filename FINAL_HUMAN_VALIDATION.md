# Midad — Final Human Validation Package

**Product:** مِداد — السبورة العربية الذكية  
**Branch:** `feature/productization-v1`  
**Automated validation status:** PROVEN for the bounded productization slice  
**Human validation status:** NOT VERIFIED  
**Decision:** **PILOT CANDIDATE — HUMAN VALIDATION REQUIRED**

## Purpose

هذه الوثيقة هي حزمة التسليم للاستخدام البشري المنضبط. لا تُسجل جلسة أو نتيجة لم تحدث، ولا تحول نجاح الاختبارات الآلية إلى دليل على سهولة الاستخدام لدى المعلمين أو الطلاب.

## Required sample

ينبغي تنفيذ جلسات مستقلة مع **3 معلمين حقيقيين** و**5 طلاب حقيقيين** باستخدام معرفات مجهولة مثل Teacher-01 وStudent-01. لا تُجمع أسماء أو أرقام هواتف أو عناوين بريد أو أي بيانات شخصية غير ضرورية.

## Teacher acceptance journey

لكل معلم، يُطلب فتح المنتج وإنشاء درس، كتابة عنوانه واختيار المادة والفئة/المرحلة والمستوى، إدخال جملة عربية، استخدام التحليل والإعراب والشرح، تحويل المصدر إلى نشاط، فتح معاينة الطالب، مراجعة إجابة الطالب التجريبية، تجربة Teacher Override، حفظ الدرس وإعادة تحميله، ثم فتح وضع العرض. عند صلة المهمة بالرياضيات، تُكرر الرحلة بإدخال معادلة، خطوات الحل، التحقق، النشاط، المعاينة والحفظ والاستعادة. عند صلة المهمة بالشعر، يُختبر التحليل الأدبي/البلاغي المحدود فقط، ويُسجل بوضوح أن الوزن غير متحقق حيث لا يوجد دليل.

| Teacher ID | Completed | Assistance Required | Confusion Point | Failure | Time/effort impression | User Comment |
|---|---|---|---|---|---|---|
| Teacher-01 | NOT VERIFIED | — | — | — | — | — |
| Teacher-02 | NOT VERIFIED | — | — | — | — | — |
| Teacher-03 | NOT VERIFIED | — | — | — | — | — |

## Student acceptance journey

لكل طالب، يُطلب فتح النشاط، قراءة التعليمات دون قيادة مسبقة، إدخال الإجابة، إرسالها، قراءة التغذية الراجعة، ثم إعادة المحاولة. يجب تسجيل ما إذا كان الطالب احتاج مساعدة، وأين توقف أو التبس عليه المسار، دون حفظ محتوى شخصي غير لازم.

| Student ID | Completed | Assistance Required | Confusion Point | Failure | User Comment |
|---|---|---|---|---|---|
| Student-01 | NOT VERIFIED | — | — | — | — |
| Student-02 | NOT VERIFIED | — | — | — | — |
| Student-03 | NOT VERIFIED | — | — | — | — |
| Student-04 | NOT VERIFIED | — | — | — | — |
| Student-05 | NOT VERIFIED | — | — | — | — |

## Issue classification

بعد جمع الملاحظات، تُصنف كل مشكلة إلى BLOCKER أو HIGH أو MEDIUM أو LOW أو COSMETIC. لا يُصلح المنتج تلقائيًا بناءً على انطباع واحد؛ تُجمع الملاحظات أولًا، ثم تُراجع المشكلات المتكررة والحرجة.

| Classification | Observed problems |
|---|---|
| BLOCKER | NOT VERIFIED |
| HIGH | NOT VERIFIED |
| MEDIUM | NOT VERIFIED |
| LOW | NOT VERIFIED |
| COSMETIC | NOT VERIFIED |

## Technical evidence already available

النسخة الحالية لديها دليل آلي على 26 ملف اختبار Vitest و131 اختبارًا ناجحًا، و36 اختبار Playwright ناجحًا (18 سطح مكتب و18 محمول)، ونجاح TypeScript check وproduction build و`git diff --check`. كما تم التحقق بصريًا من RTL والتخطيط على 1280×720 و390×844. هذه الأدلة لا تثبت الجلسات البشرية، ولا اللمس الحقيقي أو القلم أو قارئ الشاشة أو أداء جهاز واقعي.

## Unverified areas

Human Validation، سهولة الاستخدام الواقعية، Touch، Stylus، Full Screen Reader/WCAG، Real Browser Performance، اعتماد المنهج الرسمي، وحل تعارض المصادر الحية كلها **NOT VERIFIED** أو **PARTIALLY PROVEN** بحسب بندها. لا يجوز إصدار **PILOT READY** قبل اكتمال الجلسات البشرية وعدم ظهور مشكلة حرجة متكررة.

## Final acceptance rule

إذا لم تُنفذ الجلسات الفعلية، يبقى القرار: **PILOT CANDIDATE — HUMAN VALIDATION REQUIRED**. ولا تُستخدم عبارة RELEASE READY.
