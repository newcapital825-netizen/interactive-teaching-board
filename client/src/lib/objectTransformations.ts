/**
 * Gate 3A controlled transformation foundation.
 * A transformation describes a representation request; it does not clone or solve subject content.
 */
import type { EducationalObject } from "./educationalObjects";

export type RepresentationKind = "visual" | "graph" | "activity";
export type TransformationRequest = {
  sourceObjectId: string;
  sourceType: string;
  representation: RepresentationKind;
  reason: "render" | "inspect" | "teach" | "assess";
};

export type TransformationResult = {
  sourceObjectId: string;
  sourceType: string;
  representation: RepresentationKind;
  status: "described";
  payload: { kind: RepresentationKind; sourceObjectId: string; content: unknown };
};

export const describeTransformation = (object: EducationalObject, request: TransformationRequest): TransformationResult => {
  if (request.sourceObjectId !== object.id || request.sourceType !== object.type) throw new Error("Transformation request does not match source object");
  return {
    sourceObjectId: object.id,
    sourceType: object.type,
    representation: request.representation,
    status: "described",
    payload: { kind: request.representation, sourceObjectId: object.id, content: object.content },
  };
};

export const supportedRepresentations = (type: string): readonly RepresentationKind[] => {
  if (type === "SentenceObject" || type === "EquationObject") return ["visual", "activity"];
  if (type === "GraphObject") return ["visual", "graph", "activity"];
  return ["visual"];
};
