# Hosting on CyberPanel + OpenLiteSpeed 🌐⚡

Welcome to the advanced guide for hosting **Nano Banana AI** on a **CyberPanel** environment. This setup offers power and speed thanks to the **OpenLiteSpeed** engine.

## Step 1: Create a Website in CyberPanel
1. Log in to your **CyberPanel** dashboard.
2. Go to **Websites** > **Create Website**.
3. Fill in the details (Domain, Email, PHP version - PHP version doesn't matter much as this is a frontend project).
4. Ensure **SSL** and **OpenLiteSpeed** are enabled.

## Step 2: Prepare Project Files
Since this is a React project, you must build the production version before uploading:
1. On your local machine, run:
   ```bash
   npm run build
   ```
2. This will generate a folder named `dist` (or `build`) containing HTML, JS, and CSS files.
3. Compress the contents of this folder into a `.zip` file.

## Step 3: Upload Files
1. In CyberPanel, go to **Websites** > **List Websites** > **Manage**.
2. Click on **File Manager**.
3. Enter the `public_html` directory.
4. Upload your ZIP file and extract it there.
5. Ensure `index.html` is in the root of `public_html`.

## Step 4: Configure OpenLiteSpeed Rules (Crucial)
As this is a Single Page Application (SPA), all requests must be directed to `index.html` to ensure internal routes work correctly:
1. From the website management page in CyberPanel, find **Rewrite Rules**.
2. Paste the following code into the box:

```apache
# Rewrite rules for React and SPA applications
rewrite {
  enable 1
  base /
  rule ^index\.html$ - [L]
  cond %{REQUEST_FILENAME} !-f
  cond %{REQUEST_FILENAME} !-d
  rule . /index.html [L]
}
```
3. Click **Save**. CyberPanel will restart OpenLiteSpeed automatically.

## Step 5: Optimize Performance with Cache
For the fastest user experience, ensure **LiteSpeed Cache** is active:
- Go to **LSCache** in CyberPanel and ensure it is enabled for your domain.

---
### Technical Notes:
- **HTTPS**: Don't forget to issue a free Let's Encrypt SSL certificate via CyberPanel to ensure all browser features work correctly.
- **Node.js**: If you wish to run a backend for the same project, you can use the **Setup Node.js App** section in CyberPanel.