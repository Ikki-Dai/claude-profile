# Vault Management - 笔记库管理参考

## 命令列表

### obsidian vault
显示当前笔记库的信息。

```bash
obsidian vault

# 输出示例：
# 笔记库：我的知识库
# 路径：C:\Users\Name\Documents\MyVault
# 文件数：1,234
# 文件夹数：45
```

### obsidian vaults
列出所有已知的笔记库。

```bash
obsidian vaults

# 输出示例：
# - 我的个人库 (C:\Users\Name\Personal)
# - 工作项目 (C:\Users\Name\Work)
# - 学习笔记 (C:\Users\Name\Learning)
```

### obsidian files
列出笔记库中的所有文件。

```bash
# 列出所有文件
obsidian files

# 列出指定文件夹的文件
obsidian files folder="Projects"

# 仅列出 Markdown 文件
obsidian files --markdown-only

# 显示文件大小
obsidian files --size

# 按修改时间排序
obsidian files --sort=modified

# 限制返回数量
obsidian files --limit=50
```

### obsidian folders
列出笔记库中的所有文件夹。

```bash
# 列出所有文件夹
obsidian folders

# 显示文件夹大小
obsidian folders --size

# 显示文件夹中的文件数
obsidian folders --count
```

## 指定笔记库

### 使用 vault 参数
```bash
# 为命令指定特定笔记库
obsidian search vault="工作笔记" query="项目"
obsidian files vault="个人笔记" folder="日记"
```

### 工作目录默认
如果终端当前目录是笔记库文件夹，将自动使用该笔记库：

```bash
# 在笔记库文件夹中执行
cd ~/Documents/MyVault
obsidian files  # 自动使用 MyVault
```

## 文件操作

### 文件列表过滤
```bash
# 按文件夹过滤
obsidian files folder="Projects"

# 按文件名过滤
obsidian files filter="会议"

# 组合过滤
obsidian files folder="Projects" filter="计划"
```

### 文件排序
```bash
# 按名称排序（默认）
obsidian files --sort=name

# 按修改时间排序
obsidian files --sort=modified

# 按创建时间排序
obsidian files --sort=created

# 按大小排序
obsidian files --sort=size

# 反向排序
obsidian files --sort=modified --reverse
```

## 文件夹操作

### 文件夹信息
```bash
# 列出文件夹及其统计
obsidian folders --stats

# 输出示例：
# Projects/ (23 个文件, 1.2 MB)
# Archive/ (156 个文件, 3.4 MB)
# Templates/ (8 个文件, 45 KB)
```

### 创建文件夹
```bash
# 创建文件夹（通过创建文件自动创建）
obsidian create name="新建文件夹/笔记名称" content="..."
```

### 文件夹维护
```bash
# 查找空文件夹
obsidian folders --empty

# 查找大文件夹
obsidian folders --sort=size
```

## 常用标志

### 文件列表标志
| 标志 | 描述 | 示例 |
|------|------|------|
| `--markdown-only` | 仅列出 Markdown 文件 | `obsidian files --markdown-only` |
| `--size` | 显示文件大小 | `obsidian files --size` |
| `--sort=name\|modified\|created\|size` | 排序方式 | `obsidian files --sort=modified` |
| `--reverse` | 反向排序 | `obsidian files --sort=size --reverse` |
| `--limit=N` | 限制返回数量 | `obsidian files --limit=20` |
| `--copy` | 复制到剪贴板 | `obsidian files --copy` |

### 文件夹列表标志
| 标志 | 描述 | 示例 |
|------|------|------|
| `--size` | 显示文件夹大小 | `obsidian folders --size` |
| `--count` | 显示文件数量 | `obsidian folders --count` |
| `--empty` | 仅显示空文件夹 | `obsidian folders --empty` |

## 使用场景

### 笔记库统计
```bash
# 获取笔记库概览
obsidian vault

# 统计文件数量
obsidian files | wc -l

# 查看文件夹分布
obsidian folders --count
```

### 查找大文件
```bash
# 按大小排序查看文件
obsidian files --size --sort=size --reverse | head -20
```

### 查找最近修改的文件
```bash
# 查看最近修改的文件
obsidian files --sort=modified --reverse | head -10
```

### 笔记库清理
```bash
# 查找空文件夹
obsidian folders --empty

# 列出 Archive 文件夹内容
obsidian files folder="Archive"
```

### 多笔记库操作
```bash
# 在不同笔记库中搜索
obsidian search vault="个人笔记" query="日记"
obsidian search vault="工作笔记" query="项目"

# 列出其他笔记库的文件
obsidian files vault="学习笔记"
```

## 维护工作流

### 笔记库健康检查
```bash
# 1. 笔记库信息
obsidian vault

# 2. 检查文件夹结构
obsidian folders --count

# 3. 查找异常文件
obsidian files --size | grep " 0 KB"

# 4. 检查最近活动
obsidian files --sort=modified | head -20
```

### 笔记库迁移
```bash
# 1. 导出文件列表
obsidian files > vault-files-list.txt

# 2. 备份笔记库
# (使用系统工具)

# 3. 验证迁移
obsidian vault
```

### 笔记库整理
```bash
# 1. 查看文件分布
obsidian folders --count --sort=count --reverse

# 2. 找出需要整理的文件夹
obsidian files folder="Inbox"

# 3. 移动文件到正确位置
obsidian move to="Projects/项目A" file="待整理笔记"
```

## 备份建议

### 定期备份
```bash
# 1. 导出文件列表
obsidian files > backup-$(date +%Y%m%d)-files.txt

# 2. 导出文件夹结构
obsidian folders > backup-$(date +%Y%m%d)-folders.txt
```

### 验证备份
```bash
# 对比当前与备份的文件列表
diff <(obsidian files) backup-files.txt
```
