# PowerShell script for Claude Code status line
# Shows time, model name, current directory, and output style
# see https://code.claude.com/docs/zh-CN/statusline for more details

# Debug switch - set to $true to print original JSON
$DEBUG = $false

# Initialize default values
$time = Get-Date -Format "HH:mm:ss"
$modelName = "Claude Code"
$currentDir = Get-Location | Select-Object -ExpandProperty Path
$outputStyle = "default"
$version = "N/A"
$totalCost = 0
$totalDur = 0
$totalInputTokens = 0
$totalOutputTokens = 0
$contextWindowSize = 0
$usedPercentage = 0

# Try to read input without validation
try {
    # Check for command line argument first
    if ($args.Count -gt 0) {
        $inputContent = $args[0]
    } else {
        # Try to read from pipeline
        $inputContent = ""
        if ($input.MoveNext()) {
            $inputContent = $input.Current
            while ($input.MoveNext()) {
                $inputContent += "`n" + $input.Current
            }
        }
    }

    if (-not [string]::IsNullOrWhiteSpace($inputContent)) {
        $data = $inputContent | ConvertFrom-Json
        $modelName = if ($data.model.display_name) { $data.model.display_name } else { $modelName }
        $currentDir = if ($data.workspace.current_dir) { $data.workspace.current_dir } else { $currentDir }
        $outputStyle = if ($data.output_style.name) { $data.output_style.name } else { $outputStyle }
        $version = if ($data.version) { $data.version } else { $version }
        $totalCost = if ($data.cost.total_cost_usd) { [double]$data.cost.total_cost_usd } else { $totalCost }
        $totalDur = if($data.cost.total_duration_ms) {[long]$data.cost.total_duration_ms} else { $totalDur }
        $totalInputTokens = if ($data.context_window.total_input_tokens) { [long]$data.context_window.total_input_tokens } else { $totalInputTokens }
        $totalOutputTokens = if ($data.context_window.total_output_tokens) { [long]$data.context_window.total_output_tokens } else { $totalOutputTokens }
        $contextWindowSize = if ($data.context_window.context_window_size) { [long]$data.context_window.context_window_size } else { $contextWindowSize }
        $usedPercentage = if ($null -ne $data.context_window.used_percentage) { [double]$data.context_window.used_percentage } else { $usedPercentage }

        # Debug: print original JSON
        if ($DEBUG) {
            Write-Host "=== DEBUG: Original JSON ===" -ForegroundColor Yellow
            Write-Host $inputContent -ForegroundColor DarkGray
            Write-Host "===========================" -ForegroundColor Yellow
        }
    }
} catch {
    # Ignore any parsing errors, use defaults
}

# Get current Git branch
$branchName = "N/A"
try {
    $gitBranch = & git branch --show-current 2>$null
    if ($LASTEXITCODE -eq 0 -and $gitBranch) {
        $branchName = $gitBranch.Trim()
    }
} catch {
    # Git not available or not in a git repository
}

# ANSI escape character for colors
$ESC = [char]27

# Build formatted cost and duration strings
$costStr = if ($totalCost -gt 0) { '$' + $totalCost.ToString('F3') } else { '-' }
$durStr = if ($totalDur -gt 0) {
    if ($totalDur -lt 1000) { "$($totalDur)ms" }
    elseif ($totalDur -lt 60000) { "$([math]::Round($totalDur / 1000, 1))s" }
    elseif ($totalDur -lt 3600000) {
        $minutes = [math]::Floor($totalDur / 60000)
        $seconds = [math]::Round(($totalDur % 60000) / 1000, 0)
        "${minutes}m${seconds}s"
    } else {
        $hours = [math]::Floor($totalDur / 3600000)
        $minutes = [math]::Floor(($totalDur % 3600000) / 60000)
        "${hours}h${minutes}m"
    }
} else { '-' }

# === Line 1: Environment (dir, branch, style) ===
Write-Host "$ESC[32m💻 $currentDir$ESC[0m | $ESC[95m🌿 $branchName$ESC[0m | $ESC[35m⚙️ $outputStyle$ESC[0m"

# === Line 2: Fixed info (model, version, time) ===
Write-Host "$ESC[33m🤖 $modelName$ESC[0m | $ESC[90m📋 $version$ESC[0m | $ESC[36m🕓 $time$ESC[0m"

# === Line 3: Statistics (token, cost, duration) ===
$tokenInfo = if ($totalInputTokens -gt 0 -or $totalOutputTokens -gt 0) {
    $totalTokens = $totalInputTokens + $totalOutputTokens
    $percentage = if ($contextWindowSize -gt 0) { [math]::Round($totalTokens * 100 / $contextWindowSize, 1) } else { 0 }
    "🔼 $($totalInputTokens) 🔽 $($totalOutputTokens) 📊 $($totalTokens)/$($contextWindowSize) ($($percentage)%)"
} else { '-' }
Write-Host "$ESC[96m$tokenInfo$ESC[0m | $ESC[91m💰 $costStr$ESC[0m | $ESC[94m⏱️ $durStr$ESC[0m"

