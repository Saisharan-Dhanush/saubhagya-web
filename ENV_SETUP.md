# Environment Configuration Guide

This guide explains how to configure backend service URLs for the SAUBHAGYA Web Admin Dashboard.

## Quick Start

### Development Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. The default values in `.env` are already configured for local development (localhost)

3. Start the development server:
   ```bash
   npm run dev
   ```

### Production Environment

1. Copy the production environment template:
   ```bash
   cp .env.production .env
   ```

2. Update the URLs in `.env` to point to your production servers:
   ```env
   VITE_AUTH_SERVICE_URL=https://api.yourdomain.com/auth-service
   VITE_GAUSHALA_SERVICE_URL=https://api.yourdomain.com/gaushala-service
   # ... update all other services
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

### Service URLs

| Variable | Default (Dev) | Production | Description |
|----------|---------------|------------|-------------|
| `VITE_AUTH_SERVICE_URL` | `http://localhost:8081/auth-service` | `https://saubhagya.dhanushhealthcare.com/auth-service` | Authentication service |
| `VITE_IOT_SERVICE_URL` | `http://localhost:8080/iot` | `https://saubhagya.dhanushhealthcare.com/iot` | IoT device management |
| `VITE_BIOGAS_SERVICE_URL` | `http://localhost:8082` | `https://saubhagya.dhanushhealthcare.com/biogas-service` | Biogas operations |
| `VITE_COMMERCE_SERVICE_URL` | `http://localhost:8083` | `https://saubhagya.dhanushhealthcare.com/commerce-service` | Commerce & sales |
| `VITE_REPORTING_SERVICE_URL` | `http://localhost:8084` | `https://saubhagya.dhanushhealthcare.com/reporting-service` | Analytics & reporting |
| `VITE_GOVERNMENT_SERVICE_URL` | `http://localhost:8085` | `https://saubhagya.dhanushhealthcare.com/government-service` | Government dashboard |
| `VITE_GAUSHALA_SERVICE_URL` | `http://localhost:8086/gaushala-service` | `https://saubhagya.dhanushhealthcare.com/gaushala-service` | Gaushala management |
| `VITE_PURIFICATION_SERVICE_URL` | `http://localhost:8087/purification-service` | `https://saubhagya.dhanushhealthcare.com/purification-service` | Biogas purification |

### API Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_TIMEOUT` | `15000` | API request timeout (ms) |
| `VITE_API_RETRIES` | `3` | Number of retry attempts |
| `VITE_API_RETRY_DELAY` | `1000` | Delay between retries (ms) |
| `VITE_ENV` | `development` | Current environment |
| `VITE_DEBUG` | `true` | Enable debug logging |

## File Structure

```
Web/
├── .env                    # Local environment (gitignored)
├── .env.example            # Template for development
├── .env.production         # Template for production
├── .gitignore              # Excludes .env files
└── src/
    └── services/
        ├── api.ts          # Uses VITE_AUTH_SERVICE_URL
        └── microservices/
            └── index.ts    # Service registry with env variables
```

## Important Notes

### Security
- **Never commit `.env` files to git** - they are excluded via `.gitignore`
- Only commit `.env.example` and `.env.production` templates
- Keep production URLs and secrets secure

### Vite Environment Variables
- All environment variables **must** start with `VITE_` to be exposed to the frontend
- Variables are replaced at build time, not runtime
- After changing `.env`, restart the dev server

### Switching Environments

**Development:**
```bash
# Uses .env file
npm run dev
```

**Production:**
```bash
# Uses .env.production file
npm run build
npm run preview
```

**Custom Environment:**
```bash
# Create .env.staging
VITE_ENV=staging npm run build
```

## Troubleshooting

### Services not connecting
1. Verify URLs in `.env` match your backend services
2. Check if backend services are running:
   ```bash
   curl http://localhost:8081/auth-service/actuator/health
   ```
3. Restart the dev server after changing `.env`

### 404 Errors
- Ensure context paths match your Spring Boot configurations
- Example: `/auth-service`, `/gaushala-service`

### CORS Issues
- Backend must allow requests from frontend origin
- In development: `http://localhost:5173`
- In production: Your domain

## Example: Deploying to Production

1. **Update `.env`:**
   ```env
   VITE_AUTH_SERVICE_URL=https://api.saubhagya.com/auth-service
   VITE_GAUSHALA_SERVICE_URL=https://api.saubhagya.com/gaushala-service
   VITE_BIOGAS_SERVICE_URL=https://api.saubhagya.com/biogas
   VITE_ENV=production
   VITE_DEBUG=false
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy `dist/` folder to your web server**

4. **Backend CORS configuration** (example for auth-service):
   ```java
   @CrossOrigin(origins = "https://yourdomain.com")
   ```

## Support

For issues or questions:
- Check `CLAUDE.md` in project root for service ports
- Verify all 8 microservices are running
- Check browser console for detailed error messages
