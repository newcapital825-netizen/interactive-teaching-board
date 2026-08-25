/**
 * Gate 11 compatibility shim.
 * Design reminder: the paper-and-olive canvas has one canonical interaction layer;
 * legacy imports resolve to TeacherCanvas rather than maintaining a second model.
 */
export { default } from "./TeacherCanvas";
