import React, { useEffect, useState } from "react";
import { useBeep, useMicBlow } from "./hooks";

export default function StepCake({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const [candles, setCandles] = useState<boolean[]>(() =>
    Array.from({ length: 31 }, () => true)
  );
  const { start, enabled } = useMicBlow(() =>
    setCandles((arr) => arr.map(() => false))
  );
  const beep = useBeep();
  const offCount = candles.filter((c) => !c).length;
  useEffect(() => {
    if (offCount === candles.length) setTimeout(onNext, 800);
  }, [offCount, candles.length, onNext]);
  const swipeBlow = () =>
    setCandles((arr) => arr.map((v, i) => (i % 2 === 0 ? false : v)));
  return (
    <div>
      <h2 className="title">吹灭 31 根蜡烛</h2>
      <div className="cake">
        <div className="candles">
          {candles.map((on, i) => (
            <div
              key={i}
              className={`candle ${on ? "" : "off"}`}
              onClick={() => {
                setCandles((arr) => arr.map((v, k) => (k === i ? false : v)));
                beep(300 + (i % 5) * 40, 80, "sine");
              }}
            >
              <div className="flame" />
            </div>
          ))}
        </div>
      </div>
      <div className="blow-hint">对着麦克风吹灭或滑动屏幕模拟吹灭</div>
      <div className="actions">
        <button className="btn" onClick={onPrev}>
          返回
        </button>
        <button className="btn" onClick={swipeBlow}>
          滑动吹灭
        </button>
        <button
          className="btn primary"
          onClick={() => start()}
          disabled={enabled}
        >
          开启麦克风
        </button>
      </div>
    </div>
  );
}
