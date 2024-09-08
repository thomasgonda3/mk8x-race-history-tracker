use sqlx::FromRow;
use serde::{Deserialize, Serialize};

#[derive(Serialize, FromRow)]
pub struct Player {
    pub ID: i32,
    pub Name: Option<String>,
    pub Discord_ID: String,
    pub Discord_Name: String,
    pub Team: Option<String>,
    pub Race_Total: i32,
    pub Most_Recent_Race: Option<String>,
    pub API_Key: Option<String>,
}

#[derive(Serialize, FromRow)]
pub struct Race {
    pub ID: i32,
    pub PlayerID: i32,
    pub Discord_ID: Option<String>,
    pub Track: String,
    pub Mode: String,
    pub Result: i32,
    pub Date: String,
    pub Name: Option<String>,  // From Players table
    pub Team: Option<String>,  // From Players table
}

#[derive(Serialize, FromRow)]
pub struct PlayerResponse {
    pub ID: i32,
    pub Name: Option<String>,
    pub Discord_Name: String,
    pub Team: Option<String>,
    pub Race_Total: i32,
    pub Most_Recent_Race: Option<String>,
}

#[derive(Serialize, FromRow)]
pub struct RaceResponse {
    pub ID: i32,
    pub Track: String,
    pub Mode: String,
    pub Result: i32,
    pub Date: String,
}

#[derive(Clone)]
#[derive(Serialize, FromRow)]
pub struct AllRaceResponse {
    pub ID: i32,
    pub Track: String,
    pub Mode: String,
    pub Result: i32,
}

#[derive(Deserialize)]
pub struct PlayerQuery {
    pub playerID: Option<i32>,
}

#[derive(Deserialize)]
pub struct PlayersQuery {
    pub page: Option<i32>,
    pub pageAmount: Option<i32>,
    pub playerName: Option<String>,
}

#[derive(Deserialize)]
pub struct RaceQuery {
    pub playerID: i32,
}

#[derive(Deserialize)]
pub struct AllRaceQuery {
    pub mode: Option<String>,
}

#[derive(Serialize)]
pub struct TrackStats {
    pub races: usize,
    pub averageRaceProportion: f64,
    pub raceProportions: Vec<f64>,
}
