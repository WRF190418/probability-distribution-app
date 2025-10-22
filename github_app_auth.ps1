#!/usr/bin/env pwsh

# GitHub App认证脚本 - PowerShell版本
# 用途：使用GitHub App私钥生成JWT并获取访问令牌

# 参数设置 - 用户需要根据自己的GitHub App配置修改
param(
    [string]$AppId = "YOUR_APP_ID",  # 替换为您的GitHub App ID
    [string]$PrivateKeyPath = "C:\path\to\private-key.pem",  # 替换为您的私钥文件路径
    [string]$InstallationId = "YOUR_INSTALLATION_ID"  # 替换为您的Installation ID
)

# 函数：生成JWT令牌
function Generate-Jwt {
    param(
        [string]$AppId,
        [string]$PrivateKeyPath
    )
    
    Write-Host "正在生成JWT令牌..."
    
    try {
        # 检查私钥文件是否存在
        if (-not (Test-Path $PrivateKeyPath)) {
            throw "私钥文件不存在: $PrivateKeyPath"
        }
        
        # 注意：PowerShell中生成JWT需要额外的模块支持
        # 以下是安装所需模块的提示
        Write-Host "提示：要在PowerShell中生成JWT，您可以使用JWT模块"
        Write-Host "您可以通过以下命令安装: Install-Module -Name JWT -Scope CurrentUser"
        
        # 模拟JWT生成过程说明
        Write-Host "JWT包含三部分：header.payload.signature"
        Write-Host "Header: {\"alg\": \"RS256\", \"typ\": \"JWT\"}"
        Write-Host "Payload: 包含app_id, iat(当前时间戳), exp(过期时间戳)"
        Write-Host "Signature: 使用私钥签名header和payload的组合"
        
        # 实际使用时的示例代码（需要JWT模块）
        Write-Host ""
        Write-Host "当JWT模块安装后，可以使用以下代码生成JWT:"
        Write-Host "```"
        Write-Host "Import-Module JWT"
        Write-Host "$now = [math]::Floor((Get-Date -UFormat %s))"
        Write-Host "$exp = $now + 600 # 10分钟过期"
        Write-Host "$payload = @{}"
        Write-Host "$payload.iss = $AppId"
        Write-Host "$payload.iat = $now"
        Write-Host "$payload.exp = $exp"
        Write-Host "$privateKey = Get-Content -Raw $PrivateKeyPath"
        Write-Host "$jwt = New-Jwt -Payload $payload -Algorithm RS256 -SecretKey $privateKey"
        Write-Host "Write-Host \"JWT令牌: $jwt\""
        Write-Host "```"
        
        return "模拟JWT令牌示例"  # 实际使用时返回真实的JWT
    }
    catch {
        Write-Error "生成JWT失败: $_"
        return $null
    }
}

# 函数：获取安装访问令牌
function Get-InstallationToken {
    param(
        [string]$Jwt,
        [string]$InstallationId
    )
    
    Write-Host "正在获取安装访问令牌..."
    
    try {
        # 模拟获取访问令牌的API调用
        Write-Host "使用JWT调用GitHub API: https://api.github.com/app/installations/$InstallationId/access_tokens"
        
        # 实际使用时的示例代码
        Write-Host ""
        Write-Host "实际使用时，可以使用以下代码获取访问令牌:"
        Write-Host "```"
        Write-Host "$headers = @{}"
        Write-Host "$headers.Authorization = \"Bearer $Jwt\""
        Write-Host "$headers.Accept = \"application/vnd.github+json\""
        Write-Host "$headers[\"X-GitHub-Api-Version\"] = \"2022-11-28\""
        Write-Host "$body = @{}"
        Write-Host "$response = Invoke-RestMethod -Uri \"https://api.github.com/app/installations/$InstallationId/access_tokens\" -Method Post -Headers $headers -Body ($body | ConvertTo-Json)"
        Write-Host "$accessToken = $response.token"
        Write-Host "Write-Host \"访问令牌: $accessToken\""
        Write-Host "Write-Host \"过期时间: $($response.expires_at)\""
        Write-Host "```"
        
        return "模拟访问令牌示例"  # 实际使用时返回真实的访问令牌
    }
    catch {
        Write-Error "获取访问令牌失败: $_"
        return $null
    }
}

# 函数：使用访问令牌执行Git操作
function Execute-GitOperation {
    param(
        [string]$AccessToken,
        [string]$RepoOwner,
        [string]$RepoName
    )
    
    Write-Host "执行Git操作示例..."
    
    # 提供Git命令示例
    Write-Host ""
    Write-Host "使用访问令牌克隆仓库:"
    Write-Host "git clone https://x-access-token:$AccessToken@github.com/$RepoOwner/$RepoName.git"
    
    Write-Host ""
    Write-Host "使用访问令牌推送更改:"
    Write-Host "git remote set-url origin https://x-access-token:$AccessToken@github.com/$RepoOwner/$RepoName.git"
    Write-Host "git push origin master"
}

# 主函数
function Main {
    Write-Host "===== GitHub App认证脚本 ====="
    
    # 检查必需参数
    if (-not $AppId -or $AppId -eq "YOUR_APP_ID") {
        Write-Host "请提供GitHub App ID作为参数或修改脚本中的默认值"
        Write-Host "示例: .\github_app_auth.ps1 -AppId '12345' -PrivateKeyPath 'C:\keys\private-key.pem' -InstallationId '67890'"
        return
    }
    
    if (-not $PrivateKeyPath -or $PrivateKeyPath -eq "C:\path\to\private-key.pem") {
        Write-Host "请提供私钥文件路径作为参数或修改脚本中的默认值"
        return
    }
    
    if (-not $InstallationId -or $InstallationId -eq "YOUR_INSTALLATION_ID") {
        Write-Host "请提供Installation ID作为参数或修改脚本中的默认值"
        Write-Host "获取Installation ID: https://api.github.com/app/installations (使用JWT认证)"
        return
    }
    
    # 生成JWT
    $jwt = Generate-Jwt -AppId $AppId -PrivateKeyPath $PrivateKeyPath
    if (-not $jwt) {
        Write-Error "无法生成JWT，退出"
        return
    }
    
    # 获取访问令牌
    $accessToken = Get-InstallationToken -Jwt $jwt -InstallationId $InstallationId
    if (-not $accessToken) {
        Write-Error "无法获取访问令牌，退出"
        return
    }
    
    # 显示使用说明
    Write-Host ""
    Write-Host "===== 认证完成 ====="
    Write-Host "JWT令牌(用于调试): $jwt"
    Write-Host "访问令牌(请妥善保管): $accessToken"
    Write-Host ""
    Write-Host "此脚本提供了基本的GitHub App认证流程指导。要使用此脚本，您需要:"
    Write-Host "1. 安装JWT PowerShell模块: Install-Module -Name JWT -Scope CurrentUser"
    Write-Host "2. 修改脚本中的AppId、PrivateKeyPath和InstallationId为您的实际值"
    Write-Host "3. 取消注释相关代码部分以启用实际功能"
    
    # 提示如何执行Git操作
    Execute-GitOperation -AccessToken $accessToken -RepoOwner "您的GitHub用户名" -RepoName "probability-distribution-app"
}

# 运行主函数
Main

# 保持窗口打开以便查看输出
Write-Host ""
Write-Host "按任意键继续..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')