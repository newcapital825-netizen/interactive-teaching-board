/**
 * Gate 3A Object Registry.
 * Type definitions own schema, factory, capabilities, validation and adapter metadata.
 * This module depends only on the framework-independent educational contract.
 */
import {
  EDUCATIONAL_OBJECT_SCHEMA_VERSION,
  EducationalCapability,
  EducationalObject,
  EducationalObjectType,
  ObjectValidationResult,
  nowIso,
  validateEducationalObject,
} from "./educationalObjects";

export type QuestionContent = {
  prompt: string;
  answerModel: { kind: "text" | "choice" | "boolean" | "numeric"; expected?: unknown };
  interactionType: "open" | "single-choice" | "multi-choice" | "true-false" | "numeric";
  validationState: "unvalidated" | "correct" | "incorrect" | "partial";
  feedbackReference?: string;
  scoring?: { points?: number; rubric?: string };
};

export type ActivityContent = {
  activityType: "practice" | "discussion" | "sorting" | "matching" | "drawing" | "custom";
  instructions: string;
  objectIds: string[];
  interactionState: "not-started" | "in-progress" | "paused" | "completed";
  completionState: "incomplete" | "complete";
  assessmentState: "unassessed" | "assessed";
};

export type ReusableResultContent = { title: string; summary: string; sourceObjectId: string; sourceVersion: number; provenanceLabel: string; teacherApproved: boolean; [key: string]: unknown };

export type ConceptGraphContent = { nodes: Array<{ id: string; label: string }>; edges: Array<{ from: string; to: string; label?: string }> };
export type ObjectRendererKind = "text" | "shape" | "image-placeholder" | "sentence" | "equation" | "graph" | "question" | "activity" | "unknown";

export type ObjectDefinition<TContent = unknown> = {
  type: EducationalObjectType;
  label: string;
  renderer: ObjectRendererKind;
  capabilities: readonly EducationalCapability[];
  createContent: (content: unknown) => TContent;
  validateContent: (content: unknown) => ObjectValidationResult;
  persistence: "json" | "opaque-safe";
};

const ok = (): ObjectValidationResult => ({ valid: true, issues: [] });
const stringContent = (content: unknown, fallback: string) => typeof content === "string" ? content : fallback;
const validateString = (content: unknown): ObjectValidationResult => typeof content === "string" ? ok() : { valid: false, issues: [{ path: "content", message: "content must be a string" }] };
const validateQuestion = (content: unknown): ObjectValidationResult => {
  if (!content || typeof content !== "object" || Array.isArray(content)) return { valid: false, issues: [{ path: "content", message: "question content must be an object" }] };
  const value = content as Partial<QuestionContent>;
  const issues = [
    typeof value.prompt === "string" ? null : { path: "content.prompt", message: "prompt is required" },
    value.answerModel && typeof value.answerModel.kind === "string" ? null : { path: "content.answerModel", message: "answerModel.kind is required" },
    typeof value.interactionType === "string" ? null : { path: "content.interactionType", message: "interactionType is required" },
    typeof value.validationState === "string" ? null : { path: "content.validationState", message: "validationState is required" },
  ].filter(Boolean) as { path: string; message: string }[];
  return { valid: issues.length === 0, issues };
};
const validateActivity = (content: unknown): ObjectValidationResult => {
  if (!content || typeof content !== "object" || Array.isArray(content)) return { valid: false, issues: [{ path: "content", message: "activity content must be an object" }] };
  const value = content as Partial<ActivityContent>;
  const issues = [
    typeof value.activityType === "string" ? null : { path: "content.activityType", message: "activityType is required" },
    typeof value.instructions === "string" ? null : { path: "content.instructions", message: "instructions are required" },
    Array.isArray(value.objectIds) && value.objectIds.every((id) => typeof id === "string") ? null : { path: "content.objectIds", message: "objectIds must be string[]" },
    typeof value.interactionState === "string" ? null : { path: "content.interactionState", message: "interactionState is required" },
    typeof value.completionState === "string" ? null : { path: "content.completionState", message: "completionState is required" },
    typeof value.assessmentState === "string" ? null : { path: "content.assessmentState", message: "assessmentState is required" },
  ].filter(Boolean) as { path: string; message: string }[];
  return { valid: issues.length === 0, issues };
};
const validateStructuredResult = (content: unknown): ObjectValidationResult => {
  if (!content || typeof content !== "object" || Array.isArray(content)) return { valid: false, issues: [{ path: "content", message: "result content must be an object" }] };
  const value = content as Partial<ReusableResultContent>;
  const issues = [
    typeof value.title === "string" ? null : { path: "content.title", message: "title is required" },
    typeof value.summary === "string" ? null : { path: "content.summary", message: "summary is required" },
    typeof value.sourceObjectId === "string" ? null : { path: "content.sourceObjectId", message: "sourceObjectId is required" },
    typeof value.sourceVersion === "number" && Number.isFinite(value.sourceVersion) ? null : { path: "content.sourceVersion", message: "sourceVersion is required" },
    typeof value.provenanceLabel === "string" ? null : { path: "content.provenanceLabel", message: "provenanceLabel is required" },
    typeof value.teacherApproved === "boolean" ? null : { path: "content.teacherApproved", message: "teacherApproved is required" },
  ].filter(Boolean) as { path: string; message: string }[];
  return { valid: issues.length === 0, issues };
};
const validateGraph = (content: unknown): ObjectValidationResult => {
  if (typeof content === "string") return ok();
  if (!content || typeof content !== "object" || Array.isArray(content)) return { valid: false, issues: [{ path: "content", message: "graph content must be an object" }] };
  const value = content as Partial<ConceptGraphContent>;
  return Array.isArray(value.nodes) && Array.isArray(value.edges) ? ok() : { valid: false, issues: [{ path: "content", message: "graph requires nodes and edges arrays" }] };
};
const graphContent = (content: unknown): ConceptGraphContent => content && typeof content === "object" && !Array.isArray(content) ? content as ConceptGraphContent : { nodes: [{ id: "n1", label: String(content || "concept") }], edges: [] };

const defaults: ObjectDefinition[] = [
  { type: "TextObject", label: "Text", renderer: "text", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "presentable"], createContent: (content) => stringContent(content, ""), validateContent: validateString, persistence: "json" },
  { type: "ShapeObject", label: "Shape", renderer: "shape", capabilities: ["selectable", "movable", "resizable", "rotatable", "duplicable", "groupable", "exportable", "presentable"], createContent: (content) => stringContent(content, "rectangle"), validateContent: validateString, persistence: "json" },
  { type: "ImageObject", label: "Image placeholder", renderer: "image-placeholder", capabilities: ["selectable", "movable", "resizable", "duplicable", "groupable", "exportable", "presentable"], createContent: (content) => stringContent(content, "image placeholder"), validateContent: validateString, persistence: "opaque-safe" },
  { type: "DrawingObject", label: "Drawing", renderer: "shape", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "presentable"], createContent: (content) => stringContent(content, "stroke"), validateContent: validateString, persistence: "json" },
  { type: "GroupObject", label: "Group", renderer: "shape", capabilities: ["selectable", "movable", "resizable", "duplicable", "groupable", "exportable", "presentable"], createContent: (content) => stringContent(content, "group"), validateContent: validateString, persistence: "json" },
  { type: "SentenceObject", label: "Sentence", renderer: "sentence", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "interactive", "presentable"], createContent: (content) => stringContent(content, "اكتب جملة"), validateContent: validateString, persistence: "json" },
  { type: "EquationObject", label: "Equation", renderer: "equation", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "interactive", "presentable"], createContent: (content) => stringContent(content, "x + 1 = 2"), validateContent: validateString, persistence: "json" },
  { type: "GraphObject", label: "Concept graph", renderer: "graph", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "interactive", "presentable"], createContent: graphContent, validateContent: validateGraph, persistence: "json" },
  { type: "QuestionObject", label: "Question", renderer: "question", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "interactive", "assessable", "presentable"], createContent: (content) => content as QuestionContent, validateContent: validateQuestion, persistence: "json" },
  { type: "ActivityObject", label: "Activity", renderer: "activity", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "interactive", "assessable", "presentable"], createContent: (content) => content as ActivityContent, validateContent: validateActivity, persistence: "json" },
  { type: "WordObject", label: "كلمة", renderer: "text", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "interactive", "presentable"], createContent: (content) => content as ReusableResultContent, validateContent: validateStructuredResult, persistence: "json" },
  { type: "I3rabObject", label: "إعراب", renderer: "text", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "interactive", "presentable"], createContent: (content) => content as ReusableResultContent, validateContent: validateStructuredResult, persistence: "json" },
  { type: "ExplanationObject", label: "شرح", renderer: "text", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "presentable"], createContent: (content) => content as ReusableResultContent, validateContent: validateStructuredResult, persistence: "json" },
  { type: "SolutionStepsObject", label: "خطوات الحل", renderer: "text", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "presentable"], createContent: (content) => content as ReusableResultContent, validateContent: validateStructuredResult, persistence: "json" },
  { type: "PoetryObject", label: "نص شعري", renderer: "text", capabilities: ["selectable", "movable", "resizable", "editable", "duplicable", "groupable", "exportable", "interactive", "presentable"], createContent: (content) => content as ReusableResultContent, validateContent: validateStructuredResult, persistence: "json" },
];

const registry = new Map<string, ObjectDefinition>(defaults.map((definition) => [definition.type, definition]));

export const registerObjectDefinition = <TContent>(definition: ObjectDefinition<TContent>) => {
  if (!definition.type || registry.has(definition.type)) throw new Error(`Object type is already registered: ${definition.type}`);
  registry.set(definition.type, definition as ObjectDefinition);
  return definition;
};

export const getObjectDefinition = (type: string) => registry.get(type);
export const listObjectDefinitions = () => Array.from(registry.values());

export const createRegisteredEducationalObject = (type: string, content: unknown, x: number, y: number, id: string, now = nowIso()): EducationalObject => {
  const definition = getObjectDefinition(type);
  if (!definition) return createUnknownEducationalObject(type, content, x, y, id, now);
  const contentResult = definition.validateContent(content);
  if (!contentResult.valid) throw new Error(`Invalid ${type}: ${contentResult.issues.map((issue) => `${issue.path} ${issue.message}`).join(", ")}`);
  const dimensions = type === "SentenceObject" ? { width: 280, height: 82 } : { width: 180, height: 82 };
  return {
    id, type, version: 1, schemaVersion: EDUCATIONAL_OBJECT_SCHEMA_VERSION, position: { x, y }, dimensions,
    transform: { rotation: 0 }, zIndex: 1, visible: true, locked: false, metadata: { label: definition.label, renderer: definition.renderer },
    content: definition.createContent(content), capabilities: definition.capabilities, source: { kind: "teacher" }, createdAt: now, updatedAt: now,
  };
};

export const createUnknownEducationalObject = (type: string, content: unknown, x: number, y: number, id: string, now = nowIso()): EducationalObject => ({
  id, type, version: 1, schemaVersion: EDUCATIONAL_OBJECT_SCHEMA_VERSION, position: { x, y }, dimensions: { width: 180, height: 82 }, transform: { rotation: 0 }, zIndex: 1, visible: true, locked: true,
  metadata: { label: `Unknown object: ${type}`, unknownType: type, safeHandling: true }, content, capabilities: ["selectable", "movable", "presentable"], source: { kind: "import" }, createdAt: now, updatedAt: now,
});

export const validateRegisteredObject = (object: EducationalObject): ObjectValidationResult => {
  const structural = validateEducationalObject(object);
  if (!structural.valid) return structural;
  const definition = getObjectDefinition(object.type);
  if (!definition) return { valid: true, issues: [{ path: "type", message: "unknown type retained safely" }] };
  return definition.validateContent(object.content);
};
