"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  blobUrl: string;
}

export function PdfViewer({ blobUrl }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);

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
    <div ref={containerRef} className="w-full bg-muted/20">
      {loadError ? (
        <div className="flex h-48 items-center justify-center">
          <span className="text-sm text-destructive">
            Impossible de charger le document.
          </span>
        </div>
      ) : (
        <Document
          file={blobUrl}
          loading={
            <div className="flex h-48 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40" />
                <span className="text-xs text-muted-foreground">
                  Chargement du document…
                </span>
              </div>
            </div>
          }
          error={null}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setLoadError(false);
          }}
          onLoadError={() => setLoadError(true)}
        >
          {numPages !== null &&
            Array.from({ length: numPages }, (_, i) => (
              <div key={i} className="border-b border-border/30 last:border-0">
                <Page
                  pageNumber={i + 1}
                  width={width}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={null}
                />
              </div>
            ))}
        </Document>
      )}
    </div>
  );
}
