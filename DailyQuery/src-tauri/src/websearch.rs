use reqwest::Client;
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WebSearchResult {
    pub title: String,
    pub link: String,
    pub snippet: String,
}

pub async fn search_web(query: &str) -> Result<Vec<WebSearchResult>, anyhow::Error> {
    let client = Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36")
        .build()?;
    
    let res = client
        .get("https://html.duckduckgo.com/html/")
        .query(&[("q", query)])
        .send()
        .await?;

    let html = res.text().await?;
    let document = Html::parse_document(&html);
    
    let result_selector = Selector::parse(".result").unwrap();
    let title_selector = Selector::parse(".result__title .result__a").unwrap();
    let snippet_selector = Selector::parse(".result__snippet").unwrap();

    let mut results = Vec::new();

    for element in document.select(&result_selector) {
        if let Some(title_el) = element.select(&title_selector).next() {
            let title = title_el.text().collect::<Vec<_>>().join("").trim().to_string();
            let link = title_el.value().attr("href").unwrap_or_default().to_string();
            
            // Clean DDG redirect URL if necessary, e.g. //duckduckgo.com/l/?uddg=...
            let clean_link = if link.starts_with("//duckduckgo.com/l/?uddg=") {
                let parts: Vec<&str> = link.split("uddg=").collect();
                if parts.len() > 1 {
                    let decoded = urlencoding::decode(parts[1].split('&').next().unwrap_or("")).unwrap_or_default();
                    decoded.to_string()
                } else {
                    link.clone()
                }
            } else {
                link.clone()
            };

            let snippet = if let Some(snippet_el) = element.select(&snippet_selector).next() {
                snippet_el.text().collect::<Vec<_>>().join("").trim().to_string()
            } else {
                String::new()
            };

            results.push(WebSearchResult {
                title,
                link: clean_link,
                snippet,
            });
        }
    }

    Ok(results)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_search_web() {
        let res = search_web("Rust programming language").await;
        assert!(res.is_ok());
        let results = res.unwrap();
        assert!(!results.is_empty());
    }
}
