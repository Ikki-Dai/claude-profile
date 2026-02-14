# Search - 搜索功能参考

## 命令列表

### obsidian search
在笔记库中搜索内容。

```bash
# 基本搜索
obsidian search query="关键词"

# 搜索短语
obsidian search query="多词搜索短语"

# 搜索多个关键词（空格分隔 = AND）
obsidian search query="项目 待办"

# 使用布尔运算符
obsidian search query="项目 OR 任务"
obsidian search query="重要 NOT 私人"
```

### obsidian search (JSON 格式)
以 JSON 格式返回搜索结果。

```bash
obsidian search query="关键词" format=json

# 输出示例：
# {
#   "results": [
#     {
#       "file": "笔记名称",
#       "path": "文件夹/笔记.md",
#       "matches": ["匹配内容..."],
#       "score": 1.5
#     }
#   ],
#   "total": 42
# }
```

### obsidian search (计数)
仅返回匹配数量。

```bash
obsidian search query="关键词" total

# 输出：42
```

## 搜索语法

### 基本运算符
```bash
# AND（空格）
query="A B"

# OR
query="A OR B"

# NOT
query="A NOT B"
```

### 特殊搜索

#### 搜索标签
```bash
obsidian search query="tag:#重要"
obsidian search query="tag:#工作 AND tag:#紧急"
```

#### 搜索路径
```bash
obsidian search query="path:Projects/"
obsidian search query="path:日记/ AND 会议"
```

#### 搜索文件名
```bash
obsidian search query="file:会议记录"
```

#### 搜索属性
```bash
obsidian search query="status:进行中"
obsidian search query="priority:高"
```

### 通配符
```bash
# * 匹配任意字符
query="proj*"

# ? 匹配单个字符
query="note?"
```

### 短语搜索
```bash
# 精确短语匹配
query="\"完整短语\""
```

## 输出格式

### 默认格式
```bash
obsidian search query="项目"
# 匹配的项目笔记（3 个匹配）
# - Projects/项目 A.md
# - Projects/项目 B.md
# - Archive/旧项目.md
```

### JSON 格式
```bash
obsidian search query="项目" format=json
# {
#   "results": [...],
#   "total": 3,
#   "query": "项目"
# }
```

### 计数格式
```bash
obsidian search query="项目" total
# 3
```

## 常用标志

| 标志 | 描述 | 示例 |
|------|------|------|
| `format=json` | JSON 格式输出 | `obsidian search query="x" format=json` |
| `total` | 仅返回计数 | `obsidian search query="x" total` |
| `--copy` | 复制结果到剪贴板 | `obsidian search query="x" --copy` |

## 使用场景

### 统计笔记数量
```bash
# 统计所有项目相关笔记
obsidian search query="path:Projects/" total
```

### 查找待办任务
```bash
# 查找所有未完成任务
obsidian search query="- [ ]"
```

### 查找特定日期的内容
```bash
# 搜索特定日期
obsidian search query="2024-01-15"
```

### 组合搜索
```bash
# 工作相关且标记为重要的笔记
obsidian search query="tag:#工作 AND tag:#重要"

# 标题包含"会议"且在项目文件夹
obsidian search query="file:会议 AND path:Projects/"
```
