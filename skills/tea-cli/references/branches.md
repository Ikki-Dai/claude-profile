# 分支 (Branches)

管理仓库分支。

## 列出分支

```bash
# 列出当前仓库的分支
tea branches

# 列出指定仓库的分支
tea branches --repo=owner/project

# 仅列出受保护的分支
tea branches --protected

# 搜索分支
tea branches --search="feature"

# 限制输出数量
tea branches --limit=50
```

## 查看分支

```bash
# 查看分支详情
tea branch feature-branch

# 查看指定仓库的分支
tea branch feature-branch --repo=owner/project

# 以 JSON 格式输出
tea branch feature-branch --output=json
```

## 创建分支

```bash
# 基本创建
tea branch create --name=new-branch

# 从特定分支创建
tea branch create --name=hotfix --base=main

# 从提交创建
tea branch create --name=test-branch --commit=abc123def

# 创建并设置上游
tea branch create --name=feature --set-upstream
```

## 删除分支

```bash
# 删除分支
tea branch delete old-branch

# 删除指定仓库的分支
tea branch delete old-branch --repo=owner/project

# 强制删除
tea branch delete old-branch --force
```

## 分支保护

```bash
# 保护分支
tea branch protect main

# 设置保护规则
tea branch protect main \
  --require-pull-request \
  --require-approvals=2 \
  --block-on-outdated \
  --pusher-whitelist="team/core"

# 取消保护
tea branch unprotect main
```

## 分支操作

```bash
# 查看分支差异
tea branch diff feature-branch main

# 查看分支提交
tea branch commits feature-branch

# 设置默认分支
tea branch set-default main
```

## 示例场景

```bash
# 创建功能分支
tea branch create --name=feature/user-auth --base=develop

# 查看所有功能分支
tea branches --search="feature/"

# 清理已合并的分支
tea branches --output=json | \
  jq -r '.[] | select(.name | contains("merged-")) | .name' | \
  xargs -I {} tea branch delete {}

# 保护主要分支
tea branch protect main \
  --require-pull-request \
  --require-approvals=2

# 列出所有受保护的分支
tea branches --protected
```

## 分支命名约定

```bash
# 功能分支
tea branch create --name=feature/add-login
tea branch create --name=feat/user-profile

# 修复分支
tea branch create --name=fix/bug-123
tea branch create --name=hotfix/critical-issue

# 发布分支
tea branch create --name=release/v1.0.0

# 开发分支
tea branch create --name=develop
tea branch create --name=staging
```
