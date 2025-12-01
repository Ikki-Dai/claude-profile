---
name: usql-database
description: 通用 SQL 数据库接口，使用 usql 命令行工具提供跨多种数据库系统的统一数据库访问、查询和管理功能，包括 PostgreSQL、MySQL、Oracle、SQLite、SQL Server 等多种数据库。
license: 完整条款见 LICENSE.txt
---

# USQL 通用数据库接口

此技能使用 usql 命令行工具提供通用数据库访问和管理功能，为多种 SQL 数据库系统提供一致的接口。

## 目的

通过单一、一致的接口，在不同数据库系统间实现通用数据库操作，包括连接管理、查询执行、脚本处理和数据操作。

## 使用场景

- 连接任意支持的 SQL 数据库（PostgreSQL、MySQL、Oracle、SQLite、SQL Server 等）
- 执行 SQL 查询并查看格式化结果
- 运行 SQL 脚本和批处理操作
- 执行数据库管理任务
- 将查询结果导出为多种格式
- 使用一致的命令处理多种数据库系统
- 通过脚本自动化数据库操作

## 支持的数据库系统

### 主要数据库支持
- **PostgreSQL** - 完整功能支持，包括高级数据类型
- **MySQL/MariaDB** - 完整的 MySQL 兼容性
- **Oracle Database** - Oracle 特定功能和数据类型
- **SQLite** - 轻量级文件数据库操作
- **Microsoft SQL Server** - SQL Server 连接和查询
- **ClickHouse** - 分析列式数据库
- **Cassandra** - NoSQL 数据库操作
- **CockroachDB** - 分布式 SQL 数据库
- **Vitess** - 数据库集群系统
- **TimescaleDB** - 时序数据库
- **Spanner** - 云原生数据库

### 其他数据库驱动
- **Adabas** - Adabas 数据库支持
- **Avatica** - Apache Avatica 驱动
- **BigQuery** - Google BigQuery 集成
- **Databricks** - Databricks SQL 连接器
- **Firebird** - Firebird 数据库支持
- **Ignite** - Apache Ignite 数据库
- **MaxCompute** - 阿里巴巴 MaxCompute
- **MonetDB** - MonetDB 列式数据库
- **Snowflake** - Snowflake 数据仓库
- **Trino** - 分布式查询引擎
- **Vertica** - Vertica 分析平台

## 核心功能

### 1. 数据库连接

#### 连接字符串格式
```
# PostgreSQL
usql pg://用户名:密码@主机名:端口/数据库名

# MySQL
usql my://用户名:密码@主机名:端口/数据库名

# SQLite
usql sqlite:/path/to/database.db

# SQL Server
usql mssql://用户名:密码@主机名:端口/数据库

# Oracle
usql oracle://用户名:密码@主机名:端口/服务名

# Microsoft Access
usql access:/path/to/database.accdb

# Microsoft Excel
usql xls:/path/to/file.xlsx
```

#### 连接示例
```bash
# 交互式连接
usql pg://用户:密码@localhost/我的数据库

# 执行单个查询
usql pg://用户:密码@localhost/我的数据库 -c "SELECT COUNT(*) FROM 用户表"

# 执行脚本文件
usql pg://用户:密码@localhost/我的数据库 -f 查询.sql

# 带 SSL 选项的连接
usql pg://用户:密码@localhost/我的数据库?sslmode=require
```

### 2. 查询执行

#### 交互式查询
```bash
# 启动交互式会话
usql pg://用户:密码@localhost/我的数据库

# 在交互模式中执行命令
\?                    # 显示帮助
\l                    # 列出数据库
\dt                   # 列出表
\d 表名               # 描述表结构
\du                   # 列出用户
```

#### 命令执行
```bash
# 单个查询执行
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表 WHERE 激活 = true"

# 多个查询
usql pg://用户:密码@localhost/我的数据库 -c "SELECT COUNT(*) FROM 用户表; SELECT COUNT(*) FROM 订单表;"

# 带参数的查询
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表 WHERE id = $1" -v 123
```

### 3. 脚本执行

#### SQL 脚本处理
```bash
# 执行 SQL 脚本
usql pg://用户:密码@localhost/我的数据库 -f 脚本.sql

# 执行并输出到文件
usql pg://用户:密码@localhost/我的数据库 -f 脚本.sql -o 结果.txt

# 执行多个脚本
usql pg://用户:密码@localhost/我的数据库 -f 架构.sql -f 数据.sql -f 索引.sql

# 在事务中执行
usql pg://用户:密码@localhost/我的数据库 -f 脚本.sql --transaction
```

#### 脚本功能
- 多语句执行
- 事务控制
- 错误处理
- 进度报告
- 变量替换

### 4. 输出格式化

#### 输出格式
```bash
# 默认表格式
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表"

# CSV 输出
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" -o data.csv --format csv

# JSON 输出
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" -o data.json --format json

# 垂直输出（适用于宽行）
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 宽表" --output vertical

# HTML 输出
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" -o report.html --format html

# Markdown 输出
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" -o report.md --format markdown
```

#### 输出选项
```bash
# 显示标题和行数
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" --show-header --row-count

# 不显示标题
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" --no-header

# 自定义字段分隔符
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" --field-separator '|'

# 限制行数
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" --limit 100
```

### 5. 高级功能

#### 变量替换
```bash
# 在查询中使用变量
usql pg://用户:密码@localhost/我的数据库 -v 开始日期='2023-01-01' -v 结束日期='2023-12-31' \
  -c "SELECT * FROM 订单表 WHERE 订单日期 BETWEEN :开始日期 AND :结束日期"

# 使用变量文件
usql pg://用户:密码@localhost/我的数据库 --var-file 变量.env -f 脚本.sql
```

#### 条件执行
```bash
# 根据条件执行
usql pg://用户:密码@localhost/我的数据库 --if-exists "DROP TABLE 旧表"

# 仅当表不存在时执行
usql pg://用户:密码@localhost/我的数据库 --if-not-exists "CREATE TABLE 新表 (id INTEGER)"
```

#### 批处理操作
```bash
# 处理多个数据库
for db in $(cat 数据库列表.txt); do
  usql pg://管理员:密码@localhost/$db -f 维护.sql
done

# 处理多个查询文件
find . -name "*.sql" -exec usql pg://用户:密码@localhost/我的数据库 -f {} \;
```

## 使用模式

### 数据库管理
```bash
# 数据库备份
usql pg://用户:密码@localhost/我的数据库 -c "\COPY (SELECT * FROM 用户表) TO '用户表.csv' WITH CSV HEADER"

# 数据库维护
usql pg://用户:密码@localhost/我的数据库 -c "VACUUM ANALYZE"

# 架构检查
usql pg://用户:密码@localhost/我的数据库 -c "\dt+"
```

### 数据分析
```bash
# 为分析导出数据
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 销售表 WHERE 日期 >= '2023-01-01'" -o 销售数据.csv --format csv

# 聚合报告
usql pg://用户:密码@localhost/我的数据库 -c "
  SELECT
    产品类别,
    COUNT(*) as 总销售数,
    SUM(金额) as 营收,
    AVG(金额) as 平均销售额
  FROM 销售表
  WHERE 日期 >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY 产品类别
  ORDER BY 营收 DESC
" --output vertical
```

### 开发和测试
```bash
# 测试数据生成
usql pg://用户:密码@localhost/测试数据库 -c "
  INSERT INTO 用户表 (姓名, 邮箱, 创建时间)
  SELECT
    '用户 ' || 生成系列,
    '用户' || 生成系列 || '@test.com',
    CURRENT_TIMESTAMP - (生成系列 || ' days')::INTERVAL
  FROM generate_series(1, 1000)
"

# 性能测试
usql pg://用户:密码@localhost/我的数据库 -c "EXPLAIN ANALYZE SELECT * FROM 大表 WHERE 索引列 = '值'"
```

## 错误处理和故障排除

### 常见连接问题
```bash
# 测试连接（不指定数据库）
usql pg://用户:密码@主机名:5432/ --test

# 连接超时设置
usql pg://用户:密码@localhost/我的数据库 --connect-timeout 30

# SSL 连接故障排除
usql pg://用户:密码@localhost/我的数据库?sslmode=disable --verbose
```

### 查询错误处理
```bash
# 错误时继续执行
usql pg://用户:密码@localhost/我的数据库 -f 脚本.sql --continue-on-error

# 错误时回滚事务
usql pg://用户:密码@localhost/我的数据库 -f 脚本.sql --transaction --rollback

# 详细错误输出
usql pg://用户:密码@localhost/我的数据库 -c "SELECT * FROM 用户表" --verbose
```

## 安全考虑

### 连接安全
```bash
# SSL 连接
usql pg://用户:密码@主机名/我的数据库?sslmode=require

# 证书验证
usql pg://用户:密码@主机名/我的数据库?sslmode=verify-full

# SSH 隧道连接
usql pg://用户@ssh-服务器:5432/我的数据库 --ssh
```

### 凭据管理
```bash
# 使用环境变量
export PGPASSWORD='密码'
usql pg://用户@localhost/我的数据库 -c "SELECT 1"

# PostgreSQL 使用 .pgpass 文件
# 主机名:端口:数据库:用户名:密码
echo "localhost:5432:*:用户:密码" >> ~/.pgpass

# 使用配置文件
usql --config ~/.usql/config.toml pg://我的数据库
```

## 与其他工具集成

### 数据管道集成
```bash
# ETL 过程
usql pg://源数据库/db -c "SELECT * FROM 源表" --format csv | \
usql mysql://目标数据库/db -c "COPY 目标表 FROM stdin WITH CSV"

# 数据库迁移
usql pg://用户:密码@localhost/我的数据库 -f 迁移/001_创建表.sql
usql pg://用户:密码@localhost/我的数据库 -f 迁移/002_添加索引.sql
```

### 监控和自动化
```bash
# 健康检查
usql pg://用户:密码@localhost/我的数据库 -c "SELECT 1" && echo "数据库健康"

# 定时维护
0 2 * * * /usr/local/bin/usql pg://用户:密码@localhost/我的数据库 -c "VACUUM ANALYZE"
```