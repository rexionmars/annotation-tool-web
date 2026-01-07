"use client";

import React from "react";
import { AnnotationCanvas } from "@/components/AnnotationCanvas";
import { Toolbar } from "@/components/Toolbar";
import { ImageUpload } from "@/components/ImageUpload";
import { ExportButton } from "@/components/ExportButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAnnotationStore } from "@/store/annotationStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { exportAnnotations } from "@/lib/export";

export default function Home() {
  const {
    images,
    annotations,
    setAnnotationType,
    finalizePolygon,
    clearCurrentPolygon,
    resetAnnotations,
    nextImage,
    previousImage,
    annotationType,
    cancelROI,
  } = useAnnotationStore();

  const hasImages = images.length > 0;

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onFatMode: () => setAnnotationType("fat"),
    onMuscleMode: () => setAnnotationType("muscle"),
    onROIMode: () => setAnnotationType("roi"),
    onFinalizePolygon: () => {
      if (annotationType !== "roi") {
        finalizePolygon();
      }
    },
    onClearPolygon: () => {
      if (annotationType === "roi") {
        cancelROI();
      } else {
        clearCurrentPolygon();
      }
    },
    onNextImage: nextImage,
    onPreviousImage: previousImage,
    onZoomIn: () => {
      const controls = (window as any).__canvasZoomControls;
      controls?.zoomIn();
    },
    onZoomOut: () => {
      const controls = (window as any).__canvasZoomControls;
      controls?.zoomOut();
    },
    onResetZoom: () => {
      const controls = (window as any).__canvasZoomControls;
      controls?.resetZoom();
    },
    onSave: async () => {
      if (images.length > 0) {
        await exportAnnotations(images, annotations);
      }
    },
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Carcass Annotation Tool
              </h1>
              <p className="text-sm text-muted-foreground">
                Fat, muscle and ROI segmentation in images
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ExportButton />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {hasImages ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 h-[calc(100vh-180px)]">
            {/* Canvas Area */}
            <div className="h-full">
              <AnnotationCanvas />
            </div>

            {/* Sidebar */}
            <div className="h-full overflow-y-auto">
              <Toolbar />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
            <div className="max-w-md w-full">
              <ImageUpload />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
