# Zendesk Tickets Explorer

A secure React web application that provides an intuitive interface to interact with the Zendesk Support API for exploring and managing ticketing information.

## 🚀 Live Demo

**Access the live application:** [https://moisescatala.github.io/Zendesk-Tickets-explorer/](https://moisescatala.github.io/Zendesk-Tickets-explorer/)

The application is automatically deployed to GitHub Pages on every push to the main branch.

## Features

### 🔐 Secure Authentication
- Login form accepting Zendesk credentials (subdomain, email, API token)
- Credentials stored **only in memory** during active session
- No localStorage or sessionStorage usage
- Automatic credential clearing on logout or page refresh
- Security warnings and best practices displayed to users

### 🎫 Ticket Management
- **List View**: Display tickets with ID, subject, status, priority, and creation date
- **Detailed View**: Full ticket information including:
  - Complete ticket history and comments
  - Requester and assignee information
  - Custom fields and tags
  - Public/private comment indicators
- **Pagination**: Load more tickets with smooth pagination support

### 🔍 Search & Filter
- Filter by ticket status (new, open, pending, hold, solved, closed)
- Filter by priority (low, normal, high, urgent)
- Search tickets by subject keywords
- Visual indicators for active filters
- Reset filters with one click

### 🎨 Modern UI/UX
- Clean, professional interface built with Tailwind CSS
- Responsive design for desktop and mobile
- Loading states and animations
- Clear error messages
- Two-column layout with sticky details panel
- Color-coded status and priority badges

## Technology Stack

- **React 18** with Hooks (useState, useEffect, useRef)
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zendesk Support API v2** for data integration

## Prerequisites

Before running this application, you need:

1. A Zendesk account (free 14-day trial available at [zendesk.com](https://www.zendesk.com/register/))
2. API token access enabled in your Zendesk admin settings
3. Node.js (version 16 or higher)
4. npm or yarn package manager

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Zendesk-Tickets-explorer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Zendesk API Token

1. Log in to your Zendesk account
2. Navigate to: **Admin Center** → **Apps and integrations** → **APIs** → **Zendesk API**
3. Enable **Token Access**
4. Click **Add API token**
5. Copy the generated token (you'll need this for login)

### 4. Run the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 5. Login

Enter your Zendesk credentials:
- **Subdomain**: Your company subdomain (e.g., "mycompany" from mycompany.zendesk.com)
- **Email**: Your Zendesk account email
- **API Token**: The token you generated in step 3

## API Integration

This application uses the following Zendesk API endpoints:

- `GET /api/v2/users/me.json` - Validate credentials
- `GET /api/v2/tickets.json` - List tickets with pagination
- `GET /api/v2/tickets/{id}.json` - Get ticket details
- `GET /api/v2/tickets/{id}/comments.json` - Get ticket comments
- `GET /api/v2/search.json` - Search tickets with filters

Authentication uses **Basic Auth** with base64 encoding of `email/token:api_token`.

## Project Structure

```
Zendesk-Tickets-explorer/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx          # Authentication form
│   │   ├── SearchFilters.jsx      # Search and filter controls
│   │   ├── TicketList.jsx         # Ticket list with pagination
│   │   └── TicketDetails.jsx      # Detailed ticket view
│   ├── services/
│   │   └── zendeskApi.js          # API service layer
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind CSS imports
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── README.md                      # This file
```

## Security Best Practices

✅ **Implemented:**
- Credentials stored in memory only (using `useRef`)
- No console logging of sensitive data
- HTTPS-only API requests
- Credentials cleared on logout and component unmount
- Security warnings displayed to users

❌ **Not Implemented (as per requirements):**
- No localStorage usage
- No sessionStorage usage
- No credential persistence

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages (manual deployment)

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Deployment

### Automatic Deployment (GitHub Actions)

The application is configured with GitHub Actions for automatic deployment to GitHub Pages:

1. Push changes to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy the application
3. Access the live site at: `https://[username].github.io/Zendesk-Tickets-explorer/`

**Note:** Ensure GitHub Pages is enabled in your repository settings:
- Go to: **Settings** → **Pages**
- Source: **GitHub Actions**

### Manual Deployment

To manually deploy to GitHub Pages:

```bash
npm run deploy
```

This will build the application and push it to the `gh-pages` branch.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### "Network error" on login
- Verify your subdomain is correct
- Check your internet connection
- Ensure API token access is enabled in Zendesk

### "Invalid credentials" error
- Double-check your email address
- Verify the API token is copied correctly
- Ensure the token hasn't been revoked

### No tickets showing
- Verify your Zendesk account has tickets
- Try clearing all filters
- Check if your user has permission to view tickets

## API Rate Limits

Zendesk API has rate limits:
- **Enterprise**: 700 requests per minute
- **Professional**: 400 requests per minute
- **Team & Essential**: 200 requests per minute

This application implements efficient API usage to stay within limits.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues related to:
- **This application**: Open an issue in this repository
- **Zendesk API**: Visit [Zendesk Developer Documentation](https://developer.zendesk.com/api-reference/)
- **Zendesk account**: Contact [Zendesk Support](https://support.zendesk.com/)

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Zendesk API](https://developer.zendesk.com/api-reference/)

---

**Note**: This application is for educational and demonstration purposes. Always follow your organization's security policies when handling API credentials.
