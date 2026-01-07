import { create } from "zustand";
import {
  AnnotationType,
  Point,
  Polygon,
  ImageData,
  Annotation,
  ROISizePreset,
  ROIRectangle,
  ROI_SIZE_PRESETS,
} from "@/types/annotation";

interface AnnotationState {
  // Images
  images: ImageData[];
  currentImageIndex: number;

  // Annotations
  annotations: Map<string, Annotation>;

  // Current drawing state
  currentPolygon: Point[];
  annotationType: AnnotationType;
  cursorPosition: Point | null;

  // ROI state
  roiSizePreset: ROISizePreset;
  isDrawingROI: boolean;
  roiStartPoint: Point | null;
  currentROI: ROIRectangle | null;

  // Actions
  addImages: (files: File[]) => Promise<void>;
  setCurrentImageIndex: (index: number) => void;
  nextImage: () => void;
  previousImage: () => void;

  // Annotation actions
  setAnnotationType: (type: AnnotationType) => void;
  addPoint: (point: Point) => void;
  finalizePolygon: () => void;
  clearCurrentPolygon: () => void;
  resetAnnotations: () => void;
  setCursorPosition: (position: Point | null) => void;

  // ROI actions
  setROISizePreset: (preset: ROISizePreset) => void;
  startROI: (point: Point) => void;
  updateROI: (point: Point) => void;
  finalizeROI: () => void;
  cancelROI: () => void;
  deleteROI: (roiId: string) => void;

  // Utility
  getCurrentImage: () => ImageData | null;
  getCurrentAnnotation: () => Annotation | null;
  deletePolygon: (polygonId: string) => void;
}

export const useAnnotationStore = create<AnnotationState>((set, get) => ({
  images: [],
  currentImageIndex: 0,
  annotations: new Map(),
  currentPolygon: [],
  annotationType: "fat",
  cursorPosition: null,
  roiSizePreset: "128x128",
  isDrawingROI: false,
  roiStartPoint: null,
  currentROI: null,

  addImages: async (files: File[]) => {
    const imagePromises = files.map(
      (file) =>
        new Promise<ImageData>((resolve) => {
          const reader = new FileReader();
          const img = new Image();

          reader.onload = (e) => {
            img.onload = () => {
              resolve({
                id: crypto.randomUUID(),
                name: file.name,
                url: e.target?.result as string,
                file,
                width: img.width,
                height: img.height,
              });
            };
            img.src = e.target?.result as string;
          };

          reader.readAsDataURL(file);
        })
    );

    const newImages = await Promise.all(imagePromises);

    set((state) => {
      const annotations = new Map(state.annotations);

      // Initialize annotations for new images
      newImages.forEach((img) => {
        if (!annotations.has(img.id)) {
          annotations.set(img.id, {
            imageId: img.id,
            polygons: [],
            rois: [],
          });
        }
      });

      return {
        images: [...state.images, ...newImages],
        annotations,
      };
    });
  },

  setCurrentImageIndex: (index: number) => {
    const { images } = get();
    if (index >= 0 && index < images.length) {
      set({
        currentImageIndex: index,
        currentPolygon: [],
        cursorPosition: null,
      });
    }
  },

  nextImage: () => {
    const { currentImageIndex, images } = get();
    if (currentImageIndex < images.length - 1) {
      set({
        currentImageIndex: currentImageIndex + 1,
        currentPolygon: [],
        cursorPosition: null,
      });
    }
  },

  previousImage: () => {
    const { currentImageIndex } = get();
    if (currentImageIndex > 0) {
      set({
        currentImageIndex: currentImageIndex - 1,
        currentPolygon: [],
        cursorPosition: null,
      });
    }
  },

  setAnnotationType: (type: AnnotationType) => {
    set({ annotationType: type });
  },

  addPoint: (point: Point) => {
    set((state) => ({
      currentPolygon: [...state.currentPolygon, point],
    }));
  },

  finalizePolygon: () => {
    const { currentPolygon, annotationType, getCurrentImage, annotations } =
      get();

    if (currentPolygon.length < 3) {
      set({ currentPolygon: [] });
      return;
    }

    const currentImage = getCurrentImage();
    if (!currentImage) return;

    const newPolygon: Polygon = {
      id: crypto.randomUUID(),
      points: currentPolygon,
      type: annotationType,
      completed: true,
    };

    const newAnnotations = new Map(annotations);
    const imageAnnotation = newAnnotations.get(currentImage.id);

    if (imageAnnotation) {
      imageAnnotation.polygons.push(newPolygon);
      newAnnotations.set(currentImage.id, imageAnnotation);
    }

    set({
      annotations: newAnnotations,
      currentPolygon: [],
      cursorPosition: null,
    });
  },

  clearCurrentPolygon: () => {
    set({ currentPolygon: [], cursorPosition: null });
  },

  resetAnnotations: () => {
    const { getCurrentImage, annotations } = get();
    const currentImage = getCurrentImage();

    if (!currentImage) return;

    const newAnnotations = new Map(annotations);
    newAnnotations.set(currentImage.id, {
      imageId: currentImage.id,
      polygons: [],
      rois: [],
    });

    set({
      annotations: newAnnotations,
      currentPolygon: [],
      cursorPosition: null,
      isDrawingROI: false,
      roiStartPoint: null,
      currentROI: null,
    });
  },

  setCursorPosition: (position: Point | null) => {
    set({ cursorPosition: position });
  },

  getCurrentImage: () => {
    const { images, currentImageIndex } = get();
    return images[currentImageIndex] || null;
  },

  getCurrentAnnotation: () => {
    const { annotations } = get();
    const currentImage = get().getCurrentImage();

    if (!currentImage) return null;

    return annotations.get(currentImage.id) || null;
  },

  deletePolygon: (polygonId: string) => {
    const { getCurrentImage, annotations } = get();
    const currentImage = getCurrentImage();

    if (!currentImage) return;

    const newAnnotations = new Map(annotations);
    const imageAnnotation = newAnnotations.get(currentImage.id);

    if (imageAnnotation) {
      imageAnnotation.polygons = imageAnnotation.polygons.filter(
        (p) => p.id !== polygonId
      );
      newAnnotations.set(currentImage.id, imageAnnotation);
    }

    set({ annotations: newAnnotations });
  },

  // ROI actions
  setROISizePreset: (preset: ROISizePreset) => {
    set({ roiSizePreset: preset });
  },

  startROI: (point: Point) => {
    const { roiSizePreset } = get();
    const preset = ROI_SIZE_PRESETS[roiSizePreset];

    if (roiSizePreset === "custom") {
      set({
        isDrawingROI: true,
        roiStartPoint: point,
        currentROI: {
          id: crypto.randomUUID(),
          x: point.x,
          y: point.y,
          width: 0,
          height: 0,
          sizePreset: roiSizePreset,
        },
      });
    } else {
      // Fixed size ROI - center on click point
      const roi: ROIRectangle = {
        id: crypto.randomUUID(),
        x: point.x - preset.width / 2,
        y: point.y - preset.height / 2,
        width: preset.width,
        height: preset.height,
        sizePreset: roiSizePreset,
      };
      set({ currentROI: roi });
    }
  },

  updateROI: (point: Point) => {
    const { isDrawingROI, roiStartPoint, roiSizePreset, currentROI } = get();

    if (roiSizePreset === "custom" && isDrawingROI && roiStartPoint) {
      const width = point.x - roiStartPoint.x;
      const height = point.y - roiStartPoint.y;

      set({
        currentROI: {
          ...currentROI!,
          x: width >= 0 ? roiStartPoint.x : point.x,
          y: height >= 0 ? roiStartPoint.y : point.y,
          width: Math.abs(width),
          height: Math.abs(height),
        },
      });
    } else if (roiSizePreset !== "custom") {
      // Fixed size - update position to center on cursor
      const preset = ROI_SIZE_PRESETS[roiSizePreset];
      set({
        currentROI: {
          id: currentROI?.id || crypto.randomUUID(),
          x: point.x - preset.width / 2,
          y: point.y - preset.height / 2,
          width: preset.width,
          height: preset.height,
          sizePreset: roiSizePreset,
        },
      });
    }
  },

  finalizeROI: () => {
    const { currentROI, getCurrentImage, annotations, roiSizePreset } = get();
    const currentImage = getCurrentImage();

    if (!currentROI || !currentImage) {
      set({ isDrawingROI: false, roiStartPoint: null, currentROI: null });
      return;
    }

    // Minimum size check for custom ROIs
    if (roiSizePreset === "custom" && (currentROI.width < 10 || currentROI.height < 10)) {
      set({ isDrawingROI: false, roiStartPoint: null, currentROI: null });
      return;
    }

    const newAnnotations = new Map(annotations);
    const imageAnnotation = newAnnotations.get(currentImage.id);

    if (imageAnnotation) {
      imageAnnotation.rois = [...(imageAnnotation.rois || []), currentROI];
      newAnnotations.set(currentImage.id, imageAnnotation);
    }

    set({
      annotations: newAnnotations,
      isDrawingROI: false,
      roiStartPoint: null,
      currentROI: null,
    });
  },

  cancelROI: () => {
    set({
      isDrawingROI: false,
      roiStartPoint: null,
      currentROI: null,
    });
  },

  deleteROI: (roiId: string) => {
    const { getCurrentImage, annotations } = get();
    const currentImage = getCurrentImage();

    if (!currentImage) return;

    const newAnnotations = new Map(annotations);
    const imageAnnotation = newAnnotations.get(currentImage.id);

    if (imageAnnotation) {
      imageAnnotation.rois = (imageAnnotation.rois || []).filter(
        (r) => r.id !== roiId
      );
      newAnnotations.set(currentImage.id, imageAnnotation);
    }

    set({ annotations: newAnnotations });
  },
}));
