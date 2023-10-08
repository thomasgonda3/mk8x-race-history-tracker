import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCookies } from "react-cookie";

// const isProduction = false;
const isProduction = process.env.REACT_APP_IS_PRODUCTION;

const VideoSubmit = ({ trackData, setTrackData, trackDataRef }) => {
  const [mode, setMode] = useState("Mogi");
  const [response, setResponse] = useState("");
  const [responseColor, setResponseColor] = useState("green");
  const [cookies, setCookie] = useCookies(["apiKey"]);

  const submitRaces = async () => {
    if (trackData.length === 0) {
      setResponse("ERROR: No current Track Data.");
      setResponseColor("red");
      return;
    }
    if (trackData[trackData.length - 1][1] == null) {
      setResponse("ERROR: Current Track has no result.");
      setResponseColor("red");
      return;
    }
    if (cookies.apiKey === "") {
      setResponse("ERROR: No APIKEY provided.");
      setResponseColor("red");
      return;
    }
    let request = `/api/submit`;
    const removedImages = trackData.map((track) => {
      return [track[0], track[1]];
    });
    const url = isProduction ? request : "http://localhost:8000" + request;
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
    setResponse(result);
    if (response.status === 200) {
      setTrackData([]);
      trackDataRef.current = [];
    }
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
              <Form.Control defaultValue={cookies.apiKey} as="input" />
            </Form.Group>
          </div>
          <div className="col">
            <small className="text-secondary fst-italic">Mode</small>
            <Form.Select
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
          onClick={() => submitRaces()}
        >
          Submit
        </Button>{" "}
        <Form.Group className="align-self-center mt-2 w-50">
          <Form.Label>API RESPONSE</Form.Label>
          <Form.Control
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
