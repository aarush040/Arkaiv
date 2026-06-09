Write-Output '=== node processes ==='
Get-Process -Name node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName | Format-Table -AutoSize

Write-Output '=== listening ports ==='
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in 3000, 3001, 5173, 24678 } |
  Select-Object LocalPort, OwningProcess |
  Format-Table -AutoSize
