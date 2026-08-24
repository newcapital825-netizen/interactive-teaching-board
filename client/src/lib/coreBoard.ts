/**
 * Gate 3A Core Board bridge.
 * The board keeps its Gate 2 shape while registered educational objects remain framework-independent.
 */
import { createRegisteredEducationalObject } from "./objectRegistry";
import { safeParseBoardDocument } from "./objectMigrations";
import type { EducationalCapability, ObjectSource } from "./educationalObjects";

export type CoreObjectType =
  | "TextObject"
  | "DrawingObject"
  | "ShapeObject"
  | "ImageObject"
  | "MediaObject"
  | "PDFObject"
  | "TableObject"
  | "StickyNoteObject"
  | "ConnectorObject"
  | "GroupObject"
  | "SentenceObject"
  | "EquationObject"
  | "GraphObject"
  | "QuestionObject"
  | "ActivityObject"
  | (string & {});

export type Stroke = { points: Array<{ x: number; y: number }>; color: string; width: number; tool: "pen" | "highlighter" | "eraser" };

export type CoreObject = {
  id: string;
  type: CoreObjectType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zIndex: number;
  content: string;
  data?: unknown;
  style: { color: string; background: string; fontSize: number; align: "left" | "center" | "right" };
  metadata: { label: string; source: "teacher" | "placeholder"; locked: boolean; visible: boolean; version: number; [key: string]: unknown };
  capabilities: readonly EducationalCapability[];
  schemaVersion: number;
  transform: { rotation: number };
  source?: ObjectSource;
  createdAt: string;
  updatedAt: string;
  stroke?: Stroke;
  childIds?: string[];
  children?: CoreObject[];
};

export type BoardPage = { id: string; name: string; objects: CoreObject[]; viewport: { x: number; y: number; zoom: number } };
export type BoardDocument = { id: string; title: string; version: number; schemaVersion: number; pages: BoardPage[]; activePageId: string; updatedAt: string };

export const STORAGE_KEY = "gate2-core-board-document";
export const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;

const displayContent = (content: unknown) => typeof content === "string" ? content : JSON.stringify(content);

export const createObject = (type: CoreObjectType, content: unknown, x: number, y: number): CoreObject => {
  const educational = createRegisteredEducationalObject(type, content, x, y, uid(type.toLowerCase().replace("object", "")));
  return {
    id: educational.id,
    type: educational.type,
    position: educational.position,
    size: educational.dimensions,
    rotation: educational.transform.rotation,
    zIndex: educational.zIndex,
    content: displayContent(educational.content),
    data: typeof educational.content === "string" ? undefined : educational.content,
    style: { color: "#2d3d34", background: "#fbfaf6", fontSize: type === "EquationObject" ? 24 : 16, align: "left" },
    metadata: { label: String(educational.metadata.label ?? type), source: educational.source?.kind === "teacher" ? "teacher" : "placeholder", locked: educational.locked, visible: educational.visible, version: educational.version, renderer: educational.metadata.renderer },
    capabilities: educational.capabilities,
    schemaVersion: educational.schemaVersion,
    transform: educational.transform,
    source: educational.source,
    createdAt: educational.createdAt,
    updatedAt: educational.updatedAt,
  };
};

export const createPage = (name: string, objects: CoreObject[] = []): BoardPage => ({ id: uid("page"), name, objects, viewport: { x: 0, y: 0, zoom: 1 } });
export const createDocument = (): BoardDocument => { const page = createPage("Page 1", [createObject("TextObject", "اكتب فكرة الدرس هنا", 44, 54)]); return { id: uid("board"), title: "درس تفاعلي جديد", version: 1, schemaVersion: 2, pages: [page], activePageId: page.id, updatedAt: new Date().toISOString() }; };
export const getActivePage = (document: BoardDocument) => document.pages.find((page) => page.id === document.activePageId) ?? document.pages[0];
export const cloneDocument = (document: BoardDocument): BoardDocument => JSON.parse(JSON.stringify(document)) as BoardDocument;
export const persistDocument = (document: BoardDocument) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...document, updatedAt: new Date().toISOString() })); return { ok: true as const }; }
  catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : "Unknown persistence error" }; }
};
export const restoreDocument = (): BoardDocument | null => { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? safeParseBoardDocument(raw) : null; } catch { return null; } };

export type ResizeCorner = "tl" | "tr" | "bl" | "br";

export const resizeObject = (object: CoreObject, width: number, height: number): CoreObject => {
  const nextWidth = Math.max(80, width);
  const nextHeight = Math.max(50, height);
  if (object.type !== "GroupObject" || !object.children?.length) return { ...object, size: { width: nextWidth, height: nextHeight }, updatedAt: new Date().toISOString() };
  const scaleX = object.size.width ? nextWidth / object.size.width : 1;
  const scaleY = object.size.height ? nextHeight / object.size.height : 1;
  return {
    ...object,
    size: { width: nextWidth, height: nextHeight },
    updatedAt: new Date().toISOString(),
    children: object.children.map((child) => ({
      ...child,
      position: { x: child.position.x * scaleX, y: child.position.y * scaleY },
      size: { width: Math.max(40, child.size.width * scaleX), height: Math.max(32, child.size.height * scaleY) },
    })),
  };
};
