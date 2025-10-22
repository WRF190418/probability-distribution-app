# 概率分布应用部署指南

由于无法使用GitHub Pages和Surge（需要账号认证），我们提供了几种简单的方法来部署和分享您的应用。

## 方法一：使用http-server（最简单的本地分享方式）

我们已经安装了http-server，可以用来快速启动一个静态文件服务器：

```bash
# 在项目根目录下运行
cd dist
http-server -p 8080
```

这会在8080端口启动一个服务器。然后您可以：
1. 在本地浏览器中访问：http://localhost:8080
2. 如果您的电脑在局域网内，其他设备可以通过您的IP地址访问，例如：http://192.168.x.x:8080

## 方法二：修改vite.config.ts以支持GitHub Pages部署

如果您将来想使用GitHub Pages，请确保：

1. 安装Git并创建GitHub账号
2. 创建一个名为 `probability-distribution-app` 的仓库
3. 按照GIT_INSTALLATION_AND_DEPLOYMENT_GUIDE.md中的步骤操作
4. 运行部署命令：`npm run deploy`

## 方法三：使用Netlify Drop

Netlify提供了一个非常简单的拖放部署方式：

1. 访问 https://app.netlify.com/drop
2. 将dist文件夹拖放到页面上
3. 等待部署完成
4. 获取生成的URL并分享给他人

## 方法四：使用Vercel

Vercel也是一个简单的部署选项：

1. 访问 https://vercel.com/dashboard
2. 注册/登录账号
3. 点击"New Project"，然后导入您的Git仓库（如果已上传到GitHub）
4. 或者选择"Import Project" → "From your filesystem"上传dist文件夹
5. 按照提示完成部署

## 项目已成功构建

您的项目已经成功构建，生成的文件在`dist`目录中。您可以使用上述任何方法来部署和分享您的应用。

## 查看构建结果

要确认构建文件已正确生成：

```bash
ls -la dist
```

您应该能看到index.html、assets文件夹等文件，这些都是部署所需的静态文件。

## 注意事项

- 如果您使用AI数据生成功能，确保后端服务也在运行
- 对于跨网络访问，您可能需要配置防火墙以允许相应端口的访问
- 静态部署只支持前端功能，后端API调用需要单独部署后端服务