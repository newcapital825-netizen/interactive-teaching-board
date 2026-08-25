import { createObject, type CoreObject } from "./coreBoard";
import { getObjectDefinition } from "./objectRegistry";
import { hasCapability, type EducationalCapability } from "./educationalObjects";

/* Gate 8 reminder: actions are descriptors over canonical capabilities; Core Board owns no Arabic/Math rules. */
export type ContextualActionId = "explain" | "analyze" | "practice" | "assess" | "example" | "compare" | "highlight" | "toggle-visibility" | "convert-to-activity" | "visualize";
export type ContextualAction = { id: ContextualActionId; label: string; description: string; requiredCapability?: EducationalCapability; available: boolean; reason?: "unsupported-capability" | "unsupported-object" };
export type ContextualActionContext = { sourceRange?: { start: number; end: number }; subject?: "arabic" | "mathematics" };

const common: Record<ContextualActionId, Omit<ContextualAction, "id" | "available" | "reason">> = {
  explain: { label: "شرح", description: "إضافة شرح أو ملاحظة تعليمية من المصدر." },
  analyze: { label: "تحليل", description: "فتح أداة التحليل الخاصة بنوع العنصر." },
  practice: { label: "تدريب", description: "إنشاء مسار تدريب من العنصر المحدد.", requiredCapability: "interactive" },
  assess: { label: "تقييم", description: "إنشاء سؤال قابل للتقييم.", requiredCapability: "assessable" },
  example: { label: "مثال", description: "إضافة مثال مرتبط بالمصدر." },
  compare: { label: "مقارنة", description: "إظهار مقارنة تعليمية ضمن النطاق المثبت." },
  highlight: { label: "تمييز", description: "تمييز المصدر أو النطاق المحدد." },
  "toggle-visibility": { label: "إخفاء/إظهار", description: "تبديل ظهور العنصر في العرض.", requiredCapability: "presentable" },
  "convert-to-activity": { label: "تحويل إلى نشاط", description: "إنشاء ActivityObject مرتبط بالمصدر.", requiredCapability: "interactive" },
  visualize: { label: "عرض بصري", description: "إنشاء عدسة بصرية عندما يدعم النوع ذلك.", requiredCapability: "presentable" },
};

const map: Record<string, ContextualActionId[]> = {
  TextObject: ["explain", "analyze", "practice", "assess", "example", "compare", "highlight", "toggle-visibility", "convert-to-activity"],
  SentenceObject: ["explain", "analyze", "practice", "assess", "example", "compare", "highlight", "toggle-visibility", "convert-to-activity"],
  EquationObject: ["explain", "analyze", "practice", "assess", "example", "compare", "highlight", "toggle-visibility", "convert-to-activity", "visualize"],
  GraphObject: ["explain", "analyze", "practice", "assess", "compare", "highlight", "toggle-visibility", "convert-to-activity", "visualize"],
  QuestionObject: ["explain", "assess", "compare", "highlight", "toggle-visibility", "convert-to-activity"],
  ActivityObject: ["explain", "analyze", "assess", "highlight", "toggle-visibility"],
  ShapeObject: ["explain", "highlight", "toggle-visibility"],
};

export const getContextualActions = (object: CoreObject, _context: ContextualActionContext = {}): ContextualAction[] => {
  const definition = getObjectDefinition(object.type);
  const ids = map[object.type] ?? ["explain", "highlight", "toggle-visibility"];
  return ids.map((id) => { const descriptor = common[id]; const available = !descriptor.requiredCapability || hasCapability(object, descriptor.requiredCapability); return { id, ...descriptor, available, ...(available ? {} : { reason: "unsupported-capability" as const }) }; });
};

export type ContextualActionResult = { action: ContextualActionId; sourceObjectId: string; createdObject?: CoreObject; provenance: { sourceObjectId: string; sourceRange?: { start: number; end: number }; sourceVersion: number; derivationType: string } };

export const convertToActivity = (object: CoreObject, context: ContextualActionContext = {}): ContextualActionResult => {
  if (!hasCapability(object, "interactive")) throw new Error(`Object ${object.type} does not support contextual activity conversion`);
  const activity = createObject("ActivityObject", { activityType: "practice", instructions: `تدريب من المصدر: ${String(object.content)}`, objectIds: [object.id], interactionState: "not-started", completionState: "incomplete", assessmentState: "unassessed" }, object.position.x + 24, object.position.y + object.size.height + 24);
  activity.id = `${object.id}_activity`;
  activity.metadata = { ...activity.metadata, contextualAction: "convert-to-activity", sourceObjectId: object.id, sourceRange: context.sourceRange };
  return { action: "convert-to-activity", sourceObjectId: object.id, createdObject: activity, provenance: { sourceObjectId: object.id, sourceRange: context.sourceRange, sourceVersion: object.metadata.version, derivationType: "contextual-action-convert-to-activity" } };
};

export const actionSupports = (object: CoreObject, id: ContextualActionId) => getContextualActions(object).some((action) => action.id === id && action.available);
