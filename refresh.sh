#!/bin/bash
# Quick refresh script for development

echo "🔄 Pulling latest code..."
git pull

echo "📦 Installing dependencies..."
cd frontend
npm install

echo "✅ All set! Starting dev server..."
npm run dev
