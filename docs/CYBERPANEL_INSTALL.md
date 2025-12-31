# Deployment: CyberPanel + OpenLiteSpeed 🌐⚡

This guide covers hosting Nano Banana on a VPS running **CyberPanel**.

## 1. Environment Preparation
1. Log in to **CyberPanel**.
2. Navigate to **Websites** > **Create Website**.
3. Enable **SSL** and **OpenLiteSpeed** for the target domain.

## 2. Build and Upload
1. Build the production files locally:
   ```bash
   npm run build
   ```
2. Compress the contents of the `dist/` directory into `site.zip`.
3. Use CyberPanel's **File Manager** to upload and extract the ZIP inside `public_html`.

## 3. SPA Routing Configuration
Since React uses client-side routing, you must configure **OpenLiteSpeed Rewrite Rules**:
1. Open the website management page in CyberPanel.
2. Navigate to **Rewrite Rules**.
3. Insert the following:

```apache
rewrite {
  enable 1
  base /
  rule ^index\.html$ - [L]
  cond %{REQUEST_FILENAME} !-f
  cond %{REQUEST_FILENAME} !-d
  rule . /index.html [L]
}
```
4. Save the changes. OLS will restart automatically.

## 4. Performance Optimization
- Enable **LSCache** from the CyberPanel dashboard to cache static assets at the edge.