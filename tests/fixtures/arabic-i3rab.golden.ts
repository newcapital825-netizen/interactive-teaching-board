import type { I3rabExpected } from "@/lib/gate4bTeaching";

export type ArabicI3rabGoldenCase = {
  id: string;
  input: string;
  targetWord: string;
  expectedResult: I3rabExpected;
  acceptableAlternatives: string[];
  incorrectCases: Array<{ field: string; value: string }>;
  explanation: string;
  source: string;
  version: 1;
};

/** Small reviewed-scope fixture: this is not a general Arabic correctness corpus. */
export const arabicI3rabGoldenCases: ArabicI3rabGoldenCase[] = [
  {
    id: "verbal-subject-001",
    input: "كتبَ الطالبُ الدرسَ.",
    targetWord: "الطالبُ",
    expectedResult: { grammaticalRole: "فاعل", case: "مرفوع", caseMarker: "الضمة", reason: "لأنه فاعل" },
    acceptableAlternatives: ["الطالبُ", "الطالب"],
    incorrectCases: [{ field: "grammaticalRole", value: "مفعول به" }, { field: "case", value: "منصوب" }, { field: "caseMarker", value: "الفتحة" }],
    explanation: "في هذا المثال المحدد، الطالبُ هو من قام بالفعل ولذلك عولج كفاعل مرفوع بالضمة.",
    source: "controlled-teacher-fixture",
    version: 1,
  },
  {
    id: "verbal-object-001",
    input: "كتبَ الطالبُ الدرسَ.",
    targetWord: "الدرسَ.",
    expectedResult: { grammaticalRole: "مفعول به", case: "منصوب", caseMarker: "الفتحة", reason: "لأنه مفعول به" },
    acceptableAlternatives: ["الدرسَ", "الدرس"],
    incorrectCases: [{ field: "grammaticalRole", value: "فاعل" }, { field: "case", value: "مرفوع" }, { field: "caseMarker", value: "الضمة" }],
    explanation: "في هذا المثال المحدد، الدرسَ هو ما وقع عليه الفعل ولذلك عولج كمفعول به منصوب بالفتحة.",
    source: "controlled-teacher-fixture",
    version: 1,
  },
];
