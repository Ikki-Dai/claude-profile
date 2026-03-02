# 仓库操作 (Repositories)

Tea 提供了完整的仓库管理功能。

## 列出仓库

```bash
# 列出当前用户的所有仓库
tea repos

# 列出指定用户的仓库
tea repos --owner=username

# 按类型过滤
tea repos --filter=owner    # 自己拥有的
tea repos --filter=collaborative  # 协作的

# 按模式搜索
tea repos --pattern="project*"

# 限制输出数量
tea repos --limit=10

# 指定登录实例
tea repos --login=company

# 不同输出格式
tea repos --output=simple
tea repos --output=table
tea repos --output=json
tea repos --output=csv
tea repos --output=tsv
```

## 创建仓库

```bash
# 基本创建
tea repo create --name=new-repo

# 创建私有仓库
tea repo create --name=private-repo --private

# 创建仓库并添加描述
tea repo create --name=my-project --description="My awesome project"

# 指定所有者（组织）
tea repo create --name=org-repo --owner=organization

# 创建时自动初始化
tea repo create --name=init-repo --init-readme

# 创建 Git 风格的 .gitignore
tea repo create --name=project --gitignores=Go

# 指定许可证
tea repo create --name=project --license=MIT
```

## 克隆仓库

```bash
# 克隆仓库
tea repo clone owner/repo

# 克隆到指定目录
tea repo clone owner/repo --destination=my-folder

# 克隆时指定深度
tea repo clone owner/repo --depth=1
```

## 浏览仓库

```bash
# 在浏览器中打开仓库
tea repo browse

# 打开指定仓库
tea repo browse --repo=owner/project

# 打开仓库的设置页面
tea repo browse --repo=owner/project --settings

# 打开仓库的 Actions 页面
tea repo browse --repo=owner/project --actions
```

## 仓库信息

```bash
# 显示仓库详情
tea repo show

# 显示指定仓库详情
tea repo show --repo=owner/project

# 以 JSON 格式输出
tea repo show --output=json
```

## 仓库设置

```bash
# 更新仓库描述
tea repo edit --description="New description"

# 更新仓库网站
tea repo edit --website="https://example.com"

# 设置为私有/公开
tea repo edit --private
tea repo edit --public
```

## Fork 仓库

```bash
# Fork 仓库
tea repo fork owner/repo

# Fork 到指定组织
tea repo fork owner/repo --org=organization
```

## 镜像仓库

```bash
# 镜像仓库
tea repo mirror create --url=https://github.com/user/repo.git

# 同步镜像
tea repo mirror sync
```

## 示例场景

```bash
# 快速设置新项目
tea repo create --name=my-app --description="My application" --init-readme --gitignores=Node --license=MIT && \
tea repo clone my-app && \
cd my-app

# 查找特定仓库
tea repos --pattern="cli" --output=json | jq '.[] | select(.name | contains("cli"))'
```
