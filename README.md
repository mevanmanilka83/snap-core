# Snap Core

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-purple?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

## Overview

Snap Core is a modern, privacy-focused application that enables content creators to generate high-quality thumbnails from videos and images. Built with performance and user experience in mind, it offers a comprehensive suite of editing tools while ensuring all processing happens locally in the browser.

## 🚀 Key Features

- 🎬 Effortlessly create stunning image and video thumbnails
- ✨ Instantly remove backgrounds with smart AI technology
- 🎨 Enhance visuals with powerful filters and adjustments
- 📝 Add and style text overlays to make your thumbnails pop
- 🔒 100% privacy — all editing happens locally in your browser

## 🛠️ How to Use

1. **Upload Your Media**
   - Click “Upload” to select an image or video from your device.

2. **Remove the Background**
   - Use the “Remove Background” button to instantly erase backgrounds with AI.

3. **Edit & Enhance**
   - Apply filters and adjustments to improve your image or video frame.
   - Add and customize text overlays to make your thumbnail stand out.

4. **Preview Your Thumbnail**
   - See real-time previews as you edit.

5. **Download**
   - Click “Download” to save your finished thumbnail to your device.

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
