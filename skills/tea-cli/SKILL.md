---
name: tea-cli
description: Interact with Gitea instances through the command line interface for repository management, issues, pull requests, and automation.
license: MIT
---

# Tea CLI

Tea 是 Gitea 的官方命令行工具，用 Go 编写，允许开发者从终端管理 Gitea 仓库、问题、拉取请求等，无需切换到 Web 界面。

## 目的

通过命令行接口实现高效的 Gitea 仓库管理、问题跟踪、PR 处理和自动化工作流。

## 使用场景

- 管理多个 Gitea 实例的登录和认证
- 创建、克隆、浏览仓库
- 管理问题和 Pull Requests
- 查看和管理里程碑、标签
- 操作分支、查看提交历史
- 管理组织和用户
- CI/CD 状态查询
- 自动化脚本集成

## 前提条件

1. **安装 Tea** - 通过包管理器或从源码安装
2. **Gitea 实例** - 需要访问的 Gitea 服务器
3. **认证令牌** - 需要应用令牌或 OAuth 认证

## 安装

```bash
# macOS
brew install tea

# Linux (Homebrew)
brew install tea

# Windows
scoop install tea

# 从源码安装
go install code.gitea.io/tea@latest

# 使用预构建二进制文件
# 下载自 dl.gitea.com
```

## 登录认证

### 添加登录实例

```bash
# 交互式添加
tea login add

# 指定参数添加
tea login add --name=mygitea --url=https://gitea.com --token=YOUR_TOKEN

# 使用 OAuth（Gitea 0.10+）
tea login add --name=mygitea --url=https://gitea.com
```

### 管理登录

| 命令 | 描述 |
|------|------|
| `tea logins` | 列出所有已配置的登录 |
| `tea login delete <name>` | 删除指定登录 |
| `tea login set-default <name>` | 设置默认登录 |
| `tea whoami` | 查看当前用户信息 |

## 命令分类

### 仓库操作 (Repositories)

仓库的创建、浏览和管理：

| 命令 | 描述 |
|------|------|
| `tea repos` | 列出当前用户的仓库 |
| `tea repos --owner=<user>` | 列出指定用户的仓库 |
| `tea repo create --name=<name>` | 创建新仓库 |
| `tea repo clone <repo>` | 克隆仓库 |
| `tea repo browse` | 在浏览器中打开仓库 |

**详细参考**: `references/repositories.md`

### 问题管理 (Issues)

创建和管理问题：

| 命令 | 描述 |
|------|------|
| `tea issues` | 列出问题 |
| `tea issues --repo=<owner/repo>` | 列出指定仓库的问题 |
| `tea issue create --title="标题"` | 创建问题 |
| `tea issue create --title="标题" --body="内容"` | 创建带内容的问题 |
| `tea issue <index>` | 查看问题详情 |
| `tea issue edit <index> --state=closed` | 关闭问题 |
| `tea issue edit <index> --state=open` | 重新打开问题 |

**详细参考**: `references/issues.md`

### Pull Requests

创建和管理 Pull Requests：

| 命令 | 描述 |
|------|------|
| `tea pulls` | 列出 Pull Requests |
| `tea pulls --repo=<owner/repo>` | 列出指定仓库的 PR |
| `tea pr create --title="标题"` | 创建 PR |
| `tea pr create --head=feature --base=main` | 从 feature 分支创建 PR 到 main |
| `tea pr <index>` | 查看 PR 详情 |
| `tea pr merge <index>` | 合并 PR |
| `tea pr close <index>` | 关闭 PR |

**详细参考**: `references/pull-requests.md`

### 时间线 (Timeline)

查看操作历史和时间线：

| 命令 | 描述 |
|------|------|
| `tea timeline` | 查看当前仓库的时间线 |
| `tea timeline --repo=<owner/repo>` | 查看指定仓库的时间线 |
| `tea timeline --issue-type` | 查看问题类型时间线 |
| `tea timeline --comments` | 包含评论的时间线 |

**详细参考**: `references/timeline.md`

### 里程碑 (Milestones)

管理项目里程碑：

| 命令 | 描述 |
|------|------|
| `tea milestones` | 列出里程碑 |
| `tea milestones --repo=<owner/repo>` | 列出指定仓库的里程碑 |
| `tea milestone create --title="v1.0"` | 创建里程碑 |
| `tea milestone delete <id>` | 删除里程碑 |

**详细参考**: `references/milestones.md`

### 标签 (Labels)

管理问题标签：

| 命令 | 描述 |
|------|------|
| `tea labels` | 列出标签 |
| `tea labels --repo=<owner/repo>` | 列出指定仓库的标签 |
| `tea label create --name="bug" --color=#ff0000` | 创建标签 |
| `tea label delete <id>` | 删除标签 |

**详细参考**: `references/labels.md`

### 分支操作 (Branches)

管理仓库分支：

| 命令 | 描述 |
|------|------|
| `tea branches` | 列出分支 |
| `tea branches --repo=<owner/repo>` | 列出指定仓库的分支 |
| `tea branch create --name=feature` | 创建分支 |

**详细参考**: `references/branches.md`

### 组织和用户 (Organizations & Users)

管理组织和查看用户信息：

| 命令 | 描述 |
|------|------|
| `tea organizations` | 列出组织 |
| `tea org create --name=<name>` | 创建组织 |
| `tea user <username>` | 查看用户信息 |
| `tea users` | 列出用户 |

**详细参考**: `references/organizations.md`

### 通知 (Notifications)

查看和管理通知：

| 命令 | 描述 |
|------|------|
| `tea notifications` | 列出通知 |
| `tea notifications --read` | 包含已读通知 |
| `tea notifications --types=<types>` | 按类型过滤 |
| `tea notification read <id>` | 标记为已读 |
| `tea notification purge` | 清除所有通知 |

**详细参考**: `references/notifications.md`

### 发布版本 (Releases)

管理项目发布：

| 命令 | 描述 |
|------|------|
| `tea releases` | 列出发布版本 |
| `tea releases --repo=<owner/repo>` | 列出指定仓库的发布 |
| `tea release create --tag=v1.0 --title="Version 1.0"` | 创建发布版本 |

**详细参考**: `references/releases.md`

### 仓库操作 (Actions)

管理仓库操作（如 Actions/CI）：

| 命令 | 描述 |
|------|------|
| `tea actions` | 列出仓库操作 |
| `tea actions --repo=<owner/repo>` | 列出指定仓库的操作 |
| `tea action <index>` | 查看操作详情 |

**详细参考**: `references/actions.md`

### 任务和运行 (Tasks & Runs)

管理 CI/CD 任务：

| 命令 | 描述 |
|------|------|
| `tea tasks` | 列出任务 |
| `tea tasks --repo=<owner/repo>` | 列出指定仓库的任务 |
| `tea task <index>` | 查看任务详情 |
| `tea runs` | 列出运行记录 |
| `tea run <index>` | 查看运行详情 |

**详细参考**: `references/tasks.md`

### 通用参数

| 参数 | 描述 |
|------|------|
| `--login, -l` | 指定登录名称 |
| `--repo, -r` | 指定仓库（格式：owner/repo） |
| `--output, -o` | 输出格式（simple/table/csv/tsv/json） |
| `--help, -h` | 显示帮助信息 |
| `--version, -v` | 显示版本信息 |

### 全局标志

| 标志 | 描述 |
|------|------|
| `--verbose` | 显示详细输出 |
| `--debug` | 启用调试模式 |
| `--quiet, -q` | 静默模式 |

## 使用示例

```bash
# 添加登录
tea login add --name=company --url=https://git.company.com --token=xxx

# 列出所有仓库
tea repos

# 创建新问题
tea issue create --title="Bug: 登录失败" --body="无法登录系统"

# 列出开放的 PR
tea pulls --state=open

# 创建 PR
tea pr create --title="新功能" --head=feature-branch --base=main

# 查看时间线
tea timeline --repo=owner/project

# 查看通知
tea notifications --state=pinned

# 创建发布版本
tea release create --tag=v1.0.0 --title="首次发布" --note="更新内容"

# 列出里程碑
tea milestones --state=open

# 查看操作
tea actions --repo=owner/ci-project
```

## 配置文件

配置文件位置：`~/.config/tea/config.yml`

```yaml
logins:
  - name: default
    url: https://gitea.com
    token: your_token_here
    ssh_key: ~/.ssh/id_rsa
  - name: company
    url: https://git.company.com
    token: company_token_here
defaults:
  login: default
  output: simple
```

## Shell 自动补全

生成 Shell 自动补全脚本：

```bash
# Bash
tea completion bash > /etc/bash_completion.d/tea

# Zsh
tea completion zsh > /usr/share/zsh/vendor-completions/_tea

# Fish
tea completion fish > ~/.config/fish/completions/tea.fish

# PowerShell
tea completion powershell | Out-File -FilePath ~/tea.ps1
```

## Man 页面

生成 man 页面：

```bash
tea man > tea.1
man ./tea.1
```

## 高级用法

### 在脚本中使用

```bash
#!/bin/bash
# 自动创建问题脚本

REPO="owner/project"
TITLE="自动化问题 $(date)"
BODY="由脚本创建的问题"

tea issue create --repo=$REPO --title="$TITLE" --body="$BODY"
```

### JSON 输出处理

```bash
# 获取问题列表并解析 JSON
tea issues --output=json | jq '.[] | select(.state=="open")'

# 统计开放 PR 数量
tea pulls --output=json | jq 'length'
```

### 多实例管理

```bash
# 个人账号操作
tea repos --login=personal

# 公司账号操作
tea repos --login=company

# 设置默认实例
tea login set-default company
```

## 故障排除

| 问题 | 解决方案 |
|------|---------|
| 认证失败 | 检查令牌权限，确保有足够的 scope |
| 连接超时 | 检查 URL 是否正确，确认网络连接 |
| SSH 密钥问题 | 使用 `tea login add` 配置 SSH 密钥路径 |
| 仓库未找到 | 确认仓库格式为 `owner/repo` |

## 参考资料

- 官方文档: https://docs.gitea.com/usage/tea
- 源代码: https://gitea.com/gitea/tea
- 问题反馈: https://gitea.com/gitea/tea/issues
