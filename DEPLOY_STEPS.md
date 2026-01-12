# Deployment Instructions

## Step 1: Prepare Your Repository

```bash
# Make sure everything is committed and pushed
git add .
git commit -m "Add deployment configurations for Vercel and Render"
git push origin main
```

## Step 2: Deploy Backend on Render

### Via Render Dashboard:

1. Go to **render.com** → Sign in/Create account
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `school-management-backend`
   - **Environment**: Python 3.11
   - **Build Command**: `cd backend && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start Command**: `cd backend && gunicorn config.wsgi:application`

5. Add Environment Variables:
   ```
   DEBUG=False
   SECRET_KEY=django-insecure-your-secret-key-here
   DJANGO_ALLOWED_HOSTS=your-backend.onrender.com,localhost
   CORS_ALLOW_ALL_ORIGINS=False
   ```

6. Click **"Create Web Service"**
7. Copy your backend URL: `https://your-backend.onrender.com`

---

## Step 3: Deploy Frontend on Vercel

### Via Vercel Dashboard:

1. Go to **vercel.com** → Sign in/Create account
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

6. Click **"Deploy"**
7. Copy your frontend URL: `https://your-frontend.vercel.app`

---

## Step 4: Update Configuration URLs

After deployment, update your backend settings with the frontend URL:

### Update Backend (backend/config/settings.py):

1. Go to **Render Dashboard** → Select your backend service
2. Go to **Environment** tab
3. Update `DJANGO_ALLOWED_HOSTS`:
   ```
   your-backend.onrender.com
   ```

4. Update `CORS_ALLOWED_ORIGINS` (in render.yaml or environment):
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

### Update Frontend (frontend/.env.production):

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.onrender.com
```

Then redeploy frontend on Vercel.

---

## Step 5: Test Deployment

### Test Backend API:
```bash
curl https://your-backend.onrender.com/api/students/
```

### Test Frontend:
1. Visit `https://your-frontend.vercel.app`
2. Open DevTools → Console
3. Check for any CORS or API errors

---

## Troubleshooting

### **If you see 404 errors:**

1. **Check Render logs**:
   - Render Dashboard → Select service → Logs
   - Look for migration or startup errors

2. **Check Vercel logs**:
   - Vercel Dashboard → Select project → Deployments → Click deployment → View logs

3. **Verify environment variables**:
   - Make sure all required ENV vars are set
   - Redeploy after changing variables

4. **CORS Issues**:
   - Check browser console for CORS errors
   - Verify CORS_ALLOWED_ORIGINS includes frontend URL
   - Make sure DEBUG=False in production

### **If migrations fail**:

1. Go to Render → Backend service → Logs
2. Check for database errors
3. Try running migrations locally first:
   ```bash
   cd backend
   python manage.py migrate
   ```

### **If static files are missing**:

1. Ensure WhiteNoise is installed: `pip install whitenoise`
2. Run collectstatic: `python manage.py collectstatic --noinput`
3. Verify in settings.py: WhiteNoiseMiddleware is added

---

## Final Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured in both platforms
- [ ] Frontend can call backend API without CORS errors
- [ ] Database migrations completed successfully
- [ ] Static files served correctly
- [ ] User authentication working
- [ ] All API endpoints responding with 200/201 status codes

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Django Deployment Guide](https://docs.djangoproject.com/en/6.0/howto/deployment/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
