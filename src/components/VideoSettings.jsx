import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useCookies } from "react-cookie";

const VideoSettings = ({
  displayVideo,
  setDisplayVideo,
  setScreenshotSize,
}) => {
  const [cookies, setCookie] = useCookies(["screenshotSizes"]);

  useEffect(() => {
    if (cookies.screenshotSizes != null)
      setScreenshotSize(cookies.screenshotSizes);
  }, []);

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
      <div className="mt-3">
        <small className="text-secondary fst-italic">Screenshot Sizes</small>
        <Form.Select
          className="w-50"
          defaultValue={cookies.screenshotSizes || "M"}
          onChange={(e) => {
            setCookie("screenshotSizes", e.target.value);
            setScreenshotSize(e.target.value);
          }}
        >
          <option value="S">Small</option>
          <option value="M">Medium (320 x 180)</option>
          <option value="L">Large (480 x 270)</option>
        </Form.Select>
      </div>
    </Form>
  );
};

export default VideoSettings;
