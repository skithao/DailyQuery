use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize, Deserialize)]
pub struct AIResult {
    pub category: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenAIEmbeddingResponse {
    data: Vec<EmbeddingData>,
}

#[derive(Debug, Serialize, Deserialize)]
struct EmbeddingData {
    embedding: Vec<f32>,
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenAIChatResponse {
    choices: Vec<Choice>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Choice {
    message: Message,
}

#[derive(Debug, Serialize, Deserialize)]
struct Message {
    content: String,
}

// Function to get an embedding for text using OpenAI API
pub async fn get_embedding(text: &str) -> Result<Vec<f32>, anyhow::Error> {
    let api_key = std::env::var("OPENAI_API_KEY").unwrap_or_default();
    if api_key.is_empty() {
        // Return dummy embedding if no API key for test purposes
        return Ok(vec![0.0; 1536]);
    }
    
    let client = Client::new();
    let res = client.post("https://api.openai.com/v1/embeddings")
        .bearer_auth(api_key)
        .json(&json!({
            "model": "text-embedding-3-small",
            "input": text
        }))
        .send().await?;

    let resp: OpenAIEmbeddingResponse = res.json().await?;
    if resp.data.is_empty() {
        return Err(anyhow::anyhow!("No embedding returned"));
    }
    Ok(resp.data[0].embedding.clone())
}

// Function to classify and extract tags
pub async fn classify_and_tag(text: &str) -> Result<AIResult, anyhow::Error> {
    let api_key = std::env::var("OPENAI_API_KEY").unwrap_or_default();
    if api_key.is_empty() {
        // Return dummy result
        return Ok(AIResult {
            category: "Uncategorized".to_string(),
            tags: vec!["test".to_string()],
        });
    }

    let client = Client::new();
    let prompt = format!(
        "Analyze the following text. Provide a classification category and a list of up to 5 relevant tags. Output in JSON format exactly like: {{\"category\": \"Technology\", \"tags\": [\"AI\", \"Rust\"]}}\n\nText: {}",
        text.chars().take(2000).collect::<String>() // truncate to avoid token limit
    );

    let res = client.post("https://api.openai.com/v1/chat/completions")
        .bearer_auth(api_key)
        .json(&json!({
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that outputs only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }))
        .send().await?;

    let resp: OpenAIChatResponse = res.json().await?;
    if resp.choices.is_empty() {
        return Err(anyhow::anyhow!("No chat response"));
    }
    
    let content = &resp.choices[0].message.content;
    let result: AIResult = serde_json::from_str(content)?;
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_get_embedding_dummy() {
        let res = get_embedding("Hello world").await;
        assert!(res.is_ok());
        assert_eq!(res.unwrap().len(), 1536);
    }

    #[tokio::test]
    async fn test_classify_dummy() {
        let res = classify_and_tag("Rust is a great systems programming language.").await;
        assert!(res.is_ok());
        let val = res.unwrap();
        assert_eq!(val.category, "Uncategorized"); // because dummy
    }
}
