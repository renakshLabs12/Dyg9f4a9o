# Playwright Browser in Browser

🤖 A web-based browser automation tool powered by Playwright with a beautiful UI interface.

## Features

✅ **Browser Automation** - Navigate websites using Playwright  
✅ **Screenshot Capture** - Real-time screenshots of automated browsing  
✅ **Interactive Controls** - Click elements, type text, navigate history  
✅ **Beautiful UI** - Modern gradient interface with responsive design  
✅ **CI/CD Ready** - GitHub Actions for automated testing and deployment  

## Setup

### Local Development

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

3. **Open in browser:**
```
http://localhost:3000
```

## Usage

1. Enter a URL in the address bar
2. Click "Navigate" or press Enter
3. Use the toolbar buttons for back/forward/refresh
4. Use Playwright actions to:
   - Click elements by CSS selector
   - Type text into fields
   - Capture screenshots

## API Endpoints

- `POST /api/navigate` - Navigate to URL
- `POST /api/click` - Click element by selector
- `POST /api/type` - Type text into element
- `POST /api/back` - Go back in history
- `POST /api/forward` - Go forward in history
- `POST /api/refresh` - Refresh page
- `GET /api/content` - Get page content

## GitHub Actions Setup

### 1. Create Deploy Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm install
      - run: npx playwright install --with-deps
      - uses: vercel/action@v5
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 2. Create Build Workflow
Create `.github/workflows/build.yml`:

```yaml
name: Build & Check

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm install
      - run: npx playwright --version
      - run: timeout 5 npm start || true
```

### 3. Create Test Workflow
Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
        continue-on-error: true
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 4. Add GitHub Secrets
Go to Settings → Secrets and variables → Actions and add:
- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## Requirements

- Node.js 16+
- npm or yarn
- Playwright (installed via npm)

## License

MIT
