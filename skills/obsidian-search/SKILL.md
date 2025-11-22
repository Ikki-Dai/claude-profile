---
name: obsidian-search
title: Obsidian 知识库搜索
description: 搜索本地 Obsidian 知识库中的笔记和内容，支持智能分类和结果分析
version: "1.0.0"
author: Claude Code
license: MIT
tags: [obsidian, search, knowledge-base, local-search, notes]
dependencies: []
resources:
  - scripts/obsidian-client.js
  - scripts/search-processor.js
usage: |
  搜索 Obsidian 知识库中的笔记和内容

  基本用法:
  ```
  /obsidian-search "JavaScript 异步编程"
  /obsidian-search "项目开发记录"
  ```

  功能特性:
  - 🔍 全文搜索笔记内容
  - 📊 智能结果分类
  - 📈 搜索结果分析
  - ⚡ 快速响应搜索

  注意事项:
  - 需要运行 Obsidian 并启用 Local REST API 插件
  - API 服务需在 27123 端口运行
  - 确保 API token 配置正确
---

# Obsidian 知识库搜索技能

这个技能允许你快速搜索本地 Obsidian 知识库中的笔记和内容，提供智能分类和结果分析。

## 功能特性

### 🔍 智能搜索
- **全文搜索**: 搜索笔记标题、内容和路径
- **智能匹配**: 支持模糊搜索和相关性评分
- **实时响应**: 快速返回搜索结果
- **上下文提取**: 显示匹配内容的上下文片段

### 📊 结果分析
- **自动分类**: 将搜索结果按类别分组（技术文档、学习笔记、项目记录等）
- **文件分析**: 分析文件类型分布和文件夹结构
- **关键词提取**: 识别高频关键词
- **时间分析**: 显示笔记的时间范围

## 使用方法

### 基本搜索

```
/obsidian-search "搜索关键词"
```

### 搜索示例

```
/obsidian-search "JavaScript 异步编程"
/obsidian-search "React 组件开发"
/obsidian-search "机器学习算法"
/obsidian-search "项目架构设计"
/obsidian-search "读书笔记"
```

### 首次使用配置

如果是首次使用或需要更新 API token，技能会提示你提供 Obsidian Local REST API 的 token。你可以在 Obsidian 设置中找到这个 token：

1. 打开 Obsidian
2. 进入 **设置 → 第三方插件 → Local REST API**
3. 复制显示的 **API Key**
4. 当提示时，粘贴该 token

## 安装和配置

### 前提条件

1. **安装 Obsidian**: 确保已安装 Obsidian 应用
2. **启用插件**: 在 Obsidian 中启用 "Local REST API" 插件
3. **配置端口**: 确保 API 服务运行在 27123 端口

### 插件配置

在 Obsidian 设置中：

1. 进入 **设置 → 第三方插件 → Community plugins**
2. 搜索并安装 **Local REST API** 插件
3. 启用插件并进行以下配置：
   - **端口**: 27123
   - **认证**: 启用并设置 API token
   - **权限**: 允许搜索、读取和导出操作

### API Token 配置

技能中已预配置 API token，如需修改请编辑：
- `scripts/obsidian-client.js` 中的 token 配置

## 技术实现

### 核心组件

1. **ObsidianClient**: API 客户端，负责与 Obsidian API 通信
2. **SearchProcessor**: 搜索结果处理器，提供分类和分析功能
3. **ResultFormatter**: 结果格式化器，生成各种格式的输出

### API 集成

技能通过 HTTP 请求与 Obsidian Local REST API 集成：

```javascript
// 搜索 API
GET http://localhost:27123/search?query={query}&max-results={limit}

// 获取笔记列表 API
GET http://localhost:27123/notes?max-results={limit}

// 获取笔记内容 API
GET http://localhost:27123/notes/{noteId}
```

### 智能分类

使用关键词匹配算法自动分类搜索结果：

- **技术文档**: 编程、代码、API、函数等技术相关
- **学习笔记**: 学习、教程、课程、总结等教育内容
- **项目记录**: 项目、开发、实现等功能相关
- **问题解决**: 问题、错误、调试等解决方案
- **思考感悟**: 思考、心得、反思等个人感悟

## 最佳实践

### 搜索技巧

1. **使用具体关键词**: 避免过于宽泛的搜索词
2. **组合关键词**: 使用多个相关词汇提高精确度
3. **包含上下文**: 添加相关的技术或项目名称
4. **尝试同义词**: 如果没有结果，尝试使用同义词

### 结果解读

1. **相关性评分**: 百分比表示匹配程度
2. **上下文片段**: 显示匹配内容的具体位置
3. **文件路径**: 了解笔记的存储位置
4. **分类信息**: 快速定位相关类型的内容

### 使用建议

1. **定期整理**: 定期搜索和整理知识库内容
2. **关键词优化**: 尝试不同的关键词组合提高搜索精度
3. **分类利用**: 利用自动分类功能快速定位相关内容

## 故障排除

### 常见问题

1. **连接失败**
   - 检查 Obsidian 是否正在运行
   - 确认 Local REST API 插件已启用
   - 验证端口配置是否为 27123

2. **搜索无结果**
   - 检查搜索关键词是否过于具体
   - 尝试使用更广泛的关键词
   - 确认知识库中存在相关内容

3. **API Token 问题**
   - 检查 API token 是否正确配置
   - 重新生成新的 API token
   - 确认插件权限设置正确

### 调试方法

1. **连接测试**:
   ```bash
   node scripts/obsidian-client.js --check
   ```

2. **详细日志**: 在脚本中启用详细日志输出
3. **API 测试**: 直接使用 curl 测试 API 端点

## 扩展功能

### 自定义分类

可以通过修改 `scripts/search-processor.js` 中的分类规则来自定义结果分类：

```javascript
this.categories = {
    '自定义类别': ['关键词1', '关键词2', '关键词3'],
    // 添加更多自定义类别
};
```

### 结果过滤

实现基于文件路径、标签或创建时间的过滤功能：

```javascript
// 按文件夹过滤
filteredResults = results.filter(result =>
    result.path.includes('技术文档/')
);
```

### 集成其他服务

扩展技能以集成其他知识管理工具或外部服务：

- Notion 集成
- Confluence 连接
- GitHub 知识库同步

## 更新日志

### v1.0.0
- 初始版本发布
- 基本搜索功能
- 智能结果分类
- 搜索结果分析
- API token 管理

## 许可证

MIT License - 详见 LICENSE 文件

## 贡献

欢迎提交问题报告和功能请求。可以通过以下方式贡献：

1. 报告 Bug 或建议功能
2. 提交代码改进
3. 完善文档和使用指南
4. 分享使用经验和最佳实践

---

💡 **提示**: 首次使用前，请确保正确配置 Obsidian 的 Local REST API 插件，并测试连接是否正常。