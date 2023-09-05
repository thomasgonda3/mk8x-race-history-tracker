import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sql from "mssql";
import path from "path";
import "dotenv/config";

import tracks from "./src/json/tracks.json" assert { type: "json" };
const tracksArray = Object.keys(tracks);

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
  timeout: 10000000,
  pool: {
    max: 1000,
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

const dirname = path.resolve();

const api = async () => {
  sql.connect(config);

  const app = express();

  app.use(express.static(path.join(dirname, "build")));

  app.use(cors());
  const jsonParser = bodyParser.json();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.get(`/api/players`, async (req, res) => {
    const {
      page = 0,
      pageAmount = 50,
      playerName = "",
      playerID = 0,
    } = req.query;
    const countString = "[Overall_Count] = COUNT(*) OVER()";
    const patternSearch =
      playerName === "" ? "" : `WHERE [Name] LIKE '%${playerName}%'`;
    const IDSearch = playerID === 0 ? "" : `WHERE [ID] = ${playerID}`;
    try {
      const result = await sql.query(`
        SELECT 
            [ID]
            ,[Name]
            ,[Discord_Name]
            ,[Team]
            ,[Race_Total]
            ,[Most_Recent_Race]

        FROM [${dbName}].[dbo].[Players]
        ${patternSearch}
        ${IDSearch}
        ORDER BY [Most_Recent_Race] DESC
        OFFSET ${page * pageAmount} ROWS
        FETCH NEXT ${pageAmount} ROWS ONLY`);
      res.json(result.recordset);
    } catch (e) {
      console.log(e);
    }
  });

  app.get(`/api/races`, async (req, res) => {
    if (req.query == null || req.query.playerID == null) {
      return res.status(400).send("Missing player ID");
    }
    const { playerID } = req.query;
    try {
      const result = await sql.query(`
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
        WHERE [PlayerID] = ${playerID}
        ORDER BY [DATE] DESC`);
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

      const apiKeyQuery = await sql.query(`
        SELECT TOP (1) 
            [ID]
            ,[Discord_ID]
        FROM [${dbName}].[dbo].[Players]
        WHERE [API_Key] = '${apiKey}'`);

      if (apiKeyQuery.recordset.length === 0) {
        return res.status(400).json("No match with API Key in the database.");
      }

      const { ID, Discord_ID } = apiKeyQuery.recordset[0];

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
