/**
 * Icons
 * =====
 *
 * Icons in React architecture serve as foundational micro-visuals requiring modular design, design-system
 * theme integration, accessibility compliance, and optimized asset delivery. Asset abstraction decouples raw
 * SVG markup into reusable component APIs, while CSS `currentColor` synchronization allows graphics to inherit
 * text color automatically from parent typographic containers.
 *
 * Furthermore, React Context establishes global design system defaults without prop drilling, polymorphic
 * base wrappers normalize viewports and alignment, and dynamic registry maps enable flexible runtime icon
 * lookup under strict accessibility contracts (`aria-hidden` or inner `<title>` nodes). Advanced optimization
 * patterns incorporate SVG sprite sheets (`<use href>`) for efficient symbol reuse and multi-format asset delivery.
 */

import React, { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Icon Global Context Configuration
// ---------------------------------------------------------------------

interface IconContextValue {
  readonly size?: number | string;
  readonly color?: string;
  readonly className?: string;
}

const IconContext = createContext<IconContextValue>({
  size: 24,
  color: "currentColor",
  className: "",
});

export function IconContextProvider({
  value,
  children,
}: {
  readonly value: IconContextValue;
  readonly children: React.ReactNode;
}) {
  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}

// ---------------------------------------------------------------------
// 2. Base Polymorphic Icon Component
// ---------------------------------------------------------------------

export interface IconBaseProps extends React.SVGProps<SVGSVGElement> {
  readonly size?: number | string;
  readonly color?: string;
  readonly title?: string;
}

export function IconBase({
  size,
  color,
  title,
  className = "",
  children,
  viewBox = "0 0 24 24",
  ...restProps
}: IconBaseProps) {
  const context = useContext(IconContext);

  const computedSize = size ?? context.size ?? 24;
  const computedColor = color ?? context.color ?? "currentColor";
  const computedClassName = `${context.className ?? ""} ${className}`.trim();

  const isAccessible = Boolean(title);

  return (
    <svg
      width={computedSize}
      height={computedSize}
      viewBox={viewBox}
      fill="none"
      stroke={computedColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={computedClassName}
      aria-hidden={!isAccessible}
      role={isAccessible ? "img" : undefined}
      {...restProps}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------
// 3. Specialized Domain Icon Implementations
// ---------------------------------------------------------------------

export function SearchIcon(props: IconBaseProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </IconBase>
  );
}

export function UserIcon(props: IconBaseProps) {
  return (
    <IconBase {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconBase>
  );
}

export function SunIcon(props: IconBaseProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </IconBase>
  );
}

// ---------------------------------------------------------------------
// 4. SVG Sprite Symbol Reference Component (Sprite Sheet Pattern)
// ---------------------------------------------------------------------

interface SpriteIconProps extends IconBaseProps {
  readonly name: string;
  readonly spritePath?: string;
}

export function SpriteIcon({
  name,
  spritePath = "/assets/icons-sprite.svg",
  size,
  color,
  className = "",
  ...restProps
}: SpriteIconProps) {
  const context = useContext(IconContext);
  const computedSize = size ?? context.size ?? 24;

  return (
    <svg
      width={computedSize}
      height={computedSize}
      className={`sprite-icon sprite-${name} ${className}`.trim()}
      fill={color ?? context.color}
      aria-hidden="true"
      {...restProps}
    >
      <use href={`${spritePath}#${name}`} />
    </svg>
  );
}

// ---------------------------------------------------------------------
// 5. Dynamic Icon Registry & State-Driven Icon Selector Component
// ---------------------------------------------------------------------

type IconKey = "search" | "user" | "sun";

const iconRegistry: Record<IconKey, React.ComponentType<IconBaseProps>> = {
  search: SearchIcon,
  user: UserIcon,
  sun: SunIcon,
};

interface RandomIconDisplayProps {
  readonly iconKey: IconKey;
  readonly onClick: () => void;
}

function RandomIconDisplay({ iconKey, onClick }: RandomIconDisplayProps) {
  const IconComponent = iconRegistry[iconKey] || SearchIcon;

  return (
    <div className="random-icon-panel" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ display: "inline-flex" }}>
        <IconComponent size={28} color="#faad14" />
      </span>
      <button onClick={onClick} type="button">
        Cycle Icon State ({iconKey})
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------
// 6. Parent Container Component
// ---------------------------------------------------------------------

export function IconsDemoContainer() {
  const [iconIndex, setIconIndex] = useState<number>(0);
  const iconKeys: ReadonlyArray<IconKey> = ["search", "user", "sun"];

  const handleCycleIcon = () => {
    setIconIndex((prevIndex: number) => (prevIndex + 1) % iconKeys.length);
  };

  return (
    <IconContextProvider value={{ size: 28, color: "#1890ff" }}>
      <div>
        <h1>Icons Architecture Demonstration</h1>

        {/* Decorative icon inheriting context */}
        <SearchIcon />

        {/* Semantic accessible icon overriding props */}
        <UserIcon size={36} color="#52c41a" title="User Profile Settings" />

        {/* Dynamic dictionary mapping and state-driven selection */}
        <RandomIconDisplay iconKey={iconKeys[iconIndex]} onClick={handleCycleIcon} />

        {/* SVG sprite sheet symbol reference */}
        <SpriteIcon name="shield-check" size={32} />
      </div>
    </IconContextProvider>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Icon abstraction decouples raw vector SVG graphics from high-level application layout logic.
// - Using `currentColor` for SVG stroke/fill enables automatic inheritance of parent typography styling.
// - Icon Context Providers establish centralized default sizing, coloring, and CSS classes globally.
// - Decorative icons must declare `aria-hidden="true"` to omit redundant noise from assistive technologies.
// - Semantic standalone icons require explicit accessibility metadata via `aria-label` or inner `<title>` elements.
// - Dynamic registry maps enable flexible runtime icon lookup and state-driven component rendering.
// - SVG sprite sheets (`<svg><use href="/sprite.svg#id" /></svg>`) optimize delivery by bundling symbols into a single request.
// - Polymorphic base wrappers enforce consistent viewport dimensions and vector alignment across icon sets.
