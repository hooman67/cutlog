#!/bin/bash
# CutLog - Install Script (Mac/Linux)

set -e

echo ""
echo "========================================"
echo " CutLog - Install Script"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found!"
    echo ""
    echo "Install Node.js 20+:"
    echo "  Mac:   brew install node"
    echo "  Linux: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "  Or:    https://nodejs.org/en/download"
    exit 1
fi

NODE_VER=$(node -v)
echo "[OK] Node.js found: $NODE_VER"

# Check minimum version
NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "[WARNING] Node.js 20+ recommended. You have $NODE_VER"
    echo "          The app may still work but you'll see deprecation warnings."
fi

# Install deps
echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "========================================"
echo " Setup complete!"
echo "========================================"
echo ""
echo "To start the app:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000"
echo ""
