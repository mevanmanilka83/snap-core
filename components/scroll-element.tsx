'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

const generateVariants = (direction: Direction) => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const value = direction === 'right' || direction === 'down' ? 100 : -100;

  return {
    hidden: { 
      filter: 'blur(10px)', 
      opacity: 0, 
      [axis]: value 
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      [axis]: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };
};

const defaultViewport = { amount: 0.3, margin: '0px 0px -200px 0px' };

interface ScrollElementProps {
  children: React.ReactNode;
  className?: string;
  viewport?: {
    amount?: number;
    margin?: string;
    once?: boolean;
  };
  delay?: number;
  direction?: Direction;
}

export default function ScrollElement({
  children,
  className,
  viewport = defaultViewport,
  delay = 0,
  direction = 'down',
  ...rest
}: ScrollElementProps) {
  const variants = generateVariants(direction);
  const modifiedVariants = {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...variants.visible.transition,
        delay,
      },
    },
  };

  return (
    <motion.div
      whileInView='visible'
      initial='hidden'
      variants={modifiedVariants}
      viewport={viewport}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}