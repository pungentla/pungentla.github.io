import React from "react";

function Birthday() {
  return (
    <div className="birthday-page">
      <div className="birthday-card">
        <h1 className="title">Happy Birthday! 🎉</h1>
        <p className="subtitle">愿你今天与未来都闪闪发光</p>
        <div className="candles">
          <span className="candle" />
          <span className="candle" />
          <span className="candle" />
        </div>
      </div>
    </div>
  );
}

export default Birthday;
