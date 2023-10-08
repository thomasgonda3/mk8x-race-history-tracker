import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Blog from "./components/Blog";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Instructions from "./components/Instructions";
import Player from "./components/Player";
import VideoPage from "./components/VideoPage";
import Popularity from "./components/Popularity";

function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Header />
      <div className="container">
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/scan" element={<VideoPage />} />
            <Route path="/stats" element={<Popularity />} />
            <Route path="/player/:playerID" element={<Player />} />
          </Routes>
        </Router>
      </div>
      <div className="p-5"></div>
      <Footer />
    </div>
  );
}

export default App;
