import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

// const isProduction = false;
const isProduction = process.env.REACT_APP_IS_PRODUCTION;

const tracksMap = {
  MKS: "Mario Kart Stadium",
  WP: "Water Park",
  SSC: "Sweet Sweet Canyon",
  TR: "Thwomp Ruins",
  MC: "Mario Circuit",
  TH: "Toad Harbor",
  TM: "Twisted Mansion",
  SGF: "Shy Guy Falls",
  SA: "Sunshine Airport",
  DS: "Dolphin Shoals",
  Ed: "Electrodrome",
  MW: "Mount Wario",
  CC: "Cloudtop Cruise",
  BDD: "Bone-Dry Dunes",
  BC: "Bowser's Castle",
  RR: "Rainbow Road",
  rMMM: "Wii Moo Moo Meadows",
  rMC: "GBA Mario Circuit",
  rCCB: "DS Cheep Cheep Beach",
  rTT: "N64 Toad's Turnpike",
  rDDD: "GCN Dry Dry Desert",
  rDP3: "SNES Donut Plains 3",
  rRRy: "N64 Royal Raceway",
  rDKJ: "3DS DK Jungle",
  rWS: "DS Wario Stadium",
  rSL: "GCN Sherbet Land",
  rMP: "3DS Music Park",
  rYV: "N64 Yoshi Valley",
  rTTC: "DS Tick-Tock Clock",
  rPPS: "3DS Piranha Plant Slide",
  rGV: "Wii Grumble Volcano",
  rRRd: "N64 Rainbow Road",
  dYC: "GCN Yoshi Circuit",
  dEA: "Excitebike Arena",
  dDD: "Dragon Driftway",
  dMC: "Mute City",
  dWGM: "Wii Wario's Gold Mine",
  dRR: "SNES Rainbow Road",
  dIIO: "Ice Ice Outpost",
  dHC: "Hyrule Circuit",
  dBP: "GCN Baby Park",
  dCL: "GBA Cheese Land",
  dWW: "Wild Woods",
  dAC: "Animal Crossing",
  dNBC: "3DS Neo Bowser City",
  dRiR: "GBA Ribbon Road",
  dSBS: "Super Bell Subway",
  dBB: "Big Blue",
  bPP: "Tour Paris Promenade",
  bTC: "3DS Toad Circuit",
  bCMo: "N64 Choco Mountain",
  bCMa: "Wii Coconut Mall",
  bTB: "Tour Tokyo Blur",
  bSR: "DS Shroom Ridge",
  bSG: "GBA Sky Garden",
  bNH: "Tour Ninja Hideaway",
  bNYM: "Tour New York Minute",
  bMC3: "SNES Mario Circuit 3",
  bKD: "N64 Kalimari Desert",
  bWP: "DS Waluigi Pinball",
  bSS: "Tour Sydney Sprint",
  bSL: "GBA Snow Land",
  bMG: "Wii Mushroom Gorge",
  bSHS: "Sky-High Sundae",
  bLL: "Tour London Loop",
  bBL: "GBA Boo Lake",
  bRRM: "3DS Rock Rock Mountain",
  bMT: "Wii Maple Treeway",
  bBB: "Tour Berlin Byways",
  bPG: "DS Peach Gardens",
  bMM: "Tour Merry Mountain",
  bRR7: "3DS Rainbow Road",
  bAD: "Tour Amsterdam Drift",
  bRP: "GBA Riverside Park",
  bDKS: "Wii DK Summit",
  bYI: "Yoshi's Island",
  bBR: "Tour Bangkok Rush",
  bMC: "DS Mario Circuit",
  bWS: "GCN Waluigi Stadium",
  bSSy: "Tour Singapore Speedway",
  bAtD: "Tour Athens Dash",
  bDC: "GCN Daisy Cruiser",
  bMH: "Wii Moonview Highway",
  bSCS: "Squeaky Clean Sprint",
  bLAL: "Tour Los Angeles Laps",
  bSW: "GBA Sunset Wilds",
  bKC: "Wii Koopa Cape",
  bVV: "Tour Vancouver Velocity",
  bRA: "Tour Rome Avanti",
  bDKM: "GCN DK Mountain",
  bDCt: "Wii Daisy Circuit",
  bPPC: "Piranha Plant Cove",
  bMD: "Tour Madrid Drive",
  bRIW: "3DS Rosalina's Ice World",
  bBC3: "SNES Bowser Castle 3",
  bRRw: "Wii Rainbow Road",
};

const Popularity = () => {
  const [popAmount, setPopAmount] = useState(0);
  const [mode, setMode] = useState("Mogi");
  const [races, setRaces] = useState([]);

  useEffect(() => {
    const fetchRaces = async () => {
      let request = `/api/races/all?mode=${mode}`;
      if (!isProduction) request = "http://localhost:8000" + request;
      const response = await fetch(request, {
        method: "GET",
      });
      const result = await response.json();
      setPopAmount(result.players);
      setRaces(result.formatted_result);
    };
    fetchRaces();
  }, [mode]);

  return (
    <div className="m-3 text-center d-flex flex-column">
      <h3>Track Popularity Rankings</h3>
      <span>{`The average of the percentage each player plays a track.`}</span>
      <span>{`Drawn from ${popAmount} players with minimum 100 ${mode} races.`}</span>
      <Form.Select
        id="popularity-mode-filter"
        className="w-25 m-3 align-self-center"
        defaultValue="Mogi"
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="Mogi">Mogi</option>
        <option value="War">War</option>
        <option value="Mixed">Mogi + War</option>
      </Form.Select>
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
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {races.map((race, index) => {
            return (
              <tr key={`table-row-${index + 1}`}>
                <td>{index + 1}</td>
                <td>{tracksMap[race[0]]}</td>
                <td>{race[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Popularity;
