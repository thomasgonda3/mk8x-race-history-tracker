import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import VideoScan from "./VideoScan";
import VideoMain from "./VideoMain";
import VideoSettings from "./VideoSettings";

const VideoPage = () => {
  const [trackData, setTrackData] = useState([]);
  return (
    <div>
      <VideoScan setTrackData={setTrackData} />
      <Tabs defaultActiveKey="main" id="navigation-tab" className="m-3">
        <Tab eventKey="main" title="Main">
          <VideoMain trackData={trackData} />
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <VideoSettings />
        </Tab>
      </Tabs>
    </div>
  );
};

export default VideoPage;
