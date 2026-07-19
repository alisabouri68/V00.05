// Tooltip.tsx
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// ====================== Types ======================

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipTrigger = 'click' | 'hover';

interface ITooltipLogic {
  /** محتوای اصلی که تولتیپ به آن متصل می‌شود (مثلاً دکمه) */
  children: ReactNode;
  /** محتوای داخل تولتیپ */
  content: ReactNode;
  /** موقعیت تولتیپ نسبت به عنصر فرزند */
  placement?: TooltipPlacement;
  /** فاصلهٔ تولتیپ از عنصر (px) */
  offset?: number;
  /** آیا تولتیپ باز است (کنترل از بیرون) */
  open?: boolean;
  /** تابع تغییر وضعیت باز/بسته (برای کنترل از بیرون) */
  onOpenChange?: (open: boolean) => void;
  /** نوع تریگر: کلیک یا هاور */
  trigger?: TooltipTrigger;
  /** کلاس‌های اضافی برای کانتینر تولتیپ (پورتال) */
  className?: string;
  /** غیرفعال کردن تولتیپ */
  disabled?: boolean;
  /** مدت زمان تأخیر برای باز شدن در حالت هاور (ms) */
  delay?: number;
}

interface ITooltipProps {
  meta?: any;
  geo?: any;
  logic?: ITooltipLogic;
  style?: React.CSSProperties;
}

// ====================== کلاس‌های ثابت ======================

const tooltipBaseClasses =
  'fixed z-[9999] transition-all duration-150 ease-out ' +
  'bg-neutral border border-neutral-border rounded-lg shadow-xl ' +
  'text-sm text-neutral-text p-3 min-w-[200px] max-w-xs';

const arrowBaseClasses =
  'absolute w-2 h-2 bg-neutral border-r border-t border-neutral-border rotate-45';

// ====================== تابع کمکی برای موقعیت فلش ======================

function getArrowStyle(placement: TooltipPlacement): React.CSSProperties {
  switch (placement) {
    case 'top':
      return { bottom: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
    case 'bottom':
      return { top: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' };
    case 'left':
      return { right: '-5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
    case 'right':
      return { left: '-5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' };
  }
}

// ====================== کامپوننت اصلی ======================

const Tooltip: React.FC<ITooltipProps> = ({ meta, geo, logic, style }) => {
  const {
    children,
    content,
    placement = 'top',
    offset = 8,
    open: controlledOpen,
    onOpenChange,
    trigger = 'click',
    className = '',
    disabled = false,
    delay = 200,
  } = logic || {};

  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // تعیین وضعیت باز (کنترل شده یا داخلی)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // به‌روزرسانی وضعیت داخلی و فراخوانی onOpenChange
  const setOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  // محاسبه موقعیت تولتیپ
  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;
    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = childRect.top - tooltipRect.height - offset;
        left = childRect.left + (childRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = childRect.bottom + offset;
        left = childRect.left + (childRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = childRect.top + (childRect.height - tooltipRect.height) / 2;
        left = childRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = childRect.top + (childRect.height - tooltipRect.height) / 2;
        left = childRect.right + offset;
        break;
    }

    // جلوگیری از خروج از دید (viewport)
    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > viewportWidth - padding) {
      left = viewportWidth - tooltipRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipRect.height > viewportHeight - padding) {
      top = viewportHeight - tooltipRect.height - padding;
    }

    setPosition({ top, left });
  };

  // هنگام باز شدن، موقعیت را محاسبه کن
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        updatePosition();
      });
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isOpen, placement, offset]);

  // بستن با کلیک خارج
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        childRef.current &&
        !childRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setOpen]);

  // مدیریت هاور با تأخیر
  const handleMouseEnter = () => {
    if (trigger !== 'hover' || disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delay);
  };

  const handleMouseLeave = () => {
    if (trigger !== 'hover' || disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(false);
  };

  // کلیک برای باز/بسته کردن
  const handleClick = () => {
    if (trigger !== 'click' || disabled) return;
    setOpen(!isOpen);
  };

  // کلید ESC برای بستن
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  // پاک کردن تایمر هنگام unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* عنصر محرک */}
      <div
        ref={childRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
        style={style}
      >
        {children}
      </div>

      {/* خود تولتیپ از طریق پورتال */}
      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`${tooltipBaseClasses} ${className}`}
            style={{
              top: position.top,
              left: position.left,
              opacity: 1,
              transform: 'scale(1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* فلش */}
            <div className={arrowBaseClasses} style={getArrowStyle(placement)} />
            {/* محتوای تولتیپ */}
            <div className="relative z-10">{content}</div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
export type { ITooltipLogic, ITooltipProps };