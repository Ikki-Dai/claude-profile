# ikki Claude Skills 技能库

这是一个个人的 Claude Skills 技能库，包含数据库操作、开发工具和生产力增强功能。

## 技能列表

### 📊 usql-database

**类别**: 开发 (Development)

**描述**: 通用 SQL 数据库接口，使用 usql 命令行工具提供跨多种数据库系统的统一数据库访问、查询和管理功能，支持 PostgreSQL、MySQL、Oracle、SQLite、SQL Server 等 20+ 种数据库的中文界面。

**主要功能**:
- 支持多种数据库系统的统一接口
- 完整的中文文档和示例
- 数据库连接和查询管理
- SQL 脚本执行和批处理
- 数据导入导出（CSV、JSON、HTML 等格式）
- 事务处理和错误处理
- 安全连接和凭据管理

**支持的数据库**:
- PostgreSQL, MySQL/MariaDB
- Oracle Database, Microsoft SQL Server
- SQLite, ClickHouse, Cassandra
- CockroachDB, TimescaleDB, Spanner
- BigQuery, Snowflake, Trino 等

**使用示例**:
```bash
# 连接数据库
usql pg://用户:密码@localhost/数据库

# 执行查询
usql sqlite://./数据库.db -c "SELECT * FROM 表名"

# 导出数据
usql pg://用户:密码@localhost/数据库 -c "SELECT * FROM 表名" -o 输出.csv --csv
```

### 🔍 maven-gav-search

**类别**: 开发 (Development)

**描述**: 使用阿里云 Maven 仓库 API 搜索 Maven 构件的 GAV（GroupId, ArtifactId, Version），提供智能版本排序功能，用于 Java 开发和依赖管理。

**主要功能**:
- 按 GroupId 和 ArtifactId 检索所有版本
- 智能版本排序（正确处理语义版本号）
- 支持通配符搜索
- 提供详细的版本信息
- 可选择按最新版本或最早版本排序

**使用场景**:
- 查找最新的依赖版本
- 解决版本冲突问题
- 分析组件的版本历史
- 依赖管理和构建优化

### ⚙️ nacos-config

**类别**: 开发 (Development)

**描述**: 查询 Nacos 配置中心的配置项，支持获取、列表和搜索功能，用于微服务和 Spring Cloud 应用的配置管理。

**主要功能**:
- 获取指定配置文件内容
- 列出特定命名空间下的所有配置
- 搜索配置项
- 支持多环境配置管理
- 配置版本和历史记录

**使用场景**:
- 微服务配置查询和管理
- Spring Cloud 应用配置
- 多环境配置同步
- 配置中心监控和调试

### 📝 obsidian-search

**类别**: 生产力组织 (Productivity Organization)

**描述**: 搜索本地 Obsidian 知识库中的笔记和内容，支持智能分类和结果分析，用于个人知识管理和文档检索。

**主要功能**:
- 全文搜索 Obsidian 笔记
- 智能内容分类和标签
- 搜索结果分析和排序
- 支持 markdown 格式
- 笔记链接关系分析

**使用场景**:
- 个人知识库检索
- 项目文档搜索
- 学习笔记查找
- 研究资料整理

### 📚 universal-docs-search

**类别**: 开发 (Development)

**描述**: 使用 Context7 API 的通用技术文档搜索，支持任何编程语言、框架、库或技术教程的跨整个技术生态系统的搜索。

**主要功能**:
- 跨技术栈文档搜索
- 支持所有主流编程语言
- 框架和库 API 文档查询
- 技术教程和指南检索
- 实时更新的技术资源

**支持的技术**:
- 编程语言: Java, Python, JavaScript, Go, Rust, C++, Ruby, PHP 等
- 框架: React, Spring, Django, Rails, Express, Flask, Angular, Vue.js 等
- 云服务: AWS, Azure, Google Cloud, 阿里云等
- 数据库: PostgreSQL, MySQL, MongoDB, Redis 等

**使用场景**:
- API 文档查询
- 技术问题解决方案查找
- 学习新技术和框架
- 代码示例和最佳实践搜索

## 安装和使用

### 前置要求
1. **usql-database**: 需要安装 usql 命令行工具
   ```bash
   # macOS
   brew install usql

   # Windows
   choco install usql

   # Linux
   wget https://github.com/xo/usql/releases/latest/download/usql-...-amd64.tar.gz
   ```

2. **maven-gav-search**: 需要 Node.js 环境
3. **nacos-config**: 需要 Nacos 服务器
4. **obsidian-search**: 需要 Obsidian 知识库
5. **universal-docs-search**: 需要网络连接访问 Context7 API

### 使用方法
1. 参考 `./.claude/skills/` 目录下对应技能的 `SKILL.md` 获取完整使用指南
2. 使用提供的示例和最佳实践
3. 根据技能类别选择合适的工具：

**开发工具** (Development):
- 📊 **usql-database**: 数据库操作和管理
- 🔍 **maven-gav-search**: Maven 依赖管理
- ⚙️ **nacos-config**: 微服务配置管理
- 📚 **universal-docs-search**: 技术文档搜索

**生产力工具** (Productivity Organization):
- 📝 **obsidian-search**: 个人知识库搜索

## 技能目录结构

所有技能文件都位于 `./.claude/skills/` 目录下，每个技能包含：
- `SKILL.md` - 技能文档和使用指南
- `scripts/` - 辅助脚本和工具
- `references/` - 参考文档和示例（可选）

## Marketplace 配置

技能库配置文件位于 `./.claude-plugins/marketplace.json`，包含：
- 所有技能的索引信息
- 技能分类和描述
- 安装和使用指南
- 依赖关系说明

## 贡献者

- **ikki** - 技能创建者和维护者

## 版本信息

- **版本**: 1.0.0
- **更新日期**: 2025-12-01
- **技能总数**: 5 个
- **支持类别**: 开发工具、生产力组织

## 技能统计

| 类别 | 技能数量 | 技能列表 |
|------|----------|----------|
| Development | 4 | usql-database, maven-gav-search, nacos-config, universal-docs-search |
| Productivity Organization | 1 | obsidian-search |

## 技术栈覆盖

- **数据库**: PostgreSQL, MySQL, Oracle, SQLite, SQL Server 等 20+ 种
- **编程语言**: Java, Python, JavaScript, Go, Rust, C++, Ruby, PHP 等
- **框架**: React, Spring, Django, Rails, Express, Flask, Angular, Vue.js 等
- **云平台**: AWS, Azure, Google Cloud, 阿里云等
- **构建工具**: Maven, Gradle, npm 等
- **配置管理**: Nacos, Spring Cloud Config 等