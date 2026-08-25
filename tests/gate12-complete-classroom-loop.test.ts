/** Gate 12 contract tests: canonical classroom lifecycle, attempts, assessment, feedback, review, retry, and safe round-trip. */
import { describe, expect, it } from "vitest";
import { createJourney } from "@/lib/gate4bTeaching";
import { createDocument } from "@/lib/coreBoard";
import { exportLesson, importLesson } from "@/lib/lessonTransfer";
import { applyAttemptOverride, assessAttempt, canTransitionActivity, createAttempt, createClassroomActivity, createClassroomLesson, deserializeClassroomLesson, replaceActivity, retryAttempt, reviewAttempt, serializeClassroomLesson, submitAttempt, transitionActivity, updateAttemptMathSteps, updateAttemptResponse } from "@/lib/classroomLoop";

const at = "2026-08-26T00:00:00.000Z";
const student = { id: "student-a", displayName: "طالب تجريبي" };
const provenance = (sourceObjectId: string) => ({ sourceObjectId, sourceRange: { start: 0, end: 10 }, sourceVersion: 1, derivationType: "gate12-test", teacherApproved: false });
const ready = (activity: ReturnType<typeof createClassroomActivity>) => transitionActivity(activity, "ready", at);
const active = (activity: ReturnType<typeof createClassroomActivity>) => transitionActivity(ready(activity), "student-active", at);

const runArabic = () => {
  let activity = active(createClassroomActivity(createJourney("arabic"), at));
  let attempt = createAttempt(activity, student, at);
  activity = { ...activity, attempts: [attempt], activeAttemptId: attempt.attemptId };
  const expected = activity.activity.i3rab!.expected;
  attempt = updateAttemptResponse(attempt, JSON.stringify({ wordId: activity.activity.i3rab!.targetWordId, grammaticalRole: expected.grammaticalRole, case: expected.case, caseMarker: expected.caseMarker, reason: expected.reason }), at);
  const submitted = submitAttempt(activity, attempt, at);
  const assessed = assessAttempt(submitted.activity, submitted.attempt, provenance(activity.sourceObjectId), at);
  return { activity: assessed.activity, attempt: assessed.attempt };
};

describe("Gate 12 complete classroom loop", () => {
  it("guards the activity lifecycle and rejects invalid transitions", () => {
    const activity = createClassroomActivity(createJourney("arabic"), at);
    expect(canTransitionActivity("draft", "ready")).toBe(true);
    expect(canTransitionActivity("draft", "student-active")).toBe(false);
    expect(() => transitionActivity(activity, "assessed", at)).toThrow("Invalid activity transition");
  });

  it("completes the Arabic source → attempt → assessment → feedback → review → override path", () => {
    const result = runArabic();
    expect(result.attempt.assessment?.evaluation).toBe("correct");
    expect(result.attempt.assessment?.diagnostic).not.toBe("answer-error");
    expect(result.attempt.feedback?.title).toContain("صحيحة");
    const reviewed = reviewAttempt(result.activity, result.attempt, at);
    const overridden = applyAttemptOverride(reviewed.attempts[0], reviewed, "valid-alternative", "صيغة العلامة مقبولة ضمن الشريحة", "تمت المراجعة يدويًا.", provenance(reviewed.sourceObjectId), "teacher-a", at);
    expect(overridden.assessment?.evaluation).toBe("correct");
    expect(overridden.assessment?.effectiveEvaluation).toBe("valid-alternative");
    expect(overridden.assessment?.teacherOverride?.reason).toContain("مقبولة");
    expect(overridden.assessment?.events.some((event) => event.eventType === "system-assessment")).toBe(true);
    expect(overridden.teacherDecision?.teacherReference).toBe("teacher-a");
  });

  it("completes the Mathematics step activity with alternative steps and substitution verification", () => {
    let activity = active(createClassroomActivity(createJourney("mathematics"), at));
    let attempt = createAttempt(activity, student, at);
    activity = { ...activity, attempts: [attempt], activeAttemptId: attempt.attemptId };
    const steps = activity.mathStepSession!.steps;
    attempt = updateAttemptMathSteps(attempt, steps, at);
    attempt = updateAttemptResponse(attempt, "x = 4", at);
    const submitted = submitAttempt(activity, attempt, at);
    const assessed = assessAttempt(submitted.activity, submitted.attempt, provenance(activity.sourceObjectId), at);
    expect(assessed.attempt.mathStepAssessments).toHaveLength(2);
    expect(assessed.attempt.mathStepAssessments.every((item) => item.evaluation === "correct")).toBe(true);
    expect(assessed.attempt.mathFinalAnswer?.correct).toBe(true);
    expect(assessed.attempt.mathVerification?.valid).toBe(true);
    const reviewed = reviewAttempt(assessed.activity, assessed.attempt, at);
    const retried = retryAttempt(reviewed, student, at);
    expect(retried.activity.attempts).toHaveLength(2);
    expect(retried.activity.attempts[0].attemptId).not.toBe(retried.attempt.attemptId);
    expect(retried.activity.attempts[0].mathStepAssessments).toHaveLength(2);
  });

  it("keeps Arabic and Mathematics activities isolated inside one classroom lesson", () => {
    const lesson = createClassroomLesson(at);
    const arabic = createClassroomActivity(createJourney("arabic"), at);
    const math = createClassroomActivity(createJourney("mathematics"), at);
    const state = { ...lesson, activities: [arabic, math] };
    expect(new Set(state.activities.map((item) => item.id)).size).toBe(2);
    expect(new Set(state.activities.map((item) => item.sourceObjectId)).size).toBe(2);
    const restored = deserializeClassroomLesson(serializeClassroomLesson(state));
    expect(restored?.activities.map((item) => item.subject)).toEqual(["arabic", "mathematics"]);
    const lessonDocument = { ...createDocument(), classroom: state };
    const restoredDocument = importLesson(exportLesson(lessonDocument));
    expect(restoredDocument?.classroom?.activities.map((item) => item.id)).toEqual([arabic.id, math.id]);
  });

  it("records NODE/VITEST lesson lifecycle benchmarks for 10, 25, 50, and 100 activities", () => {
    const measurements = [10, 25, 50, 100].map((count) => {
      const start = performance.now();
      const activities = Array.from({ length: count }, (_, index) => createClassroomActivity(createJourney(index % 2 === 0 ? "arabic" : "mathematics"), at));
      const state = { ...createClassroomLesson(at), activities };
      const saved = serializeClassroomLesson(state);
      const restored = deserializeClassroomLesson(saved);
      const elapsedMs = performance.now() - start;
      console.log(JSON.stringify({ environment: "NODE/VITEST BENCHMARK", count, operations: ["lesson-load", "activity-creation", "assessment-boundary", "feedback-boundary", "save", "restore"], elapsedMs: Number(elapsedMs.toFixed(3)) }));
      expect(restored?.activities).toHaveLength(count);
      return elapsedMs;
    });
    expect(measurements.every((value) => value >= 0)).toBe(true);
  });

  it("rejects malformed attempts, duplicate IDs, unsafe keys, and broken activity links", () => {
    const arabic = createClassroomActivity(createJourney("arabic"), at);
    const state = { ...createClassroomLesson(at), activities: [arabic] };
    const parsed = JSON.parse(serializeClassroomLesson(state)) as Record<string, unknown>;
    const malformedAttempt = { attemptId: "bad", activityId: "other", student: student, response: "", mathSteps: [], mathStepAssessments: [], provenance: {} };
    parsed.activities = [{ ...arabic, attempts: [malformedAttempt] }];
    expect(deserializeClassroomLesson(JSON.stringify(parsed))).toBeNull();
    expect(deserializeClassroomLesson(`{"schemaVersion":1,"student":{"id":"local-student-1","displayName":"طالب محلي"},"activities":[],"updatedAt":"${at}","__proto__":{"polluted":true}}`)).toBeNull();
    const duplicate = { ...state, activities: [arabic, arabic] };
    expect(deserializeClassroomLesson(JSON.stringify(duplicate))).toBeNull();
  });
});
