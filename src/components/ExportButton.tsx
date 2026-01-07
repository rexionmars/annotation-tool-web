"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnotationStore } from "@/store/annotationStore";
import { exportAnnotations } from "@/lib/export";

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { images, annotations } = useAnnotationStore();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportAnnotations(images, annotations);
    } catch (error) {
      console.error("Error exporting annotations:", error);
      alert("Erro ao exportar anotações. Verifique o console.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={images.length === 0 || isExporting}
      variant="default"
      className="bg-green-600 hover:bg-green-700"
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exportando..." : "Exportar Anotações"}
    </Button>
  );
}
