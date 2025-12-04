# Docker Setup Guide

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### Production Mode

1. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes:**
   ```bash
   docker-compose down -v
   ```

### Development Mode

1. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

2. **View logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

3. **Stop development services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Services

The application consists of three main services:

1. **MongoDB** - Database server
   - Port: 27017
   - Default credentials: admin/admin123

2. **Backend** - Express.js API server
   - Port: 5000
   - Health check: http://localhost:5000/api/users

3. **Frontend** - React.js application
   - Port: 3000 (production) or 5173 (development)
   - URL: http://localhost:3000

## Environment Variables

### Backend Environment Variables

Edit `docker-compose.yml` to set environment variables:

```yaml
environment:
  NODE_ENV: production
  MONGO_URI: mongodb://admin:admin123@mongodb:27017/user-management?authSource=admin
  PORT: 5000
  JWT_ACCESS_SECRET: your_super_secret_access_key_change_in_production
  JWT_REFRESH_SECRET: your_super_secret_refresh_key_change_in_production
```

### Frontend Environment Variables

```yaml
environment:
  VITE_API_URL: http://localhost:5000
```

## Accessing the Application

- **Frontend**: http://localhost:3000 (production) or http://localhost:5173 (development)
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## Useful Docker Commands

### View running containers
```bash
docker-compose ps
```

### View logs for a specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Execute commands in a container
```bash
# Backend container
docker-compose exec backend sh

# MongoDB container
docker-compose exec mongodb mongosh -u admin -p admin123
```

### Rebuild a specific service
```bash
docker-compose build backend
docker-compose up -d backend
```

### Stop a specific service
```bash
docker-compose stop backend
```

### Remove and recreate a service
```bash
docker-compose up -d --force-recreate backend
```

## Data Persistence

MongoDB data is persisted in a Docker volume named `mongodb_data`. To remove all data:

```bash
docker-compose down -v
```

## Troubleshooting

### Port already in use
If ports 3000, 5000, or 27017 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### MongoDB connection issues
Ensure MongoDB container is healthy:
```bash
docker-compose ps
```

Check MongoDB logs:
```bash
docker-compose logs mongodb
```

### Backend not starting
Check backend logs:
```bash
docker-compose logs backend
```

Verify environment variables are set correctly.

### Frontend build fails
Check frontend logs:
```bash
docker-compose logs frontend
```

Ensure all dependencies are installed correctly.

### Clear Docker cache
If you encounter build issues:
```bash
docker-compose build --no-cache
```

## Production Deployment

### 1. Update Environment Variables

Edit `docker-compose.yml` and set:
- Strong JWT secrets
- Secure MongoDB credentials
- Production API URL

### 2. Build and Deploy

```bash
docker-compose up -d --build
```

### 3. Set up Reverse Proxy (Optional)

Use Nginx or Traefik as a reverse proxy for production.

### 4. Enable HTTPS

Configure SSL certificates for production deployment.

## Development Workflow

1. Start development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. Make code changes (files are mounted as volumes)

3. Changes are automatically reflected (hot reload)

4. View logs:
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

## Health Checks

All services include health checks:

- **MongoDB**: Checks if database is responding
- **Backend**: Checks if API is accessible
- **Frontend**: Checks if web server is responding

View health status:
```bash
docker-compose ps
```

## Volumes

- `mongodb_data`: MongoDB database files
- `backend_node_modules`: Backend dependencies (development)
- `frontend_node_modules`: Frontend dependencies (development)
- `./backend/uploads`: Profile images storage
- `./backend/src`: Backend source code (development)
- `./frontend/src`: Frontend source code (development)

## Network

All services communicate through a Docker bridge network named `app-network`.

## Security Notes

1. **Change default MongoDB credentials** in production
2. **Use strong JWT secrets** in production
3. **Don't expose MongoDB port** in production (remove port mapping)
4. **Use environment files** (`.env`) instead of hardcoding secrets
5. **Enable HTTPS** in production

## Cleanup

Remove all containers, networks, and volumes:
```bash
docker-compose down -v
docker system prune -a
```

---

Last Updated: 2024

