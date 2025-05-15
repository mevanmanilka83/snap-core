# Snap Core - Background Removal Tool

A modern web application built with Next.js for removing backgrounds from images using AI technology.

## Features

- AI-powered background removal
- Modern UI with Tailwind CSS
- Responsive design
- Dark/Light mode support
- Image processing and export capabilities

## Tech Stack

- Next.js 15.3.1
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- Framer Motion for animations
- ONNX Runtime for AI processing

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

## Building for Production

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm run start
# or
yarn start
```

## Project Structure

```
snap-core/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── lib/             # Utility functions and shared logic
├── public/          # Static assets
└── styles/          # Global styles and Tailwind config
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

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [ONNX Runtime](https://onnxruntime.ai)
