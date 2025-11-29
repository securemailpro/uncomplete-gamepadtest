# GamepadTest - Next.js 14 Project

## Overview
A modern hardware testing web application built with Next.js 14 App Router, featuring server-side rendering (SSR) and client components for browser API interactions. The platform includes testers for gamepads, GPUs, microphones, and MIDI devices.

## Project Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: TanStack Query

### Project Structure
```
├── app/                    # Next.js App Router directory
│   ├── layout.tsx          # Root layout with Providers
│   ├── page.tsx            # Homepage (server component)
│   ├── globals.css         # Global styles
│   ├── components/         # Shared components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Providers.tsx   # Client-side providers (Theme, Query)
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── gamepad-tester/     # Gamepad tester page
│   │   ├── page.tsx        # Server component with metadata
│   │   └── GamepadTesterClient.tsx  # Client component
│   ├── gpu-tester/         # GPU tester page
│   │   ├── page.tsx        # Server component with metadata
│   │   └── GPUTesterClient.tsx  # Client component
│   ├── mic-tester/         # Microphone tester page
│   │   ├── page.tsx        # Server component with metadata
│   │   └── MicTesterClient.tsx  # Client component
│   ├── midi-tester/        # MIDI tester page
│   │   ├── page.tsx        # Server component with metadata
│   │   └── MIDITesterClient.tsx  # Client component
│   ├── about/              # About page (server component)
│   ├── privacy/            # Privacy Policy page (server component)
│   ├── blog/               # Blog page (server component)
│   └── contact/            # Contact page (server component)
├── client/                 # Legacy Vite/React code (preserved for reference)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration for Next.js
└── package.json            # Dependencies and scripts
```

### Component Architecture

#### Server Components (default)
- Static pages (About, Privacy, Blog, Contact)
- Page wrappers with metadata export
- No browser API access

#### Client Components ("use client" directive)
- Components using browser APIs (Gamepad, WebGL, Web Audio, Web MIDI)
- Components with useState, useEffect, event handlers
- Theme provider and context consumers

### Browser API Usage Pattern
All browser APIs are wrapped in SSR-safe checks:

```typescript
"use client";

useEffect(() => {
  if (typeof window === "undefined") return;
  if (typeof navigator === "undefined") return;
  
  // Safe to use browser APIs here
}, []);
```

## Development

### Running Locally
```bash
npm run dev
```
Access at: `http://localhost:5000`

### Building for Production
```bash
npm run build
```

### Running Production Build
```bash
npm start
```

## Environment Variables

### Optional Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (default: development)

## Features

### Gamepad Tester
- Real-time controller input detection
- Button mapping visualization
- Analog stick deadzone adjustment
- Vibration motor testing
- Latency measurement
- Input history and statistics

### GPU Tester
- WebGL capability detection
- GPU vendor and renderer info
- Display metrics (resolution, DPR, color depth)
- Performance benchmark with triangle rendering
- FPS and throughput measurement

### Microphone Tester
- Audio input level monitoring
- Peak hold and noise floor analysis
- Signal-to-noise ratio calculation
- Waveform visualization
- Device selection

### MIDI Tester
- MIDI device detection (inputs/outputs)
- Note visualization with velocity
- Control change message display
- Audio playback of received notes
- Message history log

## SEO

Each page exports metadata using Next.js `generateMetadata` or static `metadata` export:

```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/page',
  },
};
```

## Recent Changes

### November 28, 2025 - Next.js 14 Migration
- Migrated from React/Vite to Next.js 14 with App Router
- Converted all pages to Next.js routing structure
- Split browser API components into Client Components with "use client"
- Implemented server components for static content (About, Privacy, Blog, Contact)
- Added generateMetadata for SEO instead of react-helmet
- Updated path aliases for Next.js (@/app/*)
- Configured next.config.mjs for ESM compatibility
- Preserved all UI, styling, and layout from original design

### Prior Changes (React/Vite Era)
- November 19, 2025: Mobile-friendly improvements
- November 17, 2025: Full SSR implementation
- November 10, 2025: Replit migration from Vercel

## Deployment

The project is configured for Replit/Vercel deployment:
- Build command: `npm run build`
- Start command: `npm start`
- Port: 5000
- Type: Static or Autoscale deployment

## Security Features

- All testing happens client-side (no data sent to servers)
- No personal data collection
- HTTPS enforced in production
- Image proxy with domain whitelisting
