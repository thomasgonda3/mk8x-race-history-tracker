import express from "express";
import cors from "cors";
import sql from "mssql";
import path from "path";
import "dotenv/config";

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

  app.get(`*`, async (req, res) => {
    res.sendFile(path.join(dirname, "build", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
  });
};

api().catch((e) => console.log(e));
