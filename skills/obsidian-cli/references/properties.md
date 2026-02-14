# Properties - 属性管理参考

## 命令列表

### obsidian properties
列出当前笔记的所有属性。

```bash
# 列出当前文件的属性
obsidian properties

# 输出示例：
# ---
# title: 笔记标题
# tags: [important, work]
# status: in-progress
# created: 2024-01-15
# ---
```

### obsidian property:set
设置或更新属性值。

```bash
# 设置字符串属性
obsidian property:set name="category" value="work"

# 设置日期属性
obsidian property:set name="due-date" value="2024-01-20"

# 设置数组属性（使用逗号分隔）
obsidian property:set name="tags" value="important,urgent"

# 设置数字属性
obsidian property:set name="priority" value="1"

# 为指定文件设置属性
obsidian property:set file="项目笔记" name="status" value="done"
```

### obsidian property:remove
删除属性。

```bash
# 删除属性
obsidian property:remove name="old-property"

# 删除指定文件的属性
obsidian property:remove file="笔记名" name="status"
```

## 属性格式

### YAML Frontmatter
属性存储在笔记顶部的 YAML frontmatter 中：

```markdown
---
title: 笔记标题
tags: [important, work]
status: in-progress
created: 2024-01-15
priority: 1
due-date: 2024-01-20
---

# 笔记内容...
```

### 属性类型

#### 字符串
```yaml
title: 我的笔记
category: 工作
```

#### 数组
```yaml
tags: [important, work]
authors: [作者1, 作者2]
```

#### 数字
```yaml
priority: 1
rating: 5
```

#### 日期
```yaml
created: 2024-01-15
due-date: 2024-01-20
```

#### 布尔
```yaml
archived: true
pinned: false
```

## 常用属性

### 元数据
```yaml
title: 标题
description: 描述
author: 作者
created: 2024-01-15
modified: 2024-01-15
```

### 分类
```yaml
tags: [tag1, tag2]
category: 类别
type: 类型
```

### 状态
```yaml
status: planning|in-progress|done|cancelled
priority: 1|2|3|4|5
```

### 时间管理
```yaml
due-date: 2024-01-20
start-date: 2024-01-15
completed-date: 2024-01-18
```

### 项目管理
```yaml
project: 项目名称
milestone: 里程碑
assigned-to: 负责人
```

## 常用标志

| 标志 | 描述 | 示例 |
|------|------|------|
| `silent` | 静默执行 | `obsidian property:set name="x" value="y" silent` |
| `--copy` | 复制到剪贴板 | `obsidian properties --copy` |

## 使用场景

### 创建任务并设置属性
```bash
# 创建笔记并设置属性
obsidian create name="完成项目报告" content="# 任务：完成项目报告" silent
obsidian property:set name="status" value="todo"
obsidian property:set name="priority" value="high"
obsidian property:set name="due-date" value="2024-01-20"
```

### 标记笔记状态
```bash
# 标记为完成
obsidian property:set name="status" value="done"
obsidian property:set name="completed-date" value="2024-01-15"
```

### 批量添加标签
```bash
# 添加多个标签
obsidian property:set name="tags" value="work,important,urgent"
```

### 归档笔记
```bash
# 设置归档属性
obsidian property:set name="archived" value="true"
obsidian property:set name="archived-date" value="2024-01-15"
```

## 搜索属性

### 按属性搜索
```bash
# 搜索特定状态
obsidian search query="status:done"

# 搜索特定标签
obsidian search query="tags:important"

# 搜索日期范围
obsidian search query="due-date:<2024-01-20"
obsidian search query="created:>2024-01-01"
```

### 组合搜索
```bash
# 工作相关的紧急任务
obsidian search query="category:work AND priority:high"

# 本周到期
obsidian search query="due-date:>2024-01-15 due-date:<2024-01-22"
```

## 属性工作流示例

```bash
# 1. 创建新项目笔记
obsidian create name="新功能开发" content="# 新功能开发\n\n## 需求\n\n## 设计\n\n## 实现" silent

# 2. 设置项目属性
obsidian property:set name="type" value="project"
obsidian property:set name="status" value="planning"
obsidian property:set name="priority" value="2"
obsidian property:set name="created" value="2024-01-15"

# 3. 开始开发时更新状态
obsidian property:set name="status" value="in-progress"

# 4. 完成时标记
obsidian property:set name="status" value="done"
obsidian property:set name="completed-date" value="2024-01-18"
```

## 注意事项

1. **属性名区分大小写** - `Status` 和 `status` 是不同的属性
2. **数组值使用逗号** - `tags: [tag1, tag2]` 或 `value="tag1,tag2"`
3. **日期格式** - 建议使用 ISO 8601 格式 `YYYY-MM-DD`
4. **特殊字符** - 属性值包含特殊字符时使用引号
5. **属性唯一性** - 每个属性名在一个笔记中只能出现一次
