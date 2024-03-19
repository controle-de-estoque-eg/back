@echo off
start cmd /k "docker-compose up -d && npm run dev"
start cmd /k "npx serve -s dist"
