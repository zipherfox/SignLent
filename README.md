# SignLent

An AI-powered sign language translation application that converts sign language to voice and text in real-time.

## Features

- **Real-time Translation**: Instant sign language to text/voice conversion
- **Voice Output**: Automatically speak translated text
- **Live Subtitles**: Full-screen subtitle display for secondary webcam feed
- **Smart Gloves Integration**: Connect with smart gloves for accurate detection
- **Camera Support**: Optional camera feed for visual feedback
- **Translation History**: Track and replay previous translations
- **Dark Mode**: Full dark mode support with smooth transitions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express + Node.js
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router 6

## Development

### Prerequisites

- Node.js 18+ 
- pnpm 10.14.0+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:8080`

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Scripts

- `pnpm dev` - Start development server (client + server)
- `pnpm build` - Build for production (client + server)
- `pnpm build:client` - Build client only
- `pnpm build:server` - Build server only
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm format.fix` - Format code with Prettier

## Deployment

### Netlify Deployment

This application is pre-configured for Netlify deployment.

#### Option 1: Deploy with Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

#### Option 2: Deploy via Git Integration

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify will automatically detect the configuration from `netlify.toml`
6. Click "Deploy site"

#### Environment Variables

If you need to configure environment variables:

1. Go to your site in Netlify dashboard
2. Navigate to Site settings → Environment variables
3. Add any required variables (e.g., `PING_MESSAGE`)

### Vercel Deployment

The application can also be deployed to Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or use the Vercel dashboard to import your GitHub repository.

### Manual Deployment

For other platforms:

1. Build the application:
```bash
pnpm build
```

2. The static files will be in `dist/spa/`
3. The server files will be in `dist/server/`
4. Serve the static files and run the server

## Project Structure

```
client/                   # React SPA frontend
├── pages/               # Route components
│   ├── Index.tsx       # Home page
│   ├── Translate.tsx   # Translation interface
│   └── NotFound.tsx    # 404 page
├── components/         # Reusable components
├── App.tsx            # App entry point with routing
└── global.css         # Global styles

server/                  # Express API backend
├── index.ts           # Server setup
└── routes/            # API route handlers

shared/                 # Shared types
└── api.ts            # Shared API interfaces

netlify/               # Netlify serverless functions
└── functions/
    └── api.ts        # Netlify function wrapper
```

## API Endpoints

- `GET /api/ping` - Health check endpoint
- `GET /api/demo` - Demo endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

MIT License - see LICENSE file for details