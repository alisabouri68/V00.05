/*------------------------------------------------------------
Meta Data

ID:             RCMP_modalBase 
Title:          Modal Base Component - Optimized v1.0
Version:        01.00.00
VAR:            01

last-update:    D2026.07.14
owner:          apps68

Description:    Highly optimized modal with animations, 
                backdrop blur, multiple sizes, and variants.
------------------------------------------------------------*/

/**************************************
 * Step 01 import dependencies - kernels
 **************************************/
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useId,
} from "react";
import { createPortal } from "react-dom";
import {
  CloseCircle,
  TickCircle,
  InfoCircle,
  Warning2,
  Danger,
  Add,
  Minus,
} from "iconsax-react";

/**************************************
 * Step.02:    import dependency - widgets
 **************************************/
import Button from "RCMP/RCMP_button_V00.05";

/**************************************
 * Step 04 - define properties - Static
 **************************************/

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Lock body scroll when modal is open
 */
const useLockBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
};

/**
 * Focus trap inside modal
 */
const useFocusTrap = (isOpen: boolean, containerRef: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    return () => container.removeEventListener("keydown", handleTabKey);
  }, [isOpen, containerRef]);
};

// ============================================
// INTERFACES
// ============================================

interface IMetaProps {
  id?: string;
  title?: string;
  version?: string;
  lastUpgrade?: string;
  owner?: string;
  type?: string;
  origin_model?: string;
  origin_model_Ver?: string;
  rem?: string;
}

interface IGeoProps {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  position?: string;
  zIndex?: string;
  top?: string;
  left?: string;
}

interface IModalEvents {
  onOpen?: () => void;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onBackdropClick?: () => void;
  onEscapeKey?: () => void;
}

interface ILogicProps extends IModalEvents {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error" | "info" | "confirm";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  preventClose?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: "primary" | "secondary" | "danger" | "success" | "warning";
  cancelButtonVariant?: "primary" | "secondary" | "danger" | "ghost";
  hideConfirmButton?: boolean;
  hideCancelButton?: boolean;
  loading?: boolean;
  disableConfirm?: boolean;
  disableCancel?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  headerContent?: React.ReactNode;
  animation?: "fade" | "slide-up" | "slide-down" | "zoom" | "none";
  duration?: number;
  portalTarget?: HTMLElement | null;
  autoFocus?: boolean;
  returnFocus?: boolean;
  trapFocus?: boolean;
  scrollBehavior?: "inside" | "outside";
  centered?: boolean;
  fullScreen?: boolean;
  fullScreenOnMobile?: boolean;
}

interface IStyleProps {
  backdropColor?: string;
  backdropBlur?: boolean;
  borderRadius?: string;
  shadow?: string;
  borderColor?: string;
  headerBg?: string;
  footerBg?: string;
  bodyBg?: string;
  textColor?: string;
  padding?: string;
  gap?: string;
  fontSize?: string;
  compact?: boolean;
  customClass?: string;
}

interface IModalBaseProps {
  meta?: IMetaProps;
  geo?: IGeoProps;
  logic?: ILogicProps;
  style?: IStyleProps;
}

// ============================================
// VARIANT CONFIGURATIONS
// ============================================

const variantConfig = {
  default: {
    icon: null,
    iconColor: "",
    headerBorder: true,
    confirmVariant: "primary" as const,
  },
  success: {
    icon: <TickCircle size={48} variant="Bold" />,
    iconColor: "text-green-500",
    headerBorder: false,
    confirmVariant: "success" as const,
  },
  warning: {
    icon: <Warning2 size={48} variant="Bold" />,
    iconColor: "text-amber-500",
    headerBorder: false,
    confirmVariant: "warning" as const,
  },
  error: {
    icon: <Danger size={48} variant="Bold" />,
    iconColor: "text-red-500",
    headerBorder: false,
    confirmVariant: "danger" as const,
  },
  info: {
    icon: <InfoCircle size={48} variant="Bold" />,
    iconColor: "text-cyan-500",
    headerBorder: false,
    confirmVariant: "primary" as const,
  },
  confirm: {
    icon: <Warning2 size={48} variant="Bold" />,
    iconColor: "text-amber-500",
    headerBorder: true,
    confirmVariant: "primary" as const,
  },
};

const sizeConfig = {
  xs: { width: "max-w-xs", maxWidth: "320px" },
  sm: { width: "max-w-sm", maxWidth: "384px" },
  md: { width: "max-w-md", maxWidth: "448px" },
  lg: { width: "max-w-lg", maxWidth: "512px" },
  xl: { width: "max-w-xl", maxWidth: "576px" },
  full: { width: "max-w-full", maxWidth: "100%" },
};

// ============================================
// SUB-COMPONENTS (Memoized)
// ============================================

/**
 * Modal Backdrop Component
 */
const ModalBackdrop = memo(({
  show,
  onClick,
  blur,
  color,
}: {
  show: boolean;
  onClick?: () => void;
  blur: boolean;
  color?: string;
}) => {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300
        ${blur ? "backdrop-blur-sm" : ""}
        ${show ? "opacity-100" : "opacity-0"}`}
      style={{ backgroundColor: color || "rgba(0, 0, 0, 0.5)" }}
      onClick={onClick}
      aria-hidden="true"
    />
  );
});
ModalBackdrop.displayName = "ModalBackdrop";

/**
 * Modal Header Component
 */
const ModalHeader = memo(({
  title,
  description,
  showCloseButton,
  onClose,
  variant,
  customContent,
  headerBg,
  borderColor,
  compact,
}: {
  title?: string;
  description?: string;
  showCloseButton: boolean;
  onClose: () => void;
  variant: string;
  customContent?: React.ReactNode;
  headerBg?: string;
  borderColor?: string;
  compact?: boolean;
}) => {
  const config = variantConfig[variant as keyof typeof variantConfig] || variantConfig.default;

  if (customContent) {
    return (
      <header className={`relative ${compact ? "px-4 py-2" : "px-6 py-4"}`}>
        {customContent}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <CloseCircle size={20} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </header>
    );
  }

  return (
    <header
      className={`relative flex items-start gap-4 ${compact ? "px-4 py-3" : "px-6 py-4"}
        ${config.headerBorder ? "border-b border-gray-100 dark:border-gray-700" : ""}`}
      style={{ backgroundColor: headerBg }}
    >
      {config.icon && (
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <h2 className={`font-semibold text-gray-900 dark:text-gray-100 ${compact ? "text-sm" : "text-base"}`}>
            {title}
          </h2>
        )}
        {description && (
          <p className={`mt-1 text-gray-500 dark:text-gray-400 ${compact ? "text-xs" : "text-sm"}`}>
            {description}
          </p>
        )}
      </div>
      {showCloseButton && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-2"
          aria-label="Close modal"
        >
          <CloseCircle size={20} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>
      )}
    </header>
  );
});
ModalHeader.displayName = "ModalHeader";

/**
 * Modal Footer Component
 */
const ModalFooter = memo(({
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmVariant,
  cancelVariant,
  hideConfirm,
  hideCancel,
  loading,
  disableConfirm,
  disableCancel,
  customContent,
  footerBg,
  compact,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
  confirmVariant: string;
  cancelVariant: string;
  hideConfirm: boolean;
  hideCancel: boolean;
  loading: boolean;
  disableConfirm: boolean;
  disableCancel: boolean;
  customContent?: React.ReactNode;
  footerBg?: string;
  compact?: boolean;
}) => {
  if (customContent) {
    return (
      <footer className={`${compact ? "px-4 py-2" : "px-6 py-4"} border-t border-gray-100 dark:border-gray-700`}>
        {customContent}
      </footer>
    );
  }

  const getConfirmClasses = () => {
    const base = "h-8 px-4 rounded-lg text-xs font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    switch (confirmVariant) {
      case "success":
        return `${base} bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600`;
      case "warning":
        return `${base} bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600`;
      case "danger":
        return `${base} bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600`;
      case "secondary":
        return `${base} bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`;
      default:
        return `${base} bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600`;
    }
  };

  const getCancelClasses = () => {
    const base = "h-8 px-4 rounded-lg text-xs font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    switch (cancelVariant) {
      case "ghost":
        return `${base} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`;
      case "danger":
        return `${base} bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30`;
      default:
        return `${base} border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800`;
    }
  };

  return (
    <footer
      className={`flex items-center justify-end gap-2 ${compact ? "px-4 py-2" : "px-6 py-4"} 
        border-t border-gray-100 dark:border-gray-700`}
      style={{ backgroundColor: footerBg }}
    >
      {!hideCancel && (
        <button
          onClick={onCancel}
          disabled={disableCancel || loading}
          className={getCancelClasses()}
        >
          {cancelText}
        </button>
      )}
      {!hideConfirm && (
        <button
          onClick={onConfirm}
          disabled={disableConfirm || loading}
          className={getConfirmClasses()}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            confirmText
          )}
        </button>
      )}
    </footer>
  );
});
ModalFooter.displayName = "ModalFooter";

// ============================================
// MAIN COMPONENT
// ============================================

const ModalBase = memo(function ModalBase({
  meta,
  geo,
  logic,
  style,
}: IModalBaseProps) {
  /**************************************
   * Step 06 - assignments for this BioWidget
   **************************************/
  const {
    isOpen = false,
    onOpenChange,
    title = "Modal Title",
    description = "",
    variant = "default",
    size = "md",
    showCloseButton = true,
    showHeader = true,
    showFooter = true,
    showBackdrop = true,
    closeOnBackdropClick = true,
    closeOnEscapeKey = true,
    preventClose = false,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmButtonVariant = "primary",
    cancelButtonVariant = "ghost",
    hideConfirmButton = false,
    hideCancelButton = false,
    loading = false,
    disableConfirm = false,
    disableCancel = false,
    icon,
    children,
    footerContent,
    headerContent,
    animation = "fade",
    duration = 300,
    portalTarget = null,
    autoFocus = true,
    returnFocus = true,
    trapFocus = true,
    scrollBehavior = "inside",
    centered = true,
    fullScreen = false,
    fullScreenOnMobile = false,
    onOpen,
    onClose,
    onConfirm,
    onCancel,
    onBackdropClick,
    onEscapeKey,
  } = logic || {};

  const {
    backdropColor,
    backdropBlur = true,
    borderRadius = "0.75rem",
    shadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    borderColor = "#e2e8f0",
    headerBg,
    footerBg,
    bodyBg,
    textColor = "#1e293b",
    padding,
    gap = "1rem",
    fontSize = "0.875rem",
    compact = false,
    customClass = "",
  } = style || {};

  // --- STATE MANAGEMENT ---
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const componentId = useId();

  // Lock body scroll
  useLockBodyScroll(isOpen);

  // Focus trap
  useFocusTrap(trapFocus && isOpen, modalRef);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
        onOpen?.();
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
        if (returnFocus && triggerRef.current) {
          triggerRef.current.focus();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onOpen, onClose, returnFocus]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscapeKey || preventClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscapeKey?.();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscapeKey, preventClose, onEscapeKey]);

  // --- CALLBACKS ---

  const handleClose = useCallback(() => {
    if (preventClose) return;
    onOpenChange?.(false);
  }, [preventClose, onOpenChange]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick && !preventClose) {
      onBackdropClick?.();
      handleClose();
    }
  }, [closeOnBackdropClick, preventClose, onBackdropClick, handleClose]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    handleClose();
  }, [onCancel, handleClose]);

  // --- ANIMATION CLASSES ---

  const getAnimationClasses = () => {
    const base = "transition-all duration-300 ease-out";
    const visible = isAnimating;

    switch (animation) {
      case "slide-up":
        return `${base} ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`;
      case "slide-down":
        return `${base} ${visible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`;
      case "zoom":
        return `${base} ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`;
      case "none":
        return "";
      default:
        return `${base} ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`;
    }
  };

  const getSizeClasses = () => {
    if (fullScreen) return "w-full h-full max-w-none max-h-none rounded-none";
    if (fullScreenOnMobile) return `w-full h-full sm:h-auto sm:${sizeConfig[size].width} max-w-none sm:max-w-${sizeConfig[size].maxWidth} rounded-none sm:rounded-xl`;
    return `${sizeConfig[size].width} w-full`;
  };

  // --- RENDER ---

  if (!isVisible) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby={`${componentId}-title`}>
      {/* Backdrop */}
      {showBackdrop && (
        <ModalBackdrop
          show={isAnimating}
          onClick={handleBackdropClick}
          blur={backdropBlur}
          color={backdropColor}
        />
      )}

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`relative z-50 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden
          ${getSizeClasses()}
          ${getAnimationClasses()}
          ${customClass}`}
        style={{
          borderRadius: fullScreen ? 0 : borderRadius,
          boxShadow: shadow,
          border: `1px solid ${borderColor}`,
          maxHeight: geo?.maxHeight || (scrollBehavior === "inside" ? "85vh" : "none"),
          height: geo?.height,
          width: geo?.width,
          top: geo?.top,
          left: geo?.left,
          zIndex: geo?.zIndex ? parseInt(geo.zIndex) : undefined,
        }}
      >
        {/* Header */}
        {showHeader && (
          <ModalHeader
            title={title}
            description={description}
            showCloseButton={showCloseButton && !preventClose}
            onClose={handleClose}
            variant={variant}
            customContent={headerContent}
            headerBg={headerBg}
            borderColor={borderColor}
            compact={compact}
          />
        )}

        {/* Body */}
        <div
          className={`${compact ? "px-4 py-3" : "px-6 py-4"} 
            ${scrollBehavior === "inside" ? "overflow-y-auto custom-scrollbar" : ""}`}
          style={{
            backgroundColor: bodyBg,
            color: textColor,
            fontSize,
            maxHeight: scrollBehavior === "inside" ? "calc(85vh - 120px)" : undefined,
          }}
        >
          {icon && (
            <div className="flex justify-center mb-4">
              {icon}
            </div>
          )}
          {children || (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <ModalFooter
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirmText={confirmText}
            cancelText={cancelText}
            confirmVariant={confirmButtonVariant}
            cancelVariant={cancelButtonVariant}
            hideConfirm={hideConfirmButton}
            hideCancel={hideCancelButton}
            loading={loading}
            disableConfirm={disableConfirm}
            disableCancel={disableCancel}
            customContent={footerContent}
            footerBg={footerBg}
            compact={compact}
          />
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, portalTarget || document.body);
});

ModalBase.displayName = "ModalBase";

export default ModalBase;