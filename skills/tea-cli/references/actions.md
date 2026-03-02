# 仓库操作 (Actions)

管理仓库的 Actions/CI/CD 操作。

## 列出操作

```bash
# 列出当前仓库的操作
tea actions

# 列出指定仓库的操作
tea actions --repo=owner/project

# 按状态过滤
tea actions --status=running    # 运行中的操作
tea actions --status=success    # 成功的操作
tea actions --status=failure    # 失败的操作
tea actions --status=cancelled  # 取消的操作
tea actions --status=waiting    # 等待中的操作

# 按工作流过滤
tea actions --workflow=build.yml

# 限制输出数量
tea actions --limit=50
```

## 查看操作

```bash
# 查看操作详情
tea action 1

# 查看指定仓库的操作
tea action 1 --repo=owner/project

# 以 JSON 格式输出
tea action 1 --output=json

# 查看操作日志
tea action logs 1

# 查看操作工作流
tea action workflow 1
```

## 操作日志

```bash
# 查看操作日志
tea action logs 1

# 下载日志文件
tea action logs 1 --download

# 查看特定步骤的日志
tea action logs 1 --step=2

# 实时查看日志
tea action logs 1 --follow
```

## 操作工作流

```bash
# 列出工作流
tea workflows

# 查看工作流文件
tea workflow show build.yml

# 手动触发工作流
tea workflow run build.yml

# 使用参数触发工作流
tea workflow run build.yml --param="version=1.0.0"

# 重新运行失败的操作
tea action rerun 1

# 取消运行中的操作
tea action cancel 1
```

## 操作状态

```bash
# 查看操作状态摘要
tea actions --summary

# 按日期范围过滤
tea actions --after="2024-01-01" --before="2024-12-31"

# 按分支过滤
tea actions --branch=main

# 按触发者过滤
tea actions --actor=username
```

## 示例场景

```bash
# 查看最近失败的操作
tea actions --status=failure --limit=10

# 查看特定分支的操作
tea actions --branch=feature/auth --limit=20

# 重新运行失败的 CI
tea actions --status=failure --output=json | \
  jq -r '.[] | .id' | \
  while read id; do
    tea action rerun $id
  done

# 取消所有运行中的操作
tea actions --status=running --output=json | \
  jq -r '.[] | .id' | \
  while read id; do
    tea action cancel $id
  done

# 查看操作统计
tea actions --output=json | \
  jq 'group_by(.status) | map({status: .[0].status, count: length})'

# 手动触发发布工作流
tea workflow run release.yml --param="tag=v1.0.0" --param="dryrun=false"
```

## 操作通知

```bash
# 设置操作通知
tea action notify 1 --on=success --email=team@example.com
tea action notify 1 --on=failure --slack=#alerts

# 查看通知设置
tea action notifications 1
```

## 操作日志分析

```bash
# 查找日志中的错误
tea action logs 1 | grep -i error

# 查看日志摘要
tea action logs 1 --summary

# 导出日志为文件
tea action logs 1 --export > action-1.log
```
