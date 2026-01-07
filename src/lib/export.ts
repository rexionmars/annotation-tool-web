import { Polygon, ImageData, ROIRectangle } from "@/types/annotation";

export async function generateMask(
  imageData: ImageData,
  polygons: Polygon[],
  type: "fat" | "muscle"
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Clear to black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw white polygons for the specified type
  const filteredPolygons = polygons.filter((p) => p.type === type);

  ctx.fillStyle = "white";
  filteredPolygons.forEach((polygon) => {
    ctx.beginPath();
    ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
    polygon.points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, "image/png");
  });
}

export async function generateSegmentedImage(
  imageData: ImageData,
  polygons: Polygon[],
  type: "fat" | "muscle"
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Load original image
  const img = new Image();
  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = imageData.url;
  });

  // Draw image
  ctx.drawImage(img, 0, 0);

  // Get image data
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Create mask
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = imageData.width;
  maskCanvas.height = imageData.height;
  const maskCtx = maskCanvas.getContext("2d");
  if (!maskCtx) throw new Error("Could not get mask context");

  // Draw polygons on mask
  const filteredPolygons = polygons.filter((p) => p.type === type);
  filteredPolygons.forEach((polygon) => {
    maskCtx.beginPath();
    maskCtx.moveTo(polygon.points[0].x, polygon.points[0].y);
    polygon.points.forEach((point) => {
      maskCtx.lineTo(point.x, point.y);
    });
    maskCtx.closePath();
    maskCtx.fillStyle = "white";
    maskCtx.fill();
  });

  const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);

  // Apply mask to image data
  for (let i = 0; i < imgData.data.length; i += 4) {
    if (maskData.data[i] === 0) {
      // Not in mask, make transparent/black
      imgData.data[i] = 0;
      imgData.data[i + 1] = 0;
      imgData.data[i + 2] = 0;
      imgData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, "image/png");
  });
}

export async function generateROICrop(
  imageData: ImageData,
  roi: ROIRectangle
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = roi.width;
  canvas.height = roi.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const img = new Image();
  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = imageData.url;
  });

  ctx.drawImage(
    img,
    roi.x,
    roi.y,
    roi.width,
    roi.height,
    0,
    0,
    roi.width,
    roi.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, "image/png");
  });
}

export async function generateROIMask(
  imageData: ImageData,
  rois: ROIRectangle[]
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  rois.forEach((roi) => {
    ctx.fillRect(roi.x, roi.y, roi.width, roi.height);
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, "image/png");
  });
}

export async function exportAnnotations(
  images: ImageData[],
  annotations: Map<string, any>
) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const fatFolder = zip.folder("fat");
  const muscleFolder = zip.folder("muscle");
  const masksFolder = zip.folder("masks");
  const roiFolder = zip.folder("roi");
  const roiCropsFolder = zip.folder("roi_crops");

  for (const image of images) {
    const annotation = annotations.get(image.id);
    if (!annotation) continue;

    const hasPolygons = annotation.polygons && annotation.polygons.length > 0;
    const hasROIs = annotation.rois && annotation.rois.length > 0;

    if (!hasPolygons && !hasROIs) continue;

    const baseName = image.name.replace(/\.[^/.]+$/, "");

    // Generate polygon masks and segmented images
    if (hasPolygons) {
      const fatMask = await generateMask(image, annotation.polygons, "fat");
      const muscleMask = await generateMask(image, annotation.polygons, "muscle");

      const fatSegmented = await generateSegmentedImage(
        image,
        annotation.polygons,
        "fat"
      );
      const muscleSegmented = await generateSegmentedImage(
        image,
        annotation.polygons,
        "muscle"
      );

      masksFolder?.file(`${baseName}_fat_mask.png`, fatMask);
      masksFolder?.file(`${baseName}_muscle_mask.png`, muscleMask);
      fatFolder?.file(`${baseName}_fat.png`, fatSegmented);
      muscleFolder?.file(`${baseName}_muscle.png`, muscleSegmented);
    }

    // Generate ROI outputs
    if (hasROIs) {
      const roiMask = await generateROIMask(image, annotation.rois);
      roiFolder?.file(`${baseName}_roi_mask.png`, roiMask);

      // Generate individual ROI crops
      for (let i = 0; i < annotation.rois.length; i++) {
        const roi = annotation.rois[i];
        const roiCrop = await generateROICrop(image, roi);
        const sizeLabel = `${roi.width}x${roi.height}`;
        roiCropsFolder?.file(`${baseName}_roi_${i + 1}_${sizeLabel}.png`, roiCrop);
      }

      // Generate ROI metadata JSON
      const roiMetadata = annotation.rois.map((roi: ROIRectangle, idx: number) => ({
        index: idx + 1,
        x: Math.round(roi.x),
        y: Math.round(roi.y),
        width: Math.round(roi.width),
        height: Math.round(roi.height),
        sizePreset: roi.sizePreset,
        label: roi.label || null,
      }));
      roiFolder?.file(
        `${baseName}_roi_metadata.json`,
        JSON.stringify(roiMetadata, null, 2)
      );
    }
  }

  // Generate and download zip
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = `annotations_${new Date().toISOString().split("T")[0]}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
