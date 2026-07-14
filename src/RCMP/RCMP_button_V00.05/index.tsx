import { Link } from "react-router-dom";
import { type ReactNode } from "react";
import TextIcon from "../RCMP_textIcon_v00.05";

type ButtonVariant = "fill" | "secondary" | "outline" | "text";
type ButtonSize = "default" | "mini" | "small" | "large";
type ButtonState = "active" | "loading" | "disabled";

interface IButtonLogic {
  to?: string;
  href?: string;
  content?: ReactNode;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  state?: ButtonState;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** تنظیمات اضافی برای TextIcon (اختیاری) */
  textIconProps?: {
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
    textColor?: string;
    tracking?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
    leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
    className?: string;
    style?: React.CSSProperties;
    // هر ویژگی دیگری که TextIcon قبول می‌کند
  };
}

interface IButtonProps {
  meta?: any;
  geo?: any;
  logic?: IButtonLogic;
  style?: React.CSSProperties;
}

// ====================== کلاس‌های دکمه ======================

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200";

// ✅ استفاده از رنگ‌های سمانتیک دیزاین سیستم
const variantClasses: Record<ButtonVariant, string> = {
  fill: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active ",
  secondary:
    "bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-active ",
  outline:
    "border border-primary text-primary hover:bg-primary-light active:bg-primary-light/80 ",
  text: "text-primary hover:underline hover:text-primary-hover ",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "px-4 py-2 text-base",
  mini: "px-2 min-h-8 max-h-8 text-xs",
  small: "px-3 py-1 text-sm",
  large: "px-6 py-3 text-lg",
};

const stateClasses: Record<ButtonState, string> = {
  active: "",
  loading: "opacity-70 cursor-not-allowed",
  disabled: "opacity-50 cursor-not-allowed",
};

const fullWidthClass = "w-full";

function getButtonClasses({
  variant = "fill",
  size = "default",
  state = "active",
  fullWidth = false,
}: Required<
  Pick<IButtonLogic, "variant" | "size" | "state" | "fullWidth">
>): string {
  return [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses[state],
    fullWidth ? fullWidthClass : "",
  ]
    .filter(Boolean)
    .join(" ");
}

// ====================== کامپوننت اصلی ======================

function Button({ meta, geo, logic, style }: IButtonProps) {
  const {
    to,
    href,
    content,
    icon,
    variant = "fill",
    size = "default",
    fullWidth = false,
    state = "active",
    onClick,
    textIconProps = {},
  } = logic || {};

  const isDisabled = state === "disabled" || state === "loading";
  const className = getButtonClasses({ variant, size, state, fullWidth });

  // ====== رندر محتوای داخلی با TextIcon ======
  const renderContent = () => {
    if (!content && !icon) return null;

    if (typeof content === "string") {
      return (
        <TextIcon
          text={content}
          logic={{ icon }}
          size={textIconProps.size || "base"}
          weight={textIconProps.weight || "medium"}
          textColor={textIconProps.textColor || "current"}
          tracking={textIconProps.tracking || "normal"}
          leading={textIconProps.leading || "normal"}
          className={textIconProps.className}
          style={textIconProps.style}
        />
      );
    }

    return (
      <>
        {icon && <span className="mr-2">{icon}</span>}
        {content}
      </>
    );
  };

  // ====== اسپینر لودینگ ======
  const loadingSpinner = state === "loading" && (
    <span className="ml-2">
      <svg
        className="animate-spin h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );

  // ====== رندر نهایی ======
  const children = (
    <>
      {renderContent()}
      {loadingSpinner}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={className}
      style={style}
      disabled={isDisabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;