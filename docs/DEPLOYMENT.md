# Deployment Guide

This guide covers the deployment strategies for the TopoForge application, including local development with Docker and production deployment options.

## Local Development with Docker

Docker Compose provides the easiest way to spin up the entire stack locally.

### Prerequisites
- Docker Engine 20+
- Docker Compose 2+

### Running the Stack

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```
   This will build the frontend and backend images and start them along with a MongoDB container.

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - MongoDB: localhost:27017

3. **Stop services:**
   ```bash
   docker-compose down
   ```
   To remove volumes (database data):
   ```bash
   docker-compose down -v
   ```

### Logs & Troubleshooting

View logs for specific services:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

---

## Production Deployment

### Option 1: Docker Swarm / Kubernetes / Single VPS

For deployment on a VPS (AWS EC2, DigitalOcean Droplet, Linode) or container orchestrator.

1. **Environment Configuration:**
   Create a `.env` file on the production server based on `.env.example`:
   ```bash
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/topoforge
   JWT_SECRET=complex_production_secret
   ALLOWED_ORIGINS=https://topoforge.com
   ```

2. **Run with Production Compose:**
   It is recommended to use an external managed database (MongoDB Atlas) for production instead of the containerized one.

   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     frontend:
       image: ghcr.io/username/topoforge-frontend:latest
       ports:
         - "80:80"
       restart: always

     backend:
       image: ghcr.io/username/topoforge-backend:latest
       ports:
         - "8000:8000"
       env_file: .env
       restart: always
   ```

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option 2: Cloud PaaS (Vercel + Railway/Render)

#### Frontend (Vercel)
1. Import repository to Vercel
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL`: https://your-backend-url.railway.app

#### Backend (Railway/Render)
1. Import repository
2. Set Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   - `MONGODB_URI`: Connection string from Atlas
   - `JWT_SECRET`: Secure random string
   - `ALLOWED_ORIGINS`: https://your-frontend-project.vercel.app

### Option 3: GitHub Actions CD (Automated)

The repository includes a `.github/workflows/deploy.yml` workflow that automatically builds and pushes Docker images to GitHub Container Registry (GHCR) when a new release tag (`v*`) is pushed.

To trigger a deployment:
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Database Management

### MongoDB Atlas (Recommended)
1. Create a cluster (M0 Sandbox is free)
2. Create a database user
3. Whitelist IP addresses (or allow all `0.0.0.0/0` if using dynamic PaaS IP)
4. Get connection string

### Backup Strategy
- **Atlas**: Enable automatic backups
- **Manual**:
  ```bash
  mongodump --uri="mongodb+srv://..." --archive=backup.gz --gzip
  ```

---

## Monitoring

- **Application Logs**: `docker logs container_id`
- **Error Tracking**: Sentry (integrate in frontend/backend)
- **Performance**: Prometheus + Grafana (backend metrics endpoint available at `/metrics` if configured)
