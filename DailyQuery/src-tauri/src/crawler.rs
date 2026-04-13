use reqwest::Client;
use rss::Channel;
use scraper::{Html, Selector};
use htmd::HtmlToMarkdown;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Article {
    pub title: String,
    pub url: String,
    pub content: String,
}

pub async fn fetch_rss(url: &str) -> Result<Vec<Article>, anyhow::Error> {
    let client = Client::new();
    let content = client.get(url).send().await?.bytes().await?;
    let channel = Channel::read_from(&content[..])?;

    let mut articles = Vec::new();
    for item in channel.items() {
        if let (Some(title), Some(link)) = (item.title(), item.link()) {
            articles.push(Article {
                title: title.to_string(),
                url: link.to_string(),
                content: String::new(), // content is fetched later or from description
            });
        }
    }
    Ok(articles)
}

pub async fn fetch_news(url: &str) -> Result<Article, anyhow::Error> {
    let client = Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36")
        .build()?;
    let res = client.get(url).send().await?;
    let html = res.text().await?;

    let document = Html::parse_document(&html);
    
    // Attempt to extract title
    let title_selector = Selector::parse("title").unwrap();
    let title = document
        .select(&title_selector)
        .next()
        .map(|el| el.text().collect::<Vec<_>>().join(""))
        .unwrap_or_else(|| "Untitled".to_string());

    // Extract main content heuristically (simplified Readability)
    // For a more robust approach, we convert body to markdown and clean up.
    // Or we find "article" tag, or "main" tag.
    let article_selector = Selector::parse("article, main, .content, #content, .post-content, .article-content").unwrap();
    let mut main_html = String::new();
    
    if let Some(article) = document.select(&article_selector).next() {
        main_html = article.inner_html();
    } else {
        // fallback to body
        let body_selector = Selector::parse("body").unwrap();
        if let Some(body) = document.select(&body_selector).next() {
            main_html = body.inner_html();
        }
    }

    let converter = HtmlToMarkdown::builder().build();
    let content_md = converter.convert(&main_html).unwrap_or_default();

    Ok(Article {
        title: title.trim().to_string(),
        url: url.to_string(),
        content: content_md.trim().to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_fetch_rss() {
        let res = fetch_rss("https://hnrss.org/frontpage").await;
        assert!(res.is_ok(), "RSS fetch failed: {:?}", res.err());
        let articles = res.unwrap();
        assert!(!articles.is_empty(), "RSS feed is empty");
    }
}
