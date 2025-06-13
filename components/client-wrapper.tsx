'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ErrorBoundary } from './ui/error-boundary';
import { Loading } from './ui/loading';

const SmoothScroll = dynamic(() => import("@/components/smooth-scroll"), {
  ssr: false,
  loading: () => null,
});

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading size="lg" fullScreen />}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </Suspense>
    </ErrorBoundary>
  );
} 