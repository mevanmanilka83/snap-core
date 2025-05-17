'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { MoveUpRight } from 'lucide-react';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { WordPullUp } from "@/components/eldoraui/wordpullup";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageData {
  id: number;
  src: string;
  alt: string;
}

const images: ImageData[] = [
  {
    id: 1,
    src: '/img/formula.png',
    alt: 'Formula 1',
  },
  {
    id: 2,
    src: '/img/sanfrancisco.png',
    alt: 'San Francisco',
  },
  {
    id: 3,
    src: '/img/motogp.png',
    alt: 'Motogp 2025',
  },
  {
    id: 4,
    src: '/img/morocco.png',
    alt: 'Morocco',
  },
];

const ImageReveal2: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.5);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestRef = useRef<number | null>(null);
  const prevCursorPosition = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { 
    amount: 0.3,
    once: true 
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const dx = clientX - prevCursorPosition.current.x;
    const dy = clientY - prevCursorPosition.current.y;

    // Apply easing to the cursor movement
    const easeAmount = 0.2;
    const newX = prevCursorPosition.current.x + dx * easeAmount;
    const newY = prevCursorPosition.current.y + dy * easeAmount;

    setCursorPosition({ x: newX, y: newY });
    prevCursorPosition.current = { x: newX, y: newY };
  }, []);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      if (requestRef.current) return;
      requestRef.current = requestAnimationFrame(() => {
        handleMouseMove(e);
        requestRef.current = null;
      });
    };

    window.addEventListener('mousemove', updateCursorPosition);
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [handleMouseMove]);

  const handleImageHover = useCallback(
    (image: ImageData) => {
      if (activeImage !== image) {
        setActiveImage(image);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setOpacity(1);
          setScale(1);
        }, 50);
      } else {
        setOpacity(1);
        setScale(1);
      }
    },
    [activeImage]
  );

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
    setScale(0.5);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveImage(null);
    }, 300);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={cn(
        "max-w-3xl mx-auto mb-24 px-4",
        "scroll-mt-24"
      )}
    >
      <div className="text-center mb-12">
        <Badge 
          variant="outline" 
          className={cn(
            "mb-4 text-xs sm:text-sm",
            "animate-fade-in"
          )}
        >
          Thumbnails
        </Badge>
        <div className="min-h-[120px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <WordPullUp 
              text="Thumbnail Showcase" 
              className="text-2xl sm:text-3xl md:text-4xl mb-4" 
            />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "text-muted-foreground max-w-2xl mx-auto",
            "text-sm sm:text-base"
          )}
        >
          Explore our collection of stunning thumbnails created with Snap Core
        </motion.p>
      </div>

      <div
        className='relative w-full min-h-fit rounded-md'
        onMouseLeave={handleMouseLeave}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className={`p-4 cursor-pointer relative sm:flex items-center justify-between`}
            onMouseEnter={() => handleImageHover(image)}
          >
            {!isDesktop && (
              <img
                src={image?.src}
                className='sm:w-32 sm:h-20 w-full h-52 object-cover rounded-md'
                alt='mobileImg'
              />
            )}
            <h2
              className={`font-display dark:text-gray-300 uppercase md:text-5xl sm:text-2xl text-xl font-medium sm:py-6 py-2 leading-[100%] relative ${
                activeImage?.id === image?.id
                  ? 'mix-blend-difference z-20 text-gray-300'
                  : 'text-gray-700'
              }`}
            >
              {image.alt}
            </h2>
            <button
              className={`sm:block hidden p-4 rounded-full transition-all duration-300 ease-out ${
                activeImage?.id === image?.id
                  ? 'mix-blend-difference z-20 bg-white text-black'
                  : ''
              }`}
            >
              <MoveUpRight className='w-8 h-8' />
            </button>
            <div
              className={`h-[2px] dark:bg-white bg-black absolute bottom-0 left-0 transition-all duration-300 ease-linear ${
                activeImage?.id === image?.id ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        ))}
        {isDesktop && activeImage && (
          <motion.img
            src={activeImage.src}
            alt={activeImage.alt}
            className={`fixed dark:bg-gray-950 bg-white object-cover pointer-events-none z-10 w-[400px] h-[500px] rounded-lg shadow-2xl`}
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity,
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: opacity,
              scale: scale,
            }}
          />
        )}
      </div>
    </section>
  );
};

export default ImageReveal2; 