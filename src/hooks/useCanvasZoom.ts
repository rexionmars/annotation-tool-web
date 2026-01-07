import { useState, useCallback, useRef } from "react";

export interface ZoomState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export function useCanvasZoom(initialScale = 1) {
  const [zoom, setZoom] = useState<ZoomState>({
    scale: initialScale,
    offsetX: 0,
    offsetY: 0,
  });

  const [isPanning, setIsPanning] = useState(false);
  const lastPanPoint = useRef<{ x: number; y: number } | null>(null);

  const handleWheel = useCallback(
    (e: WheelEvent, canvas: HTMLCanvasElement) => {
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Zoom factor
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(0.5, zoom.scale * zoomFactor), 5);

      // Calculate new offset to zoom towards mouse position
      const scaleChange = newScale / zoom.scale;

      const newOffsetX = mouseX - (mouseX - zoom.offsetX) * scaleChange;
      const newOffsetY = mouseY - (mouseY - zoom.offsetY) * scaleChange;

      setZoom({
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
    },
    [zoom]
  );

  const startPan = useCallback((x: number, y: number) => {
    setIsPanning(true);
    lastPanPoint.current = { x, y };
  }, []);

  const pan = useCallback(
    (x: number, y: number) => {
      if (!isPanning || !lastPanPoint.current) return;

      const dx = x - lastPanPoint.current.x;
      const dy = y - lastPanPoint.current.y;

      setZoom((prev) => ({
        ...prev,
        offsetX: prev.offsetX + dx,
        offsetY: prev.offsetY + dy,
      }));

      lastPanPoint.current = { x, y };
    },
    [isPanning]
  );

  const endPan = useCallback(() => {
    setIsPanning(false);
    lastPanPoint.current = null;
  }, []);

  const resetZoom = useCallback(() => {
    setZoom({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    });
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 5),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => ({
      ...prev,
      scale: Math.max(prev.scale * 0.8, 0.5),
    }));
  }, []);

  return {
    zoom,
    isPanning,
    handleWheel,
    startPan,
    pan,
    endPan,
    resetZoom,
    zoomIn,
    zoomOut,
  };
}
