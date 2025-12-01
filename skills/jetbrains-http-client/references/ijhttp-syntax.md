# ijhttp 命令行语法参考

## 基本语法

```bash
ijhttp [选项] <http-file-path>
```

## 命令行选项

### 完整选项列表

| 选项 | 描述 | 示例 |
|------|------|------|
| `--env-file <file>` | 指定环境文件路径（用于非敏感变量） | `--env-file config.env` |
| `--private-env-file <file>` | 指定私有环境文件路径（用于敏感信息） | `--private-env-file secrets.env` |
| `--output <file>` | 将输出写入指定文件 | `--output results.txt` |
| `--report <file>` | 生成JSON格式的请求执行报告 | `--report report.json` |
| `--no-color` | 禁用彩色输出 | `--no-color` |
| `--help, -h` | 显示帮助信息并退出 | `--help` |
| `--version, -v` | 显示版本信息并退出 | `--version` |

## HTTP 文件语法

### 基本请求格式

```http
### 注释描述
<HTTP_METHOD> <URL> HTTP/<version>
<Header-Key>: <Header-Value>

<Request-Body>
```

### 支持的 HTTP 方法

- GET
- POST
- PUT
- DELETE
- PATCH
- HEAD
- OPTIONS
- TRACE
- CONNECT

### 变量语法

#### 基本变量替换
```http
{{variable_name}}
```

#### 环境变量文件中的变量
```http
{{baseUrl}}/{{apiVersion}}/users
```

#### 动态变量
```http
{{$timestamp}}     # 当前时间戳
{{$randomInt}}      # 随机整数
{{$randomUuid}}     # 随机UUID
```

### 请求分隔符

使用 `###` 或 `### 注释` 来分隔不同的请求：

```http
### 第一个请求
GET http://example.com/api/users

###

### 第二个请求
POST http://example.com/api/users
```

### 请求头语法

```http
Content-Type: application/json
Authorization: Bearer {{token}}
Accept: application/json
User-Agent: HTTP-Client/1.0
X-Custom-Header: custom-value
```

### 请求体格式

#### JSON 请求体
```http
POST http://example.com/api/users
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 30
}
```

#### 表单数据
```http
POST http://example.com/api/submit
Content-Type: application/x-www-form-urlencoded

name=张三&email=zhangsan%40example.com&age=30
```

#### 多部分表单数据
```http
POST http://example.com/api/upload
Content-Type: multipart/form-data

< ./test.txt

# 或者带表单数据
POST http://example.com/api/upload
Content-Type: multipart/form-data; boundary=boundary

--boundary
Content-Disposition: form-data; name="description"

文件描述
--boundary
Content-Disposition: form-data; name="file"; filename="test.txt"

< ./test.txt
--boundary--
```

#### XML 请求体
```http
POST http://example.com/api/xml
Content-Type: application/xml

<?xml version="1.0" encoding="UTF-8"?>
<request>
  <parameter>value</parameter>
</request>
```

#### 纯文本请求体
```http
POST http://example.com/api/text
Content-Type: text/plain

这是纯文本内容
```

### 响应测试语法

```http
GET http://example.com/api/users

> {%
client.test("测试名称", function() {
  client.assert(response.status === 200);
  client.assert(response.body.users && Array.isArray(response.body.users));
});
%}
```

### 全局变量操作

```http
> {%
client.global.set("variableName", "value");
client.global.get("variableName");
client.global.clear("variableName");
%}
```

### 请求注释

#### 单行注释
```http
### 这是一个请求注释
GET http://example.com/api/users
```

#### 内联注释
```http
GET http://example.com/api/users  # 获取用户列表
```

#### 多行注释
```http
# 这是一个多行注释
# 可以包含多行内容
GET http://example.com/api/users
```

### 超时设置

```http
### Request timeout: 30s
GET http://example.com/api/slow-endpoint
```

### 请求重试

```http
### Retry: 3
GET http://example.com/api/unstable-endpoint
```

### 条件请求

```http
### Follow redirects: true
GET http://example.com/api/redirect
```

## 环境文件格式

### 公共环境文件 (.env)

```bash
# 环境变量文件格式（键值对）
baseUrl=https://api.example.com
apiVersion=v1
timeout=60
username=myuser
acceptHeader=application/json
```

### 私有环境文件 (.env)

```bash
# 私有环境文件（敏感信息）
apiKey=your_api_key_here
authToken=your_auth_token_here
password=your_password_here
databaseUrl=your_database_connection_string
```

### 多环境策略

推荐为不同环境创建单独的文件：
- `dev.env` - 开发环境
- `staging.env` - 测试环境
- `prod.env` - 生产环境
- `secrets.env` - 私有敏感信息（所有环境共享）

### 使用示例

```bash
# 开发环境
./ijhttp --env-file dev.env --private-env-file secrets.env api-test.http

# 生产环境
./ijhttp --env-file prod.env --private-env-file secrets.env api-test.http
```

## 响应处理

### 响断言方法

```javascript
client.assert(condition, "错误消息")
client.test("测试名称", function() {
  // 测试代码
})
client.global.set("key", "value")
```

### 响应对象属性

- `response.status` - HTTP状态码
- `response.headers` - 响应头
- `response.body` - 响应体
- `response.responseTime` - 响应时间

## 最佳实践

1. **使用有意义的注释**描述每个请求的目的
2. **组织相关的请求**在一起
3. **使用环境变量**管理不同环境的配置
4. **添加响应测试**验证API行为
5. **使用私有环境文件**存储敏感信息
6. **生成测试报告**用于CI/CD集成