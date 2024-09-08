import React from "react";
import Table from "react-bootstrap/Table";
import images from "../images/track_images/index";
import { Trash } from "react-bootstrap-icons";

import * as tracks from "../json/tracks.json";

const rankingMap = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];

const sizeMap = {
  S: ["auto", 104],
  M: [320, 180],
  L: [480, 270],
};

const VideoMain = ({
  trackData,
  setTrackData,
  trackDataRef,
  screenshotSize,
}) => {
  return (
    <div>
      <Table className="text-center align-middle" striped bordered hover>
        <thead>
          <tr>
            <th>Track</th>
            <th>Result</th>
            <th>Screenshot</th>
          </tr>
        </thead>
        <tbody>
          {trackData.map((race, index) => {
            return (
              <tr key={`table-data-${index + 1}`}>
                <td>
                  <Trash
                    size={20}
                    style={{ float: "left", cursor: "pointer" }}
                    onClick={() => {
                      const newTrackData = trackData.toSpliced(index, 1);
                      setTrackData(newTrackData);
                      trackDataRef.current = newTrackData;
                    }}
                  />
                  <div>
                    <img
                      style={{ width: "150px" }}
                      src={images[race[0]]}
                      alt={tracks.default[race[0]].fullName}
                    ></img>
                    <div>{`Race: ${index + 1}`}</div>
                  </div>
                </td>
                <td className="fs-3">{rankingMap[race[1] - 1] ?? "-"}</td>
                <td>
                  {race[2] ? (
                    <img
                      style={{
                        width: sizeMap[screenshotSize][0],
                        height: sizeMap[screenshotSize][1],
                      }}
                      src={race[2]}
                      alt="race-screenshot"
                    ></img>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default VideoMain;
