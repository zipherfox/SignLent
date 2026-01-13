# Deployment Guide

This document provides detailed instructions for deploying SignLent to various cloud platforms.

## Table of Contents

- [Netlify Deployment](#netlify-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Netlify Deployment

### Automatic Deployment (Recommended)

1. **Connect Repository to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Choose the `SignLent` repository

2. **Configure Build Settings**

   Netlify will automatically detect the settings from `netlify.toml`, but verify:
   - **Build command**: `npm install && npm run build:client`
   - **Publish directory**: `dist/spa`
   - **Functions directory**: `netlify/functions`

   > Note: Netlify uses `npm` instead of `pnpm` as it's more universally available. The build will use the lockfile to ensure consistent dependencies.

3. **Environment Variables** (Optional)

   Add any required environment variables in the Netlify dashboard:
   - Navigate to: Site settings → Environment variables
   - Add variables like `PING_MESSAGE` if needed

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - Your site will be live at: `https://[site-name].netlify.app`

### Manual Deployment via CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize Site** (First time only)

   ```bash
   netlify init
   ```

   Follow the prompts to create a new site or link to an existing one.

4. **Deploy to Production**
   ```bash
   netlify deploy --prod
   ```

### Continuous Deployment

Once connected to GitHub, Netlify will automatically deploy:

- **Production**: When you push to the `main` branch
- **Preview**: When you create a pull request

## Vercel Deployment

### Automatic Deployment (Recommended)

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `SignLent` repository

2. **Configure Project**

   Vercel should auto-detect the settings, but verify:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `pnpm install`

3. **Environment Variables** (Optional)

   Add environment variables in the Vercel dashboard:
   - Go to: Settings → Environment Variables
   - Add variables like `PING_MESSAGE`

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at: `https://[project-name].vercel.app`

### Manual Deployment via CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

   Follow the prompts to create a new project or link to an existing one.

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Docker Deployment

### Build Docker Image

1. **Create Dockerfile** (if not exists)

   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   # Install pnpm
   RUN npm install -g pnpm@10.14.0

   # Copy package files
   COPY package.json pnpm-lock.yaml ./

   # Install dependencies
   RUN pnpm install --frozen-lockfile

   # Copy application files
   COPY . .

   # Build application
   RUN pnpm build

   # Expose port
   EXPOSE 8080

   # Start application
   CMD ["pnpm", "start"]
   ```

2. **Build Image**

   ```bash
   docker build -t signlent:latest .
   ```

3. **Run Container**
   ```bash
   docker run -p 8080:8080 signlent:latest
   ```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  signlent:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - PING_MESSAGE=pong
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Environment Variables

### Available Variables

| Variable       | Description                           | Default         | Required |
| -------------- | ------------------------------------- | --------------- | -------- |
| `PING_MESSAGE` | Custom message for /api/ping endpoint | `"ping"`        | No       |
| `NODE_ENV`     | Node environment                      | `"development"` | No       |
| `PORT`         | Server port (for custom deployments)  | `8080`          | No       |

### Setting Environment Variables

#### Local Development

Create a `.env` file in the root directory:

```env
PING_MESSAGE=pong
NODE_ENV=development
```

#### Netlify

1. Go to Site settings → Environment variables
2. Add each variable with its value

#### Vercel

1. Go to Settings → Environment Variables
2. Add each variable for Production/Preview/Development

#### Docker

Pass via command line:

```bash
docker run -e PING_MESSAGE=pong -p 8080:8080 signlent:latest
```

Or use `.env` file with Docker Compose.

## Troubleshooting

### Build Fails

**Issue**: Build fails with "command not found: pnpm"

**Solution**: Ensure pnpm is installed in your build environment:

```bash
npm install -g pnpm@10.14.0
```

For Netlify, add a `netlify.toml` configuration (already included).

### API Routes Not Working

**Issue**: API endpoints return 404

**Solution**:

- **Netlify**: Check that `netlify.toml` has proper redirects
- **Vercel**: Ensure serverless functions are properly configured
- Verify the API endpoint starts with `/api/`

### Styles Not Loading

**Issue**: Application loads but styles are missing

**Solution**:

- Clear browser cache
- Check that `dist/spa/assets` directory is being served
- Verify build completed successfully

### Environment Variables Not Working

**Issue**: Application doesn't use environment variables

**Solution**:

- Verify variables are set in the deployment platform
- Restart/redeploy the application after adding variables
- Check variable names match exactly (case-sensitive)

### Port Already in Use

**Issue**: Local development fails with "port already in use"

**Solution**:

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3000 pnpm dev
```

## Performance Optimization

### Production Build

The production build is optimized for:

- Tree shaking (removes unused code)
- Minification (reduces file size)
- Code splitting (faster initial load)
- Asset optimization (compressed images)

### CDN Configuration

For Netlify/Vercel, assets are automatically served from their global CDN.

For custom deployments:

1. Use a CDN like Cloudflare or AWS CloudFront
2. Configure CDN to cache `/assets/*` files
3. Set appropriate cache headers

### Caching Strategy

Recommended cache headers:

- HTML: `Cache-Control: no-cache`
- CSS/JS: `Cache-Control: public, max-age=31536000, immutable`
- Images: `Cache-Control: public, max-age=31536000`

## Monitoring

### Netlify Analytics

Enable in: Site settings → Analytics

### Vercel Analytics

Available in: Project → Analytics tab

### Custom Monitoring

Consider integrating:

- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Google Analytics](https://analytics.google.com) for usage tracking

## Support

For deployment issues:

- Check [Netlify Documentation](https://docs.netlify.com)
- Check [Vercel Documentation](https://vercel.com/docs)
- Open an issue on GitHub
