# Release Candidate Checklist — مِداد

| المحور | الحالة | الدليل والحدود |
|---|---|---|
| Product UX | PARTIALLY PROVEN | تم تعريب المصطلحات الظاهرة وتحسين رسائل الحفظ والنقل؛ لا Human Validation |
| Teacher flow | PARTIALLY PROVEN | المسار مثبت آليًا؛ الوضوح والاستقلالية البشرية NOT VERIFIED |
| Student flow | PARTIALLY PROVEN | المعاينة والإجابة والتغذية الراجعة مثبتة آليًا؛ فهم الطالب NOT VERIFIED |
| Arabic | PROVEN bounded | الحالات العربية المثبتة فقط، وخارجها مراجعة المعلم |
| Mathematics | PROVEN bounded | fixtures وخطوات محددة فقط، وليس محركًا رمزيًا عامًا |
| Save/Restore | PROVEN bounded | local-first، round-trip واختبارات الاستعادة |
| Export/Import | PROVEN bounded | حماية payload وIDs والإصدارات ضمن النطاق المثبت |
| Accessibility | PARTIALLY PROVEN | keyboard وfocus وRTL smoke؛ Touch/Stylus/Screen Reader/Full WCAG NOT VERIFIED |
| Browser QA | PROVEN bounded | Playwright 20/20 على Desktop وMobile Chromium |
| Performance | PARTIALLY PROVEN | قياسات Gate 16 وbundle split؛ لا budget رسمي ولا real-device proof |
| Security | PROVEN bounded | dangerous keys وmalformed وduplicate IDs وunsafe import محمية في الاختبارات |
| Data integrity | PROVEN bounded | حفظ/استعادة ونقل bounded؛ لا cloud أو multi-user |
| Known limitations | PROVEN documented | موثقة في `docs/pilot/KNOWN_LIMITATIONS.md` |
| Human validation | NOT VERIFIED | لا توجد جلسات بشرية في هذا الإصدار |

## Decision

**OVERALL: PILOT CANDIDATE — NOT PILOT READY.** لا يجوز إعلان `RELEASE READY` دون Human Validation حقيقية، ولا يجوز استخدام بيانات صف حقيقية مع الحفظ المحلي الحالي.
