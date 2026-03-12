"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewProps {
  url: string;
}

export function PdfPreview({ url }: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {loading && !error && (
        <div className="flex h-48 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40" />
            <span className="text-[11px] text-muted-foreground">
              Génération de l&apos;aperçu…
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex h-48 items-center justify-center">
          <span className="text-[11px] text-destructive">
            Impossible de charger l&apos;aperçu.
          </span>
        </div>
      )}

      <Document
        file={url}
        loading={null}
        error={null}
        onLoadSuccess={() => {
          setLoading(false);
          setError(false);
        }}
        onLoadError={() => {
          setLoading(false);
          setError(true);
        }}
      >
        <Page
          pageNumber={1}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={null}
          onRenderSuccess={() => setLoading(false)}
        />
      </Document>
    </div>
  );
}
