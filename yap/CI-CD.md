# CI/CD Setup Guide

This document explains how to set up continuous integration and deployment for SignLent.

## GitHub Actions (Optional)

While Netlify and Vercel provide built-in CI/CD, you can also set up GitHub Actions for additional checks.

### Example Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.14.0

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm typecheck

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

  deploy-preview:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Netlify Preview
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: "./dist/spa"
          production-deploy: false
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Required Secrets

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

1. `NETLIFY_AUTH_TOKEN`: Get from Netlify dashboard
2. `NETLIFY_SITE_ID`: Found in Netlify site settings

## Netlify Continuous Deployment

### Setup

1. **Connect Repository**
   - Go to Netlify dashboard
   - Select your site (or create new)
   - Go to Site settings → Build & deploy → Continuous Deployment
   - Connect to GitHub

2. **Branch Configuration**
   - Production branch: `main` (or your preferred branch)
   - Deploy previews: All pull requests
   - Branch deploys: Optionally enable for other branches

3. **Build Settings**
   - Build command: `npm install && npm run build:client`
   - Publish directory: `dist/spa`
   - Auto publishing: Enabled

### Deploy Contexts

Netlify provides different contexts for deployments:

```toml
# In netlify.toml

[context.production]
  command = "npm install && npm run build:client"

[context.deploy-preview]
  command = "npm install && npm run build:client"

[context.branch-deploy]
  command = "npm install && npm run build:client"
```

### Build Notifications

Enable build notifications:

1. Go to Site settings → Build & deploy → Deploy notifications
2. Add notifications for:
   - Deploy started
   - Deploy succeeded
   - Deploy failed

Options:

- Email notifications
- Slack integration
- Webhook

## Vercel Continuous Deployment

### Setup

1. **Connect Repository**
   - Go to Vercel dashboard
   - Import your GitHub repository
   - Vercel automatically sets up webhooks

2. **Git Integration**
   - Production: Deploys from `main` branch
   - Preview: Deploys for all pull requests
   - Deployment comments added to PRs automatically

### Environment Variables

Set different variables per environment:

- Production
- Preview
- Development

## Branch Protection Rules

Recommended GitHub branch protection rules for `main`:

1. **Go to Repository Settings → Branches**
2. **Add rule for `main` branch**:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass
     - CI build
     - Type check
     - Tests
   - ✅ Require conversation resolution
   - ✅ Do not allow bypassing the above settings

## Pre-commit Hooks

Install Husky for Git hooks:

```bash
pnpm add -D husky lint-staged
```

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm typecheck
pnpm test
```

Configure `package.json`:

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"]
  }
}
```

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] TypeScript compilation succeeds
- [ ] Code is formatted
- [ ] Environment variables are configured
- [ ] Build succeeds locally
- [ ] API endpoints are tested
- [ ] Browser compatibility checked
- [ ] Performance tested
- [ ] Accessibility checked
- [ ] Security scan completed

## Rollback Strategy

### Netlify

1. Go to Deploys tab
2. Find previous successful deploy
3. Click "Publish deploy"

### Vercel

1. Go to Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Git-based Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

## Monitoring Deployments

### Build Status Badge

Add to README.md:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)
```

### Deploy Webhook

Set up webhook to notify external services:

**Netlify**: Site settings → Build & deploy → Deploy notifications → Add notification → Outgoing webhook

**Vercel**: Project settings → Git → Deploy Hooks

### Deployment Logs

- **Netlify**: Deploys tab → Select deploy → View build logs
- **Vercel**: Deployments → Select deployment → View function logs

## Best Practices

1. **Never commit secrets**: Use environment variables
2. **Test before merging**: Use preview deployments
3. **Keep dependencies updated**: Regular security updates
4. **Monitor build times**: Optimize if they get too long
5. **Use deploy previews**: Test changes before production
6. **Set up alerts**: Get notified of failed deployments
7. **Document changes**: Keep CHANGELOG.md updated
8. **Version your releases**: Use semantic versioning

## Troubleshooting

### Build Takes Too Long

- Enable build caching
- Use `pnpm` store cache
- Optimize dependencies
- Split large builds

### Deploy Fails

1. Check build logs
2. Test build locally
3. Verify environment variables
4. Check dependency versions
5. Review recent changes

### Preview Deploy Not Working

1. Check webhook configuration
2. Verify GitHub permissions
3. Review branch settings
4. Check build command

## Resources

- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Husky Docs](https://typicode.github.io/husky/)
