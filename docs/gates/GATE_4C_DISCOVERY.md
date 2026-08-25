# Gate 4C Discovery

## Status

**DISCOVERY ONLY — NO GATE 4C IMPLEMENTATION STARTED**.

هذه الجولة لا تنشئ implementation branch، ولا تعدّل `main`، ولا تفتح Pull Request، ولا تنفذ merge. المصدر البرمجي الحالي هو الفرع `feature/gate-4b-final-hardening` عند `8875910b91d4d1aaa5de9e47c90c136a3ebdfe27`. وُجد تعديل محلي مقصود في `todo.md` فقط لتسجيل التفويض الحالي؛ لا يُعامل ذلك كـclean working tree.

## Repository and architecture audit

| البند | الحالة | الدليل |
| --- | --- | --- |
| GitHub repository | PROVEN | `github` remote يشير إلى `newcapital825-netizen/interactive-teaching-board` |
| Gate 4B Final Hardening | PROVEN | التقرير والفرع والـHEAD موجودة |
| Gate 4B clean clone | PROVEN | سجل التقرير يثبت install/check/test/build/diff-check |
| Main preservation | PARTIALLY PROVEN | GitHub `main` معروف ولم يُعدّل في هذه الجولة؛ يلزم إعادة تحقق قبل أي implementation لاحق |
| Canonical EducationalObject | PROVEN | `client/src/lib/educationalObjects.ts` |
| Registry/factory | PROVEN | `client/src/lib/objectRegistry.ts` وregistry tests |
| Shared assessment/feedback | PROVEN | `gate4bTeaching.ts` وGate 4B tests |
| Arabic engine breadth | NOT PROVEN | الموجود Grammar Lens deterministic محدود |
| Math engine breadth | NOT PROVEN | الموجود Equation/Math Visualization Lens محدود |
| Browser lifecycle | NOT VERIFIED | لا يوجد browser runner تفاعلي |
| Touch/stylus | NOT VERIFIED | hardware غير متوفر |
| Full WCAG audit | NOT VERIFIED | توجد static/visual checks فقط |

## What Gate 4B actually proves

ثبت Gate 4B مصدرًا عربيًا واحدًا هو جملة deterministic، وGrammar Lens مشتقة مرتبطة بـsource ID وrange وversion، ونشاط classify وتقييمًا للحالات الخمس وfeedback state-specific. وثبت أيضًا مصدرًا رياضيًا واحدًا هو معادلة `2x + 3 = 11`، وMath Visualization Lens بخطوتين تمثيليتين، ونشاط solve يقبل الإجابة المباشرة والصيغة البديلة `x = 4` ويشخص خطوة جزئية.

ثبت hardening حفظ واستعادة lesson، migration من schema v1 إلى v2، provenance، teacher override كحدث مستقل، canonical board migration، duplicate/delete/undo/redo semantics، وNode benchmarks عند 100/250/500 objects. هذه أدلة domain وserialization، وليست دليلًا على تغطية اللغة العربية أو الرياضيات العامة أو أداء متصفح أو جهاز حقيقي.

## What is not proven

لم تثبت الجولة الحالية full Arabic NLP، automatic I3rab correctness، morphology، reading comprehension، writing، rhetoric، literature، ولا golden dataset خارجي. ولم تثبت symbolic algebra solver عامًا، equation parser، step validator عام، functions، geometry، data، statistics، أو graph engine. كما لم تثبت دورة المتصفح التفاعلية الكاملة ولا teacher validation الواقعي ولا licensing review لمكتبات مستقبلية.

## Discovery questions and answers

| السؤال | الإجابة الحالية |
| --- | --- |
| ما الذي ثبت فعليًا؟ | canonical objects، lenses المحدودة، activities، assessment/feedback، provenance، save/restore، migration، teacher override mechanics، وbenchmarks Node فقط |
| ما الذي لم يثبت؟ | اتساع المحركات، browser lifecycle، hardware، WCAG الكامل، teacher acceptance، golden accuracy خارج fixtures |
| ما الفجوة بين slice والمنتج الحقيقي؟ | الانتقال من fixture واحد لكل مادة إلى domain coverage واسع مع datasets، validators، authoring، review، وcontent lifecycle |
| الحد الأدنى المفيد للعربية؟ | sentence entry، word selection، Grammar/I3rab guided steps، teacher review، activity conversion، deterministic rubric محدود، provenance، وإعادة الاستخدام |
| الحد الأدنى المفيد للرياضيات؟ | equation entry، representation، step chain صغير، step validation موثق، alternative methods، activity conversion، feedback، provenance |
| ما الذي يبقى في Core؟ | EducationalObject، registry، factory، capabilities، persistence، migration، adapters، transformations protocol، interaction primitives، assessment/feedback contracts، provenance/events |
| ما الذي يبقى في Arabic Engine؟ | linguistic lenses، token/range structures، Grammar/I3rab/Morphology/Reading validators، Arabic datasets، وArabic pedagogy |
| ما الذي يبقى في Math Engine؟ | expression/equation/step representations، domain validators، solution alternatives، visual transforms، وMath datasets |
| ما الذي يحتاج Golden Dataset؟ | كل claim لغوي أو رياضي: expected interpretation، accepted alternatives، incorrect cases، explanation، source، version |
| ما الذي يحتاج browser testing؟ | complete author-to-present workflow، keyboard/focus، save/reload، presentation، lens regeneration، responsive interactions |
| ما الذي يحتاج hardware testing؟ | touch، pinch، drag، resize، stylus، palm rejection، handwriting إن دخلت النطاق |
| ما الذي يحتاج teacher validation؟ | usefulness، wording، feedback، accepted alternatives، density، authoring speed، وpublish/review decision |
| ما الذي يجب تأجيله؟ | AI، OCR، collaboration، accounts، billing، cloud persistence، broad NLP، general solver، plugin runtime |
| الخطر المعماري؟ | duplicate subject core، coupling Core إلى rules، provenance loss، unsafe migration، أو silent fallback |
| الخطر التربوي؟ | ادعاء صحة لغوية/رياضية غير مثبتة، feedback مضلل، أو اعتبار alternative method خطأ |
| الخطر على الأداء؟ | bundle growth، lens regeneration مع datasets كبيرة، autosave أو rendering متكرر، وعدم وجود browser baseline |
| الخطر على accessibility؟ | canvas-only interactions، mixed RTL/LTR، focus order، announcements، contrast، وعدم وجود AT audit |
| الخطر على الخصوصية؟ | لاحقًا: student responses، teacher notes، cloud persistence، sharing، وtelemetry؛ لا شيء منها يُبنى الآن |

## Proposed bounded sequence after Owner Review

لا يُنفذ أي عنصر من القائمة في هذه الجولة. بعد اعتماد Discovery فقط، يكون التسلسل المنطقي: Arabic Grammar/I3rab slice، Mathematics step-by-step algebra slice، Teacher Activity Builder، Assessment/Feedback review، ثم Save/Restore/Provenance expansion. كل slice يجب أن يمر عبر Architecture → Implementation → Verification → Review → Approval قبل الدمج.

## Stop conditions found or monitored

حتى الآن لم يظهر duplicate canonical model أو registry duplication أو production change. توجد فقط فجوة ملاحظة: `main` المحلي في سجل المشروع التاريخي لا يطابق بالضرورة ref GitHub الحالي؛ لذلك يجب استخدام GitHub ref كمرجع قبل أي فرع لاحق. لا يجوز تحويل ذلك إلى merge أو إصلاح تلقائي في Discovery.

## Decision

**Gate 4C Discovery = READY FOR OWNER REVIEW**. القرار لا يفتح implementation. الخطوة التالية المسموح بها هي مراجعة المالك لهذه الوثيقة ووثائق gap analysis وroadmaps والاستراتيجية المرفقة، ثم تفويض مستقل وصريح إذا أراد فتح Gate 4C Implementation.

## References

1. [Gate 4B Final Hardening](./GATE_4B_FINAL_HARDENING.md)
2. [Subject Engine Architecture](../architecture/SUBJECT_ENGINE_ARCHITECTURE.md)
3. [Arabic Teaching Model](../architecture/ARABIC_TEACHING_MODEL.md)
4. [Mathematics Teaching Model](../architecture/MATHEMATICS_TEACHING_MODEL.md)
5. [Repository](https://github.com/newcapital825-netizen/interactive-teaching-board)
