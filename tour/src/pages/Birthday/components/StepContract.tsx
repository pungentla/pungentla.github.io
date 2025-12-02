import React, { useState } from "react";
import { useBeep } from "./hooks";

export default function StepContract({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const [text, setText] = useState("");
  const [stamped, setStamped] = useState(false);
  const beep = useBeep();
  const valid = text.trim().length > 0;
  return (
    <div>
      <h2 className="title">夫妻快乐契约书</h2>
      <div className="contract">
        <h3>输入约定</h3>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="如：明年陪我吃遍全国小吃"
          required
        />
        {!valid && (
          <div style={{ marginTop: 6, fontSize: 12, color: "#c0392b" }}>
            请先填写约定
          </div>
        )}
        <div className="actions">
          <button className="btn" onClick={onPrev}>
            返回
          </button>
          <button
            className="btn primary"
            disabled={!valid}
            onClick={() => {
              setStamped(true);
              beep(220, 180, "square");
              setTimeout(onNext, 2500);
            }}
          >
            盖章生效
          </button>
        </div>
      </div>
      {stamped && <div className="sky">永远有效</div>}
      <div style={{ marginTop: 8 }}>
        {stamped ? <span className="stamp">已盖章</span> : null}
      </div>
    </div>
  );
}
