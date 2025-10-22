# Git安装和GitHub Pages部署指南

## 步骤1：安装Git

1. 访问Git官方下载页面：https://git-scm.com/downloads/win
2. 下载适合您Windows系统的安装程序（通常是64位版本）
3. 运行安装程序，按照以下步骤操作：
   - 选择默认组件（全部勾选）
   - 选择文本编辑器（推荐使用默认的Vim或选择您熟悉的编辑器）
   - 选择"Use Git from Git Bash only"或"Use Git and optional Unix tools from the Command Prompt"（推荐后者）
   - 选择默认的SSL/TLS库
   - 选择行尾转换（保持默认设置）
   - 选择终端模拟器（推荐使用MinTTY）
   - 保持其他设置为默认值，完成安装

4. 安装完成后，重启PowerShell或命令提示符

5. 验证Git是否安装成功：
   ```bash
   git --version
   ```
   如果显示Git版本号，则表示安装成功

## 步骤2：配置Git

1. 设置您的用户名和邮箱（这将用于GitHub提交记录）：
   ```bash
   git config --global user.name "您的GitHub用户名"
   git config --global user.email "您的GitHub邮箱"
   ```

2. （可选但推荐）配置Git使用凭证管理器，这样就不需要每次都输入密码：
   ```bash
   git config --global credential.helper manager
   ```

## 步骤3：创建GitHub仓库

1. 登录您的GitHub账号（如果没有账号，请先注册：https://github.com/join）
2. 点击右上角的「+」图标，选择「New repository」
3. 填写以下信息：
   - Repository name: `probability-distribution-app`
   - Description: （可选）填写项目描述
   - Visibility: 选择「Public」（公开仓库）
   - 不要勾选「Add a README file」（因为我们已经有了）
4. 点击「Create repository」创建仓库

5. 创建成功后，复制仓库的HTTPS URL（类似于：https://github.com/您的用户名/probability-distribution-app.git）

## 步骤4：初始化本地Git仓库并关联GitHub

在项目目录下执行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件到暂存区
git add .

# 提交文件
git commit -m "Initial commit"

# 关联到GitHub仓库（替换为您的仓库URL）
git remote add origin https://github.com/您的用户名/probability-distribution-app.git

# 推送到GitHub仓库
git push -u origin master
```

首次推送时，会提示您输入GitHub的用户名和密码（或个人访问令牌）。

## 步骤5：部署到GitHub Pages

```bash
# 运行部署命令（这将自动构建应用并部署到GitHub Pages）
npm run deploy
```

部署完成后，您可以在以下地址访问您的应用：
`https://您的用户名.github.io/probability-distribution-app/`

## 常见问题解决

### Git命令不被识别
- 确保Git已正确安装
- 检查环境变量中是否包含Git的安装路径
- 尝试使用Git Bash而不是PowerShell

### 推送失败
- 检查GitHub仓库URL是否正确
- 确保您的GitHub账号有足够的权限
- 检查网络连接是否正常

### GitHub Pages不显示内容
- 等待几分钟，有时需要时间生效
- 检查GitHub仓库的Settings > Pages部分，确认部署来源设置正确
- 确保构建过程成功完成

## 后续更新流程

当您对应用进行更改后，只需执行以下步骤更新部署：

```bash
# 添加更改
git add .

# 提交更改
git commit -m "更新描述"

# 推送到GitHub
git push

# 部署到GitHub Pages
npm run deploy
```