# 通知 (Notifications)

管理 Gitea 通知和提醒。

## 列出通知

```bash
# 列出所有通知
tea notifications

# 仅列出未读通知
tea notifications --state=unread

# 仅列出已读通知
tea notifications --state=read

# 仅列出置顶通知
tea notifications --state=pinned

# 按类型过滤
tea notifications --types=issue    # 问题通知
tea notifications --types=pull     # PR 通知
tea notifications --types=commit   # 提交通知
tea notifications --types=repository  # 仓库通知

# 多种类型
tea notifications --types=issue,pull

# 按仓库过滤
tea notifications --repo=owner/project

# 限制输出数量
tea notifications --limit=50

# 指定登录实例
tea notifications --login=company
```

## 查看通知

```bash
# 查看通知详情
tea notification 1

# 以 JSON 格式输出
tea notification 1 --output=json

# 查看并标记为已读
tea notification 1 --read
```

## 标记通知

```bash
# 标记为已读
tea notification read 1

# 标记所有为已读
tea notifications read-all

# 标记指定仓库的通知为已读
tea notifications read --repo=owner/project

# 置顶通知
tea notification pin 1

# 取消置顶
tea notification unpin 1
```

## 删除通知

```bash
# 删除单个通知
tea notification delete 1

# 清除所有通知
tea notifications purge

# 清除已读通知
tea notifications purge --state=read

# 清除未读通知
tea notifications purge --state=unread
```

## 通知状态

```bash
# 查看通知状态
tea notification status

# 查看未读通知数量
tea notification status --unread
```

## 示例场景

```bash
# 查看所有未读通知
tea notifications --state=unread

# 查看特定类型的未读通知
tea notifications --state=unread --types=issue,pull

# 快速处理通知
tea notifications --state=unread --output=json | \
  jq '.[] | .id' | \
  while read id; do
    tea notification read $id
  done

# 清除所有已读通知
tea notifications purge --state=read

# 查看需要我操作的 PR
tea notifications --types=pull --state=unread

# 查看我创建的问题的通知
tea notifications --state=unread --output=json | \
  jq '.[] | select(.topic | contains("my-issue"))'
```

## 通知类型说明

| 类型 | 描述 |
|------|------|
| `issue` | 问题相关通知 |
| `pull` | Pull Request 相关通知 |
| `commit` | 提交相关通知 |
| `repository` | 仓库相关通知 |
| `release` | 发布相关通知 |

## 通知状态说明

| 状态 | 描述 |
|------|------|
| `unread` | 未读通知 |
| `read` | 已读通知 |
| `pinned` | 置顶通知 |
