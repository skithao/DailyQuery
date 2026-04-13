# Tasks

- [x] Task 1: 项目初始化与基础环境搭建 (DailyQuery)
  - [x] SubTask 1.1: 创建并克隆 `https://github.com/skithao/DailyQuery` 仓库，配置严格的 Code Review 流程与单元测试规范。
  - [x] SubTask 1.2: 初始化基于 Rust 的后端核心架构。
  - [x] SubTask 1.3: 初始化前端 Web 项目及无需 Android Studio 的 APP 跨平台编译框架（如 Tauri 或 Capacitor）。
  - [x] SubTask 1.4: 搭建本地数据库与存储结构（SQL 及 `.md` 目录结构，准备记忆与知识库接入）。
  - [x] SubTask 1.5: 在项目中建立 TODO 清单记录及优先级管理体系。

- [x] Task 2: 爬虫、WebSearch 与知识库模块开发
  - [x] SubTask 2.1: 实现参考 Crawl4AI 和 FireCrawl 架构的 AI 爬虫系统，支持抓取 RSS 与新闻热点。
  - [x] SubTask 2.2: 实现文本内容分类、标签提取以及兴趣匹配算法。
  - [x] SubTask 2.3: 实现参考 MaxKB 的知识库存储与检索 API，整合爬取的数据与 WebSearch 功能。
  - [x] SubTask 2.4: 编写上述模块的单元测试并进行代码重构与审查。

- [x] Task 3: 记忆系统与设置页开发
  - [x] SubTask 3.1: 参考 Mem0, Letta, Zep 等，实现长期和短期记忆系统，支持保存至 SQL 与 `.md` 文件。
  - [x] SubTask 3.2: 开发设置页前端（简单登录鉴权）。
  - [x] SubTask 3.3: 接入并实现修改智能体配置信息的接口（包括记忆偏好、兴趣等）。
  - [x] SubTask 3.4: 编写登录、记忆系统读写相关的单元测试。

- [x] Task 4: 多智能体架构与 Skill 市场生态开发
  - [x] SubTask 4.1: 参考 HermesAgent 和 NanoClaw，实现核心多智能体对话协同与路由机制。
  - [x] SubTask 4.2: 接入 awesome-open-claw-skills, CoCoLoop Skill Hub 等开源 Skill 库，搭建 Skill 市场。
  - [x] SubTask 4.3: 支持用户使用平台自制 Skill，并实现参考扣子虾评社区的自动安全评估功能。
  - [x] SubTask 4.4: 编写多智能体调度与 Skill 调用的单元测试。

- [x] Task 5: 对话页与信息流页开发
  - [x] SubTask 5.1: 开发对话页前端（包含初始化引导、日程设计、资讯深入讲解等对话流的预设）。
  - [x] SubTask 5.2: 开发信息流页（Feed）：参考知乎，实现资讯瀑布流的展示及与用户兴趣记忆的匹配排序。
  - [x] SubTask 5.3: 实现详情页渲染及“实时划词唤起智能体或多智能体研讨”功能。
  - [x] SubTask 5.4: 跨端适配，确保 Web 和 APP 上的体验一致。

- [x] Task 6: 联调、重构与上线部署
  - [x] SubTask 6.1: 执行从爬虫抓取 -> 知识库/记忆匹配 -> 信息流展示 -> 划词 -> 多智能体研讨的全链路测试。
  - [x] SubTask 6.2: 随时检查项目结构，修复发现的 bug 及重构冗余代码。
  - [x] SubTask 6.3: 运行全量单元测试，完成所有 Code Review 流程。
  - [x] SubTask 6.4: 使用所选跨平台框架将 Web 代码编译为 APP。
  - [x] SubTask 6.5: 推送最终稳定代码至 GitHub 仓库。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2], [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 5]
