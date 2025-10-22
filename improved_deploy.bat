@echo off

REM Improved Deployment Script with Directory Protection
REM This script ensures it always runs in the correct project directory

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"

REM Change to the script's directory to ensure we're in the right place
cd /d "%SCRIPT_DIR%"

echo Current working directory: %CD%
echo.

cls
echo ================================================================================
echo PROBABILITY DISTRIBUTION APP - IMPROVED DEPLOYMENT SCRIPT
echo ================================================================================
echo.

REM Step 1: Fix remote repository configuration
echo STEP 1: FIXING REMOTE REPOSITORY CONFIGURATION...
echo.

REM Run git commands and check each one
cmd /c "git remote remove origin 2>nul || echo Remote origin not found, creating new one..."
cmd /c "git remote add origin https://github.com/heping2007/probability-distribution-app.git"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to add remote repository!
    echo Please make sure you have Git installed and in PATH.
    echo Check if the repository path is correct.
    goto ERROR_EXIT
)

echo Remote repository configured:
cmd /c "git remote -v"
if %ERRORLEVEL% neq 0 (
    echo WARNING: Could not display remote info, but remote was added.
)
echo.

REM Step 2: Initialize git repository if not exists
if not exist .git (
    echo STEP 2: INITIALIZING GIT REPOSITORY...
    cmd /c "git init"
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to initialize git repository!
        goto ERROR_EXIT
    )
    
    cmd /c "git add ."
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to add files to git!
        goto ERROR_EXIT
    )
    
    cmd /c "git commit -m \"Initial commit for deployment\""
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to create initial commit!
        goto ERROR_EXIT
    )
    echo.
)

REM Step 3: Install gh-pages dependency
echo STEP 3: INSTALLING GH-PAGES DEPENDENCY...
echo.

REM Bypass PowerShell execution policy by using cmd directly
cmd /c "npm install --save-dev gh-pages"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install gh-pages dependency!
    echo Please make sure Node.js and npm are properly installed and accessible.
    goto ERROR_EXIT
)
echo.

REM Step 4: Build the project first to ensure it's working
echo STEP 4: BUILDING THE PROJECT...
echo.

cmd /c "npm run build"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Project build failed!
    echo Please check the build errors above.
    goto ERROR_EXIT
)
echo.

REM Step 5: Deploy to GitHub Pages
echo STEP 5: DEPLOYING TO GITHUB PAGES...
echo.

cmd /c "npm run deploy"
if %ERRORLEVEL% neq 0 (
    echo.
    echo ================================================================================
    echo DEPLOYMENT FAILED!
    echo Please check the error messages above.
    echo Try running each command manually in Command Prompt (not PowerShell).
    echo ================================================================================
    goto END
) else (
    echo.
    echo ================================================================================
    echo DEPLOYMENT SUCCESSFUL!
    echo Your app should be available at:
    echo https://heping2007.github.io/probability-distribution-app/
    echo Note: It may take a few minutes for GitHub Pages to update.
    echo ================================================================================
)

goto END

:ERROR_EXIT
echo.
echo ================================================================================
echo CRITICAL ERROR OCCURRED DURING DEPLOYMENT PREPARATION!
echo Please fix the issue and try again.
echo ================================================================================

:END
echo.
echo Press any key to exit...
pause >nul