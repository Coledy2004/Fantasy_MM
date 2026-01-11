# Docker Hosting Guide - Fantasy March Madness

## Prerequisites

1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop
2. Verify installation:
   ```powershell
   docker --version
   docker-compose --version
   ```

---

## Quick Start with Docker Compose (Recommended)

The easiest way to run the app in Docker:

### Build and Run
```powershell
cd c:\Users\coled\OneDrive\Desktop\Fantasy_MM
docker-compose up --build
```

This will:
1. Build the Docker image
2. Start the container
3. Expose the app on **http://localhost:3000**

### Stop the container
```powershell
docker-compose down
```

### View logs
```powershell
docker-compose logs -f
```

---

## Manual Docker Commands

If you prefer not to use docker-compose:

### 1. Build the Docker image
```powershell
cd c:\Users\coled\OneDrive\Desktop\Fantasy_MM
docker build -t fantasy-mm:latest .
```

### 2. Run the container
```powershell
docker run -p 3000:3000 --name fantasy-mm fantasy-mm:latest
```

### 3. Access the app
Open your browser to: **http://localhost:3000**

### 4. Stop the container
```powershell
docker stop fantasy-mm
```

### 5. Remove the container
```powershell
docker rm fantasy-mm
```

### 6. Remove the image
```powershell
docker rmi fantasy-mm:latest
```

---

## Useful Docker Commands

### View running containers
```powershell
docker ps
```

### View all containers (including stopped)
```powershell
docker ps -a
```

### View container logs
```powershell
docker logs fantasy-mm
```

### View container logs in real-time
```powershell
docker logs -f fantasy-mm
```

### Execute command in running container
```powershell
docker exec -it fantasy-mm sh
```

### Inspect container details
```powershell
docker inspect fantasy-mm
```

---

## Development vs Production

### Development (Local - Faster)
```powershell
npm run dev
# Access at http://localhost:3001
```
- Hot module reloading
- See changes instantly
- Better for development

### Production (Docker - Optimized)
```powershell
docker-compose up --build
# Access at http://localhost:3000
```
- Minified and optimized
- Production-ready
- Good for testing final build

---

## Deployment Options

### Local Docker
```powershell
docker-compose up -d  # Run in background
```

### Cloud Platforms

#### AWS (Elastic Container Service)
```powershell
# Push image to ECR first
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag fantasy-mm:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/fantasy-mm:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/fantasy-mm:latest
```

#### Docker Hub
```powershell
docker tag fantasy-mm:latest yourusername/fantasy-mm:latest
docker login
docker push yourusername/fantasy-mm:latest
```

#### DigitalOcean / Heroku
Can pull directly from Docker Hub or AWS ECR

---

## Dockerfile Explanation

The included `Dockerfile` uses a **multi-stage build**:

1. **Builder Stage**
   - Installs dependencies
   - Builds the Vite app for production
   - Creates optimized `dist/` folder

2. **Production Stage**
   - Uses `serve` to run the built app
   - Only includes necessary files
   - Smaller final image size

---

## Docker Compose Features

The included `docker-compose.yml` includes:

- **Port Mapping**: Maps container port 3000 to localhost:3000
- **Health Check**: Monitors container health
- **Restart Policy**: Auto-restarts if it crashes
- **Environment Variables**: Sets NODE_ENV to production

---

## Troubleshooting

### Port already in use
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID 12345 /F
```

### Build fails
```powershell
# Clear Docker cache and rebuild
docker-compose down
docker-compose up --build --no-cache
```

### Container won't start
```powershell
# Check logs
docker logs fantasy-mm

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Out of disk space
```powershell
# Clean up unused Docker resources
docker system prune -a
```

---

## Environment Variables

To add environment variables to the Docker container, edit `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - VITE_API_URL=https://ncaa-api.henrygd.me
```

Or pass via command line:
```powershell
docker run -p 3000:3000 -e NODE_ENV=production fantasy-mm:latest
```

---

## Summary

| Task | Command |
|------|---------|
| Local Dev | `npm run dev` → http://localhost:3001 |
| Build Docker | `docker build -t fantasy-mm . ` |
| Run Docker | `docker run -p 3000:3000 fantasy-mm` |
| Compose Up | `docker-compose up --build` |
| Compose Down | `docker-compose down` |
| View Logs | `docker logs -f fantasy-mm` |
