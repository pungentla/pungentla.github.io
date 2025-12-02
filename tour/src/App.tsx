import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Tour from "./pages/Tour";
import BirthdayPage from "./pages/Birthday";
import WelcomePage from "./pages/Welcome";

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
        <Routes>
          <Route path="/" element={<Navigate to="/tour" replace />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/birthday" element={<BirthdayPage />} />
          <Route path="*" element={<WelcomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
