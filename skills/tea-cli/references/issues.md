# 问题管理 (Issues)

Tea 提供完整的问题跟踪功能。

## 列出问题

```bash
# 列出当前仓库的所有问题
tea issues

# 列出指定仓库的问题
tea issues --repo=owner/project

# 按状态过滤
tea issues --state=open    # 开放的问题
tea issues --state=closed  # 已关闭的问题
tea issues --state=all     # 所有问题

# 按类型过滤
tea issues --type=issues   # 仅问题
tea issues --type=pulls    # 仅 PR

# 按标签过滤
tea issues --labels=bug,urgent

# 按里程碑过滤
tea issues --milestone=v1.0

# 按指派人过滤
tea issues --assignee=username

# 按创建者过滤
tea issues --creator=username

# 按关键词搜索
tea issues --search="login"

# 限制输出数量
tea issues --limit=20

# 指定登录实例
tea issues --login=company
```

## 查看问题

```bash
# 查看问题详情
tea issue 123

# 查看指定仓库的问题
tea issue 123 --repo=owner/project

# 以 JSON 格式输出
tea issue 123 --output=json

# 查看问题的评论
tea issue 123 --comments
```

## 创建问题

```bash
# 基本创建
tea issue create --title="Bug found"

# 创建带内容的问题
tea issue create --title="Feature request" --body="Please add..."

# 从文件读取内容
tea issue create --title="Issue" --body=$(cat description.md)

# 指定仓库
tea issue create --repo=owner/project --title="Issue"

# 添加标签
tea issue create --title="Bug" --labels=bug,high-priority

# 指派给用户
tea issue create --title="Task" --assignee=username

# 设置里程碑
tea issue create --title="Task" --milestone=v1.0

# 关联到特定分支
tea issue create --title="Fix" --branch=fix-branch
```

## 编辑问题

```bash
# 修改标题
tea issue edit 123 --title="New title"

# 修改内容
tea issue edit 123 --body="Updated description"

# 添加标签
tea issue edit 123 --add-label=bug

# 移除标签
tea issue edit 123 --remove-label=urgent

# 指派用户
tea issue edit 123 --assignee=username

# 取消指派
tea issue edit 123 --clear-assignee

# 设置里程碑
tea issue edit 123 --milestone=v2.0

# 关闭问题
tea issue edit 123 --state=closed

# 重新打开问题
tea issue edit 123 --state=open
```

## 删除问题

```bash
# 删除问题
tea issue delete 123

# 删除指定仓库的问题
tea issue delete 123 --repo=owner/project
```

## 问题评论

```bash
# 添加评论
tea issue comment 123 --body="This looks good"

# 编辑评论
tea issue comment 123 --edit 456 --body="Updated comment"

# 删除评论
tea issue comment 123 --delete 456
```

## 问题时间线

```bash
# 查看问题时间线
tea timeline --issue=123

# 查看指定仓库的问题时间线
tea timeline --repo=owner/project --issue=123
```

## 批量操作

```bash
# 批量关闭多个问题
tea issue edit 1 --state=closed && \
tea issue edit 2 --state=closed && \
tea issue edit 3 --state=closed

# 批量添加标签
for i in {1..10}; do
  tea issue edit $i --add-label=needs-review
done
```

## 示例场景

```bash
# 创建一个完整的 bug 报告
tea issue create \
  --title="用户无法登录" \
  --body="## 复现步骤\n1. 打开登录页面\n2. 输入用户名密码\n3. 点击登录\n\n**预期**: 登录成功\n**实际**: 显示错误" \
  --labels=bug,high-priority \
  --assignee=@me

# 查找所有高优先级的 bug
tea issues --labels=bug,high-priority --state=open

# 完成问题并关闭
tea issue edit 123 --state=closed --add-label=done --clear-assignee

# 列出所有指派给我的问题
tea issues --assignee=@me --state=open
```

## 快捷方式

```bash
# @me 代表当前用户
tea issues --assignee=@me
tea issue create --assignee=@me

# @me 也可用于创建者
tea issues --creator=@me
```
