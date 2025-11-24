@echo off
echo Starting Flask backend and React frontend...

REM Activate virtual environment
call venv\Scripts\activate

REM Start Flask backend in background
start "Flask Backend" python app.py

REM Start React frontend
npm run dev
