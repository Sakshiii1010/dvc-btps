@echo off
title DVC BTPS - Starting Project

echo ================================================
echo   DVC BTPS Quarter Allotment System
echo   Starting Backend and Frontend...
echo ================================================
echo.

REM --- Start Flask Backend ---
echo [1/2] Starting Flask Backend on http://localhost:5000
cd /d "%~dp0backend"
if not exist "venv\Scripts\activate.bat" (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
start "DVC-Backend" cmd /k "venv\Scripts\activate && python app.py"

timeout /t 3 /nobreak >nul

REM --- Start React Frontend ---
echo [2/2] Starting React Frontend on http://localhost:3000
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Installing Node dependencies (first time only)...
    npm install
)
start "DVC-Frontend" cmd /k "npm start"

echo.
echo ================================================
echo   Both servers are starting!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   Admin Login: admin / Admin@1234
echo   Employee:    EMP001 / Employee@1234
echo ================================================
pause
