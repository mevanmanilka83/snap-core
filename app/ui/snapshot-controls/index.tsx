"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Download, X, Package } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";
import { toast } from "sonner";

export interface SnapshotControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoLoaded: boolean;
  videoInfo: {
    width: number;
    height: number;
    duration: number;
    currentTime: number;
  } | null;
  goToTime: (time: number) => void;
}

export function SnapshotControls({
  videoRef,
  videoLoaded,
  videoInfo,
  goToTime,
}: SnapshotControlsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snapWidth, setSnapWidth] = useState(640);
  const [snapDelay, setSnapDelay] = useState(400);
  const [snapInterval, setSnapInterval] = useState("4%");
  const [snapshots, setSnapshots] = useState<
    Array<{
      src: string;
      time: number;
      width: number;
      height: number;
      title: string;
    }>
  >([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<number | null>(null);
  const [snapProc, setSnapProc] = useState<NodeJS.Timeout | null>(null);

  const snapPicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !videoInfo) return;

    const ratio = video.videoWidth / video.videoHeight;
    const width = snapWidth;
    const height = Math.floor(width / ratio);

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillRect(0, 0, width, height);
    context.drawImage(video, 0, 0, width, height);

    const time = video.currentTime;
    const title = `t${("000" + time.toFixed(2)).slice(-7)}seg`;
    const src = canvas.toDataURL("image/png");

    const newSnapshot = {
      src,
      time,
      width,
      height,
      title,
    };

    setSnapshots((prev) => [...prev, newSnapshot]);
    setSelectedSnapshot(snapshots.length);

    toast.success("Snapshot captured", {
      description: `At ${time.toFixed(2)}s (${width}×${height})`,
    });
  };

  const autoSnapPicture = () => {
    clearSnapshots();

    const video = videoRef.current;
    if (!video || !videoInfo) return;

    let interval: number;
    let time = 0.1;

    if (snapInterval.includes("%")) {
      const percentage = Number.parseFloat(snapInterval) / 100;
      interval = percentage * videoInfo.duration;
    } else {
      const minutes = Number.parseFloat(snapInterval.replace("m", ""));
      interval = minutes * 60;
    }

    if (snapProc) {
      clearInterval(snapProc);
    }

    toast.info(`Starting auto-snap at ${snapInterval} intervals`, {
      description: `This will capture snapshots automatically through the video`,
    });

    const proc = setInterval(() => {
      goToTime(time);

      setTimeout(() => {
        snapPicture();
      }, snapDelay);

      time += interval;
      if (time >= videoInfo.duration) {
        if (proc) clearInterval(proc);
        toast.success("Auto-snap completed", {
          description: `Captured ${Math.ceil(
            videoInfo.duration / interval
          )} snapshots`,
        });
      }
    }, snapDelay + 100);

    setSnapProc(proc);
  };

  const clearSnapshots = () => {
    if (snapProc) {
      clearInterval(snapProc);
      setSnapProc(null);
    }
    setSnapshots([]);
    setSelectedSnapshot(null);

    toast.info("All snapshots cleared");
  };

  const saveSelectedImage = () => {
    if (selectedSnapshot === null || !snapshots[selectedSnapshot]) return;

    const snapshot = snapshots[selectedSnapshot];
    const link = document.createElement("a");
    link.href = snapshot.src;
    link.download = `video-capture-${snapshot.title}-${Math.round(
      Math.random() * 10000
    )}.png`;
    link.click();

    toast.success("Image saved", {
      description: `Saved snapshot at ${snapshot.time.toFixed(2)}s`,
    });
  };

  const saveAllImages = () => {
    if (snapshots.length === 0) return;

    const zip = new JSZip();
    const imgFolder = zip.folder("images");

    snapshots.forEach((snapshot) => {
      const imgData = snapshot.src.replace(
        /^data:image\/(png|jpg);base64,/,
        ""
      );
      imgFolder?.file(`${snapshot.title}.png`, imgData, { base64: true });
    });

    toast.info("Preparing ZIP archive...");

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "images.zip");
      toast.success("ZIP archive saved", {
        description: `Saved ${snapshots.length} images`,
      });
    });
  };

  const selectSnapshot = (index: number) => {
    setSelectedSnapshot(index);
    const snapshot = snapshots[index];
    toast.info(`Selected snapshot at ${snapshot.time.toFixed(2)}s`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Snapshot Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-end">
          <div className="w-24">
            <Label htmlFor="snapWidth" className="block mb-1">
              Width
            </Label>
            <Input
              id="snapWidth"
              type="number"
              value={snapWidth}
              onChange={(e) => setSnapWidth(Number.parseInt(e.target.value))}
              disabled={!videoLoaded}
            />
          </div>

          <Button
            onClick={snapPicture}
            disabled={!videoLoaded}
            className="flex-shrink-0 w-full sm:w-auto"
          >
            <Camera className="mr-2 h-4 w-4" />
            Snap Photo
          </Button>

          <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
            <Button
              onClick={autoSnapPicture}
              disabled={!videoLoaded}
              className="rounded-r-none flex-grow sm:flex-grow-0"
            >
              Auto Snap Each
            </Button>
            <Select value={snapInterval} onValueChange={setSnapInterval}>
              <SelectTrigger className="w-24 rounded-l-none">
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2%">2% (50 img)</SelectItem>
                <SelectItem value="4%">4% (25 img)</SelectItem>
                <SelectItem value="5%">5% (20 img)</SelectItem>
                <SelectItem value="6.25%">6.25% (16 img)</SelectItem>
                <SelectItem value="10%">10% (10 img)</SelectItem>
                <SelectItem value="0.0166666m">1 sec</SelectItem>
                <SelectItem value="0.0833333m">5 sec</SelectItem>
                <SelectItem value="0.166666m">10 sec</SelectItem>
                <SelectItem value="0.5m">30 sec</SelectItem>
                <SelectItem value="1m">1 min</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-24 mt-2 sm:mt-0">
            <Label htmlFor="snapDelay" className="block mb-1">
              Delay (ms)
            </Label>
            <Input
              id="snapDelay"
              type="number"
              value={snapDelay}
              onChange={(e) => setSnapDelay(Number.parseInt(e.target.value))}
            />
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {selectedSnapshot !== null && snapshots[selectedSnapshot] && (
          <div className="mt-4">
            <Image
              src={snapshots[selectedSnapshot].src || "/placeholder.svg"}
              alt="Selected snapshot"
              className="max-h-64 mx-auto object-contain border rounded"
              width={snapshots[selectedSnapshot].width}
              height={snapshots[selectedSnapshot].height}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4 max-h-[calc(100vh-400px)] overflow-y-auto">
          {snapshots.map((snapshot, index) => (
            <div
              key={index}
              className="relative w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-1 group"
            >
              <Image
                src={snapshot.src || "/placeholder.svg"}
                alt={`Snapshot at ${snapshot.time.toFixed(2)}s`}
                className={`w-full aspect-video object-cover border-2 rounded cursor-pointer ${
                  selectedSnapshot === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => selectSnapshot(index)}
                width={snapshot.width}
                height={snapshot.height}
              />
              <button
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setSnapshots((prev) => prev.filter((_, i) => i !== index));
                  if (selectedSnapshot === index) {
                    setSelectedSnapshot(null);
                  }
                }}
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 right-1 bg-white/80 text-xs rounded px-1">
                {snapshot.time.toFixed(2)}s
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <div className="space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
            <Button
              onClick={saveSelectedImage}
              disabled={selectedSnapshot === null}
              variant="default"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Save Image
            </Button>

            <Button
              onClick={saveAllImages}
              disabled={snapshots.length === 0}
              variant="default"
              className="w-full sm:w-auto"
            >
              <Package className="mr-2 h-4 w-4" />
              Save All
            </Button>
          </div>

          <Button
            onClick={clearSnapshots}
            disabled={snapshots.length === 0}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
