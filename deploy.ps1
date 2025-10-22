# PowerShell Deployment Script
Clear-Host
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "GITHUB PAGES DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Change to script directory
Write-Host "STEP 1: Changing to script directory" -ForegroundColor Green
Set-Location -Path $PSScriptRoot
Write-Host "Current directory: $(Get-Location)"

# Create backup of vite.config.ts
Write-Host "\nSTEP 2: Creating backup of vite.config.ts" -ForegroundColor Green
if (Test-Path -Path "vite.config.ts") {
    Copy-Item -Path "vite.config.ts" -Destination "vite.config.ts.backup" -Force
    Write-Host "Backup created: vite.config.ts.backup"
}

# Write correct vite.config.ts
Write-Host "\nSTEP 3: Writing correct vite.config.ts" -ForegroundColor Green
$viteConfig = @"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/probability-distribution-app/',
  plugins: [react()],
});
"@
Set-Content -Path "vite.config.ts" -Value $viteConfig
Write-Host "Configuration updated with correct base path"

# Build project
Write-Host "\nSTEP 4: Building project" -ForegroundColor Green
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed with exit code $LASTEXITCODE"
    }
    Write-Host "Build successful" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Build failed! $_" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    exit 1
}

# Deploy to GitHub Pages
Write-Host "\nSTEP 5: Deploying to GitHub Pages" -ForegroundColor Green
try {
    npm run deploy
    if ($LASTEXITCODE -ne 0) {
        throw "Deploy failed with exit code $LASTEXITCODE"
    }
    Write-Host "Deploy successful" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Deploy failed! $_" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    exit 1
}

# Deployment complete
Write-Host "\n============================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "Check your GitHub Pages site in a few minutes." -ForegroundColor White
Write-Host "URL: https://heping2007.github.io/probability-distribution-app/" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "\nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')