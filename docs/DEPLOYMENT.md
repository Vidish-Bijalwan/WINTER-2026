# Deployment Guide

## Docker Deployment

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Steps

1. **Build the images**
   ```bash
   docker-compose build
   ```

2. **Start the services**
   ```bash
   docker-compose up -d
   ```

3. **Verify deployment**
   - Frontend: `http://localhost:80`
   - Backend: `http://localhost:8000`

## Manual Deployment

### Frontend (Vercel/Netlify)

1. Connect your GitHub repository.
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables.

### Backend (AWS/GCP)

1. Provision a VM (EC2/Compute Engine).
2. Install Python 3.10 and dependencies.
3. Run with Gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```
