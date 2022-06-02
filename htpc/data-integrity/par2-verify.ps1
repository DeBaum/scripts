$par2jPath = ".\par2j64.exe"
$logFile = ".\par2-verify.log"

$now = Get-Date -format "yyyy-MM-dd HH:mm"
Add-Content -Path $logFile "##################################################"
Add-Content -Path $logFile "# VERIFY - $now ######################"
Add-Content -Path $logFile "##################################################"

Get-ChildItem -Path . -Directory |
    Get-ChildItem -Recurse -File -Filter *.par2 |
    Where-Object {$_.Name -notlike "*.vol0+*.par2"} |
    ForEach-Object {
        $par2File = $_.FullName
        $output = & $par2jPath v "$par2File"
        $baseFile = $_.Name -replace ".par2",""
        $status = ($output -split "\n")[-1]
        Add-Content -Path par2-verify.log "$($status): $baseFile"
    }