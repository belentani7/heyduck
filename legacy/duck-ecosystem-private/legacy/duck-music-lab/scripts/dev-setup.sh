#!/bin/bash
# Development environment setup

echo "🦆 DUCK Music Lab - Setup"
echo "=========================="

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env.local if doesn't exist
if [ ! -f .env.local ]; then
  cat > .env.local << 'ENVEOF'
VITE_API_URL=http://localhost:3000
VITE_ENABLE_MOCK_AUDIO=true
VITE_LOG_LEVEL=debug
ENVEOF
  echo "✓ Created .env.local"
fi

# Install git hooks
if command -v husky &> /dev/null; then
  husky install
  echo "✓ Git hooks installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  npm run dev      - Start dev server"
echo "  npm run build    - Build for production"
echo "  npm run test     - Run tests"
