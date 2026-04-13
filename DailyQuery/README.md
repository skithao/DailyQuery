# DailyQuery

基于 Rust + Next.js + Tauri 的本地高并发查询和记录工具。

## 核心架构 (Architecture)
- **前端框架**: Next.js (App Router, React 18, Tailwind CSS, TypeScript)
- **后端架构**: Rust + Tauri 2.0 (原生桌面应用壳)
- **本地存储**: 
  - **SQL 数据库**: 采用 `sqlx` 和 SQLite (存放于 `data/sql`)
  - **文档存储**: 纯文本 Markdown 结构 (存放于 `data/markdown`)
- **错误监控与日志**: `tauri-plugin-log` 与 Rust `anyhow`
- **CI/CD**: GitHub Actions 自动编译多平台包

## 目录结构 (Directory Structure)
```
/workspace/DailyQuery
├── data/
│   ├── markdown/       # Markdown 存储目录
│   └── sql/            # SQLite 数据库存储目录
├── src/                # Next.js 页面与前端逻辑 (App Router)
├── src-tauri/          # Rust 后端与 Tauri 核心配置文件
│   ├── src/            # Rust 源码 (包含数据库初始化逻辑)
│   ├── tauri.conf.json # Tauri 配置
│   └── Cargo.toml      # Rust 依赖 (包含 sqlx, tokio 等)
├── .github/workflows/  # CI/CD 自动构建脚本
└── TODO.md             # TODO 任务跟踪记录系统
```

## 本地开发指南 (Development)
### 环境准备
1. 安装 Node.js v20+ 和 npm
2. 安装 Rust 稳定版 (`rustup`)
3. 配置系统级 Tauri 开发依赖: 
   - **Linux**: `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, `librsvg2-dev` 等
   - **macOS**: 默认 Xcode Command Line Tools
   - **Windows**: Visual Studio C++ Build Tools

### 运行方式
进入项目根目录:
```bash
# 1. 安装前端依赖
npm install

# 2. 启动 Tauri 开发环境 (自动启动 Next.js dev server 和 Rust 编译)
npm run tauri dev
```

### 构建打包
编译为原生应用 (导出至 `src-tauri/target/release/bundle`):
```bash
npm run tauri build
```

## TODO 追踪
项目进度与未来规划已记录在 [`TODO.md`](TODO.md) 中。
