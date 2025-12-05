# PowerShell script for Claude Code status line
# Shows time, model name, current directory, and output style
# see https://code.claude.com/docs/zh-CN/statusline for more details
$input = $Input | Out-String
if ([string]::IsNullOrWhiteSpace($input)) {
    $input = ""
}

try {
    $data = $input | ConvertFrom-Json
    $time = Get-Date -Format "HH:mm:ss"
    $modelName = $data.model.display_name
    $currentDir = $data.workspace.current_dir
    $projectDir = $data.workspace.project_dir
    $outputStyle = $data.output_style.name
    $version = if ($data.version) { $data.version } else { "N/A" }
    $totalCost = if ($data.cost.total_cost_usd) { [double]$data.cost.total_cost_usd } else { 0 }

    # ANSI escape character for colors
    $ESC = [char]27

    # Format version and cost with right alignment
    $versionStr = "$version".PadLeft(8)
    if ($totalCost -gt 0) {
        $formattedCost = "$($totalCost.ToString('F3'))".PadLeft(10)
        $costPart = "$ESC[91m💰 $" + $formattedCost + "$ESC[0m"  # Red for cost if > 0
    } else {
        $costPart = "$ESC[90m        $ESC[0m"  # Gray empty space if cost = 0
    }

    # Build colored status line
    $timePart = "$ESC[36m🕓 [$time]$ESC[0m"  # Cyan for time
    $modelPart = "$ESC[33m🤖 $modelName$ESC[0m"  # Yellow for model
    $dirPart = "$ESC[32m📂 $currentDir$ESC[0m"  # Green for directory
    $stylePart = "$ESC[35m⚙️  $outputStyle$ESC[0m"  # Magenta for output style
    $versionPart = "$ESC[90m$versionStr$ESC[0m"  # Gray for version

    # Combine all parts
    $statusLine = "$timePart | $modelPart | $dirPart | $stylePart | $versionPart | $costPart"

    Write-Output $statusLine
}
catch {
    # Fallback if JSON parsing fails
    $time = Get-Date -Format "HH:mm:ss"
    $ESC = [char]27
    $timePart = "$ESC[36m🕓 [$time]$ESC[0m"
    $fallbackPart = "$ESC[37mClaude Code | Status | Default$ESC[0m"
    Write-Output "$timePart | $fallbackPart"
}