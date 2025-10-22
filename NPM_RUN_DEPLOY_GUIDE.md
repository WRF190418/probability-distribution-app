# 使用 npm run deploy 一键部署指南

本指南详细介绍如何使用项目中已配置的 `npm run deploy` 脚本将概率分布应用部署到 GitHub Pages，实现应用的云托管和24/7访问。

## 前置条件

在使用 `npm run deploy` 之前，需要完成以下准备工作：

1. **安装 Git**
   - 访问 [Git 官网](https://git-scm.com/downloads/win) 下载并安装
   - 验证安装：`git --version`

2. **创建 GitHub 账号**
   - 访问 [GitHub](https://github.com/join) 注册账号

3. **确保项目依赖已安装**
   ```bash
   npm install
   ```

## 部署步骤

### 步骤 1：配置 Git 用户信息

```bash
# 设置全局用户名
git config --global user.name "heping2007"

# 设置全局邮箱
git config --global user.email "125090180@link.cuhk.edu.cn"

# 配置凭证管理器（可选，避免每次输入密码）
git config --global credential.helper manager
```

### 步骤 2：创建 GitHub 仓库

1. 登录 GitHub，点击右上角「+」图标，选择「New repository」
2. 填写信息：
   - Repository name: `probability-distribution-app`
   - Description: （可选）概率分布应用
   - Visibility: 选择「Public」
   - 不要勾选「Add a README file」
3. 点击「Create repository」
4. 复制生成的仓库 HTTPS URL：
   - 创建仓库成功后，页面会自动跳转到新仓库页面
   - 找到页面上绿色的「Code」按钮，点击它
   - 在弹出的菜单中，确保选择「HTTPS」选项卡（通常默认选中）
   - 复制显示的URL（格式类似：`https://github.com/heping2007/probability-distribution-app.git`）
   - 如果找不到，可以在浏览器地址栏中看到仓库URL，只需在末尾添加`.git`即可

   > 提示：URL格式应该是 `https://github.com/用户名/仓库名.git`，对于您的情况应该是 `https://github.com/heping2007/probability-distribution-app.git`

### 步骤 3：初始化本地仓库并关联 GitHub

```bash
# 进入项目目录
cd e:\电脑资料\Desktop\AIE\probability-distribution-app

# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交文件
git commit -m "Initial commit"

# 关联到 GitHub 仓库（替换为您的仓库 URL）
git remote add origin https://github.com/heping2007/probability-distribution-app.git

# 推送到 GitHub 仓库
git push -u origin master
```

首次推送时，会要求输入 GitHub 用户名和密码（或个人访问令牌）。

### 步骤 4：执行一键部署

```bash
# 运行部署命令
npm run deploy
```

这个命令会自动执行以下操作：
1. 运行 `npm run build` 构建应用
2. 使用 gh-pages 包将构建产物部署到 GitHub Pages

### 步骤 5：验证部署

1. 部署完成后，访问以下 URL 查看应用：
   `https://您的用户名.github.io/probability-distribution-app/`

2. 检查 GitHub 仓库的 Pages 设置：
   - 进入仓库 → Settings → Pages
   - 确认 Source 设置为 gh-pages 分支

## 更新部署

当您对应用进行更改后，更新部署的步骤：

```bash
# 添加更改
git add .

# 提交更改
git commit -m "更新描述"

# 推送到 GitHub
git push

# 重新部署到 GitHub Pages
npm run deploy
```

## 常见问题解决

### 问题 1：npm run deploy 执行失败

**可能原因**：gh-pages 包未正确安装

**解决方案**：
```bash
# 确保 gh-pages 已安装
npm install --save-dev gh-pages
```

### 问题 2：部署成功但页面显示空白

**可能原因**：
- 基础路径配置不正确
- 构建过程有错误

**解决方案**：
- 检查 vite.config.ts 中的 base 配置
- 确认构建过程没有错误输出
- 等待几分钟后刷新页面（GitHub Pages 更新可能有延迟）

### 问题 3：推送时认证失败

**可能原因**：GitHub 不再支持密码认证

**解决方案**：
1. 创建个人访问令牌：
   - GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - 选择 repo 权限
   - 复制生成的令牌
2. 推送时，用户名输入 GitHub 用户名，密码输入个人访问令牌

## 关于 npm run deploy 脚本

项目的 package.json 中已经配置了 deploy 脚本：

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

这意味着执行 `npm run deploy` 时，会自动：
1. 先运行 `npm run build` 构建应用
2. 然后使用 gh-pages 工具将 dist 目录部署到 GitHub Pages

## 注意事项

- 首次部署可能需要几分钟时间才能在 GitHub Pages 上生效
- GitHub Pages 仅支持静态网站，如果应用有后端功能可能需要额外配置
- 确保项目的 base 配置正确，这在 vite.config.ts 文件中设置

---

按照以上步骤操作后，您的应用将成功部署到 GitHub Pages，即使您的本地电脑关机，他人也能通过生成的 URL 正常访问应用。