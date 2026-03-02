# 发布版本 (Releases)

管理项目发布版本。

## 列出发布版本

```bash
# 列出当前仓库的发布版本
tea releases

# 列出指定仓库的发布版本
tea releases --repo=owner/project

# 按标签过滤
tea releases --tag=v1.0

# 按名称搜索
tea releases --search="1.0"

# 限制输出数量
tea releases --limit=20

# 包括草稿
tea releases --drafts
```

## 查看发布版本

```bash
# 查看发布版本详情
tea release v1.0

# 按索引查看
tea release 1

# 以 JSON 格式输出
tea release v1.0 --output=json

# 下载发布版本资产
tea release download v1.0 --asset=file.tar.gz
```

## 创建发布版本

```bash
# 基本创建
tea release create --tag=v1.0.0 --title="Version 1.0.0"

# 创建带说明的发布版本
tea release create \
  --tag=v1.0.0 \
  --title="First stable release" \
  --note="This is the first stable release of our project."

# 从文件读取说明
tea release create \
  --tag=v1.0.0 \
  --title="Version 1.0.0" \
  --note=$(cat RELEASE_NOTES.md)

# 创建草稿发布版本
tea release create \
  --tag=v1.0.0 \
  --title="Version 1.0.0" \
  --draft

# 创建预发布版本
tea release create \
  --tag=v1.0.0-beta \
  --title="Beta Release" \
  --prerelease

# 指定目标分支
tea release create \
  --tag=v1.0.0 \
  --title="Release" \
  --target=main

# 创建并附加文件
tea release create \
  --tag=v1.0.0 \
  --title="Release" \
  --asset=./build/app.tar.gz
```

## 编辑发布版本

```bash
# 修改标题
tea release edit v1.0.0 --title="Updated Title"

# 修改说明
tea release edit v1.0.0 --note="Updated release notes"

# 从文件更新说明
tea release edit v1.0.0 --note=$(cat NEW_NOTES.md)

# 发布草稿
tea release edit v1.0.0 --draft=false

# 设为预发布
tea release edit v1.0.0 --prerelease

# 取消预发布
tea release edit v1.0.0 --prerelease=false
```

## 删除发布版本

```bash
# 删除发布版本
tea release delete v1.0.0

# 删除指定仓库的发布版本
tea release delete v1.0.0 --repo=owner/project

# 确认删除
tea release delete v1.0.0 --force
```

## 发布版本资产

```bash
# 上传资产到发布版本
tea release asset create v1.0.0 --file=./build/app.tar.gz

# 上传多个资产
tea release asset create v1.0.0 --file=./build/*.tar.gz

# 列出发布版本资产
tea release assets v1.0.0

# 删除资产
tea release asset delete v1.0.0 --asset=app.tar.gz
```

## 示例场景

```bash
# 创建完整的发布版本
tea release create \
  --tag=v2.0.0 \
  --title="Version 2.0.0 - Major Update" \
  --note="## 新功能\n- 用户认证\n- 文件上传\n\n## Bug 修复\n- 修复登录问题\n\n## 破坏性变更\n- API 端点变更" \
  --prerelease=false \
  --asset=./dist/app-linux-amd64 \
  --asset=./dist/app-darwin-amd64 \
  --asset=./dist/app-windows-amd64.exe

# 从 Git 标签创建发布版本
git tag v1.0.0
git push origin v1.0.0
tea release create \
  --tag=v1.0.0 \
  --title="Version 1.0.0" \
  --note="First release"

# 创建测试版发布版本
tea release create \
  --tag=v1.0.0-beta.1 \
  --title="Beta 1" \
  --note="First beta release" \
  --draft \
  --prerelease

# 从 CHANGELOG 创建发布版本
tea release create \
  --tag=v1.2.0 \
  --title="Version 1.2.0" \
  --note=$(sed -n '/^## v1.2.0/,/^## /p' CHANGELOG.md | head -n -1)

# 查找并删除旧的草稿
tea releases --drafts --output=json | \
  jq -r '.[] | .tag_name' | \
  xargs -I {} tea release delete {} --force
```

## 版本命名约定

```bash
# 语义化版本 (Semantic Versioning)
tea release create --tag=v1.0.0
tea release create --tag=v1.1.0
tea release create --tag=v2.0.0

# 预发布版本
tea release create --tag=v1.0.0-alpha
tea release create --tag=v1.0.0-beta.1
tea release create --tag=v1.0.0-rc.1

# 日期版本
tea release create --tag=2024.01.01
tea release create --tag=2024-Q1

# 构建版本
tea release create --tag=v1.0.0+build.123
```

## 发布说明模板

```markdown
# {{ VERSION }}

## 🚀 新功能
- 功能 1
- 功能 2

## 🐛 Bug 修复
- 修复问题 #1
- 修复问题 #2

## ⚠️ 破坏性变更
- API 变更说明

## 📚 文档更新
- 更新 README
- 添加 API 文档

## 🙏 致谢
感谢所有贡献者！
```
