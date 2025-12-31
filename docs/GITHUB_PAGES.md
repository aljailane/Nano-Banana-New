# Deploying to GitHub Pages 🐙🚀

Welcome to the automated deployment guide using **GitHub**. We will use **GitHub Actions** to build and deploy the project automatically whenever you update the code.

## Step 1: Initialize Repository
1. Create a new repository on your GitHub account.
2. Push your project code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Add API Key (Secrets)
To protect your Gemini API key:
1. Go to repository **Settings**.
2. From the side menu, select **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Name: `API_KEY` | Value: (Paste your Gemini API key).

## Step 3: Setup GitHub Action
Create a file at `.github/workflows/deploy.yml` and paste the following:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install and Build
        run: |
          npm install
          npm run build
        env:
          API_KEY: ${{ secrets.API_KEY }}

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist # Or build depending on your config
```

## Step 4: Enable Pages
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment**, ensure **GitHub Actions** is selected as the source.

---
**Note**: Ensure you add `base: '/REPO_NAME/'` in your Vite config file (if using Vite) for correct routing on GitHub Pages.