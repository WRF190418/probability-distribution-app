@echo off
pushd %~dp0

REM 启动PM2并运行probability-app
echo 正在启动PM2和概率分布应用...
pm2 start start_server.js --name 'probability-app'

REM 保存PM2配置以便将来恢复
echo 正在保存PM2配置...
pm2 save

echo PM2启动完成！