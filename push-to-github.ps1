# PowerShell script to push code to GitHub
# Make sure Git is installed before running this script

Write-Host "=== TopoForge GitHub Push Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Or run: winget install Git.Git" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Checking repository status..." -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to initialize git repository" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# Check remote
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/Vidish-Bijalwan/WINTER-2026.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to add remote" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Remote added" -ForegroundColor Green
} else {
    Write-Host "✓ Remote already configured: $remoteExists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Staging files..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to stage files" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Files staged" -ForegroundColor Green

Write-Host ""
Write-Host "Checking for changes to commit..." -ForegroundColor Cyan
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "⚠ No changes to commit" -ForegroundColor Yellow
    Write-Host "Skipping commit..." -ForegroundColor Yellow
} else {
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Initial commit: TopoForge Frontend - Complete implementation with all phases"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to commit" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Changes committed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Setting branch to 'main'..." -ForegroundColor Cyan
git branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Branch rename failed (may already be main)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Ready to push to GitHub!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "1. Push to main branch (normal push)" -ForegroundColor White
Write-Host "2. Force push (⚠️ Overwrites remote - use with caution)" -ForegroundColor White
Write-Host "3. Cancel" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host "View your repository at: https://github.com/Vidish-Bijalwan/WINTER-2026" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "✗ Push failed" -ForegroundColor Red
            Write-Host "You may need to:" -ForegroundColor Yellow
            Write-Host "  - Pull first: git pull origin main --allow-unrelated-histories" -ForegroundColor White
            Write-Host "  - Or authenticate with GitHub" -ForegroundColor White
        }
    }
    "2" {
        Write-Host ""
        Write-Host "⚠ Force pushing to GitHub..." -ForegroundColor Yellow
        git push -u origin main --force
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Successfully force pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "✗ Force push failed" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice. Cancelled." -ForegroundColor Red
        exit 1
    }
}
