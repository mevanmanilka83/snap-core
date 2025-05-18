# Snap Core - Video Frame & Image Processing Tool

A modern web application built with Next.js for creating thumbnails from videos and images, with advanced processing capabilities.

## Features

- **Multiple Input Support**
  - Upload images directly (JPG, PNG)
  - Load videos (MP4, WebM, MOV)
  - Instant preview of uploaded content

- **Smart Frame Capture**
  - Automatic keyframe detection for videos
  - Manual frame selection
  - Custom interval settings for video frames
  - Multiple snapshot management

- **Image Processing**
  - Background removal using AI
  - Advanced text overlay capabilities
    - Multiple text layers
    - Custom fonts and styles
    - Text effects (shadow, curve, background)
    - Layer management
  - Real-time preview of changes
  - Local browser-based processing

- **User Experience**
  - Modern, responsive UI with Tailwind CSS
  - Dark/Light mode support
  - Smooth animations and transitions
  - Privacy-first approach (all processing done locally)
  - Undo/Redo functionality
  - Image filters and presets

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - CSS Modules
  - CSS Variables
- **UI Components**: 
  - Radix UI for accessible components
  - Custom UI components
  - Framer Motion for animations
- **Image Processing**: 
  - ONNX Runtime for AI processing
  - Background removal capabilities
  - Canvas API for image manipulation
- **Development Tools**:
  - ESLint for code quality
  - TypeScript for type safety
  - Prettier for code formatting

## Project Structure

```
snap-core/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── globals.css       # Global styles
│   ├── thumbnail/        # Thumbnail creation features
│   │   ├── image-thumbnail/  # Image processing
│   │   ├── video-thumbnail/  # Video processing
│   │   └── main-section.tsx  # Shared components
│   ├── shared/           # Shared components
│   └── terms/            # Terms of service
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── eldoraui/        # Custom UI components
│   └── home/            # Home page components
├── lib/                 # Utility functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── public/             # Static assets
└── config/             # Configuration files
```

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd snap-core
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add any required environment variables.

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build artifacts
- `npm run analyze` - Analyze bundle size

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com) - Unstyled, accessible components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [ONNX Runtime](https://onnxruntime.ai) - AI processing
