# SignLent

**Breaking barriers in communication by translating sign language in real-time**

SignLent is a web application designed to help people who don't understand sign language communicate more effectively with the deaf and hard-of-hearing community. The application connects to smart sign language gloves via Bluetooth and translates gestures into text, which can then be spoken aloud or displayed as fullscreen subtitles.

## Features

- 🤝 **Bluetooth Glove Connection** - Connect smart sign language gloves wirelessly
- 🔊 **Text-to-Speech** - Hear translations spoken aloud through your device's speakers
- 📺 **Fullscreen Subtitles** - Display large, easy-to-read subtitles perfect for presentations and secondary displays
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 📝 **Translation History** - Keep track of recent translations

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Usage

1. Navigate to the **Launch App** page
2. Click **Connect to Gloves** to pair your sign language gloves via Bluetooth
3. Enable **Text-to-Speech** to hear translations spoken aloud
4. Use **Fullscreen Subtitles** for presentations or as a secondary display
5. View your translation history and adjust settings as needed

## Technology Stack

- **Nuxt 3** - Modern Vue.js framework
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Web Speech API** - Browser text-to-speech functionality
- **Bluetooth Web API** - Connect to Bluetooth devices (future integration)

## Color Scheme

The application uses a carefully selected color palette:
- Navy (#1A1F2E) - Primary background
- Slate (#4A536C, #6B7694) - Cards and secondary elements
- Cream (#F5F5DC) - Text and foreground
- Burgundy (#8B2635) - Accent and call-to-action buttons

---

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) for more information about the framework.
