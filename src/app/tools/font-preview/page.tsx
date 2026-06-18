"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// --- Types ---
type ProductType = "tumbler" | "dogtag" | "knife" | "rectangle";
type TextColor = "white" | "black" | "darkgray" | "steel" | "gold";

interface FontOption {
  name: string;
  family: string;
  category: string;
  googleName?: string; // for Google Fonts URL
}

interface Position {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// --- Constants ---
const PRESET_FONTS: FontOption[] = [
  { name: "Great Vibes", family: "'Great Vibes', cursive", category: "Script", googleName: "Great+Vibes" },
  { name: "Playfair Display", family: "'Playfair Display', serif", category: "Serif", googleName: "Playfair+Display" },
  { name: "Cinzel", family: "'Cinzel', serif", category: "Classic", googleName: "Cinzel" },
  { name: "Oswald", family: "'Oswald', sans-serif", category: "Bold", googleName: "Oswald" },
  { name: "Share Tech Mono", family: "'Share Tech Mono', monospace", category: "Industrial", googleName: "Share+Tech+Mono" },
  { name: "Caveat", family: "'Caveat', cursive", category: "Handwritten", googleName: "Caveat" },
  { name: "Satisfy", family: "'Satisfy', cursive", category: "Handwritten", googleName: "Satisfy" },
  { name: "Rye", family: "'Rye', serif", category: "Western", googleName: "Rye" },
];

const TEXT_COLORS: { label: string; value: TextColor; hex: string }[] = [
  { label: "White", value: "white", hex: "#ffffff" },
  { label: "Black", value: "black", hex: "#000000" },
  { label: "Dark Gray", value: "darkgray", hex: "#4a4a4a" },
  { label: "Steel", value: "steel", hex: "#8A9A9A" },
  { label: "Gold", value: "gold", hex: "#d4af37" },
];

const PRODUCTS: { label: string; value: ProductType; icon: string }[] = [
  { label: "Tumbler", value: "tumbler", icon: "\u{1F964}" },
  { label: "Dog Tag", value: "dogtag", icon: "\u{1F3F7}️" },
  { label: "Knife", value: "knife", icon: "\u{1F52A}" },
  { label: "Rectangle", value: "rectangle", icon: "▬" },
];

// --- Product SVG Components ---
function TumblerSVG() {
  return (
    <svg viewBox="0 0 200 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="tumblerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="30%" stopColor="#3d3d3d" />
          <stop offset="70%" stopColor="#3d3d3d" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
      </defs>
      <path
        d="M 50 30 Q 50 20 60 20 L 140 20 Q 150 20 150 30 L 155 370 Q 155 385 145 385 L 55 385 Q 45 385 45 370 Z"
        fill="url(#tumblerGrad)"
        stroke="#555"
        strokeWidth="1.5"
      />
      <ellipse cx="100" cy="22" rx="45" ry="8" fill="#444" stroke="#555" strokeWidth="1" />
    </svg>
  );
}

function DogTagSVG() {
  return (
    <svg viewBox="0 0 200 320" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a8a8a8" />
          <stop offset="25%" stopColor="#d4d4d4" />
          <stop offset="50%" stopColor="#b8b8b8" />
          <stop offset="75%" stopColor="#d4d4d4" />
          <stop offset="100%" stopColor="#a8a8a8" />
        </linearGradient>
      </defs>
      <rect x="35" y="40" width="130" height="240" rx="20" ry="20" fill="url(#metalGrad)" stroke="#888" strokeWidth="2" />
      <circle cx="100" cy="55" r="8" fill="none" stroke="#777" strokeWidth="2" />
      <rect x="40" y="45" width="120" height="230" rx="18" ry="18" fill="none" stroke="#999" strokeWidth="0.5" strokeDasharray="2,2" />
    </svg>
  );
}

function KnifeSVG() {
  return (
    <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="40%" stopColor="#6a6a6a" />
          <stop offset="60%" stopColor="#5a5a5a" />
          <stop offset="100%" stopColor="#3a3a3a" />
        </linearGradient>
        <linearGradient id="handleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a3728" />
          <stop offset="50%" stopColor="#5c4033" />
          <stop offset="100%" stopColor="#3d2b1f" />
        </linearGradient>
      </defs>
      {/* Blade */}
      <path
        d="M 30 80 L 250 60 L 270 55 Q 280 54 280 60 L 280 80 L 270 95 L 30 100 Z"
        fill="url(#bladeGrad)"
        stroke="#555"
        strokeWidth="1"
      />
      {/* Handle */}
      <path
        d="M 270 55 L 380 52 Q 390 52 390 60 L 390 90 Q 390 98 380 98 L 270 95 Z"
        fill="url(#handleGrad)"
        stroke="#333"
        strokeWidth="1.5"
      />
      {/* Bolster */}
      <rect x="265" y="52" width="12" height="48" rx="2" fill="#777" stroke="#555" strokeWidth="1" />
    </svg>
  );
}

function RectangleSVG() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="rectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#333" />
          <stop offset="50%" stopColor="#444" />
          <stop offset="100%" stopColor="#333" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="260" height="160" rx="8" ry="8" fill="url(#rectGrad)" stroke="#555" strokeWidth="2" />
      <rect x="30" y="30" width="240" height="140" rx="4" ry="4" fill="none" stroke="#555" strokeWidth="0.5" strokeDasharray="4,2" />
    </svg>
  );
}

// --- Crop Component ---
function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel
}: {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
  const [dragMode, setDragMode] = useState<"move" | "resize" | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; crop: CropArea } | null>(null);

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      const touch = e.touches[0] || (e as TouchEvent).changedTouches[0];
      return { clientX: touch.clientX, clientY: touch.clientY };
    }
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
  };

  const handleMoveStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const { clientX, clientY } = getPointerPos(e);
    setDragMode("move");
    setDragStart({ x: clientX, y: clientY, crop: { ...cropArea } });
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { clientX, clientY } = getPointerPos(e);
    setDragMode("resize");
    setDragStart({ x: clientX, y: clientY, crop: { ...cropArea } });
  };

  useEffect(() => {
    if (!dragMode || !dragStart) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;
      const { clientX, clientY } = getPointerPos(e);
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((clientY - dragStart.y) / rect.height) * 100;

      if (dragMode === "move") {
        const newX = Math.max(0, Math.min(100 - dragStart.crop.width, dragStart.crop.x + deltaX));
        const newY = Math.max(0, Math.min(100 - dragStart.crop.height, dragStart.crop.y + deltaY));
        setCropArea({ ...dragStart.crop, x: newX, y: newY });
      } else if (dragMode === "resize") {
        const newW = Math.max(20, Math.min(100 - dragStart.crop.x, dragStart.crop.width + deltaX));
        const newH = Math.max(20, Math.min(100 - dragStart.crop.y, dragStart.crop.height + deltaY));
        setCropArea({ ...dragStart.crop, width: newW, height: newH });
      }
    };

    const handleEnd = () => {
      setDragMode(null);
      setDragStart(null);
    };

    window.addEventListener("mousemove", handleMove, { passive: false });
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [dragMode, dragStart]);

  const applyCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sx = (cropArea.x / 100) * img.naturalWidth;
    const sy = (cropArea.y / 100) * img.naturalHeight;
    const sw = (cropArea.width / 100) * img.naturalWidth;
    const sh = (cropArea.height / 100) * img.naturalHeight;

    canvas.width = sw;
    canvas.height = sh;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    onCropComplete(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl p-4 max-w-lg w-full max-h-[90vh] overflow-auto">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Crop Image</h3>
        <div ref={containerRef} className="relative w-full aspect-square bg-zinc-950 rounded-lg overflow-hidden">
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop preview"
            className="w-full h-full object-contain pointer-events-none"
            crossOrigin="anonymous"
          />
          {/* Darkened overlay outside crop */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="absolute bg-transparent"
              style={{
                left: `${cropArea.x}%`,
                top: `${cropArea.y}%`,
                width: `${cropArea.width}%`,
                height: `${cropArea.height}%`,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
              }}
            />
          </div>
          {/* Crop rectangle */}
          <div
            className="absolute border-2 border-emerald-500 cursor-move"
            style={{
              left: `${cropArea.x}%`,
              top: `${cropArea.y}%`,
              width: `${cropArea.width}%`,
              height: `${cropArea.height}%`,
            }}
            onMouseDown={handleMoveStart}
            onTouchStart={handleMoveStart}
          >
            {/* Resize handle (bottom-right) */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 cursor-se-resize"
              style={{ transform: "translate(50%, 50%)" }}
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
            />
            {/* Corner indicators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applyCrop}
            className="flex-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function FontPreviewPage() {
  // State
  const [text, setText] = useState("Your Text Here");
  const [selectedFont, setSelectedFont] = useState<FontOption>(PRESET_FONTS[0]);
  const [customFonts, setCustomFonts] = useState<FontOption[]>([]);
  const [fontSize, setFontSize] = useState(32);
  const [lineSpacing, setLineSpacing] = useState(1.2);
  const [textColor, setTextColor] = useState<TextColor>("white");
  const [product, setProduct] = useState<ProductType>("tumbler");
  const [curvedText, setCurvedText] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Crop state
  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);

  // Logo state
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<Position>({ x: 50, y: 75 });
  const [logoSize, setLogoSize] = useState(80); // px
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  // New state for drag-to-position and rotation
  const [customPosition, setCustomPosition] = useState<Position>({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0); // degrees
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const logoDragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);

  // Load Google Fonts
  useEffect(() => {
    const fontFamilies = PRESET_FONTS.map((f) => f.googleName).join("&family=");
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    link.onload = () => setFontsLoaded(true);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // --- Drag Logic ---
  const getPointerPosition = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
    if ("touches" in e) {
      const touch = e.touches[0] || (e as TouchEvent).changedTouches[0];
      return { clientX: touch.clientX, clientY: touch.clientY };
    }
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { clientX, clientY } = getPointerPosition(e);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      posX: customPosition.x,
      posY: customPosition.y,
    };
    setIsDragging(true);
  }, [customPosition, getPointerPosition]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !dragStartRef.current || !previewRef.current) return;
    e.preventDefault();

    const { clientX, clientY } = getPointerPosition(e);
    const rect = previewRef.current.getBoundingClientRect();

    const deltaXPercent = ((clientX - dragStartRef.current.startX) / rect.width) * 100;
    const deltaYPercent = ((clientY - dragStartRef.current.startY) / rect.height) * 100;

    const newX = Math.max(5, Math.min(95, dragStartRef.current.posX + deltaXPercent));
    const newY = Math.max(5, Math.min(95, dragStartRef.current.posY + deltaYPercent));

    setCustomPosition({ x: newX, y: newY });
  }, [isDragging, getPointerPosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Logo drag handlers
  const handleLogoDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { clientX, clientY } = getPointerPosition(e);
    logoDragStartRef.current = {
      startX: clientX,
      startY: clientY,
      posX: logoPosition.x,
      posY: logoPosition.y,
    };
    setIsDraggingLogo(true);
  }, [logoPosition, getPointerPosition]);

  const handleLogoDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingLogo || !logoDragStartRef.current || !previewRef.current) return;
    e.preventDefault();

    const { clientX, clientY } = getPointerPosition(e);
    const rect = previewRef.current.getBoundingClientRect();

    const deltaXPercent = ((clientX - logoDragStartRef.current.startX) / rect.width) * 100;
    const deltaYPercent = ((clientY - logoDragStartRef.current.startY) / rect.height) * 100;

    const newX = Math.max(5, Math.min(95, logoDragStartRef.current.posX + deltaXPercent));
    const newY = Math.max(5, Math.min(95, logoDragStartRef.current.posY + deltaYPercent));

    setLogoPosition({ x: newX, y: newY });
  }, [isDraggingLogo, getPointerPosition]);

  const handleLogoDragEnd = useCallback(() => {
    setIsDraggingLogo(false);
    logoDragStartRef.current = null;
  }, []);

  // Attach global mouse/touch move and up listeners when dragging text
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove, { passive: false });
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Attach global mouse/touch move and up listeners when dragging logo
  useEffect(() => {
    if (isDraggingLogo) {
      window.addEventListener("mousemove", handleLogoDragMove, { passive: false });
      window.addEventListener("mouseup", handleLogoDragEnd);
      window.addEventListener("touchmove", handleLogoDragMove, { passive: false });
      window.addEventListener("touchend", handleLogoDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleLogoDragMove);
        window.removeEventListener("mouseup", handleLogoDragEnd);
        window.removeEventListener("touchmove", handleLogoDragMove);
        window.removeEventListener("touchend", handleLogoDragEnd);
      };
    }
  }, [isDraggingLogo, handleLogoDragMove, handleLogoDragEnd]);

  // Handle custom font upload
  const handleFontUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fontData = event.target?.result as ArrayBuffer;
      const fontName = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, "");
      const fontFamily = `custom-${fontName}-${Date.now()}`;

      try {
        const fontFace = new FontFace(fontFamily, fontData);
        await fontFace.load();
        document.fonts.add(fontFace);

        const newFont: FontOption = {
          name: fontName,
          family: `'${fontFamily}'`,
          category: "Custom",
        };

        setCustomFonts((prev) => [...prev, newFont]);
        setSelectedFont(newFont);
      } catch (err) {
        alert("Failed to load font file. Please ensure it is a valid .ttf, .otf, or .woff file.");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset the input
    e.target.value = "";
  }, []);

  // Handle custom image upload - now opens crop UI
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingCropImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  // Handle crop complete
  const handleCropComplete = useCallback((croppedImage: string) => {
    setCustomImage(croppedImage);
    setPendingCropImage(null);
  }, []);

  // Handle crop cancel (use uncropped image)
  const handleCropCancel = useCallback(() => {
    if (pendingCropImage) {
      setCustomImage(pendingCropImage);
    }
    setPendingCropImage(null);
  }, [pendingCropImage]);

  // Handle logo upload
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  // Download preview as PNG
  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      const width = 800;
      const height = product === "knife" ? 400 : product === "tumbler" ? 900 : 600;
      canvas.width = width;
      canvas.height = height;

      // Draw background
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, width, height);

      // Draw product shape or custom image
      if (customImage) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            // Draw image to fit canvas while maintaining aspect ratio
            const imgAspect = img.width / img.height;
            const canvasAspect = width / height;
            let drawW = width;
            let drawH = height;
            let drawX = 0;
            let drawY = 0;
            if (imgAspect > canvasAspect) {
              drawH = width / imgAspect;
              drawY = (height - drawH) / 2;
            } else {
              drawW = height * imgAspect;
              drawX = (width - drawW) / 2;
            }
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = customImage;
        });
      } else {
        drawProductShape(ctx, product, width, height);
      }

      // Draw text with custom position and rotation
      const colorHex = TEXT_COLORS.find((c) => c.value === textColor)?.hex || "#ffffff";
      ctx.fillStyle = colorHex;
      ctx.font = `${fontSize * 2}px ${selectedFont.family.replace(/'/g, "")}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Use custom position (percentage to pixels)
      const textX = (customPosition.x / 100) * width;
      const textY = (customPosition.y / 100) * height;

      if (curvedText && product === "tumbler") {
        drawCurvedText(ctx, text, textX, textY, width * 0.35, fontSize * 2);
      } else {
        // Apply rotation
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate((rotation * Math.PI) / 180);

        // Handle multi-line with custom line spacing
        const lines = text.split("\n");
        const lineHeight = fontSize * 2 * lineSpacing;
        const startY = -((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, i) => {
          ctx.fillText(line, 0, startY + i * lineHeight);
        });
        ctx.restore();
      }

      // Draw logo if present
      if (logoImage) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const logoW = logoSize * 2;
            const logoH = (img.height / img.width) * logoW;
            const logoX = (logoPosition.x / 100) * width - logoW / 2;
            const logoY = (logoPosition.y / 100) * height - logoH / 2;
            ctx.drawImage(img, logoX, logoY, logoW, logoH);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = logoImage;
        });
      }

      // Trigger download
      const link = document.createElement("a");
      link.download = `font-preview-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [text, selectedFont, fontSize, lineSpacing, textColor, product, customPosition, rotation, curvedText, customImage, logoImage, logoPosition, logoSize]);

  // Draw product shape on canvas
  function drawProductShape(ctx: CanvasRenderingContext2D, prod: ProductType, w: number, h: number) {
    ctx.save();
    switch (prod) {
      case "tumbler": {
        const grad = ctx.createLinearGradient(w * 0.25, 0, w * 0.75, 0);
        grad.addColorStop(0, "#2a2a2a");
        grad.addColorStop(0.3, "#3d3d3d");
        grad.addColorStop(0.7, "#3d3d3d");
        grad.addColorStop(1, "#2a2a2a");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(w * 0.3, h * 0.05);
        ctx.lineTo(w * 0.7, h * 0.05);
        ctx.lineTo(w * 0.72, h * 0.95);
        ctx.lineTo(w * 0.28, h * 0.95);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
      case "dogtag": {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#a8a8a8");
        grad.addColorStop(0.5, "#d4d4d4");
        grad.addColorStop(1, "#a8a8a8");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(w * 0.2, h * 0.1, w * 0.6, h * 0.8, 30);
        ctx.fill();
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
      case "knife": {
        const grad = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.7);
        grad.addColorStop(0, "#5a5a5a");
        grad.addColorStop(0.5, "#7a7a7a");
        grad.addColorStop(1, "#4a4a4a");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(w * 0.05, h * 0.5);
        ctx.lineTo(w * 0.65, h * 0.35);
        ctx.lineTo(w * 0.7, h * 0.33);
        ctx.lineTo(w * 0.7, h * 0.5);
        ctx.lineTo(w * 0.65, h * 0.6);
        ctx.lineTo(w * 0.05, h * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Handle
        const hGrad = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.65);
        hGrad.addColorStop(0, "#4a3728");
        hGrad.addColorStop(0.5, "#5c4033");
        hGrad.addColorStop(1, "#3d2b1f");
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.moveTo(w * 0.68, h * 0.33);
        ctx.lineTo(w * 0.93, h * 0.32);
        ctx.quadraticCurveTo(w * 0.96, h * 0.32, w * 0.96, h * 0.37);
        ctx.lineTo(w * 0.96, h * 0.58);
        ctx.quadraticCurveTo(w * 0.96, h * 0.63, w * 0.93, h * 0.63);
        ctx.lineTo(w * 0.68, h * 0.6);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "rectangle": {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#333");
        grad.addColorStop(0.5, "#444");
        grad.addColorStop(1, "#333");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8, 12);
        ctx.fill();
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }

  // Draw curved text on canvas
  function drawCurvedText(
    ctx: CanvasRenderingContext2D,
    txt: string,
    x: number,
    y: number,
    radius: number,
    fSize: number
  ) {
    ctx.save();
    ctx.font = `${fSize}px ${selectedFont.family.replace(/'/g, "")}`;
    ctx.fillStyle = ctx.fillStyle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const totalAngle = (txt.length * fSize * 0.6) / radius;
    const startAngle = -Math.PI / 2 - totalAngle / 2;

    for (let i = 0; i < txt.length; i++) {
      const charAngle = startAngle + (i * totalAngle) / txt.length + totalAngle / txt.length / 2;
      const charX = x + Math.cos(charAngle) * radius;
      const charY = y + Math.sin(charAngle) * radius;

      ctx.save();
      ctx.translate(charX, charY);
      ctx.rotate(charAngle + Math.PI / 2);
      ctx.fillText(txt[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  // Get text position style - now uses custom position
  const getTextPositionStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: `${customPosition.x}%`,
      top: `${customPosition.y}%`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      width: "80%",
      textAlign: "center",
      fontFamily: selectedFont.family.replace(/'/g, ""),
      fontSize: `${fontSize}px`,
      color: TEXT_COLORS.find((c) => c.value === textColor)?.hex || "#fff",
      lineHeight: `${lineSpacing}`,
      wordBreak: "break-word",
      pointerEvents: "auto",
      cursor: isDragging ? "grabbing" : "grab",
      userSelect: "none",
      WebkitUserSelect: "none",
      touchAction: "none",
    };

    return base;
  };

  // Curved text CSS (simple approximation for preview)
  const getCurvedTextStyle = (): React.CSSProperties => {
    if (!curvedText || product !== "tumbler") return {};
    return {
      background: "transparent",
    };
  };

  const allFonts = [...PRESET_FONTS, ...customFonts];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Crop Modal */}
      {pendingCropImage && (
        <ImageCropper
          imageSrc={pendingCropImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Font Preview Tool</h1>
            <p className="text-xs text-zinc-500">Preview your custom engraving text on products</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {downloading ? "Saving..." : "Download PNG"}
          </button>
        </div>
      </header>

      {/* Main Content - Mobile-first: preview on top */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls (appears second on mobile via order) */}
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            {/* Text Input */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Your Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type what you want engraved..."
                rows={3}
                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500 resize-none text-sm"
              />
              <p className="mt-1 text-xs text-zinc-500">Use Enter for multiple lines</p>
            </section>

            {/* Font Selection */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Font
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {allFonts.map((font) => (
                  <button
                    key={font.family}
                    onClick={() => setSelectedFont(font)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedFont.family === font.family
                        ? "border-emerald-600 bg-emerald-900/20"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <span
                      className="block text-lg truncate"
                      style={{ fontFamily: font.family.replace(/'/g, "") }}
                    >
                      {fontsLoaded || font.category === "Custom" ? text.slice(0, 20) || "Preview" : "Loading..."}
                    </span>
                    <span className="text-xs text-zinc-400 mt-1 block">
                      {font.name} &middot; {font.category}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Font Upload */}
              <div className="mt-3 pt-3 border-t border-zinc-700">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 rounded-lg border border-dashed border-zinc-600 hover:border-emerald-600 bg-zinc-800/50 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  + Upload Custom Font (.ttf, .otf, .woff)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFontUpload}
                  className="hidden"
                />
              </div>
            </section>

            {/* Product Selection */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Product Shape
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setProduct(p.value)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      product === p.value
                        ? "border-emerald-600 bg-emerald-900/20"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-2xl block">{p.icon}</span>
                    <span className="text-xs text-zinc-400 mt-1 block">{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom Image Upload */}
              <div className="mt-3 pt-3 border-t border-zinc-700">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full p-2 rounded-lg border border-dashed border-zinc-600 hover:border-emerald-600 bg-zinc-800/50 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  {customImage ? "Change Background Image" : "Upload Product Photo"}
                </button>
                {customImage && (
                  <button
                    onClick={() => setCustomImage(null)}
                    className="w-full mt-1 p-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Remove custom image
                  </button>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </section>

            {/* Settings */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Engraving Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setTextColor(c.value)}
                      className={`flex-1 min-w-[60px] p-2 rounded-lg border text-xs font-medium transition-colors ${
                        textColor === c.value
                          ? "border-emerald-600 bg-emerald-900/20"
                          : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      <span
                        className="block w-4 h-4 rounded-full mx-auto mb-1 border border-zinc-600"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Spacing Control (replaces quick position buttons) */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Line Spacing: {lineSpacing.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="3.0"
                  step="0.1"
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-zinc-500">Tight</span>
                  <span className="text-xs text-zinc-500">Wide</span>
                </div>
              </div>

              {/* Rotation Control */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Rotation: {rotation}
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-zinc-500">-180</span>
                  <button
                    onClick={() => setRotation(0)}
                    className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors px-2 py-0.5 rounded border border-zinc-700 hover:border-emerald-600"
                  >
                    Reset to 0
                  </button>
                  <span className="text-xs text-zinc-500">+180</span>
                </div>
              </div>

              {product === "tumbler" && (
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">
                    Curved Text
                  </label>
                  <button
                    onClick={() => setCurvedText(!curvedText)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      curvedText ? "bg-emerald-600" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        curvedText ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              )}
              {curvedText && product === "tumbler" && rotation !== 0 && (
                <p className="text-xs text-amber-400">
                  Note: Rotation is applied after curve. For best results use one or the other.
                </p>
              )}
            </section>

            {/* Logo Upload Section */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Logo
              </label>
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full p-3 rounded-lg border border-dashed border-zinc-600 hover:border-emerald-600 bg-zinc-800/50 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                {logoImage ? "Change Logo" : "+ Upload Logo (.png, .svg)"}
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {logoImage && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Logo Size: {logoSize}px
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                  <button
                    onClick={() => setLogoImage(null)}
                    className="w-full p-2 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Remove Logo
                  </button>
                  <p className="text-xs text-zinc-500">Drag the logo on the preview to reposition</p>
                </>
              )}
            </section>
          </div>

          {/* Right Panel - Preview (appears first on mobile via order) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="sticky top-20">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-zinc-400">Live Preview</h2>
                  <span className="text-xs text-zinc-600">
                    {selectedFont.name} &middot; {fontSize}px &middot; {rotation !== 0 ? `${rotation} deg` : "no rotation"}
                  </span>
                </div>

                {/* Preview Area */}
                <div
                  ref={previewRef}
                  className="relative bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center select-none"
                  style={{
                    minHeight: product === "knife" ? "300px" : "500px",
                    aspectRatio: product === "knife" ? "2.5/1" : product === "tumbler" ? "1/2" : "3/4",
                    maxHeight: "600px",
                    touchAction: "none",
                  }}
                >
                  {/* Product Shape or Custom Image */}
                  {customImage ? (
                    <img
                      src={customImage}
                      alt="Custom product"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                      {product === "tumbler" && <TumblerSVG />}
                      {product === "dogtag" && <DogTagSVG />}
                      {product === "knife" && <KnifeSVG />}
                      {product === "rectangle" && <RectangleSVG />}
                    </div>
                  )}

                  {/* Draggable Text Overlay */}
                  <div
                    ref={textOverlayRef}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onMouseEnter={() => setIsHoveringText(true)}
                    onMouseLeave={() => { if (!isDragging) setIsHoveringText(false); }}
                    style={{
                      ...getTextPositionStyle(),
                      ...getCurvedTextStyle(),
                      outline: isDragging ? "2px dashed rgba(16, 185, 129, 0.6)" : isHoveringText ? "1px dashed rgba(16, 185, 129, 0.3)" : "none",
                      outlineOffset: "4px",
                      borderRadius: "4px",
                      transition: isDragging ? "none" : "outline 0.2s ease",
                    }}
                  >
                    {curvedText && product === "tumbler" ? (
                      <svg
                        viewBox="0 0 300 150"
                        className="w-full"
                        style={{ maxWidth: "80%", pointerEvents: "none" }}
                      >
                        <defs>
                          <path
                            id="curvedPath"
                            d="M 30,120 Q 150,40 270,120"
                            fill="none"
                          />
                        </defs>
                        <text
                          fill={TEXT_COLORS.find((c) => c.value === textColor)?.hex || "#fff"}
                          fontSize={fontSize * 0.8}
                          fontFamily={selectedFont.family.replace(/'/g, "")}
                          textAnchor="middle"
                        >
                          <textPath href="#curvedPath" startOffset="50%">
                            {text}
                          </textPath>
                        </text>
                      </svg>
                    ) : (
                      <span style={{ whiteSpace: "pre-wrap", pointerEvents: "none" }}>{text}</span>
                    )}
                  </div>

                  {/* Draggable Logo Overlay */}
                  {logoImage && (
                    <div
                      onMouseDown={handleLogoDragStart}
                      onTouchStart={handleLogoDragStart}
                      onMouseEnter={() => setIsHoveringLogo(true)}
                      onMouseLeave={() => { if (!isDraggingLogo) setIsHoveringLogo(false); }}
                      style={{
                        position: "absolute",
                        left: `${logoPosition.x}%`,
                        top: `${logoPosition.y}%`,
                        transform: "translate(-50%, -50%)",
                        width: `${logoSize}px`,
                        height: "auto",
                        cursor: isDraggingLogo ? "grabbing" : "grab",
                        userSelect: "none",
                        WebkitUserSelect: "none" as React.CSSProperties["WebkitUserSelect"],
                        touchAction: "none",
                        outline: isDraggingLogo ? "2px dashed rgba(16, 185, 129, 0.6)" : isHoveringLogo ? "1px dashed rgba(16, 185, 129, 0.3)" : "none",
                        outlineOffset: "4px",
                        borderRadius: "4px",
                        transition: isDraggingLogo ? "none" : "outline 0.2s ease",
                        pointerEvents: "auto",
                      }}
                    >
                      <img
                        src={logoImage}
                        alt="Logo"
                        style={{ width: "100%", height: "auto", pointerEvents: "none" }}
                        draggable={false}
                      />
                    </div>
                  )}

                  {/* Drag instruction overlay */}
                  {!isDragging && !isDraggingLogo && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
                      <span className="text-xs text-zinc-500 bg-zinc-900/80 px-2 py-1 rounded">
                        Drag text{logoImage ? " or logo" : ""} to reposition
                      </span>
                    </div>
                  )}
                </div>

                {/* Text Size Slider - directly below preview */}
                <div className="mt-4 px-1">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Text Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-zinc-500">12px</span>
                    <span className="text-xs text-zinc-500">72px</span>
                  </div>
                </div>
              </div>

              {/* Quick tips */}
              <div className="mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500">
                  <strong className="text-zinc-400">Tips:</strong> Drag the text to position it anywhere on the product. Use the rotation slider to angle your text. Upload your own font files for exact previews. Use Enter for multiple lines. Adjust line spacing for multi-line text.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 py-6 text-center">
        <a
          href="/"
          className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          Powered by CutLog
        </a>
      </footer>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
