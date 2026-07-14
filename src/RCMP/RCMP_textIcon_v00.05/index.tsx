import type { ReactNode, CSSProperties } from "react";

// ====================== Types ======================

interface ITextStyles {
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  weight?:
    | "thin"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  align?: "left" | "center" | "right" | "justify";
  textColor?: string;
  font?: "sans" | "serif" | "mono";
  transform?: "uppercase" | "lowercase" | "capitalize" | "normal-case";
  decoration?: "underline" | "line-through" | "no-underline";
  tracking?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  truncate?: boolean;
  whitespace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
  cursor?: "pointer" | "default" | "text" | "not-allowed";
  className?: string;
  style?: CSSProperties;
}

interface IPropsTextIcon extends ITextStyles {
  meta?: any;
  geo?: any;
  logic?: {
    icon?: ReactNode;
    element?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p" | "pre";
  };
  text?: string;
}


const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
} as const;

const weightClasses = {
  thin: "font-thin",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
} as const;

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
} as const;

const fontClasses = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
} as const;

const transformClasses = {
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
  "normal-case": "normal-case",
} as const;

const decorationClasses = {
  underline: "underline",
  "line-through": "line-through",
  "no-underline": "no-underline",
} as const;

const trackingClasses = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
} as const;

const leadingClasses = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
} as const;

const whitespaceClasses = {
  normal: "whitespace-normal",
  nowrap: "whitespace-nowrap",
  pre: "whitespace-pre",
  "pre-wrap": "whitespace-pre-wrap",
  "pre-line": "whitespace-pre-line",
} as const;

const cursorClasses = {
  pointer: "cursor-pointer",
  default: "cursor-default",
  text: "cursor-text",
  "not-allowed": "cursor-not-allowed",
} as const;


const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");


function TextIcon({
  meta,
  geo,
  logic,
  text = "",
  size = "base",
  weight = "normal",
  align = "left",
  textColor,
  font,
  transform,
  decoration,
  tracking,
  leading,
  truncate = false,
  whitespace,
  cursor,
  className,
  style,
}: IPropsTextIcon) {
  const Element = logic?.element ?? "span";

  const combinedClasses = cn(
    "inline-flex items-center gap-2",
    // نگاشت‌ها
    sizeClasses[size],
    weightClasses[weight],
    alignClasses[align],
    textColor,
    font && fontClasses[font],
    transform && transformClasses[transform],
    decoration && decorationClasses[decoration],
    tracking && trackingClasses[tracking],
    leading && leadingClasses[leading],
    truncate && "truncate",
    whitespace && whitespaceClasses[whitespace],
    cursor && cursorClasses[cursor],
    className,
  );

  return (
    <Element className={combinedClasses} style={style}>
      {logic?.icon && (
        <span className="inline-flex shrink-0">{logic.icon}</span>
      )}
      <span>{text}</span>
    </Element>
  );
}

export default TextIcon;
