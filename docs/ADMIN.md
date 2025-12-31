# Admin Dashboard Documentation 🛠️

The Control Panel allows for full application management without code modification.

## Authentication
- Access the dashboard via the **Gear icon** in the header.
- The session is protected by a password stored in the local encrypted database.
- Idle sessions expire automatically after 60 minutes for security.

## Modules
1. **Analytics Overview**: Monitor total users, AI process success rates, and daily traffic.
2. **User Management**: View, audit, or remove registered users.
3. **AI Activity Logs**: Detailed history of every generation, showing the model used and execution status.
4. **Site Identity**: Update the application name and toggle public visibility of settings.
5. **Model Control**: Enable or disable specific Gemini models (e.g., 2.5 Flash vs 3.0 Pro).
6. **Dynamic Theming**: Modify CSS variables (primary colors, border radius) globally.

## SMTP Configuration
- Essential for password recovery and verification emails.
- Supports standard SMTP hosts like Gmail, Outlook, or private mail servers.