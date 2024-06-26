import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sql from "mssql";
import path from "path";
import compression from "compression";
import "dotenv/config";

const tracksArray = [
  "MKS",
  "WP",
  "SSC",
  "TR",
  "MC",
  "TH",
  "TM",
  "SGF",
  "SA",
  "DS",
  "Ed",
  "MW",
  "CC",
  "BDD",
  "BC",
  "RR",
  "rMMM",
  "rMC",
  "rCCB",
  "rTT",
  "rDDD",
  "rDP3",
  "rRRy",
  "rDKJ",
  "rWS",
  "rSL",
  "rMP",
  "rYV",
  "rTTC",
  "rPPS",
  "rGV",
  "rRRd",
  "dYC",
  "dEA",
  "dDD",
  "dMC",
  "dWGM",
  "dRR",
  "dIIO",
  "dHC",
  "dBP",
  "dCL",
  "dWW",
  "dAC",
  "dNBC",
  "dRiR",
  "dSBS",
  "dBB",
  "bPP",
  "bTC",
  "bCMo",
  "bCMa",
  "bTB",
  "bSR",
  "bSG",
  "bNH",
  "bNYM",
  "bMC3",
  "bKD",
  "bWP",
  "bSS",
  "bSL",
  "bMG",
  "bSHS",
  "bLL",
  "bBL",
  "bRRM",
  "bMT",
  "bBB",
  "bPG",
  "bMM",
  "bRR7",
  "bAD",
  "bRP",
  "bDKS",
  "bYI",
  "bBR",
  "bMC",
  "bWS",
  "bSSy",
  "bAtD",
  "bDC",
  "bMH",
  "bSCS",
  "bLAL",
  "bSW",
  "bKC",
  "bVV",
  "bRA",
  "bDKM",
  "bDCt",
  "bPPC",
  "bMD",
  "bRIW",
  "bBC3",
  "bRRw",
];

const isProduction = process.env.REACT_APP_IS_PRODUCTION;
const dbName = isProduction
  ? process.env.DATABASE_NAME
  : process.env.TEST_DATABASE_NAME;

const PORT = process.env.API_PORT;

const config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: dbName,
  server: process.env.DATABASE_SERVER,
  connectionTimeout: 30000,
  requestTimeout: 30000,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true,
    trustedConnection: true,
    multipleActiveResultSets: true,
    encrypt: false,
  },
};

const playerQuery = `
        SELECT 
            [ID]
            ,[Name]
            ,[Discord_Name]
            ,[Team]
            ,[Race_Total]
            ,[Most_Recent_Race]

        FROM [${dbName}].[dbo].[Players]
        WHERE [ID] = @ID`;

const playersQuery = `
        SELECT 
            [ID]
            ,[Name]
            ,[Discord_Name]
            ,[Team]
            ,[Race_Total]
            ,[Most_Recent_Race]

        FROM [${dbName}].[dbo].[Players]
        WHERE [Name] LIKE @Name
        ORDER BY [Most_Recent_Race] DESC
        OFFSET @Rows ROWS
        FETCH NEXT @Page_Amount ROWS ONLY`;

const racesQuery = `
        SELECT 
            [${dbName}].[dbo].[Races].[ID]
            ,[Track]
            ,[Mode]
            ,[Result]
            ,[Date]
			      ,[Name]
			      ,[Team]
        FROM [${dbName}].[dbo].[Races]
		    JOIN [${dbName}].[dbo].[Players]
		    ON [${dbName}].[dbo].[Races].[PlayerID] = [${dbName}].[dbo].[Players].[ID]
        WHERE [PlayerID] = @Player_ID
        ORDER BY [DATE] DESC`;

const allRacesQuery = `
        SELECT 
            [PlayerID]
            ,[Track]
            ,[Mode]
            ,[Result]
        FROM [${dbName}].[dbo].[Races]
        WHERE [Mode] = @Mode`;

const mixedRacesQuery = `
        SELECT 
            [PlayerID]
            ,[Track]
            ,[Mode]
            ,[Result]
        FROM [${dbName}].[dbo].[Races]
        WHERE [Mode] = 'Mogi'
        OR [Mode] = 'War'`;

const apiKeyQuery = `
        SELECT TOP (1) 
            [ID]
            ,[Discord_ID]
        FROM [${dbName}].[dbo].[Players]
        WHERE [API_Key] = @API_Key`;

const dirname = path.resolve();

const api = async () => {
  const pool = await sql.connect(config);

  const app = express();

  app.use(express.static(path.join(dirname, "build")));

  app.use(cors());
  app.use(compression());
  const jsonParser = bodyParser.json();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.get(`/api/player`, async (req, res) => {
    const { playerID = 0 } = req.query;
    try {
      const ps = new sql.PreparedStatement(pool);
      ps.input("ID", sql.Int);
      await ps.prepare(playerQuery);
      const result = await ps.execute({
        ID: playerID,
      });
      await ps.unprepare();
      res.json(result.recordset);
    } catch (e) {
      console.log(e);
    }
  });

  app.get(`/api/players`, async (req, res) => {
    const { page = 0, pageAmount = 50, playerName = "" } = req.query;
    try {
      const ps = new sql.PreparedStatement(pool);
      ps.input("Name", sql.NVarChar(50));
      ps.input("Rows", sql.Int);
      ps.input("Page_Amount", sql.Int);
      await ps.prepare(playersQuery);
      const wildcardPlayer = "%" + playerName + "%";
      const Rows = page * pageAmount;
      const result = await ps.execute({
        Name: wildcardPlayer,
        Rows,
        Page_Amount: pageAmount,
      });
      await ps.unprepare();
      res.json(result.recordset);
    } catch (e) {
      console.log(e);
    }
  });

  app.get(`/api/races/all`, async (req, res) => {
    const MIN_RACES = 100;
    const { mode = "Mogi" } = req.query;
    if (mode !== "Mogi" && mode !== "War" && mode !== "Mixed") {
      return res.status(400).send("Bad Mode Type.");
    }
    try {
      let result;
      if (mode !== "Mixed") {
        const ps = new sql.PreparedStatement(pool);
        ps.input("Mode", sql.NVarChar(50));
        await ps.prepare(allRacesQuery);
        result = await ps.execute({
          Mode: mode,
        });
      } else {
        result = await sql.query(mixedRacesQuery);
      }
      const totalTracks = {};
      for (const track of tracksArray) {
        totalTracks[track] = {
          races: 0,
          averageRaceProportion: 0,
          raceProportions: [],
        };
      }
      const map = {};
      for (let i = 0; i < result.recordsets[0].length; i++) {
        if (map[result.recordsets[0][i].PlayerID] == null) {
          const tracks = {};
          for (const track of tracksArray) {
            tracks[track] = { races: 0, raceProportion: 0 };
          }
          map[result.recordsets[0][i].PlayerID] = {
            tracks,
            totalRaces: 0,
          };
        }
        map[result.recordsets[0][i].PlayerID].tracks[
          result.recordsets[0][i].Track
        ].races++;
        map[result.recordsets[0][i].PlayerID].totalRaces++;
      }
      for (const playerID in map) {
        if (map[playerID].totalRaces >= MIN_RACES) {
          for (const track in map[playerID].tracks) {
            const raceProportion =
              map[playerID].tracks[track].races / map[playerID].totalRaces;
            map[playerID].tracks[track].raceProportion = raceProportion;
            totalTracks[track].raceProportions.push(raceProportion);
          }
        }
      }
      for (const track in totalTracks) {
        totalTracks[track].averageRaceProportion =
          Math.floor(
            100000 *
              (totalTracks[track].raceProportions.reduce((a, b) => a + b, 0) /
                totalTracks[track].raceProportions.length)
          ) / 1000;
      }
      return res.status(200).json(totalTracks);
    } catch (e) {
      console.log(e);
    }
  });

  app.get(`/api/races`, async (req, res) => {
    if (req.query == null || req.query.playerID == null) {
      return res.status(400).send("Missing player ID");
    }
    try {
      const { playerID } = req.query;
      const ps = new sql.PreparedStatement(pool);
      ps.input("Player_ID", sql.Int);
      await ps.prepare(racesQuery);
      const result = await ps.execute({
        Player_ID: playerID,
      });
      await ps.unprepare;
      res.json(result.recordset);
    } catch (e) {
      console.log(e);
    }
  });

  app.post(`/api/submit`, jsonParser, async (req, res) => {
    try {
      const { trackData = [], mode, apiKey } = req.body;

      if (apiKey == null || typeof apiKey !== "string" || apiKey.length === 0) {
        return res.status(400).json("Invalid API Key value.");
      }

      if (
        !(
          mode == "Casual" ||
          mode === "Mogi" ||
          mode === "War" ||
          mode === "Tournament"
        )
      ) {
        return res.status(400).json("Invalid Mode value.");
      }

      if (!Array.isArray(trackData) || trackData.length === 0) {
        return res
          .status(400)
          .json(
            "Invalid Track Data type; expecting array with length greater than 0."
          );
      }
      for (const currTrack of trackData) {
        if (tracksArray.indexOf(currTrack[0]) === -1) {
          return res
            .status(400)
            .json(`Invalid track abbreviation: ${currTrack[0]}`);
        }
        if (
          !Number.isInteger(currTrack[1]) ||
          currTrack[1] < 1 ||
          currTrack[1] > 12
        ) {
          return res
            .status(400)
            .json(
              `Position for track ${currTrack[0]} is invalid; expecting an integer between 1 and 12.`
            );
        }
      }

      const ps = new sql.PreparedStatement(pool);
      ps.input("API_Key", sql.NVarChar(50));
      await ps.prepare(apiKeyQuery);

      const result = await ps.execute({
        API_Key: apiKey,
      });

      if (result.recordset.length === 0) {
        return res.status(400).json("No match with API Key in the database.");
      }

      const { ID, Discord_ID } = result.recordset[0];

      const values = trackData
        .map(
          (row) => `(${ID}, ${Discord_ID}, '${row[0]}', '${mode}', ${row[1]})`
        )
        .join(",");

      await sql.query(`
        INSERT INTO [${dbName}].[dbo].[Races] 
	          ([PlayerID]
            ,[Discord_ID]
            ,[Track]
            ,[Mode]
            ,[Result])
        VALUES
	          ${values}`);

      return res
        .status(200)
        .json(
          `Insert Successful; view new races at https://mk8dx-race-history-tracker.com/player/${ID}`
        );
    } catch (e) {
      console.log(e);
    }
  });

  app.get(`*`, async (req, res) => {
    res.sendFile(path.join(dirname, "build", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
  });
};

api().catch((e) => console.log(e));
