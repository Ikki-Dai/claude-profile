# Pull Requests

Tea 提供完整的 Pull Request 管理功能。

## 列出 Pull Requests

```bash
# 列出当前仓库的所有 PR
tea pulls

# 列出指定仓库的 PR
tea pulls --repo=owner/project

# 按状态过滤
tea pulls --state=open    # 开放的 PR
tea pulls --state=closed  # 已关闭的 PR
tea pulls --state=merged  # 已合并的 PR
tea pulls --state=all     # 所有 PR

# 按类型过滤
tea pulls --type=pulls    # 仅 PR
tea pulls --type=issues   # 仅问题

# 按标签过滤
tea pulls --labels=review-needed

# 按里程碑过滤
tea pulls --milestone=v1.0

# 按作者过滤
tea pulls --author=username

# 按关键词搜索
tea pulls --search="feature"

# 限制输出数量
tea pulls --limit=20
```

## 查看 Pull Request

```bash
# 查看 PR 详情
tea pr 456

# 查看指定仓库的 PR
tea pr 456 --repo=owner/project

# 以 JSON 格式输出
tea pr 456 --output=json

# 查看 PR 的评论
tea pr 456 --comments

# 查看 PR 的 diff
tea pr 456 --diff
```

## 创建 Pull Request

```bash
# 基本创建
tea pr create --title="Add new feature"

# 从当前分支创建 PR
tea pr create --head=feature-branch --base=main

# 创建带内容的 PR
tea pr create --title="Feature X" --body="Description of changes"

# 从文件读取内容
tea pr create --body=$(cat pr-description.md)

# 指定仓库
tea pr create --repo=owner/project --title="PR"

# 关联问题
tea pr create --title="Fix issue" --issue=123

# 添加标签
tea pr create --labels=needs-review

# 指定审查者
tea pr create --reviewer=username

# 设为草稿
tea pr create --title="WIP: Feature" --draft

# 从 git 仓库检测并创建 PR
tea pr create
```

## 编辑 Pull Request

```bash
# 修改标题
tea pr edit 456 --title="Updated title"

# 修改内容
tea pr edit 456 --body="Updated description"

# 修改目标分支
tea pr edit 456 --target=develop

# 添加标签
tea pr edit 456 --add-label=ready

# 移除标签
tea pr edit 456 --remove-label=draft

# 设置审查者
tea pr edit 456 --reviewer=username

# 转换为草稿
tea pr edit 456 --draft

# 准备审查（取消草稿）
tea pr edit 456 --ready
```

## Pull Request 操作

```bash
# 合并 PR
tea pr merge 456

# 合并并删除分支
tea pr merge 456 --delete-branch=true

# 指定合并方式
tea pr merge 456 --style=merge     # 合并提交
tea pr merge 456 --style=rebase    # 变基
tea pr merge 456 --style=squash    # 压缩提交

# 添加合并评论
tea pr merge 456 --comment="Merging after review"

# 关闭 PR
tea pr close 456

# 重新打开 PR
tea pr reopen 456

# 更新 PR（更新分支）
tea pr update 456

# 查看可合并状态
tea pr checkout 456
```

## Pull Request 评论

```bash
# 添加评论
tea pr comment 456 --body="LGTM!"

# 添加行评论
tea pr comment 456 --file=src/main.go --line=42 --body="Fix this"

# 编辑评论
tea pr comment 456 --edit 789 --body="Updated comment"

# 删除评论
tea pr comment 456 --delete 789

# 审查 PR（批准）
tea pr review 456 --approve

# 审查 PR（请求修改）
tea pr review 456 --request-changes --body="Please fix..."

# 审查 PR（评论）
tea pr review 456 --comment --body="Some thoughts..."
```

## Pull Request 审查者

```bash
# 添加审查者
tea pr edit 456 --reviewer=user1,user2

# 移除审查者
tea pr edit 456 --remove-reviewer=user1

# 查看审查状态
tea pr reviews 456
```

## Pull Request 状态检查

```bash
# 查看 CI 状态
tea pr checks 456

# 等待检查通过
tea pr wait 456
```

## 示例场景

```bash
# 创建一个完整的 PR
tea pr create \
  --title="实现用户认证功能" \
  --body="## 变更内容\n- 添加登录接口\n- 添加 JWT 认证\n\n## 测试\n- 单元测试通过\n- 集成测试通过" \
  --head=feature/auth \
  --base=main \
  --labels=feature,needs-review \
  --reviewer=@me

# 合并 PR
tea pr merge 456 --style=merge --delete-branch=true --comment="已审查，合并"

# 查找需要审查的 PR
tea pulls --state=open --labels=needs-review

# 批量添加标签
tea pr edit 456 --add-label=approved --remove-label=needs-review

# 关闭过期的 PR
tea pulls --search="wip" --state=open --output=json | \
  jq '.[] | .index' | \
  xargs -I {} tea pr close {}
```

## Pull Request 模板

```bash
# 使用模板创建 PR（如果仓库有 PR 模板）
tea pr create --template

# 从特定模板文件创建
tea pr create --body=$(cat .gitea/PULL_REQUEST_TEMPLATE.md)
```
