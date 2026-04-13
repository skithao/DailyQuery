export const translations = {
  zh: {
    nav: {
      chat: '对话',
      feed: '资讯',
      settings: '设置',
    },
    chat: {
      greeting: '你好！我是 DailyQuery 智能体。',
      greetingSub: '我可以为你解读每日资讯、管理日程，或深入探讨任何话题。',
      placeholder: '在这里输入你感兴趣的话题...',
      presetTech: '🤖 聊聊今天的AI大模型进展',
      presetNews: '📰 为我总结今天的头条新闻',
      presetSchedule: '📅 帮我规划一下今天的日程',
    },
    feed: {
      title: '今日资讯',
      subtitle: '为你精选的全网热点与个性化推荐',
      discuss: '参与讨论',
      readMore: '阅读原文',
      tooltip: '划词探讨',
      tooltipAction: '与智能体深入讨论',
    },
    settings: {
      title: '系统设置',
      agentConfig: '智能体配置',
      agentName: '智能体名称',
      agentModel: '默认模型',
      temperature: '创造力 (Temperature)',
      systemPrompt: '系统预设 (System Prompt)',
      save: '保存配置',
      saving: '保存中...',
      saved: '保存成功！',
      language: '界面语言',
      theme: '外观主题',
      themeSystem: '跟随系统',
      themeLight: '明亮模式',
      themeDark: '黑暗模式',
    },
    common: {
      loading: '加载中...',
      error: '发生错误',
      cancel: '取消',
      confirm: '确认',
    }
  },
  en: {
    nav: {
      chat: 'Chat',
      feed: 'Feed',
      settings: 'Settings',
    },
    chat: {
      greeting: 'Hello! I am DailyQuery Agent.',
      greetingSub: 'I can analyze daily news, manage your schedule, or dive deep into any topic.',
      placeholder: 'Type a topic you are interested in...',
      presetTech: '🤖 Talk about AI models progress today',
      presetNews: '📰 Summarize today\'s top headlines',
      presetSchedule: '📅 Help me plan my schedule today',
    },
    feed: {
      title: 'Today\'s Feed',
      subtitle: 'Curated trending news & personalized recommendations',
      discuss: 'Discuss',
      readMore: 'Read More',
      tooltip: 'Highlight & Discuss',
      tooltipAction: 'Deep dive with agents',
    },
    settings: {
      title: 'System Settings',
      agentConfig: 'Agent Configuration',
      agentName: 'Agent Name',
      agentModel: 'Default Model',
      temperature: 'Creativity (Temperature)',
      systemPrompt: 'System Prompt',
      save: 'Save Config',
      saving: 'Saving...',
      saved: 'Saved successfully!',
      language: 'Language',
      theme: 'Appearance',
      themeSystem: 'System',
      themeLight: 'Light',
      themeDark: 'Dark',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      cancel: 'Cancel',
      confirm: 'Confirm',
    }
  }
};

export type Language = 'zh' | 'en';
export type TranslationDict = typeof translations['zh'];

export function getTranslation(lang: Language): TranslationDict {
  return translations[lang] || translations.zh;
}
