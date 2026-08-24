/**
 * Gate 3A schema migrations and safe restoration.
 * Legacy payloads are normalized; unknown object types are retained as locked safe objects.
 */
import type { BoardDocument, BoardPage, CoreObject } from "./coreBoard";
import { getObjectDefinition } from "./objectRegistry";
import { EDUCATIONAL_OBJECT_SCHEMA_VERSION, EducationalCapability } from "./educationalObjects";

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const numberOr = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
const stringOr = (value: unknown, fallback: string) => typeof value === "string" ? value : fallback;
const boolOr = (value: unknown, fallback: boolean) => typeof value === "boolean" ? value : fallback;
const safeContentString = (value: unknown) => typeof value === "string" ? value : JSON.stringify(value) ?? "";
const legacyCapabilities = (type: string): readonly EducationalCapability[] => getObjectDefinition(type)?.capabilities ?? ["selectable", "movable", "presentable"];

export const migrateCoreObject = (raw: unknown, path = "object"): CoreObject | null => {
  if (!isRecord(raw)) return null;
  const type = stringOr(raw.type, "UnknownObject");
  const definition = getObjectDefinition(type);
  const rawPosition = isRecord(raw.position) ? raw.position : {};
  const rawSize = isRecord(raw.size) ? raw.size : isRecord(raw.dimensions) ? raw.dimensions : {};
  const rawStyle = isRecord(raw.style) ? raw.style : {};
  const rawMetadata = isRecord(raw.metadata) ? raw.metadata : {};
  const id = stringOr(raw.id, `migrated_${path.replace(/[^a-zA-Z0-9]+/g, "_")}`);
  const now = new Date().toISOString();
  const children = Array.isArray(raw.children) ? raw.children.map((child, index) => migrateCoreObject(child, `${path}.children.${index}`)).filter(Boolean) as CoreObject[] : undefined;
  const unknown = !definition;
  const capabilities = unknown ? ["selectable", "movable", "presentable"] as const : legacyCapabilities(type);
  const content = raw.content;
  const data = raw.data ?? (typeof content === "string" ? undefined : content);
  return {
    id,
    type,
    position: { x: numberOr(rawPosition.x, 0), y: numberOr(rawPosition.y, 0) },
    size: { width: Math.max(0, numberOr(rawSize.width, 180)), height: Math.max(0, numberOr(rawSize.height, 82)) },
    rotation: numberOr(raw.rotation, numberOr(isRecord(raw.transform) ? raw.transform.rotation : undefined, 0)),
    zIndex: numberOr(raw.zIndex, 1),
    content: safeContentString(content),
    data,
    style: {
      color: stringOr(rawStyle.color, "#2d3d34"),
      background: stringOr(rawStyle.background, "#fbfaf6"),
      fontSize: numberOr(rawStyle.fontSize, 16),
      align: rawStyle.align === "center" || rawStyle.align === "right" ? rawStyle.align : "left",
    },
    metadata: {
      label: stringOr(rawMetadata.label, definition?.label ?? `Unknown object: ${type}`),
      source: rawMetadata.source === "teacher" ? "teacher" : "placeholder",
      locked: unknown || boolOr(rawMetadata.locked, false),
      visible: boolOr(rawMetadata.visible, true),
      version: numberOr(rawMetadata.version, 1),
      ...(unknown ? { unknownType: type, safeHandling: true } : {}),
    },
    capabilities,
    schemaVersion: EDUCATIONAL_OBJECT_SCHEMA_VERSION,
    transform: { rotation: numberOr(isRecord(raw.transform) ? raw.transform.rotation : undefined, numberOr(raw.rotation, 0)) },
    source: { kind: rawMetadata.source === "teacher" ? "teacher" : "import" },
    createdAt: stringOr(raw.createdAt, now),
    updatedAt: stringOr(raw.updatedAt, now),
    stroke: raw.stroke as CoreObject["stroke"],
    childIds: Array.isArray(raw.childIds) ? raw.childIds.filter((id): id is string => typeof id === "string") : undefined,
    children,
  };
};

export const migrateBoardPage = (raw: unknown, index: number): BoardPage | null => {
  if (!isRecord(raw)) return null;
  const objects = Array.isArray(raw.objects) ? raw.objects.map((object, objectIndex) => migrateCoreObject(object, `page.${index}.object.${objectIndex}`)).filter(Boolean) as CoreObject[] : [];
  const viewport = isRecord(raw.viewport) ? raw.viewport : {};
  return {
    id: stringOr(raw.id, `migrated_page_${index + 1}`),
    name: stringOr(raw.name, `Page ${index + 1}`),
    objects,
    viewport: { x: numberOr(viewport.x, 0), y: numberOr(viewport.y, 0), zoom: Math.max(0.1, numberOr(viewport.zoom, 1)) },
  };
};

export const migrateBoardDocument = (raw: unknown): BoardDocument | null => {
  if (!isRecord(raw) || !Array.isArray(raw.pages)) return null;
  const pages = raw.pages.map(migrateBoardPage).filter(Boolean) as BoardPage[];
  if (!pages.length) return null;
  const requestedActive = stringOr(raw.activePageId, pages[0].id);
  return {
    id: stringOr(raw.id, "migrated_board"),
    title: stringOr(raw.title, "درس تفاعلي جديد"),
    version: numberOr(raw.version, 1),
    schemaVersion: EDUCATIONAL_OBJECT_SCHEMA_VERSION,
    pages,
    activePageId: pages.some((page) => page.id === requestedActive) ? requestedActive : pages[0].id,
    updatedAt: stringOr(raw.updatedAt, new Date().toISOString()),
  };
};

export const safeParseBoardDocument = (raw: string): BoardDocument | null => {
  try {
    return migrateBoardDocument(JSON.parse(raw));
  } catch {
    return null;
  }
};
