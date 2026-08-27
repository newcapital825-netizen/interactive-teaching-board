import type { Message } from "@/components/AIChatBox";
import type { EducationalAssistOutput } from "../../../server/educationalAssistant";
import type { TeacherReviewState } from "./teacherReview";

export type AssistantReviewSnapshot = {
  messages: Message[];
  lastEvidence: EducationalAssistOutput | null;
  reviewState: TeacherReviewState;
  correction: string;
  providedSource: string;
  intent: "explain" | "analyze" | "question" | "activity" | "clarify";
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

export function readAssistantReviewSnapshot(key: string): Partial<AssistantReviewSnapshot> | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!isRecord(parsed)) return null;
    const snapshot: Partial<AssistantReviewSnapshot> = {};
    if (Array.isArray(parsed.messages)) {
      snapshot.messages = parsed.messages.filter((message): message is Message => isRecord(message) && (message.role === "user" || message.role === "assistant") && typeof message.content === "string");
    }
    if (typeof parsed.providedSource === "string") snapshot.providedSource = parsed.providedSource.slice(0, 500);
    if (typeof parsed.correction === "string") snapshot.correction = parsed.correction.slice(0, 2000);
    if (["pending", "accepted", "rejected", "corrected"].includes(String(parsed.reviewState))) snapshot.reviewState = parsed.reviewState as TeacherReviewState;
    if (["explain", "analyze", "question", "activity", "clarify"].includes(String(parsed.intent))) snapshot.intent = parsed.intent as AssistantReviewSnapshot["intent"];
    if (parsed.lastEvidence === null) snapshot.lastEvidence = null;
    else if (isRecord(parsed.lastEvidence)) snapshot.lastEvidence = parsed.lastEvidence as EducationalAssistOutput;
    return snapshot;
  } catch {
    return null;
  }
}

export function writeAssistantReviewSnapshot(key: string, snapshot: AssistantReviewSnapshot): void {
  try {
    localStorage.setItem(key, JSON.stringify(snapshot));
  } catch {
    // Local-first persistence is best effort; the board save path remains authoritative.
  }
}
