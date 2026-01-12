# TopoShape Insights - Documentation Index

## Project Documentation

### Core Documentation
- [README.md](../README.md) - Project overview, setup, features
- [DATA_FLOW_DIAGRAMS.md](./DATA_FLOW_DIAGRAMS.md) - Level 0, 1, 2 DFDs with Mermaid
- [MOSS_VERIFICATION.md](./MOSS_VERIFICATION.md) - Stanford MOSS plagiarism check guide
- [SELF_EVALUATION.md](./SELF_EVALUATION.md) - Detailed evaluation rubric (9.0/10)
- [EVALUATION_FRAMEWORK.md](./EVALUATION_FRAMEWORK.md) - Quick reference for all 3 layers

### Implementation Artifacts
- [walkthrough.md](../.gemini/antigravity/brain/d0441eed-9568-4850-8107-98b4be28897f/walkthrough.md) - Complete implementation walkthrough
- [implementation_summary.md](../.gemini/antigravity/brain/d0441eed-9568-4850-8107-98b4be28897f/implementation_summary.md) - Summary of all 4 phases
- [task.md](../.gemini/antigravity/brain/d0441eed-9568-4850-8107-98b4be28897f/task.md) - Task tracking and progress

### Technical Documentation
- [API Documentation](./API.md) - Backend API endpoints (TODO)
- [TDA Algorithms](./TDA_ALGORITHMS.md) - Mathematical background (TODO)
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment steps (TODO)

---

## Quick Navigation

### For Evaluators
1. **Layer 1 (DFDs)**: Start with [DATA_FLOW_DIAGRAMS.md](./DATA_FLOW_DIAGRAMS.md)
2. **Layer 2 (MOSS)**: Review [MOSS_VERIFICATION.md](./MOSS_VERIFICATION.md)
3. **Layer 3 (Self-Eval)**: See [SELF_EVALUATION.md](./SELF_EVALUATION.md)
4. **Quick Reference**: Use [EVALUATION_FRAMEWORK.md](./EVALUATION_FRAMEWORK.md)

### For Developers
1. **Setup**: Follow [README.md](../README.md)
2. **Architecture**: Review DFDs in [DATA_FLOW_DIAGRAMS.md](./DATA_FLOW_DIAGRAMS.md)
3. **Walkthrough**: Read [walkthrough.md](../.gemini/antigravity/brain/d0441eed-9568-4850-8107-98b4be28897f/walkthrough.md)

### For Presenters
1. **Impact**: Highlight strengths from [SELF_EVALUATION.md](./SELF_EVALUATION.md)
2. **Demo**: Follow [walkthrough.md](../.gemini/antigravity/brain/d0441eed-9568-4850-8107-98b4be28897f/walkthrough.md) for demo flow
3. **Q&A**: Reference technical details in [DATA_FLOW_DIAGRAMS.md](./DATA_FLOW_DIAGRAMS.md)

---

## File Structure

```
Winter/
├── docs/
│   ├── INDEX.md (this file)
│   ├── DATA_FLOW_DIAGRAMS.md
│   ├── MOSS_VERIFICATION.md
│   ├── SELF_EVALUATION.md
│   └── EVALUATION_FRAMEWORK.md
├── scripts/
│   └── moss_check.sh
├── src/
│   ├── lib/
│   │   ├── tda/ (Advanced TDA algorithms)
│   │   └── topologyAnalysis.ts
│   ├── components/
│   │   └── tda-viz/ (Interactive visualizations)
│   ├── hooks/
│   │   └── useAdvancedTDA.ts
│   └── workers/
│       └── tda.worker.ts
└── backend/
    ├── api/
    ├── services/
    └── database/
```

---

**Last Updated**: 2026-01-11
