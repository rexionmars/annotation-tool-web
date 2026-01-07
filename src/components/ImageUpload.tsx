"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAnnotationStore } from "@/store/annotationStore";

export function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImages } = useAnnotationStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await addImages(files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <Upload className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1">Upload de Imagens</h3>
          <p className="text-sm text-muted-foreground">
            Selecione imagens de carcaças para anotar
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button onClick={handleButtonClick} size="lg">
          <Upload className="mr-2 h-4 w-4" />
          Selecionar Imagens
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Formatos suportados: JPG, PNG, BMP, TIFF
        </p>
      </div>
    </Card>
  );
}
