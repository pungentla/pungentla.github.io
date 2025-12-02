import React, { useState } from "react";

export default function StepFinal({
  onRestart,
  onPrev,
}: {
  onRestart: () => void;
  onPrev: () => void;
}) {
  const [hint, setHint] = useState(false);
  return (
    <div>
      <h2 className="title">生日快乐</h2>
      <div className="final-photo">
        <img src={require("../imgs/34.jpg")} alt="合照" />
      </div>
      {hint && (
        <div className="gift-hint">
          礼物线索：与你最近需要用到的东西有关，在途中
        </div>
      )}
      <div className="actions">
        <button className="btn" onClick={onPrev}>
          返回
        </button>
        <button className="btn primary" onClick={() => setHint(true)}>
          隐藏福利
        </button>
        <button className="btn" onClick={onRestart}>
          重新开始
        </button>
      </div>
    </div>
  );
}
