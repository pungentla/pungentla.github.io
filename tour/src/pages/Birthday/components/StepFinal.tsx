import React, { useState } from "react";

export default function StepFinal({
  onRestart,
  onPrev,
}: {
  onRestart: () => void;
  onPrev: () => void;
}) {
  const [hint, setHint] = useState(false);
  const bursts = Array.from({ length: 14 });
  return (
    <div className="final-wrap">
      <div className="final-fireworks">
        {bursts.map((_, i) => (
          <span
            key={i}
            className="burst"
            style={{
              left: `${10 + (i % 7) * 12}%`,
              top: `${10 + (i % 5) * 16}%`,
              animationDelay: `${(i % 7) * 0.2}s`,
            }}
          />
        ))}
      </div>
      <h2 className="title">生日快乐🎉🎉</h2>
      <div className="final-photo">
        <img src={require("../imgs/34.jpg")} alt="合照" />
      </div>
      {hint && (
        <div className="gift-hint">
          礼物线索：与你最近需要用到的东西有关，在途中
        </div>
      )}
      <div className="marquee">
        <div className="marquee-track">
          🎉 Happy Birthday · 1994 限定款老公 · 生日快乐呀 · Love U · 🎉 Happy
          Birthday · 1994 限定款老公 · 生日快乐呀 · Love U · 🎉
        </div>
      </div>
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
