use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, Duration};
use crate::models::AllRaceResponse;
use lazy_static::lazy_static;
use tokio::task;
use sqlx::{Mssql, Pool};
use actix_rt::time::interval;

pub struct CacheEntry {
    pub data: Vec<AllRaceResponse>,
    pub timestamp: SystemTime,
}

pub struct Cache {
    pub data: Mutex<HashMap<String, CacheEntry>>,
    pub expiration_duration: Duration,
}

impl Cache {
    pub fn new(expiration_duration: Duration) -> Self {
        Cache {
            data: Mutex::new(HashMap::new()),
            expiration_duration,
        }
    }

    pub fn get(&self, key: &str) -> Option<Vec<AllRaceResponse>> {
        let data = self.data.lock().unwrap();
        if let Some(entry) = data.get(key) {
            if entry.timestamp.elapsed().unwrap() < self.expiration_duration {
                return Some(entry.data.clone());
            } else {
                // Cache entry is expired
                return None;
            }
        }
        None
    }

    pub fn set(&self, key: String, value: Vec<AllRaceResponse>) {
        let mut data = self.data.lock().unwrap();
        data.insert(key, CacheEntry {
            data: value,
            timestamp: SystemTime::now(),
        });
    }

    pub fn clean_up(&self) {
        let now = SystemTime::now();
        let mut data = self.data.lock().unwrap();
        data.retain(|_, entry| entry.timestamp.elapsed().unwrap() < self.expiration_duration);
    }
}

// Create the global CACHE instance
lazy_static! {
    pub static ref CACHE: Arc<Cache> = Arc::new(Cache::new(Duration::new(600, 0))); // 10 minutes
}

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

// Function to periodically refresh the cache
async fn refresh_cache_periodically(pool: Pool<Mssql>, interval_duration: Duration) {
    let mut interval = interval(interval_duration);

    loop {
        interval.tick().await;  // Wait for the next interval tick

        let modes = vec!["Mogi", "War", "Mixed"];
        for mode in modes {
            // Fetch data from the database and update the cache
            if let Ok(races) = fetch_races_from_db(&pool, mode).await {
                CACHE.set(mode.to_string(), races);
            }
        }

        // Clean up expired cache entries
        CACHE.clean_up();
    }
}

// Start the periodic cache refresh in a background task
pub fn start_cache_refresh_task(pool: Pool<Mssql>) {
    let interval_duration = Duration::new(600, 0); // 10 minutes
    task::spawn(async move {
        refresh_cache_periodically(pool, interval_duration).await;
    });
}