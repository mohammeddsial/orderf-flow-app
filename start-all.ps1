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
    "apps/api",
    "packages"   # Just check if packages folder exists
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

# Launch each service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'MOBILE (Expo)'; Write-Host 'Starting MOBILE...' -ForegroundColor Cyan; cd 'apps/mobile'; npx expo start --web --port 8081"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'WEB CUSTOMER'; Write-Host 'Starting WEB CUSTOMER...' -ForegroundColor Cyan; cd 'apps/web-customer'; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'WEB ADMIN'; Write-Host 'Starting WEB ADMIN...' -ForegroundColor Cyan; cd 'apps/web-admin'; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'API'; Write-Host 'Starting API...' -ForegroundColor Cyan; cd 'apps/api'; npm run dev"

# Check what's inside the packages folder
Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'PACKAGES'; Write-Host 'Checking packages...' -ForegroundColor Cyan; cd 'packages'; Get-ChildItem -Directory"

Write-Host ""
Write-Host "All services launched!" -ForegroundColor Green
Write-Host "Note: 'packages' window will show what's inside - you may need to run 'npm run build -- --watch' there." -ForegroundColor Yellow
Read-Host "Press Enter to close this launcher"