# Math Visualization Model

## المبدأ

التصور representation مشتق من Math EducationalObject واحد. لا تنتج Equation وGraph وTable مصادر مستقلة؛ تتشارك `sourceObjectId` و`sourceVersion` وتعلن `transformId` وassumptions وunits.

## العلاقات

| المصدر | التمثيلات |
|---|---|
| Equation | symbolic form، balance view، table، graph |
| Function | rule، domain، table، interactive graph |
| Geometry | construction، measurements، constraints |
| Expression | AST/algebraic structure، simplified form |
| MathProblem | givens، representation، steps، verification |

## Interactive state

النقاط القابلة للسحب والـsliders وخط الأعداد وalgebra tiles حالات تفاعل، لا تعديلات صامتة على المصدر. كل commit يحفظ before/after، constraints، units، وhistory. invalid states تعرض سببًا مفهومًا بدل serialization فاسد.

## Accessibility

يجب توفير representation نصية أو MathML، أسماء للمحاور والنقاط، keyboard alternatives، focus order، وقراءة خطوة الحل. لا تدّعي WCAG أو math notation accessibility قبل اختبار فعلي.

## Gate 4A

لا يتم تنفيذ renderer أو graph plotter. MathLive وKaTeX وMathJax مرشحون بحدود مختلفة، ويُحسم الاختيار بعد spike وbenchmarks.

## References

[1]: https://mathlive.io/mathfield/api/ "MathLive Mathfield API"
[2]: https://katex.org/ "KaTeX official site"
[3]: https://docs.mathjax.org/ "MathJax documentation"
