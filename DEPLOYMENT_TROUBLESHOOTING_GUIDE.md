# 部署故障排除指南

本指南帮助您解决在使用 `npm run deploy` 时遇到的常见问题，包括远程仓库配置错误和PowerShell执行策略限制。

## 问题分析

根据您遇到的错误信息，我们需要解决以下几个问题：

1. **远程仓库配置错误**：`error: remote origin already exists` 和 `Repository not found`
2. **PowerShell执行策略限制**：无法运行 npm 脚本

## 解决方案

### 步骤 1：修复远程仓库配置

1. **移除现有的错误远程仓库配置**：
   ```bash
   git remote remove origin
   ```

2. **添加正确的远程仓库URL**：
   ```bash
   git remote add origin https://github.com/heping2007/probability-distribution-app.git
   ```
   
   > 注意：确保URL中没有多余的符号（如`@`、反引号等）

3. **验证远程仓库配置**：
   ```bash
   git remote -v
   ```
   应该显示类似以下输出：
   ```
   origin  https://github.com/heping2007/probability-distribution-app.git (fetch)
   origin  https://github.com/heping2007/probability-distribution-app.git (push)
   ```

### 步骤 2：解决PowerShell执行策略限制

有两种方法可以解决PowerShell执行策略限制：

#### 方法 A：临时绕过执行策略（推荐）

```bash
# 使用PowerShell的ExecutionPolicy参数临时绕过限制
powershell -ExecutionPolicy Bypass -Command "npm run deploy"
```

#### 方法 B：使用命令提示符(CMD)代替PowerShell

1. 按下 `Win + R`，输入 `cmd`，按回车打开命令提示符
2. 在命令提示符中执行：
   ```bash
   cd e:\电脑资料\Desktop\AIE\probability-distribution-app
   npm run deploy
   ```

### 步骤 3：确保GitHub仓库存在

如果仍然遇到"Repository not found"错误，请确认：

1. 您已在GitHub上创建了名为`probability-distribution-app`的仓库
2. 您使用的是正确的GitHub用户名
3. 仓库URL格式正确：`https://github.com/用户名/仓库名.git`

## 完整的部署流程（修复后）

1. **确保项目已初始化Git**：
   ```bash
   # 如果还没有初始化Git仓库
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **修复远程仓库配置**：
   ```bash
   git remote remove origin  # 如果已经存在错误的配置
   git remote add origin https://github.com/heping2007/probability-distribution-app.git
   ```

3. **推送代码到GitHub**：
   ```bash
   # 使用命令提示符(CMD)或绕过PowerShell限制
   # CMD方式
   # 在命令提示符中执行
   git push -u origin master
   ```

4. **部署到GitHub Pages**：
   ```bash
   # 方法1：在命令提示符中执行
   npm run deploy
   
   # 方法2：在PowerShell中临时绕过执行策略
   powershell -ExecutionPolicy Bypass -Command "npm run deploy"
   ```

## 常见问题解决

### 问题 1：推送时需要认证

如果推送时要求输入用户名和密码，而您使用的是较新版本的Git，GitHub可能要求使用个人访问令牌而不是密码。

**解决方案**：
1. 创建个人访问令牌：
   - 登录GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - 选择适当的权限（至少选择`repo`权限）
   - 生成并复制令牌
2. 推送时：
   - 用户名输入您的GitHub用户名（heping2007）
   - 密码输入生成的个人访问令牌

### 问题 2：npm run deploy 执行失败

**可能原因**：gh-pages包未正确安装

**解决方案**：
```bash
# 在命令提示符中执行
npm install --save-dev gh-pages
```

### 问题 3：PowerShell执行策略永久修改（可选）

如果您经常使用PowerShell运行脚本，可以考虑永久修改执行策略：

1. 以管理员身份打开PowerShell
2. 执行：
   ```powershell
   Set-ExecutionPolicy RemoteSigned
   ```
3. 按照提示确认更改

> 注意：修改执行策略可能会带来安全风险，请谨慎操作。

## 快速参考命令

以下是解决问题所需的关键命令汇总：

```bash
# 移除错误的远程仓库配置
git remote remove origin

# 添加正确的远程仓库配置
git remote add origin https://github.com/heping2007/probability-distribution-app.git

# 验证远程仓库配置
git remote -v

# 临时绕过PowerShell执行策略运行npm脚本
powershell -ExecutionPolicy Bypass -Command "npm run deploy"

# 在命令提示符中运行npm脚本
npm run deploy
```

---

按照本指南操作后，您应该能够成功解决部署过程中遇到的问题，并顺利将应用部署到GitHub Pages。