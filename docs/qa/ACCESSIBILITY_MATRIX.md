# Gate 14 — Accessibility Acceptance Matrix

هذه المصفوفة تخص قابلية الاستخدام الدلالية ومسارات الإدخال في منتج «مِداد». لا تمثل شهادة WCAG ولا بديلًا عن اختبار مستخدم حقيقي أو screen reader فعلي.

| المجال | الحالة | دليل هندسي | حدود الدليل |
|---|---|---|---|
| بنية RTL والعناوين | **PARTIALLY PROVEN** | `dir="rtl"`، headings، sections وlandmarks في المسارات الرئيسية. | يحتاج تدقيقًا بصريًا وscreen reader كاملًا. |
| الأزرار والنماذج | **PROVEN structurally** | أزرار ذات labels، labels للحقول، select وtextarea دلالية. | لم يُنفذ audit آلي شامل لكل DOM. |
| تحديد Canvas بلوحة المفاتيح | **PROVEN structurally** | عناصر Canvas قابلة للتركيز، `aria-pressed`، Enter/Space للتحديد، وEscape للإلغاء. | لا يثبت تجربة مستخدم assistive technology. |
| تغيير الحجم البديل | **PROVEN structurally** | أزرار Inspector لزيادة/تقليل العرض والارتفاع. | مقابض pointer نفسها ليست بديلًا دلاليًا. |
| تحريك وطبقات وتكرار وحذف | **PARTIALLY PROVEN** | أزرار Inspector وcontext strip، واختبارات keyboard command. | يلزم تشغيل كل المسارات يدويًا/آليًا في browser. |
| الحالة والتغذية الراجعة | **PROVEN structurally** | `role="status"` و`aria-live="polite"` في notice وfeedback. | لا يثبت ترتيب القراءة في screen reader. |
| التركيز المرئي | **PROVEN structurally** | `:focus-visible` موحد لعناصر الإدخال والأزرار والأدوار. | لم يُقَس contrast آليًا. |
| Escape وtext editing | **PROVEN for command contract** | أوامر اللوحة تتجاهل input/textarea/select وcontenteditable. | browser E2E ما زال ضمن Gate 15. |
| Reduced motion | **PROVEN structurally** | media query تقلل animation/transition وتلغي smooth scrolling. | لم يُختبر تفضيل OS فعليًا. |
| Screen reader | **NOT VERIFIED** | لم تتوفر قارئة شاشة فعلية. | يلزم اختبار NVDA/VoiceOver/TalkBack مناسب. |
| Touch/Stylus | **NOT VERIFIED** | لا hardware. | Gate 15/owner device testing. |
| Contrast | **PARTIALLY PROVEN** | ألوان paper-and-olive ونصوص واضحة بصريًا في smoke. | يلزم قياس آلي وmanual contrast audit. |
| Dialog/focus restoration | **NOT VERIFIED** | لا modal workflow حرج في هذه الشريحة. | يلزم audit عند إضافة modal أو file picker automation. |

## Gate 14 classification

الطبقة الدلالية ومسارات keyboard الأساسية **PARTIALLY PROVEN إلى PROVEN structurally**. تظل قابلية الاستخدام الفعلية مع screen reader، touch، stylus، وhuman validation **NOT VERIFIED**.
