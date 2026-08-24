/**
 * Gate 1B candidate bench.
 * The frozen SentenceObject stays outside each library; candidates receive only a view payload.
 * tldraw and Excalidraw are represented as lightweight adapter probes in this disposable build;
 * React Flow is exercised as the specialized graph candidate.
 */
import { useMemo, useState } from "react";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type Candidate = "tldraw" | "excalidraw" | "react-flow";
const frozenObject = { id: "sentence_obj_01", type: "SentenceObject", sentence: "قرأَ الطالبُ الكتابَ", selectedWord: "الطالبُ", analysis: { role: "فاعل", state: "مرفوع" }, source: "نص المعلم — المثال الحتمي", status: "HIGH_CONFIDENCE" };
const graphNodes = [
  { id: "root", position: { x: 140, y: 0 }, data: { label: "الجملة" }, type: "default" },
  { id: "verb", position: { x: 0, y: 110 }, data: { label: "قرأَ · فعل ماضٍ" }, type: "default" },
  { id: "subject", position: { x: 140, y: 110 }, data: { label: "الطالبُ · فاعل" }, type: "default" },
  { id: "object", position: { x: 280, y: 110 }, data: { label: "الكتابَ · مفعول" }, type: "default" },
];
const graphEdges = [{ id: "e1", source: "root", target: "verb" }, { id: "e2", source: "root", target: "subject" }, { id: "e3", source: "root", target: "object" }];

export default function CandidateBench() {
  const [candidate, setCandidate] = useState<Candidate>("tldraw");
  const tabs = useMemo(() => [
    { id: "tldraw" as const, label: "tldraw", detail: "Canvas probe" },
    { id: "excalidraw" as const, label: "Excalidraw", detail: "Canvas probe" },
    { id: "react-flow" as const, label: "React Flow", detail: "Graph probe" },
  ], []);
  const isCanvasProbe = candidate !== "react-flow";
  return (
    <section className="candidate-bench" dir="ltr">
      <div className="bench-header"><div><span className="kicker">03 / Candidate bench</span><h2>نفس الكائن · ثلاث مكتبات</h2><p>اختبار عزل المرشح عن نموذج المجال، لا بناء ثلاث نسخ من المنتج.</p></div><div className="bench-object"><span>FROZEN DOMAIN OBJECT</span><strong>{frozenObject.id}</strong><small>{frozenObject.sentence}</small></div></div>
      <div className="architecture-strip" aria-label="Recommended adapter architecture"><span>SentenceObject</span><i>↓</i><div><b>Canvas Adapter</b><small>tldraw · Excalidraw</small></div><em>↔</em><div><b>Graph Adapter</b><small>React Flow</small></div></div>
      <div className="bench-tabs" role="tablist">{tabs.map((tab) => <button key={tab.id} role="tab" aria-selected={candidate === tab.id} className={candidate === tab.id ? "bench-tab active" : "bench-tab"} onClick={() => setCandidate(tab.id)}><strong>{tab.label}</strong><span>{tab.detail}</span></button>)}</div>
      <div className="bench-stage">
        {candidate === "react-flow" ? <div className="candidate-surface flow-surface"><ReactFlow nodes={graphNodes} edges={graphEdges} fitView proOptions={{ hideAttribution: true }}><Background color="#b8c1b5" gap={20} /><Controls /></ReactFlow></div> : <div className="candidate-surface library-probe"><div className="probe-grid"><span className="probe-pill">{candidate} package probe</span><span className="probe-check">same SentenceObject</span><span className="probe-check">same source / identity</span><span className="probe-check">adapter boundary required</span><span className="probe-check">production license review</span></div><div className="probe-caption">Canvas integration checkpoint<br /><strong>library surface intentionally isolated</strong></div></div>}
        <div className="bench-overlay" dir="rtl"><span className="object-type">ADAPTER PAYLOAD</span><strong>{frozenObject.selectedWord}</strong><span>{frozenObject.analysis.role} · {frozenObject.analysis.state}</span><small>{isCanvasProbe ? "نفس الكائن · Canvas Adapter probe" : "نفس الكائن · Graph Adapter فعلي"}</small></div>
      </div>
      <div className="bench-footer"><span>candidate: <b>{candidate}</b></span><span>domain changes: <b>0</b></span><span>serialization owner: <b>application</b></span></div>
    </section>
  );
}
