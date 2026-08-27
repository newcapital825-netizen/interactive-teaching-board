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
const evidenceClasses = ["verified_curriculum_fact", "trusted_external_fact", "structured_engine_result", "ai_inference", "uncertain_claim"] as const;
const verificationStates = ["verified", "high_confidence", "medium_confidence", "low_confidence", "unverified", "conflicting_sources", "requires_teacher_review"] as const;
const isEvidenceClass = (value: unknown): value is (typeof evidenceClasses)[number] => typeof value === "string" && evidenceClasses.includes(value as (typeof evidenceClasses)[number]);
const isVerificationState = (value: unknown): value is (typeof verificationStates)[number] => typeof value === "string" && verificationStates.includes(value as (typeof verificationStates)[number]);

function parseEvidence(value: unknown): EducationalAssistOutput | null {
  if (!isRecord(value) || typeof value.confidence !== "string" || typeof value.provenanceStatus !== "string" || !Array.isArray(value.sources) || !Array.isArray(value.limitations) || typeof value.teacherReviewRequired !== "boolean" || !isEvidenceClass(value.evidenceClass) || !isVerificationState(value.verificationState)) return null;
  const sources = value.sources.filter((source): source is { label: string; kind: string; note: string } => isRecord(source) && typeof source.label === "string" && typeof source.kind === "string" && typeof source.note === "string").slice(0, 8).map((source) => ({ label: source.label.slice(0, 240), kind: source.kind.slice(0, 80), note: source.note.slice(0, 500) }));
  const limitations = value.limitations.filter((limitation): limitation is string => typeof limitation === "string").slice(0, 12).map((limitation) => limitation.slice(0, 500));
  return { confidence: value.confidence.slice(0, 80), provenanceStatus: value.provenanceStatus.slice(0, 160), sources, limitations, teacherReviewRequired: value.teacherReviewRequired, evidenceClass: value.evidenceClass, verificationState: value.verificationState } as EducationalAssistOutput;
}

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
    else {
      const evidence = parseEvidence(parsed.lastEvidence);
      if (evidence) snapshot.lastEvidence = evidence;
    }
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
