# Installation and Setup Guide 🚀

Welcome to the **Nano Banana AI** project. This guide provides the steps to initialize the environment on your local machine.

## Prerequisites
- **Node.js**: Version 18 or later.
- **Package Manager**: npm or yarn.
- **Gemini API Key**: Obtain your key from [Google AI Studio](https://aistudio.google.com/).

## Setup Steps
1. **Prepare Workspace**: Extract the project files into a dedicated folder.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Configuration**:
   - The application relies on `process.env.API_KEY`. 
   - Ensure the key is available in your development environment.
4. **Launch Application**:
   ```bash
   npm run dev
   ```

## Technical Notes
- **Persistence**: The project utilizes **IndexedDB** for local storage. Your settings and user data remain stored in the browser's persistent storage.
- **Initial Configuration**: On the first launch, accessing the Admin Dashboard will trigger a setup wizard to define your administrative password.