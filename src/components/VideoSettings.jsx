import React from "react";
import Form from "react-bootstrap/Form";

const VideoSettings = ({ displayVideo, setDisplayVideo }) => {
  return (
    <Form>
      <Form.Check
        type="switch"
        id="video-switch"
        label="Show Video of Source (Video analysis will still happen if disabled)"
        checked={displayVideo === "show"}
        onChange={() => {
          const newValue = displayVideo === "show" ? "hide" : "show";
          return setDisplayVideo(newValue);
        }}
      />
    </Form>
  );
};

export default VideoSettings;
