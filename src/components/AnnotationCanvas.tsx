"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { useAnnotationStore } from "@/store/annotationStore";
import { Point, ROIRectangle } from "@/types/annotation";
import { useCanvasZoom } from "@/hooks/useCanvasZoom";

const COLORS = {
  fat: { stroke: "rgba(255, 0, 0, 1)", fill: "rgba(255, 0, 0, 0.3)" },
  muscle: { stroke: "rgba(0, 0, 255, 1)", fill: "rgba(0, 0, 255, 0.3)" },
  roi: { stroke: "rgba(0, 200, 0, 1)", fill: "rgba(0, 200, 0, 0.2)" },
};

export function AnnotationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const {
    getCurrentImage,
    getCurrentAnnotation,
    currentPolygon,
    annotationType,
    cursorPosition,
    addPoint,
    finalizePolygon,
    setCursorPosition,
    roiSizePreset,
    isDrawingROI,
    currentROI,
    startROI,
    updateROI,
    finalizeROI,
    cancelROI,
  } = useAnnotationStore();

  const {
    zoom,
    isPanning,
    handleWheel,
    startPan,
    pan,
    endPan,
    resetZoom,
    zoomIn,
    zoomOut,
  } = useCanvasZoom();

  const currentImage = getCurrentImage();
  const currentAnnotation = getCurrentAnnotation();

  // Expose zoom controls to parent via ref
  useEffect(() => {
    (window as any).__canvasZoomControls = { resetZoom, zoomIn, zoomOut };
  }, [resetZoom, zoomIn, zoomOut]);

  const drawPolygon = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      points: Point[],
      type: "fat" | "muscle" | "roi",
      completed: boolean = false
    ) => {
      if (points.length === 0) return;

      const colors = COLORS[type];

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (completed) {
        ctx.closePath();
        ctx.fillStyle = colors.fill;
        ctx.fill();
      }

      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2 / zoom.scale;
      ctx.stroke();

      // Draw points
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5 / zoom.scale, 0, Math.PI * 2);
        ctx.fillStyle = colors.stroke;
        ctx.fill();
      });
    },
    [zoom.scale]
  );

  const drawROI = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      roi: ROIRectangle,
      isPreview: boolean = false
    ) => {
      const colors = COLORS.roi;

      ctx.beginPath();
      ctx.rect(roi.x, roi.y, roi.width, roi.height);

      ctx.fillStyle = isPreview ? "rgba(0, 200, 0, 0.15)" : colors.fill;
      ctx.fill();

      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2 / zoom.scale;
      ctx.setLineDash(isPreview ? [5 / zoom.scale, 5 / zoom.scale] : []);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw size label
      const fontSize = Math.max(12 / zoom.scale, 10);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = colors.stroke;
      const label = `${Math.round(roi.width)}x${Math.round(roi.height)}`;
      const textMetrics = ctx.measureText(label);
      const textX = roi.x + (roi.width - textMetrics.width) / 2;
      const textY = roi.y + roi.height / 2 + fontSize / 3;

      // Background for text
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(
        textX - 2 / zoom.scale,
        textY - fontSize,
        textMetrics.width + 4 / zoom.scale,
        fontSize + 4 / zoom.scale
      );

      ctx.fillStyle = colors.stroke;
      ctx.fillText(label, textX, textY);

      // Draw corner markers
      const markerSize = 6 / zoom.scale;
      const corners = [
        { x: roi.x, y: roi.y },
        { x: roi.x + roi.width, y: roi.y },
        { x: roi.x, y: roi.y + roi.height },
        { x: roi.x + roi.width, y: roi.y + roi.height },
      ];

      corners.forEach((corner) => {
        ctx.beginPath();
        ctx.rect(
          corner.x - markerSize / 2,
          corner.y - markerSize / 2,
          markerSize,
          markerSize
        );
        ctx.fillStyle = colors.stroke;
        ctx.fill();
      });
    },
    [zoom.scale]
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imageRef.current) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply zoom and pan transformations
    ctx.translate(zoom.offsetX, zoom.offsetY);
    ctx.scale(zoom.scale, zoom.scale);

    // Draw image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    // Draw completed polygons
    if (currentAnnotation) {
      currentAnnotation.polygons.forEach((polygon) => {
        drawPolygon(ctx, polygon.points, polygon.type, polygon.completed);
      });

      // Draw completed ROIs
      if (currentAnnotation.rois) {
        currentAnnotation.rois.forEach((roi) => {
          drawROI(ctx, roi, false);
        });
      }
    }

    // Draw current polygon being drawn (only for fat/muscle modes)
    if (currentPolygon.length > 0 && annotationType !== "roi") {
      const points = [...currentPolygon];

      // Add cursor position for preview
      if (cursorPosition) {
        points.push(cursorPosition);
      }

      drawPolygon(ctx, points, annotationType, false);
    }

    // Draw current ROI being drawn or preview
    if (currentROI && annotationType === "roi") {
      drawROI(ctx, currentROI, true);
    }

    // Draw cursor preview (even without polygon)
    if (cursorPosition && !isPanning && !isSpacePressed && annotationType !== "roi") {
      const colors = COLORS[annotationType];
      ctx.beginPath();
      ctx.arc(cursorPosition.x, cursorPosition.y, 8 / zoom.scale, 0, Math.PI * 2);
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2 / zoom.scale;
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fill();
    }

    // Restore context state
    ctx.restore();
  }, [
    currentAnnotation,
    currentPolygon,
    annotationType,
    cursorPosition,
    drawPolygon,
    drawROI,
    currentROI,
    zoom,
    isPanning,
    isSpacePressed,
  ]);

  // Load and draw image
  useEffect(() => {
    if (!currentImage) return;

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        redraw();
      }
    };
    img.src = currentImage.url;
  }, [currentImage, redraw]);

  // Redraw when annotations or zoom change
  useEffect(() => {
    redraw();
  }, [redraw]);

  // Handle wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e, canvas);
    };

    canvas.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", wheelHandler);
    };
  }, [handleWheel]);

  // Handle spacebar for pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(false);
        endPan();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpacePressed, endPan]);

  const canvasToImageCoords = (
    clientX: number,
    clientY: number
  ): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    // Get position relative to canvas display
    const displayX = clientX - rect.left;
    const displayY = clientY - rect.top;

    // Scale from display size to canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Get canvas pixel coordinates
    const canvasPixelX = displayX * scaleX;
    const canvasPixelY = displayY * scaleY;

    // Transform to image coordinates considering zoom and pan
    // Reverse the transformation: (canvasPixel - offset) / scale
    const imageX = (canvasPixelX - zoom.offsetX) / zoom.scale;
    const imageY = (canvasPixelY - zoom.offsetY) / zoom.scale;

    // Check if within image bounds
    if (
      imageX < 0 ||
      imageY < 0 ||
      imageX > canvas.width ||
      imageY > canvas.height
    ) {
      return null;
    }

    return { x: imageX, y: imageY };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSpacePressed || e.button === 1) {
      // Middle mouse button or spacebar
      e.preventDefault();
      startPan(e.clientX, e.clientY);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning || isSpacePressed) return;

    const point = canvasToImageCoords(e.clientX, e.clientY);
    if (!point) return;

    if (annotationType === "roi") {
      if (roiSizePreset === "custom") {
        if (!isDrawingROI) {
          startROI(point);
        } else {
          finalizeROI();
        }
      } else {
        // Fixed size ROI - place on click
        startROI(point);
        finalizeROI();
      }
    } else {
      addPoint(point);
    }
  };

  const handleCanvasRightClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isPanning || isSpacePressed) return;

    if (annotationType === "roi") {
      cancelROI();
    } else {
      finalizePolygon();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning || isSpacePressed) {
      pan(e.clientX, e.clientY);
      setCursorPosition(null);
      return;
    }

    const point = canvasToImageCoords(e.clientX, e.clientY);
    setCursorPosition(point);

    // Update ROI preview position
    if (annotationType === "roi" && point) {
      if (isDrawingROI || roiSizePreset !== "custom") {
        updateROI(point);
      }
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      endPan();
    }
  };

  const handleMouseLeave = () => {
    setCursorPosition(null);
    if (isPanning) {
      endPan();
    }
  };

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <p className="text-muted-foreground">
          Nenhuma imagem carregada. Faça upload de imagens para começar.
        </p>
      </div>
    );
  }

  const cursorClass = isPanning || isSpacePressed ? "cursor-grab" : "cursor-crosshair";

  return (
    <div ref={containerRef} className="relative h-full">
      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium border shadow-sm">
        Zoom: {(zoom.scale * 100).toFixed(0)}%
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-muted-foreground border shadow-sm">
        <div className="flex flex-col gap-0.5">
          <span>Scroll: Zoom</span>
          <span>Espaço + Arrastar: Mover</span>
          <span>Cmd/Ctrl + 0: Resetar zoom</span>
        </div>
      </div>

      <div className="flex items-center justify-center h-full bg-muted rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasRightClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`max-w-full max-h-full ${cursorClass}`}
          style={{ imageRendering: "auto" }}
        />
      </div>
    </div>
  );
}
