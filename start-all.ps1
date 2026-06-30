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

# 1. MOBILE (Expo) - Dark Blue background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'MOBILE (Expo)'; `$Host.UI.RawUI.BackgroundColor = 'DarkBlue'; Clear-Host; Write-Host 'Starting MOBILE...' -ForegroundColor White; cd 'apps/mobile'; npx expo start --web --port 8081"

# 2. WEB CUSTOMER - Dark Green background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'WEB CUSTOMER'; `$Host.UI.RawUI.BackgroundColor = 'DarkGreen'; Clear-Host; Write-Host 'Starting WEB CUSTOMER...' -ForegroundColor White; cd 'apps/web-customer'; npm run dev"

# 3. WEB ADMIN - Dark Red background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'WEB ADMIN'; `$Host.UI.RawUI.BackgroundColor = 'DarkRed'; Clear-Host; Write-Host 'Starting WEB ADMIN...' -ForegroundColor White; cd 'apps/web-admin'; npm run dev"

# 4. WEB RESTAURANT - Dark Magenta background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'WEB RESTAURANT'; `$Host.UI.RawUI.BackgroundColor = 'DarkMagenta'; Clear-Host; Write-Host 'Starting WEB RESTAURANT...' -ForegroundColor White; cd 'apps/web-restaurant'; npm run dev"

# 5. API (server.js) - Dark Cyan background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'API (server.js)'; `$Host.UI.RawUI.BackgroundColor = 'DarkCyan'; Clear-Host; Write-Host 'Starting API...' -ForegroundColor White; cd 'apps/api'; node server.js"

# 6. DATABASE - Dark Yellow background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle = 'DATABASE'; `$Host.UI.RawUI.BackgroundColor = 'DarkYellow'; Clear-Host; Write-Host 'Starting DATABASE...' -ForegroundColor Black; cd 'packages/database'; npm run build -- --watch"

Write-Host ""
Write-Host "All 6 services launched!" -ForegroundColor Green
Write-Host "Services running:" -ForegroundColor Yellow
Write-Host "  Mobile (Expo)      -> http://localhost:8081  (DARK BLUE)" -ForegroundColor Gray
Write-Host "  Customer Web       -> (check console)        (DARK GREEN)" -ForegroundColor Gray
Write-Host "  Admin Panel        -> (check console)        (DARK RED)" -ForegroundColor Gray
Write-Host "  Restaurant Web     -> (check console)        (DARK MAGENTA)" -ForegroundColor Gray
Write-Host "  API (server.js)    -> (check console)        (DARK CYAN)" -ForegroundColor Gray
Write-Host "  Database           -> watching for changes   (DARK YELLOW)" -ForegroundColor Gray
Read-Host "Press Enter to close this launcher"