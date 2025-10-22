# 使用 Surge.sh 部署概率分布应用

本指南提供了一个简单的替代方案，帮助您在没有Git环境的情况下将应用部署到网上供他人访问。Surge.sh 是一个非常简单的静态网站部署服务，只需几个命令即可完成部署。

## 前提条件

- 已安装 Node.js 和 npm（您已经有这个环境，因为您能运行 npm 命令）
- 已构建的项目（我们将在下面的步骤中完成）

## 步骤 1：安装 Surge CLI

首先，全局安装 Surge 命令行工具：

```bash
npm install --global surge
```

## 步骤 2：构建您的项目

确保您在项目目录中，然后运行构建命令：

```bash
npm run build
```

这个命令会在 `dist` 目录中生成可部署的静态文件。

## 步骤 3：部署到 Surge

构建完成后，使用以下命令部署您的应用：

```bash
surge dist
```

首次运行时，Surge 会要求您创建一个账户（只需提供邮箱和密码）。

## 步骤 4：自定义域名（可选）

默认情况下，Surge 会为您生成一个随机域名。如果您想要一个特定的子域名，可以在部署时指定：

```bash
surge dist your-custom-name.surge.sh
```

## 步骤 5：分享您的应用

部署完成后，Surge 会提供一个 URL，您可以将此 URL 分享给他人，他们就可以访问您的应用了！

## 更新部署

如果您对应用进行了修改，只需重新构建并部署：

```bash
npm run build
surge dist
```

## 查看已部署的项目

要查看您通过 Surge 部署的所有项目，可以运行：

```bash
surge list
```

## 移除已部署的项目

如果您需要移除某个部署，可以使用：

```bash
surge teardown your-project-name.surge.sh
```

## 注意事项

- Surge 提供的是静态网站托管，不支持服务器端功能
- 免费版的 Surge 会在页面底部显示一个小徽章
- 如果您有 API 调用，需要确保 API 支持跨域请求（CORS）

## 故障排除

如果遇到部署问题：
1. 确保 `dist` 目录已正确生成
2. 检查控制台输出的错误信息
3. 确认您的项目构建正确，可以使用 `npm run preview` 本地预览

祝您部署顺利！