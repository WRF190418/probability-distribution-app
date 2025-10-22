@echo off
cls
echo ============================================
echo STARTING POWERSHELL DEPLOYMENT SCRIPT
echo ============================================

rem Run PowerShell script with Bypass execution policy
powershell.exe -ExecutionPolicy Bypass -File "%~dp0\deploy.ps1"

rem Pause after script completes
echo.
echo Deployment script finished.
echo Press any key to exit...
pause > nul