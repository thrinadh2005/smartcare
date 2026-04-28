@echo off
title SmartCare Reminder - Local Launcher
echo.
echo 🚀 Starting SmartCare Reminder...
echo.

:: Check if node_modules exists in root, if not run install
if not exist "node_modules\" (
    echo 📦 Installing root dependencies...
    call npm install
)

:: Check backend
if not exist "backend\node_modules\" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

:: Check frontend
if not exist "frontend\node_modules\" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ✅ All dependencies checked!
echo 🚀 Launching Frontend and Backend...
echo.

:: Run the dev command
npm run dev

pause
