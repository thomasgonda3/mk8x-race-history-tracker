import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Player from "./components/Player";
import Instructions from "./components/Instructions";

function App() {
  return (
    <div>
      <Header />
      <div className="container">
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/player/:playerID" element={<Player />} />
            <Route path="/instructions" element={<Instructions />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
