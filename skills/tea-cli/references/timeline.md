# 时间线 (Timeline)

时间线功能允许查看仓库、问题或 PR 的完整活动历史。

## 查看时间线

```bash
# 查看当前仓库的时间线
tea timeline

# 查看指定仓库的时间线
tea timeline --repo=owner/project

# 查看问题的时间线
tea timeline --issue=123

# 查看 PR 的时间线
tea timeline --pull=456

# 指定登录实例
tea timeline --login=company
```

## 时间线过滤

```bash
# 仅显示评论
tea timeline --comments

# 仅显示问题类型事件
tea timeline --issue-type

# 仅显示 PR 类型事件
tea timeline --pull-type

# 显示之前/之后的事件
tea timeline --before=2024-01-01
tea timeline --after=2024-01-01

# 按用户过滤
tea timeline --user=username
```

## 时间线输出格式

```bash
# 简单格式
tea timeline --output=simple

# 表格格式
tea timeline --output=table

# JSON 格式
tea timeline --output=json

# CSV 格式
tea timeline --output=csv

# TSV 格式
tea timeline --output=tsv
```

## 时间线事件类型

时间线会显示以下类型的事件：

- **评论** - 用户添加的评论
- **状态变更** - 问题/PR 的开放、关闭、重新打开
- **标签变更** - 添加或移除标签
- **指派变更** - 指派或取消指派用户
- **里程碑变更** - 设置或移除里程碑
- **引用** - 其他问题/PR 引用此项
- **合并** - PR 合并事件
- **审查** - PR 审查事件
- **分支更新** - PR 分支更新事件
- **提交** - 关联的提交信息

## 示例场景

```bash
# 查看问题的完整历史
tea timeline --issue=123

# 查看最近的活动
tea timeline --output=json | jq '.[:10]'

# 查看特定用户的活动
tea timeline --user=username --issue=123

# 统计事件数量
tea timeline --output=json | jq 'length'

# 查看特定日期范围内的活动
tea timeline --after=2024-01-01 --before=2024-12-31
```

## 与其他命令结合

```bash
# 查看问题详情后查看时间线
tea issue 123
tea timeline --issue=123

# 查看 PR 详情后查看时间线
tea pr 456
tea timeline --pull=456

# 查看仓库活动
tea timeline --repo=owner/project --limit=50
```
