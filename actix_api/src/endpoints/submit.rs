use actix_web::{post, web, HttpResponse, Responder};
use sqlx::{Mssql, Pool};
use serde::Deserialize;
use serde_json::json;

#[derive(Deserialize)]
struct SubmitRequest {
    #[serde(rename = "trackData")]
    track_data: Vec<(String, i32)>,
    #[serde(rename = "mode")]
    mode: String,
    #[serde(rename = "apiKey")]
    api_key: String,
}

#[post("/api/submit")]
async fn submit_races(
    pool: web::Data<Pool<Mssql>>,
    form: web::Json<SubmitRequest>,
) -> impl Responder {
    // Validate api_key
    if form.api_key.is_empty() {
        return HttpResponse::BadRequest().json(json!({"error": "Invalid API Key value."}));
    }

    // Validate mode
    let valid_modes = vec!["Casual", "Mogi", "War", "Tournament"];
    if !valid_modes.contains(&form.mode.as_str()) {
        return HttpResponse::BadRequest().json(json!({"error": "Invalid Mode value."}));
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

    if form.track_data.is_empty() {
        return HttpResponse::BadRequest().json(json!({"error": "Invalid Track Data type; expecting array with length greater than 0."}));
    }

    for (track, position) in &form.track_data {
        if !tracks_array.contains(&track.as_str()) {
            return HttpResponse::BadRequest().json(json!({"error": format!("Invalid track abbreviation: {}", track)}));
        }
        if *position < 1 || *position > 12 {
            return HttpResponse::BadRequest().json(json!({"error": format!("Position for track {} is invalid; expecting an integer between 1 and 12.", track)}));
        }
    }

    // Fetch player ID using API Key
    let api_key_query = r#"
        SELECT TOP (1) [ID], [Discord_ID]
        FROM [dbo].[Players]
        WHERE [API_Key] = @p1
    "#;

    let result = sqlx::query_as::<_, (i32, String)>(api_key_query)
        .bind(&form.api_key)
        .fetch_optional(pool.get_ref())
        .await;

    match result {
        Ok(Some((player_id, discord_id))) => {
            // Prepare values for insertion
            let values: Vec<String> = form.track_data
                .iter()
                .map(|(track, position)| {
                    format!("({}, '{}', '{}', '{}', {})", player_id, discord_id, track, form.mode, position)
                })
                .collect();

            let insert_query = format!(
                "INSERT INTO [dbo].[Races] (PlayerID, Discord_ID, Track, Mode, Result) VALUES {}",
                values.join(",")
            );

            // Execute the insertion query
            if let Err(err) = sqlx::query(&insert_query)
                .execute(pool.get_ref())
                .await
            {
                eprintln!("Error inserting race data: {:?}", err);
                return HttpResponse::InternalServerError().json(json!({"error": "Failed to insert race data."}));
            }

            let url = format!("https://mk8dx-race-history-tracker.com/player/{}", player_id);
            HttpResponse::Ok().json(json!({
                "message": format!("Insert Successful; view new races at {}", url)
            }))
        }
        Ok(None) => HttpResponse::BadRequest().json(json!({"error": "No match with API Key in the database."})),
        Err(err) => {
            eprintln!("Database error: {:?}", err);
            HttpResponse::InternalServerError().json(json!({"error": "Database error."}))
        }
    }
}
