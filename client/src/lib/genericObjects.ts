/**
 * Gate 3A generic and cross-subject proof objects.
 * These factories establish data shapes only; they do not implement subject engines.
 */
import { createRegisteredEducationalObject, getObjectDefinition, registerObjectDefinition, type ActivityContent, type ConceptGraphContent, type QuestionContent } from "./objectRegistry";
import type { EducationalObject } from "./educationalObjects";

const proofId = (type: string) => `proof_${type.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase()}`;

export const createQuestionObject = (content: Partial<QuestionContent> = {}): EducationalObject<"QuestionObject", QuestionContent> => createRegisteredEducationalObject("QuestionObject", {
  prompt: content.prompt ?? "ما الفكرة الرئيسة؟",
  answerModel: content.answerModel ?? { kind: "text" },
  interactionType: content.interactionType ?? "open",
  validationState: content.validationState ?? "unvalidated",
  feedbackReference: content.feedbackReference,
  scoring: content.scoring,
}, 0, 0, proofId("question")) as EducationalObject<"QuestionObject", QuestionContent>;

export const createActivityObject = (content: Partial<ActivityContent> = {}): EducationalObject<"ActivityObject", ActivityContent> => createRegisteredEducationalObject("ActivityObject", {
  activityType: content.activityType ?? "discussion",
  instructions: content.instructions ?? "ناقش الفكرة مع المجموعة.",
  objectIds: content.objectIds ?? [],
  interactionState: content.interactionState ?? "not-started",
  completionState: content.completionState ?? "incomplete",
  assessmentState: content.assessmentState ?? "unassessed",
}, 0, 0, proofId("activity")) as EducationalObject<"ActivityObject", ActivityContent>;

export const createCrossSubjectProof = () => ({
  arabic: createRegisteredEducationalObject("SentenceObject", "قرأَ الطالبُ الكتابَ", 0, 0, proofId("sentence")),
  mathematics: createRegisteredEducationalObject("EquationObject", "2x + 5 = 15", 0, 0, proofId("equation")),
  science: createRegisteredEducationalObject("GraphObject", { nodes: [{ id: "matter", label: "Matter" }, { id: "energy", label: "Energy" }], edges: [{ from: "matter", to: "energy", label: "relates" }] } satisfies ConceptGraphContent, 0, 0, proofId("graph")),
  question: createQuestionObject(),
  activity: createActivityObject(),
});

export const registerGeometryProof = () => {
  if (!getObjectDefinition("GeometryObject")) registerObjectDefinition({
    type: "GeometryObject",
    label: "Geometry",
    renderer: "shape",
    capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "exportable", "presentable"],
    createContent: (content) => typeof content === "string" ? content : "triangle",
    validateContent: (content) => typeof content === "string" ? { valid: true, issues: [] } : { valid: false, issues: [{ path: "content", message: "geometry proof content must be a string" }] },
    persistence: "json",
  });
  return createRegisteredEducationalObject("GeometryObject", "triangle", 0, 0, proofId("geometry"));
};
