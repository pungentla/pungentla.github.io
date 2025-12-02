import React, { useState } from "react";
import { useBeep } from "./hooks";

export default function StepEnvelope({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false);
  const beep = useBeep();
  return (
    <div>
      <h2 className="title">1994 限定款老公，生日快乐呀！</h2>
      <p className="subtitle">致 1994.12.03 出厂的宝藏男孩</p>
      <div className={`envelope ${open ? "env-open" : ""}`}>
        <div className="env-body" />
        <div className="env-flap" />
        <div className="env-label">
          <div>
            <div>你的专属生日盲盒已上线</div>
            <div>点击拆开，看看我们的快乐瞬间</div>
          </div>
        </div>
        <div className="smiles">
          <div className="smile" />
          <div className="smile" />
          <div className="smile" />
        </div>
      </div>
      <div className="actions">
        <button className="btn primary" onClick={() => { setOpen(true); beep(700, 120, "square"); setTimeout(onStart, 700); }}>拆开</button>
      </div>
    </div>
  );
}
