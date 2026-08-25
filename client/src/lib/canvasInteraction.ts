/**
 * Gate 11 interaction contract.
 * Design reminder: the calm paper-and-olive workspace stays RTL and canvas-first;
 * this module is framework-independent and owns no second object, selection, or history model.
 */
import { cloneDocument, createObject, resizeObject, type BoardDocument, type CoreObject, type CoreObjectType } from "./coreBoard";
import { hasCapability } from "./educationalObjects";
import { reorderObject, type LayerDirection } from "./whiteboardUx";

export type SelectionState = { ids: string[]; primaryId: string | null };
export type ResizeCorner = "tl" | "tr" | "bl" | "br";

export const emptySelection = (): SelectionState => ({ ids: [], primaryId: null });

export function selectObjects(current: readonly string[], id: string | null, additive = false): SelectionState {
  if (!id) return emptySelection();
  const next = additive
    ? current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    : [id];
  return { ids: next, primaryId: next.at(-1) ?? null };
}

export function sanitizeSelection(page: { objects: readonly CoreObject[] }, selection: SelectionState): SelectionState {
  const valid = new Set(page.objects.map((object) => object.id));
  const ids = selection.ids.filter((id) => valid.has(id));
  return { ids, primaryId: ids.includes(selection.primaryId ?? "") ? selection.primaryId : ids.at(-1) ?? null };
}

export function objectsForSelection(objects: readonly CoreObject[], selection: SelectionState): CoreObject[] {
  const ids = new Set(selection.ids);
  return objects.filter((object) => ids.has(object.id));
}

export function hitTestObjects(objects: readonly CoreObject[], point: { x: number; y: number }): CoreObject | null {
  return [...objects]
    .filter((object) => object.metadata.visible && point.x >= object.position.x && point.x <= object.position.x + object.size.width && point.y >= object.position.y && point.y <= object.position.y + object.size.height)
    .sort((a, b) => b.zIndex - a.zIndex)[0] ?? null;
}

export function moveObjects(objects: readonly CoreObject[], ids: readonly string[], dx: number, dy: number): CoreObject[] {
  const selected = new Set(ids);
  return objects.map((object) => selected.has(object.id) && !object.metadata.locked && hasCapability(object, "movable")
    ? { ...object, position: { x: Math.max(0, object.position.x + dx), y: Math.max(0, object.position.y + dy) }, updatedAt: new Date().toISOString() }
    : object);
}

export function resizeObjectFromCorner(object: CoreObject, corner: ResizeCorner, dx: number, dy: number): CoreObject {
  if (object.metadata.locked || !hasCapability(object, "resizable")) return object;
  const width = corner.includes("l") ? object.size.width - dx : object.size.width + dx;
  const height = corner.includes("t") ? object.size.height - dy : object.size.height + dy;
  const resized = resizeObject(object, width, height);
  const nextX = corner.includes("l") ? object.position.x + (object.size.width - resized.size.width) : object.position.x;
  const nextY = corner.includes("t") ? object.position.y + (object.size.height - resized.size.height) : object.position.y;
  return { ...resized, position: { x: Math.max(0, nextX), y: Math.max(0, nextY) } };
}

export function patchObject(objects: readonly CoreObject[], id: string, patch: Partial<CoreObject>): CoreObject[] {
  return objects.map((object) => object.id === id && !object.metadata.locked ? { ...object, ...patch, updatedAt: new Date().toISOString() } : object);
}

export function deleteObjects(objects: readonly CoreObject[], ids: readonly string[]): CoreObject[] {
  const selected = new Set(ids);
  return objects.filter((object) => !selected.has(object.id) || object.metadata.locked);
}

export function duplicateObjects(objects: readonly CoreObject[], ids: readonly string[], idFactory: (type: CoreObjectType, index: number) => string): CoreObject[] {
  const selected = new Set(ids);
  const copies = objects.filter((object) => selected.has(object.id) && hasCapability(object, "duplicable")).map((object, index) => {
    const copy = createObject(object.type, object.data ?? object.content, object.position.x + 24, object.position.y + 24);
    return { ...copy, id: idFactory(object.type, index), size: { ...object.size }, style: { ...object.style }, metadata: { ...object.metadata, version: object.metadata.version + 1, duplicatedFrom: object.id }, capabilities: [...object.capabilities], source: object.source, zIndex: object.zIndex + 1, stroke: object.stroke, children: object.children?.map((child) => ({ ...child })), childIds: object.childIds ? [...object.childIds] : undefined };
  });
  return [...objects, ...copies];
}

export function groupObjects(document: BoardDocument, pageId: string, ids: readonly string[], groupId: string): BoardDocument {
  const page = document.pages.find((candidate) => candidate.id === pageId);
  if (!page) return document;
  const chosen = objectsForSelection(page.objects, { ids: [...ids], primaryId: ids.at(-1) ?? null }).filter((object) => hasCapability(object, "groupable"));
  if (chosen.length < 2) return document;
  const position = { x: Math.min(...chosen.map((object) => object.position.x)), y: Math.min(...chosen.map((object) => object.position.y)) };
  const group = createObject("GroupObject", `${chosen.length} عناصر`, position.x, position.y);
  group.id = groupId;
  group.size = { width: Math.max(...chosen.map((object) => object.position.x + object.size.width)) - position.x, height: Math.max(...chosen.map((object) => object.position.y + object.size.height)) - position.y };
  group.childIds = chosen.map((object) => object.id);
  group.children = cloneDocument({ ...document, pages: [{ ...page, objects: chosen }] }).pages[0].objects.map((child) => ({ ...child, position: { x: child.position.x - position.x, y: child.position.y - position.y } }));
  return { ...document, pages: document.pages.map((candidate) => candidate.id === pageId ? { ...candidate, objects: [...candidate.objects.filter((object) => !ids.includes(object.id)), group] } : candidate), version: document.version + 1 };
}

export function ungroupObject(objects: readonly CoreObject[], groupId: string): CoreObject[] {
  const group = objects.find((object) => object.id === groupId);
  if (!group || group.type !== "GroupObject" || !group.children?.length) return [...objects];
  const children = group.children.map((child) => ({ ...child, position: { x: child.position.x + group.position.x, y: child.position.y + group.position.y } }));
  return [...objects.filter((object) => object.id !== groupId), ...children].sort((a, b) => a.zIndex - b.zIndex);
}

export function reorderObjects(objects: readonly CoreObject[], id: string, direction: LayerDirection): CoreObject[] {
  return reorderObject([...objects], id, direction);
}

export function applyPageObjects(document: BoardDocument, pageId: string, objects: CoreObject[]): BoardDocument {
  return { ...document, pages: document.pages.map((page) => page.id === pageId ? { ...page, objects } : page), updatedAt: new Date().toISOString() };
}
