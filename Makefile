.PHONY: start stop build migrate fixtures logs shell clean restart

# Start all services
start:
	docker-compose up -d
	@echo "Services starting..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo ""
	@echo "Default credentials:"
	@echo "  Username: juandelacruz"
	@echo "  Password: password123"

# Stop all services
stop:
	docker-compose down

# Build containers
build:
	docker-compose build

# Run database migrations
migrate:
	docker-compose exec backend python manage.py migrate

# Load fixtures/sample data
fixtures:
	docker-compose exec backend python manage.py setup_data

# View logs
logs:
	docker-compose logs -f

# View backend logs only
logs-backend:
	docker-compose logs -f backend

# View frontend logs only
logs-frontend:
	docker-compose logs -f frontend

# Django shell
shell:
	docker-compose exec backend python manage.py shell

# Create superuser
superuser:
	docker-compose exec backend python manage.py createsuperuser

# Clean up everything (including volumes)
clean:
	docker-compose down -v --remove-orphans
	docker-compose rm -f

# Restart all services
restart: stop start

# Rebuild and start
rebuild: clean build start

# Check status
status:
	docker-compose ps

# Run backend tests
test:
	docker-compose exec backend python manage.py test
