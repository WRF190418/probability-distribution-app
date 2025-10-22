# GitHub上传脚本
# 作者: WRF90418
# 功能: 自动上传概率分布应用到GitHub

Write-Host "🚀 开始上传概率分布应用到GitHub..." -ForegroundColor Green

# 检查Git状态
Write-Host "📋 检查Git状态..." -ForegroundColor Yellow
git status

# 添加所有文件
Write-Host "📁 添加所有文件到Git..." -ForegroundColor Yellow
git add .

# 提交更改
Write-Host "💾 提交更改..." -ForegroundColor Yellow
git commit -m "添加假设检验功能 - 支持t检验、Z检验、卡方检验等统计分析方法"

# 设置远程仓库
Write-Host "🔗 设置远程仓库..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/WRF90418/probability-distribution-app.git

Write-Host "📤 准备推送到GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  注意: 由于GitHub不再支持密码认证，请使用以下方法之一:" -ForegroundColor Red
Write-Host ""
Write-Host "方法1: 使用Personal Access Token" -ForegroundColor Cyan
Write-Host "1. 访问: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. 生成新的token (选择repo权限)" -ForegroundColor White
Write-Host "3. 运行: git remote set-url origin https://WRF90418:YOUR_TOKEN@github.com/WRF90418/probability-distribution-app.git" -ForegroundColor White
Write-Host "4. 运行: git push -u origin master" -ForegroundColor White
Write-Host ""
Write-Host "方法2: 使用GitHub网页界面" -ForegroundColor Cyan
Write-Host "1. 访问: https://github.com/new" -ForegroundColor White
Write-Host "2. 创建仓库: probability-distribution-app" -ForegroundColor White
Write-Host "3. 上传项目文件" -ForegroundColor White
Write-Host ""
Write-Host "方法3: 使用GitHub Desktop" -ForegroundColor Cyan
Write-Host "1. 下载GitHub Desktop" -ForegroundColor White
Write-Host "2. 登录并添加现有仓库" -ForegroundColor White
Write-Host "3. 发布到GitHub" -ForegroundColor White

Write-Host ""
Write-Host "📖 详细说明请查看: GITHUB_UPLOAD_GUIDE.md" -ForegroundColor Green
Write-Host "🎯 项目功能: 假设检验、统计分析、数据可视化" -ForegroundColor Green
Write-Host "🌐 本地访问: http://localhost:5173" -ForegroundColor Green

Read-Host "按任意键继续..."
