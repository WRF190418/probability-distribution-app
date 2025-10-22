@echo off
cls
echo ============================================
echo Basic GitHub Pages Fix Script
echo ============================================
pause

rem Change to script directory
cd /d "%~dp0"
echo Current directory: %cd%
pause

rem Create a simple vite config with correct base path
echo Creating vite.config.ts with correct base path...
echo import { defineConfig } from 'vite'; > vite.config.ts
echo import react from '@vitejs/plugin-react'; >> vite.config.ts
echo. >> vite.config.ts
echo // https://vitejs.dev/config/ >> vite.config.ts
echo export default defineConfig({ >> vite.config.ts
echo   base: '/probability-distribution-app/', >> vite.config.ts
echo   plugins: [react()], >> vite.config.ts
echo }); >> vite.config.ts
echo vite.config.ts created/updated
pause

rem Build and deploy
echo Building project...
npm run build
pause

echo Deploying to GitHub Pages...
npm run deploy
pause

echo ============================================
echo Process completed. Check output above for errors.
echo ============================================
pause