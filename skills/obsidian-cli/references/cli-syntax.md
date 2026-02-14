# CLI Syntax - 命令行语法完整参考

## 命令结构

### 基本格式
```bash
obsidian <命令> <子命令> [参数=值] [标志]
```

### 完整格式
```bash
obsidian [vault=笔记库] <命令> [子命令] [参数=值] [标志]
```

## 参数类型

### 命名值参数
格式：`参数名=值`

```bash
# 字符串值
obsidian create name="笔记标题"

# 带空格的值需要引号
obsidian search query="多词搜索短语"

# 特殊字符需要转义或引号
obsidian create name="笔记：标题"
```

### 布尔标志
格式：`标志名`（无值）

```bash
# 启用标志
obsidian create name="笔记" silent

# 多个标志
obsidian read file="笔记" --copy verbose
```

### 数组参数
格式：`参数=值1,值2,值3`

```bash
# 多个标签
obsidian property:set name="tags" value="tag1,tag2,tag3"

# 多个值
obsidian command items="item1,item2,item3"
```

## 引号规则

### 双引号
```bash
# 推荐用于包含空格的值
obsidian create name="我的笔记标题"

# 嵌套引号
obsidian search query="author:\"张三\""
```

### 单引号
```bash
# 某些系统支持单引号
obsidian create name='My Note Title'
```

### 转义字符
```bash
# 转义引号
obsidian search query="作者说：\"你好\""

# 转义特殊字符
obsidian create name="笔记\\标题"
```

## 多行内容

### 换行符
```bash
# 使用 \n 表示换行
obsidian create name="多行笔记" content="标题\n\n第一段\n\n第二段"

# 使用 \t 表示制表符
obsidian append content="列1\t列2\t列3"
```

### 多行参数（如果支持）
```bash
# 某些命令支持多行参数
obsidian create name="笔记" content="
第一行
第二行
第三行
"
```

## 特殊字符

### 路径分隔符
```bash
# Unix/Linux/macOS
obsidian read file="Projects/笔记"

# Windows
obsidian read file="Projects\\笔记"
# 或使用正斜杠（跨平台）
obsidian read file="Projects/笔记"
```

### 通配符
```bash
# * 匹配任意字符
obsidian files filter="proj*"

# ? 匹配单个字符
obsidian files filter="note?"
```

## 变量语法

### 内置变量
```bash
{{date}}        # 当前日期
{{time}}        # 当前时间
{{datetime}}    # 日期时间
{{uuid}}        # 随机 UUID
{{clipboard}}   # 剪贴板内容
{{title}}       # 笔记标题
```

### 环境变量
```bash
# 使用 $ 引用环境变量
obsidian create name="$USER-notes"

# Windows 语法
obsidian create name="%USERNAME%-notes"
```

## 命令链

### 顺序执行
```bash
# 使用 && 或 ;
obsidian create name="笔记1" && obsidian create name="笔记2"

# 或使用分号
obsidian create name="笔记1"; obsidian create name="笔记2"
```

### 管道
```bash
# 将输出传递给下一个命令
obsidian files | grep "项目"

# 保存到文件
obsidian search query="关键词" > results.txt
```

## 命令优先级

### 参数顺序
```bash
# vault 通常是第一个参数
obsidian vault=我的笔记库 search query="关键词"

# 命令和子命令
obsidian daily append content="文本"  # 错误
obsidian daily:append content="文本"  # 正确
```

### 标志位置
```bash
# 标志可以在任意位置
obsidian create name="笔记" silent
obsidian silent create name="笔记"  # 某些系统支持
```

## 注释

### 命令行注释
```bash
# 使用 # 添加注释（bash）
obsidian create name="笔记"  # 这是注释

# Windows REM 语法
obsidian create name="笔记"  REM 这是注释
```

## 转义和引号组合

### 复杂引号
```bash
# 引号中的引号
obsidian search query="name=\"John Doe\""

# 转义引号
obsidian search query='name="John Doe"'
```

### 特殊字符转义
```bash
# 转义空格
obsidian create name=笔记\标题

# 转义等号
obsidian create name="note" content="key=value"
```

## 错误处理

### 参数错误
```bash
# 缺少必需参数会报错
obsidian create
# Error: Missing required parameter: name

# 无效参数值
obsidian search query=""

# 参数类型错误
obsidian create name="笔记" line="abc"
```

### 文件路径错误
```bash
# 文件不存在
obsidian read file="不存在的笔记"

# 路径访问错误
obsidian read file="../外部笔记"
```

## 跨平台注意事项

### Windows
```bash
# 使用反斜杠或正斜杠
obsidian read file="Projects\\Notes"
obsidian read file="Projects/Notes"

# 使用 %VAR% 环境变量
obsidian create name="%USERNAME%-notes"

# PowerShell 中使用引号
obsidian search 'query="带空格的查询"'
```

### Unix/Linux/macOS
```bash
# 使用正斜杠
obsidian read file="Projects/Notes"

# 使用 $VAR 环境变量
obsidian create name="$USER-notes"

# 单引号保护特殊字符
obsidian search 'query="special chars"'
```

## 最佳实践

### 使用引号
```bash
# 总是为值使用引号（即使没有空格）
obsidian create name="note"

# 避免意外解析问题
obsidian search query="tag:#work"
```

### 验证命令
```bash
# 使用 --dry-run（如果支持）
obsidian delete --dry-run

# 先读取再修改
obsidian read file="笔记"
obsidian append content="内容"
```

### 错误检查
```bash
# 检查退出状态
obsidian search query="关键词" && echo "成功"

# 处理错误
obsidian search query="关键词" || echo "失败"
```
