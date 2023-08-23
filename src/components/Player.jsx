import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import RaceStats from "./RaceStats";
import RaceHistory from "./RaceHistory";
import PlayerFilters from "./PlayerFilters";

const isProduction = process.env.REACT_APP_IS_PRODUCTION;

const Player = () => {
  const [races, setRaces] = useState([]);
  const [playerData, setPlayerData] = useState({});
  const [mode, setMode] = useState("MogiTournamentWar");
  const [minDate, setMinDate] = useState(
    dayjs(process.env.REACT_APP_START_DATE, "YYYY-MM-DD")
  );
  const [maxDate, setMaxDate] = useState(dayjs());

  const params = useParams();

  useEffect(() => {
    const fetchRaces = async () => {
      let request = `/api/races?playerID=${params.playerID}`;
      if (!isProduction) request = "http://localhost:8000" + request;
      const response = await fetch(request, {
        method: "GET",
      });
      const result = await response.json();
      if (result.length > 0) {
        const player = {
          name: result[0].Name,
          discord_name: result[0].Discord_Name,
          team: result[0].Team,
        };
        setPlayerData(player);
      }
      setRaces(result);
    };
    fetchRaces();
  }, [params.playerID]);

  const filteredRaces = races.filter(
    (race) =>
      (mode === "All" || mode.includes(race.Mode)) &&
      minDate.isBefore(race.Date) &&
      maxDate.endOf("day").isAfter(race.Date)
  );

  return (
    <div>
      <h1 className="text-center align-middle m-3">
        {playerData.team ? playerData.team + " " : ""}
        {`${playerData.name || playerData.discord_name}`}
      </h1>
      <PlayerFilters
        minDate={minDate}
        setMinDate={setMinDate}
        maxDate={maxDate}
        setMaxDate={setMaxDate}
        setMode={setMode}
      />
      <Tabs defaultActiveKey="stats" id="player-tab" className="m-3">
        <Tab eventKey="stats" title="Stats">
          <RaceStats races={filteredRaces} />
        </Tab>
        <Tab eventKey="history" title="History">
          <RaceHistory races={filteredRaces} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Player;
