export type TeacherReviewState = "pending" | "accepted" | "rejected" | "corrected";

export function reviewLabel(state: TeacherReviewState): string {
  return {
    pending: "بانتظار مراجعة المعلم",
    accepted: "اعتمدها المعلم",
    rejected: "رفضها المعلم",
    corrected: "صححها المعلم",
  }[state];
}
