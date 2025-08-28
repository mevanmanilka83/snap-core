'use client';
import React from 'react';
import ScrollBaseAnimation from '../text-marquee';
export default function TextMarqueeSection() {
  return (
    <div className='h-[300px] grid place-content-center'>
      <ScrollBaseAnimation
        baseVelocity={3}
        scrollDependent={true}
        clasname='font-bold tracking-[-0.07em] leading-[90%] text-black dark:text-white'
      >
        Create Perfect Thumbnails with Ease
      </ScrollBaseAnimation>
    </div>
  );
} 