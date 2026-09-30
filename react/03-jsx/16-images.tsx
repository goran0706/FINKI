/**
 * 15 - Images
 * ===========
 *
 * Images in JSX provide declarative rendering for visual assets, requiring strict self-closing
 * syntax (`<img />`), mandatory accessibility compliance via descriptive or empty alt attributes,
 * and responsive optimization using `srcSet`, `sizes`, and density descriptors (like Apple Retina `@2x`).
 *
 * Next-gen format fallbacks are achieved using the `<picture>` element with multiple `<source>` tags,
 * while native performance hooks (`loading="lazy"`, `decoding="async"`) optimize resource loading.
 * Furthermore, dynamic image lookup registries, stateful component wrappers handling loading skeletons,
 * preloading checks, and error fallbacks ensure robust asset delivery under strict TypeScript validation.
 */

import React, { useState } from "react";

// Mock asset imports for dictionary registry demonstration
import avatarDefault from "../assets/avatar-default.png";
import avatarAdmin from "../assets/avatar-admin.png";
import avatarGuest from "../assets/avatar-guest.png";

// ---------------------------------------------------------------------
// 1. Dynamic Image Registry / Dictionary Lookup Component
// ---------------------------------------------------------------------

type AvatarKey = "default" | "admin" | "guest";

const avatarRegistry: Record<AvatarKey, string> = {
  default: avatarDefault,
  admin: avatarAdmin,
  guest: avatarGuest,
};

interface DynamicAvatarSelectorProps {
  readonly currentKey: AvatarKey;
  readonly onCycle: () => void;
}

export function DynamicAvatarSelector({ currentKey, onCycle }: DynamicAvatarSelectorProps) {
  const activeSrc = avatarRegistry[currentKey] || avatarRegistry.default;

  return (
    <div className="dynamic-image-panel" style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <img
        src={activeSrc}
        alt={`User avatar for role: ${currentKey}`}
        width={80}
        height={80}
        style={{ borderRadius: "50%", objectFit: "cover" }}
      />
      <button onClick={onCycle} type="button">
        Cycle Avatar ({currentKey})
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. Basic Responsive, Retina-Ready, and Accessible Image Component
// ---------------------------------------------------------------------

export interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly src: string;
  readonly alt: string;
  readonly srcSet?: string;
  readonly sizes?: string;
  readonly isDecorative?: boolean;
  readonly width?: number | string;
  readonly height?: number | string;
}

export function ResponsiveImage({
  src,
  alt,
  srcSet,
  sizes = "(max-width: 768px) 100vw, 50vw",
  isDecorative = false,
  className = "",
  width,
  height,
  ...restProps
}: ResponsiveImageProps) {
  return (
    <img
      src={src}
      alt={isDecorative ? "" : alt}
      aria-hidden={isDecorative ? true : undefined}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={`responsive-img ${className}`.trim()}
      {...restProps}
    />
  );
}

// ---------------------------------------------------------------------
// 3. Next-Gen Multi-Format Picture Component
// ---------------------------------------------------------------------

interface PictureSource {
  readonly srcSet: string;
  readonly type: "image/avif" | "image/webp" | "image/jpeg" | "image/png";
  readonly media?: string;
}

interface MultiFormatPictureProps {
  readonly sources: ReadonlyArray<PictureSource>;
  readonly fallbackSrc: string;
  readonly alt: string;
  readonly className?: string;
}

export function MultiFormatPicture({ sources, fallbackSrc, alt, className = "" }: MultiFormatPictureProps) {
  return (
    <picture className={`picture-container ${className}`.trim()}>
      {sources.map((source, index) => (
        <source key={index} srcSet={source.srcSet} type={source.type} media={source.media} />
      ))}
      <img src={fallbackSrc} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
}

// ---------------------------------------------------------------------
// 4. Stateful Image with Loading Skeleton and Fallback
// ---------------------------------------------------------------------

interface StatefulImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  readonly src: string;
  readonly fallbackSrc: string;
  readonly alt: string;
}

export function StatefulImage({ src, fallbackSrc, alt, className = "", ...restProps }: StatefulImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const currentSrc = status === "error" ? fallbackSrc : src;

  return (
    <div className="stateful-image-wrapper" style={{ position: "relative" }}>
      {status === "loading" && <div className="skeleton-placeholder" aria-label="Loading image..." />}
      <img
        src={currentSrc}
        alt={alt}
        onLoad={() => setStatus("loaded")}
        onError={() => {
          if (status !== "error") {
            setStatus("error");
          }
        }}
        className={`image-node ${status === "loaded" ? "visible" : "hidden"} ${className}`.trim()}
        {...restProps}
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// 5. Parent Container Component Demonstrating Image Architecture
// ---------------------------------------------------------------------

export function ImagesDemoContainer() {
  const [avatarIndex, setAvatarIndex] = useState<number>(0);
  const avatarKeys: ReadonlyArray<AvatarKey> = ["default", "admin", "guest"];

  const handleCycleAvatar = () => {
    setAvatarIndex((prev: number) => (prev + 1) % avatarKeys.length);
  };

  const samplePictureSources: ReadonlyArray<PictureSource> = [
    { srcSet: "/assets/hero.avif", type: "image/avif" },
    { srcSet: "/assets/hero.webp", type: "image/webp" },
  ];

  return (
    <div>
      <h1>Images Architecture Demonstration</h1>

      {/* Dynamic dictionary mapping registry */}
      <DynamicAvatarSelector currentKey={avatarKeys[avatarIndex]} onCycle={handleCycleAvatar} />

      {/* Standard responsive, retina-ready (`@2x`), and accessible image */}
      <ResponsiveImage
        src="/assets/landscape.jpg"
        srcSet="/assets/landscape-400.jpg 400w, /assets/landscape-800.jpg 800w, /assets/landscape-retina.jpg 2x"
        width={600}
        height={400}
        alt="Scenic mountain landscape during sunrise"
      />

      {/* Multi-format picture fallback stack */}
      <MultiFormatPicture
        sources={samplePictureSources}
        fallbackSrc="/assets/hero.jpg"
        alt="System Architecture Overview Diagram"
      />

      {/* Stateful image with error handling and placeholder skeletons */}
      <StatefulImage
        src="/assets/invalid-path.jpg"
        fallbackSrc="/assets/placeholder.jpg"
        alt="User Profile Avatar"
        width={120}
        height={120}
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JSX `<img>` tags require strict self-closing syntax (`<img />`) unlike standard HTML void elements.
// - Accessibility contracts enforce mandatory `alt` text: empty string for decorative assets, descriptive text for content.
// - Responsive resolution switching is handled natively via `srcSet`, `sizes`, and pixel-density descriptors (e.g., `2x` for Apple Retina displays).
// - Dynamic object registries (`Record<Key, string>`) enable flexible state-driven runtime image lookup and switching.
// - The `<picture>` element allows serving next-gen image formats like AVIF or WebP with standard raster fallbacks.
// - Native performance hooks (`loading="lazy"`, `decoding="async"`) optimize offscreen fetching and main-thread decoding.
// - Stateful wrappers manage load failures, skeleton placeholders, and custom error fallback images.
// - TypeScript validates image properties using `React.ImgHTMLAttributes<HTMLImageElement>`.
