# TopoForge Team Collaboration Guide

## 📊 Project Overview

**TopoForge** (TopoShape Insights) is a real-time anomaly detection platform using Topological Data Analysis (TDA). This guide explains the team structure and how all members work together.

---

## 👥 Team Structure

Your team is divided into **3 specialized roles**, each focusing on different aspects of the project:

| Team Member | Primary Focus | Main Technologies |
|-------------|---------------|-------------------|
| **Member 1** | Database & Backend | MongoDB Atlas, Python, FastAPI, JWT |
| **Member 2** | Frontend & UI | React, TypeScript, Three.js, Tailwind CSS |
| **Member 3** | Testing & DevOps | Vitest, Pytest, Docker, GitHub Actions |

**You (Team Lead)**: Coordinate the team, review PRs, integrate components, and ensure overall project coherence.

---

## 📂 Individual Task Assignments

Each team member has a **detailed guide** in the repository:

### 🗄️ Team Member 1: Database & Backend Developer
**Guide**: [`TEAM_MEMBER_1_DATABASE_BACKEND.md`](file:///home/zerosirus/Winter/TEAM_MEMBER_1_DATABASE_BACKEND.md)

**Responsibilities:**
- Set up MongoDB Atlas cloud database
- Create database schemas (Users, AnomalyLogs, Sessions, AlertConfigs)
- Build REST API endpoints for CRUD operations
- Implement JWT-based authentication system
- Integrate real-time anomaly logging
- Create Database Schema diagrams

**Key Deliverables:**
- MongoDB Atlas cluster (configured and running)
- 15+ API endpoints across authentication, users, and anomalies
- Database models with proper indexing
- Real-time data persistence from TDA engine
- `docs/database/DATABASE_SCHEMA.md` with ER diagrams

**Timeline**: 4 weeks
**Expected Commits**: 20+
**Expected PRs**: 5-8

---

### 🎨 Team Member 2: Frontend & UI Developer
**Guide**: [`TEAM_MEMBER_2_FRONTEND_UI.md`](file:///home/zerosirus/Winter/TEAM_MEMBER_2_FRONTEND_UI.md)

**Responsibilities:**
- Enhance 3D network visualizations with interactive controls
- Create persistence diagrams and barcodes (TDA visualizations)
- Build real-time dashboard with live anomaly feed
- Design user profile and settings pages
- Make app fully responsive for mobile devices
- Convert app to Progressive Web App (PWA)
- Implement advanced search and filtering
- Add data export capabilities (CSV, JSON, PDF)

**Key Deliverables:**
- Interactive 3D graph with zoom, pan, search
- Real-time dashboard updating as anomalies are detected
- Mobile-responsive design (works on 375px to 1920px)
- Installable PWA with offline support
- Comprehensive filtering and export features

**Timeline**: 4 weeks
**Expected Commits**: 25+
**Expected PRs**: 6-10

---

### 🧪 Team Member 3: Testing, Documentation & DevOps
**Guide**: [`TEAM_MEMBER_3_TESTING_DOCS_DEVOPS.md`](file:///home/zerosirus/Winter/TEAM_MEMBER_3_TESTING_DOCS_DEVOPS.md)

**Responsibilities:**
- Set up testing infrastructure (Vitest for frontend, Pytest for backend)
- Write comprehensive unit and integration tests
- Create **Data Flow Diagrams (DFDs)** - MANDATORY for submission
- Create **Database Schema Diagrams** - MANDATORY for submission
- Write complete API documentation
- Configure CI/CD pipelines with GitHub Actions
- Set up Docker containerization
- Implement monitoring and logging

**Key Deliverables:**
- 80%+ frontend test coverage, 75%+ backend coverage
- DFD Level 0, 1, and 2 diagrams
- Database ER diagram with all collections
- Complete API reference documentation
- GitHub Actions CI/CD workflows
- Docker Compose setup for easy deployment
- Deployment guides and monitoring setup

**Timeline**: 4 weeks
**Expected Commits**: 30+
**Expected PRs**: 8-12

---

## 🔄 Workflow & Integration Points

### Week 1: Foundation
- **Member 1**: MongoDB setup, initial schemas
- **Member 2**: Review existing UI, plan enhancements
- **Member 3**: Set up testing framework, start DFD diagrams
- **Team Lead**: Review initial PRs, ensure consistency

### Week 2: Core Development
- **Member 1**: API endpoints, authentication
- **Member 2**: 3D visualization enhancements, dashboards
- **Member 3**: Write tests for Member 1's APIs, continue documentation
- **Integration**: Member 2 starts using Member 1's APIs

### Week 3: Advanced Features
- **Member 1**: Real-time data integration, optimization
- **Member 2**: Mobile responsive, PWA setup
- **Member 3**: CI/CD pipelines, Docker setup
- **Integration**: All services work together via Docker Compose

### Week 4: Polish & Documentation
- **All**: Bug fixes, final testing
- **Member 3**: Complete all documentation, ensure submission requirements met
- **Team Lead**: Final review, prepare for Round 2 submission

---

## 🔀 Git Workflow for the Team

### Branch Strategy

```
main
├── database/mongodb-setup          (Member 1)
├── database/api-endpoints          (Member 1)
├── frontend/3d-enhancements        (Member 2)
├── frontend/pwa-setup              (Member 2)
├── testing/unit-tests              (Member 3)
└── docs/dfds-and-schemas           (Member 3)
```

### Rules
1. **Never push directly to `main`**
2. **Always create feature branches**
3. **Name branches**: `<area>/<short-description>`
   - Examples: `database/user-auth`, `frontend/mobile-nav`, `testing/api-tests`
4. **One feature per branch**
5. **Pull Requests required for all merges**
6. **At least 1 approval required** (from team lead)

### PR Review Checklist
Before approving any PR, verify:
- [ ] Code runs without errors
- [ ] Follows project coding standards
- [ ] Includes necessary tests (if applicable)
- [ ] Documentation updated (if needed)
- [ ] No sensitive data (API keys, passwords) committed
- [ ] Commit messages are descriptive
- [ ] No merge conflicts with main

---

## 📊 Submission Requirements Compliance

Your submission for **Round 2** must meet these requirements:

### ✅ Required Deliverables

| Requirement | Responsible | Status Tracking |
|-------------|-------------|-----------------|
| **DFDs (all 3 levels)** | Member 3 | `docs/architecture/DFD_LEVEL_*.md` |
| **Database Schema Diagram** | Member 1 & 3 | `docs/database/DATABASE_SCHEMA.md` |
| **Individual code contributions** | All Members | Git commit history |
| **Feature branches + PRs** | All Members | GitHub PR history |
| **No direct main pushes** | All Members | Git branch protection |
| **Functional project** | All Members | Final integration testing |

### ⚠️ Non-Valid Contributions (Avoid These)
- README-only updates
- Video uploads
- Documentation-only changes (team members must have code commits)

### ✅ Valid Contributions
- Code files (.py, .tsx, .ts, .css, etc.)
- Configuration files (Docker, CI/CD)
- Test files (.test.tsx, test_*.py)
- Database schemas and models
- API endpoints and backend logic
- UI components and styling

---

## 🚀 How Team Members Use Antigravity IDE

Each team member guide includes **Antigravity-ready prompts** that can be copy-pasted directly into the IDE.

### For Team Members (Step-by-Step):

1. **Open Antigravity IDE** on your system
2. **Navigate to the project directory**
   ```bash
   cd ~/WINTER-2026  # or wherever you cloned the repo
   ```
3. **Open your task guide**
   - Member 1: Open `TEAM_MEMBER_1_DATABASE_BACKEND.md`
   - Member 2: Open `TEAM_MEMBER_2_FRONTEND_UI.md`
   - Member 3: Open `TEAM_MEMBER_3_TESTING_DOCS_DEVOPS.md`

4. **For each task:**
   - Read the task description
   - Copy the **Antigravity Prompt** (labeled in the guide)
   - Paste it into Antigravity IDE
   - Review the generated code
   - Test it locally
   - Commit and push following the Git workflow

5. **Create Pull Request**
   - Follow the PR template in the guide
   - Request review from team lead (you)
   - Wait for approval before merging

### Example Flow for Member 1 (MongoDB Setup):

```bash
# 1. Create branch
git checkout -b database/mongodb-setup

# 2. Open Antigravity and paste this prompt:
"I need to add MongoDB support to the TopoForge backend. Please:
1. Add dependencies to backend/requirements.txt
2. Create backend/database/connection.py with MongoDB connection
3. Create backend/database/models.py with User and AnomalyLog models
..."

# 3. Wait for Antigravity to generate files

# 4. Test the code
cd backend
pip install -r requirements.txt
python main.py

# 5. Commit and push
git add backend/
git commit -m "feat: Add MongoDB integration with User and AnomalyLog models"
git push origin database/mongodb-setup

# 6. Create PR on GitHub
```

---

## 📞 Communication & Coordination

### Daily/Weekly Sync
- **Daily Stand-up** (5-10 minutes):
  - What did you complete yesterday?
  - What are you working on today?
  - Any blockers?

- **Weekly Review** (30 minutes):
  - Review merged PRs
  - Demo new features
  - Plan next week's tasks
  - Adjust timeline if needed

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
- **Pull Request Comments**: For code review discussions
- **Team Chat** (Discord/Slack): For quick questions and coordination
- **Documentation**: For decisions and architecture

---

## 🔗 Integration Checkpoints

### Checkpoint 1: Week 2 (Backend & Frontend Connection)
**Goal**: Frontend can call backend APIs

**Test**:
```bash
# Backend running on port 8000
cd backend && python main.py

# Frontend running on port 5173
npm run dev

# Test API call from frontend
curl http://localhost:8000/api/anomalies
```

**Success criteria**: Frontend dashboard displays anomaly data from backend

---

### Checkpoint 2: Week 3 (Full Stack + Tests)
**Goal**: All components work together with tests passing

**Test**:
```bash
# Run all tests
npm run test              # Frontend tests (Member 2's work tested by Member 3)
cd backend && pytest      # Backend tests (Member 1's work tested by Member 3)

# Run with Docker
docker-compose up --build
```

**Success criteria**:
- All tests pass
- Docker Compose brings up all services
- Can access app at http://localhost:5173
- Can call APIs at http://localhost:8000

---

### Checkpoint 3: Week 4 (Submission Ready)
**Goal**: Project meets all submission requirements

**Verification**:
- [ ] DFDs present in `docs/architecture/`
- [ ] Database schema in `docs/database/`
- [ ] All team members have 15+ commits each
- [ ] Multiple PRs from each member (all merged)
- [ ] No direct commits to main (check git history)
- [ ] Full project runs via `docker-compose up`
- [ ] README updated with all features
- [ ] Tests passing with required coverage

---

## 🐛 Common Integration Issues

### Issue 1: CORS errors when frontend calls backend
**Symptoms**: Browser console shows "CORS policy blocked"

**Solution** (Member 1):
```python
# backend/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Issue 2: Frontend can't connect to MongoDB
**Symptoms**: Frontend gets 500 errors

**Solution**: Frontend should NOT connect to MongoDB directly
- Member 1: Expose data via APIs
- Member 2: Call APIs, not database
- MongoDB should only be accessed by backend

---

### Issue 3: Tests failing in CI but passing locally
**Symptoms**: GitHub Actions shows red X

**Solution** (Member 3):
- Check Node/Python versions match between local and CI
- Ensure all dependencies in package.json/requirements.txt
- Add any system dependencies to CI workflow
- Check for environment-specific code (file paths, etc.)

---

## 📈 Progress Tracking

### Use GitHub Project Board

Create columns:
- **Backlog**: All tasks from individual guides
- **In Progress**: Currently being worked on
- **Review**: PR created, awaiting approval
- **Done**: PR merged

Each team member should:
1. Move their tasks to "In Progress" when starting
2. Create PR and move to "Review" when ready
3. You (team lead) review and merge, moving to "Done"

---

## 🎯 Success Metrics

The project is successful when:

### Code Quality
- [ ] Frontend: 80%+ test coverage
- [ ] Backend: 75%+ test coverage
- [ ] No linting errors
- [ ] All CI checks pass

### Functionality
- [ ] User can register and login
- [ ] Dashboard shows real-time anomalies
- [ ] 3D visualization is interactive
- [ ] Mobile responsive
- [ ] Data exports work

### Documentation
- [ ] All 3 levels of DFDs complete
- [ ] Database schema diagram accurate
- [ ] API documentation comprehensive
- [ ] README explains project clearly

### Git Practices
- [ ] Each member has 15+ commits
- [ ] All commits have meaningful messages
- [ ] No direct commits to main
- [ ] All major features have PRs

### Team Contribution
- [ ] Member 1: 20+ commits, 5-8 PRs (backend/database code)
- [ ] Member 2: 25+ commits, 6-10 PRs (frontend/UI code)
- [ ] Member 3: 30+ commits, 8-12 PRs (tests/docs/devops code)

---

## 📚 Resources for Everyone

### Git & GitHub
- **Git Basics**: https://git-scm.com/book/en/v2
- **GitHub Flow**: https://guides.github.com/introduction/flow/
- **Writing Good Commits**: https://chris.beams.io/posts/git-commit/

### Project Management
- **GitHub Projects**: https://docs.github.com/en/issues/planning-and-tracking-with-projects

### Code Review
- **Best Practices**: https://google.github.io/eng-practices/review/

---

## 🚨 Escalation Path

If team members encounter issues:

1. **Check the guide** - Most common issues are addressed in individual guides
2. **Search GitHub Issues** - Someone else may have had the same problem
3. **Ask in team chat** - Other members might know the answer
4. **Create a GitHub Issue** - Document the problem for team lead
5. **Contact team lead (you)** - For blocking issues

---

## ✅ Pre-Submission Checklist

Before submitting for Round 2, verify:

### Documentation
- [ ] `README.md` explains the project clearly
- [ ] `docs/architecture/DFD_LEVEL_0.md` exists (Context Diagram)
- [ ] `docs/architecture/DFD_LEVEL_1.md` exists (System Level)
- [ ] `docs/architecture/DFD_LEVEL_2.md` exists (Detailed Level)
- [ ] `docs/database/DATABASE_SCHEMA.md` exists with ER diagram
- [ ] `docs/api/API_REFERENCE.md` exists
- [ ] `docs/DEPLOYMENT.md` exists

### Code
- [ ] All code is functional (no placeholder/stub code)
- [ ] Environment variables in `.env.example` (not `.env`)
- [ ] No hardcoded secrets or API keys
- [ ] All dependencies listed (package.json, requirements.txt)

### Testing
- [ ] Tests pass: `npm test` and `pytest`
- [ ] Coverage reports generated
- [ ] CI pipeline runs successfully

### Git History
- [ ] Each member visible in commit history (`git log --all --graph`)
- [ ] PR history shows reviews and discussions
- [ ] No single massive commit (incremental development visible)
- [ ] Meaningful commit messages throughout

### Deployment
- [ ] Docker Compose works: `docker-compose up`
- [ ] All services start without errors
- [ ] Application accessible in browser

---

## 🎉 Final Notes

**For Team Members:**
You don't need to be experts in everything. Your individual guides are designed to make you productive with Antigravity IDE by providing ready-to-use prompts. Focus on your area, ask questions, and collaborate.

**For You (Team Lead):**
Your job is to:
1. **Distribute these guides** to your team members
2. **Review PRs** as they come in (use the checklists)
3. **Coordinate integration** at the checkpoints
4. **Unblock team members** when they're stuck
5. **Ensure submission compliance** with the requirements

Each guide is structured so team members can work independently most of the time, minimizing dependency on you. The Antigravity prompts are comprehensive enough that even beginners can contribute meaningful code.

---

**Good luck to your team! 🚀**

With clear responsibilities, detailed guides, and AI assistance via Antigravity, your team is set up for success. Remember: communication is key, incremental progress is better than perfection, and every contribution counts!

---

## 📋 Quick Reference

| Guide File | For | Focus Area |
|------------|-----|------------|
| `TEAM_MEMBER_1_DATABASE_BACKEND.md` | Database Developer | MongoDB, FastAPI, Auth |
| `TEAM_MEMBER_2_FRONTEND_UI.md` | Frontend Developer | React, UI/UX, Visualizations |
| `TEAM_MEMBER_3_TESTING_DOCS_DEVOPS.md` | QA & DevOps | Tests, DFDs, CI/CD |
| `TEAM_COORDINATOR_GUIDE.md` (this file) | Team Lead | Coordination, Integration |
