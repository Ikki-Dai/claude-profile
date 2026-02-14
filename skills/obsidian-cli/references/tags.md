# Tags - 标签查询参考

## 命令列表

### obsidian tags all
列出笔记库中所有标签。

```bash
obsidian tags all

# 输出示例：
# #important (42)
# #work (15)
# #personal (8)
# #idea (23)
# #todo (31)
```

### obsidian tags all counts
列出所有标签及其使用计数。

```bash
obsidian tags all counts

# 输出示例：
# #important - 42 个笔记
# #work - 15 个笔记
# #personal - 8 个笔记
```

### obsidian tag
获取特定标签的详细信息。

```bash
# 基本查询
obsidian tag name="#important"

# 详细信息（包含文件列表）
obsidian tag name="#important" verbose

# 输出示例（verbose）：
# #important (42 个笔记)
#
# 文件列表：
# - Projects/项目A.md
# - 日记/2024-01-15.md
# - 资料/重要参考.md
# ...
```

## 标签语法

### 基本标签
```markdown
# 标签名称
```

### 嵌套标签
```markdown
#工作/项目A
#工作/项目A/任务1
```

### 多个标签
```markdown
#标签1 #标签2 #标签3
```

### 属性中的标签
```yaml
tags: [tag1, tag2, tag3]
```

## 标签命名约定

### 常用前缀
```markdown
#status/active
#status/completed
#status/archived

#priority/high
#priority/medium
#priority/low

#type/note
#type/task
#type/project

#area/work
#area/personal
#area/learning
```

### 主题标签
```markdown
#programming
#design
#marketing
#management
```

### 时间标签
```markdown
#2024
#2024/01
#2024/01/15
```

## 搜索标签

### 按标签搜索笔记
```bash
# 搜索包含特定标签的笔记
obsidian search query="tag:#important"

# 搜索多个标签（AND）
obsidian search query="tag:#work AND tag:#urgent"

# 搜索多个标签（OR）
obsidian search query="tag:#work OR tag:#personal"

# 排除标签
obsidian search query="tag:#work NOT tag:#archived"
```

### 按嵌套标签搜索
```bash
# 搜索所有子标签
obsidian search query="tag:#工作/"

# 搜索特定子标签
obsidian search query="tag:#工作/项目A"
```

### 组合搜索
```bash
# 工作相关且紧急
obsidian search query="tag:#work AND tag:#urgent"

# 本月创建的工作笔记
obsidian search query="tag:#work AND created:>2024-01-01"
```

## 标签统计

### 获取标签使用统计
```bash
# 所有标签及计数
obsidian tags all counts

# 复制统计到剪贴板
obsidian tags all counts --copy
```

### 导出标签报告
```bash
# 获取详细标签信息并保存
obsidian tags all counts > tag-report.txt
```

## 常用标志

| 标志 | 描述 | 示例 |
|------|------|------|
| `all` | 列出所有标签 | `obsidian tags all` |
| `counts` | 显示使用计数 | `obsidian tags all counts` |
| `verbose` | 显示详细信息 | `obsidian tag name="#x" verbose` |
| `--copy` | 复制到剪贴板 | `obsidian tags all --copy` |

## 使用场景

### 查看热门标签
```bash
# 按计数排序查看使用最多的标签
obsidian tags all counts
```

### 清理未使用标签
```bash
# 1. 列出所有标签
obsidian tags all

# 2. 搜索使用该标签的笔记
obsidian search query="tag:#old-tag"

# 3. 决定是否删除或替换标签
```

### 标签重组
```bash
# 查找需要重命名标签的笔记
obsidian search query="tag:#旧标签"

# 逐个更新笔记中的标签
```

### 按标签分类查看
```bash
# 查看所有工作相关笔记
obsidian search query="tag:#work"

# 查看特定项目笔记
obsidian search query="tag:#项目A"
```

## 标签管理工作流

### 添加标签到当前笔记
```bash
# 在属性中添加标签
obsidian property:set name="tags" value="important,work"

# 或直接在内容中添加
obsidian append content=" #important #work"
```

### 批量标签更新
```bash
# 查找所有需要添加标签的笔记
obsidian search query="项目 AND NOT tag:#work"

# 手动为每个笔记添加标签
```

### 标签重命名
```bash
# 1. 查找使用旧标签的笔记
obsidian tag name="#旧标签" verbose

# 2. 在每个笔记中替换标签
# （需要手动编辑或使用搜索替换）
```

## 标签最佳实践

### 1. 使用一致的命名
- 使用小写
- 使用连字符分隔单词：`#project-status`
- 避免特殊字符

### 2. 合理使用层级
```markdown
# 差（过于扁平）
#project-a-task-1-status-done

# 好（清晰层级）
#project-a/task-1
#status/done
```

### 3. 标签与属性配合
```markdown
---
tags: [work, urgent]
priority: high
due-date: 2024-01-20
---
```

### 4. 定期整理
```bash
# 定期检查标签使用情况
obsidian tags all counts

# 清理低频或冗余标签
```
