/* Gate 10 reminder: this is a strict transfer/recovery codec over canonical BoardDocument, not a second persistence engine. */
import { safeParseBoardDocument } from "./objectMigrations";
import { type BoardDocument, type CoreObject } from "./coreBoard";

export const LESSON_TRANSFER_FORMAT = "medad-lesson" as const;
export const LESSON_TRANSFER_VERSION = 1 as const;
export const RECOVERY_STORAGE_KEY = "gate10-core-board-recovery";

export type LessonTransferEnvelope = { format: typeof LESSON_TRANSFER_FORMAT; formatVersion: typeof LESSON_TRANSFER_VERSION; document: BoardDocument };
const unsafeKeys = new Set(["__proto__", "constructor", "prototype"]);
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const containsUnsafeKey = (value: unknown): boolean => Array.isArray(value) ? value.some(containsUnsafeKey) : isRecord(value) && Object.entries(value).some(([key, nested]) => unsafeKeys.has(key) || containsUnsafeKey(nested));
const collectObjectIds = (object: CoreObject, ids: Set<string>): boolean => { if (!object.id || ids.has(object.id) || !isRecord(object.metadata)) return false; ids.add(object.id); return object.children ? object.children.every((child) => collectObjectIds(child, ids)) : true; };
const isStrictDocument = (document: BoardDocument): boolean => {
  if (!document.id || !document.title || !Array.isArray(document.pages) || !document.pages.length || !document.activePageId) return false;
  const ids = new Set<string>([document.id]);
  if (ids.has(document.activePageId)) return false;
  for (const page of document.pages) { if (!page.id || ids.has(page.id) || !page.name || !Array.isArray(page.objects)) return false; ids.add(page.id); for (const object of page.objects) if (!collectObjectIds(object, ids)) return false; }
  return document.pages.some((page) => page.id === document.activePageId);
};

export const exportLesson = (document: BoardDocument): string => {
  if (!isStrictDocument(document)) throw new Error("Cannot export an invalid lesson document");
  const envelope: LessonTransferEnvelope = { format: LESSON_TRANSFER_FORMAT, formatVersion: LESSON_TRANSFER_VERSION, document: JSON.parse(JSON.stringify(document)) as BoardDocument };
  return JSON.stringify(envelope, null, 2);
};

export const importLesson = (payload: string): BoardDocument | null => {
  try {
    const parsed: unknown = JSON.parse(payload);
    if (containsUnsafeKey(parsed) || !isRecord(parsed) || parsed.format !== LESSON_TRANSFER_FORMAT || parsed.formatVersion !== LESSON_TRANSFER_VERSION || !isRecord(parsed.document)) return null;
    const document = safeParseBoardDocument(JSON.stringify(parsed.document));
    return document && isStrictDocument(document) ? document : null;
  } catch { return null; }
};

export const saveRecoverySnapshot = (document: BoardDocument): { ok: true } | { ok: false; error: string } => { try { localStorage.setItem(RECOVERY_STORAGE_KEY, exportLesson(document)); return { ok: true }; } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Recovery write failed" }; } };
export const readRecoverySnapshot = (): BoardDocument | null => { try { const raw = localStorage.getItem(RECOVERY_STORAGE_KEY); return raw ? importLesson(raw) : null; } catch { return null; } };
export const clearRecoverySnapshot = (): void => { try { localStorage.removeItem(RECOVERY_STORAGE_KEY); } catch { /* unavailable storage is reported by caller */ } };
