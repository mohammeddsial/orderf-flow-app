# Ensure the script runs from its own folder
Set-Location $PSScriptRoot

Write-Host "Launching all services..." -ForegroundColor Green
Write-Host "Working directory: $PSScriptRoot" -ForegroundColor Yellow
Write-Host ""

# Check if the folders exist
$folders = @(
    "apps/mobile",
    "apps/customer-web",
    "apps/admin",
    "api",
    "jserver",
    "packages/shared"
)

$missing = $false
foreach ($f in $folders) {
    if (-not (Test-Path $f)) {
        Write-Host "ERROR: Folder not found: $f" -ForegroundColor Red
        $missing = $true
    }
}

if ($missing) {
    Write-Host "Some folders are missing. Please move this script to your project ROOT folder." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "All folders found. Launching terminals..." -ForegroundColor Green

# Launch each service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'MOBILE (Expo)'; Write-Host 'Starting MOBILE...' -ForegroundColor Cyan; cd 'apps/mobile'; npx expo start --web --port 8081"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'CUSTOMER WEB'; Write-Host 'Starting CUSTOMER WEB...' -ForegroundColor Cyan; cd 'apps/customer-web'; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'ADMIN PANEL'; Write-Host 'Starting ADMIN PANEL...' -ForegroundColor Cyan; cd 'apps/admin'; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'API SERVER'; Write-Host 'Starting API...' -ForegroundColor Cyan; cd 'api'; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'JSERVER'; Write-Host 'Starting JSERVER...' -ForegroundColor Cyan; cd 'jserver'; npm run start"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "title 'SHARED (Watch)'; Write-Host 'Watching SHARED...' -ForegroundColor Cyan; cd 'packages/shared'; npm run build -- --watch"

Write-Host ""
Write-Host "All 6 services launched in separate windows!" -ForegroundColor Green
Write-Host "Check the other windows - they should stay open." -ForegroundColor Yellow
Read-Host "Press Enter to close this launcher"