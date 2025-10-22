@echo off
cls
echo ============================================
echo GitHub Pages 资源加载修复脚本
echo ============================================

rem 获取脚本所在目录并切换到该目录
cd /d "%~dp0"
echo 当前工作目录: %cd%

rem 检查gh-pages分支是否存在
echo.
echo 检查gh-pages分支状态...
git show-ref --verify --quiet refs/heads/gh-pages
if %errorlevel% neq 0 (
    echo 警告: 本地没有gh-pages分支，将创建临时分支进行检查
    git checkout -b temp-gh-pages
) else (
    git checkout gh-pages
)

rem 列出gh-pages分支的文件结构
echo.
echo gh-pages分支文件结构:
dir /b

rem 检查index.html文件是否存在
if not exist "index.html" (
    echo 错误: gh-pages分支中未找到index.html文件
    echo 可能是构建过程未正确生成文件
    goto end
)

rem 查看index.html的部分内容以检查资源路径
echo.
echo 检查index.html中的资源路径...
type index.html | findstr /i ".js .css"

rem 切换回master分支
echo.
echo 切换回master分支...
git checkout master 2>nul
if %errorlevel% neq 0 (
    git checkout main 2>nul
)

rem 检查并修改vite配置文件
echo.
echo 检查vite配置文件...
if exist "vite.config.ts" (
    echo 正在修改vite.config.ts，添加正确的base配置...
    powershell -Command "(Get-Content vite.config.ts) -replace 'base:.*?[,}]', 'base: "/probability-distribution-app/",' | Set-Content vite.config.ts"
    echo vite.config.ts已更新
) else (
    echo 未找到vite.config.ts文件
)

rem 重新安装依赖并构建
echo.
echo 重新安装依赖并构建项目...
npm install --legacy-peer-deps
echo.
echo 执行构建...
npm run build

rem 重新部署到gh-pages
echo.
echo 重新部署到GitHub Pages...
npm run deploy

echo.
echo ============================================
echo 修复完成！请等待几分钟后刷新GitHub Pages页面
echo 如果问题仍然存在，请手动检查gh-pages分支中的文件结构
echo ============================================

:end
pause