# Daily Notes - 日记操作参考

## 命令列表

### obsidian daily
打开今天的日记。如果日记不存在，将根据 Obsidian 的日记设置创建新日记。

```bash
obsidian daily
```

### obsidian daily:append
追加内容到今天的日记末尾。

```bash
# 追加单行文本
obsidian daily:append content="- [ ] 新任务"

# 追加多行内容（使用 \n 换行）
obsidian daily:append content="## 下午会议\n\n- [ ] 准备演示\n- [ ] 发送邀请"
```

### obsidian daily:prepend
在今天的日记开头添加内容。

```bash
# 在开头添加内容
obsidian daily:prepend content="# 2024年1月15日\n\n"
```

### obsidian daily:read
读取今天的日记内容。

```bash
obsidian daily:read
```

## 使用场景

### 快速添加任务
```bash
obsidian daily:append content="- [ ] 给客户发邮件"
```

### 添加日记标题
```bash
obsidian daily:prepend content="# {{date}} - 工作日记\n\n"
```

### 记录快速笔记
```bash
obsidian daily:append content="## 快速记录\n\n想到一个点子：..."
```

### 添加时间戳记录
```bash
obsidian daily:append content "\n\n### {{time}}\n完成了项目里程碑 X"
```

## 可用变量

在 `content` 参数中可以使用以下变量：
- `{{date}}` - 当前日期
- `{{time}}` - 当前时间
- `{{datetime}}` - 日期时间组合

## 常用标志

| 标志 | 描述 | 示例 |
|------|------|------|
| `silent` | 不打开文件，静默执行 | `obsidian daily:append content="text" silent` |
| `--copy` | 将结果复制到剪贴板 | `obsidian daily:read --copy` |
