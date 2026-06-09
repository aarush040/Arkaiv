$ErrorActionPreference = 'Continue'

Write-Output '=== backend.log ==='
if (Test-Path backend.log) { Get-Content backend.log } else { Write-Output '(no log)' }

Write-Output '=== backend.err.log ==='
if (Test-Path backend.err.log) { Get-Content backend.err.log } else { Write-Output '(no log)' }

Write-Output '=== port 3000 health ==='
try {
  $r = Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -UseBasicParsing -TimeoutSec 5
  Write-Output ('HTTP ' + $r.StatusCode + ': ' + $r.Content)
} catch {
  Write-Output ('error: ' + $_.Exception.Message)
}

Write-Output '=== port 3000 root (DISABLE_VITE root response) ==='
try {
  $r = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing -TimeoutSec 5
  Write-Output ('HTTP ' + $r.StatusCode + ': ' + $r.Content)
} catch {
  Write-Output ('error: ' + $_.Exception.Message)
}
