"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// --- Types ---
type ProductType = "tumbler" | "dogtag" | "knife" | "rectangle";
type TextColor = "white" | "silver" | "gold";
type TextPosition = "center" | "top" | "bottom";

interface FontOption {
  name: string;
  family: string;
  category: string;
  googleName?: string; // for Google Fonts URL
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
  { label: "Silver", value: "silver", hex: "#c0c0c0" },
  { label: "Gold", value: "gold", hex: "#d4af37" },
];

const PRODUCTS: { label: string; value: ProductType; icon: string }[] = [
  { label: "Tumbler", value: "tumbler", icon: "🥤" },
  { label: "Dog Tag", value: "dogtag", icon: "🏷️" },
  { label: "Knife", value: "knife", icon: "🔪" },
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

// --- Main Component ---
export default function FontPreviewPage() {
  // State
  const [text, setText] = useState("Your Text Here");
  const [selectedFont, setSelectedFont] = useState<FontOption>(PRESET_FONTS[0]);
  const [customFonts, setCustomFonts] = useState<FontOption[]>([]);
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState<TextColor>("white");
  const [product, setProduct] = useState<ProductType>("tumbler");
  const [textPosition, setTextPosition] = useState<TextPosition>("center");
  const [curvedText, setCurvedText] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  // Handle custom image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImage(event.target?.result as string);
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

      // Draw product shape
      drawProductShape(ctx, product, width, height);

      // Draw text
      const colorHex = TEXT_COLORS.find((c) => c.value === textColor)?.hex || "#ffffff";
      ctx.fillStyle = colorHex;
      ctx.font = `${fontSize * 2}px ${selectedFont.family.replace(/'/g, "")}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let textY = height / 2;
      if (textPosition === "top") textY = height * 0.3;
      if (textPosition === "bottom") textY = height * 0.7;

      if (curvedText && product === "tumbler") {
        drawCurvedText(ctx, text, width / 2, textY, width * 0.35, fontSize * 2);
      } else {
        // Handle multi-line
        const lines = text.split("\n");
        const lineHeight = fontSize * 2.4;
        const startY = textY - ((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, i) => {
          ctx.fillText(line, width / 2, startY + i * lineHeight);
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
  }, [text, selectedFont, fontSize, textColor, product, textPosition, curvedText]);

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

  // Get text position style
  const getTextPositionStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80%",
      textAlign: "center",
      fontFamily: selectedFont.family.replace(/'/g, ""),
      fontSize: `${fontSize}px`,
      color: TEXT_COLORS.find((c) => c.value === textColor)?.hex || "#fff",
      lineHeight: "1.3",
      wordBreak: "break-word",
      pointerEvents: "none",
    };

    switch (textPosition) {
      case "top":
        return { ...base, top: "20%" };
      case "bottom":
        return { ...base, bottom: "20%" };
      default:
        return { ...base, top: "50%", transform: "translate(-50%, -50%)" };
    }
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
          <div className="lg:col-span-4 space-y-4">
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
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Engraving Color
                </label>
                <div className="flex gap-2">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setTextColor(c.value)}
                      className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
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

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Text Position
                </label>
                <div className="flex gap-2">
                  {(["top", "center", "bottom"] as TextPosition[]).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setTextPosition(pos)}
                      className={`flex-1 p-2 rounded-lg border text-xs font-medium capitalize transition-colors ${
                        textPosition === pos
                          ? "border-emerald-600 bg-emerald-900/20"
                          : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
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
            </section>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-8">
            <div className="sticky top-20">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-zinc-400">Live Preview</h2>
                  <span className="text-xs text-zinc-600">
                    {selectedFont.name} &middot; {fontSize}px
                  </span>
                </div>

                {/* Preview Area */}
                <div
                  ref={previewRef}
                  className="relative bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center"
                  style={{
                    minHeight: product === "knife" ? "300px" : "500px",
                    aspectRatio: product === "knife" ? "2.5/1" : product === "tumbler" ? "1/2" : "3/4",
                    maxHeight: "600px",
                  }}
                >
                  {/* Product Shape or Custom Image */}
                  {customImage ? (
                    <img
                      src={customImage}
                      alt="Custom product"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      {product === "tumbler" && <TumblerSVG />}
                      {product === "dogtag" && <DogTagSVG />}
                      {product === "knife" && <KnifeSVG />}
                      {product === "rectangle" && <RectangleSVG />}
                    </div>
                  )}

                  {/* Text Overlay */}
                  <div style={{ ...getTextPositionStyle(), ...getCurvedTextStyle() }}>
                    {curvedText && product === "tumbler" ? (
                      <svg
                        viewBox="0 0 300 150"
                        className="w-full"
                        style={{ maxWidth: "80%" }}
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
                      <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick tips */}
              <div className="mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500">
                  <strong className="text-zinc-400">Tips:</strong> Upload your own font files for exact previews. Use Enter for multiple lines. Try curved text on tumblers.
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
