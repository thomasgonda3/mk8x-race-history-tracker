import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import RaceStatsBody from "./RaceStatsBody";

import * as tracks from "../json/tracks.json";
import * as scalar from "../json/scalar.json";

const POINT_MAP = [15, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const RACE_AVG = 6.83;

const RaceStats = (props) => {
  const [raceData, setRaceData] = useState([]);
  const [overallAverage, setOverallAverage] = useState(0);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const tracksCopy = JSON.parse(JSON.stringify(tracks.default));
    const scalarCopy = JSON.parse(JSON.stringify(scalar.default));

    let overallTrackAverage = 0;
    let overallTrackScore = 0;
    for (const race of props.races) {
      tracksCopy[race.Track].races++;
      tracksCopy[race.Track].avgFinish += race.Result;
      tracksCopy[race.Track].avgScore += POINT_MAP[race.Result - 1];
      tracksCopy[race.Track].raceResults.push(POINT_MAP[race.Result - 1]);
      overallTrackAverage += race.Result;
      overallTrackScore += POINT_MAP[race.Result - 1];
    }

    setOverallAverage(
      props.races.length > 0 ? overallTrackAverage / props.races.length : 0
    );

    setOverallScore(
      props.races.length > 0 ? overallTrackScore / props.races.length : 0
    );

    const trackMap = Object.entries(tracksCopy).map((course, index) => {
      const races = course[1].races;
      const avgFinish = course[1].races === 0 ? 0 : course[1].avgFinish / races;
      const avgScore = course[1].races === 0 ? 0 : course[1].avgScore / races;
      let weightedScore = -9999999;
      if (races >= 1) {
        const scalarIndex =
          races > scalarCopy.length - 1 ? scalarCopy.length - 1 : races - 1;
        const weight = scalarCopy[scalarIndex] - 0.15;
        weightedScore = RACE_AVG + (avgScore - RACE_AVG) * weight;
      }
      return {
        ingameOrder: index + 1,
        abr: course[0],
        fullName: course[1].fullName,
        races,
        avgFinish,
        avgScore,
        weightedScore,
      };
    });

    const sortedTracks = trackMap.sort(
      (a, b) =>
        b.weightedScore - a.weightedScore ||
        b.avgScore - a.avgScore ||
        b.races - a.races
    );

    setRaceData(sortedTracks);
  }, [props]);

  return (
    <div>
      <RaceStatsBody
        raceData={raceData}
        setRaceData={setRaceData}
        overallAverage={overallAverage}
        overallScore={overallScore}
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
            <th>#</th>
            <th>Track</th>
            <th># of Races</th>
            <th>Average Finish</th>
            <th>Average Score</th>
            <th>Weighted Score</th>
          </tr>
        </thead>
        <tbody>
          {raceData.map((race, index) => {
            return (
              <tr key={`table-row-${index + 1}`}>
                <td>{index + 1}</td>
                <td>{race.fullName}</td>
                <td>{race.races}</td>
                <td>
                  {race.avgFinish === 0
                    ? "-"
                    : Math.round(100 * race.avgFinish) / 100}
                </td>
                <td
                  style={{
                    color:
                      race.avgScore === 0
                        ? "black"
                        : race.avgScore < RACE_AVG
                        ? "red"
                        : "green",
                  }}
                >
                  {race.avgScore === 0
                    ? "-"
                    : Math.round(100 * race.avgScore) / 100}
                </td>
                <td
                  style={{
                    color:
                      race.avgScore === 0
                        ? "black"
                        : race.avgScore < RACE_AVG
                        ? "red"
                        : "green",
                  }}
                >
                  {race.races < 1
                    ? "-"
                    : Math.round(100 * race.weightedScore) / 100}
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
