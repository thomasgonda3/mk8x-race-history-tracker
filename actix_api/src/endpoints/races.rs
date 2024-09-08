use actix_web::{get, web, HttpResponse, Responder};
use crate::models::{RaceResponse, RaceQuery};
use sqlx::Pool;
use sqlx::Mssql;
use chrono;

#[get("/api/races")]
pub async fn get_races(pool: web::Data<Pool<Mssql>>, query: web::Query<RaceQuery>) -> impl Responder {
    let player_id = query.playerID;

    let races_query = r#"
        SELECT 
            r.[ID],
            r.[Track],
            r.[Mode],
            r.[Result],
            FORMAT(r.[Date], 'yyyy-MM-ddTHH:mm:ss') + 'Z' AS Date
        FROM [dbo].[Races] r
        JOIN [dbo].[Players] p ON r.[PlayerID] = p.[ID]
        WHERE r.[PlayerID] = @p1
    "#;

    match sqlx::query_as::<_, RaceResponse>(races_query)
        .bind(player_id)
        .fetch_all(pool.get_ref())
        .await
    {
        Ok(mut races) => {
            // Parse the string Date and sort
            races.sort_by(|a, b| {
                let date_a = chrono::DateTime::parse_from_rfc3339(&a.Date)
                    .unwrap_or_else(|_| chrono::Utc::now().with_timezone(&chrono::FixedOffset::east_opt(0).unwrap()));
                let date_b = chrono::DateTime::parse_from_rfc3339(&b.Date)
                    .unwrap_or_else(|_| chrono::Utc::now().with_timezone(&chrono::FixedOffset::east_opt(0).unwrap()));
                date_b.cmp(&date_a) // Sort in descending order
            });

            HttpResponse::Ok().json(races)
        }
        Err(e) => {
            println!("Database query failed: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}
