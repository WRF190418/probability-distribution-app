@echo off
cls
echo ============================================
echo SAFE DEPLOYMENT SCRIPT
echo ============================================

rem 使用cmd.exe显式执行命令，确保错误处理
cmd /c "
  echo STEP 1: Changing to script directory
  cd /d %~dp0
  echo Current directory: %cd%
  echo.  
  echo STEP 2: Creating backup of vite.config.ts
  if exist vite.config.ts (
    copy vite.config.ts vite.config.ts.backup
    echo Backup created: vite.config.ts.backup
  )
  echo.
  
  echo STEP 3: Writing correct vite.config.ts
  echo import { defineConfig } from 'vite'; > vite.config.ts
  echo import react from '@vitejs/plugin-react'; >> vite.config.ts
  echo. >> vite.config.ts
  echo // https://vitejs.dev/config/ >> vite.config.ts
  echo export default defineConfig({ >> vite.config.ts
  echo   base: '/probability-distribution-app/', >> vite.config.ts
  echo   plugins: [react()], >> vite.config.ts
  echo }); >> vite.config.ts
  echo Configuration updated with correct base path
  echo.
  
  echo STEP 4: Building project
  npm run build
  if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed! Check npm output above.
    exit /b 1
  )
  echo Build successful
  echo.
  
  echo STEP 5: Deploying to GitHub Pages
  npm run deploy
  if %ERRORLEVEL% neq 0 (
    echo ERROR: Deploy failed! Check npm output above.
    exit /b 1
  )
  echo Deploy successful
  echo.
  
  echo DEPLOYMENT COMPLETE!
  echo Check your GitHub Pages site in a few minutes.
  echo URL: https://heping2007.github.io/probability-distribution-app/
  echo.  
  echo Press any key to exit...
  pause > nul
"

rem 如果cmd命令失败，显示错误信息
if %ERRORLEVEL% neq 0 (
  echo.
  echo ERROR: Deployment script encountered an issue.
  echo Please check the output above for details.
  pause
)