# SmartCare Deployment Guide

This project is configured for easy deployment on **Render** using the included `render.yaml` blueprint.

## Prerequisites

1.  A **GitHub** account with this repository pushed.
2.  A **MongoDB Atlas** account for your production database.
3.  A **Render** account.
4.  **Local Env**: Backend on port 5050, Frontend on port 3000.

## Deployment Steps

### 1. Database Setup
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a new cluster (Free Tier is fine).
- In "Database Access", create a user with read/write permissions.
- In "Network Access", allow access from `0.0.0.0/0` (Render's IPs are dynamic).
- Copy your connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/smartcare`).

### 2. Render Setup
- Log in to your [Render Dashboard](https://dashboard.render.com/).
- Click **"New +"** and select **"Blueprint"**.
- Connect your GitHub repository.
- Render will automatically detect the `render.yaml` file and show the services to be created:
    - `smartcare-backend` (Web Service)
    - `smartcare-frontend` (Static Site)

### 3. Configure Environment Variables
In the Render Blueprint setup screen, you will need to provide values for:

**For the Backend (`smartcare-backend`):**
- `MONGODB_URI`: Your MongoDB Atlas connection string (ensure special characters in password are URL encoded, e.g., `@` becomes `%40`).
- `JWT_SECRET`: A long, random string for securing user tokens.
- `NODE_ENV`: Set to `production`.

**For the Frontend (`smartcare-frontend`):**
- `REACT_APP_API_URL`: The URL of your deployed backend (e.g., `https://smartcare-backend.onrender.com/api`).
    - *Note: You may need to deploy the backend first to get this URL, then update the frontend environment variable and redeploy.*

### 4. Finalize
- Click **"Apply"**.
- Render will build and deploy both services.
- Your frontend will be accessible at the `.onrender.com` URL provided by Render.

## Security & Maintenance
- The app uses `helmet` for security headers and `express-rate-limit` to prevent abuse.
- `app.set('trust proxy', 1)` is enabled in the backend to ensure rate limiting works correctly on Render.
- Ensure you never commit your actual `.env` file to GitHub.
- Use Render's "Environment Variables" section to manage secrets securely.
