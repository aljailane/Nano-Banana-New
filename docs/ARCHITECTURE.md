# Technical Architecture 🏗️

Nano Banana is engineered for performance, scalability, and extreme user privacy.

## Core Stack
- **Library**: React 19 (using the latest concurrent features).
- **Styling**: Tailwind CSS with custom configuration for dynamic runtime themes.
- **AI Core**: Google Gemini API Integration via `@google/genai`.
- **Database**: IndexedDB for client-side persistence (Service Layer: `dbService.ts`).

## Component Structure
- `App.tsx`: Main router and state manager.
- `geminiService.ts`: Centralized AI logic handling multimodal inputs.
- `AdminDashboard.tsx`: Secure management module.
- `Theme Engine`: Real-time CSS variable injection based on DB settings.

## Data Flow
1. **User Input**: Image and Prompt captured in UI.
2. **Service Layer**: Data sanitized and sent to Gemini API.
3. **Processing**: AI returns Base64 data.
4. **Persistence**: Transaction logged in IndexedDB.
5. **Output**: Result rendered and made available for download.