# Checklist

- [x] 项目成功初始化，创建 DailyQuery GitHub 仓库并部署好基于 Rust 核心与跨平台 Web/App（如 Tauri/Capacitor）的基础架构。
- [x] TODO 管理和优先级系统已在项目中建立，所有提交前均进行严格的 Code Review。
- [x] 爬虫模块与 WebSearch 功能完成开发，能抓取热点新闻及 RSS（参考 Crawl4AI/FireCrawl）。
- [x] 知识库系统（参考 MaxKB）成功构建，支持文本的分类、存储与检索。
- [x] 记忆系统（参考 Mem0 等）有效工作，支持保存对话上下文及用户偏好至 SQL 数据库与 `.md` 文件。
- [x] 设置页开发完成，提供简单的登录等鉴权机制，并能修改智能体的各类配置。
- [x] 多智能体架构（参考 HermesAgent/NanoClaw）正常运作，能够进行有效的协同工作和路由。
- [x] Skill 市场（接入 awesome-open-claw-skills 等开源库）就绪，支持用户自制 Skill 及自动安全评估功能（参考扣子虾评社区）。
- [x] 信息流页（Feed）能够展示瀑布流资讯（参考知乎），并能根据用户兴趣、记忆系统有效过滤并展示个性化内容。
- [x] 对话页成功渲染，预设对话流（初始化引导、日程设计、资讯深入讲解等）可以顺畅进行交互。
- [x] 资讯详情页中的“划词交互”功能可以正确触发并唤起智能体或进入多智能体研讨室。
- [x] 全链路单元测试覆盖率达标，所有核心功能经过验证且没有明显 Bug。
- [x] Web 页面被成功编译并打包为 APP 格式，不依赖 Android Studio。
- [x] 代码实时同步至 `https://github.com/skithao/DailyQuery`，项目结构检查及重构工作符合工程规范。