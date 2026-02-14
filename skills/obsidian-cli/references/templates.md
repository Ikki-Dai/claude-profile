# Templates - 模板系统参考

## 命令列表

### obsidian templates
列出所有可用的模板。

```bash
obsidian templates

# 输出示例：
# Templates/
#   - 日常日记.md
#   - 会议记录.md
#   - 项目计划.md
#   - 读书笔记.md
```

### obsidian create (从模板创建)
使用模板创建新笔记。

```bash
# 从模板创建
obsidian create name="新笔记" template="会议记录"

# 指定模板路径
obsidian create name="项目A" template="Templates/项目计划"

# 静默创建
obsidian create name="草稿" template="快速笔记" silent
```

### obsidian template:read
读取模板内容。

```bash
# 读取原始模板
obsidian template:read name="会议记录"

# 读取并解析变量
obsidian template:read name="会议记录" resolve

# 复制到剪贴板
obsidian template:read name="会议记录" --copy
```

## 模板变量

在模板中可以使用以下变量：

### 日期时间变量
```markdown
{{date}}           # 当前日期，如 2024-01-15
{{time}}           # 当前时间，如 14:30
{{datetime}}        # 日期时间，如 2024-01-15 14:30:00
{{year}}            # 年份，如 2024
{{month}}           # 月份，如 01
{{day}}             # 日期，如 15
{{weekday}}         # 星期，如 Monday
```

### 笔记变量
```markdown
{{title}}           # 笔记标题
{{path}}            # 笔记路径
{{filename}}        # 文件名
```

### 系统变量
```markdown
{{uuid}}            # 随机 UUID
{{clipboard}}       # 剪贴板内容
```

## 模板示例

### 日常日记模板
```markdown
---
date: {{date}}
tags: [daily]
---

# {{date}} {{weekday}}

## 今日重点
-

## 日程记录

### 上午
-

### 下午
-

## 笔记

## 明日计划
-
```

### 会议记录模板
```markdown
---
date: {{date}}
tags: [meeting]
---

# 会议记录：{{title}}

**日期：** {{date}} {{time}}
**参会人员：**
-
**地点：**

## 议程
1.
2.
3.

## 讨论内容

### 议程一
- 讨论要点
- 结论

## 行动项
- [ ] [ ] 负责人 - 截止日期：{{date}}

## 下次会议
**时间：**
**议题：**
```

### 项目计划模板
```markdown
---
created: {{date}}
tags: [project]
status: planning
---

# {{title}}

## 项目概述

## 目标

## 里程碑
- [ ] 里程碑1
- [ ] 里程碑2
- [ ] 里程碑3

## 任务清单

### 第一阶段
- [ ] 任务1.1
- [ ] 任务1.2

### 第二阶段
- [ ] 任务2.1
- [ ] 任务2.2

## 资源

## 风险
-
```

### 读书笔记模板
```markdown
---
date: {{date}}
tags: [reading, book]
---

# {{title}}

**作者：**
**出版时间：**
**ISBN：**
**阅读时间：** {{date}} - {{date}}

## 内容简介

## 核心观点

## 精彩摘录

## 个人思考

## 行动启发
-
```

## 变量解析

### resolve 标志
使用 `resolve` 标志时，模板中的变量会被替换为实际值：

```bash
# 不解析（显示 {{date}} 等变量）
obsidian template:read name="日记"

# 解析变量（显示实际日期）
obsidian template:read name="日记" resolve
```

### 创建时自动解析
使用 `template` 创建笔记时，变量会自动解析：

```bash
# 创建时 {{date}} 会替换为当前日期
obsidian create name="今日日记" template="日常日记"
```

## 常用标志

| 标志 | 描述 | 示例 |
|------|------|------|
| `silent` | 静默创建 | `obsidian create name="x" template="y" silent` |
| `resolve` | 解析模板变量 | `obsidian template:read name="x" resolve` |
| `--copy` | 复制到剪贴板 | `obsidian template:read name="x" --copy` |

## 使用场景

### 快速创建会议记录
```bash
obsidian create name="产品评审会" template="会议记录"
```

### 创建每日日记
```bash
obsidian daily:prepend content="{{template:日常日记}}"
```

### 从剪贴板内容创建笔记
```bash
# 将剪贴板内容作为标题
obsidian create name="{{clipboard}}" template="快速笔记"
```

## 模板文件夹

默认情况下，Obsidian 在以下位置查找模板：
- `Templates/` 文件夹
- 通过 Templater 插件配置的文件夹
- 用户自定义的模板文件夹
