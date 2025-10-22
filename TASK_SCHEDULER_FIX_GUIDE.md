# Windows任务计划程序设置故障排除指南

## 问题分析
您在设置Windows任务计划程序时遇到了「一个或多个指定的参数无效」的错误。这通常是由以下原因导致的：

1. 文件路径中包含中文或特殊字符
2. 任务配置参数不正确
3. 权限设置问题
4. 路径格式错误

## 解决方案

### 方法一：使用英文路径创建批处理文件副本

1. 在C盘根目录创建一个简单的批处理文件：
   - 打开记事本
   - 输入以下内容：
     ```batch
     @echo off
     cd /d "e:\电脑资料\Desktop\AIE\probability-distribution-app"
     backup_to_github.bat
     ```
   - 另存为：`C:\backup_app.bat`（确保使用英文路径和文件名）

2. 使用这个英文路径的批处理文件设置任务计划程序

### 方法二：正确设置任务计划程序的详细步骤

1. **打开任务计划程序**：
   - 按下Win+R键
   - 输入`taskschd.msc`
   - 点击「确定」

2. **创建基本任务**：
   - 点击右侧面板的「创建基本任务」
   - 输入名称（使用英文，如`BackupProbabilityApp`）
   - 点击「下一步」

3. **设置触发器**：
   - 选择「每天」
   - 点击「下一步」
   - 设置开始时间（如`20:00:00`）
   - 点击「下一步」

4. **设置操作**：
   - 选择「启动程序」
   - 点击「下一步」
   - **重要**：在「程序/脚本」字段中，输入批处理文件的完整路径
     - 例如：`C:\backup_app.bat`（使用英文路径）
     - 不要在「添加参数」字段中输入任何内容
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

### 方法三：使用PowerShell命令行创建任务（推荐）

1. **以管理员身份打开PowerShell**：
   - 右键点击开始菜单
   - 选择「Windows PowerShell（管理员）」

2. **执行以下命令创建任务**（请确保路径正确）：

   ```powershell
   # 创建任务触发器（每天20:00运行）
   $trigger = New-ScheduledTaskTrigger -Daily -At 20:00

   # 创建操作（运行批处理文件）
   $action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c C:\backup_app.bat"

   # 设置主体（使用系统权限）
   $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

   # 创建任务设置
   $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

   # 注册任务
   Register-ScheduledTask -TaskName "BackupProbabilityApp" -Trigger $trigger -Action $action -Principal $principal -Settings $settings -Description "自动备份概率分布应用代码到GitHub"
   ```

## 常见错误解决方案

### 错误1：「一个或多个指定的参数无效」
- **原因**：路径中包含中文或特殊字符
- **解决方案**：使用方法一中的英文路径中转批处理文件

### 错误2：任务创建成功但不执行
- **原因**：权限不足或路径问题
- **解决方案**：确保任务设置了「使用最高权限运行」和「无论用户是否登录都运行」

### 错误3：无法访问路径
- **原因**：用户配置文件或路径权限问题
- **解决方案**：使用系统账户（SYSTEM）运行任务，或检查文件权限

### 错误4：任务执行但备份失败
- **原因**：Git凭证问题或网络连接问题
- **解决方案**：先手动运行批处理文件测试，确保Git凭证已正确配置

## 测试任务计划程序

1. **手动运行任务**：
   - 在任务计划程序中，右键点击创建的任务
   - 选择「运行」
   - 观察是否正常执行

2. **检查任务历史记录**：
   - 在任务计划程序中，点击右侧的「显示历史记录」
   - 查看任务执行情况和可能的错误信息

按照以上方法操作，您应该能够成功创建Windows任务计划程序来定期自动备份您的代码。如果仍然遇到问题，请根据错误信息尝试不同的解决方案，或考虑使用其他自动化工具（如Power Automate）来替代任务计划程序。