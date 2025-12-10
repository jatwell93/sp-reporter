
$pluginDir = "date-range-reporter"
$zipFile = "date-range-reporter.zip"
$currentDir = "c:\Users\josha\sp-reporter\sp-reporter"

Set-Location $currentDir

if (Test-Path $pluginDir) {
    # Get all files in the plugin directory except the template
    $files = Get-ChildItem -Path "$pluginDir*" -Exclude "manifest.json.template"

    if ($files.Count -gt 0) {
        Compress-Archive -Path $files -DestinationPath $zipFile -CompressionLevel Optimal
        if (Test-Path $zipFile) {
            Write-Host "✓ Plugin packaged successfully: $zipFile"
        } else {
            Write-Host "❌ Failed to create zip file"
            exit 1
        }
    } else {
        Write-Host "❌ No files found to compress in $pluginDir"
        exit 1
    }
} else {
    Write-Host "❌ Plugin directory not found: $pluginDir"
    exit 1
}
