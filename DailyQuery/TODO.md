# DailyQuery TODO 记录系统

## 规划与里程碑 (Milestones)
- [x] **v0.1.0** - 核心架构搭建 (Next.js + Tauri + Rust + SQLite)
- [ ] **v0.2.0** - Markdown 解析与基础查询界面
- [ ] **v0.3.0** - 全文检索集成与高级过滤

## 当前任务 (Current Tasks)

### 高优先级 (High Priority)
- [x] 前端界面: 搭建 Next.js App Router 的基础布局
- [x] 后端逻辑: 实现 Rust 与 Tauri 通信的 `invoke` 命令 (CRUD 操作)
- [x] 数据库: 设计 `queries` 表和 Markdown 文件的同步机制
- [x] **Task 2**: 实现AI爬虫(抓取RSS与新闻)，内容分类与标签提取，知识库存储与检索API，WebSearch整合，以及编写单元测试。

### 中优先级 (Medium Priority)
- [ ] 集成 Tailwind CSS 主题和深色模式
- [ ] 配置文件系统监控 (Watch) 自动更新 Markdown 更改
- [ ] CI/CD 自动发布配置校验

### 低优先级 (Low Priority)
- [ ] 增加单元测试 (Rust) 和端到端测试 (Playwright)
- [ ] 编写使用文档和架构说明

## 已完成 (Completed)
- [x] 初始化 Next.js App Router 模板项目
- [x] 集成 Tauri v2 构建脚本
- [x] 初始化 Rust 后端并配置 `sqlx` 连接本地 SQLite 数据库
- [x] 自动创建 `data/sql` 和 `data/markdown` 存储目录
- [x] 配置 GitHub Actions CI/CD 文件
