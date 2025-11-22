@echo off
rem Claude Code Status Line Script for Windows
rem Displays model name from settings.json, current directory, git branch, and user information
rem Uses PowerShell for JSON parsing

setlocal enabledelayedexpansion

:: Get current directory
set "current_dir=%CD%"

:: Get username
set "username=%USERNAME%"

:: Try to get git branch
set "git_branch=no-git"
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "git_branch=%%i"
if "!git_branch!"=="HEAD" set "git_branch=detached"

:: Use PowerShell to read model from settings.json
set "model_name=GLM-4.6"
for /f "delims=" %%i in ('powershell.exe -Command "try { (Get-Content \"C:\\Users\\ikki\\.claude\\settings.json\" | ConvertFrom-Json).env.ANTHROPIC_DEFAULT_SONNET_MODEL } catch { \"GLM-4.6\" }"') do set "model_name=%%i"

:: Display status line with dynamic model from settings.json
echo [!model_name!] !current_dir! [!git_branch!] [!username!]

endlocal