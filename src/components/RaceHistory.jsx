import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import images from "../images/track_images/index";

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

const options = Object.entries(tracks.default).map((track) => {
  return (
    <option key={`option-${track[0]}`} value={track[0]}>
      {track[1].fullName}
    </option>
  );
});

const RaceHistory = (props) => {
  const [track, setTrack] = useState("All");

  const selectedTracks = props.races.filter((race) => {
    if (track === "All") return true;
    else if (track === "Original") return race.Track.charAt(0) !== "b";
    else if (track === "Booster") return race.Track.charAt(0) === "b";
    else return race.Track === track;
  });
  return (
    <div>
      <div className="p-2">
        <small className="text-secondary fst-italic">Track Filter</small>
        <Form.Select onChange={(e) => setTrack(e.target.value)}>
          <option value="All">All Tracks</option>
          <option value="Original">Original 48 Tracks</option>
          <option value="Booster">Booster Course Pass Tracks</option>
          {options}
        </Form.Select>
      </div>
      <span className="fst-italic m-1">{selectedTracks.length} results</span>
      <Table className="text-center align-middle" striped bordered hover>
        <thead>
          <tr>
            <th>Track</th>
            <th>Result</th>
            <th>Mode</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {selectedTracks.map((race, index) => {
            return (
              <tr key={`table-row-${index + 1}`}>
                <td>
                  <img
                    src={images[race.Track]}
                    alt={tracks.default[race.Track].fullName}
                  ></img>
                </td>
                <td>{rankingMap[race.Result - 1]}</td>
                <td>{race.Mode}</td>
                <td>{race.Date}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default RaceHistory;
