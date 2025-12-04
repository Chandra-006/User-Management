# Docker Quick Start Guide

## 🚀 Quick Commands

### Production Mode
```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development Mode
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

## 📍 Access Points

After starting the services:

- **Frontend**: http://localhost:3000 (production) or http://localhost:5173 (development)
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## 🔧 Using Makefile (Optional)

If you have `make` installed:

```bash
# Production
make prod          # Start production
make logs          # View logs
make down          # Stop services

# Development
make dev           # Start development
make dev-logs      # View dev logs
make dev-down      # Stop dev services

# Utilities
make ps            # Show running containers
make clean         # Clean everything
```

## 📝 Environment Variables

Default credentials:
- **MongoDB**: admin/admin123
- **JWT Secrets**: Change in production!

To customize, edit `docker-compose.yml` or create `.env` file.

## 🐛 Troubleshooting

### Port already in use?
Change ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### Rebuild after code changes?
```bash
docker-compose build --no-cache
docker-compose up -d
```

### View specific service logs?
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Clean everything?
```bash
docker-compose down -v
docker system prune -a
```

## 📚 More Information

See [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md) for detailed documentation.

