# Gate 4B Transformation Trace

## المبدأ

كل transformation في هذه الشريحة plain-data ومحدد المصدر. الـCore Board لا يعرف «فاعل» أو «حل»؛ هو يحتفظ بالكائن canonical ويعرض representation تقدمه حزمة المادة.

## Arabic

```text
SentenceObject
  id = sentence_*
  content = قرأَ الطالبُ الكتابَ.
      │
      └── createGrammarLens(source)
            │
            ├── GrammarLens.id = grammar-lens_*
            ├── sourceObjectId = SentenceObject.id
            ├── sourceRange = 0..content.length
            ├── sourceVersion = SentenceObject.version
            └── provenance.derivationType = deterministic-grammar-lens
                 │
                 └── ActivityDefinition.lensId = GrammarLens.id
```

يحتوي الـlens على نطاق كل كلمة، ولا يعيد إنشاء `SentenceObject`. اختيار كلمة يعدل `selectedWordId` فقط. كشف الإجابة يعدل حالة العرض، ولا يغير مصدر الحقيقة.

## Mathematics

```text
EquationObject
  id = equation_*
  content = 2x + 3 = 11
      │
      └── createMathVisualizationLens(source)
            │
            ├── MathVisualizationLens.id = math-lens_*
            ├── sourceObjectId = EquationObject.id
            ├── sourceRange = 0..content.length
            ├── sourceVersion = EquationObject.version
            └── provenance.derivationType = deterministic-equation-visualization
                 │
                 └── ActivityDefinition.lensId = MathVisualizationLens.id
```

الخطوات `2x = 8` و`x = 4` بيانات تمثيل مضبوطة، وليست ناتج محرك جبر عام. نقطة التحقق مرتبطة بالحل المحدد `solutionX = 4`.

## التحقق

اختبارات `gate4b-vertical-slice.test.ts` تتحقق من النوع، و`sourceObjectId`، و`sourceRange`، و`sourceVersion`، و`derivationType`، ومن ربط النشاط بمعرّف الـlens. كما تتحقق من أن المصدرين يتشاركان schemaVersion والـcapabilities من المصنع نفسه.

## التغييرات المسموح بها

إذا أضافت مرحلة لاحقة representation، يجب أن تحمل `sourceObjectId` و`sourceVersion` وderivation type نفسه، وأن تمر من adapter/registry canonical. لا يجوز إنشاء ArabicTransformationEngine أو MathTransformationEngine بديل داخل Core Board.
