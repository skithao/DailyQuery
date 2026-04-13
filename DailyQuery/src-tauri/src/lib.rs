use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::fs;
use tauri::Manager;

pub mod commands;
pub mod ai;
pub mod crawler;
pub mod kb;
pub mod websearch;

pub struct AppState {
    pub db: SqlitePool,
    pub md_dir: std::path::PathBuf,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::add_memory,
            commands::get_memories,
            commands::login,
            commands::get_agent_config,
            commands::update_agent_config,
            commands::fetch_rss_command,
            commands::fetch_news_command,
            commands::classify_and_tag_command,
            commands::add_kb_document_command,
            commands::search_kb_command,
            commands::search_web_command
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // 设置本地存储目录
            let app_data_dir = app.path().app_data_dir().unwrap_or_else(|_| {
                std::path::PathBuf::from("./.daily_query_data")
            });
            
            let sql_dir = app_data_dir.join("sql");
            let md_dir = app_data_dir.join("markdown");
            
            fs::create_dir_all(&sql_dir).expect("Failed to create SQL directory");
            fs::create_dir_all(&md_dir).expect("Failed to create Markdown directory");
            
            let db_path = sql_dir.join("daily_query.db");
            let db_url = format!("sqlite://{}?mode=rwc", db_path.to_string_lossy());
            
            // 异步初始化数据库
            let db = tauri::async_runtime::block_on(async move {
                let db = SqlitePoolOptions::new()
                    .max_connections(5)
                    .connect(&db_url)
                    .await
                    .expect("Failed to connect to SQLite");
                
                // 初始化表
                sqlx::query(
                    r#"
                    CREATE TABLE IF NOT EXISTS queries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        content TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS memories (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        content TEXT NOT NULL,
                        memory_type TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE IF NOT EXISTS agent_config (
                        id INTEGER PRIMARY KEY CHECK (id = 1),
                        config_json TEXT NOT NULL
                    );
                    
                    CREATE TABLE IF NOT EXISTS kb_documents (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        url TEXT NOT NULL UNIQUE,
                        content TEXT NOT NULL,
                        category TEXT,
                        tags TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS kb_chunks (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        document_id INTEGER NOT NULL,
                        chunk_text TEXT NOT NULL,
                        embedding TEXT NOT NULL, -- JSON array of f32
                        FOREIGN KEY(document_id) REFERENCES kb_documents(id) ON DELETE CASCADE
                    );
                    "#,
                )
                .execute(&db)
                .await
                .expect("Failed to create table");

                db
            });

            app.manage(AppState { db, md_dir });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
