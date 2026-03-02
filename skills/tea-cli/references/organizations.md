# 组织和用户 (Organizations & Users)

管理组织和查看用户信息。

## 列出组织

```bash
# 列出所有组织
tea organizations

# 列出当前用户的组织
tea organizations --mine

# 搜索组织
tea organizations --search="company"

# 限制输出数量
tea organizations --limit=20
```

## 查看组织

```bash
# 查看组织详情
tea org organization-name

# 以 JSON 格式输出
tea org organization-name --output=json

# 查看组织仓库
tea org repos organization-name

# 查看组织成员
tea org members organization-name

# 查看组织团队
tea org teams organization-name
```

## 创建组织

```bash
# 基本创建
tea org create --name=new-org

# 创建带描述的组织
tea org create --name=my-org --description="My organization"

# 设置组织网站
tea org create --name=my-org --website="https://example.com"

# 设置组织位置
tea org create --name=my-org --location="Beijing, China"

# 设置组织可见性
tea org create --name=my-org --visibility=public
tea org create --name=my-org --visibility=limited
tea org create --name=my-org --visibility=private
```

## 编辑组织

```bash
# 修改组织名称
tea org edit my-org --name=new-name

# 修改描述
tea org edit my-org --description="Updated description"

# 修改网站
tea org edit my-org --website="https://newsite.com"

# 修改位置
tea org edit my-org --location="Shanghai, China"

# 修改可见性
tea org edit my-org --visibility=private
```

## 删除组织

```bash
# 删除组织
tea org delete my-org

# 确认删除
tea org delete my-org --force
```

## 组织团队

```bash
# 列出团队
tea org teams my-org

# 创建团队
tea org team create my-org --name=developers

# 团队详情
tea org team my-org developers

# 添加团队成员
tea org team add-member my-org developers username

# 移除团队成员
tea org team remove-member my-org developers username

# 删除团队
tea org team delete my-org developers
```

## 查看用户

```bash
# 查看用户信息
tea user username

# 以 JSON 格式输出
tea user username --output=json

# 查看用户仓库
tea user repos username

# 查看用户组织
tea user orgs username

# 查看用户关注者
tea user followers username

# 查看用户关注的人
tea user following username

# 查看用户星标仓库
tea user starred username
```

## 列出用户

```bash
# 列出所有用户
tea users

# 搜索用户
tea users --search="john"

# 限制输出数量
tea users --limit=50
```

## 示例场景

```bash
# 创建完整的组织
tea org create \
  --name=mycompany \
  --description="My Company Organization" \
  --website="https://mycompany.com" \
  --location="Beijing, China" \
  --visibility=public

# 创建开发团队
tea org team create mycompany --name=developers --description="Development team"
tea org team create mycompany --name=admins --description="Admin team"

# 添加团队成员
tea org team add-member mycompany developers alice
tea org team add-member mycompany developers bob

# 查看用户活动
tea user username --output=json | jq '{repos: .repo_count, followers: .followers_count}'

# 列出组织成员
tea org members my-org --output=json | jq '.[] | .username'
```

## 用户操作

```bash
# 关注用户
tea user follow username

# 取消关注
tea user unfollow username

# 查看当前用户信息
tea whoami

# 编辑当前用户信息
tea user edit --description="Updated bio"
tea user edit --website="https://mysite.com"
tea user edit --location="Shanghai"
```

## 用户设置

```bash
# 列出用户设置
tea user settings

# 修改设置
tea user set --key=theme --value=dark
tea user set --key=language --value=zh-CN
```
