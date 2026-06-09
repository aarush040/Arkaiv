@echo off
setlocal
cd /d C:\Users\lenovo\Desktop\rishiiiii
set NODE_ENV=development
echo [wrapper] Starting Vite frontend on port 5173...
npx vite --port 5173 --strictPort
endlocal
