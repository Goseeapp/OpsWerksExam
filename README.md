# Gadget Management System

A full-stack application for managing gadgets with real-time updates. Built with Django REST Framework, Next.js, and PostgreSQL, all containerized with Docker.

## Features

- **User Authentication** - JWT-based authentication using HttpOnly cookies
- **Gadget CRUD Operations** - Create, read, update, and delete gadgets
- **Real-time Updates** - WebSocket integration for instant updates across browser tabs
- **Bulk Operations** - Select multiple gadgets and delete them at once
- **Responsive UI** - Built with Mantine UI components

---

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Make (optional, for convenience commands)

### How to Start

```bash
# Start all services
make start
```

Or without Make:

```bash
docker-compose up -d
```

Wait for all services to start (this may take a moment on first run), then access:

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:8000>

---

## Default Credentials

| Username       | Password      | Email              |
|----------------|---------------|--------------------|
| juandelacruz   | password123   | juan@example.com   |
| mariaclarita   | password123   | maria@example.com  |

---

## Ports Used

| Service            | Port |
|--------------------|------|
| Frontend (Next.js) | 3000 |
| Backend (Django)   | 8000 |
| PostgreSQL         | 5432 |

---

## Project Structure

```text
/
├── backend/                          # Django REST API
│   ├── config/                       # Django project settings
│   │   ├── settings.py               # Main configuration
│   │   ├── urls.py                   # URL routing
│   │   └── asgi.py                   # ASGI config for WebSocket
│   ├── users/                        # User authentication app
│   │   ├── views.py                  # Login endpoint
│   │   ├── serializers.py            # User serializers
│   │   └── urls.py                   # Auth URL routing
│   ├── gadgets/                      # Gadgets CRUD app
│   │   ├── models.py                 # Gadget model
│   │   ├── views.py                  # CRUD ViewSet
│   │   ├── serializers.py            # Gadget serializers
│   │   ├── consumers.py              # WebSocket consumer
│   │   └── routing.py                # WebSocket routing
│   ├── fixtures/                     # Sample data
│   │   └── fixtures.json
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                         # Next.js application
│   ├── src/
│   │   ├── app/                      # Next.js app router
│   │   │   ├── page.tsx              # Login page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── gadgets/
│   │   │       └── page.tsx          # Gadgets list page
│   │   ├── components/               # React components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── GadgetTable.tsx
│   │   │   ├── GadgetModal.tsx
│   │   │   └── CreateGadgetModal.tsx
│   │   ├── lib/                      # Utilities
│   │   │   ├── api.ts                # API client
│   │   │   └── auth.ts               # Auth helpers
│   │   └── providers/
│   │       └── MantineProvider.tsx
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml                # Docker services config
├── Makefile                          # Convenience commands
├── .env.example                      # Environment template
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint            | Description                 |
|--------|---------------------|-----------------------------|
| POST   | `/api/auth/login/`  | Login with username/password |
| POST   | `/api/auth/refresh/`| Refresh access token        |
| GET    | `/api/auth/me/`     | Get current user info       |
| POST   | `/api/auth/logout/` | Clear auth cookies          |

**Login Request:**

```json
{
  "username": "juandelacruz",
  "password": "password123"
}
```

Note: For compatibility, the backend also accepts `uername` as an alias for `username`.

**Login Response:**

```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "id": 1,
    "username": "juandelacruz",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "Dela Cruz"
  }
}
```

### Gadgets

| Method | Endpoint                   | Description                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/api/gadgets/`            | List all gadgets for authenticated user |
| POST   | `/api/gadgets/`            | Create a new gadget                  |
| GET    | `/api/gadgets/{id}/`       | Get gadget details                   |
| PATCH  | `/api/gadgets/{id}/`       | Update a gadget                      |
| DELETE | `/api/gadgets/{id}/`       | Delete a gadget                      |
| POST   | `/api/gadgets/bulk_delete/`| Bulk delete gadgets                  |

**Gadget Fields:**

- `id` - Unique identifier (auto-generated)
- `name` - Gadget name (required)
- `description` - Gadget description (optional)
- `created` - Creation timestamp (auto-generated)
- `last_modified` - Last modification timestamp (auto-updated)

### WebSocket

Connect to `ws://localhost:8000/ws/gadgets/?token=<access_token>` for real-time updates.

**Message Types:**

```json
{"action": "created", "gadget_id": 1, "gadget": {...}}
{"action": "updated", "gadget_id": 1, "gadget": {...}}
{"action": "deleted", "gadget_id": 1}
{"action": "bulk_deleted", "ids": [1, 2, 3]}
```

---

## Makefile Commands

| Command              | Description                        |
|----------------------|------------------------------------|
| `make start`         | Start all services                 |
| `make stop`          | Stop all services                  |
| `make build`         | Build Docker containers            |
| `make restart`       | Restart all services               |
| `make migrate`       | Run database migrations            |
| `make fixtures`      | Load sample data                   |
| `make logs`          | View all logs                      |
| `make logs-backend`  | View backend logs only             |
| `make logs-frontend` | View frontend logs only            |
| `make shell`         | Open Django shell                  |
| `make superuser`     | Create a Django superuser          |
| `make status`        | Check service status               |
| `make clean`         | Remove all containers and volumes  |
| `make rebuild`       | Clean, rebuild, and start          |

---

## Technology Stack

### Backend

- Django 4.2
- Django REST Framework
- Django Channels (WebSocket support)
- SimpleJWT (JWT Authentication)
- PostgreSQL
- Daphne (ASGI server)

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Mantine UI v7
- React Hooks

### Infrastructure

- Docker & Docker Compose
- PostgreSQL 15

---

## Development

### Backend Development

```bash
# Enter backend container
docker-compose exec backend bash

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Django shell
python manage.py shell

# Load sample data
python manage.py setup_data
```

### Frontend Development

```bash
# Enter frontend container
docker-compose exec frontend sh

# Install new dependencies
npm install <package>

# Check for lint errors
npm run lint
```

---

## Environment Variables

Copy `.env.example` to `.env` and customize as needed:

```bash
cp .env.example .env
```

| Variable                 | Default Value                      | Description              |
|--------------------------|------------------------------------|--------------------------|
| `DJANGO_SECRET_KEY`      | (auto-generated for dev)           | Django secret key        |
| `DEBUG`                  | `True`                             | Debug mode               |
| `POSTGRES_DB`            | `gadgets_db`                       | Database name            |
| `POSTGRES_USER`          | `postgres`                         | Database user            |
| `POSTGRES_PASSWORD`      | `postgres`                         | Database password        |
| `NEXT_PUBLIC_API_URL`    | `http://localhost:8000`            | Backend API URL          |
| `NEXT_PUBLIC_WS_URL`     | `ws://localhost:8000`              | WebSocket URL            |

---

## Troubleshooting

### Services not starting

```bash
# Check logs for errors
make logs

# Rebuild containers from scratch
make rebuild
```

### Database connection issues

```bash
# Reset the database completely
make clean
make start
```

### WebSocket not connecting

1. Ensure you're using the correct WebSocket URL: `ws://localhost:8000/ws/gadgets/`
2. Check that the access token is valid and not expired
3. Verify the backend is running: `make status`
4. Check backend logs for errors: `make logs-backend`

### Frontend not loading

```bash
# Check frontend logs
make logs-frontend

# Verify Node modules are installed
docker-compose exec frontend npm install
```

---

## License

This project is for demonstration purposes.
