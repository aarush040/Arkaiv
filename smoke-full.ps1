$ErrorActionPreference = 'Continue'

function Get-Url([string]$Url) {
  try {
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 8
    return ('HTTP ' + $r.StatusCode + ' (' + $r.Content.Length + ' bytes): ' + ($r.Content.Substring(0, [Math]::Min($r.Content.Length, 200))))
  } catch {
    return ('ERR: ' + $_.Exception.Message)
  }
}

Write-Output '=== Listening ports ==='
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in 3000, 3001, 5173, 24678 } |
  Select-Object LocalPort, OwningProcess |
  Format-Table -AutoSize

Write-Output ''
Write-Output '=== Backend logs (last 30 lines) ==='
if (Test-Path backend.log) {
  Get-Content backend.log -Tail 30
} else {
  Write-Output '(no log)'
}

Write-Output ''
Write-Output '=== Frontend logs (last 30 lines) ==='
if (Test-Path frontend.log) {
  Get-Content frontend.log -Tail 30
} else {
  Write-Output '(no log)'
}

Write-Output ''
Write-Output '=== Backend health (port 3000) ==='
Get-Url 'http://localhost:3000/api/health'

Write-Output ''
Write-Output '=== Backend root (port 3000) ==='
Get-Url 'http://localhost:3000/'

Write-Output ''
Write-Output '=== Frontend index (port 5173) ==='
Get-Url 'http://localhost:5173/'

Write-Output ''
Write-Output '=== Frontend -> Backend proxy (port 5173/api/health) ==='
Get-Url 'http://localhost:5173/api/health'
