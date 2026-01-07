export type AnnotationType = "fat" | "muscle" | "roi";

export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  id: string;
  points: Point[];
  type: AnnotationType;
  completed: boolean;
}

/**
 * ROI (Region of Interest) predefined sizes
 *
 * Sizes follow power-of-2 pattern for GPU memory alignment and CNN compatibility:
 * - 32x32: Small feature patches, fine detail extraction
 * - 64x64: Texture analysis, small object detection
 * - 128x128: Standard template size
 * - 227x227: AlexNet input standard
 * - 256x256: ResNet50 input standard
 * - 512x512: High-resolution analysis patches
 */
export type ROISizePreset =
  | "32x32"
  | "64x64"
  | "128x128"
  | "227x227"
  | "256x256"
  | "512x512"
  | "custom";

export interface ROISize {
  width: number;
  height: number;
  label: string;
  description: string;
}

export const ROI_SIZE_PRESETS: Record<ROISizePreset, ROISize> = {
  "32x32": {
    width: 32,
    height: 32,
    label: "32x32",
    description: "Small feature patches"
  },
  "64x64": {
    width: 64,
    height: 64,
    label: "64x64",
    description: "Texture analysis"
  },
  "128x128": {
    width: 128,
    height: 128,
    label: "128x128",
    description: "Standard template"
  },
  "227x227": {
    width: 227,
    height: 227,
    label: "227x227",
    description: "AlexNet input"
  },
  "256x256": {
    width: 256,
    height: 256,
    label: "256x256",
    description: "ResNet50 input"
  },
  "512x512": {
    width: 512,
    height: 512,
    label: "512x512",
    description: "High-resolution analysis"
  },
  "custom": {
    width: 0,
    height: 0,
    label: "Custom",
    description: "Free-form rectangle"
  }
};

export interface ROIRectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sizePreset: ROISizePreset;
  label?: string;
}

export interface ImageData {
  id: string;
  name: string;
  url: string;
  file: File;
  width: number;
  height: number;
}

export interface Annotation {
  imageId: string;
  polygons: Polygon[];
  rois: ROIRectangle[];
  fatMask?: ImageData;
  muscleMask?: ImageData;
}

export interface AnnotationProject {
  images: ImageData[];
  annotations: Map<string, Annotation>;
  currentImageIndex: number;
}
