# Snap Core

A professional-grade web application for creating and editing video and image thumbnails with advanced AI-powered features.

## Overview

Snap Core is a modern, privacy-focused application that enables content creators to generate high-quality thumbnails from videos and images. Built with performance and user experience in mind, it offers a comprehensive suite of editing tools while ensuring all processing happens locally in the browser.

## Key Features

### Media Processing
- **Video Frame Extraction**
  - Intelligent keyframe detection
  - Custom interval capture
  - Multi-frame snapshot management
  - Real-time preview

- **Image Enhancement**
  - AI-powered background removal
  - Advanced image filters
  - Custom presets
  - Non-destructive editing

### Text Overlay System
- **Layer Management**
  - Multiple text layers
  - Z-index control
  - Layer visibility toggle
  - Layer duplication

- **Typography Controls**
  - Extensive font library
  - Custom styling options
  - Text effects (shadow, curve)
  - Background customization

### User Interface
- **Modern Design**
  - Responsive layout
  - Dark/Light mode
  - Intuitive controls
  - Real-time preview

- **Performance**
  - Local processing
  - Optimized rendering
  - Undo/Redo support
  - Instant feedback

## Technical Architecture

### Core Technologies
- **Frontend Framework**
  - Next.js 14
  - React 18
  - TypeScript

- **Styling**
  - Tailwind CSS
  - CSS Modules
  - CSS Variables

- **UI Components**
  - Radix UI
  - Custom components
  - Framer Motion

### Processing Engine
- **Image Processing**
  - ONNX Runtime
  - Canvas API
  - Web Workers

- **Development Tools**
  - ESLint
  - TypeScript
  - Prettier

## Project Structure

```
snap-core/
├── app/                    # Next.js application
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── globals.css       # Global styles
│   ├── thumbnail/        # Thumbnail features
│   │   ├── image-thumbnail/  # Image processing
│   │   ├── video-thumbnail/  # Video processing
│   │   └── main-section.tsx  # Shared components
│   ├── shared/           # Shared components
│   └── terms/            # Terms of service
├── components/           # React components
│   ├── ui/              # UI components
│   ├── eldoraui/        # Custom components
│   └── home/            # Home components
├── lib/                 # Utilities
├── hooks/              # React hooks
├── types/              # TypeScript types
├── public/             # Static assets
└── config/             # Configuration
```

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd snap-core
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment:
Create a `.env.local` file with required variables.

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Access the application at [http://localhost:3000](http://localhost:3000)

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |
| `npm run format` | Format code |
| `npm run clean` | Clean build artifacts |
| `npm run analyze` | Analyze bundle size |

## Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Radix UI](https://www.radix-ui.com) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [ONNX Runtime](https://onnxruntime.ai) - AI processing
