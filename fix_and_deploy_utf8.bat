@echo off

REM 概率分布应用部署修复脚本 - UTF8版本
REM 此脚本使用命令提示符(CMD)运行，避免PowerShell执行策略限制

chcp 65001

echo ================================================================================
echo 概率分布应用部署修复脚本
REM 注意：此脚本用于修复GitHub Pages部署问题
echo ================================================================================
echo.

REM 检查Git是否安装
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误：未找到Git命令。请确保Git已正确安装并添加到系统路径。
    pause
    exit /b 1
)

REM 检查npm是否安装
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误：未找到npm命令。请确保Node.js已正确安装并添加到系统路径。
    pause
    exit /b 1
)

echo 步骤1：修复远程仓库配置...
echo.

REM 移除可能存在的错误远程仓库配置
git remote remove origin 2>nul

REM 添加正确的远程仓库URL
git remote add origin https://github.com/heping2007/probability-distribution-app.git

REM 验证远程仓库配置
echo 验证远程仓库配置：
git remote -v
echo.

echo 步骤2：检查仓库是否已初始化...
echo.

REM 检查是否已初始化Git仓库
if not exist .git (
    echo 未找到Git仓库，正在初始化...
    git init
    git add .
    git commit -m "Initial commit"
    echo.
)

echo 步骤3：安装gh-pages依赖...
echo.

npm install --save-dev gh-pages

if %ERRORLEVEL% neq 0 (
    echo 警告：gh-pages安装失败。请确保网络连接正常。
    echo.
)

echo 步骤4：执行部署...
echo 注意：这一步会构建应用并部署到GitHub Pages
REM 按任意键继续...
REM pause >nul
echo.

npm run deploy

if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================================================
    echo 部署成功！
    echo 您的应用应该可以在以下地址访问：
    echo https://heping2007.github.io/probability-distribution-app/
    echo ================================================================================
) else (
    echo.
    echo ================================================================================
    echo 部署失败！
    echo 请查看上面的错误信息，并参考DEPLOYMENT_TROUBLESHOOTING_GUIDE.md进行故障排除。
    echo ================================================================================
)

echo.
echo 按任意键退出...
pause >nul