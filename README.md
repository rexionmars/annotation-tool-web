# Carcass Annotation Tool - Web

Modern web version of the annotation tool for fat and muscle segmentation in carcass images, built with Next.js and shadcn/ui.

![Annotation Tool Interface](docs/images/Screenshot%202026-01-07%20at%2013.03.59.jpeg)

![ROI Selection](docs/images/Screenshot%202026-01-07%20at%2013.04.06.jpeg)

## Features

- Modern and responsive web interface
- Interactive polygon annotations
- ROI (Region of Interest) with predefined sizes
- Multi-image support
- Light/dark theme toggle
- Complete annotation export (masks + segmented images + ROI crops)
- Real-time annotation preview
- Efficient state management with Zustand

## Technologies

- **Next.js 15** - React Framework
- **TypeScript** - Static typing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Zustand** - State management
- **Lucide React** - Icons
- **JSZip** - File export

## Installation

```bash
# Install dependencies
npm install

# or with yarn
yarn install

# or with pnpm
pnpm install
```

## Usage

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## User Guide

### 1. Image Upload

- Click "Select Images" on the home screen
- Choose one or multiple carcass images
- Supported formats: JPG, PNG, BMP, TIFF

### 2. Creating Annotations

1. **Select mode**: Choose between "Fat" (red), "Muscle" (blue), or "ROI" (green)
2. **Draw polygon** (Fat/Muscle mode):
   - Left click to add points
   - Right click to finalize the polygon (minimum 3 points)
3. **Draw ROI** (ROI mode):
   - Select a predefined size or "Custom"
   - Click to place fixed-size ROI, or click and drag for custom ROI
4. **Visualization**: Annotations appear with semi-transparent overlay

### 3. Controls

#### Annotation Modes
- **Fat**: Annotate fat regions (red color)
- **Muscle**: Annotate muscle regions (blue color)
- **ROI**: Draw regions of interest (green color)

#### ROI Size Presets
| Size | Description |
|------|-------------|
| 32x32 | Small feature patches |
| 64x64 | Texture analysis |
| 128x128 | Standard template |
| 227x227 | AlexNet input |
| 256x256 | ResNet50 input |
| 512x512 | High-resolution analysis |
| Custom | Free-form rectangle |

#### Polygon Actions
- **Finalize Polygon**: Complete the current polygon
- **Clear Polygon**: Remove points from the polygon in progress
- **Reset Annotations**: Remove all annotations from the current image

#### Navigation
- **Previous**: Go to the previous image
- **Next**: Go to the next image

### 4. Export

Click "Export Annotations" to download a ZIP file containing:

```
annotations_YYYY-MM-DD.zip
├── fat/                    # Segmented fat images
│   ├── image1_fat.png
│   └── image2_fat.png
├── muscle/                 # Segmented muscle images
│   ├── image1_muscle.png
│   └── image2_muscle.png
├── masks/                  # Binary masks
│   ├── image1_fat_mask.png
│   ├── image1_muscle_mask.png
│   ├── image2_fat_mask.png
│   └── image2_muscle_mask.png
├── roi/                    # ROI masks and metadata
│   ├── image1_roi_mask.png
│   └── image1_roi_metadata.json
└── roi_crops/              # Individual ROI crops
    ├── image1_roi_1_128x128.png
    └── image1_roi_2_256x256.png
```

### 5. Theme

Use the toggle button in the top right corner to switch between light and dark mode.

## Project Structure

```
annotation-tool-web/
├── src/
│   ├── app/                    # Next.js routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── separator.tsx
│   │   ├── AnnotationCanvas.tsx
│   │   ├── Toolbar.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── ExportButton.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useCanvasZoom.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── lib/                    # Utilities
│   │   ├── utils.ts
│   │   └── export.ts
│   ├── store/                  # Global state
│   │   └── annotationStore.ts
│   └── types/                  # TypeScript types
│       └── annotation.ts
├── docs/                       # Documentation
│   └── images/                 # Screenshots
├── public/                     # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## Technical Features

### Annotation Canvas
- Interactive polygon drawing
- Real-time cursor preview
- Automatic scaling for different screen sizes
- Support for multiple annotations per image
- Zoom and pan functionality

### ROI System
- Predefined sizes for CNN compatibility
- Custom free-form rectangles
- Centered placement on click
- Size labels displayed on ROIs

### State Management
- Global state with Zustand
- Annotation persistence per image
- Navigation history between images

### Export
- Binary mask generation (black/white)
- Segmented region extraction from original image
- ROI cropping with metadata JSON
- ZIP compression for easy download

## Keyboard Shortcuts

### Annotation Modes
- `F` - Fat Mode
- `M` - Muscle Mode
- `R` - ROI Mode

### Polygon Controls
- `Enter` - Finalize polygon
- `Esc` - Clear current polygon / Cancel ROI

### Navigation
- `Right Arrow` - Next image
- `Left Arrow` - Previous image

### Zoom and View
- `Mouse Scroll` - Zoom in/out
- `Cmd/Ctrl + +` - Zoom in
- `Cmd/Ctrl + -` - Zoom out
- `Cmd/Ctrl + 0` - Reset zoom
- `Space + Drag` - Pan image
- `Middle Button + Drag` - Pan image

### Export
- `Cmd/Ctrl + S` - Save/Export annotations

## Contributing

This is an academic project from iCEV. Suggestions and improvements are welcome.

## License

MIT

## Author

**Joao Leonardi**
Computer Vision Research Center, iCEV Institute of Higher Education, Teresina, Brazil
