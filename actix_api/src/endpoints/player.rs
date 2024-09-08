use actix_web::{get, web, HttpResponse, Responder};
use crate::models::{PlayerResponse, PlayersQuery, PlayerQuery};
use sqlx::Pool;
use sqlx::Mssql;

#[get("/api/player")]
pub async fn get_player(pool: web::Data<Pool<Mssql>>, query: web::Query<PlayerQuery>) -> impl Responder {
    let player_id = query.playerID.unwrap_or(0);

    let player_query = format!(r#"
    SELECT 
        [ID],
        [Name],
        [Discord_Name],
        [Team],
        [Race_Total],
        CONCAT(
            FORMAT([Most_Recent_Race], 'yyyy-MM-ddTHH:mm:ss'),
            '.',
            RIGHT(FORMAT([Most_Recent_Race], 'fff'), 3),
            'Z'
        ) AS Most_Recent_Race
    FROM [dbo].[Players]
    WHERE [ID] = {}
"#, player_id);

    match sqlx::query_as::<_, PlayerResponse>(&player_query)
        .fetch_all(pool.get_ref())
        .await
    {
        Ok(players) => {
            HttpResponse::Ok().json(players)
        }
        Err(e) => {
            println!("Database query failed: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}

#[get("/api/players")]
pub async fn get_players(pool: web::Data<Pool<Mssql>>, query: web::Query<PlayersQuery>) -> impl Responder {
    let page = query.page.unwrap_or(0);
    let page_amount = query.pageAmount.unwrap_or(50);
    let player_name = query.playerName.clone().unwrap_or("".to_string());

    let players_query = r#"
    WITH pg AS (
        SELECT [ID]
        FROM [dbo].[Players]
        WHERE [Name] LIKE @p1
        ORDER BY [Most_Recent_Race] DESC
        OFFSET @p2 ROWS FETCH NEXT @p3 ROWS ONLY
    )
    SELECT 
        t.[ID], 
        t.[Name], 
        t.[Discord_Name], 
        t.[Team], 
        t.[Race_Total], 
        CONCAT(
            FORMAT(t.[Most_Recent_Race], 'yyyy-MM-ddTHH:mm:ss'),
            '.',
            RIGHT(FORMAT(t.[Most_Recent_Race], 'fff'), 3),
            'Z'
        ) AS Most_Recent_Race
    FROM [dbo].[Players] AS t
    INNER JOIN pg ON t.[ID] = pg.[ID]
    ORDER BY t.[Most_Recent_Race] DESC;
    "#;

    let wildcard_name = format!("%{}%", player_name);
    let rows = page * page_amount;

    match sqlx::query_as::<_, PlayerResponse>(players_query)
        .bind(wildcard_name)
        .bind(rows)
        .bind(page_amount)
        .fetch_all(pool.get_ref())
        .await
    {
        Ok(players) => HttpResponse::Ok().json(players),
        Err(e) => {
            println!("Database query failed: {:?}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}
