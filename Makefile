.PHONY: help build up down logs clean restart dev prod

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker images
	docker-compose build

up: ## Start all services in production mode
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

clean: ## Stop services and remove volumes
	docker-compose down -v
	docker system prune -f

restart: ## Restart all services
	docker-compose restart

dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up -d --build

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

prod: ## Start production environment
	docker-compose up -d --build

prod-logs: ## View production logs
	docker-compose logs -f

backend-logs: ## View backend logs
	docker-compose logs -f backend

frontend-logs: ## View frontend logs
	docker-compose logs -f frontend

mongodb-logs: ## View MongoDB logs
	docker-compose logs -f mongodb

ps: ## Show running containers
	docker-compose ps

