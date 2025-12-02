import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <h1 className="title">Welcome</h1>
        <p className="subtitle">请选择一个页面开始浏览</p>
        <div className="welcome-actions">
          <Link className="btn" to="/tour">前往 Tour</Link>
          <Link className="btn primary" to="/birthday">前往 Birthday</Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
