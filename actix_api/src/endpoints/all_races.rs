use actix_web::{get, web, HttpResponse, Responder};
use crate::models::{AllRaceResponse, AllRaceQuery, TrackStats};
use sqlx::Mssql;
use crate::cache::CACHE;
use std::collections::HashMap;

async fn fetch_races_from_db(pool: &sqlx::Pool<Mssql>, mode: &str) -> Result<Vec<AllRaceResponse>, sqlx::Error> {
    let query: &str = if mode == "Mixed" {
        r#"
        SELECT 
            [PlayerID] as ID,
            [Track],
            [Mode],
            [Result]
        FROM [dbo].[Races]
        WHERE [Mode] IN ('Mogi', 'War')
        "#
    } else {
        r#"
        SELECT 
            [PlayerID] as ID,
            [Track],
            [Mode],
            [Result]
        FROM [dbo].[Races]
        WHERE [Mode] = @p1
        "#
    };

    let races = if mode == "Mixed" {
        sqlx::query_as::<_, AllRaceResponse>(query)
            .fetch_all(pool)
            .await?
    } else {
        sqlx::query_as::<_, AllRaceResponse>(query)
            .bind(mode)
            .fetch_all(pool)
            .await?
    };

    Ok(races)
}

async fn fetch_races(pool: &sqlx::Pool<Mssql>, mode: &str) -> Result<Vec<AllRaceResponse>, String> {
    CACHE.clean_up();  // Clean up expired cache entries

    if let Some(cached_races) = CACHE.get(mode) {
        return Ok(cached_races);
    }

    let db_results = fetch_races_from_db(pool, mode).await.map_err(|err| err.to_string())?;
    CACHE.set(mode.to_string(), db_results.clone());
    Ok(db_results)
}

#[get("/api/races/all")]
async fn get_all_races(pool: web::Data<sqlx::Pool<Mssql>>, query: web::Query<AllRaceQuery>) -> impl Responder {
    const MIN_RACES: usize = 100;
    let mode: String = query.mode.clone().unwrap_or_else(|| "Mogi".to_string());

    if !["Mogi", "War", "Mixed"].contains(&mode.as_str()) {
        return HttpResponse::BadRequest().body("Bad Mode Type.");
    }

    // Attempt to fetch races
    let rows = match fetch_races(pool.get_ref(), &mode).await {
        Ok(races) => races,
        Err(err) => return HttpResponse::InternalServerError().body(format!("Error fetching races: {:?}", err)),
    };

    // At this point, `rows` is guaranteed to be `Vec<AllRaceResponse>`.
    if rows.len() < MIN_RACES {
        return HttpResponse::NotFound().body("Not enough races found.")
    } 

    let tracks_array: Vec<&str> = vec![
        "MKS", "WP", "SSC", "TR", "MC", "TH", "TM", "SGF", "SA", "DS", "Ed", "MW",
        "CC", "BDD", "BC", "RR", "rMMM", "rMC", "rCCB", "rTT", "rDDD", "rDP3", "rRRy",
        "rDKJ", "rWS", "rSL", "rMP", "rYV", "rTTC", "rPPS", "rGV", "rRRd", "dYC", "dEA",
        "dDD", "dMC", "dWGM", "dRR", "dIIO", "dHC", "dBP", "dCL", "dWW", "dAC", "dNBC",
        "dRiR", "dSBS", "dBB", "bPP", "bTC", "bCMo", "bCMa", "bTB", "bSR", "bSG", "bNH",
        "bNYM", "bMC3", "bKD", "bWP", "bSS", "bSL", "bMG", "bSHS", "bLL", "bBL", "bRRM",
        "bMT", "bBB", "bPG", "bMM", "bRR7", "bAD", "bRP", "bDKS", "bYI", "bBR", "bMC",
        "bWS", "bSSy", "bAtD", "bDC", "bMH", "bSCS", "bLAL", "bSW", "bKC", "bVV", "bRA",
        "bDKM", "bDCt", "bPPC", "bMD", "bRIW", "bBC3", "bRRw"
    ];

    let mut total_tracks: HashMap<String, TrackStats> = tracks_array
        .iter()
        .map(|track| (track.to_string(), TrackStats {
            races: 0,
            averageRaceProportion: 0.0,
            raceProportions: Vec::new(),
        }))
        .collect();

    let mut player_data: HashMap<String, (HashMap<String, (usize, f64)>, usize)> = HashMap::new();

    for row in rows {
        let player_id = row.ID;
        let track = row.Track;

        let player_stats = player_data.entry(player_id.to_string().clone()).or_insert_with(|| {
            let track_data = tracks_array.iter()
                .map(|track| (track.to_string(), (0, 0.0)))
                .collect();
            (track_data, 0)
        });

        let (player_tracks, total_races) = player_stats;
        let (track_races, _) = player_tracks.entry(track.clone()).or_insert((0, 0.0));
        *track_races += 1;
        *total_races += 1;
    }

    for (player_id, (player_tracks, total_races)) in player_data {
        if total_races >= MIN_RACES {
            for (track, (track_races, _)) in player_tracks {
                let race_proportion = track_races as f64 / total_races as f64;
                if let Some(stats) = total_tracks.get_mut(&track) {
                    stats.races += track_races;
                    stats.averageRaceProportion += race_proportion;
                    stats.raceProportions.push(race_proportion);
                }
            }
        }
    }

    for stats in total_tracks.values_mut() {
        if stats.races > 0 {
            let sum: f64 = stats.raceProportions.iter().sum();
            let average = sum / stats.raceProportions.len() as f64;
            stats.averageRaceProportion = (100_000.0 * average).floor() / 1_000.0;
        }
    }

    let mut formatted_result: Vec<(&String, f64)> = total_tracks
        .iter()
        .filter(|(_, stats)| stats.raceProportions.len() > 0)
        .map(|(track, stats)| {
            (track, stats.averageRaceProportion)
        })
        .collect();

    formatted_result.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    let players_count = total_tracks
        .values()
        .find(|stats| stats.raceProportions.len() > 0)
        .map_or(0, |stats| stats.raceProportions.len());

    let result = serde_json::json!({
        "players": players_count,
        "formatted_result": formatted_result
            .into_iter()
            .map(|(track, avg_proportion)| {
                serde_json::json!([track, avg_proportion])  
            })
            .collect::<Vec<_>>(),
    });

    HttpResponse::Ok().json(result)
}
