"use client";

import dynamic from "next/dynamic";

const VideoThumbnailGenerator = dynamic(
  () => import("@/app/ui/thumbnail-generator"),
  { ssr: false }
);

export default function ClientWrapper() {
  return <VideoThumbnailGenerator />;
}
