---
name: jetbrains-http-client
description: 使用 JetBrains ijhttp CLI 工具执行 .http API 测试文件。当用户需要使用类似 IntelliJ IDEA 的 HTTP Client 测试 API 时应使用此技能。
license: 完整条款见 LICENSE.txt
---

# JetBrains HTTP Client

此技能提供使用 JetBrains `ijhttp` CLI 工具执行 `.http` API 测试文件的功能，为使用 IntelliJ IDEA HTTP Client 的开发者提供熟悉的命令行接口。

## 用途

通过 JetBrains CLI 工具实现高效的 API 测试，为熟悉 IntelliJ IDEA HTTP Client 的开发者提供一致的体验。

## 使用场景

- 执行 `.http` 文件中定义的 API 请求
- 测试 REST API、GraphQL 端点和 Web 服务
- 从命令行执行自动化 API 测试
- 将 API 测试集成到 CI/CD 流水线中
- 批量执行多个 API 请求
- 特定环境的 API 测试
- API 文档验证

## 核心功能

### 主要特性

1. **HTTP 文件执行**
   - 解析并执行标准 HTTP 语法的 `.http` 文件
   - 支持 GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS 方法
   - 处理请求头、请求体和查询参数
   - 支持 multipart/form-data 和 application/json 内容类型

2. **环境变量**
   - 支持环境变量替换 (`{{变量名}}`)
   - 多环境文件支持
   - 动态变量注入
   - API 密钥和令牌的密钥管理

3. **响应处理**
   - 显示 HTTP 响应状态码、响应头和响应体
   - 支持不同输出格式（JSON、XML、纯文本）
   - 响应验证和断言功能
   - JSON 响应的格式化显示

4. **批量执行**
   - 从单个 `.http` 文件执行多个请求
   - 支持依赖关系的顺序请求执行
   - 独立请求的并行执行

### 使用流程

1. **解析 HTTP 文件**
   - 读取 `.http` 文件内容
   - 提取各个请求及其元数据
   - 解析请求头、请求体和参数
   - 处理环境变量替换

2. **执行请求**
   - 使用 `ijhttp` 构造适当的 HTTP 请求
   - 使用指定参数执行请求
   - 处理身份验证和授权
   - 处理响应并格式化输出

3. **处理结果**
   - 显示响应状态和计时信息
   - 根据内容类型格式化响应体
   - 优雅处理错误响应
   - 提供执行结果摘要

### 支持的 HTTP 特性

- **HTTP 方法**：GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS、TRACE
- **请求头**：自定义头、Content-Type、Authorization、User-Agent
- **请求体类型**：
  - JSON：`application/json`
  - 表单数据：`application/x-www-form-urlencoded`
  - 多部分：`multipart/form-data`
  - XML：`application/xml`
  - 纯文本：`text/plain`
- **身份验证**：
  - Bearer 令牌
  - 基本身份验证
  - 头部 API 密钥
  - 自定义身份验证方案

### 环境配置

1. **环境文件格式**

**公共环境文件 (environments.env)**
```bash
# 开发环境配置
baseUrl=http://localhost:8080
apiVersion=v1
timeout=30
username=dev_user

# 其他通用配置
acceptHeader=application/json
userAgent=HTTP-Client/1.0
```

**私有环境文件 (secrets.env)**
```bash
# 敏感信息 - 不要提交到版本控制
apiKey=your_secret_api_key_here
authToken=your_auth_token_here
password=your_password_here
databaseUrl=your_database_connection_string
```

**多环境策略（推荐方式）**

创建不同的环境文件：
- `dev.env` - 开发环境
- `staging.env` - 测试环境
- `prod.env` - 生产环境
- `secrets.env` - 私有敏感信息

使用示例：
```bash
# 开发环境
./ijhttp --env-file dev.env --private-env-file secrets.env api-test.http

# 生产环境
./ijhttp --env-file prod.env --private-env-file secrets.env api-test.http
```

2. **变量语法**
   ```http
   # 基本变量替换
   GET {{baseUrl}}/{{apiVersion}}/users/{{userId}}
   Authorization: Bearer {{apiKey}}
   Content-Type: application/json

   # 主机和端口变量
   Host: {{host}}:{{port}}

   # 超时设置
   ### Request timeout: {{timeout}}s
   POST {{baseUrl}}/api/data
   ```

3. **动态变量**
   - 生成时间戳：`{{$timestamp}}`
   - 生成随机数：`{{$randomInt}}`
   - 生成 UUID：`{{$randomUuid}}`
   - 支持环境文件中的 JavaScript 表达式
   - 自定义变量函数

### 文件示例

#### 基本 GET 请求
```http
### 获取用户信息
GET https://api.example.com/users/123
Authorization: Bearer {{authToken}}
Accept: application/json
```

#### 带 JSON 体的 POST 请求
```http
### 创建新用户
POST https://api.example.com/users
Content-Type: application/json
Authorization: Bearer {{authToken}}

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 30
}
```

#### 表单数据请求
```http
### 提交表单数据
POST https://api.example.com/submit
Content-Type: application/x-www-form-urlencoded

name=张三&email=zhangsan%40example.com&age=30
```

#### 多部分文件上传
```http
### 上传文件
POST https://api.example.com/upload
Content-Type: multipart/form-data; boundary=boundary

--boundary
Content-Disposition: form-data; name="file"; filename="test.txt"
Content-Type: text/plain

文件内容在这里
--boundary--
```

#### 响应测试
```http
### 获取用户并验证响应
GET https://api.example.com/users
Accept: application/json

> {%
client.test("状态码为 200", function() {
  client.assert(response.status === 200);
});
client.test("响应包含用户数组", function() {
  client.assert(response.body.users && Array.isArray(response.body.users));
});
%}
```

### 命令行选项

#### 环境变量选项

**使用环境变量**
```bash
# 使用公共环境文件（用于非敏感配置）
./ijhttp --env-file http-client.env.json rest-api.http

# 使用私有环境文件（用于敏感信息如API密钥、密码）
./ijhttp --private-env-file http-client.private.env.json rest-api.http

# 同时使用公共和私有环境文件
./ijhttp --env-file http-client.env.json --private-env-file http-client.private.env.json rest-api.http

# 使用多个环境变量
./ijhttp -e dev -V "baseUrl=https://api.example.com" -V "api-key=dev-key" test.http
```

**注意**：环境文件格式为简单的键值对，而不是 JSON 格式的环境分组。

#### 获取帮助
```bash
# 查看完整的命令行帮助
./ijhttp --help

# 查看特定选项的帮助
./ijhttp --help --env-file
```

#### 完整CLI选项

**环境变量选项：**
- `-e, --env=<environmentName>`：指定环境名称（从环境文件中选择）
- `-v, --env-file=<publicEnvFile>`：指定公共环境文件（默认：http-client.env.json）
- `-p, --private-env-file=<privateEnvFile>`：指定私有环境文件（默认：http-client.private.env.json）
- `-V, --env-variables=<String=String>`：设置公共环境变量（可重复使用）
- `-P, --private-env-variables=<String=String>`：设置私有环境变量（可重复使用）

**输出和控制选项：**
- `--connect-timeout=<connectTimeout>`：设置连接超时（毫秒，默认：3000）
- `-t, --socket-timeout=<socketTimeout>`：设置socket超时（毫秒，默认：10000）
- `-r, --report=<reportPath>`：生成JUnit XML格式的执行报告
- `-L, --log-level=<logLevel>`：设置日志级别（BASIC, HEADERS, VERBOSE）
- `--no-progress`：禁用进度条显示
- `--version`：显示版本信息并退出

**网络和代理选项：**
- `--proxy=<proxyUrl>`：设置代理（格式：scheme://login:password@host:port）
- `--insecure`：允许不安全的SSL连接

**高级选项：**
- `-D, --docker-mode`：启用Docker模式
- `--js-engine=<jsEngine>`：指定JavaScript引擎（graalvm 或 rhino）

#### 示例命令
```bash
# 基本执行
./ijhttp test.http

# 使用指定环境
./ijhttp -e dev test.http

# 使用自定义环境文件和环境名称
./ijhttp -e dev -v http-client.env.json -p http-client.private.env.json api-test.http

# 使用命令行设置环境变量
./ijhttp -V "baseUrl=https://api.example.com" -V "api-key=your-key" test.http

# 使用私有环境变量（敏感信息）
./ijhttp -P "password=secret123" -P "token=abc123" secure-api.http

# 生成测试报告（JUnit XML格式）
./ijhttp -r reports/test-results test.http

# 设置超时和详细日志
./ijhttp -t 15000 -L VERBOSE test.http

# 使用代理
./ijhttp --proxy http://proxy.example.com:8080 test.http

# 禁用SSL验证（仅用于测试）
./ijhttp --insecure test.http

# 获取帮助
./ijhttp --help
```

**典型使用场景：**
```bash
# 开发环境测试（推荐）
./ijhttp -e dev -v http-client.env.json -p http-client.private.env.json api-tests.http

# 快速测试（直接设置变量）
./ijhttp -V "host=localhost:8080" -P "api-key=dev-key" -P "token=test-token" test.http
```

### 错误处理

- **网络错误**：连接超时、DNS 解析失败
- **HTTP 错误**：4xx 客户端错误、5xx 服务器错误
- **文件错误**：缺少 .http 文件、语法无效
- **环境错误**：缺少变量、无效环境文件
- **响应验证**：断言失败、意外响应格式

## 示例文件

### 核心示例
- `examples/basic-requests.http` - 基本 HTTP 请求示例（GET、POST、PUT、DELETE）
- `examples/authentication.http` - 身份验证和授权示例
- `examples/file-uploads.http` - 文件上传和多部分示例
- `examples/api-testing.http` - 综合 API 测试套件示例

### 环境配置文件
- `examples/http-client.env.json` - 公共环境变量配置（JSON格式）
- `examples/http-client.private.env.json` - 私有敏感信息（JSON格式，不要提交到版本控制）

## 参考资料

- `references/ijhttp-syntax.md` - 完整的 ijhttp 语法和CLI选项参考

## 集成说明

- 需要 JetBrains IDE（IntelliJ IDEA、WebStorm、PyCharm 等）或相关 CLI 工具
- 兼容 CI/CD 流水线和自动化测试工作流
- 支持生成 JSON 格式的测试报告
- 私有环境文件确保敏感信息安全