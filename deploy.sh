#!/bin/bash

echo "🚀 Starting Deployment..."

# Go to your application directory
#cd /path/to/your/app || exit

echo "📥 Pulling latest code from Git..."
git reset --hard
git add .
git commit -m 'server update'
git pull origin badge-design

echo "📦 Installing Node dependencies..."
npm install

echo "🛠 Building nuxt for production..."
npm run build