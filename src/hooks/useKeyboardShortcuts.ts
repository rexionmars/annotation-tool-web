import { useEffect } from "react";

export interface KeyboardShortcuts {
  onFatMode?: () => void;
  onMuscleMode?: () => void;
  onROIMode?: () => void;
  onFinalizePolygon?: () => void;
  onClearPolygon?: () => void;
  onResetAnnotations?: () => void;
  onNextImage?: () => void;
  onPreviousImage?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onSave?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Check for modifier keys
      const isMeta = e.metaKey || e.ctrlKey;

      switch (e.key.toLowerCase()) {
        case "f":
          e.preventDefault();
          shortcuts.onFatMode?.();
          break;

        case "m":
          e.preventDefault();
          shortcuts.onMuscleMode?.();
          break;

        case "enter":
          e.preventDefault();
          shortcuts.onFinalizePolygon?.();
          break;

        case "escape":
          e.preventDefault();
          shortcuts.onClearPolygon?.();
          break;

        case "r":
          if (!isMeta) {
            e.preventDefault();
            shortcuts.onROIMode?.();
          }
          break;

        case "arrowright":
          e.preventDefault();
          shortcuts.onNextImage?.();
          break;

        case "arrowleft":
          e.preventDefault();
          shortcuts.onPreviousImage?.();
          break;

        case "+":
        case "=":
          if (isMeta) {
            e.preventDefault();
            shortcuts.onZoomIn?.();
          }
          break;

        case "-":
          if (isMeta) {
            e.preventDefault();
            shortcuts.onZoomOut?.();
          }
          break;

        case "0":
          if (isMeta) {
            e.preventDefault();
            shortcuts.onResetZoom?.();
          }
          break;

        case "s":
          if (isMeta) {
            e.preventDefault();
            shortcuts.onSave?.();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}
