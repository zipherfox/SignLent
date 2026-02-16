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
- **Server**: Express (HTTPS, serves the built client)
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
pnpm install
pnpm dev
```

The dev server will be available at `https://localhost:8080` (Vite provides a self-signed certificate).

### Production Build

```bash
# Generate TLS certificates for localhost (one-time setup)
mkdir -p dist/certs
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
  -nodes -keyout dist/certs/key.pem -out dist/certs/cert.pem \
  -days 365 -subj "/CN=localhost"

# Build and start
pnpm build
pnpm start
```

The production server runs at `https://localhost:3000`.

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (client + server)
- `pnpm start` - Start production HTTPS server
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm format.fix` - Format code with Prettier

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

server/                  # HTTPS server (serves client only)
├── index.ts           # Express app setup
└── node-build.ts      # Production HTTPS entry point

shared/                 # Shared types
└── MLTypes.ts         # ML model interfaces
```

## License

MIT License - see LICENSE file for details