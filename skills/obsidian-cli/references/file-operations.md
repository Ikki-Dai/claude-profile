# File Operations - 文件操作参考

## 命令列表

### obsidian create
创建新笔记。

```bash
# 基本创建
obsidian create name="新笔记标题"

# 创建并添加内容
obsidian create name="会议记录" content="# 会议主题\n\n日期：2024-01-15"

# 静默创建（不打开文件）
obsidian create name="草稿" content="..." silent

# 在指定文件夹中创建
obsidian create name="Projects/项目计划" content="..."

# 从剪贴板创建
obsidian create name="剪贴板笔记" content="{{clipboard}}"
```

### obsidian read
读取笔记内容。

```bash
# 读取当前活动文件
obsidian read

# 读取指定文件（使用 wikilink）
obsidian read file=我的笔记

# 读取指定文件（使用精确路径）
obsidian read path=文件夹/笔记名称

# 复制到剪贴板
obsidian read file=重要笔记 --copy

# JSON 格式输出
obsidian read file=数据笔记 format=json
```

### obsidian open
打开笔记文件。

```bash
# 打开指定文件
obsidian open file=笔记名称

# 在新标签页打开
obsidian open file=笔记名称 newtab

# 打开并滚动到指定行
obsidian open file=笔记名 line=50
```

### obsidian append
追加内容到当前文件。

```bash
# 追加文本
obsidian append content="\n\n## 补充信息\n新内容..."

# 追加任务列表
obsidian append content="\n- [ ] 待办事项"
```

### obsidian prepend
在文件开头添加内容。

```bash
# 在开头添加标题
obsidian prepend content "# 更新的标题\n\n"

# 添加元数据
obsidian prepend content "---\ntags: [important]\n---\n\n"
```

### obsidian move
移动或重命名文件。

```bash
# 移动到文件夹
obsidian move to="Archive/旧笔记"

# 重命名
obsidian move to="新笔记名称"

# 移动并重命名
obsidian move to="Projects/新项目名称"
```

### obsidian delete
删除当前文件（移至回收站）。

```bash
obsidian delete

# 静默删除（不显示确认）
obsidian delete silent
```

## 文件路径说明

### Wikilink 解析 (`file=`)
使用 Obsidian 的 wikilink 语法，会自动解析：
- 不区分大小写
- 忽略特殊字符
- 自动处理文件夹路径

```bash
# 这些都会找到 "Projects/Project Plan.md"
obsidian read file=Project Plan
obsidian read file=project-plan
obsidian read file=projects/project plan
```

### 精确路径 (`path=`)
使用文件系统精确路径，必须完全匹配：
- 区分大小写
- 需要完整文件名（包括扩展名）
- 需要完整文件夹路径

```bash
# 必须精确匹配
obsidian read path="Projects/Project Plan.md"
```

## 常用标志

| 标志 | 描述 | 示例 |
|------|------|------|
| `silent` | 静默执行，不打开文件 | `obsidian create name="x" silent` |
| `newtab` | 在新标签页打开 | `obsidian open file="x" newtab` |
| `overwrite` | 覆盖现有内容 | `obsidian create name="x" content="y" overwrite` |
| `--copy` | 复制到剪贴板 | `obsidian read file="x" --copy` |
| `line=N` | 滚动到指定行 | `obsidian open file="x" line=50` |

## 内容变量

在 `content` 参数中可用的变量：
- `{{date}}` - 当前日期
- `{{time}}` - 当前时间
- `{{datetime}}` - 日期时间
- `{{clipboard}}` - 剪贴板内容
- `{{uuid}}` - 随机 UUID

## 多行内容处理

```bash
# 使用 \n 表示换行
obsidian create name="多行笔记" content="标题\n\n第一段\n\n第二段"

# 使用 \t 表示制表符
obsidian append content="\n| 列1 | 列2 |\n|-----|-----|\n| 数据1 | 数据2 |"
```
