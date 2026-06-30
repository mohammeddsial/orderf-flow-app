# Ensure the script runs from its own folder
Set-Location $PSScriptRoot

Write-Host "Launching all services..." -ForegroundColor Green
Write-Host "Working directory: $PSScriptRoot" -ForegroundColor Yellow
Write-Host ""

# Check if the folders exist
$folders = @(
    "apps/mobile",
    "apps/web-customer",
    "apps/web-admin",
    "apps/web-restaurant",
    "apps/api",
    "packages/database"
)

$missing = $false
foreach ($f in $folders) {
    if (-not (Test-Path $f)) {
        Write-Host "ERROR: Folder not found: $f" -ForegroundColor Red
        $missing = $true
    }
}

if ($missing) {
    Write-Host "Some folders are missing. Please check the folder names." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "All folders found. Launching terminals..." -ForegroundColor Green

# 1. Mobile (Expo) - QR code will show
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'MOBILE (Expo)'; Write-Host 'Starting MOBILE...' -ForegroundColor Cyan; cd 'apps/mobile'; npx expo start --web --port 8081"

# 2. Customer Web
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'WEB CUSTOMER'; Write-Host 'Starting WEB CUSTOMER...' -ForegroundColor Cyan; cd 'apps/web-customer'; npm run dev"

# 3. Admin Panel
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'WEB ADMIN'; Write-Host 'Starting WEB ADMIN...' -ForegroundColor Cyan; cd 'apps/web-admin'; npm run dev"

# 4. Restaurant Web
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'WEB RESTAURANT'; Write-Host 'Starting WEB RESTAURANT...' -ForegroundColor Cyan; cd 'apps/web-restaurant'; npm run dev"

# 5. API - Running server.js
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'API (server.js)'; Write-Host 'Starting API...' -ForegroundColor Cyan; cd 'apps/api'; node server.js"

# 6. Database - watch mode
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'DATABASE'; Write-Host 'Starting DATABASE...' -ForegroundColor Cyan; cd 'packages/database'; npm run build -- --watch"

Write-Host ""
Write-Host "All 6 services launched!" -ForegroundColor Green
Write-Host "Services running:" -ForegroundColor Yellow
Write-Host "  Mobile (Expo)      → http://localhost:8081" -ForegroundColor Gray
Write-Host "  Customer Web       → (check console for port)" -ForegroundColor Gray
Write-Host "  Admin Panel        → (check console for port)" -ForegroundColor Gray
Write-Host "  Restaurant Web     → (check console for port)" -ForegroundColor Gray
Write-Host "  API (server.js)    → (check console for port)" -ForegroundColor Gray
Write-Host "  Database           → watching for changes" -ForegroundColor Gray
Read-Host "Press Enter to close this launcher"