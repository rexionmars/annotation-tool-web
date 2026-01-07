"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eraser,
  CheckCircle,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAnnotationStore } from "@/store/annotationStore";
import { cn } from "@/lib/utils";
import { ROI_SIZE_PRESETS, ROISizePreset } from "@/types/annotation";

export function Toolbar() {
  const {
    annotationType,
    setAnnotationType,
    currentPolygon,
    finalizePolygon,
    clearCurrentPolygon,
    resetAnnotations,
    previousImage,
    nextImage,
    images,
    currentImageIndex,
    roiSizePreset,
    setROISizePreset,
    isDrawingROI,
    cancelROI,
    getCurrentAnnotation,
  } = useAnnotationStore();

  const currentAnnotation = getCurrentAnnotation();

  const currentImage = images[currentImageIndex];
  const hasImages = images.length > 0;
  const canGoPrevious = currentImageIndex > 0;
  const canGoNext = currentImageIndex < images.length - 1;

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        {/* Image Info */}
        <div className="text-center">
          {hasImages ? (
            <div>
              <p className="text-sm font-medium">
                Imagem {currentImageIndex + 1} de {images.length}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentImage?.name}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma imagem carregada
            </p>
          )}
        </div>

        <Separator />

        {/* Annotation Mode */}
        <div>
          <p className="text-sm font-medium mb-2">Modo de Anotacao</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={annotationType === "fat" ? "default" : "outline"}
              onClick={() => setAnnotationType("fat")}
              className={cn(
                annotationType === "fat" && "bg-red-500 hover:bg-red-600"
              )}
              size="sm"
            >
              Gordura
            </Button>
            <Button
              variant={annotationType === "muscle" ? "default" : "outline"}
              onClick={() => setAnnotationType("muscle")}
              className={cn(
                annotationType === "muscle" && "bg-blue-500 hover:bg-blue-600"
              )}
              size="sm"
            >
              Musculo
            </Button>
            <Button
              variant={annotationType === "roi" ? "default" : "outline"}
              onClick={() => setAnnotationType("roi")}
              className={cn(
                annotationType === "roi" && "bg-green-500 hover:bg-green-600"
              )}
              size="sm"
            >
              <Square className="mr-1 h-3 w-3" />
              ROI
            </Button>
          </div>
        </div>

        {/* ROI Size Selector - Only show when ROI mode is active */}
        {annotationType === "roi" && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Tamanho ROI (NASA JPL)</p>
              <div className="grid grid-cols-2 gap-1">
                {(Object.keys(ROI_SIZE_PRESETS) as ROISizePreset[]).map((preset) => {
                  const size = ROI_SIZE_PRESETS[preset];
                  return (
                    <Button
                      key={preset}
                      variant={roiSizePreset === preset ? "default" : "outline"}
                      onClick={() => setROISizePreset(preset)}
                      className={cn(
                        "text-xs h-auto py-1.5",
                        roiSizePreset === preset && "bg-green-500 hover:bg-green-600"
                      )}
                      size="sm"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{size.label}</span>
                        <span className="text-[9px] opacity-70 truncate max-w-full">
                          {size.description}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {roiSizePreset === "custom"
                  ? "Clique e arraste para desenhar"
                  : "Clique para posicionar o ROI"}
              </p>
            </div>
          </>
        )}

        <Separator />

        {/* Polygon/ROI Actions */}
        <div>
          <p className="text-sm font-medium mb-2">
            {annotationType === "roi" ? "Acoes ROI" : "Acoes do Poligono"}
          </p>
          <div className="flex flex-col gap-2">
            {annotationType !== "roi" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={finalizePolygon}
                  disabled={currentPolygon.length < 3}
                  className="justify-start"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Finalizar Poligono
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCurrentPolygon}
                  disabled={currentPolygon.length === 0}
                  className="justify-start"
                >
                  <Eraser className="mr-2 h-4 w-4" />
                  Limpar Poligono
                </Button>
              </>
            )}
            {annotationType === "roi" && isDrawingROI && (
              <Button
                variant="outline"
                size="sm"
                onClick={cancelROI}
                className="justify-start"
              >
                <Eraser className="mr-2 h-4 w-4" />
                Cancelar ROI
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={resetAnnotations}
              disabled={!hasImages}
              className="justify-start"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Resetar Anotacoes
            </Button>
          </div>
        </div>

        {/* Annotation Stats */}
        {currentAnnotation && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Estatisticas</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Poligonos (Gordura):</span>
                  <span>{currentAnnotation.polygons.filter(p => p.type === "fat").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Poligonos (Musculo):</span>
                  <span>{currentAnnotation.polygons.filter(p => p.type === "muscle").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>ROIs:</span>
                  <span>{currentAnnotation.rois?.length || 0}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Navigation */}
        <div>
          <p className="text-sm font-medium mb-2">Navegação</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousImage}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextImage}
              disabled={!canGoNext}
            >
              Próxima
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Keyboard Shortcuts */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Atalhos de Teclado:</p>
          <div className="space-y-0.5">
            <div className="flex justify-between">
              <span>Modo Gordura:</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">F</kbd>
            </div>
            <div className="flex justify-between">
              <span>Modo Musculo:</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">M</kbd>
            </div>
            <div className="flex justify-between">
              <span>Modo ROI:</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">R</kbd>
            </div>
            <div className="flex justify-between">
              <span>Finalizar:</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span>Limpar:</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Esc</kbd>
            </div>
            <div className="flex justify-between">
              <span>Navegar:</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">setas</kbd>
            </div>
            <div className="flex justify-between">
              <span>Salvar:</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Cmd+S</kbd>
            </div>
            <div className="flex justify-between">
              <span>Zoom:</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Scroll</kbd>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
