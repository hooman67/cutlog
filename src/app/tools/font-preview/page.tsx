"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// --- Types ---
type ProductType = "tumbler" | "dogtag" | "knife" | "rectangle";
type TextColor = "white" | "black" | "darkgray" | "steel" | "gold";

interface FontOption {
  name: string;
  family: string;
  category: string;
  googleName?: string;
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

// Layer types
interface TextLayer {
  id: string;
  type: "text";
  text: string;
  font: FontOption;
  fontSize: number;
  color: TextColor;
  position: Position;
  rotation: number;
  lineSpacing: number;
  curvedText: boolean;
}

interface ImageLayer {
  id: string;
  type: "image";
  src: string;
  position: Position;
  size: number; // width in px
  rotation: number;
}

interface AiDesignLayer {
  id: string;
  type: "ai-design";
  svg: string;
  prompt: string;
  position: Position;
  size: number;
  rotation: number;
}

type Layer = TextLayer | ImageLayer | AiDesignLayer;

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

function generateId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

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
      <path
        d="M 30 80 L 250 60 L 270 55 Q 280 54 280 60 L 280 80 L 270 95 L 30 100 Z"
        fill="url(#bladeGrad)"
        stroke="#555"
        strokeWidth="1"
      />
      <path
        d="M 270 55 L 380 52 Q 390 52 390 60 L 390 90 Q 390 98 380 98 L 270 95 Z"
        fill="url(#handleGrad)"
        stroke="#333"
        strokeWidth="1.5"
      />
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
  onCancel,
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
            <div
              className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 cursor-se-resize"
              style={{ transform: "translate(50%, 50%)" }}
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
            />
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
  // Layer state
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: generateId(),
      type: "text",
      text: "Your Text Here",
      font: PRESET_FONTS[0],
      fontSize: 32,
      color: "white",
      position: { x: 50, y: 50 },
      rotation: 0,
      lineSpacing: 1.2,
      curvedText: false,
    },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>(layers[0].id);

  // Product/background state
  const [product, setProduct] = useState<ProductType>("tumbler");
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customFonts, setCustomFonts] = useState<FontOption[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Crop state
  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);

  // AI generation state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Drag state
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const layerImageInputRef = useRef<HTMLInputElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);

  // Derived state
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

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

  // --- Layer Management ---
  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } as Layer : l))
    );
  }, []);

  const deleteLayer = useCallback((id: string) => {
    setLayers((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (next.length === 0) return prev; // don't allow empty
      return next;
    });
    setSelectedLayerId((prevSel) => {
      if (prevSel === id) {
        const remaining = layers.filter((l) => l.id !== id);
        return remaining.length > 0 ? remaining[0].id : prevSel;
      }
      return prevSel;
    });
  }, [layers]);

  const addTextLayer = useCallback(() => {
    const newLayer: TextLayer = {
      id: generateId(),
      type: "text",
      text: "New Text",
      font: PRESET_FONTS[0],
      fontSize: 28,
      color: "white",
      position: { x: 50, y: 40 + Math.random() * 20 },
      rotation: 0,
      lineSpacing: 1.2,
      curvedText: false,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  }, []);

  const addImageLayer = useCallback((src: string) => {
    const newLayer: ImageLayer = {
      id: generateId(),
      type: "image",
      src,
      position: { x: 50, y: 50 },
      size: 100,
      rotation: 0,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  }, []);

  const addAiDesignLayer = useCallback((svg: string, prompt: string) => {
    const newLayer: AiDesignLayer = {
      id: generateId(),
      type: "ai-design",
      svg,
      prompt,
      position: { x: 50, y: 50 },
      size: 150,
      rotation: 0,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  }, []);

  // --- Drag Logic ---
  const getPointerPosition = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
      if ("touches" in e) {
        const touch = e.touches[0] || (e as TouchEvent).changedTouches[0];
        return { clientX: touch.clientX, clientY: touch.clientY };
      }
      return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
    },
    []
  );

  const handleLayerDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, layerId: string) => {
      e.preventDefault();
      e.stopPropagation();
      const layer = layers.find((l) => l.id === layerId);
      if (!layer) return;
      const { clientX, clientY } = getPointerPosition(e);
      dragStartRef.current = {
        startX: clientX,
        startY: clientY,
        posX: layer.position.x,
        posY: layer.position.y,
      };
      setDraggingLayerId(layerId);
      setSelectedLayerId(layerId);
    },
    [layers, getPointerPosition]
  );

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggingLayerId || !dragStartRef.current || !previewRef.current) return;
      e.preventDefault();

      const { clientX, clientY } = getPointerPosition(e);
      const rect = previewRef.current.getBoundingClientRect();

      const deltaXPercent = ((clientX - dragStartRef.current.startX) / rect.width) * 100;
      const deltaYPercent = ((clientY - dragStartRef.current.startY) / rect.height) * 100;

      const newX = Math.max(2, Math.min(98, dragStartRef.current.posX + deltaXPercent));
      const newY = Math.max(2, Math.min(98, dragStartRef.current.posY + deltaYPercent));

      updateLayer(draggingLayerId, { position: { x: newX, y: newY } });
    },
    [draggingLayerId, getPointerPosition, updateLayer]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingLayerId(null);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    if (draggingLayerId) {
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
  }, [draggingLayerId, handleDragMove, handleDragEnd]);

  // --- File Handlers ---
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
        // If a text layer is selected, update its font
        if (selectedLayer && selectedLayer.type === "text") {
          updateLayer(selectedLayer.id, { font: newFont });
        }
      } catch (err) {
        alert("Failed to load font file. Please ensure it is a valid .ttf, .otf, or .woff file.");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }, [selectedLayer, updateLayer]);

  const handleBackgroundImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingCropImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleCropComplete = useCallback((croppedImage: string) => {
    setCustomImage(croppedImage);
    setPendingCropImage(null);
  }, []);

  const handleCropCancel = useCallback(() => {
    if (pendingCropImage) {
      setCustomImage(pendingCropImage);
    }
    setPendingCropImage(null);
  }, [pendingCropImage]);

  const handleLayerImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      addImageLayer(src);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [addImageLayer]);

  // --- AI Design Generation ---
  const handleGenerateDesign = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setAiError(null);

    try {
      const res = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || "Failed to generate design");
        return;
      }

      addAiDesignLayer(data.svg, aiPrompt.trim());
      setAiPrompt("");
    } catch (err) {
      console.error(err);
      setAiError("Network error. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  }, [aiPrompt, addAiDesignLayer]);

  // --- Download ---
  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 800;
      const height = product === "knife" ? 400 : product === "tumbler" ? 900 : 600;
      canvas.width = width;
      canvas.height = height;

      // Draw background
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, width, height);

      // Draw product shape or custom background
      if (customImage) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
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

      // Draw all layers in order
      for (const layer of layers) {
        if (layer.type === "text") {
          const colorHex = TEXT_COLORS.find((c) => c.value === layer.color)?.hex || "#ffffff";
          ctx.fillStyle = colorHex;
          ctx.font = `${layer.fontSize * 2}px ${layer.font.family.replace(/'/g, "")}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textX = (layer.position.x / 100) * width;
          const textY = (layer.position.y / 100) * height;

          if (layer.curvedText && product === "tumbler") {
            drawCurvedText(ctx, layer.text, textX, textY, width * 0.35, layer.fontSize * 2, layer.font);
          } else {
            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate((layer.rotation * Math.PI) / 180);

            const lines = layer.text.split("\n");
            const lineHeight = layer.fontSize * 2 * layer.lineSpacing;
            const startY = -((lines.length - 1) * lineHeight) / 2;
            lines.forEach((line, i) => {
              ctx.fillText(line, 0, startY + i * lineHeight);
            });
            ctx.restore();
          }
        } else if (layer.type === "image") {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const imgW = layer.size * 2;
              const imgH = (img.height / img.width) * imgW;
              const imgX = (layer.position.x / 100) * width - imgW / 2;
              const imgY = (layer.position.y / 100) * height - imgH / 2;
              ctx.save();
              ctx.translate(imgX + imgW / 2, imgY + imgH / 2);
              ctx.rotate((layer.rotation * Math.PI) / 180);
              ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
              ctx.restore();
              resolve();
            };
            img.onerror = () => resolve();
            img.src = layer.src;
          });
        } else if (layer.type === "ai-design") {
          await new Promise<void>((resolve) => {
            const img = new Image();
            const svgBlob = new Blob([layer.svg], { type: "image/svg+xml" });
            const url = URL.createObjectURL(svgBlob);
            img.onload = () => {
              const imgW = layer.size * 2;
              const imgH = imgW; // SVGs are square per our prompt
              const imgX = (layer.position.x / 100) * width - imgW / 2;
              const imgY = (layer.position.y / 100) * height - imgH / 2;
              ctx.save();
              ctx.translate(imgX + imgW / 2, imgY + imgH / 2);
              ctx.rotate((layer.rotation * Math.PI) / 180);
              ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
              ctx.restore();
              URL.revokeObjectURL(url);
              resolve();
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              resolve();
            };
            img.src = url;
          });
        }
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
  }, [layers, product, customImage]);

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

  function drawCurvedText(
    ctx: CanvasRenderingContext2D,
    txt: string,
    x: number,
    y: number,
    radius: number,
    fSize: number,
    font: FontOption
  ) {
    ctx.save();
    ctx.font = `${fSize}px ${font.family.replace(/'/g, "")}`;
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

  const allFonts = [...PRESET_FONTS, ...customFonts];

  // --- Render layer on preview ---
  function renderLayerOnCanvas(layer: Layer) {
    const isSelected = layer.id === selectedLayerId;
    const isDragging = layer.id === draggingLayerId;

    const outlineStyle = isDragging
      ? "2px dashed rgba(16, 185, 129, 0.6)"
      : isSelected
      ? "1px dashed rgba(16, 185, 129, 0.4)"
      : "none";

    if (layer.type === "text") {
      const colorHex = TEXT_COLORS.find((c) => c.value === layer.color)?.hex || "#fff";
      return (
        <div
          key={layer.id}
          onMouseDown={(e) => handleLayerDragStart(e, layer.id)}
          onTouchStart={(e) => handleLayerDragStart(e, layer.id)}
          style={{
            position: "absolute",
            left: `${layer.position.x}%`,
            top: `${layer.position.y}%`,
            transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
            width: "80%",
            textAlign: "center",
            fontFamily: layer.font.family.replace(/'/g, ""),
            fontSize: `${layer.fontSize}px`,
            color: colorHex,
            lineHeight: `${layer.lineSpacing}`,
            wordBreak: "break-word",
            pointerEvents: "auto",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
            outline: outlineStyle,
            outlineOffset: "4px",
            borderRadius: "4px",
            transition: isDragging ? "none" : "outline 0.2s ease",
            zIndex: isSelected ? 10 : 1,
          }}
        >
          {layer.curvedText && product === "tumbler" ? (
            <svg
              viewBox="0 0 300 150"
              className="w-full"
              style={{ maxWidth: "80%", pointerEvents: "none" }}
            >
              <defs>
                <path id={`curvedPath-${layer.id}`} d="M 30,120 Q 150,40 270,120" fill="none" />
              </defs>
              <text
                fill={colorHex}
                fontSize={layer.fontSize * 0.8}
                fontFamily={layer.font.family.replace(/'/g, "")}
                textAnchor="middle"
              >
                <textPath href={`#curvedPath-${layer.id}`} startOffset="50%">
                  {layer.text}
                </textPath>
              </text>
            </svg>
          ) : (
            <span style={{ whiteSpace: "pre-wrap", pointerEvents: "none" }}>{layer.text}</span>
          )}
        </div>
      );
    }

    if (layer.type === "image") {
      return (
        <div
          key={layer.id}
          onMouseDown={(e) => handleLayerDragStart(e, layer.id)}
          onTouchStart={(e) => handleLayerDragStart(e, layer.id)}
          style={{
            position: "absolute",
            left: `${layer.position.x}%`,
            top: `${layer.position.y}%`,
            transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
            width: `${layer.size}px`,
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
            outline: outlineStyle,
            outlineOffset: "4px",
            borderRadius: "4px",
            transition: isDragging ? "none" : "outline 0.2s ease",
            pointerEvents: "auto",
            zIndex: isSelected ? 10 : 1,
          }}
        >
          <img
            src={layer.src}
            alt="Layer image"
            style={{ width: "100%", height: "auto", pointerEvents: "none" }}
            draggable={false}
          />
        </div>
      );
    }

    if (layer.type === "ai-design") {
      return (
        <div
          key={layer.id}
          onMouseDown={(e) => handleLayerDragStart(e, layer.id)}
          onTouchStart={(e) => handleLayerDragStart(e, layer.id)}
          style={{
            position: "absolute",
            left: `${layer.position.x}%`,
            top: `${layer.position.y}%`,
            transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
            width: `${layer.size}px`,
            height: `${layer.size}px`,
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
            outline: outlineStyle,
            outlineOffset: "4px",
            borderRadius: "4px",
            transition: isDragging ? "none" : "outline 0.2s ease",
            pointerEvents: "auto",
            zIndex: isSelected ? 10 : 1,
          }}
          dangerouslySetInnerHTML={{ __html: layer.svg }}
        />
      );
    }

    return null;
  }

  // --- Render selected layer properties panel ---
  function renderLayerProperties() {
    if (!selectedLayer) return null;

    if (selectedLayer.type === "text") {
      const tl = selectedLayer as TextLayer;
      return (
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Text</label>
            <textarea
              value={tl.text}
              onChange={(e) => updateLayer(tl.id, { text: e.target.value })}
              placeholder="Type what you want engraved..."
              rows={3}
              className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500 resize-none text-sm"
            />
            <p className="mt-1 text-xs text-zinc-500">Use Enter for multiple lines</p>
          </div>

          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Font</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {allFonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => updateLayer(tl.id, { font })}
                  className={`w-full text-left p-2 rounded-lg border transition-colors ${
                    tl.font.family === font.family
                      ? "border-emerald-600 bg-emerald-900/20"
                      : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <span
                    className="block text-base truncate"
                    style={{ fontFamily: font.family.replace(/'/g, "") }}
                  >
                    {fontsLoaded || font.category === "Custom" ? tl.text.slice(0, 20) || "Preview" : "Loading..."}
                  </span>
                  <span className="text-xs text-zinc-400 block">
                    {font.name} &middot; {font.category}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-2 rounded-lg border border-dashed border-zinc-600 hover:border-emerald-600 bg-zinc-800/50 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                + Upload Custom Font
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Size: {tl.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={tl.fontSize}
              onChange={(e) => updateLayer(tl.id, { fontSize: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Engraving Color</label>
            <div className="flex gap-2 flex-wrap">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateLayer(tl.id, { color: c.value })}
                  className={`flex-1 min-w-[50px] p-2 rounded-lg border text-xs font-medium transition-colors ${
                    tl.color === c.value
                      ? "border-emerald-600 bg-emerald-900/20"
                      : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <span
                    className="block w-3 h-3 rounded-full mx-auto mb-1 border border-zinc-600"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Line Spacing: {tl.lineSpacing.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.8"
              max="3.0"
              step="0.1"
              value={tl.lineSpacing}
              onChange={(e) => updateLayer(tl.id, { lineSpacing: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Rotation: {tl.rotation}&deg;
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={tl.rotation}
              onChange={(e) => updateLayer(tl.id, { rotation: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500">-180</span>
              <button
                onClick={() => updateLayer(tl.id, { rotation: 0 })}
                className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors px-2 py-0.5 rounded border border-zinc-700 hover:border-emerald-600"
              >
                Reset
              </button>
              <span className="text-xs text-zinc-500">+180</span>
            </div>
          </div>

          {/* Curved text (tumbler only) */}
          {product === "tumbler" && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Curved Text</label>
              <button
                onClick={() => updateLayer(tl.id, { curvedText: !tl.curvedText })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  tl.curvedText ? "bg-emerald-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    tl.curvedText ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (selectedLayer.type === "image") {
      const il = selectedLayer as ImageLayer;
      return (
        <div className="space-y-4">
          <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
            <img src={il.src} alt="Layer" className="w-12 h-12 object-contain rounded" />
            <span className="text-sm text-zinc-300">Image Layer</span>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Size: {il.size}px
            </label>
            <input
              type="range"
              min="30"
              max="300"
              value={il.size}
              onChange={(e) => updateLayer(il.id, { size: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Rotation: {il.rotation}&deg;
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={il.rotation}
              onChange={(e) => updateLayer(il.id, { rotation: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500">-180</span>
              <button
                onClick={() => updateLayer(il.id, { rotation: 0 })}
                className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors px-2 py-0.5 rounded border border-zinc-700 hover:border-emerald-600"
              >
                Reset
              </button>
              <span className="text-xs text-zinc-500">+180</span>
            </div>
          </div>
        </div>
      );
    }

    if (selectedLayer.type === "ai-design") {
      const al = selectedLayer as AiDesignLayer;
      return (
        <div className="space-y-4">
          <div className="bg-zinc-800 rounded-lg p-3">
            <span className="text-sm text-zinc-300">AI Design: &quot;{al.prompt}&quot;</span>
            <div
              className="mt-2 w-16 h-16 mx-auto"
              dangerouslySetInnerHTML={{ __html: al.svg }}
            />
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Size: {al.size}px
            </label>
            <input
              type="range"
              min="50"
              max="400"
              value={al.size}
              onChange={(e) => updateLayer(al.id, { size: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Rotation: {al.rotation}&deg;
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={al.rotation}
              onChange={(e) => updateLayer(al.id, { rotation: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500">-180</span>
              <button
                onClick={() => updateLayer(al.id, { rotation: 0 })}
                className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors px-2 py-0.5 rounded border border-zinc-700 hover:border-emerald-600"
              >
                Reset
              </button>
              <span className="text-xs text-zinc-500">+180</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            {/* Layer List */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-zinc-300">Layers</label>
                <div className="flex gap-1">
                  <button
                    onClick={addTextLayer}
                    className="px-2 py-1 text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded transition-colors"
                    title="Add text layer"
                  >
                    + Text
                  </button>
                  <button
                    onClick={() => layerImageInputRef.current?.click()}
                    className="px-2 py-1 text-xs bg-blue-800 hover:bg-blue-700 text-blue-100 rounded transition-colors"
                    title="Add image layer"
                  >
                    + Image
                  </button>
                </div>
              </div>
              <input
                ref={layerImageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLayerImageUpload}
                className="hidden"
              />
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {layers.map((layer, idx) => (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedLayerId === layer.id
                        ? "bg-emerald-900/30 border border-emerald-700"
                        : "bg-zinc-800 border border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-zinc-500 w-4 shrink-0">{idx + 1}</span>
                      {layer.type === "text" && (
                        <span className="text-sm text-zinc-300 truncate">
                          {(layer as TextLayer).text.slice(0, 20) || "Empty text"}
                        </span>
                      )}
                      {layer.type === "image" && (
                        <span className="text-sm text-zinc-300 truncate">Image</span>
                      )}
                      {layer.type === "ai-design" && (
                        <span className="text-sm text-zinc-300 truncate">
                          AI: {(layer as AiDesignLayer).prompt.slice(0, 15)}
                        </span>
                      )}
                      <span className="text-xs text-zinc-500 shrink-0">
                        ({layer.type})
                      </span>
                    </div>
                    {layers.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayer(layer.id);
                        }}
                        className="text-xs text-zinc-500 hover:text-red-400 px-1.5 py-0.5 rounded hover:bg-red-900/20 transition-colors shrink-0"
                        title="Delete layer"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Selected Layer Properties */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                {selectedLayer
                  ? `${selectedLayer.type === "text" ? "Text" : selectedLayer.type === "image" ? "Image" : "AI Design"} Properties`
                  : "Select a layer"}
              </label>
              {renderLayerProperties()}
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

              {/* Custom Background Image */}
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
                  onChange={handleBackgroundImageUpload}
                  className="hidden"
                />
              </div>
            </section>

            {/* AI Design Generator */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                AI Line Art Generator
              </label>
              <p className="text-xs text-zinc-500 mb-3">
                Generate simple line art designs for laser engraving
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !aiGenerating) handleGenerateDesign();
                  }}
                  placeholder="e.g. wolf howling at moon"
                  className="flex-1 p-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500 text-sm"
                />
                <button
                  onClick={handleGenerateDesign}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  {aiGenerating ? "..." : "Generate"}
                </button>
              </div>
              {aiError && (
                <p className="mt-2 text-xs text-red-400">{aiError}</p>
              )}
              <p className="mt-2 text-xs text-zinc-600">
                Examples: &quot;celtic knot&quot;, &quot;floral border&quot;, &quot;mountain scene&quot;, &quot;dragon&quot;
              </p>
            </section>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="sticky top-20">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-zinc-400">Live Preview</h2>
                  <span className="text-xs text-zinc-600">
                    {layers.length} layer{layers.length !== 1 ? "s" : ""}
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

                  {/* Render all layers */}
                  {layers.map((layer) => renderLayerOnCanvas(layer))}

                  {/* Drag instruction overlay */}
                  {!draggingLayerId && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
                      <span className="text-xs text-zinc-500 bg-zinc-900/80 px-2 py-1 rounded">
                        Drag elements to reposition
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick tips */}
              <div className="mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500">
                  <strong className="text-zinc-400">Tips:</strong> Add multiple text and image layers. Drag any element to reposition. Select a layer in the panel to edit its properties. Use the AI generator to create line art designs for engraving.
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

      {/* Hidden elements */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        onChange={handleFontUpload}
        className="hidden"
      />
    </div>
  );
}
