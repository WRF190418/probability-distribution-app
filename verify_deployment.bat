@echo off

REM GitHub Pages Deployment Verification Script
REM This script checks if the gh-pages branch exists and provides verification steps

cls
echo ================================================================================
echo PROBABILITY DISTRIBUTION APP - DEPLOYMENT VERIFICATION
echo ================================================================================
echo.

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"

REM Change to the script's directory
cd /d "%SCRIPT_DIR%"

echo Checking deployment status...
echo.

REM Check if gh-pages branch exists locally
cmd /c "git branch | findstr gh-pages"
if %ERRORLEVEL% equ 0 (
    echo ✓ gh-pages branch exists locally
) else (
    echo ✗ gh-pages branch does not exist locally
)

echo.
echo Checking if gh-pages branch exists on remote...
cmd /c "git ls-remote --heads origin gh-pages"
if %ERRORLEVEL% equ 0 (
    echo ✓ gh-pages branch exists on remote
) else (
    echo ✗ gh-pages branch does not exist on remote
    echo.    echo DEPLOYMENT INCOMPLETE: The gh-pages branch wasn't created on GitHub.
    echo.    echo Possible reasons:
    echo.    echo 1. GitHub credentials were not properly authorized during deployment
    echo 2. The deployment process was interrupted
    echo 3. There might be network issues or GitHub API limitations
)

echo.
echo ================================================================================
echo VERIFICATION SUMMARY
echo ================================================================================
echo.
echo Remote repository: https://github.com/heping2007/probability-distribution-app.git
echo Local branch: master
echo.
echo To manually verify deployment status:

echo 1. Check your GitHub repository at:

echo    https://github.com/heping2007/probability-distribution-app

echo 2. Go to 'Settings' tab, then 'Pages'

echo 3. Verify that GitHub Pages is enabled and pointing to the gh-pages branch

echo.    echo If GitHub Pages is not enabled, you may need to:
    echo.    echo a) Enable it manually in repository settings
    echo b) Re-run the deployment process with proper GitHub authentication
    echo c) Check for any GitHub API limits or network issues

echo.    echo If deployment was successful but site is not accessible yet:
    echo.    echo - GitHub Pages may take up to 10 minutes to update
    echo - Try clearing your browser cache
    echo - Verify the URL is correct: https://heping2007.github.io/probability-distribution-app/

echo.
echo Press any key to exit...
pause >nul