# Installation and Setup Guide 🚀

Welcome to the **Nano Banana AI** project. This guide will help you get the project running on your local machine.

## Prerequisites
- **Node.js**: Version 18 or later.
- **npm** or **yarn**.
- **Gemini API Key**: You can obtain one from [Google AI Studio](https://aistudio.google.com/).

## Setup Steps
1. **Download Project**: Extract the files into a dedicated folder.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure API Key**:
   - Create a `.env` file in the root directory.
   - Add your API key:
     ```env
     API_KEY=your_gemini_api_key_here
     ```
4. **Run the Project**:
   ```bash
   npm run dev
   ```

## Important Notes
- The project uses **IndexedDB** for local storage, so your data and settings will persist in your browser.
- On the first run, the system will ask you to set an Admin password when you attempt to access the Dashboard.