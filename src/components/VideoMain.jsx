import React from "react";
import Table from "react-bootstrap/Table";
import images from "../images/track_images/index";

import * as tracks from "../json/tracks.json";

const VideoMain = ({ trackData }) => {
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
                  <img
                    src={images[race[0]]}
                    alt={tracks.default[race[0]].fullName}
                  ></img>
                </td>
                <td>{race[1] ?? "-"}</td>
                <td>
                  {race[2] ? (
                    <img
                      style={{ width: "auto", height: 104 }}
                      src={race[2]}
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
