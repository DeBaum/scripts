$par2jPath = ".\par2j64.exe"
Get-ChildItem -Path . -Directory |
    Get-ChildItem -Recurse -File |
    Where-Object {$_.Extension -in ".log",".exe",".mdb"} |
    ForEach-Object {
        $file = $_.Name
        $par2File = "$($_.FullName).par2"
        $dir = $_.DirectoryName

        if (Test-Path -Path $par2File) {
            Write-Host "skipping already processed file: $file"
        } else {
            Write-Host "new file: $file"
            $output = & $par2jPath c /rr1 "$dir/$file.par2" "$file"
        }
    }