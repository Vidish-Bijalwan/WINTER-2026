# Team Member 1: Database & Backend Development

## 👤 Your Role
You are responsible for **Database Architecture** and **Backend API Development**. Your work will enable data persistence, user authentication, and real-time data storage for the TopoForge anomaly detection platform.

---

## 🎯 Your Objectives

### Phase 1: MongoDB Atlas Setup & Integration (Week 1-2)
- Set up MongoDB Atlas cloud database
- Create database schemas for anomaly detection data
- Integrate MongoDB with the Python backend
- Create API endpoints for data persistence

### Phase 2: User Authentication System (Week 3)
- Implement user registration and login APIs
- Add JWT-based authentication
- Create user profile management endpoints

### Phase 3: Data Storage APIs (Week 4)
- Create CRUD APIs for anomaly logs
- Implement data export functionality
- Add historical data query endpoints

---

## 📋 Detailed Tasks

### Task 1: MongoDB Atlas Setup
**What you'll do:**
1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Set up a new cluster (M0 Free Tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

**Deliverables:**
- Screenshot of MongoDB Atlas dashboard showing your cluster
- Connection string saved in `.env` file (DO NOT COMMIT THIS)

---

### Task 2: Install MongoDB Dependencies
**What you'll do:**
Add MongoDB driver to the Python backend

**Files to modify:**
- `backend/requirements.txt`

**Code changes:**
Add these lines to `backend/requirements.txt`:
```
pymongo==4.6.1
python-dotenv==1.0.0
motor==3.3.2
```

**How to use Antigravity for this:**
When you open Antigravity IDE, copy-paste this EXACT prompt:

```
I need to add MongoDB support to the TopoForge backend. Please:

1. Add the following dependencies to backend/requirements.txt:
   - pymongo==4.6.1
   - python-dotenv==1.0.0
   - motor==3.3.2

2. Create a new file backend/database/connection.py with:
   - MongoDB connection class using motor (async driver)
   - Connection string should be loaded from MONGODB_URI environment variable
   - Include proper error handling and connection pooling
   - Add a function to test the connection

3. Create backend/database/models.py with:
   - AnomalyLog model (timestamp, source, betti_numbers, severity, metadata)
   - User model (username, email, password_hash, created_at, role)
   - Session model (user_id, token, expires_at)

4. Create backend/.env.example file showing the required environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - DATABASE_NAME

Please implement all files with proper async/await patterns and type hints.
```

**Expected results:** Antigravity will create 3 new files and modify requirements.txt

---

### Task 3: Create Database Schemas
**What you'll do:**
Define MongoDB collections for storing anomaly detection data

**New files to create:**
- `backend/database/__init__.py`
- `backend/database/connection.py`
- `backend/database/models.py`
- `backend/database/schemas.py`

**Antigravity Prompt:**
```
Create MongoDB schemas for the TopoForge anomaly detection system. I need:

1. backend/database/connection.py:
   - MongoDBConnection class with singleton pattern
   - async connect() and disconnect() methods
   - get_database() method returning database instance
   - Connection pooling with minimum 10, maximum 50 connections

2. backend/database/schemas.py:
   - Define Pydantic models for validation:
     * AnomalyLogSchema: id, timestamp, source_type, event_data, betti_h0, betti_h1, betti_h2, anomaly_score, is_anomaly, metadata
     * UserSchema: id, username, email, hashed_password, role (admin/viewer), created_at, last_login
     * AlertConfigSchema: id, user_id, threshold, notification_channels, is_active

3. backend/database/models.py:
   - Create collection wrapper classes with CRUD operations:
     * AnomalyLogModel with methods: create_log(), get_logs_by_timeframe(), get_anomalies_only(), export_to_csv()
     * UserModel with methods: create_user(), authenticate(), update_profile()
     * AlertConfigModel with methods: create_config(), get_user_configs(), update_config()

All models should use async operations with motor library. Include proper indexing for timestamp and source_type fields.
```

---

### Task 4: Create API Endpoints
**What you'll do:**
Build REST API endpoints for database operations

**Files to create:**
- `backend/api/routes/anomalies.py`
- `backend/api/routes/users.py`
- `backend/api/routes/auth.py`

**Antigravity Prompt:**
```
Create REST API endpoints for TopoForge using FastAPI. I need:

1. backend/api/routes/anomalies.py:
   POST /api/anomalies - Create new anomaly log entry
   GET /api/anomalies - Get paginated anomaly logs (query params: start_date, end_date, source, page, limit)
   GET /api/anomalies/{id} - Get specific anomaly by ID
   GET /api/anomalies/stats - Get statistics (total anomalies, by source, severity distribution)
   GET /api/anomalies/export - Export anomalies to CSV
   DELETE /api/anomalies/{id} - Delete anomaly record

2. backend/api/routes/auth.py:
   POST /api/auth/register - Register new user (username, email, password)
   POST /api/auth/login - Login user (return JWT token)
   POST /api/auth/logout - Logout user (invalidate token)
   GET /api/auth/me - Get current user profile
   POST /api/auth/refresh - Refresh JWT token

3. backend/api/routes/users.py:
   GET /api/users - Get all users (admin only)
   GET /api/users/{id} - Get user by ID
   PUT /api/users/{id} - Update user profile
   DELETE /api/users/{id} - Delete user (admin only)

4. Update backend/main.py to:
   - Include these routers
   - Add CORS middleware
   - Add exception handlers
   - Add authentication middleware using JWT

Use proper HTTP status codes, request validation with Pydantic, and include OpenAPI documentation tags.
```

---

### Task 5: Implement Authentication
**What you'll do:**
Add JWT-based authentication system

**Files to create:**
- `backend/auth/jwt_handler.py`
- `backend/auth/password_utils.py`
- `backend/middleware/auth_middleware.py`

**Antigravity Prompt:**
```
Implement JWT authentication system for TopoForge backend:

1. backend/auth/jwt_handler.py:
   - create_access_token(user_id, username, role) - Generate JWT with 24hr expiry
   - decode_access_token(token) - Validate and decode JWT
   - create_refresh_token(user_id) - Generate refresh token with 7-day expiry
   Use JWT_SECRET from environment variables

2. backend/auth/password_utils.py:
   - hash_password(plain_password) - Hash password using bcrypt
   - verify_password(plain_password, hashed_password) - Verify password
   Use bcrypt with salt rounds = 12

3. backend/middleware/auth_middleware.py:
   - AuthMiddleware class that:
     * Extracts JWT from Authorization header
     * Validates token
     * Attaches user info to request.state.user
     * Returns 401 if invalid/missing token
   - require_role(role) decorator for role-based access control

4. Add these dependencies to backend/requirements.txt:
   - PyJWT==2.8.0
   - bcrypt==4.1.2
   - python-jose[cryptography]==3.3.0

Include proper error handling for expired tokens, invalid signatures, and missing tokens.
```

---

### Task 6: Database Indexing & Optimization
**What you'll do:**
Create database indexes for better query performance

**Antigravity Prompt:**
```
Create database optimization script for TopoForge MongoDB:

1. Create backend/database/indexes.py with:
   - Function create_indexes() that creates:
     * Compound index on (timestamp, source_type) for anomalies collection
     * Index on email (unique) for users collection
     * Index on user_id for sessions collection
     * Index on expires_at for automatic session cleanup (TTL index)
   
2. Create backend/scripts/setup_database.py that:
   - Connects to MongoDB
   - Creates all required collections
   - Sets up indexes
   - Creates an admin user (username: admin, email: admin@topoforge.com)
   - Prints success message with connection details

3. Add async initialization in backend/main.py:
   - Call create_indexes() on application startup
   - Log successful database connection

Include proper error handling and logging for all database operations.
```

---

### Task 7: Real-time Data Storage Integration
**What you'll do:**
Modify the TDA engine to save anomalies to MongoDB

**Files to modify:**
- `backend/tda_engine.py` (or wherever anomaly detection logic exists)

**Antigravity Prompt:**
```
Integrate MongoDB storage with TopoForge's real-time anomaly detection:

1. Modify backend/tda_engine.py (or the main processing file):
   - Import AnomalyLogModel from database.models
   - After detecting an anomaly, call AnomalyLogModel.create_log() with:
     * timestamp: current UTC time
     * source_type: data source name (wikipedia, twitter, etc.)
     * event_data: raw event information
     * betti_h0, betti_h1, betti_h2: computed Betti numbers
     * anomaly_score: computed anomaly score
     * is_anomaly: boolean flag
     * metadata: any additional context
   
2. Create backend/api/routes/realtime.py:
   - GET /api/realtime/stream - SSE endpoint for real-time anomalies
   - Streams new anomaly detections as they occur
   - Includes rate limiting (max 100 events/minute)

3. Add WebSocket support in backend/main.py:
   - WebSocket endpoint at /ws/anomalies
   - Broadcasts anomaly events to connected clients
   - Include connection management (connect, disconnect, broadcast)

Ensure all database writes are async and don't block the real-time processing pipeline.
```

---

### Task 8: Create Database Schema Diagrams
**What you'll do:**
Create visual diagrams of your database structure

**Antigravity Prompt:**
```
Create comprehensive database documentation for TopoForge:

1. Create docs/DATABASE_SCHEMA.md with:
   - Mermaid ER diagram showing:
     * Users collection (fields, types, indexes)
     * AnomalyLogs collection (fields, types, indexes)
     * Sessions collection (fields, types, indexes)
     * AlertConfigs collection (fields, types, indexes)
     * Relationships between collections (user_id foreign keys)
   
   - For each collection, document:
     * Field names and types
     * Required vs optional fields
     * Default values
     * Indexes (what fields, index type)
     * Example document in JSON format
   
2. Add section on "Data Retention Policy":
   - Anomaly logs: 90 days
   - Sessions: 7 days (auto-delete with TTL)
   - User data: Indefinite (until manual deletion)

3. Add section on "Backup Strategy":
   - MongoDB Atlas automatic backups (daily)
   - Point-in-time recovery window
   - Export endpoints for manual backups

Use mermaid diagrams, tables, and code blocks for clarity.
```

---

## 🔁 Git Workflow (Step-by-Step)

### First Time Setup

1. **Install Git** (if not already installed):
   ```bash
   # Check if git is installed
   git --version
   
   # If not, install it:
   # Ubuntu/Debian: sudo apt install git
   # Mac: brew install git
   # Windows: Download from git-scm.com
   ```

2. **Configure Git**:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Clone the Repository**:
   ```bash
   cd ~/Documents  # or wherever you want the project
   git clone https://github.com/Vidish-Bijalwan/WINTER-2026.git
   cd WINTER-2026
   ```

---

### For Each Task

**Step 1: Create a New Branch**
```bash
# Always start from main branch
git checkout main
git pull origin main  # Get latest changes

# Create your feature branch (use descriptive names)
git checkout -b database/mongodb-integration

# Branch naming convention:
# database/mongodb-setup
# database/auth-endpoints
# database/schema-design
```

**Step 2: Make Your Changes**
- Open Antigravity IDE
- Provide the prompt from the task
- Let Antigravity create/modify files
- Review the changes

**Step 3: Test Your Changes**
```bash
# Install new dependencies
cd backend
pip install -r requirements.txt

# Run the backend
python main.py

# Test the API endpoints using curl or Postman
curl http://localhost:8000/api/anomalies
```

**Step 4: Commit Your Changes**
```bash
# See what files changed
git status

# Add files to staging
git add backend/database/
git add backend/api/routes/
git add backend/requirements.txt
# Or add all changes: git add .

# Commit with descriptive message
git commit -m "feat: Add MongoDB integration and anomaly log APIs

- Created database connection with motor
- Implemented AnomalyLog and User models
- Added CRUD API endpoints for anomalies
- Configured JWT authentication
- Added database indexes for performance"
```

**Commit Message Format:**
```
<type>: <short description>

<detailed description>
- Bullet points of changes
- What was added
- What was modified

<type> can be:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code refactoring
- test: Adding tests
```

**Step 5: Push Your Branch**
```bash
# Push your branch to GitHub
git push origin database/mongodb-integration

# If this is your first push, you might need:
git push -u origin database/mongodb-integration
```

**Step 6: Create a Pull Request**
1. Go to https://github.com/Vidish-Bijalwan/WINTER-2026
2. Click "Compare & pull request" button (should appear after push)
3. Fill in PR details:
   - Title: "Database: MongoDB Integration and API Endpoints"
   - Description:
     ```
     ## What does this PR do?
     - Adds MongoDB Atlas integration
     - Creates database models for anomaly logs and users
     - Implements REST API endpoints for CRUD operations
     - Adds JWT authentication system
     
     ## How to test?
     1. Set MONGODB_URI in backend/.env
     2. Run: cd backend && python main.py
     3. Test endpoints: curl http://localhost:8000/docs
     
     ## Related Issues
     Addresses database integration requirements for Round 2
     ```
4. Click "Create Pull Request"
5. Request review from team lead (you)

**Step 7: After PR is Approved**
```bash
# Switch back to main
git checkout main

# Pull the merged changes
git pull origin main

# Delete your local branch (optional, keeps things clean)
git branch -d database/mongodb-integration
```

---

## 📝 Checklist for Each Task

Before creating a PR, verify:

- [ ] Code runs without errors
- [ ] All new dependencies are in requirements.txt  
- [ ] No sensitive data (passwords, API keys) in committed files
- [ ] Used .env for secrets, .env.example checked in
- [ ] API endpoints tested with curl/Postman
- [ ] Database queries are properly indexed
- [ ] Added error handling for database operations
- [ ] Commit messages are descriptive
- [ ] Branch name follows convention: `database/<feature-name>`
- [ ] PR description explains what and why

---

## 🎓 Learning Resources

### Git Basics
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Interactive Git Tutorial**: https://learngitbranching.js.org/

### MongoDB
- **MongoDB University (Free)**: https://university.mongodb.com/
- **MongoDB with Python**: https://pymongo.readthedocs.io/

### FastAPI
- **Official Tutorial**: https://fastapi.tiangolo.com/tutorial/
- **Authentication Guide**: https://fastapi.tiangolo.com/tutorial/security/

---

## 🆘 Common Issues & Solutions

### Issue 1: "Permission denied (publickey)" when pushing
**Solution:**
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/Vidish-Bijalwan/WINTER-2026.git

# Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Issue 2: Merge conflicts
**Solution:**
```bash
# Update your branch with latest main
git checkout main
git pull origin main
git checkout your-branch-name
git merge main

# Resolve conflicts in files (look for <<<<<<, ======, >>>>>> markers)
# After resolving:
git add .
git commit -m "fix: Resolve merge conflicts with main"
git push origin your-branch-name
```

### Issue 3: MongoDB connection fails
**Solution:**
- Check if IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for development)
- Verify MONGODB_URI format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- Check database user has read/write permissions

### Issue 4: Accidentally committed sensitive data
**Solution:**
```bash
# Remove file from git but keep locally
git rm --cached backend/.env
echo "backend/.env" >> .gitignore
git commit -m "fix: Remove .env from version control"
git push origin your-branch-name

# If already pushed, notify team lead to rotate credentials
```

---

## 📊 Success Metrics

Your work is successful when:
- ✅ MongoDB Atlas cluster is running and accessible
- ✅ Backend can connect to database without errors
- ✅ All API endpoints return proper responses
- ✅ Authentication system works (login returns JWT token)
- ✅ Anomaly logs are being saved to database in real-time
- ✅ Database schema diagram is in docs/DATABASE_SCHEMA.md
- ✅ All commits show your name in git history
- ✅ At least 3 merged PRs with substantial code changes

---

## 🕒 Estimated Timeline

| Week | Tasks | Deliverables |
|------|-------|--------------|
| **Week 1** | Tasks 1-3 | MongoDB setup, schemas, models |
| **Week 2** | Tasks 4-5 | API endpoints, authentication |
| **Week 3** | Tasks 6-7 | Optimization, real-time integration |
| **Week 4** | Task 8 | Documentation, diagrams, testing |

---

## 📞 Support

**Having trouble?** 
1. Check the "Common Issues" section above
2. Ask in team chat/Discord
3. Review Antigravity's suggestions carefully
4. Check GitHub Issues for similar problems

**Remember:** Every developer gets stuck sometimes. The key is to ask for help early rather than struggling alone!

---

## ✅ Final Deliverables Checklist

By the end of your work, you should have:

- [ ] MongoDB Atlas cluster configured and running
- [ ] Database schemas implemented (Users, AnomalyLogs, Sessions, AlertConfigs)
- [ ] Database connection module with pooling
- [ ] 15+ API endpoints across 3 route files
- [ ] JWT authentication middleware
- [ ] Database indexes for performance
- [ ] Real-time anomaly logging integrated
- [ ] DATABASE_SCHEMA.md with ER diagrams
- [ ] At least 20+ commits with your name
- [ ] 5-8 merged pull requests
- [ ] All code follows async/await patterns
- [ ] No sensitive data in repository
- [ ] API documentation in /docs endpoint

---

**Good luck! You've got this! 🚀**

Every line of code you write is a contribution to something bigger. Don't be afraid to experiment, make mistakes, and learn. That's how great engineers are made.
