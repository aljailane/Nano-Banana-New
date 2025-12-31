# Technical Architecture 🏗️

The project is built using modern technologies to ensure speed and privacy.

## Tech Stack
- **Frontend**: React 19.
- **Styling**: Tailwind CSS with built-in RTL support.
- **AI Engine**: Google Gemini API (2.5 Flash and 3.0 Pro models).
- **Storage**: IndexedDB (via `dbService.ts`) for persistent local storage.

## Deployment Options
The project supports various hosting platforms. Review the following guides:
- [Deploying to GitHub Pages](./GITHUB_PAGES.md) 🐙
- [Deploying to Cloudflare Pages](./CLOUDFLARE.md) ☁️
- [Deploying to CyberPanel + OpenLiteSpeed](./CYBERPANEL_INSTALL.md) ⚡

## Important File Structure
- `/services/geminiService.ts`: Handles all AI interactions.
- `/services/dbService.ts`: Local database system.
- `/components/AdminDashboard.tsx`: Admin interface.
- `App.tsx`: Main routing and application logic.

## Privacy & Security
API keys are handled as environment variables across all platforms to ensure they are never leaked in the public source code.