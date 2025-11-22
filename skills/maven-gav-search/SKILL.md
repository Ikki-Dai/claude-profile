---
name: maven-gav-search
description: Search Maven artifacts by GAV (GroupId, ArtifactId, Version) using Aliyun Maven repository API with intelligent version sorting
version: 2.0.0
author: Claude
license: MIT
dependencies: ["node"]
---

# Maven GAV 检索技能

这个技能帮助你通过阿里云 Maven 仓库 API 检索 Maven 构件的版本信息，并智能地解决版本排序问题。

## 功能特性

- 支持按 GroupId 和 ArtifactId 检索所有版本
- 智能版本排序（正确处理语义版本号）
- 支持通配符搜索
- 提供详细的版本信息
- 可选择按最新版本或最早版本排序

## 使用方法

### 基本搜索

```bash
# 搜索特定构件的所有版本
node maven-gav-search/scripts/maven-search.js org.springframework.boot spring-boot-starter-web

# 使用通配符搜索
node maven-gav-search/scripts/maven-search.js org.springframework.* spring-* --limit 50

# 搜索指定 groupId 下的所有构件
node maven-gav-search/scripts/maven-search.js org.springframework spring-core

# 按升序排列版本
node maven-gav-search/scripts/maven-search.js org.springframework spring-core --sort asc
```

### 输出格式

搜索结果包含：
- 构件基本信息（GroupId, ArtifactId）
- 版本列表（按语义版本正确排序）
- 最新版本和最早版本
- 发布时间信息

## 版本排序说明

本技能正确处理语义版本号排序，例如：
- `3.2.9` > `3.2.1` ✅
- `3.10.1` > `3.9.9` ✅
- `2.1.0.RELEASE` > `2.0.5.RELEASE` ✅

## API 端点

使用阿里云 Maven 仓库 API：
```
https://maven.aliyun.com/artifact/aliyunMaven/searchArtifactByGav
```

## 参数说明

- `groupId`: Maven GroupId（必需）
- `artifactId`: Maven ArtifactId（必需，支持 `*` 通配符）
- `version`: 版本号（可选，通常留空以获取所有版本）
- `repoId`: 仓库ID（默认 `all`）

## 错误处理

- 网络连接失败时提供重试建议
- API 限流时自动等待
- 无效的 GAV 坐标给出明确错误信息
- JSON 解析错误提供原始响应

## 使用示例

### 搜索 Spring Boot 相关组件

```bash
# 搜索 Spring Boot Web 启动器
node maven-gav-search/scripts/maven-search.js org.springframework.boot spring-boot-starter-web --limit 10

# 搜索所有 Spring Boot 启动器
node maven-gav-search/scripts/maven-search.js org.springframework.boot spring-boot-starter-* --limit 30
```

### 搜索框架核心库

```bash
# 搜索 Spring 框架核心
node maven-gav-search/scripts/maven-search.js org.springframework spring-core --limit 15

# 搜索所有 Spring 模块
node maven-gav-search/scripts/maven-search.js org.springframework spring-* --limit 50

# 查看详细信息
node maven-gav-search/scripts/maven-search.js org.springframework spring-core --verbose
```

## 最佳实践

1. **精确搜索**: 使用完整的 GroupId 和 ArtifactId 获取最准确的结果
2. **通配符使用**: 在不确定确切名称时使用 `*` 通配符
3. **版本过滤**: 结合版本号模式过滤特定版本的构件
4. **批量搜索**: 可以一次搜索多个相关构件

## 注意事项

- 阿里云 Maven 仓库 API 有访问频率限制
- 某些构件可能因为权限问题无法访问
- 版本号格式不标准可能影响排序结果
- 建议在网络良好的环境下使用