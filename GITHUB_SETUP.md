# GitHub Setup Guide

Follow these steps to push your code to the GitHub repository.

## Prerequisites

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Or install via winget: `winget install Git.Git`

2. **GitHub Account**: Make sure you have access to https://github.com/Vidish-Bijalwan/WINTER-2026

## Steps to Push Code

### 1. Open Terminal/PowerShell in the project directory

Navigate to: `c:\Users\ganga\OneDrive\Documents\top_UI`

### 2. Initialize Git Repository (if not already initialized)

```bash
git init
```

### 3. Add Remote Repository

```bash
git remote add origin https://github.com/Vidish-Bijalwan/WINTER-2026.git
```

Or if you prefer SSH:
```bash
git remote add origin git@github.com:Vidish-Bijalwan/WINTER-2026.git
```

### 4. Check Current Remote (optional)

```bash
git remote -v
```

### 5. Stage All Files

```bash
git add .
```

### 6. Commit Changes

```bash
git commit -m "Initial commit: TopoForge Frontend - Complete implementation with all phases"
```

### 7. Set Upstream Branch and Push

**If this is the first push:**
```bash
git branch -M main
git push -u origin main
```

**If the repository already has content and you want to merge:**
```bash
git pull origin main --allow-unrelated-histories
# Resolve any conflicts if they occur
git push -u origin main
```

**If you want to force push (⚠️ Use with caution):**
```bash
git push -u origin main --force
```

## Alternative: Using GitHub Desktop

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository → Select `c:\Users\ganga\OneDrive\Documents\top_UI`
4. Click "Publish repository" or "Push origin"

## Troubleshooting

### Authentication Issues

If you get authentication errors, you may need to:

1. **Use Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` permissions
   - Use the token as password when pushing

2. **Configure Git Credentials**:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Merge Conflicts

If you encounter merge conflicts:
1. Open conflicted files
2. Resolve conflicts manually
3. Stage resolved files: `git add .`
4. Complete merge: `git commit`
5. Push: `git push origin main`

## What Gets Pushed

The following will be pushed:
- ✅ All source code (`src/` directory)
- ✅ Configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`, etc.)
- ✅ Public assets (`public/` directory)
- ✅ Documentation (`README.md`, etc.)
- ❌ `node_modules/` (excluded via `.gitignore`)
- ❌ `dist/` (excluded via `.gitignore`)

## Next Steps After Pushing

1. Verify the code is on GitHub
2. Set up GitHub Actions for CI/CD (if needed)
3. Configure branch protection rules
4. Add collaborators if needed
