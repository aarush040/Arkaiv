@echo off
setlocal
cd /d C:\Users\lenovo\Desktop\rishiiiii
set PORT=3000
set DISABLE_VITE=true
set NODE_ENV=development
echo [wrapper] Starting backend on port 3000 with DISABLE_VITE=true...
npx tsx backend/src/server.ts
endlocal
