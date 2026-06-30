Write-Host "🚀 Launching all services..." -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title '📱 MOBILE (Expo)'; Write-Host '🚀 Starting MOBILE...' -ForegroundColor Cyan; cd 'apps/mobile'; npx expo start --web --port 8081"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title '🖥️ CUSTOMER WEB'; Write-Host '🖥️ Starting CUSTOMER WEB...' -ForegroundColor Cyan; cd 'apps/customer-web'; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title '📊 ADMIN PANEL'; Write-Host '📊 Starting ADMIN PANEL...' -ForegroundColor Cyan; cd 'apps/admin'; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title '⚙️ API SERVER'; Write-Host '⚙️ Starting API...' -ForegroundColor Cyan; cd 'api'; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title '🧩 JSERVER'; Write-Host '🧩 Starting JSERVER...' -ForegroundColor Cyan; cd 'jserver'; npm run start"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title '📦 SHARED (Watch)'; Write-Host '📦 Watching SHARED package...' -ForegroundColor Cyan; cd 'packages/shared'; npm run build -- --watch"