# 任务和运行 (Tasks & Runs)

管理 CI/CD 任务和运行记录。

## 列出任务

```bash
# 列出当前仓库的任务
tea tasks

# 列出指定仓库的任务
tea tasks --repo=owner/project

# 按状态过滤
tea tasks --status=running    # 运行中的任务
tea tasks --status=success    # 成功的任务
tea tasks --status=failure    # 失败的任务
tea tasks --status=pending    # 待处理的任务

# 按类型过滤
tea tasks --type=ci           # CI 任务
tea tasks --type=deploy       # 部署任务

# 限制输出数量
tea tasks --limit=50
```

## 查看任务

```bash
# 查看任务详情
tea task 1

# 查看指定仓库的任务
tea task 1 --repo=owner/project

# 以 JSON 格式输出
tea task 1 --output=json

# 查看任务日志
tea task logs 1

# 查看任务步骤
tea task steps 1
```

## 任务操作

```bash
# 取消任务
tea task cancel 1

# 重新运行任务
tea task rerun 1

# 跳过任务
tea task skip 1

# 查看任务依赖
tea task dependencies 1
```

## 列出运行记录

```bash
# 列出运行记录
tea runs

# 列出指定仓库的运行记录
tea runs --repo=owner/project

# 按状态过滤
tea runs --status=running
tea runs --status=success
tea runs --status=failure

# 按工作流过滤
tea runs --workflow=build

# 按分支过滤
tea runs --branch=main

# 限制输出数量
tea runs --limit=20
```

## 查看运行记录

```bash
# 查看运行记录详情
tea run 1

# 查看运行日志
tea run logs 1

# 查看运行步骤
tea run steps 1

# 以 JSON 格式输出
tea run 1 --output=json

# 实时查看运行状态
tea run watch 1

# 等待运行完成
tea run wait 1
```

## 运行操作

```bash
# 取消运行
tea run cancel 1

# 重新运行
tea run rerun 1

# 查看运行工件
tea run artifacts 1

# 下载运行工件
tea run artifact download 1 --name=build.tar.gz
```

## 示例场景

```bash
# 查看最近的失败任务
tea tasks --status=failure --limit=10

# 查看特定分支的运行记录
tea runs --branch=feature/auth --limit=20

# 等待任务完成
tea run wait 1 --timeout=3600

# 查看任务详情和日志
tea task 1
tea task logs 1

# 重新运行失败的任务
tea tasks --status=failure --output=json | \
  jq -r '.[] | .id' | \
  while read id; do
    tea task rerun $id
  done

# 下载构建产物
tea run artifacts 1
tea run artifact download 1 --name=app.tar.gz

# 监控运行状态
tea run watch 1

# 取消所有运行中的任务
tea runs --status=running --output=json | \
  jq -r '.[] | .id' | \
  while read id; do
    tea run cancel $id
  done

# 查看任务统计
tea tasks --output=json | \
  jq 'group_by(.status) | map({status: .[0].status, count: length})'
```

## 任务和运行的关系

- **任务 (Task)** - CI/CD 系统中的单个任务单元
- **运行 (Run)** - 工作流的一次完整执行，可能包含多个任务

## 任务步骤

```bash
# 查看任务的所有步骤
tea task steps 1

# 查看特定步骤的日志
tea task step 1 2

# 查看步骤的输入输出
tea task step 1 2 --io

# 重试特定步骤
tea task step retry 1 2
```

## 运行工件

```bash
# 列出运行的所有工件
tea run artifacts 1

# 查看工件详情
tea run artifact info 1 build

# 上传工件
tea run artifact upload 1 --file=./build/app.tar.gz --name=app

# 删除工件
tea run artifact delete 1 build
```

## 运行变量

```bash
# 列出运行变量
tea run vars 1

# 设置运行变量
tea run var set 1 KEY=value

# 获取运行变量
tea run var get 1 KEY

# 删除运行变量
tea run var delete 1 KEY
```
