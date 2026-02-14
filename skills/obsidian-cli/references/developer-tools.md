# Developer Tools - 开发者工具参考

## 命令列表

### obsidian dev:open
打开 Obsidian 开发者工具（DevTools）。

```bash
obsidian dev:open
```

### obsidian dev:screenshot
对 Obsidian 窗口截图。

```bash
# 基本截图
obsidian dev:screenshot path=screenshot.png

# 指定截图区域
obsidian dev:screenshot path=window.png --region=window
obsidian dev:screenshot path=page.png --region=page

# 指定截图格式
obsidian dev:screenshot path=screenshot.jpg --format=jpeg
obsidian dev:screenshot path=screenshot.webp --format=webp

# 指定图片质量
obsidian dev:screenshot path=screenshot.jpg --quality=90
```

### obsidian dev:eval
在 Obsidian 上下文中执行 JavaScript 代码。

```bash
# 基本执行
obsidian dev:eval code="app.vault.getFiles().length"

# 执行多个语句
obsidian dev:eval code="const files = app.vault.getFiles(); console.log(files.length);"

# 访问 API
obsidian dev:eval code="app.workspace.activeLeaf"

# 获取插件信息
obsidian dev:eval code="app.plugins.enabledPlugins"
```

### obsidian plugin:reload
重新加载指定插件。

```bash
# 重新加载插件
obsidian plugin:reload id=my-plugin

# 重新加载核心插件
obsidian plugin:reload id=daily-notes
```

### obsidian dev:console
显示控制台消息。

```bash
# 显示控制台日志
obsidian dev:console

# 过滤特定类型
obsidian dev:console --filter=error
obsidian dev:console --filter=warn
obsidian dev:console --filter=log
```

### obsidian dev:errors
显示 JavaScript 错误。

```bash
# 显示所有错误
obsidian dev:errors

# 仅显示未解决的错误
obsidian dev:errors --unresolved-only
```

## 开发者 API 访问

### app 对象
```javascript
// 访问 Vault API
app.vault.getFiles()
app.vault.getFileByPath("path/to/file.md")
app.vault.read(file)

// 访问 Workspace API
app.workspace.activeLeaf
app.workspace.getLeaves()
app.workspace.openLinkText('[[note]]', sourcePath)

// 访问 Metadata Cache
app.metadataCache.getFileCache(file)
app.metadataCache.getTags()
```

### 常用开发命令

#### 获取文件列表
```bash
obsidian dev:eval code="app.vault.getFiles().map(f => f.path)"
```

#### 获取所有标签
```bash
obsidian dev:eval code="app.metadataCache.getTags()"
```

#### 获取活动文件
```bash
obsidian dev:eval code="app.workspace.getActiveFile()?.path"
```

#### 获取插件列表
```bash
obsidian dev:eval code="Array.from(app.plugins.enabledPlugins)"
```

## 插件开发

### 插件调试
```bash
# 1. 重新加载插件
obsidian plugin:reload id=my-plugin

# 2. 检查错误
obsidian dev:errors

# 3. 查看控制台
obsidian dev:console
```

### 插件信息
```bash
# 获取已安装插件
obsidian dev:eval code="app.plugins.plugins"

# 获取插件清单
obsidian dev:eval code="app.plugins.manifests"
```

### 热重载开发
```bash
# 开发循环
# 1. 修改插件代码
# 2. 重新加载插件
obsidian plugin:reload id=my-plugin
# 3. 测试功能
# 4. 重复
```

## 主题开发

### 主题信息
```bash
# 获取当前主题
obsidian dev:eval code="app.vault.config.theme"

# 获取已安装主题列表
obsidian dev:eval code="app.customCss.themes"
```

### CSS 测试
```bash
# 应用自定义 CSS
obsidian dev:eval code="app.customCss.setTheme('my-theme')"

# 刷新主题
obsidian dev:eval code="app.customCss.triggerStyleLoad()"
```

## 性能分析

### 性能测试
```bash
# 测试文件读取性能
obsidian dev:eval code="console.time('read'); app.vault.read(file); console.timeEnd('read')"

# 测试搜索性能
obsidian dev:eval code="console.time('search'); app.vault.read('search term'); console.timeEnd('search')"
```

### 内存使用
```bash
# 获取内存信息
obsidian dev:eval code="performance.memory"

# 强制垃圾回收
obsidian dev:eval code="if (global.gc) global.gc()"
```

## 常用标志

### 截图标志
| 标志 | 描述 | 示例 |
|------|------|------|
| `--region=window\|page\|full` | 截图区域 | `obsidian dev:screenshot path=x.png --region=page` |
| `--format=png\|jpeg\|webp` | 图片格式 | `obsidian dev:screenshot path=x.jpg --format=jpeg` |
| `--quality=N` | 图片质量 (0-100) | `obsidian dev:screenshot path=x.jpg --quality=90` |

### 控制台标志
| 标志 | 描述 | 示例 |
|------|------|------|
| `--filter=log\|warn\|error` | 过滤消息类型 | `obsidian dev:console --filter=error` |
| `--unresolved-only` | 仅显示未解决的错误 | `obsidian dev:errors --unresolved-only` |

## 使用场景

### 调试插件
```bash
# 1. 打开开发者工具
obsidian dev:open

# 2. 在插件中设置断点

# 3. 触发功能

# 4. 检查错误
obsidian dev:errors
```

### 测试 API 调用
```bash
# 测试文件读取
obsidian dev:eval code="app.vault.read(app.vault.getFileByPath('test.md'))"

# 测试文件创建
obsidian dev:eval code="app.vault.create('test.md', 'content')"
```

### 性能优化
```bash
# 1. 截图基准测试
obsidian dev:screenshot path=before.png

# 2. 执行优化

# 3. 截图对比
obsidian dev:screenshot path=after.png
```

### 自动化测试
```bash
# 运行测试脚本
obsidian dev:eval code="require('./test.js').run()"

# 验证结果
obsidian dev:console
```

## 调试技巧

### 日志输出
```javascript
// 在插件中添加日志
console.log('Debug info:', data);
console.warn('Warning:', message);
console.error('Error:', error);

// 使用断点
debugger;
```

### 错误捕获
```javascript
try {
    // 代码
} catch (error) {
    console.error('Error:', error);
    obsidianDev:errors
}
```

### 状态检查
```bash
# 检查应用状态
obsidian dev:eval code="{
    vault: app.vault.getName(),
    fileCount: app.vault.getFiles().length,
    activeFile: app.workspace.getActiveFile()?.path,
    plugins: Array.from(app.plugins.enabledPlugins)
}"
```

## 注意事项

1. **开发工具仅在桌面版可用** - 移动版不支持
2. **eval 可能有安全风险** - 仅在可信代码上使用
3. **插件重载可能丢失状态** - 保存重要状态后再重载
4. **截图保存路径** - 确保有写入权限
5. **性能测试差异** - 不同硬件和环境结果不同
