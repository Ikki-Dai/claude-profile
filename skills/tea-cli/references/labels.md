# 标签 (Labels)

标签用于分类和组织问题和 Pull Requests。

## 列出标签

```bash
# 列出当前仓库的标签
tea labels

# 列出指定仓库的标签
tea labels --repo=owner/project

# 按名称搜索
tea labels --search="bug"

# 限制输出数量
tea labels --limit=50

# 指定登录实例
tea labels --login=company
```

## 查看标签

```bash
# 查看标签详情
tea label 1

# 查看指定仓库的标签
tea label 1 --repo=owner/project

# 以 JSON 格式输出
tea label 1 --output=json
```

## 创建标签

```bash
# 基本创建（自动生成颜色）
tea label create --name="bug"

# 创建带颜色和描述的标签
tea label create --name="bug" --color="#FF0000" --description="Bug report"

# 创建多个标签
tea label create --name="enhancement" --color="#84b6eb"
tea label create --name="question" --color="#d876e3"
tea label create --name="documentation" --color="#0075ca"

# 使用十六进制颜色
tea label create --name="critical" --color="#ff0000"

# 使用 RGB 颜色
tea label create --name="important" --color="255,0,0"
```

## 编辑标签

```bash
# 修改名称
tea label edit 1 --name="bug-report"

# 修改颜色
tea label edit 1 --color="#FF0000"

# 修改描述
tea label edit 1 --description="Critical bug that needs immediate attention"

# 修改所有属性
tea label edit 1 \
  --name="critical-bug" \
  --color="#FF0000" \
  --description="Critical bug requiring immediate fix"
```

## 删除标签

```bash
# 删除标签
tea label delete 1

# 删除指定仓库的标签
tea label delete 1 --repo=owner/project
```

## 标签颜色参考

常用颜色方案：

| 类型 | 颜色代码 | 十六进制 |
|------|----------|----------|
| 红色 | `#FF0000` | `255,0,0` |
| 绿色 | `#00FF00` | `0,255,0` |
| 蓝色 | `#0000FF` | `0,0,255` |
| 黄色 | `#FFFF00` | `255,255,0` |
| 橙色 | `#FFA500` | `255,165,0` |
| 紫色 | `#800080` | `128,0,128` |
| 灰色 | `#808080` | `128,128,128` |

## 常用标签模板

```bash
# Bug 相关
tea label create --name="bug" --color="#d73a4a" --description="Something isn't working"
tea label create --name="critical" --color="#FF0000" --description="Critical bug"
tea label create --name="minor" --color="#FF6600" --description="Minor bug"

# 功能请求
tea label create --name="enhancement" --color="#a2eeef" --description="New feature or request"
tea label create --name="feature" --color="#7057ff" --description="Feature request"

# 优先级
tea label create --name="priority:high" --color="#b60205" --description="High priority"
tea label create --name="priority:medium" --color="#ffff00" --description="Medium priority"
tea label create --name="priority:low" --color="#0e8a16" --description="Low priority"

# 状态
tea label create --name="status:in-progress" --color="#fbca04" --description="Currently being worked on"
tea label create --name="status:ready" --color="#009800" --description="Ready for review"
tea label create --name="status:blocked" --color="#e11d21" --description="Blocked by something"

# 类型
tea label create --name="documentation" --color="#0075ca" --description="Improvements or additions to documentation"
tea label create --name="question" --color="#008672" --description="Further information is requested"
tea label create --name="wontfix" --color="#ffffff" --description="This will not be worked on"
tea label create --name="duplicate" --color="#cfd3d7" --description="This issue or pull request already exists"

# 审查
tea label create --name="needs-review" --color="#fbca04" --description="Needs review"
tea label create --name="approved" --color="#009800" --description="Approved"
tea label create --name="changes-requested" --color="#e11d21" --description="Changes requested"
```

## 示例场景

```bash
# 创建完整的标签系统
tea label create --name="bug" --color="#d73a4a" --description="Bug report"
tea label create --name="feature" --color="#a2eeef" --description="Feature request"
tea label create --name="documentation" --color="#0075ca" --description="Documentation"
tea label create --name="help wanted" --color="#008672" --description="Help wanted"

# 为问题添加标签
tea issue create --title="Bug" --labels=bug,critical

# 批量更新标签
tea issue edit 123 --add-label=bug,priority:high
tea issue edit 123 --remove-label=wontfix

# 按标签过滤问题
tea issues --labels=bug
tea issues --labels=feature,needs-review

# 查看标签使用统计
tea labels --output=json | jq '.[] | {name: .name, issues: .num_issues}'
```

## 标签命名约定

```bash
# 使用前缀进行分类
tea label create --name="type:bug"
tea label create --name="type:feature"
tea label create --name="priority:high"
tea label create --name="priority:low"
tea label create --name="status:todo"
tea label create --name="status:done"

# 使用 emoji（如果 Gitea 支持）
tea label create --name="🐛 bug"
tea label create --name="✨ feature"
tea label create --name="📝 documentation"
```
