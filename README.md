# Snap Core

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-purple?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

## Overview

Snap Core is a modern, privacy-focused application that enables content creators to generate high-quality thumbnails from videos and images. Built with performance and user experience in mind, it offers a comprehensive suite of editing tools while ensuring all processing happens locally in the browser.

## 🛠️ Features

### Video Thumbnail Creation
1. **Video Frame Selection**
   - Upload video files or paste video URLs
   - Capture frames manually or use auto-capture for key frames
   - Preview and select the perfect frame for your thumbnail

2. **Background Removal**
   - AI-powered background removal
   - Real-time preview of the processed image
   - Undo/redo functionality for background removal

3. **Text & Styling**
   - Add multiple text elements
   - Customize text style, size, and position
   - Apply various text effects and animations

4. **Final Preview**
   - Preview your thumbnail before saving
   - Download in high quality
   - Share directly to social media

### Image Thumbnail Creation
- Direct image upload support
- Same powerful editing features as video thumbnails
- Quick and efficient processing

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

## Privacy & Security

- All processing happens locally in your browser
- No data is sent to external servers
- Your content remains private and secure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
