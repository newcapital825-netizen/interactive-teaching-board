/**
 * Gate 3A Universal Educational Object Engine.
 * Framework-independent domain contract: no React, DOM, or canvas dependencies.
 */

export const EDUCATIONAL_OBJECT_SCHEMA_VERSION = 2;

export type EducationalObjectId = string;
export type EducationalObjectType = string;

export type EducationalCapability =
  | "selectable"
  | "movable"
  | "resizable"
  | "rotatable"
  | "editable"
  | "duplicable"
  | "groupable"
  | "exportable"
  | "interactive"
  | "assessable"
  | "presentable";

export type ObjectPosition = { x: number; y: number };
export type ObjectDimensions = { width: number; height: number };
export type ObjectTransform = { rotation: number };
export type ObjectSource = { kind: "teacher" | "import" | "generated" | "system"; reference?: string };

export type EducationalObject<
  TType extends EducationalObjectType = EducationalObjectType,
  TContent = unknown,
> = {
  id: EducationalObjectId;
  type: TType;
  version: number;
  schemaVersion: number;
  position: ObjectPosition;
  dimensions: ObjectDimensions;
  transform: ObjectTransform;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  metadata: Record<string, unknown>;
  content: TContent;
  capabilities: readonly EducationalCapability[];
  source?: ObjectSource;
  createdAt: string;
  updatedAt: string;
};

export type ObjectValidationIssue = { path: string; message: string };
export type ObjectValidationResult = { valid: boolean; issues: ObjectValidationIssue[] };
export type LifecycleStage = "created" | "validated" | "inserted" | "selected" | "edited" | "transformed" | "serialized" | "persisted" | "restored" | "duplicated" | "deleted";

export type EducationalObjectEnvelope = {
  kind: "educational-object";
  schemaVersion: number;
  object: EducationalObject;
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const nowIso = () => new Date().toISOString();

export const validateEducationalObject = (value: unknown): ObjectValidationResult => {
  const issues: ObjectValidationIssue[] = [];
  if (!isRecord(value)) return { valid: false, issues: [{ path: "$", message: "Educational object must be a record" }] };
  if (typeof value.id !== "string" || !value.id) issues.push({ path: "id", message: "id must be a non-empty string" });
  if (typeof value.type !== "string" || !value.type) issues.push({ path: "type", message: "type must be a non-empty string" });
  if (typeof value.version !== "number" || value.version < 1) issues.push({ path: "version", message: "version must be a positive number" });
  if (typeof value.schemaVersion !== "number" || value.schemaVersion < 1) issues.push({ path: "schemaVersion", message: "schemaVersion must be a positive number" });
  if (!isRecord(value.position) || typeof value.position.x !== "number" || typeof value.position.y !== "number") issues.push({ path: "position", message: "position must contain numeric x and y" });
  if (!isRecord(value.dimensions) || typeof value.dimensions.width !== "number" || typeof value.dimensions.height !== "number" || value.dimensions.width < 0 || value.dimensions.height < 0) issues.push({ path: "dimensions", message: "dimensions must contain non-negative numeric width and height" });
  if (!isRecord(value.transform) || typeof value.transform.rotation !== "number") issues.push({ path: "transform", message: "transform must contain numeric rotation" });
  if (!Array.isArray(value.capabilities) || value.capabilities.some((capability) => typeof capability !== "string")) issues.push({ path: "capabilities", message: "capabilities must be an array of strings" });
  if (typeof value.visible !== "boolean") issues.push({ path: "visible", message: "visible must be boolean" });
  if (typeof value.locked !== "boolean") issues.push({ path: "locked", message: "locked must be boolean" });
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") issues.push({ path: "timestamps", message: "createdAt and updatedAt must be strings" });
  return { valid: issues.length === 0, issues };
};

export const hasCapability = (object: Pick<EducationalObject, "capabilities">, capability: EducationalCapability) => object.capabilities.includes(capability);

export const assertCapability = (object: Pick<EducationalObject, "capabilities" | "type">, capability: EducationalCapability) => {
  if (!hasCapability(object, capability)) throw new Error(`${object.type} does not support ${capability}`);
};

export const lifecycleFor = (stage: LifecycleStage, object: EducationalObject): EducationalObject => ({
  ...object,
  metadata: { ...object.metadata, lifecycleStage: stage },
  updatedAt: nowIso(),
});

export const duplicateEducationalObject = (object: EducationalObject, newId: EducationalObjectId): EducationalObject => ({
  ...object,
  id: newId,
  version: object.version + 1,
  metadata: { ...object.metadata, duplicatedFrom: object.id },
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

export const toEnvelope = (object: EducationalObject): EducationalObjectEnvelope => ({
  kind: "educational-object",
  schemaVersion: EDUCATIONAL_OBJECT_SCHEMA_VERSION,
  object: lifecycleFor("serialized", object),
});
