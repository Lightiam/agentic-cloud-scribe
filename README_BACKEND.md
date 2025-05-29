
# Storm Platform Backend

## Quick Start

### Method 1: Using the startup scripts (Recommended)

**On Windows:**
```bash
# Double-click on start_backend.bat or run in command prompt:
start_backend.bat
```

**On macOS/Linux:**
```bash
# Make the script executable and run:
chmod +x start_backend.sh
./start_backend.sh
```

### Method 2: Using Node.js directly

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Start the server
npm run dev
```

### Method 3: Manual startup

```bash
cd backend
node start.js
```

## What the backend provides

- **Health Check**: `GET /health`
- **Authentication**: `POST /auth/register`, `POST /auth/login`
- **User Profile**: `GET /user/profile`
- **Pricing**: `GET /pricing/tiers`
- **Deployments**: Full CRUD operations
- **Cloud Providers**: Configuration management
- **Dashboard**: Stats and analytics

## Troubleshooting

1. **Port already in use**: If port 5000 is busy, the server will show an error. Stop other services using port 5000.

2. **Node.js not found**: Install Node.js from https://nodejs.org/

3. **Database connection issues**: The backend falls back to in-memory storage if the database is unavailable.

4. **CORS errors**: Make sure the frontend is running on an allowed origin.

## Environment Variables

The backend uses these environment variables (with fallbacks):

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (default: development)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret

## API Base URLs

- Development: `http://localhost:5000`
- Production: Configure in your deployment environment
