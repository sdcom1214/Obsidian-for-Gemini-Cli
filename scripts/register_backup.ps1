$rcloneExe = (Get-ChildItem -Path "$env:USERPROFILE\rclone" -Filter "rclone.exe" -Recurse | Select-Object -First 1).FullName
$syncScript = "$env:USERPROFILE\fast-obsidian-mcp\scripts\sync_gdrive.ps1"
$taskName = "Obsidian_Auto_Backup"

if ($rcloneExe -and (Test-Path $syncScript)) {
    $action = New-ScheduledTaskAction -Execute 'Powershell.exe' -Argument "-ExecutionPolicy Bypass -File $syncScript"
    $trigger = New-ScheduledTaskTrigger -Daily -At 12am
    Register-ScheduledTask -Action $action -Trigger $trigger -TaskName $taskName -Description "매일 자정 옵시디언 보관소를 구글 드라이브와 동기화합니다." -Force
    Write-Host "성공: 작업 스케줄러에 '$taskName'이 등록되었습니다. 매일 자정에 자동 백업됩니다." -ForegroundColor Green
} else {
    Write-Error "오류: rclone이나 sync_gdrive.ps1 파일을 찾을 수 없습니다."
}
