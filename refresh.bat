@echo off
REM Quick refresh script for Windows

echo 🔄 Pulling latest code...
git pull

echo 📦 Installing dependencies...
cd frontend
call npm install

echo ✅ All set! Starting dev server...
call npm run dev
pause
