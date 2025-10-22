@echo off
cls
echo ============================================
echo 手动修复GitHub Pages资源路径问题
echo ============================================
echo 按任意键继续...
pause

rem 获取脚本所在目录并切换到该目录
cd /d "%~dp0"
echo 当前工作目录: %cd%
echo 按任意键继续...
pause

rem 手动修改vite配置文件
echo.
echo 修改vite.config.ts，添加正确的base配置...
powershell -Command "(Get-Content vite.config.ts) -replace 'base:.*?[,}]', 'base: "/probability-distribution-app/",' | Set-Content vite.config.ts"
echo 修改完成，请检查是否成功
echo 按任意键继续...
pause

rem 查看修改后的配置
powershell -Command "Get-Content vite.config.ts | Select-String -Pattern 'base:'"
echo 按任意键继续...
pause

rem 重新构建项目
echo.
echo 重新构建项目...
npm run build
echo 构建完成，请检查是否有错误
echo 按任意键继续...
pause

rem 部署到GitHub Pages
echo.
echo 部署到GitHub Pages...
npm run deploy
echo 部署命令已执行，请检查是否成功

:end
echo ============================================
echo 操作完成！请等待几分钟后刷新GitHub Pages页面
echo 如果出现错误，请查看上面的输出信息
echo ============================================
pause