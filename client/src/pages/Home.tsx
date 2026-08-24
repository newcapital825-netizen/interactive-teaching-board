/**
 * Gate 3B Universal Whiteboard entry point.
 * UX reminder: teacher-facing workspace first; subject engines and architecture proofs stay out of the primary experience.
 */
import { Hand, ShieldCheck } from "lucide-react";
import CoreBoardBench from "@/components/CoreBoardBench";

export default function Home() {
  return <main dir="rtl" className="spike-shell gate3b-shell">
    <header className="topbar gate3b-topbar">
      <div className="brand-lockup">
        <div className="brand-mark gate3b-mark" aria-hidden="true"><span /></div>
        <div><span className="eyebrow">INTERACTIVE TEACHING BOARD</span><h1>مساحة التدريس التفاعلية</h1></div>
      </div>
      <div className="topbar-status"><span className="status-dot" /><span>محفوظ محليًا عند الطلب</span><strong><ShieldCheck size={12} /> مساحة آمنة</strong></div>
    </header>
    <CoreBoardBench />
    <footer className="bottom-bar gate3b-bottom"><span><Hand size={14} /> صُممت للتدريس باللمس ولوحة المفاتيح</span><span>إنشاء · تنظيم · شرح · حفظ · تقديم</span><span>Universal Whiteboard · Gate 3B</span></footer>
  </main>;
}
