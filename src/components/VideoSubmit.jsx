import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCookies } from "react-cookie";

// const isProduction = false;
const isProduction = process.env.REACT_APP_IS_PRODUCTION;

const VideoSubmit = ({ trackData, setTrackData, trackDataRef }) => {
  const [mode, setMode] = useState("Mogi");
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [responseColor, setResponseColor] = useState("green");
  const [cookies, setCookie] = useCookies(["apiKey"]);

  const submitRaces = async () => {
    if (trackData.length === 0) {
      setResponse("ERROR: No current Track Data.");
      setResponseColor("red");
      setSubmitting(false);
      return;
    }
    if (trackData[trackData.length - 1][1] == null) {
      setResponse("ERROR: Current Track has no result.");
      setResponseColor("red");
      setSubmitting(false);
      return;
    }
    if (cookies.apiKey === "") {
      setResponse("ERROR: No APIKEY provided.");
      setResponseColor("red");
      setSubmitting(false);
      return;
    }
    let request = `/api/submit`;
    const removedImages = trackData.map((track) => {
      return [track[0], track[1]];
    });
    const url = isProduction ? request : "http://localhost:8000" + request;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          trackData: removedImages,
          mode,
          apiKey: cookies.apiKey,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const result = await response.json();
      if (result.message) {
        setResponseColor("green");
        setResponse(result.message);
        setTrackData([]);
        trackDataRef.current = [];
      } else {
        setResponseColor("red");
        setResponse(result.error);
      }
    } catch {
      console.log("Error submitting races.");
    }
    setSubmitting(false);
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col">
            <small className="text-secondary fst-italic">API KEY</small>
            <Form.Group
              onChange={(e) => {
                const currDate = new Date();
                currDate.setFullYear(new Date().getFullYear() + 1);
                setCookie("apiKey", e.target.value, {
                  expires: currDate,
                });
              }}
            >
              <Form.Control
                id="apikey-input"
                defaultValue={cookies.apiKey}
                as="input"
              />
            </Form.Group>
          </div>
          <div className="col">
            <small className="text-secondary fst-italic">Mode</small>
            <Form.Select
              id="mode-select"
              defaultValue="Mogi"
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="Casual">Casual</option>
              <option value="Mogi">Mogi</option>
              <option value="Tournament">Tournament</option>
              <option value="War">War</option>
            </Form.Select>
          </div>
        </div>
      </div>
      <div className="mt-4 d-flex flex-column">
        <Button
          className="align-self-center"
          variant="primary"
          disabled={submitting}
          onClick={() => {
            setSubmitting(true);
            submitRaces();
          }}
        >
          Submit
        </Button>{" "}
        <Form.Group className="align-self-center mt-2 w-50">
          <Form.Label for="api-response">API RESPONSE</Form.Label>
          <Form.Control
            id="api-response"
            style={{ color: responseColor }}
            as="textarea"
            readOnly={true}
            value={response}
          />
        </Form.Group>
      </div>
    </div>
  );
};

export default VideoSubmit;
