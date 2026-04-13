/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ThumbsUp, MessageCircle, Star, Share2, RefreshCw } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

// Define feed item type
type FeedItem = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  upvotes: number;
  comments: number;
  cover?: string;
  url?: string;
};

// RSS Sources configuration
const RSS_SOURCES = [
  { name: "36Kr", url: "https://36kr.com/feed" },
  { name: "Hacker News", url: "https://hnrss.org/frontpage" },
  { name: "V2EX", url: "https://v2ex.com/index.xml" },
];

const INITIAL_MOCK_FEED: FeedItem[] = [
  {
    id: "1",
    title: "多模态大模型的未来趋势在哪里？",
    excerpt: "最近 OpenAI 发布的最新模型在视觉理解方面有了长足的进步。但我们是否真正触及了通用人工智能（AGI）的门槛？多模态的融合不仅是数据层面的整合，更是认知架构的一次革命...",
    author: "AI前沿",
    upvotes: 1245,
    comments: 320,
    cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "如何看待2026年全球半导体产业格局的变化？",
    excerpt: "从先进制程的争夺到新型封装技术的崛起，半导体行业正经历着深刻的变革。本文将带你深度解析目前各家巨头的战略布局以及未来的潜在技术路线图...",
    author: "芯科技",
    upvotes: 892,
    comments: 156,
  }
];

export default function FeedPage() {
  const { t, language } = useTranslation();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Initial fetch on mount
  useEffect(() => {
    fetchRealData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRealData = async () => {
    setIsFetching(true);
    try {
      const allArticles: FeedItem[] = [];
      
      // Fetch all RSS sources concurrently
      const fetchPromises = RSS_SOURCES.map(async (source) => {
        try {
          let articles = [];
          
          // Check if we are running inside Tauri (has window.__TAURI_INTERNALS__)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            articles = await invoke<any[]>("fetch_rss_command", { url: source.url });
          } else {
            // We are running in pure Web mode (Next.js dev server), Tauri IPC is not available.
            // Use rss2json API to proxy the RSS fetch and bypass CORS in browser.
            const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&api_key=`;
            const res = await fetch(proxyUrl);
            const data = await res.json();
            
            if (data.status === "ok" && data.items) {
              // Map rss2json format to match our Rust crawler format
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              articles = data.items.map((item: any) => ({
                title: item.title,
                url: item.link,
                // Extract plain text from HTML content for excerpt
                content: (item.content || item.description || "").replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ')
              }));
            } else {
              throw new Error("RSS Proxy returned error: " + data.message);
            }
          }
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return articles.map((article: any, idx: number) => ({
            id: `rss-${source.name}-${Date.now()}-${idx}`,
            title: article.title,
            // Limit excerpt to 150 chars and remove some markdown artifacts if any
            excerpt: (article.content || "Click to read more...").substring(0, 150) + "...",
            author: source.name,
            url: article.url,
            upvotes: Math.floor(Math.random() * 500) + 10,
            comments: Math.floor(Math.random() * 50),
          }));
        } catch (e) {
          console.error(`Failed to fetch RSS from ${source.name}:`, e);
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      
      // Flatten and shuffle slightly to mix sources
      const combinedResults = results.flat().sort(() => Math.random() - 0.5);
      
      if (combinedResults.length > 0) {
        setFeed(combinedResults);
      } else {
        // Fallback to mock if all RSS fetches fail
        setFeed(INITIAL_MOCK_FEED);
      }
    } catch (err) {
      console.error("Failed to fetch real data, falling back to mock:", err);
      setFeed(INITIAL_MOCK_FEED);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <header className="px-6 py-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-10 flex gap-8 items-center">
        <span className="font-semibold text-base text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 pb-1.5 transition-colors cursor-pointer">
          {language === 'zh' ? '推荐' : 'Recommended'}
        </span>
        <span className="font-medium text-base text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer pb-1.5">
          {language === 'zh' ? '关注' : 'Following'}
        </span>
        <span className="font-medium text-base text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer pb-1.5">
          {language === 'zh' ? '热榜' : 'Hot'}
        </span>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6 space-y-6">
        <div className="mb-8 mt-2 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">{t.feed.title}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t.feed.subtitle}</p>
          </div>
          <button 
            onClick={fetchRealData}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {language === 'zh' ? '获取最新' : 'Fetch Latest'}
          </button>
        </div>

        {feed.length === 0 && isFetching && (
          <div className="flex justify-center items-center py-20">
            <RefreshCw size={32} className="animate-spin text-zinc-400" />
          </div>
        )}

        {feed.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i % 10) * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            key={item.id}
            className="group bg-white dark:bg-zinc-900/80 p-5 md:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <h2 className="text-[1.35rem] leading-snug font-bold text-zinc-900 dark:text-zinc-100 mb-3 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
              <Link href={`/feed/${item.id}`}>{item.title}</Link>
            </h2>
            
            <div className="flex flex-col md:flex-row gap-5 mb-4">
              <Link href={`/feed/${item.id}`} className="flex-1 text-zinc-600 dark:text-zinc-400 text-[15px] leading-relaxed cursor-pointer line-clamp-3 md:line-clamp-4">
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 mr-2">
                  {item.author}:
                </span>
                {item.excerpt}
              </Link>
              {item.cover && (
                <div className="w-full md:w-44 h-36 md:h-auto shrink-0 rounded-xl overflow-hidden relative border border-zinc-100 dark:border-zinc-800">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <ThumbsUp size={15} />
                <span>{item.upvotes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                <MessageCircle size={15} />
                <span>{item.comments}</span>
              </button>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  <Share2 size={15} />
                  <span>{language === 'zh' ? '原链接' : 'Source'}</span>
                </a>
              ) : (
                <button className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  <Share2 size={15} />
                  <span>{language === 'zh' ? '分享' : 'Share'}</span>
                </button>
              )}
              <button className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors ml-auto">
                <Star size={15} />
                <span>{language === 'zh' ? '收藏' : 'Save'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
