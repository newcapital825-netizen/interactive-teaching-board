# Math Object Map

## قاعدة الخريطة

كل Math Object هو EducationalObject متخصص أو representation مشتق. لا يمتلك Math Engine نموذجًا ثانيًا؛ يحتفظ المصدر بالهوية والإصدار والدليل والموافقة، بينما تعديلات العرض والتحليل تمر عبر capabilities وtransformations canonical.

| Object | المحتوى | capabilities | representations/relations |
|---|---|---|---|
| EquationObject | lhs، rhs، variables، assumptions | edit, transform, solve, assess | table، graph، solution steps |
| ExpressionObject | AST أو symbolic expression source | edit, simplify, compare | algebraic structure |
| FunctionObject | rule، domain، codomain، units | edit, plot, transform | graph، table، points |
| GraphObject | axes، series، points، annotations | select, edit, inspect | Function/Equation view |
| GeometryObject | construction، constraints، measurements | construct, manipulate, measure | geometry ↔ measurement |
| PointObject | coordinates، labels، constraints | drag, edit, measure | coordinate plane |
| LineObject | endpoints أو equation | construct, transform, measure | geometry/graph |
| AngleObject | rays، measure، orientation | construct, measure, annotate | geometry |
| ShapeObject | visual shape وstyle | move, resize, rotate | geometry projection |
| NumberLineObject | interval، ticks، markers | construct, drag, compare | inequality/measurement |
| MatrixObject | rows، columns، entries | edit, transform, assess | operations |
| MathProblemObject | prompt، givens، target، rubric | edit, interact, assess | solution chain |
| SolutionStepObject | operation، input/output، justification | reveal, annotate, assess | problem → final answer |
| MathActivityObject | prompt، response schema، rubric | interact, assess, retry | any math source |

## Solution and verification

يحفظ `MathProblemObject` سلسلة SolutionStepObjects وروابطها بالمصدر. يقبل validator أكثر من method إذا صرحت rubric بذلك، ويميز answer equivalence عن identical syntax. feedback قد يكون missing step أو misconception أو alternative method، لا correct/incorrect فقط.

## Security and provenance

تُحفظ الصيغة الأصلية، rendered representation، assumptions، units، validator version، evidence refs، وteacher review status. لا ينفذ renderer محتوى المستخدم كـHTML أو script، ولا تتحول نتيجة solver أو AI إلى source truth تلقائيًا.

## حدود التنفيذ

هذه خريطة معمارية فقط. لا solver، ولا equation editor، ولا geometry kernel، ولا MathLive/KaTeX/MathJax dependency أضيفت في Gate 4A.
