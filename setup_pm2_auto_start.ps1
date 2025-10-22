# PowerShell脚本：设置PM2在Windows系统启动时自动运行

Write-Host "正在配置PM2开机自启动..."

# 首先检查任务是否已存在，如果存在则删除
$existingTask = Get-ScheduledTask -TaskName "PM2_ProbabilityDistributionApp" -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "删除已存在的任务..."
    Unregister-ScheduledTask -TaskName "PM2_ProbabilityDistributionApp" -Confirm:$false
}

# 创建任务触发器（系统启动时运行）
try {
    $trigger = New-ScheduledTaskTrigger -AtStartup
    Write-Host "创建触发器成功"
} catch {
    Write-Host "创建触发器失败: $_"
}

# 创建操作（运行批处理文件）- 使用英文路径的批处理文件以避免路径问题
try {
    $action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c e:\电脑资料\Desktop\AIE\probability-distribution-app\start_pm2_on_boot.bat"
    Write-Host "创建操作成功"
} catch {
    Write-Host "创建操作失败: $_"
}

# 设置主体（使用系统权限运行，确保最高权限）
try {
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    Write-Host "创建主体成功"
}

catch {
    Write-Host "创建主体失败: $_"
}

# 创建任务设置
try {
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    Write-Host "创建设置成功"
} catch {
    Write-Host "创建设置失败: $_"
}

# 注册任务
try {
    Register-ScheduledTask -TaskName "PM2_ProbabilityDistributionApp" -Trigger $trigger -Action $action -Principal $principal -Settings $settings -Description "在系统启动时自动启动PM2和概率分布应用"
    Write-Host "任务创建成功！现在PM2和概率分布应用将在系统启动时自动运行。"
    Write-Host "任务名称: PM2_ProbabilityDistributionApp"
    Write-Host "您可以在任务计划程序中查看和管理此任务。"
} catch {
    Write-Host "任务注册失败: $_"
}