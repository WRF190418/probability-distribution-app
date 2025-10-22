# GitHub APP 长期保存指南

本指南将帮助您设置GitHub App，实现项目的长期保存和管理，确保您的概率分布应用能够安全地存储在GitHub上。

## 什么是GitHub App

GitHub App是GitHub提供的一种高级集成方式，它允许您以更安全、更有组织的方式管理GitHub仓库。与个人访问令牌相比，GitHub App提供了更精细的权限控制和更高的安全性。

## 步骤1：创建GitHub App

1. **登录GitHub账号**：确保您已经登录GitHub账号

2. **访问GitHub开发者设置**：
   - 点击右上角头像 → Settings → Developer settings → GitHub Apps
   - 或直接访问：https://github.com/settings/developers

3. **创建新的GitHub App**：
   - 点击"New GitHub App"按钮
   - 填写以下信息：
     - GitHub App name: `probability-distribution-app-manager`
     - Homepage URL: `https://github.com/您的用户名/probability-distribution-app`
     - Webhook URL: 暂时留空或填写 `https://localhost:3000`
     - 权限设置：
       - Repository permissions:
         - Contents: Read & Write（用于管理代码）
         - Issues: Read（可选，用于问题跟踪）
         - Pull requests: Read（可选，用于代码审查）
       - Organization permissions: 保持默认
     - 订阅事件：
       - 选择 "Push" 和 "Pull request"（可选）
   - 点击"Create GitHub App"创建应用

## 步骤2：配置GitHub App

1. **生成私钥**：
   - 在新创建的GitHub App页面，找到"Private keys"部分
   - 点击"Generate a private key"按钮
   - 下载生成的私钥文件（PEM格式），并妥善保管

2. **安装GitHub App到您的账号**：
   - 点击左侧菜单中的"Install App"
   - 点击"Install"按钮
   - 选择要安装到的账号（您的个人账号）
   - 选择要访问的仓库（或选择"All repositories"）
   - 点击"Install"完成安装

## 步骤3：使用GitHub App进行长期保存

### 使用GitHub App管理代码

1. **克隆仓库**：
   ```bash
   # 确保Git已安装
   git clone https://github.com/您的用户名/probability-distribution-app.git
   cd probability-distribution-app
   ```

2. **创建并配置GitHub App认证脚本**：
   创建一个简单的脚本帮助您使用GitHub App进行认证

   ```bash
   # 创建认证脚本（Windows PowerShell脚本）
   # 注意：实际使用时需要修改为真实的App ID和私钥路径
   
   # app_auth.ps1 内容示例
   # $appId = "您的GitHub App ID"
   # $privateKeyPath = "C:\path\to\your\private-key.pem"
   # # 这里应该包含生成JWT和获取访问令牌的代码
   ```

### 自动化备份策略

1. **设置定期提交和推送**：
   创建一个批处理文件，定期将更改推送到GitHub

   ```bash
   # backup.bat 内容
   @echo off
   cd /d "e:\电脑资料\Desktop\AIE\probability-distribution-app"
   git add .
   git commit -m "Automated backup: %date% %time%"
   git push origin master
   echo Backup completed at %date% %time%
   ```

2. **使用Windows任务计划程序**：
   - 搜索并打开"任务计划程序"
   - 创建基本任务
   - 设置定期运行backup.bat脚本

## 步骤4：保护您的项目

1. **启用仓库保护规则**：
   - 进入GitHub仓库 → Settings → Branches
   - 点击"Add branch protection rule"
   - 配置规则（如需要PR审查、状态检查等）

2. **设置访问控制**：
   - 确保只有授权的GitHub App能够修改代码
   - 定期审查谁有权访问您的仓库

3. **启用安全功能**：
   - 启用Dependabot警报以获取安全更新
   - 启用代码扫描以检测潜在问题

## 步骤5：恢复策略

1. **如何从GitHub恢复项目**：
   ```bash
   # 克隆仓库到新位置
   git clone https://github.com/您的用户名/probability-distribution-app.git
   
   # 安装依赖
   cd probability-distribution-app
   npm install
   
   # 构建项目
   npm run build
   ```

2. **历史版本恢复**：
   ```bash
   # 查看提交历史
   git log
   
   # 恢复到特定版本
   git checkout <commit-hash>
   
   # 创建新分支保存该版本
   git checkout -b restored-version
   ```

## GitHub App与GitHub Pages结合

1. **保持自动部署**：
   您仍然可以使用之前配置的部署命令：
   ```bash
   npm run deploy
   ```

2. **确保GitHub App有足够权限**：
   确保您的GitHub App有gh-pages分支的读写权限

## 长期维护建议

1. **定期更新依赖**：
   ```bash
   npm update
   ```

2. **定期检查和修复问题**：
   - 运行代码检查
   - 测试核心功能
   - 修复任何安全漏洞

3. **文档更新**：
   - 保持README.md更新
   - 记录重要的变更和决策

## 故障排除

### GitHub App认证问题
- 检查私钥文件是否正确
- 确认GitHub App ID是否正确
- 验证GitHub App是否已正确安装到您的账号

### 权限不足
- 检查GitHub App的权限设置
- 确保已授予对正确仓库的访问权限

### 自动化脚本失败
- 检查脚本路径和环境变量
- 验证Git凭证是否正确配置
- 查看错误日志以确定具体问题

通过设置GitHub App进行长期保存，您的概率分布应用将获得更好的安全性、更精细的权限控制和自动化管理能力，确保项目能够长期安全地保存在GitHub上。