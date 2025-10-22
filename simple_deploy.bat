@echo off

REM Simple Deployment Script
REM This script uses basic commands to avoid encoding issues

cls
echo ================================================================================
echo PROBABILITY DISTRIBUTION APP - SIMPLE DEPLOYMENT SCRIPT
echo ================================================================================
echo.

REM Step 1: Fix remote repository configuration
echo STEP 1: FIXING REMOTE REPOSITORY CONFIGURATION...
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/heping2007/probability-distribution-app.git
echo Remote repository configured:
git remote -v
echo.

REM Step 2: Initialize git repository if not exists
if not exist .git (
    echo STEP 2: INITIALIZING GIT REPOSITORY...
    git init
    git add .
    git commit -m "Initial commit"
    echo.
)

REM Step 3: Install gh-pages dependency
echo STEP 3: INSTALLING GH-PAGES DEPENDENCY...
echo.
npm install --save-dev gh-pages
echo.

REM Step 4: Deploy to GitHub Pages
echo STEP 4: DEPLOYING TO GITHUB PAGES...
echo.
npm run deploy

if errorlevel 1 (
    echo.
    echo ================================================================================
    echo DEPLOYMENT FAILED!
    echo Please check the error messages above.
    echo ================================================================================
) else (
    echo.
    echo ================================================================================
    echo DEPLOYMENT SUCCESSFUL!
    echo Your app should be available at:
    echo https://heping2007.github.io/probability-distribution-app/
    echo ================================================================================
)

echo.
echo Press any key to exit...
pause >nul