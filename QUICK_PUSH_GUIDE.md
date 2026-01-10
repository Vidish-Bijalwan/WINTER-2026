# Quick Guide: Push to GitHub

## Option 1: Using PowerShell Script (Recommended)

1. **Install Git** (if not installed):
   ```powershell
   winget install Git.Git
   ```
   Or download from: https://git-scm.com/download/win

2. **Run the push script**:
   ```powershell
   .\push-to-github.ps1
   ```

3. Follow the prompts in the script.

## Option 2: Manual Git Commands

Open PowerShell in the project directory and run:

```powershell
# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/Vidish-Bijalwan/WINTER-2026.git

# Stage all files
git add .

# Commit changes
git commit -m "Initial commit: TopoForge Frontend - Complete implementation"

# Push to GitHub
git branch -M main
git push -u origin main
```

## Option 3: Using GitHub Desktop

1. Download: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select: `c:\Users\ganga\OneDrive\Documents\top_UI`
5. Click "Publish repository" or "Push origin"

## Authentication

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)
  - Generate token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Select `repo` scope
  - Copy token and use it as password

## Troubleshooting

### "Repository not found" error
- Verify you have access to: https://github.com/Vidish-Bijalwan/WINTER-2026
- Check repository URL is correct

### "Authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys

### "Updates were rejected"
- Pull first: `git pull origin main --allow-unrelated-histories`
- Resolve conflicts if any
- Then push again

## Files Being Pushed

✅ All source code  
✅ Configuration files  
✅ Documentation  
❌ `node_modules/` (excluded)  
❌ `dist/` (excluded)
