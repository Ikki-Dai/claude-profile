# 里程碑 (Milestones)

里程碑用于组织和跟踪项目进度。

## 列出里程碑

```bash
# 列出当前仓库的里程碑
tea milestones

# 列出指定仓库的里程碑
tea milestones --repo=owner/project

# 按状态过滤
tea milestones --state=open    # 开放的里程碑
tea milestones --state=closed  # 已关闭的里程碑
tea milestones --state=all     # 所有里程碑

# 按名称搜索
tea milestones --search="v1.0"

# 限制输出数量
tea milestones --limit=20
```

## 查看里程碑

```bash
# 查看里程碑详情
tea milestone 1

# 查看指定仓库的里程碑
tea milestone 1 --repo=owner/project

# 以 JSON 格式输出
tea milestone 1 --output=json
```

## 创建里程碑

```bash
# 基本创建
tea milestone create --title="v1.0"

# 创建带描述的里程碑
tea milestone create --title="v1.0" --description="First stable release"

# 设置截止日期
tea milestone create --title="v1.0" --due-date="2024-12-31"

# 设置开始日期
tea milestone create --title="v1.0" --start-date="2024-01-01"

# 同时设置开始和截止日期
tea milestone create \
  --title="Q1 Release" \
  --description="First quarter release" \
  --start-date="2024-01-01" \
  --due-date="2024-03-31"
```

## 编辑里程碑

```bash
# 修改标题
tea milestone edit 1 --title="v1.0.1"

# 修改描述
tea milestone edit 1 --description="Updated description"

# 修改截止日期
tea milestone edit 1 --due-date="2024-12-31"

# 修改开始日期
tea milestone edit 1 --start-date="2024-01-01"

# 关闭里程碑
tea milestone edit 1 --state=closed

# 重新打开里程碑
tea milestone edit 1 --state=open
```

## 删除里程碑

```bash
# 删除里程碑
tea milestone delete 1

# 删除指定仓库的里程碑
tea milestone delete 1 --repo=owner/project

# 确认删除
tea milestone delete 1 --force
```

## 里程碑问题

```bash
# 查看里程碑中的问题
tea milestone issues 1

# 查看指定仓库里程碑中的问题
tea milestone issues 1 --repo=owner/project
```

## 示例场景

```bash
# 创建发布里程碑
tea milestone create \
  --title="v2.0 Release" \
  --description="Major feature release with breaking changes" \
  --start-date="2024-01-01" \
  --due-date="2024-06-30"

# 为问题分配里程碑
tea issue edit 123 --milestone="v2.0 Release"

# 查看里程碑进度
tea milestone 1
tea milestone issues 1 --state=open

# 关闭已完成的里程碑
tea milestone edit 1 --state=closed --description="Released successfully"

# 列出所有开放的里程碑及其问题数量
tea milestones --state=open --output=json | \
  jq '.[] | {title: .title, open_issues: .open_issues, closed_issues: .closed_issues}'
```

## 里程碑最佳实践

```bash
# 按版本命名
tea milestone create --title="v1.0.0"
tea milestone create --title="v1.1.0"
tea milestone create --title="v2.0.0"

# 按周期命名
tea milestone create --title="2024-Q1"
tea milestone create --title="2024-Q2"

# 按功能命名
tea milestone create --title="用户认证"
tea milestone create --title="支付集成"
```
