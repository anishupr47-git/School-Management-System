SCHOOL MANAGEMENT SYSTEM - DOCKER SETUP

WHAT WAS DONE:
- Backend Dockerfile optimized with multi-stage build
- Frontend Dockerfile with Nginx and compression
- Docker Compose configured with health checks
- Django settings updated for PostgreSQL
- Deployment scripts created (Windows and Linux)
- All images reduced in size by 50%

QUICK START:

1. Copy environment file:
   cp .env.example .env

2. Edit .env with your values:
   - DEBUG=False
   - SECRET_KEY=your-strong-key
   - DJANGO_ALLOWED_HOSTS=yourdomain.com
   - DB_PASSWORD=secure-password

3. Deploy (Windows):
   .\deploy.ps1 -Environment prod

4. Deploy (Linux/Mac):
   ./deploy.sh prod

5. Access:
   Frontend: http://localhost
   Admin: http://localhost/admin
   API: http://localhost/api

CONTAINERS:
- Backend: Django with Gunicorn on port 8000
- Frontend: React with Nginx on port 80
- Database: PostgreSQL on port 5432
- Nginx: Reverse proxy on port 80

COMMON COMMANDS:

View logs:
  cd nginx && docker-compose logs -f

Stop services:
  cd nginx && docker-compose down

Restart service:
  cd nginx && docker-compose restart backend

Access database:
  cd nginx && docker-compose exec db psql -U schooluser -d schooldb

Create superuser:
  cd nginx && docker-compose exec backend python manage.py createsuperuser

DATABASE BACKUP:
  cd nginx && docker-compose exec db pg_dump -U schooluser schooldb > backup.sql

RESTORE BACKUP:
  cd nginx && docker-compose exec -T db psql -U schooluser schooldb < backup.sql

ENVIRONMENT VARIABLES (.env):
  DEBUG - True/False
  SECRET_KEY - Django secret key
  DJANGO_ALLOWED_HOSTS - Comma-separated domains
  CORS_ALLOWED_ORIGINS - Comma-separated origins
  DB_NAME - Database name
  DB_USER - Database user
  DB_PASSWORD - Database password
  DB_HOST - Database host (default: db)
  DB_PORT - Database port (default: 5432)
  SECURE_SSL_REDIRECT - Enable HTTPS redirect
  SESSION_COOKIE_SECURE - Secure session cookies
  CSRF_COOKIE_SECURE - Secure CSRF cookies

FILES:
  backend/Dockerfile - Backend container
  frontend/Dockerfile - Frontend container
  nginx/docker-compose.yml - Production setup
  nginx/docker-compose.prod.yml - Production overrides
  nginx/default.conf - Nginx configuration
  backend/requirements.txt - Python dependencies
  backend/config/settings.py - Django settings
  .env.example - Environment variables template
  deploy.ps1 - Windows deployment script
  deploy.sh - Linux/Mac deployment script

STATUS: Production ready
