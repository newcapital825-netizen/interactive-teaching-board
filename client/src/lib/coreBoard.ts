/**
 * Gate 3A Core Board bridge.
 * The board keeps its Gate 2 shape while registered educational objects remain framework-independent.
 */
import { createRegisteredEducationalObject } from "./objectRegistry";
import { safeParseBoardDocument } from "./objectMigrations";
import type { EducationalCapability, ObjectSource } from "./educationalObjects";
import type { ClassroomLessonState } from "./classroomLoop";

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
export type BoardDocument = { id: string; title: string; version: number; schemaVersion: number; pages: BoardPage[]; activePageId: string; updatedAt: string; classroom?: ClassroomLessonState };

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


/* Gate 9 lesson builder: page and lesson operations stay pure over BoardDocument and preserve canonical object metadata. */
export const renamePage = (document: BoardDocument, pageId: string, name: string): BoardDocument => ({ ...document, pages: document.pages.map((page) => page.id === pageId ? { ...page, name: name.trim() || page.name } : page), version: document.version + 1 });
export const reorderPage = (document: BoardDocument, pageId: string, toIndex: number): BoardDocument => { const pages = [...document.pages]; const from = pages.findIndex((page) => page.id === pageId); if (from < 0) return document; const [page] = pages.splice(from, 1); pages.splice(Math.max(0, Math.min(toIndex, pages.length)), 0, page); return { ...document, pages, version: document.version + 1 }; };
export const duplicatePage = (document: BoardDocument, pageId: string): BoardDocument => { const source = document.pages.find((page) => page.id === pageId); if (!source) return document; const copy = createPage(`${source.name} · نسخة`, source.objects.map((object) => ({ ...object, id: uid(`${object.type.toLowerCase()}_copy`), metadata: { ...object.metadata, sourceObjectId: object.id } }))); const index = document.pages.findIndex((page) => page.id === pageId); const pages = [...document.pages]; pages.splice(index + 1, 0, copy); return { ...document, pages, activePageId: copy.id, version: document.version + 1 }; };
export const deletePage = (document: BoardDocument, pageId: string): BoardDocument => { if (document.pages.length <= 1) return document; const index = document.pages.findIndex((page) => page.id === pageId); if (index < 0) return document; const pages = document.pages.filter((page) => page.id !== pageId); const activePageId = document.activePageId === pageId ? pages[Math.max(0, index - 1)]?.id ?? pages[0].id : document.activePageId; return { ...document, pages, activePageId, version: document.version + 1 }; };
export const copyObjectBetweenPages = (document: BoardDocument, objectId: string, fromPageId: string, toPageId: string): BoardDocument => { const sourcePage = document.pages.find((page) => page.id === fromPageId); const targetPage = document.pages.find((page) => page.id === toPageId); const source = sourcePage?.objects.find((object) => object.id === objectId); if (!source || !targetPage || fromPageId === toPageId) return document; const copy = { ...source, id: uid(`${source.type.toLowerCase()}_copy`), position: { x: source.position.x + 24, y: source.position.y + 24 }, metadata: { ...source.metadata, sourceObjectId: source.id } }; return { ...document, pages: document.pages.map((page) => page.id === toPageId ? { ...page, objects: [...page.objects, copy] } : page), version: document.version + 1 }; };
export const duplicateDocument = (document: BoardDocument): BoardDocument => { const pageMap = new Map(document.pages.map((page) => [page.id, uid("page_copy")])); const objectMap = new Map(document.pages.flatMap((page) => page.objects.map((object) => [object.id, uid(`${object.type.toLowerCase()}_copy`)] as const))); const pages = document.pages.map((page) => ({ ...page, id: pageMap.get(page.id)!, objects: page.objects.map((object) => ({ ...object, id: objectMap.get(object.id)!, metadata: { ...object.metadata, sourceObjectId: object.id } })) })); return { ...document, id: uid("board_copy"), title: `${document.title} · نسخة`, pages, activePageId: pageMap.get(document.activePageId) ?? pages[0].id, version: document.version + 1, updatedAt: new Date().toISOString() }; };
