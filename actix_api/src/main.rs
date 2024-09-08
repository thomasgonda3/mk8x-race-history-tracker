use actix_web::{middleware, web, App, HttpServer, Result, Error};
use actix_cors::Cors;
use actix_files as fs;
use sqlx::mssql::MssqlPoolOptions;
use std::env;
use std::path::PathBuf;

mod cache;
mod models;
mod endpoints;
mod config;

use crate::cache::start_cache_refresh_task;
use endpoints::{player::get_player, player::get_players, races::get_races, all_races::get_all_races, submit::submit_races};

// Import the cache refresh function

async fn index(build_dir: web::Data<PathBuf>) -> Result<fs::NamedFile, Error> {
    Ok(fs::NamedFile::open(build_dir.join("index.html"))?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    let mut build_dir: PathBuf = env::current_dir().expect("Failed to get current directory");
    build_dir.push("..");
    build_dir.push("build");
    let build_dir_data: web::Data<PathBuf> = web::Data::new(build_dir.clone());

    println!("Serving files from: {:?}", build_dir);
    
    let db_name = if env::var("REACT_APP_IS_PRODUCTION").is_ok() {
        env::var("DATABASE_NAME").unwrap()
    } else {
        env::var("TEST_DATABASE_NAME").unwrap()
    };

    let pool: sqlx::Pool<sqlx::Mssql> = MssqlPoolOptions::new()
    .max_connections(100)
    .connect(&format!(
        "sqlx://{}:{}@{}/{}",
        env::var("DATABASE_USER").unwrap(),
        env::var("DATABASE_PASSWORD").unwrap(),
        env::var("DATABASE_SERVER").unwrap(),
        db_name
    ))
    .await
    .expect("Failed to create pool.");

    let port: String = env::var("API_PORT").unwrap_or_else(|_| "8080".to_string());

    start_cache_refresh_task(pool.clone());

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(build_dir_data.clone())
            .wrap(Cors::permissive())
            .wrap(middleware::Compress::default())
            .service(get_player)
            .service(get_players)
            .service(get_races)
            .service(get_all_races)
            .service(submit_races)
            .service(fs::Files::new("/static", build_dir.join("static")).show_files_listing())
            .default_service(
                web::route().to(index)
            )
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}