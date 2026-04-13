use sqlx::SqlitePool;
use serde::{Serialize, Deserialize};
use crate::ai::get_embedding;

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResult {
    pub document_id: i64,
    pub title: String,
    pub url: String,
    pub content_snippet: String,
    pub similarity: f32,
}

pub async fn add_document(
    db: &SqlitePool,
    title: &str,
    url: &str,
    content: &str,
    category: &str,
    tags: &[String],
) -> Result<i64, anyhow::Error> {
    let tags_json = serde_json::to_string(tags)?;

    // Start a transaction
    let mut tx = db.begin().await?;

    let result = sqlx::query!(
        r#"
        INSERT INTO kb_documents (title, url, content, category, tags)
        VALUES (?1, ?2, ?3, ?4, ?5)
        ON CONFLICT(url) DO UPDATE SET content=excluded.content, category=excluded.category, tags=excluded.tags
        "#,
        title, url, content, category, tags_json
    )
    .execute(&mut *tx)
    .await?;

    // If it's an update, the ID might not be returned properly via last_insert_rowid if unchanged,
    // so let's query the ID.
    let doc_id = sqlx::query_scalar!(
        "SELECT id FROM kb_documents WHERE url = ?",
        url
    )
    .fetch_one(&mut *tx)
    .await?;

    // Delete existing chunks if updating
    sqlx::query!("DELETE FROM kb_chunks WHERE document_id = ?", doc_id)
        .execute(&mut *tx)
        .await?;

    // Basic chunking: split by paragraphs or max length
    let chunks = content.split("\n\n").filter(|s| !s.trim().is_empty());
    
    for chunk in chunks {
        let chunk_str = chunk.to_string();
        let embedding = get_embedding(&chunk_str).await?;
        let embedding_json = serde_json::to_string(&embedding)?;

        sqlx::query!(
            "INSERT INTO kb_chunks (document_id, chunk_text, embedding) VALUES (?, ?, ?)",
            doc_id, chunk_str, embedding_json
        )
        .execute(&mut *tx)
        .await?;
    }

    tx.commit().await?;

    Ok(doc_id)
}

fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    let dot_product: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
    let norm_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let norm_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();
    
    if norm_a == 0.0 || norm_b == 0.0 {
        return 0.0;
    }
    dot_product / (norm_a * norm_b)
}

pub async fn search_documents(
    db: &SqlitePool,
    query: &str,
    limit: usize,
) -> Result<Vec<SearchResult>, anyhow::Error> {
    let query_embedding = get_embedding(query).await?;

    // Fetch all chunks
    // In a real production system, you'd use a vector database extension like sqlite-vss.
    // For local usage with small KBs, in-memory calculation is perfectly fine.
    struct ChunkRow {
        document_id: i64,
        title: String,
        url: String,
        chunk_text: String,
        embedding: String,
    }

    let rows = sqlx::query_as!(
        ChunkRow,
        r#"
        SELECT c.document_id, d.title, d.url, c.chunk_text, c.embedding
        FROM kb_chunks c
        JOIN kb_documents d ON c.document_id = d.id
        "#
    )
    .fetch_all(db)
    .await?;

    let mut results = Vec::new();

    for row in rows {
        let chunk_embedding: Vec<f32> = serde_json::from_str(&row.embedding)?;
        let sim = cosine_similarity(&query_embedding, &chunk_embedding);

        results.push(SearchResult {
            document_id: row.document_id,
            title: row.title,
            url: row.url,
            content_snippet: row.chunk_text,
            similarity: sim,
        });
    }

    // Sort descending by similarity
    results.sort_by(|a, b| b.similarity.partial_cmp(&a.similarity).unwrap_or(std::cmp::Ordering::Equal));
    
    // Deduplicate by document_id (keep the highest similarity chunk for each doc)
    let mut unique_results = Vec::new();
    let mut seen_docs = std::collections::HashSet::new();

    for res in results {
        if !seen_docs.contains(&res.document_id) {
            seen_docs.insert(res.document_id);
            unique_results.push(res);
        }
        if unique_results.len() >= limit {
            break;
        }
    }

    Ok(unique_results)
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::sqlite::SqlitePoolOptions;

    #[tokio::test]
    async fn test_kb_crud_search() {
        let db = SqlitePoolOptions::new()
            .connect("sqlite::memory:")
            .await
            .unwrap();

        sqlx::query(
            r#"
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
                embedding TEXT NOT NULL,
                FOREIGN KEY(document_id) REFERENCES kb_documents(id) ON DELETE CASCADE
            );
            "#
        )
        .execute(&db)
        .await
        .unwrap();

        let doc_id = add_document(
            &db,
            "Rust Language",
            "https://rust-lang.org",
            "Rust is a systems programming language.",
            "Programming",
            &["rust".to_string()]
        ).await.unwrap();

        assert_eq!(doc_id, 1);

        let search_res = search_documents(&db, "What is Rust?", 5).await.unwrap();
        assert_eq!(search_res.len(), 1);
        assert_eq!(search_res[0].title, "Rust Language");
    }
}
