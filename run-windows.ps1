$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Convert-SecureToPlainText([System.Security.SecureString]$Secret) {
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secret)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
}

Write-Host "EarthPulse AI - local setup" -ForegroundColor Green
Write-Host "Values are used only in this PowerShell process and are not saved in the project files."

$dbSecret = Read-Host "MySQL password for earthpulse_user" -AsSecureString
$adminEmail = Read-Host "First admin email"
$adminSecret = Read-Host "First admin password" -AsSecureString

$env:DB_PASSWORD = Convert-SecureToPlainText $dbSecret
$env:APP_ADMIN_EMAIL = $adminEmail.Trim()
$env:APP_ADMIN_PASSWORD = Convert-SecureToPlainText $adminSecret

$secondEmail = Read-Host "Second admin email (optional; press Enter to skip)"
if (-not [string]::IsNullOrWhiteSpace($secondEmail)) {
    $secondSecret = Read-Host "Second admin password" -AsSecureString
    $env:APP_ADMIN2_EMAIL = $secondEmail.Trim()
    $env:APP_ADMIN2_PASSWORD = Convert-SecureToPlainText $secondSecret
}

try {
    mvn clean spring-boot:run
}
finally {
    Remove-Item Env:DB_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:APP_ADMIN_EMAIL -ErrorAction SilentlyContinue
    Remove-Item Env:APP_ADMIN_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:APP_ADMIN2_EMAIL -ErrorAction SilentlyContinue
    Remove-Item Env:APP_ADMIN2_PASSWORD -ErrorAction SilentlyContinue
}
