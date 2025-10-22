# PM2 开机自启动配置指南

本指南将帮助您配置PM2进程在Windows电脑关机重启后自动启动，确保概率分布应用持续运行。

## 方法一：手动配置Windows任务计划程序（推荐）

### 步骤1：创建启动批处理文件

1. 我们已经创建了启动脚本：`start_pm2_on_boot.bat`
2. 文件位置：`e:\电脑资料\Desktop\AIE\probability-distribution-app\start_pm2_on_boot.bat`
3. 内容包含启动PM2和保存配置的命令

### 步骤2：配置Windows任务计划程序

1. **打开任务计划程序**：
   - 按下 `Win + R` 键
   - 输入 `taskschd.msc`
   - 点击「确定」

2. **创建基本任务**：
   - 点击右侧面板的「创建基本任务」
   - 输入名称：`PM2_ProbabilityDistributionApp`
   - 输入描述：`在系统启动时自动启动PM2和概率分布应用`
   - 点击「下一步」

3. **设置触发器**：
   - 选择「计算机启动时」
   - 点击「下一步」

4. **设置操作**：
   - 选择「启动程序」
   - 点击「下一步」
   - 在「程序/脚本」字段中，输入：`cmd.exe`
   - 在「添加参数」字段中，输入：`/c e:\电脑资料\Desktop\AIE\probability-distribution-app\start_pm2_on_boot.bat`
   - 点击「下一步」

5. **完成设置**：
   - 勾选「完成时打开此任务的属性对话框」
   - 点击「完成」

6. **调整高级设置**：
   - 在属性对话框中，切换到「常规」选项卡
   - 勾选「使用最高权限运行」
   - 切换到「条件」选项卡
   - 取消勾选「只有在计算机使用交流电源时才启动此任务」
   - 切换到「设置」选项卡
   - 勾选「无论用户是否登录都运行」
   - 确保勾选「使用最高权限运行」
   - 点击「确定」

## 方法二：使用PowerShell脚本配置（备用方案）

1. 以管理员身份打开PowerShell
2. 运行以下命令：

```powershell
# 创建任务触发器（系统启动时运行）
$trigger = New-ScheduledTaskTrigger -AtStartup

# 创建操作（运行批处理文件）
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c e:\电脑资料\Desktop\AIE\probability-distribution-app\start_pm2_on_boot.bat"

# 设置主体（使用系统权限）
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# 创建任务设置
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 注册任务
Register-ScheduledTask -TaskName "PM2_ProbabilityDistributionApp" -Trigger $trigger -Action $action -Principal $principal -Settings $settings -Description "在系统启动时自动启动PM2和概率分布应用"
```

## 验证配置是否成功

1. **手动测试任务**：
   - 在任务计划程序中，找到并右键点击 `PM2_ProbabilityDistributionApp` 任务
   - 选择「运行」
   - 等待几秒钟，然后运行以下命令检查PM2状态：
   ```
   pm2 status
   ```
   如果看到 `probability-app` 在运行，则表示任务执行成功

2. **重启测试**：
   - 重启计算机
   - 重启后，运行 `pm2 status` 命令检查服务是否自动启动

## 故障排除

1. **如果任务执行失败**：
   - 检查任务历史记录：在任务计划程序中，右键点击任务 → 「属性」→ 「历史记录」
   - 确保批处理文件路径正确
   - 确保Node.js和PM2已正确安装并添加到系统环境变量

2. **如果服务未启动**：
   - 手动运行批处理文件测试：双击 `start_pm2_on_boot.bat`
   - 检查错误信息并修复问题

## 其他PM2持久化选项

1. **PM2内置的save功能**：
   ```
   pm2 save
   ```
   这将保存当前PM2进程列表，但在Windows上需要配合任务计划程序才能实现真正的开机自启动

2. **创建桌面快捷方式**：
   - 右键点击 `start_pm2_on_boot.bat`
   - 选择「发送到」→ 「桌面快捷方式」
   - 将快捷方式移动到启动文件夹：
     - 按下 `Win + R`
     - 输入 `shell:startup`
     - 点击「确定」
     - 将快捷方式粘贴到打开的文件夹中

通过以上配置，您的PM2进程将在电脑关机重启后自动运行，确保概率分布应用持续可用。