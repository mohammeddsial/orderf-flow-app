# Ensure the script runs from its own folder
Set-Location $PSScriptRoot

Write-Host "Launching all services..." -ForegroundColor Green
Write-Host "Working directory: $PSScriptRoot" -ForegroundColor Yellow
Write-Host ""

# Check if the folders exist
$folders = @(
    "apps/mobile",
    "apps/web-customer",
    "apps/admin",
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

# 1. MOBILE (Expo)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'MOBILE (Expo)'; Clear-Host; Write-Host 'Starting MOBILE...' -ForegroundColor White; cd 'apps/mobile'; npx expo start --web --port 8081"

# 2. WEB CUSTOMER
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'WEB CUSTOMER'; Clear-Host; Write-Host 'Starting WEB CUSTOMER...' -ForegroundColor White; cd 'apps/web-customer'; npm run dev"

# 3. ADMIN
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'ADMIN'; Clear-Host; Write-Host 'Starting ADMIN...' -ForegroundColor White; cd 'apps/admin'; npm run dev"

# 4. API (server.js)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'API (server.js)'; Clear-Host; Write-Host 'Starting API...' -ForegroundColor White; cd 'apps/api'; node server.js"

# 5. DATABASE
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'DATABASE'; Clear-Host; Write-Host 'Starting DATABASE...' -ForegroundColor White; cd 'packages/database'; npm run build -- --watch"

Write-Host ""
Write-Host "All 5 services launched!" -ForegroundColor Green
Write-Host "Services running in separate windows:" -ForegroundColor Yellow
Write-Host "  Mobile (Expo)      -> http://localhost:8081" -ForegroundColor Gray
Write-Host "  Customer Web       -> (check console)" -ForegroundColor Gray
Write-Host "  Admin Panel        -> http://localhost:5173" -ForegroundColor Gray
Write-Host "  API (server.js)    -> (check console)" -ForegroundColor Gray
Write-Host "  Database           -> watching for changes" -ForegroundColor Gray
Read-Host "Press Enter to close this launcher"