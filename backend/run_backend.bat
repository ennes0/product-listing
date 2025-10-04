@echo off
echo Installing Python dependencies...
cd /d "d:\reart\backend"
pip install -r requirements.txt

echo.
echo Starting FastAPI server...
echo Backend will be available at http://localhost:8000
echo API docs will be available at http://localhost:8000/docs
echo.

uvicorn main:app --reload --host 0.0.0.0 --port 8000