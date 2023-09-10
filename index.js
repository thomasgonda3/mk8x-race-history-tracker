import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sql from "mssql";
import path from "path";
import compression from "compression";
import "dotenv/config";

// import tracks from "./src/json/tracks.json" assert { type: "json" };
// const tracksArray = Object.keys(tracks);

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

const apiKeyQuery = `
        SELECT TOP (1) 
            [ID]
            ,[Discord_ID]
        FROM [${dbName}].[dbo].[Players]
        WHERE [API_Key] = @API_Key`;

const dirname = path.resolve();

const api = async () => {
  sql.connect(config);

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
      const ps = new sql.PreparedStatement();
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
    console.log(playerName);
    try {
      const ps = new sql.PreparedStatement();
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

  app.get(`/api/races`, async (req, res) => {
    if (req.query == null || req.query.playerID == null) {
      return res.status(400).send("Missing player ID");
    }
    const { playerID } = req.query;
    const ps = new sql.PreparedStatement();
    ps.input("Player_ID", sql.Int);
    await ps.prepare(racesQuery);
    try {
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

      const ps = new sql.PreparedStatement();
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
