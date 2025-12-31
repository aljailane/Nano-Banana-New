# Deploying to Cloudflare Pages ☁️🧡

**Cloudflare Pages** is one of the fastest and easiest ways to host modern React apps, offering advanced protection and global speed via Cloudflare's network.

## Step 1: Connect Account
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages**.
3. Select **Connect to Git** and link your repository.

## Step 2: Build Settings
After selecting the repo, Cloudflare will ask for settings:
- **Project name**: (Choose a name for your project).
- **Production branch**: `main`.
- **Framework preset**: Select **Vite** or **Create React App**.
- **Build command**: `npm run build`.
- **Build output directory**: `dist`.

## Step 3: Add Environment Variables
This step is vital for AI functionality:
1. Before clicking "Save and Deploy", go to **Environment variables**.
2. Add a new variable:
   - **Key**: `API_KEY`
   - **Value**: (Your Gemini API key).
3. Ensure it is added to both "Production" and "Preview" environments.

## Step 4: Handling SPA Routing
To prevent 404 errors when refreshing the page:
1. Create a file named `_redirects` inside the `public` folder of your project.
2. Add the following line:
   ```text
   /* /index.html 200
   ```
3. Cloudflare will automatically route all requests to the main index file.

## Features of Cloudflare Pages
- **Automatic SSL**: Free, always-updated security certificates.
- **Web Analytics**: Accurate visitor stats without compromising privacy.
- **Edge Functions**: Ability to run backend code at the edge if needed later.

---
🚀 Congratulations! Your site is now running on Cloudflare's global cloud.