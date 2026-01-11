#!/bin/bash
# MOSS Plagiarism Check Script for TopoShape Insights

MOSS_SCRIPT="./moss.pl"
MOSS_USER_ID="YOUR_MOSS_ID"  # Replace with your MOSS ID from moss@moss.stanford.edu

echo "🔍 Running MOSS Plagiarism Detection for TopoShape Insights..."
echo "=================================================="

# Check if MOSS script exists
if [ ! -f "$MOSS_SCRIPT" ]; then
    echo "❌ Error: moss.pl not found!"
    echo "Please register at moss@moss.stanford.edu and save the script as moss.pl"
    exit 1
fi

# Frontend TDA Algorithms (Most Critical)
echo "\n📊 Checking TDA Algorithms (Critical)..."
$MOSS_SCRIPT -u $MOSS_USER_ID -l javascript -d \
  src/lib/tda/wasserstein.ts \
  src/lib/tda/landscapes.ts \
  src/lib/tda/multimodal.ts \
  src/lib/topologyAnalysis.ts

# Frontend Hooks & Components
echo "\n📱 Checking Frontend Hooks & Components..."
$MOSS_SCRIPT -u $MOSS_USER_ID -l javascript -d \
  src/hooks/useAdvancedTDA.ts \
  src/hooks/useWikipediaStream.ts \
  src/components/tda-viz/*.tsx

# Backend API & Services
echo "\n🖥️  Checking Backend Code..."
$MOSS_SCRIPT -u $MOSS_USER_ID -l python -d \
  backend/api/routes/*.py \
  backend/services/*.py \
  backend/database/models.py

echo "\n✅ MOSS analysis complete!"
echo "=================================================="
echo "Review the URLs above for similarity reports."
echo "Expected: < 30% similarity for original code"
echo "Note: Higher similarity for library code is acceptable"
