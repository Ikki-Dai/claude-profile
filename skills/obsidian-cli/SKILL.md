---
name: obsidian-cli
description: Interact with Obsidian through the command line interface for note-taking, task management, vault operations, and automation.
license: Complete terms in LICENSE.txt
---

# Obsidian CLI

Obsidian CLI 是一个功能强大的命令行界面，允许从终端完全控制 Obsidian，适用于脚本编写、自动化和与外部工具集成。

## 目的

通过命令行接口实现高效的 Obsidian 笔记管理、任务处理、笔记库操作和自动化工作流。

## 使用场景

- 创建、读取、编辑笔记文件
- 管理日常日记（Daily Notes）
- 搜索和查询笔记库内容
- 任务管理和状态切换
- 模板应用和变量处理
- 属性（Properties）管理
- 标签查询和统计
- 笔记库和文件管理
- 插件开发调试
- 自动化脚本集成

## 重要前提

1. **Obsidian 必须运行** - CLI 命令需要 Obsidian 应用正在运行才能工作
2. **工作目录** - 如果终端在笔记库文件夹中，将默认使用该笔记库
3. **默认文件** - 许多命令如果未指定文件，将使用当前活动文件
4. **TUI 模式** - 单独执行 `obsidian` 命令可进入终端 UI，支持自动补全和历史记录

## 命令分类

### 日记操作 (Daily Notes)

使用 `obsidian daily` 系列命令管理日常日记：

| 命令 | 描述 |
|------|------|
| `obsidian daily` | 打开今天的日记 |
| `obsidian daily:append content="text"` | 追加内容到日记 |
| `obsidian daily:prepend content="text"` | 在日记开头添加内容 |
| `obsidian daily:read` | 读取日记内容 |

**详细参考**: `references/daily-notes.md`

### 文件操作 (File Operations)

笔记文件的创建、读取、编辑和管理：

| 命令 | 描述 |
|------|------|
| `obsidian create name="标题" content="内容"` | 创建新笔记 |
| `obsidian read` | 读取当前活动文件 |
| `obsidian read file=笔记名` | 读取指定文件 |
| `obsidian open file=笔记名` | 打开指定文件 |
| `obsidian append content="text"` | 追加到当前文件 |
| `obsidian prepend content="text"` | 在当前文件开头添加 |
| `obsidian move to="路径"` | 移动/重命名文件 |
| `obsidian delete` | 删除当前文件（移至回收站） |

**详细参考**: `references/file-operations.md`

### 搜索 (Search)

在笔记库中搜索内容：

| 命令 | 描述 |
|------|------|
| `obsidian search query="关键词"` | 搜索笔记库 |
| `obsidian search query="关键词" format=json` | JSON 格式搜索结果 |
| `obsidian search query="关键词" total` | 返回匹配数量 |

**详细参考**: `references/search.md`

### 任务管理 (Tasks)

管理笔记中的任务项：

| 命令 | 描述 |
|------|------|
| `obsidian tasks` | 列出所有任务 |
| `obsidian tasks daily` | 列出日记中的任务 |
| `obsidian tasks todo` | 列出未完成任务 |
| `obsidian tasks done` | 列出已完成任务 |
| `obsidian task file=笔记 line=8 toggle` | 切换任务状态 |
| `obsidian task file=笔记 line=8 done` | 标记任务为完成 |

**详细参考**: `references/tasks.md`

### 模板 (Templates)

使用模板创建笔记：

| 命令 | 描述 |
|------|------|
| `obsidian templates` | 列出可用模板 |
| `obsidian create name="笔记" template=模板名` | 从模板创建笔记 |
| `obsidian template:read name=模板 resolve` | 读取模板（解析变量） |

**详细参考**: `references/templates.md`

### 属性 (Properties)

管理笔记属性（YAML frontmatter）：

| 命令 | 描述 |
|------|------|
| `obsidian properties` | 列出当前文件的属性 |
| `obsidian property:set name="key" value="val"` | 设置属性值 |
| `obsidian property:remove name="key"` | 删除属性 |

**详细参考**: `references/properties.md`

### 标签 (Tags)

查询和统计标签：

| 命令 | 描述 |
|------|------|
| `obsidian tags all counts` | 列出所有标签及计数 |
| `obsidian tag name="#标签" verbose` | 获取标签详细信息 |

**详细参考**: `references/tags.md`

### 笔记库管理 (Vault Management)

管理笔记库、文件和文件夹：

| 命令 | 描述 |
|------|------|
| `obsidian files` | 列出所有文件 |
| `obsidian folders` | 列出所有文件夹 |
| `obsidian vault` | 显示当前笔记库信息 |
| `obsidian vaults` | 列出已知笔记库 |

**详细参考**: `references/vault-management.md`

## 参数语法

**详细参考**: `references/cli-syntax.md`

### 参数格式

- **带值的参数**: `parameter=value`（带空格的值需要引号）
- **标志参数**: 布尔开关，无需值（如 `silent`、`overwrite`、`total`）
- **目标笔记库**: `vault=<名称>` 作为第一个参数
- **目标文件**: `file=<名称>`（wikilink 解析）或 `path=<路径>`（精确路径）
- **多行内容**: 使用 `\n` 表示换行，`\t` 表示制表符

### 通用标志

| 标志 | 描述 |
|------|------|
| `silent` | 静默执行，不打开文件/UI |
| `newtab` | 在新标签页中打开 |
| `overwrite` | 覆盖现有内容 |
| `total` | 仅返回计数 |
| `verbose` | 包含额外详细信息 |
| `--copy` | 复制输出到剪贴板 |

## 使用示例

```bash
# 创建新笔记
obsidian create name="会议记录" content="# 会议\n\n日期: {{date}}"

# 添加任务到日记
obsidian daily:append content="- [ ] 跟进团队事项"

# 搜索并统计结果
obsidian search query="项目" total

# 获取所有标签计数
obsidian tags all counts

# 列出特定文件夹中的文件
obsidian files folder="项目"

# 从模板创建笔记
obsidian create name="巴黎之旅" template=旅行

# 显示文件的反向链接
obsidian backlinks file=食谱 counts

# 比较文件版本
obsidian diff file=README from=1 to=3
```

## 开发者命令

用于插件/主题开发和调试：

| 命令 | 描述 |
|------|------|
| `obsidian dev:open` | 打开开发者工具 |
| `obsidian dev:screenshot path=shot.png` | 截图 |
| `obsidian dev:eval code="app.vault.getFiles().length"` | 执行 JavaScript |
| `obsidian plugin:reload id=my-plugin` | 重新加载插件 |
| `obsidian dev:console` | 显示控制台消息 |
| `obsidian dev:errors` | 显示 JavaScript 错误 |

**详细参考**: `references/developer-tools.md`

## 平台注意事项

### Windows
Windows 用户需要使用 `Obsidian.com` 文件（Catalyst 专属功能）或 `obsidian.exe`

```bash
# 使用 Obsidian.com
Obsidian.com daily

# 使用 obsidian.exe
obsidian.exe daily
```

### macOS/Linux
```bash
obsidian daily
```
