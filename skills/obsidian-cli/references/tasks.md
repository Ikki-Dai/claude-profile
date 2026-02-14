# Tasks - 任务管理参考

## 命令列表

### obsidian tasks
列出所有笔记中的任务。

```bash
# 列出所有任务
obsidian tasks

# 输出示例：
# Projects/项目A.md
#   - [ ] 待办任务 1
#   - [x] 已完成任务 2
#
# 日记/2024-01-15.md
#   - [ ] 今日计划
```

### obsidian tasks daily
仅列出日记中的任务。

```bash
obsidian tasks daily

# 输出示例：
# 日记/2024-01-15.md
#   - [ ] 早晨例会
#   - [x] 回复邮件
#   - [ ] 下午会议
```

### obsidian tasks todo
列出所有未完成的任务。

```bash
obsidian tasks todo

# 输出示例：
# Projects/项目A.md
#   - [ ] 未完成任务 1
#   - [ ] 未完成任务 2
```

### obsidian tasks done
列出所有已完成的任务。

```bash
obsidian tasks done

# 输出示例：
# 日记/2024-01-15.md
#   - [x] 已完成事项
```

### obsidian task (切换状态)
切换指定任务的状态（完成 ↔ 未完成）。

```bash
# 切换任务状态
obsidian task file="笔记名称" line=8 toggle

# 静默切换（不打开文件）
obsidian task file="笔记名称" line=8 toggle silent
```

### obsidian task (标记完成)
将任务标记为完成。

```bash
obsidian task file="笔记名称" line=8 done
```

### obsidian task (标记未完成)
将任务标记为未完成。

```bash
obsidian task file="笔记名称" line=8 todo
```

## 任务格式

Obsidian 支持以下任务格式：

```markdown
- [ ] 未完成任务
- [x] 已完成任务
- [/] 进行中任务
- [-] 已取消任务
```

## 定位任务

### 通过文件和行号
```bash
# 文件中的第 10 行
obsidian task file="我的笔记" line=10 toggle

# 使用 wikilink 格式
obsidian task file="Projects/项目计划" line=15 done
```

### 通过文件路径
```bash
# 使用精确路径
obsidian task path="文件夹/笔记.md" line=8 toggle
```

## 批量操作

### 完成所有日记任务
```bash
# 首先列出任务
obsidian tasks daily

# 然后逐个完成（脚本示例）
obsidian task file="日记/2024-01-15" line=5 done
obsidian task file="日记/2024-01-15" line=8 done
```

### 搜索并完成任务
```bash
# 搜索包含特定关键词的任务
obsidian search query="- [ ] AND 紧急"

# 然后根据结果切换任务状态
```

## 常用标志

| 标志 | 描述 | 示例 |
|------|------|------|
| `silent` | 静默执行，不打开文件 | `obsidian task file="x" line=8 toggle silent` |
| `--copy` | 复制结果到剪贴板 | `obsidian tasks todo --copy` |

## 使用场景

### 快速添加任务到日记
```bash
obsidian daily:append content="- [ ] 新任务项"
```

### 完成特定任务
```bash
# 首先找到任务所在行
obsidian read file="今日计划"

# 然后标记完成（假设在第 12 行）
obsidian task file="今日计划" line=12 done
```

### 查看今日待办
```bash
obsidian tasks daily
```

### 清理已完成任务
```bash
# 列出已完成任务
obsidian tasks done

# 手动整理或删除
```

## 任务工作流示例

```bash
# 1. 创建今日任务列表
obsidian create name="今日任务" content "# 今日任务\n\n- [ ] 事项1\n- [ ] 事项2\n- [ ] 事项3"

# 2. 完成第一个事项
obsidian task file="今日任务" line=3 done

# 3. 添加新任务
obsidian append content="- [ ] 紧急事项" file="今日任务"

# 4. 查看剩余任务
obsidian tasks todo
```
