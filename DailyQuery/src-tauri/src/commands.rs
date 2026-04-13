use crate::AppState;
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::State;

use crate::ai::{classify_and_tag, AIResult};
use crate::crawler::{fetch_news, fetch_rss, Article};
use crate::kb::{add_document, search_documents, SearchResult};
use crate::websearch::{search_web, WebSearchResult};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Memory {
    pub id: i64,
    pub content: String,
    pub memory_type: String, // "short" or "long"
    pub created_at: String,
}

#[tauri::command]
pub async fn add_memory(
    state: State<'_, AppState>,
    content: String,
    memory_type: String,
) -> Result<i64, String> {
    let db = &state.db;
    
    let result = sqlx::query(
        "INSERT INTO memories (content, memory_type) VALUES (?, ?)"
    )
    .bind(&content)
    .bind(&memory_type)
    .execute(db)
    .await
    .map_err(|e| e.to_string())?;

    let id = result.last_insert_rowid();

    // 如果是长期记忆，存储到.md文件中
    if memory_type == "long" {
        let file_name = format!("memory_{}.md", id);
        let file_path = state.md_dir.join(file_name);
        fs::write(&file_path, &content).map_err(|e| e.to_string())?;
    }

    Ok(id)
}

#[tauri::command]
pub async fn get_memories(state: State<'_, AppState>) -> Result<Vec<Memory>, String> {
    let db = &state.db;
    let memories = sqlx::query_as::<_, Memory>(
        "SELECT id, content, memory_type, created_at FROM memories ORDER BY created_at DESC"
    )
    .fetch_all(db)
    .await
    .map_err(|e| e.to_string())?;

    Ok(memories)
}

#[tauri::command]
pub fn login(password: String) -> Result<bool, String> {
    // 简单硬编码密码，实际应该使用更安全的存储或哈希
    Ok(password == "admin123")
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AgentConfig {
    pub name: String,
    pub model: String,
    pub temperature: f64,
    pub system_prompt: String,
}

#[tauri::command]
pub async fn get_agent_config(state: State<'_, AppState>) -> Result<AgentConfig, String> {
    let db = &state.db;
    let row: Option<(String,)> = sqlx::query_as(
        "SELECT config_json FROM agent_config WHERE id = 1"
    )
    .fetch_optional(db)
    .await
    .map_err(|e| e.to_string())?;

    if let Some((config_json,)) = row {
        let config: AgentConfig = serde_json::from_str(&config_json).unwrap_or_else(|_| default_config());
        Ok(config)
    } else {
        Ok(default_config())
    }
}

#[tauri::command]
pub async fn update_agent_config(
    state: State<'_, AppState>,
    config: AgentConfig,
) -> Result<(), String> {
    let db = &state.db;
    let json_str = serde_json::to_string(&config).map_err(|e| e.to_string())?;

    sqlx::query(
        "INSERT INTO agent_config (id, config_json) VALUES (1, ?)
         ON CONFLICT(id) DO UPDATE SET config_json = excluded.config_json"
    )
    .bind(&json_str)
    .execute(db)
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}

fn default_config() -> AgentConfig {
    AgentConfig {
        name: "DailyQuery Agent".to_string(),
        model: "gpt-4o".to_string(),
        temperature: 0.7,
        system_prompt: "You are a helpful assistant.".to_string(),
    }
}

#[tauri::command]
pub async fn fetch_rss_command(url: String) -> Result<Vec<Article>, String> {
    fetch_rss(&url).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_news_command(url: String) -> Result<Article, String> {
    fetch_news(&url).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn classify_and_tag_command(text: String) -> Result<AIResult, String> {
    classify_and_tag(&text).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_kb_document_command(
    state: State<'_, AppState>,
    title: String,
    url: String,
    content: String,
    category: String,
    tags: Vec<String>,
) -> Result<i64, String> {
    add_document(&state.db, &title, &url, &content, &category, &tags)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn search_kb_command(
    state: State<'_, AppState>,
    query: String,
    limit: usize,
) -> Result<Vec<SearchResult>, String> {
    search_documents(&state.db, &query, limit)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn search_web_command(query: String) -> Result<Vec<WebSearchResult>, String> {
    search_web(&query).await.map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_login_success() {
        let result = login("admin123".to_string());
        assert_eq!(result.unwrap(), true);
    }

    #[test]
    fn test_login_failure() {
        let result = login("wrongpassword".to_string());
        assert_eq!(result.unwrap(), false);
    }

    #[test]
    fn test_default_config() {
        let config = default_config();
        assert_eq!(config.name, "DailyQuery Agent");
        assert_eq!(config.model, "gpt-4o");
        assert_eq!(config.temperature, 0.7);
    }
}
