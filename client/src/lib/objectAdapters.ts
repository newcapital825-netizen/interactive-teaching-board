/**
 * Gate 3A adapter boundaries.
 * Adapters translate plain educational data to a renderer; they do not enter the domain model.
 */
import type { EducationalObject } from "./educationalObjects";
import type { ConceptGraphContent, ObjectRendererKind } from "./objectRegistry";

export type CanvasRepresentation = {
  objectId: string;
  renderer: ObjectRendererKind;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  rotation: number;
  visible: boolean;
  locked: boolean;
  displayContent: unknown;
};

export type CanvasAdapter = {
  toCanvasRepresentation: (object: EducationalObject) => CanvasRepresentation;
  fromCanvasRepresentation: (representation: CanvasRepresentation, original: EducationalObject) => EducationalObject;
};

export type GraphRepresentation = {
  graphObjectId: string;
  nodes: ConceptGraphContent["nodes"];
  edges: ConceptGraphContent["edges"];
};

export type GraphAdapter = {
  toGraphRepresentation: (object: EducationalObject<"GraphObject", ConceptGraphContent>) => GraphRepresentation;
};

export const createCanvasRepresentation = (object: EducationalObject): CanvasRepresentation => ({
  objectId: object.id,
  renderer: "unknown",
  position: object.position,
  dimensions: object.dimensions,
  rotation: object.transform.rotation,
  visible: object.visible,
  locked: object.locked,
  displayContent: object.content,
});

export const createGraphRepresentation = (object: EducationalObject<"GraphObject", ConceptGraphContent>): GraphRepresentation => ({
  graphObjectId: object.id,
  nodes: object.content.nodes,
  edges: object.content.edges,
});

export const applyCanvasRepresentation = (representation: CanvasRepresentation, original: EducationalObject): EducationalObject => ({
  ...original,
  position: representation.position,
  dimensions: representation.dimensions,
  transform: { rotation: representation.rotation },
  visible: representation.visible,
  locked: representation.locked,
  updatedAt: new Date().toISOString(),
});
