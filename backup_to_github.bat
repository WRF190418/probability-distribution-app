@echo off

REM 概率分布应用代码自动备份脚本
REM 使用方法：双击此批处理文件运行，或通过任务计划程序定期执行

REM 设置项目路径
echo 正在设置项目路径...
cd /d "e:\电脑资料\Desktop\AIE\probability-distribution-app"

REM 检查当前目录是否为Git仓库
if not exist ".git" (
    echo 错误：当前目录不是Git仓库！
    echo 请确保您的项目已经初始化为Git仓库并关联到GitHub
    pause
    exit /b 1
)

REM 执行Git备份操作
echo 正在执行Git备份...
echo 添加所有更改...
git add .

echo 创建提交...
git commit -m "自动化备份: %date% %time%"

if %errorlevel% neq 0 (
    echo 警告：提交失败，可能没有更改需要提交
)

echo 推送到远程仓库...
git push origin master

if %errorlevel% neq 0 (
    echo 错误：推送失败！请检查网络连接和Git配置
    pause
    exit /b 1
)

echo 备份完成！时间：%date% %time%
pause