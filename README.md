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

- **Image Processing**
  - Background removal
  - Text overlay capabilities
  - Real-time preview of changes
  - Local browser-based processing

- **User Experience**
  - Modern, responsive UI with Tailwind CSS
  - Dark/Light mode support
  - Smooth animations and transitions
  - Privacy-first approach (all processing done locally)

## Tech Stack

- **Framework**: Next.js 15.3.1
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI for accessible components
  - Custom UI components
  - Framer Motion for animations
- **Image Processing**: 
  - ONNX Runtime for AI processing
  - Background removal capabilities
- **Development Tools**:
  - ESLint for code quality
  - TypeScript for type safety
  - Prettier for code formatting

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

## Project Structure

```
snap-core/
├── app/                # Next.js app directory
│   ├── page.tsx       # Main page
│   ├── layout.tsx     # Root layout
│   └── globals.css    # Global styles
├── components/        # React components
│   ├── home/         # Home page components
│   ├── ui/           # Reusable UI components
│   └── eldoraui/     # Custom UI components
├── public/           # Static assets
└── lib/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com) - Unstyled, accessible components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [ONNX Runtime](https://onnxruntime.ai) - AI processing
