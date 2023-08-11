import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import RaceStatsBody from "./RaceStatsBody";

import * as tracks from "../json/tracks.json";

const RaceStats = (props) => {
  const [raceData, setRaceData] = useState([]);
  const [overallAverage, setOverallAverage] = useState(0);

  useEffect(() => {
    const tracksCopy = JSON.parse(JSON.stringify(tracks.default));

    let overallTrackAverage = 0;
    for (const race of props.races) {
      tracksCopy[race.Track].races++;
      tracksCopy[race.Track].avgFinish += race.Result;
      overallTrackAverage += race.Result;
    }

    setOverallAverage(
      props.races.length > 0 ? overallTrackAverage / props.races.length : 0
    );

    const trackMap = Object.entries(tracksCopy).map((course, index) => {
      const avgFinish =
        course[1].races === 0 ? 0 : course[1].avgFinish / course[1].races;
      return {
        ingameOrder: index + 1,
        abr: course[0],
        fullName: course[1].fullName,
        races: course[1].races,
        avgFinish,
      };
    });

    const sortedTracks = trackMap.sort(
      (a, b) => b.races - a.races || a.avgFinish - b.avgFinish
    );

    setRaceData(sortedTracks);
  }, [props]);

  return (
    <div>
      <RaceStatsBody
        raceData={raceData}
        setRaceData={setRaceData}
        overallAverage={overallAverage}
      />
      <span className="fst-italic m-1">{props.races.length} results</span>
      <Table
        className="text-center align-middle"
        size="sm"
        striped
        bordered
        hover
      >
        <thead>
          <tr>
            <th>Track</th>
            <th># of Races</th>
            <th>Average Finish</th>
          </tr>
        </thead>
        <tbody>
          {raceData.map((race, index) => {
            return (
              <tr key={`table-row-${index + 1}`}>
                <td>{race.fullName}</td>
                <td>{race.races}</td>
                <td>
                  {race.avgFinish === 0
                    ? "-"
                    : Math.round(100 * race.avgFinish) / 100}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default RaceStats;
