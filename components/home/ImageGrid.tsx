'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface Image {
  src: string;
  alt: string;
  delay: number;
}

const images: Image[] = [
  {
    src: 'https://images.unsplash.com/photo-1724690416947-3cdc197ffab1?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 1',
    delay: 0
  },
  {
    src: 'https://images.unsplash.com/photo-1695763594594-31505b18b58a?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 2',
    delay: 0.1
  },
  {
    src: 'https://images.unsplash.com/photo-1724888861686-ad3f706ab067?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 3',
    delay: 0.2
  },
  {
    src: 'https://images.unsplash.com/photo-1724884564497-f5024b7e2f93?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 4',
    delay: 0.3
  },
  {
    src: 'https://images.unsplash.com/photo-1460999158988-6f0380f81f4d?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 5',
    delay: 0.4
  },
  {
    src: 'https://images.unsplash.com/photo-1478028928718-7bfdb1b32095?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 6',
    delay: 0.5
  },
  {
    src: 'https://images.unsplash.com/photo-1460999158988-6f0380f81f4d?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 7',
    delay: 0.6
  },
  {
    src: 'https://images.unsplash.com/photo-1478028928718-7bfdb1b32095?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 8',
    delay: 0.7
  },
  {
    src: 'https://images.unsplash.com/photo-1460999158988-6f0380f81f4d?q=80&w=600&auto=format&fit=crop',
    alt: 'Thumbnail example 9',
    delay: 0.8
  }
];

const ImageGrid = memo(function ImageGrid() {
  return (
    <div className={cn(
      'py-2',
      'animate-fade-in'
    )}>
      <div className='columns-3 gap-4'>
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ 
              amount: 0.5,
              once: true 
            }}
            transition={{ 
              duration: 0.5, 
              delay: image.delay 
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={cn(
                'w-full mb-2 rounded-lg',
                'transition-transform duration-300 hover:scale-105'
              )}
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default ImageGrid; 