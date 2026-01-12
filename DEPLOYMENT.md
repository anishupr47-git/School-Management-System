# Deployment Guide - School Management System

## Overview
This project consists of:
- **Backend**: Django REST API
- **Frontend**: React + Vite

## Prerequisites
- Git repository initialized and pushed to GitHub
- Vercel account (for frontend) or Render account (for both)
- Environment variables configured

---

## Option 1: Deploy on Vercel (Frontend) + Render (Backend)

### Backend Deployment on Render

1. **Create a new Web Service on Render.com**
   - Connect your GitHub repository
   - Select your project

2. **Configure Build & Deploy Settings**:
   - **Build Command**: `cd backend && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start Command**: `cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Root Directory**: (leave empty or use `.`)

3. **Set Environment Variables**:
   ```
   DEBUG=False
   ALLOWED_HOSTS=your-app.onrender.com,localhost
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///db.sqlite3
   DJANGO_SETTINGS_MODULE=config.settings
   ```

4. **Update CORS Settings**
   - Edit `backend/config/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-frontend.vercel.app",
       "http://localhost:3000",
   ]
   ```

### Frontend Deployment on Vercel

1. **Connect your GitHub Repository**
   - Go to vercel.com → Import Project
   - Select your repository

2. **Configure Project Settings**:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```

4. **Deploy**
   - Vercel will auto-deploy on every push to main

---

## Option 2: Deploy Both on Render

1. **Create Render Account** and push code to GitHub

2. **Use the render.yaml file** (already created in your repo)
   - Render will automatically detect and use this configuration

3. **Deploy**:
   ```bash
   git push origin main
   ```

4. **Update Environment Variables in Render Dashboard**:
   - Backend service → Environment
   - Frontend service → Environment

---

## Important Configuration Updates

### 1. Update Backend Settings (`backend/config/settings.py`)

Add these to your settings:

```python
import os
from pathlib import Path

# Add your deployed domain
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.vercel.app",
    "https://your-frontend.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173",
]

# Database
if 'DATABASE_URL' in os.environ:
    import dj_database_url
    DATABASES['default'] = dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600
    )

# Security
SECURE_SSL_REDIRECT = not DEBUG
CSRF_TRUSTED_ORIGINS = [
    "https://your-frontend.vercel.app",
    "https://your-frontend.onrender.com",
]
```

### 2. Update Frontend API Calls

In your React components, use:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

fetch(`${API_URL}/api/students/`)
  .then(res => res.json())
  .then(data => console.log(data))
```

### 3. Update vite.config.js (DONE ✓)

Already configured with proxy and proper output settings.

---

## Troubleshooting 404 Errors

### **On Vercel Frontend**:
- ✓ Make sure `vercel.json` is at root
- ✓ Check that `outputDirectory` points to `frontend/dist`
- ✓ Verify the rewrites rule routes SPA requests to `/index.html`
- ✓ Clear Vercel cache and redeploy

### **On Render Backend**:
- ✓ Ensure migrations are run: `python manage.py migrate`
- ✓ Check ALLOWED_HOSTS includes your Render domain
- ✓ Verify CORS_ALLOWED_ORIGINS includes your frontend URL
- ✓ Check logs in Render dashboard for errors

### **On Render Frontend**:
- ✓ Set `VITE_API_URL` environment variable
- ✓ Make sure build command points to `frontend` directory
- ✓ Use `serve` package to serve static files properly

---

## Deployment Checklist

- [ ] Git repository initialized and pushed
- [ ] `vercel.json` created at root
- [ ] `render.yaml` created at root
- [ ] Backend requirements.txt updated (removed Pillow, psycopg2-binary)
- [ ] Frontend package.json has build script
- [ ] Environment variables configured in Render/Vercel
- [ ] CORS settings updated with deployed URLs
- [ ] ALLOWED_HOSTS updated with deployed domain
- [ ] Database migrations run
- [ ] Static files collected
- [ ] Test API endpoints from frontend
- [ ] Check browser console for CORS errors

---

## Quick Deploy Commands

**For Vercel (Frontend Only)**:
```bash
npm install -g vercel
cd frontend
vercel --prod
```

**For Render (Entire Project)**:
```bash
git push origin main
# Render auto-deploys from render.yaml
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on frontend | Check `outputDirectory` in vercel.json |
| 404 on API calls | Verify VITE_API_URL environment variable |
| CORS errors | Update CORS_ALLOWED_ORIGINS in settings.py |
| Static files missing | Run `python manage.py collectstatic` |
| Database errors | Ensure migrations run: `python manage.py migrate` |
| Module not found | Add to requirements.txt: `dj-database-url`, `whitenoise` |

