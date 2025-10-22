# GitHub Pages 配置指南

本指南详细说明如何确保GitHub Pages已正确启用并指向gh-pages分支，解决部署后网站显示404错误的问题。

## 步骤1：访问GitHub仓库设置

1. 打开浏览器，访问您的GitHub仓库：`https://github.com/heping2007/probability-distribution-app`
2. 登录您的GitHub账号（如果尚未登录）
3. 在仓库页面上方的导航栏中，点击 `Settings` 标签

## 步骤2：导航到Pages设置

1. 在左侧边栏中，向下滚动找到 `Pages` 选项并点击
2. 此时您将看到GitHub Pages的配置页面

## 步骤3：验证和配置GitHub Pages

### 检查当前配置

在GitHub Pages设置页面中，查看以下内容：

1. **Source（源代码）** 部分：
   - 确认是否已选择一个分支作为GitHub Pages的源
   - 确认选择的分支是否为 `gh-pages`
   - 确认文件夹选择是否为 `/ (root)`

2. **Custom domain（自定义域名）** 部分（如果有配置）：
   - 确认域名配置正确

### 正确配置GitHub Pages

如果GitHub Pages未启用或配置不正确，请按照以下步骤操作：

1. **选择源分支**：
   - 在 `Source` 部分，点击下拉菜单
   - 从列表中选择 `gh-pages` 分支
   - 如果下拉菜单中没有 `gh-pages` 分支，这表明部署过程可能没有成功创建该分支

2. **选择文件夹**：
   - 确保选择 `/ (root)` 文件夹

3. **保存配置**：
   - 点击 `Save` 按钮保存更改

## 步骤4：确认gh-pages分支存在

如果在GitHub Pages设置中找不到gh-pages分支，说明部署过程可能未成功创建该分支。请按以下步骤检查和修复：

### 检查本地gh-pages分支

在您的项目目录中，打开命令提示符（CMD）并执行：

```bash
git branch
```

查看是否有gh-pages分支。如果有，请跳至步骤3。

### 检查远程gh-pages分支

执行以下命令检查远程仓库是否有gh-pages分支：

```bash
git branch -r
```

如果看到 `origin/gh-pages`，说明远程仓库已有该分支，但可能未在本地创建跟踪分支。

### 重新部署以创建gh-pages分支

如果gh-pages分支不存在，请按照以下步骤重新部署：

1. 确保您已安装gh-pages依赖：
   ```bash
   npm install --save-dev gh-pages
   ```

2. 重新运行部署命令：
   ```bash
   npm run deploy
   ```

3. 部署成功后，再次检查gh-pages分支是否已创建：
   ```bash
   git branch -r
   ```

## 步骤5：等待GitHub Pages构建完成

1. 保存GitHub Pages配置后，GitHub将开始构建您的网站
2. 构建完成后，您会在设置页面看到绿色的成功提示
3. 请注意，GitHub Pages更新可能需要**5-10分钟**才能完全生效

## 步骤6：验证网站是否可访问

1. 构建成功后，刷新GitHub Pages设置页面
2. 复制页面顶部显示的网站URL（应该是 `https://heping2007.github.io/probability-distribution-app/`）
3. 在浏览器中打开该URL，验证网站是否正常显示

## 常见问题排查

### 问题1：gh-pages分支不存在

**可能原因**：
- 部署过程中断或失败
- 认证问题导致无法创建远程分支
- gh-pages依赖未正确安装

**解决方案**：
- 确保已安装gh-pages依赖：`npm install --save-dev gh-pages`
- 使用命令提示符（CMD）以管理员身份重新运行部署命令
- 确保在部署过程中正确完成GitHub认证

### 问题2：配置正确但网站仍显示404

**可能原因**：
- GitHub Pages更新需要时间（最多10分钟）
- 浏览器缓存问题
- 构建过程失败

**解决方案**：
- 等待5-10分钟后再尝试访问
- 清除浏览器缓存或使用隐身模式
- 检查GitHub仓库中的Actions标签，查看构建是否成功

### 问题3：构建过程中出现错误

**可能原因**：
- 项目构建失败
- 资源路径错误
- 大型文件警告

**解决方案**：
- 修复构建错误：先运行 `npm run build` 确保本地构建成功
- 检查资源引用路径是否正确
- 大型JS文件警告通常不影响部署，但可以考虑优化文件大小

## 快速参考

1. **访问GitHub Pages设置**：
   - 仓库页面 → Settings → Pages

2. **正确配置**：
   - 分支：gh-pages
   - 文件夹：/(root)

3. **检查gh-pages分支**：
   ```bash
   # 检查本地分支
   git branch
   
   # 检查远程分支
   git branch -r
   ```

4. **重新部署**：
   ```bash
   npm install --save-dev gh-pages
   npm run deploy
   ```

5. **验证网站URL**：
   - `https://heping2007.github.io/probability-distribution-app/`

---

按照本指南操作后，您应该能够成功配置GitHub Pages并解决网站显示404的问题。如果问题仍然存在，请参考DEPLOYMENT_TROUBLESHOOTING_GUIDE.md文件获取更多帮助。