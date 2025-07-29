@echo off
echo Installing dependencies...
call npm install
call npm install concurrently

echo Starting servers...
call npm run dev

pause