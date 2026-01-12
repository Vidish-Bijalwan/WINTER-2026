# Stanford MOSS Plagiarism Detection - Integration Guide

## Overview
Stanford MOSS (Measure Of Software Similarity) is used for Layer 2 evaluation to verify code originality and detect potential plagiarism.

---

## Setup Instructions

### 1. Register for MOSS Account
```bash
# Send email to register (script will reply with Perl script)
# Subject: "MOSS Registration"
# To: moss@moss.stanford.edu
# Body: Your email address
```

### 2. Install MOSS Perl Script
```bash
# Save the script sent to your email as moss.pl
chmod +x moss.pl
```

### 3. Install Dependencies
```bash
# Perl (usually pre-installed on Linux/Mac)
perl --version

# For Ubuntu/Debian
sudo apt-get install perl libwww-perl

# For macOS
brew install perl
```

---

## Running MOSS Analysis

### Frontend Code (TypeScript/React)
```bash
# Submit all TypeScript/React files
./moss.pl -l javascript -d \
  src/**/*.ts \
  src/**/*.tsx \
  src/components/**/*.tsx \
  src/hooks/**/*.ts \
  src/lib/**/*.ts

# Expected output: URL to MOSS results page
```

### Backend Code (Python)
```bash
# Submit all Python files
./moss.pl -l python -d \
  backend/**/*.py \
  backend/api/**/*.py \
  backend/services/**/*.py \
  backend/database/**/*.py

# Expected output: URL to MOSS results page
```

### TDA Algorithm Verification
```bash
# Submit core TDA implementations separately
./moss.pl -l javascript -d \
  src/lib/tda/**/*.ts \
  src/lib/topologyAnalysis.ts

# This ensures TDA algorithms are original
```

---

## Interpreting Results

### Similarity Threshold Guidelines
| Similarity % | Interpretation | Action |
|-------------|----------------|--------|
| 0-25% | Normal boilerplate similarity | ✅ PASS |
| 25-50% | Moderate similarity (check comments, imports) | ⚠️ REVIEW |
| 50-75% | High similarity (likely code sharing) | ❌ INVESTIGATE |
| 75-100% | Nearly identical (plagiarism likely) | ❌ FAIL |

### Expected Similarities for This Project
- **UI Components**: 10-20% (shadcn/ui templates are common)
- **API Routes**: 5-15% (FastAPI patterns are standard)
- **TDA Algorithms**: 5-30% (mathematical implementations may be similar)
- **Authentication**: 15-25% (JWT patterns are standard)

---

## Pre-Submission Checklist

### Code Originality Verification
- [ ] All TDA algorithms implemented from research papers
- [ ] No direct copy-paste from GitHub repositories
- [ ] UI components customized beyond library defaults
- [ ] Database models designed for specific use case
- [ ] Visualization code includes custom logic

### Documentation of External Code
- [ ] All third-party libraries listed in package.json
- [ ] shadcn/ui components documented in components.json
- [ ] Academic references cited in code comments
- [ ] Algorithm sources documented in README

---

## MOSS Submission Script

Create `scripts/moss_check.sh`:
```bash
#!/bin/bash
# MOSS Plagiarism Check Script for TopoShape Insights

MOSS_SCRIPT="./moss.pl"
MOSS_USER_ID="YOUR_MOSS_ID"  # Replace with your MOSS ID

echo "🔍 Running MOSS Plagiarism Detection..."

# Frontend Check
echo "\n📱 Checking Frontend Code..."
$MOSS_SCRIPT -u $MOSS_USER_ID -l javascript -d \
  src/lib/tda/*.ts \
  src/lib/topologyAnalysis.ts \
  src/hooks/*.ts \
  src/components/tda-viz/*.tsx

# Backend Check
echo "\n🖥️  Checking Backend Code..."
$MOSS_SCRIPT -u $MOSS_USER_ID -l python -d \
  backend/api/routes/*.py \
  backend/services/*.py \
  backend/database/*.py

echo "\n✅ MOSS analysis complete. Check URLs above for results."
```

Make executable:
```bash
chmod +x scripts/moss_check.sh
./scripts/moss_check.sh
```

---

## Alternative: Manual Code Review

If MOSS is unavailable, perform manual verification:

### 1. GitHub Code Search
```bash
# Search for unique function names
# Example: Search GitHub for "computeWassersteinDistance"
```

### 2. Code Pattern Analysis
- Check for consistent coding style across all files
- Verify variable naming follows project conventions
- Ensure comments match implementation complexity

### 3. Git History Verification
```bash
# Ensure all code has proper commit history
git log --all --oneline --graph src/lib/tda/

# Check for large commits (potential copy-paste)
git log --all --stat | grep -A5 "files changed"
```

---

## Layer 2 Compliance Statement

**Project**: TopoShape Insights
**Date**: 2026-01-11

### Code Originality Declaration

#### Frontend (React/TypeScript)
- **TDA Algorithms** (`src/lib/tda/`): 100% original implementation based on academic papers
- **Hooks** (`src/hooks/`): Custom implementations for Wikipedia SSE and TDA processing
- **UI Components**: Built on shadcn/ui (properly attributed), heavily customized
- **Visualizations**: Custom SVG/Recharts implementations

#### Backend (FastAPI/Python)
- **API Routes**: Standard FastAPI patterns with project-specific logic
- **Database Models**: Custom schema for TopoShape requirements
- **Authentication**: Industry-standard JWT implementation (properly attributed)

#### Third-Party Code Attribution
All external libraries are:
1. Listed in `package.json` (frontend) and `requirements.txt` (backend)
2. Used via standard import mechanisms
3. Not modified beyond parameterization
4. Open-source licensed (MIT/Apache/BSD)

**Expected MOSS Score**: < 30% similarity (excluding libraries)

---

## Submission Evidence

### Screenshots
1. MOSS results page showing < 30% similarity
2. GitHub commit history showing incremental development
3. Academic paper references for TDA algorithms

### Files for Manual Review
- `src/lib/tda/wasserstein.ts` - Original Wasserstein implementation
- `src/lib/tda/landscapes.ts` - Original Persistence Landscapes
- `src/lib/tda/multimodal.ts` - Original Multi-Modal Detector
- `src/workers/tda.worker.ts` - Original Web Worker architecture

**Layer 2 Status**: ✅ READY FOR VERIFICATION

---

**Document Version**: 1.0
**Last Updated**: 2026-01-11
