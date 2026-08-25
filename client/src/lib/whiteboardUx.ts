/**
 * Gate 3B UX domain helpers.
 * Keep layout actions pure and framework-independent; UI only coordinates selection and history.
 */
import type { CoreObject } from "@/lib/coreBoard";

export type Alignment = "left" | "center" | "right" | "top" | "middle" | "bottom";
export type LayerDirection = "front" | "back" | "forward" | "backward";

export function alignObjects(objects: CoreObject[], selectedIds: Set<string>, kind: Alignment): CoreObject[] {
  const selected = objects.filter((item) => selectedIds.has(item.id));
  if (selected.length < 2) return objects;
  const minX = Math.min(...selected.map((item) => item.position.x));
  const maxX = Math.max(...selected.map((item) => item.position.x + item.size.width));
  const minY = Math.min(...selected.map((item) => item.position.y));
  const maxY = Math.max(...selected.map((item) => item.position.y + item.size.height));
  return objects.map((item) => !selectedIds.has(item.id) ? item : { ...item, position: {
    x: kind === "left" ? minX : kind === "center" ? (minX + maxX - item.size.width) / 2 : kind === "right" ? maxX - item.size.width : item.position.x,
    y: kind === "top" ? minY : kind === "middle" ? (minY + maxY - item.size.height) / 2 : kind === "bottom" ? maxY - item.size.height : item.position.y,
  } });
}

export function distributeObjects(objects: CoreObject[], selectedIds: Set<string>, axis: "horizontal" | "vertical"): CoreObject[] {
  const selected = objects.filter((item) => selectedIds.has(item.id)).sort((a, b) => axis === "horizontal" ? a.position.x - b.position.x : a.position.y - b.position.y);
  if (selected.length < 3) return objects;
  const first = axis === "horizontal" ? selected[0].position.x : selected[0].position.y;
  const lastItem = selected[selected.length - 1];
  const last = axis === "horizontal" ? lastItem.position.x : lastItem.position.y;
  const step = (last - first) / (selected.length - 1);
  const positions = new Map(selected.map((item, index) => [item.id, first + step * index]));
  return objects.map((item) => !positions.has(item.id) ? item : { ...item, position: axis === "horizontal" ? { ...item.position, x: positions.get(item.id)! } : { ...item.position, y: positions.get(item.id)! } });
}

export function reorderObject(objects: CoreObject[], selectedId: string, direction: LayerDirection): CoreObject[] {
  const currentIndex = objects.findIndex((item) => item.id === selectedId);
  if (currentIndex < 0) return objects;
  const target = direction === "front" ? objects.length - 1 : direction === "back" ? 0 : direction === "forward" ? Math.min(objects.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
  if (target === currentIndex) return objects;
  const next = [...objects];
  const [item] = next.splice(currentIndex, 1);
  next.splice(target, 0, item);
  return next.map((entry, index) => ({ ...entry, zIndex: index + 1 }));
}
