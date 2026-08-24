/**
 * Gate 2 Core Board domain contract.
 * Vendor-neutral objects and persistence; canvas libraries must remain adapters.
 */
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
  | "GraphObject";

export type Stroke = { points: Array<{ x: number; y: number }>; color: string; width: number; tool: "pen" | "highlighter" | "eraser" };

export type CoreObject = {
  id: string;
  type: CoreObjectType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zIndex: number;
  content: string;
  style: { color: string; background: string; fontSize: number; align: "left" | "center" | "right" };
  metadata: { label: string; source: "teacher" | "placeholder"; locked: boolean; visible: boolean; version: number };
  stroke?: Stroke;
  childIds?: string[];
  children?: CoreObject[];
};

export type BoardPage = { id: string; name: string; objects: CoreObject[]; viewport: { x: number; y: number; zoom: number } };
export type BoardDocument = { id: string; title: string; version: number; pages: BoardPage[]; activePageId: string; updatedAt: string };

export const STORAGE_KEY = "gate2-core-board-document";
export const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;

export const createObject = (type: CoreObjectType, content: string, x: number, y: number): CoreObject => ({
  id: uid(type.toLowerCase().replace("object", "")), type, position: { x, y }, size: { width: type === "SentenceObject" ? 280 : 180, height: 82 }, rotation: 0, zIndex: 1, content,
  style: { color: "#2d3d34", background: "#fbfaf6", fontSize: type === "EquationObject" ? 24 : 16, align: "left" },
  metadata: { label: type, source: "teacher", locked: false, visible: true, version: 1 },
});

export const createPage = (name: string, objects: CoreObject[] = []): BoardPage => ({ id: uid("page"), name, objects, viewport: { x: 0, y: 0, zoom: 1 } });
export const createDocument = (): BoardDocument => { const page = createPage("Page 1", [createObject("TextObject", "اكتب فكرة الدرس هنا", 44, 54)]); return { id: uid("board"), title: "درس تفاعلي جديد", version: 1, pages: [page], activePageId: page.id, updatedAt: new Date().toISOString() }; };
export const getActivePage = (document: BoardDocument) => document.pages.find((page) => page.id === document.activePageId) ?? document.pages[0];
export const cloneDocument = (document: BoardDocument): BoardDocument => JSON.parse(JSON.stringify(document)) as BoardDocument;
export const persistDocument = (document: BoardDocument) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...document, updatedAt: new Date().toISOString() }));
export const restoreDocument = (): BoardDocument | null => { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return null; try { return JSON.parse(raw) as BoardDocument; } catch { return null; } };
