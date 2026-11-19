"use client";

import { useState } from "react";

interface ColorToken {
  name: string;
  token: string;
  hex: string;
  role: string;
  ratio: string;
  darkText?: boolean;
}

const COLOR_TOKENS: ColorToken[] = [
  {
    name: "Warm Alabaster",
    token: "--bg-canvas",
    hex: "#F7F5F0",
    role: "Ground Canvas",
    ratio: "~75% viewport",
    darkText: true,
  },
  {
    name: "Pure Linen",
    token: "--bg-surface",
    hex: "#FFFFFF",
    role: "Elevated Card Surface",
    ratio: "~15% viewport",
    darkText: true,
  },
  {
    name: "Soft Oatmeal",
    token: "--bg-muted",
    hex: "#EFECE4",
    role: "Filter Trays & Tracks",
    ratio: "~5% viewport",
    darkText: true,
  },
  {
    name: "Warm Stone",
    token: "--border-stone",
    hex: "#E6E2D8",
    role: "1px Resting Borders",
    ratio: "Hairline structure",
    darkText: true,
  },
  {
    name: "Deep Espresso Slate",
    token: "--ink-primary",
    hex: "#181A18",
    role: "Primary Ink",
    ratio: "Headlines & body",
    darkText: false,
  },
  {
    name: "Muted Olive Gray",
    token: "--ink-secondary",
    hex: "#5A605B",
    role: "Secondary Metadata",
    ratio: "Addresses & notes",
    darkText: false,
  },
  {
    name: "Botanical Eucalyptus",
    token: "--accent-primary",
    hex: "#1E6B52",
    role: "Primary Brand Action",
    ratio: "~3% focal CTAs",
    darkText: false,
  },
  {
    name: "Sunlit Amber",
    token: "--accent-spark",
    hex: "#D96B38",
    role: "Spark & Top Highlight",
    ratio: "<2% deliberate spark",
    darkText: false,
  },
];

const RADIUS_STEPS = [
  { label: "Stage Container", value: "20px", className: "rounded-[20px]" },
  { label: "Listing Card", value: "16px", className: "rounded-[16px]" },
  { label: "Input & CTA", value: "10px", className: "rounded-[10px]" },
  { label: "Status & Vibe Chip", value: "9999px", className: "rounded-full" },
];

export default function TokenSpecimen() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [useTabularNumbers, setUseTabularNumbers] = useState(true);

  const handleCopyHex = async (hex: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(hex);
      }
    } catch {
      // Clipboard may be restricted in non-HTTPS contexts; still show feedback
    }
    setCopiedHex(hex);
    window.setTimeout(() => {
      setCopiedHex((prev) => (prev === hex ? null : prev));
    }, 1400);
  };

  return (
    <section
      id="tokens"
      aria-labelledby="tokens-heading"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2
            id="tokens-heading"
            className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[var(--ink-primary)]"
          >
            1. Color, Typography & Surface Specimen
          </h2>
          <p className="mt-2 text-base text-[var(--ink-secondary)] max-w-2xl leading-relaxed">
            Warm daylight neutrals replace saturated mint backgrounds so room
            photography reads naturally. Surfaces separate through tone steps and
            crisp stone borders rather than resting shadows.
          </p>
        </div>
        <span className="pg-mono text-xs text-[var(--ink-secondary)] bg-[var(--bg-muted)] px-3 py-1.5 rounded-full self-start md:self-auto">
          Click any swatch to copy hex
        </span>
      </div>

      {/* Color Swatch Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {COLOR_TOKENS.map((item) => {
          const isCopied = copiedHex === item.hex;
          return (
            <button
              key={item.token}
              type="button"
              onClick={() => handleCopyHex(item.hex)}
              className="group text-left bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-2.5 pg-card-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              aria-label={`Copy ${item.name} hex ${item.hex}`}
            >
              <div
                className="h-20 w-full rounded-[10px] border border-black/5 flex items-end justify-between p-2 transition-transform"
                style={{ backgroundColor: item.hex }}
              >
                <span
                  className={`pg-mono text-[11px] font-medium ${
                    item.darkText ? "text-[#181A18]" : "text-white"
                  }`}
                >
                  {isCopied ? "Copied" : item.hex}
                </span>
              </div>
              <div className="mt-2.5 px-0.5">
                <div className="text-xs font-semibold text-[var(--ink-primary)] leading-tight">
                  {item.name}
                </div>
                <div className="text-[11px] text-[var(--ink-secondary)] mt-0.5 leading-tight">
                  {item.role}
                </div>
                <div className="pg-mono text-[10px] text-[var(--ink-secondary)] mt-1 opacity-80">
                  {item.ratio}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Typography + Tabular Alignment + Radii Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Display & Body Specimen */}
        <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--ink-secondary)] pb-3 border-b border-[var(--border-stone)]">
              <span className="font-medium">Display & Editorial Body</span>
              <span className="pg-mono">Geist Sans (Plus Jakarta ready)</span>
            </div>
            <p className="mt-5 text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.08] text-[var(--ink-primary)]">
              Find a sunlit room that fits your rhythm.
            </p>
            <p className="mt-4 text-sm sm:text-base text-[var(--ink-secondary)] leading-[1.58] max-w-[54ch]">
              Friendly geometric letterforms keep headlines warm and readable,
              while generous line height prevents dense property details from
              feeling like a spreadsheet.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-stone)] flex flex-wrap gap-3 text-xs text-[var(--ink-secondary)]">
            <span className="pg-mono bg-[var(--bg-muted)] px-2.5 py-1 rounded-[10px]">
              Tracking: -0.03em
            </span>
            <span className="pg-mono bg-[var(--bg-muted)] px-2.5 py-1 rounded-[10px]">
              Body: 16px / 1.58
            </span>
          </div>
        </div>

        {/* Tabular Mono Numbers Specimen */}
        <div className="lg:col-span-4 bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--border-stone)]">
              <span className="text-xs font-medium text-[var(--ink-secondary)]">
                Quantitative Alignment
              </span>
              <button
                type="button"
                onClick={() => setUseTabularNumbers((prev) => !prev)}
                aria-pressed={useTabularNumbers}
                className={`text-xs font-medium px-2.5 py-1 rounded-[10px] border transition-colors ${
                  useTabularNumbers
                    ? "bg-[var(--accent-tint)] border-[var(--accent-primary)]/30 text-[var(--accent-primary)]"
                    : "bg-[var(--bg-muted)] border-[var(--border-stone)] text-[var(--ink-secondary)]"
                }`}
              >
                {useTabularNumbers ? "Tabular Mono On" : "Proportional Sans"}
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                { name: "Loka Pedurungan", price: "Rp 1,050,000", score: "88%" },
                { name: "Saphira Tlogosari", price: "Rp 1,450,000", score: "94%" },
                { name: "Pavilion Pleburan", price: "Rp 2,150,000", score: "81%" },
              ].map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[var(--bg-canvas)] border border-[var(--border-stone)]"
                >
                  <span className="text-xs font-medium text-[var(--ink-primary)] truncate mr-2">
                    {row.name}
                  </span>
                  <div
                    className={`flex items-center gap-3 text-xs ${
                      useTabularNumbers
                        ? "pg-mono"
                        : "font-sans [font-variant-numeric:proportional-nums]"
                    }`}
                  >
                    <span className="font-semibold text-[var(--ink-primary)]">
                      {row.price}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] font-semibold">
                      {row.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--ink-secondary)] leading-relaxed">
            Toggle above to compare how{" "}
            <code className="pg-mono text-[var(--ink-primary)]">tabular-nums</code>{" "}
            locks digits vertically when scanning rent and SPK match columns.
          </p>
        </div>

        {/* Deliberate Geometry & Elevation */}
        <div className="lg:col-span-3 bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--ink-secondary)] pb-3 border-b border-[var(--border-stone)]">
              <span className="font-medium">Radii & Elevation</span>
              <span className="pg-mono">4 Steps</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {RADIUS_STEPS.map((step) => (
                <div
                  key={step.label}
                  className="flex items-center justify-between gap-3"
                >
                  <div
                    className={`w-10 h-7 bg-[var(--bg-muted)] border border-[var(--border-stone)] shrink-0 ${step.className}`}
                  />
                  <span className="text-xs text-[var(--ink-primary)] flex-1">
                    {step.label}
                  </span>
                  <span className="pg-mono text-xs text-[var(--ink-secondary)]">
                    {step.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[var(--border-stone)] flex items-center justify-between text-xs">
            <span className="text-[var(--ink-secondary)]">Resting state</span>
            <span className="pg-mono text-[var(--ink-primary)]">
              1px border, 0 shadow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
