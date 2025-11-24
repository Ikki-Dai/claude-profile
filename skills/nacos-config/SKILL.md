---
name: nacos-config
title: Nacos 配置中心查询
description: 查询 Nacos 配置中心的配置项，支持获取、列表和搜索功能
version: "1.0.0"
author: Claude Code
license: MIT
tags: [nacos, configuration, microservices, spring-cloud, config-management]
dependencies: ["node"]
resources:
  - scripts/nacos-client.js
usage: |
  查询 Nacos 配置中心的配置项

  基本用法:
  ```
  node nacos-config/scripts/nacos-client.js http://localhost:8848 get application.properties
  node nacos-config/scripts/nacos-client.js http://localhost:8848 list dev
  node nacos-config/scripts/nacos-client.js http://localhost:8848 search "application*"
  ```

  功能特性:
  - 🔍 获取指定配置项内容
  - 📋 列出命名空间中的所有配置
  - 🎯 模糊搜索配置项
  - 🔐 支持多种认证方式
  - 📝 自动检测配置文件格式

  认证选项:
  - 用户名密码认证: --username nacos --password nacos
  - 访问令牌认证: --token your-access-token

  注意事项:
  - 确保 Nacos 服务器正在运行并可访问
  - 检查防火墙和网络连接设置
  - 生产环境建议使用 HTTPS
---

# Nacos 配置中心查询技能

这个技能允许你查询 Nacos 配置中心中的配置项，提供获取、列表和搜索功能。

## 功能特性

### 🔍 配置查询
- **精确获取**: 通过 dataId、group 和 namespace 获取指定配置
- **列表查询**: 列出指定命名空间中的所有配置项
- **模糊搜索**: 支持通配符模式搜索配置项
- **分页支持**: 列表和搜索支持分页浏览

### 🔐 认证支持
- **基础认证**: 支持用户名密码认证
- **令牌认证**: 支持 access token 认证
- **安全连接**: 支持 HTTPS 安全连接

### 📝 智能处理
- **格式检测**: 自动识别配置文件类型（properties、yml、json 等）
- **语法高亮**: JSON 配置自动格式化显示
- **内容分析**: 显示配置大小、MD5 等元信息

## 使用方法

### 基本命令

```bash
# 获取指定配置项
node scripts/nacos-client.js http://localhost:8848 get <dataId> [group] [namespace]

# 列出命名空间配置
node scripts/nacos-client.js http://localhost:8848 list [namespace] [pageNo] [pageSize]

# 搜索配置项
node scripts/nacos-client.js http://localhost:8848 search <pattern> [group] [namespace]

# 查看配置历史版本
node scripts/nacos-client.js http://localhost:8848 history <dataId> [group] [namespace]

# 发布配置项
node scripts/nacos-client.js http://localhost:8848 publish <dataId> <content> [group] [namespace]
```

### 认证选项

```bash
# 用户名密码认证
node scripts/nacos-client.js http://localhost:8848 get application.properties --username nacos --password nacos

# 访问令牌认证
node scripts/nacos-client.js https://nacos.example.com get secret-config --token your-access-token

# 使用 v3 管理员 API (需要管理员权限)
node scripts/nacos-client.js http://localhost:8848 get application.properties --admin --username nacos --password nacos

# 强制使用 v1 用户 API (默认行为)
node scripts/nacos-client.js http://localhost:8848 get application.properties --v1
```

### API 版本对比

| 特性 | v1 用户 API | v3 管理员 API |
|------|-------------|---------------|
| **端点** | `/nacos/v1/cs/configs` | `/nacos/v3/admin/cs/config` |
| **权限** | 普通用户权限 | 管理员权限 |
| **参数名** | `group`, `tenant` | `groupName`, `namespaceId` |
| **返回格式** | 直接配置内容 | 统一返回体 `{code, message, data}` |
| **元数据** | 基础信息 | 完整元数据 (创建人、时间、标签等) |
| **推荐用途** | 日常配置查询 | 管理员操作、审计、配置管理 |

## 使用示例

### 基本配置查询

```bash
# 获取 application.properties
node scripts/nacos-client.js http://localhost:8848 get application.properties

# 获取指定组和命名空间的配置
node scripts/nacos-client.js http://localhost:8848 get database-config DATABASE_GROUP dev

# 获取 YAML 配置
node scripts/nacos-client.js http://localhost:8848 get application.yml DEFAULT_GROUP prod
```

### 配置列表查询

```bash
# 列出默认命名空间的所有配置
node scripts/nacos-client.js http://localhost:8848 list

# 列出开发环境的配置
node scripts/nacos-client.js http://localhost:8848 list dev

# 分页列出生产环境配置
node scripts/nacos-client.js http://localhost:8848 list prod 1 50
```

### 配置搜索

```bash
# 搜索所有 application 开头的配置
node scripts/nacos-client.js http://localhost:8848 search "application*"

# 在指定组中搜索 YAML 配置
node scripts/nacos-client.js http://localhost:8848 search "*.yml" CONFIG_GROUP

# 在开发环境中搜索数据库相关配置
node scripts/nacos-client.js http://localhost:8848 search "*database*" "" dev
```

### 生产环境使用

```bash
# 使用 HTTPS 和认证查询生产配置
node scripts/nacos-client.js https://nacos.company.com get production-config PROD_GROUP prod --username admin --password secure-password

# 使用访问令牌批量查询
node scripts/nacos-client.js https://nacos.company.com list prod --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 查看生产配置历史
node scripts/nacos-client.js https://nacos.company.com history database-config DATABASE_GROUP prod --token your-token

# 发布新配置到生产环境
node scripts/nacos-client.js https://nacos.company.com publish new-feature "feature.enabled=true" DEFAULT_GROUP prod --username admin --password secure-password
```

## 技术实现

### API 端点

技能支持 Nacos 官方 API 端点：

#### v1 用户 API (默认)
```javascript
// 获取配置内容
GET /nacos/v1/cs/configs?dataId={dataId}&group={group}&tenant={namespace}

// 发布配置
POST /nacos/v1/cs/configs (dataId, group, content, tenant)

// 查看配置历史
GET /nacos/v1/cs/history?dataId={dataId}&group={group}&tenant={namespace}
```

#### v3 管理员 API (--admin 参数)
```javascript
// 获取配置完整元数据 (官方文档规范)
GET /nacos/v3/admin/cs/config?dataId={dataId}&groupName={groupName}&namespaceId={namespaceId}

// 统一返回格式: {code: 0, message: "success", data: {...}}
```

#### 搜索和列表功能
```javascript
// 使用通配符搜索配置
GET /nacos/v1/cs/configs?dataId={pattern}&group={group}&tenant={namespace}

// 列出配置 (使用通配符)
GET /nacos/v1/cs/configs?dataId=*&group=*&pageNo={pageNo}&pageSize={pageSize}&tenant={namespace}
```

### 核心组件

1. **NacosClient**: HTTP 客户端，负责与 Nacos API 通信
2. **ConfigParser**: 配置内容解析器，自动识别文件类型
3. **OutputFormatter**: 结果格式化器，提供彩色输出
4. **ErrorHandler**: 错误处理器，提供详细错误信息和建议

### 支持的配置类型

- **Properties**: `.properties` - Java 属性文件
- **YAML**: `.yml`, `.yaml` - YAML 配置文件
- **JSON**: `.json` - JSON 配置文件（自动格式化）
- **XML**: `.xml` - XML 配置文件
- **INI**: `.ini` - INI 配置文件
- **Text**: `.txt`, `.conf` - 纯文本配置

## 输出格式

### 配置获取输出

```
✅ 配置获取成功
📋 配置信息:
   Data ID: application.properties
   Group: DEFAULT_GROUP
   Namespace: public
   Type: Properties
   Size: 156 字节
   MD5: d41d8cd98f00b204e9800998ecf8427e

📝 配置内容:
```
server.port=8080
spring.application.name=my-app
debug=true
```

### 配置列表输出

```
✅ 配置列表获取成功
📊 列表信息:
   Namespace: public
   总数量: 15
   当前页: 1
   页大小: 100

📋 配置项:
1. application.properties (DEFAULT_GROUP)
2. database-config.yml (DATABASE_GROUP)
3. redis-config.json (CACHE_GROUP)
```

## 错误处理

### 连接错误

- **服务器不可达**: 检查 Nacos 服务器状态和网络连接
- **端口错误**: 确认端口号正确（默认 8848）
- **防火墙问题**: 检查防火墙设置

### 认证错误

- **凭据无效**: 验证用户名密码或访问令牌
- **权限不足**: 确认用户有访问配置的权限
- **令牌过期**: 重新生成访问令牌

### 配置错误

- **配置不存在**: 检查 dataId、group 和 namespace 是否正确
- **命名空间错误**: 确认 namespace 存在
- **参数格式**: 检查参数格式是否正确

## 最佳实践

### 安全建议

1. **使用 HTTPS**: 生产环境必须使用 HTTPS 连接
2. **安全存储**: 使用环境变量存储敏感信息
3. **最小权限**: 使用具有最小必要权限的账户
4. **网络隔离**: 在安全的网络环境中使用

### 性能优化

1. **批量操作**: 使用列表和搜索功能减少请求次数
2. **分页浏览**: 大量配置时使用分页参数
3. **缓存结果**: 对不经常变化的配置进行缓存
4. **连接复用**: 复用 HTTP 连接提高效率

### 使用技巧

1. **精确搜索**: 使用具体的 dataId 和 group 参数
2. **通配符搜索**: 使用 `*` 进行模糊匹配
3. **环境分离**: 使用不同的 namespace 区分环境
4. **版本管理**: 利用 Nacos 的配置版本控制功能

## 故障排除

### 常见问题

1. **连接超时**
   - 检查网络连接
   - 增加超时时间设置
   - 验证服务器地址

2. **认证失败**
   - 验证用户凭据
   - 检查账户权限
   - 确认认证方式

3. **配置不存在**
   - 使用 list 命令查看可用配置
   - 检查命名空间设置
   - 验证参数拼写

### 调试方法

```bash
# 测试连接
node scripts/nacos-client.js http://localhost:8848 list

# 检查认证
node scripts/nacos-client.js http://localhost:8848 list public --username nacos --password nacos

# 搜索特定配置
node scripts/nacos-client.js http://localhost:8848 search "*" "" public
```

## 支持的 Nacos 版本

- **Nacos 1.x**: 基础 API 支持
- **Nacos 2.x**: 完整功能支持
- **Nacos 3.x**: 最新特性支持

## 环境变量配置

可以设置环境变量简化使用：

```bash
# 默认服务器地址
export NACOS_SERVER=http://localhost:8848

# 默认认证信息
export NACOS_USERNAME=nacos
export NACOS_PASSWORD=nacos

# 默认命名空间
export NACOS_NAMESPACE=public

# 创建便捷别名
alias nacos-get="node nacos-config/scripts/nacos-client.js $NACOS_SERVER get"
alias nacos-list="node nacos-config/scripts/nacos-client.js $NACOS_SERVER list"
alias nacos-search="node nacos-config/scripts/nacos-client.js $NACOS_SERVER search"
```

## 扩展功能

### 自定义格式化

可以修改 `scripts/nacos-client.js` 中的格式化函数来自定义输出格式：

```javascript
formatConfigOutput(result) {
    // 自定义配置输出格式
}
```

### 批量操作

可以扩展脚本支持批量操作：

```javascript
async batchGetConfigs(configList) {
    // 批量获取多个配置
}
```

### 配置导出

添加配置导出到文件的功能：

```javascript
async exportConfig(dataId, filePath) {
    // 导出配置到本地文件
}
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持配置获取、列表和搜索
- 完整的认证支持
- 智能格式检测
- 详细的错误处理

## 许可证

MIT License

## 贡献

欢迎提交问题报告和功能请求！

---

💡 **提示**: 首次使用前，请确保 Nacos 服务器正在运行并且网络连接正常。建议先使用 `list` 命令测试连接。