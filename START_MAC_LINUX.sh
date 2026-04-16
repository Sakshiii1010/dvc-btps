#!/bin/bash

echo "================================================"
echo "  DVC BTPS Quarter Allotment System"
echo "  Starting Backend and Frontend..."
echo "================================================"

# Get script directory
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Backend ---
echo ""
echo "[1/2] Starting Flask Backend..."
cd "$DIR/backend"

if [ ! -d "venv" ]; then
  echo "Creating Python virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q
python app.py &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

sleep 2

# --- Frontend ---
echo ""
echo "[2/2] Starting React Frontend..."
cd "$DIR/frontend"

if [ ! -d "node_modules" ]; then
  echo "Installing Node dependencies (first time only)..."
  npm install
fi

npm start &
FRONTEND_PID=$!

echo ""
echo "================================================"
echo "  Servers running!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo "  Press Ctrl+C to stop both"
echo "================================================"

# Wait and kill both on Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
