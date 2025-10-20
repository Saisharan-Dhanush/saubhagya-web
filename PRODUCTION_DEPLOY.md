# 🚀 Production Deployment Guide

## Production Domain
**https://saubhagya.dhanushhealthcare.com**

All backend services are hosted at: `https://saubhagya.dhanushhealthcare.com/{service-context-path}`

---

## Quick Deploy Steps

### 1. **Switch to Production Environment**

```bash
cd D:\Dev\SAUBHAGYA\Web

# Copy production environment file
cp .env.production .env
```

This will automatically configure all 8 services:
- ✅ Auth Service: `https://saubhagya.dhanushhealthcare.com/auth-service`
- ✅ Gaushala Service: `https://saubhagya.dhanushhealthcare.com/gaushala-service`
- ✅ Biogas Service: `https://saubhagya.dhanushhealthcare.com/biogas-service`
- ✅ IoT Service: `https://saubhagya.dhanushhealthcare.com/iot`
- ✅ Commerce Service: `https://saubhagya.dhanushhealthcare.com/commerce-service`
- ✅ Reporting Service: `https://saubhagya.dhanushhealthcare.com/reporting-service`
- ✅ Government Service: `https://saubhagya.dhanushhealthcare.com/government-service`
- ✅ Purification Service: `https://saubhagya.dhanushhealthcare.com/purification-service`

### 2. **Build for Production**

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

### 3. **Deploy**

Upload the entire `dist/` folder to your web server.

---

## Switch Back to Development

```bash
# Copy development environment
cp .env.example .env

# Start dev server
npm run dev
```

---

## Environment Files

- **`.env`** - Active environment (DO NOT COMMIT - in .gitignore)
- **`.env.example`** - Development template (localhost)
- **`.env.production`** - Production template (saubhagya.dhanushhealthcare.com)

---

## URL Pattern

**Development:**
```
http://localhost:{port}/{context-path}
```

**Production:**
```
https://saubhagya.dhanushhealthcare.com/{context-path}
```

### Context Paths:
- `/auth-service` - Port 8081
- `/iot` - Port 8080
- `/biogas-service` - Port 8082
- `/commerce-service` - Port 8083
- `/reporting-service` - Port 8084
- `/government-service` - Port 8085
- `/gaushala-service` - Port 8086
- `/purification-service` - Port 8087

---

## Troubleshooting

### Backend CORS Issue
Make sure backend allows: `https://YOUR-FRONTEND-DOMAIN.com`

Check Spring Boot `@CrossOrigin` annotations or CORS configuration.

### 404 Errors
Verify the context paths match your Spring Boot `application.yml`:
```yaml
server:
  servlet:
    context-path: /gaushala-service  # Must match!
```

### Services Not Responding
Check that all 8 backend services are running on production server:
```bash
curl https://saubhagya.dhanushhealthcare.com/auth-service/actuator/health
curl https://saubhagya.dhanushhealthcare.com/gaushala-service/actuator/health
```

---

## Quick Commands

```bash
# Production Build
cp .env.production .env && npm run build

# Back to Development
cp .env.example .env && npm run dev

# Test Production Build Locally
npm run preview
```

---

## Notes

- ✅ All hardcoded URLs removed
- ✅ Single `.env` file controls everything
- ✅ No code changes needed for deployment
- ✅ WebSocket URLs auto-convert (http→ws, https→wss)
- ✅ All services use environment variables

**Just copy the right `.env` file and build!** 🎉
