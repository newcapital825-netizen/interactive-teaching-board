# Gate 4A Report — Arabic + Mathematics Teaching Engines

## الحالة

**GATE 4A = READY FOR OWNER REVIEW.** هذه الجولة Discovery + Architecture فقط. لم تتم كتابة production Arabic Engine أو Math Engine أو AI أو OCR أو Billing أو Collaboration، ولم تُضف dependencies أو providers.

## Scope and objectives

الهدف هو تحويل Universal Whiteboard إلى Universal Teacher Workspace مع تخصص عميق للعربية والرياضيات، مع إبقاء Core Board subject-agnostic. Arabic وMathematics subject engines تنتج EducationalObjects canonical، وتستخدم Interaction وAssessment وFeedback primitives المشتركة.

## Architectural truth

```text
Universal Whiteboard
  → EducationalObject
  → Registry / Factory / Capabilities
  → Migration / Versioning
  → Transformations / Lenses
  → Interaction / Assessment / Feedback
  → Canvas Adapter / Graph Adapter / Math Renderer
  → Arabic Engine or Mathematics Engine
```

لا Canvas ولا Graph هو domain. ولا يملك Arabic أو Math نموذجًا ثانيًا. الـCore يرى objects وقدراتها فقط، والـsubject engine يملك recipes وlenses وvalidators وactivities.

## Object model

EducationalObject يحفظ identity وschemaVersion وcontent/data وposition/dimensions/style وz-order وcapabilities وsource/evidence وversion وteacher review. Specialized objects مثل WordObject وGrammarObject وI3rabObject وEquationObject وFunctionObject وGeometryObject هي specializations أو representations، لا نماذج مستقلة.

## Subject models

Arabic model يغطي القراءة والنحو والإعراب والصرف والإملاء والبلاغة والأدب والهوية الثقافية. Math model يميز Expression وEquation وInequality وFunction وGraph وGeometry وMeasurement وProblem، ويدعم solution chain متعدد الخطوات والطرق البديلة والتصورات المرتبطة بالمصدر.

## Transformation model

التحويلات تحفظ source، evidence، identity، version، وteacher approval. أمثلة العربية: Sentence → Grammar Analysis/I3rab Tree، Word → Morphology، Text → Vocabulary/Reading Activity. أمثلة الرياضيات: Equation → Table/Graph/Solution Steps، Geometry → Measurement، Problem → Representation → Steps → Verification.

## Interaction model

Interaction Engine مشترك يغطي click/select/multi-select/drag/drop/resize/rotate/draw/connect/sort/match/classify/highlight/annotate/reveal/hide/fill/construct/manipulate/sequence/solve/compare/transform. كل command يمر عبر capabilities ويحفظ before/after ويعلن بديل keyboard حيث يلزم.

## Assessment model

Assessment primitives تشمل MCQ وmulti-select وtrue/false وmatching وordering وclassification وfill blank وshort answer وconstructed response وstep-based solution وdrawing/equation response وtext annotation. دورة الحياة هي attempt → evaluation → feedback → retry → mastery evidence، مع rubric/version/evidence وteacher override.

## Feedback model

Feedback ليس Correct/Incorrect فقط، بل correct وpartially correct وincorrect وhint وmisconception وmissing step وalternative method وretry وexplanation وteacher feedback. Deterministic feedback أولًا، وAI لاحقًا كمقترح خاضع للتحقق والمراجعة.

## Technology evaluation

MathLive مرشح لتحرير المعادلات بحد DOM/event/virtual-keyboard، وKaTeX مرشح لتصيير سريع وSSR وHTML/MathML، وMathJax مرشح لتصيير LaTeX/MathML/AsciiMath. React Flow يبقى Graph Adapter candidate، وtldraw يحمل قيد production license key، وPDF.js parsing/rendering boundary. CAMeL Tools وStanza وPyArabic مرشحون لأدوار Arabic NLP مختلفة، ولا يثبت أي منهم صحة إعراب تعليمية دون golden dataset.

## Risks

المخاطر الرئيسية هي correctness عربية/رياضية غير مثبتة، license أو bundle cost، تضارب DOM/canvas accessibility، state corruption عند transformations، provenance loss، privacy leakage، AI hallucination، mobile/stylus gaps، وخلط OCR/PDF مع source truth. لكل خطر owner وspike وexit criterion في الوثائق المعمارية.

## Security and privacy

يجب منع unsafe HTML/SVG وprototype pollution وarbitrary script execution وunsafe serialization وinsecure file import وuntrusted remote execution. imported objects تمر validation. بيانات المعلم والطالب والدروس والملفات والمحاولات والتحليلات لها boundaries وretention وdelete/export policies، مع عدم جمع بيانات طالب غير لازمة.

## Accessibility and platform assumptions

التصميم يشمل keyboard navigation، screen readers، contrast، focus، reduced motion، touch targets، stylus/pointer، RTL، Arabic typography، وMath notation accessibility. Touch وStylus وUI automation وfull accessibility audit وreal browser performance غير متحققة في هذه الجولة ولا تُعد نجاحًا.

## Performance assumptions

الـbenchmark الحالي Node/Vitest engineering baseline فقط. قبل الاختيار النهائي يجب قياس browser frames، input latency، memory، serialization، render cost، وlarge-object behavior على 100/250/500 objects، مع mobile/tablet/interactive-display scenarios.

## MVP recommendations

MVP لاحقًا: Text/Sentence/Word وEquation/Expression/Graph/Problem objects، Grammar/I3rab وMath solution lenses محدودة، deterministic validators، Question/Activity primitives، teacher review، local-first save، Arabic RTL، MathML/text accessibility، وCanvas/Graph adapters قابلة للتبديل.

## Non-MVP recommendations

تؤجل AI، OCR، PDF-to-lesson، collaboration، student accounts، billing، advanced analytics، handwriting recognition، marketplace، cultural map production data، full morphology/diacritization، symbolic solver واسع، وreal-time multiplayer.

## Open decisions

اختيار Canvas engine، MathLive/KaTeX/MathJax، symbolic library، Arabic NLP stack، PDF/OCR stack، persistence/cloud boundary، student identity، rubric/scoring policy، وlicense/commercial model ما زال مفتوحًا.

## Deferred decisions

لا قرار الآن حول automatic I3rab correctness، one true mathematical method، AI provider، production data retention، enterprise tenancy، أو publication automation.

## Gate 4B proposal

Gate 4B المقترح هو implementation بعد موافقة المالك، ويبدأ فقط بعد golden datasets وtechnology spikes وsecurity/accessibility review وlicense decision وacceptance criteria. يجب أن ينفذ أولًا minimal Arabic/Math vertical slice فوق canonical objects، ثم يثبت round-trip وprovenance وteacher review قبل توسيع النطاق.

## Architectural hygiene

أزيل `client/src/components/GeneralWhiteboardBench.tsx` بعد التحقق من عدم وجود references له، لأنه evidence-only legacy component ويحتوي local EducationalObject model. بقي `educationalObjects.ts` هو التعريف canonical الوحيد، وCoreObject projection موثق في Gate 3B.

## References

[1]: https://mathlive.io/mathfield/api/ "MathLive Mathfield API"
[2]: https://katex.org/ "KaTeX official site"
[3]: https://docs.mathjax.org/ "MathJax documentation"
[4]: https://camel-tools.readthedocs.io/en/latest/overview.html "CAMeL Tools documentation"
[5]: https://reactflow.dev/learn/advanced-use/whiteboard "React Flow Whiteboard Features"
[6]: https://tldraw.dev/community/license "tldraw SDK License"
[7]: https://mozilla.github.io/pdf.js/ "PDF.js official site"
[8]: https://github.com/naptha/tesseract.js/ "Tesseract.js repository"
