@echo off

rem 概率分布应用部署修复脚本
rem 此脚本使用命令提示符(CMD)运行，避免PowerShell执行策略限制

echo ====================================
echo 概率分布应用部署修复脚本
echo ====================================
echo.

rem 检查Git是否安装
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误：未找到Git命令。请确保Git已正确安装并添加到系统路径。
    pause
    exit /b 1
)

rem 检查npm是否安装
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误：未找到npm命令。请确保Node.js已正确安装并添加到系统路径。
    pause
    exit /b 1
)

echo 步骤1：修复远程仓库配置...
echo.

rem 移除可能存在的错误远程仓库配置
git remote remove origin 2>nul

rem 添加正确的远程仓库URL
git remote add origin https://github.com/heping2007/probability-distribution-app.git

rem 验证远程仓库配置
echo 验证远程仓库配置：
git remote -v
echo.

echo 步骤2：检查仓库是否已初始化...
echo.

rem 检查是否已初始化Git仓库
if not exist .git (
    echo 未找到Git仓库，正在初始化...
    git init
    git add .
    git commit -m "Initial commit"
    echo.
)

echo 步骤3：尝试推送代码到GitHub（可选）...
echo 注意：如果这一步失败，可能需要手动输入GitHub凭据
echo 按任意键继续，或按Ctrl+C取消此步骤...
pause >nul
echo.

git push -u origin master 2>nul || (
    echo 警告：推送失败，请手动解决认证问题。
    echo 请尝试在浏览器中登录GitHub并创建仓库，然后重新运行此脚本。
    echo.
)

echo 步骤4：安装依赖（确保gh-pages已安装）...
echo.

npm install --save-dev gh-pages

if %ERRORLEVEL% neq 0 (
    echo 警告：gh-pages安装失败。请确保网络连接正常。
    echo.
)

echo 步骤5：执行部署...
echo 注意：这一步会构建应用并部署到GitHub Pages
echo 按任意键继续...
pause >nul
echo.

npm run deploy

if %ERRORLEVEL% equ 0 (
    echo.
    echo ====================================
    echo 部署成功！
    echo 您的应用应该可以在以下地址访问：
    echo https://heping2007.github.io/probability-distribution-app/
    echo ====================================
) else (
    echo.
    echo ====================================
    echo 部署失败！
    echo 请查看上面的错误信息，并参考DEPLOYMENT_TROUBLESHOOTING_GUIDE.md进行故障排除。
    echo ====================================
)

echo.
echo 按任意键退出...
pause >nul