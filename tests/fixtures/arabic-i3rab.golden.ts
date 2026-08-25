import type { I3rabExpected, Provenance } from "@/lib/gate4bTeaching";

export type ArabicI3rabGoldenCase = {
  id: string;
  source: string;
  sourceVersion: 1;
  input: string;
  targetWord: string;
  expectedResult: I3rabExpected;
  acceptableAlternatives: Partial<Record<"grammaticalRole" | "case" | "caseMarker" | "reason", string[]>>;
  invalidAlternatives: string[];
  incorrectCases: Array<{ field: "grammaticalRole" | "case" | "caseMarker" | "reason"; value: string }>;
  explanation: string;
  provenance: Provenance;
};

const provenance = (sourceObjectId: string): Provenance => ({
  sourceObjectId,
  sourceRange: { start: 0, end: 0 },
  sourceVersion: 1,
  derivationType: "golden-fixture-reviewed-scope",
  teacherApproved: true,
});

/** Ten explicit, reviewed-scope cases; this is not a general Arabic correctness corpus. */
export const arabicI3rabGoldenCases: ArabicI3rabGoldenCase[] = [
  {
    id: "verbal-subject-001",
    source: "controlled-teacher-fixture",
    sourceVersion: 1,
    input: "كتبَ الطالبُ الدرسَ.",
    targetWord: "الطالبُ",
    expectedResult: { grammaticalRole: "فاعل", case: "مرفوع", caseMarker: "الضمة", reason: "لأنه فاعل" },
    acceptableAlternatives: { caseMarker: ["ضمة"] },
    invalidAlternatives: ["الفتحة", "الكسرة"],
    incorrectCases: [{ field: "grammaticalRole", value: "مفعول به" }, { field: "case", value: "منصوب" }, { field: "caseMarker", value: "الفتحة" }, { field: "reason", value: "لأنه مفعول به" }],
    explanation: "في هذا المثال المحدد، الطالبُ هو من قام بالفعل ولذلك عولج كفاعل مرفوع بالضمة.",
    provenance: provenance("golden-verbal-subject-001"),
  },
  {
    id: "verbal-object-001",
    source: "controlled-teacher-fixture",
    sourceVersion: 1,
    input: "كتبَ الطالبُ الدرسَ.",
    targetWord: "الدرسَ.",
    expectedResult: { grammaticalRole: "مفعول به", case: "منصوب", caseMarker: "الفتحة", reason: "لأنه مفعول به" },
    acceptableAlternatives: { caseMarker: ["فتحة"] },
    invalidAlternatives: ["الضمة", "الكسرة"],
    incorrectCases: [{ field: "grammaticalRole", value: "فاعل" }, { field: "case", value: "مرفوع" }, { field: "caseMarker", value: "الضمة" }, { field: "reason", value: "لأنه فاعل" }],
    explanation: "في هذا المثال المحدد، الدرسَ هو ما وقع عليه الفعل ولذلك عولج كمفعول به منصوب بالفتحة.",
    provenance: provenance("golden-verbal-object-001"),
  },
  {
    id: "nominal-subject-001",
    source: "controlled-nominal-fixture",
    sourceVersion: 1,
    input: "العلمُ نورٌ.",
    targetWord: "العلمُ",
    expectedResult: { grammaticalRole: "مبتدأ", case: "مرفوع", caseMarker: "الضمة", reason: "لأنه مبتدأ" },
    acceptableAlternatives: { caseMarker: ["ضمة"] },
    invalidAlternatives: ["الفتحة", "الكسرة"],
    incorrectCases: [{ field: "grammaticalRole", value: "خبر" }, { field: "case", value: "منصوب" }, { field: "caseMarker", value: "الفتحة" }, { field: "reason", value: "لأنه خبر" }],
    explanation: "العلمُ اسم بدأت به الجملة الاسمية، لذلك عولج كمبتدأ مرفوع بالضمة.",
    provenance: provenance("golden-nominal-subject-001"),
  },
  {
    id: "nominal-predicate-001",
    source: "controlled-nominal-fixture",
    sourceVersion: 1,
    input: "العلمُ نورٌ.",
    targetWord: "نورٌ.",
    expectedResult: { grammaticalRole: "خبر", case: "مرفوع", caseMarker: "الضمة", reason: "لأنه خبر" },
    acceptableAlternatives: { caseMarker: ["ضمة"] },
    invalidAlternatives: ["الفتحة", "الكسرة"],
    incorrectCases: [{ field: "grammaticalRole", value: "مبتدأ" }, { field: "case", value: "منصوب" }, { field: "caseMarker", value: "الفتحة" }, { field: "reason", value: "لأنه مبتدأ" }],
    explanation: "نورٌ معلومة تخبر عن المبتدأ، لذلك عولج كخبر مرفوع بالضمة.",
    provenance: provenance("golden-nominal-predicate-001"),
  },
  {
    id: "prepositional-noun-001",
    source: "controlled-preposition-fixture",
    sourceVersion: 1,
    input: "مررتُ بالبيتِ.",
    targetWord: "بالبيتِ.",
    expectedResult: { grammaticalRole: "اسم مجرور", case: "مجرور", caseMarker: "الكسرة", reason: "لأنه اسم مجرور" },
    acceptableAlternatives: { caseMarker: ["كسرة"] },
    invalidAlternatives: ["الضمة", "الفتحة"],
    incorrectCases: [{ field: "grammaticalRole", value: "فاعل" }, { field: "case", value: "مرفوع" }, { field: "caseMarker", value: "الضمة" }, { field: "reason", value: "لأنه فاعل" }],
    explanation: "سبق حرف الجر الكلمة، ولذلك عولجت كاسم مجرور بالكسرة في هذا المثال.",
    provenance: provenance("golden-prepositional-noun-001"),
  },
  {
    id: "past-verb-001",
    source: "controlled-verb-fixture",
    sourceVersion: 1,
    input: "قرأَ الطفلُ.",
    targetWord: "قرأَ",
    expectedResult: { grammaticalRole: "فعل ماضٍ", case: "مبني", caseMarker: "الفتح", reason: "لأنه فعل ماضٍ" },
    acceptableAlternatives: { caseMarker: ["فتح"] },
    invalidAlternatives: ["الضمة", "الكسرة"],
    incorrectCases: [{ field: "grammaticalRole", value: "فعل مضارع" }, { field: "case", value: "مرفوع" }, { field: "caseMarker", value: "الضمة" }, { field: "reason", value: "لأنه فعل مضارع" }],
    explanation: "قرأَ يدل على حدث وقع في الزمن الماضي، وهو مبني على الفتح في هذا المثال.",
    provenance: provenance("golden-past-verb-001"),
  },
  {
    id: "present-verb-001",
    source: "controlled-verb-fixture",
    sourceVersion: 1,
    input: "يكتبُ الطالبُ.",
    targetWord: "يكتبُ",
    expectedResult: { grammaticalRole: "فعل مضارع", case: "مرفوع", caseMarker: "الضمة", reason: "لأنه فعل مضارع" },
    acceptableAlternatives: { caseMarker: ["ضمة"] },
    invalidAlternatives: ["الفتحة", "الكسرة"],
    incorrectCases: [{ field: "grammaticalRole", value: "فعل ماضٍ" }, { field: "case", value: "مبني" }, { field: "caseMarker", value: "الفتحة" }, { field: "reason", value: "لأنه فعل ماضٍ" }],
    explanation: "يكتبُ يدل على حدث يقع في الحال أو الاستقبال، وهو مرفوع بالضمة في هذا المثال.",
    provenance: provenance("golden-present-verb-001"),
  },
  {
    id: "imperative-verb-001",
    source: "controlled-verb-fixture",
    sourceVersion: 1,
    input: "اكتبْ الدرسَ.",
    targetWord: "اكتبْ",
    expectedResult: { grammaticalRole: "فعل أمر", case: "مبني", caseMarker: "السكون", reason: "لأنه فعل أمر" },
    acceptableAlternatives: { caseMarker: ["سكون"] },
    invalidAlternatives: ["الضمة", "الفتحة"],
    incorrectCases: [{ field: "grammaticalRole", value: "فعل ماضٍ" }, { field: "case", value: "مرفوع" }, { field: "caseMarker", value: "الفتحة" }, { field: "reason", value: "لأنه فعل ماضٍ" }],
    explanation: "اكتبْ يدل على طلب وقوع الفعل، وهو مبني على السكون في هذا المثال المحدد.",
    provenance: provenance("golden-imperative-verb-001"),
  },
  {
    id: "adjective-001",
    source: "controlled-adjective-fixture",
    sourceVersion: 1,
    input: "جاءَ الطالبُ المجتهدُ.",
    targetWord: "المجتهدُ.",
    expectedResult: { grammaticalRole: "نعت", case: "مرفوع", caseMarker: "الضمة", reason: "لأنه نعت" },
    acceptableAlternatives: { caseMarker: ["ضمة"] },
    invalidAlternatives: ["الفتحة", "الكسرة"],
    incorrectCases: [{ field: "grammaticalRole", value: "فاعل" }, { field: "case", value: "منصوب" }, { field: "caseMarker", value: "الفتحة" }, { field: "reason", value: "لأنه فاعل" }],
    explanation: "المجتهدُ صفة تتبع الطالبَ في هذا المثال، ولذلك عولجت كنعت مرفوع بالضمة.",
    provenance: provenance("golden-adjective-001"),
  },
  {
    id: "genitive-construct-001",
    source: "controlled-construct-fixture",
    sourceVersion: 1,
    input: "كتابُ الطالبِ جديدٌ.",
    targetWord: "الطالبِ",
    expectedResult: { grammaticalRole: "مضاف إليه", case: "مجرور", caseMarker: "الكسرة", reason: "لأنه مضاف إليه" },
    acceptableAlternatives: { caseMarker: ["كسرة"] },
    invalidAlternatives: ["الضمة", "الفتحة"],
    incorrectCases: [{ field: "grammaticalRole", value: "مبتدأ" }, { field: "case", value: "مرفوع" }, { field: "caseMarker", value: "الضمة" }, { field: "reason", value: "لأنه مبتدأ" }],
    explanation: "الطالبِ جاء بعد اسم قبله في تركيب الإضافة، ولذلك عولج كمضاف إليه مجرور بالكسرة.",
    provenance: provenance("golden-genitive-construct-001"),
  },
];
