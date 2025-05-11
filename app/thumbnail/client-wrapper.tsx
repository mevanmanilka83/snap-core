"use client";

import dynamic from "next/dynamic";

const VideoThumbnailGenerator = dynamic(
  () => import("@/app/thumbnail/video-thumbnail/page"),
  { ssr: false }
);

export default function ClientWrapper() {
  return <VideoThumbnailGenerator />;
}
