@echo off
echo.
echo  ========================================
echo   CutLog - Install Script (Windows)
echo  ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js not found!
    echo.
    echo Download and install Node.js 20+ from:
    echo   https://nodejs.org/en/download
    echo.
    echo After installing, restart this script.
    pause
    exit /b 1
)

:: Check Node version
for /f "tokens=1 delims=v" %%a in ('node -v') do set NODE_VER=%%a
echo [OK] Node.js found: v%NODE_VER%

:: Install dependencies
echo.
echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm install failed
    pause
    exit /b 1
)

echo.
echo  ========================================
echo   Setup complete!
echo  ========================================
echo.
echo To start the app, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser.
echo.
pause
