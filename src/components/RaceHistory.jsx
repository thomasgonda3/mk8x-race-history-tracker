import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import images from "../images/track_images/index";

import * as tracks from "../json/tracks.json";

const PAGE_SIZE = 50;

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
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    document.getElementById("page-select").value = "0";
  }, [props]);

  const selectedTracks = props.races.filter((race) => {
    if (track === "All") return true;
    else if (track === "Original") return race.Track.charAt(0) !== "b";
    else if (track === "Booster") return race.Track.charAt(0) === "b";
    else return race.Track === track;
  });

  const currPage = selectedTracks.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  const pageOptions = new Array(Math.ceil(selectedTracks.length / PAGE_SIZE))
    .fill(0)
    .map((_, index) => {
      return (
        <option key={`page-option-${index}`} value={index}>
          {`${index + 1}`}
        </option>
      );
    });

  return (
    <div>
      <div className="row">
        <div className="col-9 p-2">
          <small className="text-secondary fst-italic">Track Filter</small>
          <Form.Select
            id="track-filter"
            onChange={(e) => {
              setTrack(e.target.value);
              setPage(0);
            }}
          >
            <option value="All">All Tracks</option>
            <option value="Original">Original 48 Tracks</option>
            <option value="Booster">Booster Course Pass Tracks</option>
            {options}
          </Form.Select>
        </div>
        <div className="col-3 p-2">
          <small className="text-secondary fst-italic">Page</small>
          <Form.Select
            id="page-select"
            onChange={(e) => {
              setPage(e.target.value);
            }}
          >
            {pageOptions}
          </Form.Select>
        </div>
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
          {currPage.map((race, index) => {
            return (
              <tr key={`table-row-${index + 1}`}>
                <td>
                  <img
                    style={{ width: "150px" }}
                    src={images[race.Track]}
                    alt={tracks.default[race.Track].fullName}
                  ></img>
                  <div>{`Race ID: ${race.ID}`}</div>
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
