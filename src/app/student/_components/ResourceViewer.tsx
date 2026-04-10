"use client";

import { Button } from "@/components/ui/button";
import { StudentResource } from "@/hooks/student/api";
import { Download, ExternalLink } from "lucide-react";
import { memo, useState, useEffect } from "react";

interface ResourceViewerProps {
  resource: StudentResource;
  onGetDownloadUrl?: (resourceId: string) => Promise<string | null>;
}

const PDFViewer = memo(({ url }: { url: string }) => {
  if (!url) return null;
  return (
    <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
      <embed
        src={url}
        type="application/pdf"
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  );
});
PDFViewer.displayName = "PDFViewer";

const VideoViewer = memo(({ url, title }: { url: string; title: string }) => {
  if (!url) return null;
  // Infer video type from URL extension
  const getVideoType = (videoUrl: string): string => {
    if (videoUrl.includes(".mp4")) return "video/mp4";
    if (videoUrl.includes(".webm")) return "video/webm";
    if (videoUrl.includes(".ogg") || videoUrl.includes(".ogv"))
      return "video/ogg";
    if (videoUrl.includes(".mov")) return "video/quicktime";
    if (videoUrl.includes(".avi")) return "video/avi";
    if (videoUrl.includes(".mkv")) return "video/x-matroska";
    // Default to mp4 if unknown
    return "video/mp4";
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <video
        controls
        className="w-full h-auto"
        title={title}
        controlsList="nodownload"
      >
        <source src={url} type={getVideoType(url)} />
        Votre navigateur ne supporte pas la vidéo HTML5.
      </video>
    </div>
  );
});
VideoViewer.displayName = "VideoViewer";

const AudioViewer = memo(({ url, title }: { url: string; title: string }) => {
  if (!url) return null;
  // Infer audio type from URL extension
  const getAudioType = (audioUrl: string): string => {
    if (audioUrl.includes(".mp3")) return "audio/mpeg";
    if (audioUrl.includes(".wav")) return "audio/wav";
    if (audioUrl.includes(".ogg")) return "audio/ogg";
    if (audioUrl.includes(".m4a")) return "audio/mp4";
    if (audioUrl.includes(".flac")) return "audio/flac";
    // Default to mp3 if unknown
    return "audio/mpeg";
  };

  return (
    <div className="w-full bg-muted rounded-lg p-4">
      <audio
        controls
        className="w-full"
        title={title}
        controlsList="nodownload"
      >
        <source src={url} type={getAudioType(url)} />
        Votre navigateur ne supporte pas l&apos;audio HTML5.
      </audio>
    </div>
  );
});
AudioViewer.displayName = "AudioViewer";

const ImageViewer = memo(({ url, title }: { url: string; title: string }) => {
  if (!url) return null;
  return (
    <div className="w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center p-4">
      <img
        src={url}
        alt={title}
        className="max-w-full max-h-96 object-contain"
      />
    </div>
  );
});
ImageViewer.displayName = "ImageViewer";

const HTMLViewer = memo(({ url, title }: { url: string; title: string }) => {
  if (!url) return null;
  return (
    <div className="w-full h-96 bg-white rounded-lg overflow-hidden border border-border">
      <iframe
        src={url}
        title={title}
        className="w-full h-full"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
});
HTMLViewer.displayName = "HTMLViewer";

const InteractiveViewer = memo(
  ({ url, title }: { url: string; title: string }) => {
    if (!url) return null;
    return (
      <div className="w-full h-96 bg-white rounded-lg overflow-hidden border border-border">
        <iframe
          src={url}
          title={title}
          className="w-full h-full"
          allow="geolocation; microphone; camera; payment"
        />
      </div>
    );
  },
);
InteractiveViewer.displayName = "InteractiveViewer";

export const ResourceViewer = memo(function ResourceViewer({
  resource,
  onGetDownloadUrl,
}: ResourceViewerProps) {
  const { type, title, id } = resource;

  const getProxyUrl = (resourceId: string): string => {
    // Use the new secure download endpoint that handles auth server-side
    // Include token as query param since iframes/embeds won't send Authorization headers
    if (!resourceId || resourceId === "undefined") {
      console.warn("[ResourceViewer] Invalid resourceId:", resourceId);
      return "";
    }
    let url = `/api/resources/${encodeURIComponent(resourceId)}/download`;

    // Get token from localStorage at render time
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token") || localStorage.getItem("token")
        : null;

    if (token) {
      url += `?token=${encodeURIComponent(token)}`;
    }
    return url;
  };

  const handleDownload = () => {
    const url = getProxyUrl(id);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleFullscreen = () => {
    const url = getProxyUrl(id);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const renderViewer = () => {
    const proxyUrl = getProxyUrl(id);

    // Don't render if URL is invalid
    if (!proxyUrl) {
      return (
        <div className="w-full bg-muted rounded-lg p-4 text-center text-muted-foreground">
          Ressource invalide
        </div>
      );
    }

    switch (type?.toLowerCase()) {
      case "pdf":
      case "document":
        return <PDFViewer url={proxyUrl} />;
      case "video":
        return <VideoViewer url={proxyUrl} title={title} />;
      case "audio":
        return <AudioViewer url={proxyUrl} title={title} />;
      case "image":
        return <ImageViewer url={proxyUrl} title={title} />;
      case "html":
        return <HTMLViewer url={proxyUrl} title={title} />;
      case "interactive":
        return <InteractiveViewer url={proxyUrl} title={title} />;
      default:
        return (
          <div className="w-full bg-muted rounded-lg p-4 text-center text-muted-foreground">
            Type de fichier non supporté
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden">{renderViewer()}</div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!id || id === "undefined"}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFullscreen}
          disabled={!id || id === "undefined"}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir en plein écran
        </Button>
      </div>
    </div>
  );
});

ResourceViewer.displayName = "ResourceViewer";
