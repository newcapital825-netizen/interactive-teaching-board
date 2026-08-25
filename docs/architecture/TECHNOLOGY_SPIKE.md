# Technology Spike — Gate 4A

## قاعدة الاختيار

لا تُختار مكتبة بسبب الشعبية وحدها. الاختيار النهائي يحتاج proof صغيرًا، benchmark قابلًا لإعادة الإنتاج، security review، accessibility review، وفحص license/maintenance. Gate 4A لا يضيف dependency.

## Canvas وGraph

| Candidate | الدور المحتمل | الترخيص/المخاطر | القرار المرحلي |
|---|---|---|---|
| tldraw SDK | universal canvas مرشح | الترخيص الافتراضي development؛ production يحتاج trial/commercial/hobby key [1] | لا اختيار قبل legal/commercial decision |
| Excalidraw | whiteboard/canvas مرشح | يحتاج فحص license وSSR وserialization وRTL/touch في spike | يبقى candidate من Gate 1B |
| React Flow | Graph Adapter وnode UI | موجه أساسًا للـnode-based UI؛ whiteboard features قد تتضمن Pro examples [2] | Graph Adapter candidate، ليس domain أو universal canvas |
| custom bounded stage | adapter الحالي | أقل dependency لكن feature cost أعلى | صالح للـMVP إلى حين proof |

## Math

| Candidate | قوة أساسية | حدود يجب اختبارها |
|---|---|---|
| MathLive | DOM mathfield للتحرير، events، virtual keyboard، read-aloud hooks [3] | DOM boundary، serialization، mobile، RTL، license/version policy |
| KaTeX | fast synchronous rendering، SSR، HTML/MathML output، MIT [4] | ليس editor ولا symbolic solver |
| MathJax | LaTeX/MathML/AsciiMath rendering [5] | bundle/performance، editing boundary، accessibility behavior |
| symbolic library | algebra/verification | correctness، licensing، units، multiple methods، browser/server boundary |

## Arabic NLP

| Candidate | fit مبدئي | ما لا يجوز ادعاؤه |
|---|---|---|
| CAMeL Tools | أدوات Arabic NLP، MIT، modular Python toolkit [6] | لا يثبت وحده صحة إعراب تعليمية |
| Stanza Arabic | multilingual linguistic pipeline | accuracy التعليمية وmodel/runtime/licensing تحتاج benchmark |
| PyArabic | normalization/Arabic text utilities candidate | ليس grammar/I3rab engine تلقائيًا |
| MADAMIRA-class tools | morphology/analysis research candidate | deployment، license، dialect/classical coverage، benchmark |

## PDF/OCR

PDF.js مناسب لحد parsing/rendering boundary، ويصدر Apache 2.0 للمشروع [7]. Tesseract.js مرشح OCR client-side لكنه لا يدعم PDF مباشرة حسب repository description [8]؛ لذلك لا نخلط PDF parsing مع OCR أو provenance.

## Evaluation matrix

كل candidate يقاس على integration surface، license، maintenance/release activity، community، bundle impact، deterministic performance، extensibility، React integration، SSR، mobile/touch، security، serialization، accessibility، وcost. النتيجة ليست score واحدًا؛ يتم توثيق veto conditions مثل production license أو عدم وجود source/evidence boundary.

## Recommended spikes before Gate 4B

أولًا spike لإثبات EquationObject round-trip بين source/editor/rendered MathML. ثانيًا Arabic golden dataset صغير يختبر tokenization/morphology/syntax مع teacher adjudication. ثالثًا canvas adapter comparison على RTL، 500 objects، grouping، persistence، export، keyboard، وtouch. رابعًا security spike للاستيراد والتطهير وprototype pollution.

## References

[1]: https://tldraw.dev/community/license "tldraw SDK License"
[2]: https://reactflow.dev/learn/advanced-use/whiteboard "React Flow Whiteboard Features"
[3]: https://mathlive.io/mathfield/api/ "MathLive Mathfield API"
[4]: https://katex.org/ "KaTeX official site"
[5]: https://docs.mathjax.org/ "MathJax documentation"
[6]: https://camel-tools.readthedocs.io/en/latest/overview.html "CAMeL Tools documentation"
[7]: https://mozilla.github.io/pdf.js/ "PDF.js official site"
[8]: https://github.com/naptha/tesseract.js/ "Tesseract.js repository"
