@echo off
echo Starting Invoice Management System...
echo Note: Ensure MongoDB is running!

start cmd /k "cd backend && npm start"
timeout /t 5
start cmd /k "cd frontend && npm run dev"

echo Servers started! 
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
