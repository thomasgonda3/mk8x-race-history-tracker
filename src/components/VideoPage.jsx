import React, { useState, useRef } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import VideoScan from "./VideoScan";
import VideoMain from "./VideoMain";
import VideoSettings from "./VideoSettings";
import VideoSubmit from "./VideoSubmit";

const VideoPage = () => {
  const trackDataRef = useRef([]);
  const [trackData, setTrackData] = useState([]);
  const [displayVideo, setDisplayVideo] = useState("show");
  const [screenshotSize, setScreenshotSize] = useState("M");

  return (
    <div>
      <VideoScan
        setTrackData={setTrackData}
        trackDataRef={trackDataRef}
        displayVideo={displayVideo}
      />
      <Tabs defaultActiveKey="main" id="navigation-tab" className="m-3">
        <Tab eventKey="main" title="Main">
          <VideoMain
            trackData={trackData}
            setTrackData={setTrackData}
            trackDataRef={trackDataRef}
            screenshotSize={screenshotSize}
          />
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <VideoSettings
            displayVideo={displayVideo}
            setDisplayVideo={setDisplayVideo}
            setScreenshotSize={setScreenshotSize}
          />
        </Tab>
        <Tab eventKey="submit" title="Submit">
          <VideoSubmit
            trackData={trackData}
            setTrackData={setTrackData}
            trackDataRef={trackDataRef}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default VideoPage;
