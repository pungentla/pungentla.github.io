import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
const Tour = React.lazy(() => import("./pages/Tour"));
const WelcomePage = React.lazy(() => import("./pages/Welcome"));

function App() {
  return (
    <div className="App">
      {/* <nav className="app-nav">
        <div className="brand">Guide</div>
        <div className="links">
          <Link to="/tour">Tour</Link>
          <Link to="/birthday">Birthday</Link>
        </div>
      </nav> */}
      <main className="app-main">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/tour" replace />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="*" element={<WelcomePage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
