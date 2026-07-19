/*------------------------------------------------------------
Meta Data

ID:             RCOM_badge
Title:          Badge Component - Professional v1.0
Version:        01.00.00
VAR:            01

last-update:    D2026.07.18
owner:          apps68

Description:    Professional badge component with multiple variants,
                sizes, colors, icons, dot mode, pulsing animation,
                closeable, clickable, and counter capabilities.
------------------------------------------------------------*/

/**************************************
 * Step 01 import dependencies
 **************************************/

import React, { memo, useMemo, useCallback } from 'react'
import { CloseCircle } from 'iconsax-react'

/**************************************
 * Step 02 - define interfaces
 **************************************/

interface IMetaProps {
  id?: string
  title?: string
  version?: string
  lastUpgrade?: string
  owner?: string
  type?: string
  origin_model?: string
  origin_model_Ver?: string
  rem?: string
}

interface IGeoProps {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
}

type BadgeVariant = 'fill' | 'outline' | 'ghost'
type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'
type BadgeShape = 'rounded' | 'pill' | 'square'

interface ILogicProps {
  /** Visual style of the badge */
  variant?: BadgeVariant
  /** Color scheme */
  color?: BadgeColor
  /** Size preset */
  size?: BadgeSize
  /** Corner shape */
  shape?: BadgeShape
  /** Optional icon (React node) */
  icon?: React.ReactNode
  /** Icon placement relative to text */
  iconPosition?: 'left' | 'right'
  /** Numerical value to display (overrides children) */
  count?: number
  /** Max number before showing "+" (e.g. 99+) */
  maxCount?: number
  /** Render as a small dot (no text/icon) */
  dot?: boolean
  /** Enable pulsing animation */
  pulsate?: boolean
  /** Show close button */
  closable?: boolean
  /** Callback when close button is clicked */
  onClose?: () => void
  /** Click handler for the entire badge */
  onClick?: () => void
  /** Disabled state */
  disabled?: boolean
  /** Text content (ignored if count is provided) */
  children?: React.ReactNode
  /** Tooltip text */
  title?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

interface IStyleProps {
  /** Additional CSS classes for the root element */
  className?: string
}

interface IBadgeProps {
  meta?: IMetaProps
  geo?: IGeoProps
  logic?: ILogicProps
  style?: IStyleProps
}

/**************************************
 * Step 03 - main component
 **************************************/

const Badge = memo(function Badge ({ meta, geo, logic, style }: IBadgeProps) {
  const {
    variant = 'fill',
    color = 'neutral',
    size = 'md',
    shape = 'rounded',
    icon,
    iconPosition = 'left',
    count,
    maxCount = 99,
    dot = false,
    pulsate = false,
    closable = false,
    onClose,
    onClick,
    disabled = false,
    children,
    title,
    style: inlineStyle
  } = logic || {}

  const { className: customClassName } = style || {}
  const { width, height, maxWidth, maxHeight } = geo || {}

  // --- Color mapping (Tailwind classes) ---
  const colorMap = useMemo(() => {
    const base = {
      primary: {
        bg: 'bg-primary',
        text: 'text-white stroke-white',
        border: 'border-pri-500',
        hover: 'hover:bg-primary-hover',
        ghostText: 'text-primrary-text stroke-primary-text',
        outlineText: 'text-primrary-text stroke-primary-text',
        outlineBorder: 'border-primary-border',
        ghostHover: 'hover:bg-primary-hover',
        dot: 'bg-primary'
      },
      secondary: {
        bg: 'bg-secondary',
        text: 'text-secondary-text stroke-secondary-text',
        border: 'border-secondary-border',
        hover: 'hover:bg-secondary-hover',
        ghostText: 'text-secondary-text stroke-secondary-text',
        outlineText: 'text-secondary-bg stroke-secondary-bg',
        outlineBorder: 'border-secondary-border',
        ghostHover: 'hover:bg-secondary-hover',
        dot: 'bg-purple-500'
      },
      success: {
        bg: 'bg-success',
        text: 'text-success-text stroke-success-text',
        border: 'border-success-border',

        hover: 'hover:bg-success-hover',

        ghostText: 'text-success-text stroke-success-text',
        ghostHover: 'hover:bg-success-selected',

        outlineText: 'text-success-bg stroke-success-bg',
        outlineBorder: 'border-success-border',

        dot: 'bg-success'
      },
      warning: {
        bg: 'bg-warning',
        text: 'text-warning-text stroke-warning-text',
        border: 'border-warning-border',
        hover: 'hover:bg-warning-hover',
        ghostText: 'text-warning-text stroke-warning-text',
        outlineText: 'text-warning-text stroke-warning-text',
        outlineBorder: 'border-warning-border',
        ghostHover: 'hover:bg-warning-hover',
        dot: 'bg-warning'
      },
      danger: {
        bg: 'bg-danger',
        text: 'text-danger-text stroke-danger-text',
        border: 'border-danger-border',
        hover: 'hover:bg-danger-600',
        ghostText: 'text-danger/80',
        outlineText: 'text-danger',
        outlineBorder: 'border-danger-border',
        ghostHover: 'hover:bg-danger-hover',
        dot: 'bg-danger'
      },
      info: {
        bg: 'bg-info',
        text: 'text-info-text stroke-info-text',
        border: 'border-info-border',
        hover: 'hover:bg-info-hover',
        ghostText: 'text-info-text stroke-info-text',
        outlineText: 'text-info-text stroke-info-text',
        outlineBorder: 'border-info-border',
        ghostHover: 'hover:bg-info-hover',
        dot: 'bg-info'
      },
      neutral: {
        bg: 'bg-neutral',
        text: 'text-neutral-text stroke-neutral-text',
        border: 'border-neutral-border',
        hover: 'hover:bg-neutral-hover',
        ghostText: 'text-neutral-text stroke-neutral-text',
        outlineText: 'text-neutral-text stroke-neutral-text',
        outlineBorder: 'border-neutral-border',
        ghostHover: 'hover:bg-neutral-hover',
        dot: 'bg-neutral'
      }
    }
    return base
  }, [])

  // --- Size mapping ---
  const sizeMap = useMemo(() => {
    return {
      xs: {
        text: 'text-xs',
        px: 'px-1.5',
        py: 'py-0.5',
        gap: 'gap-1',
        iconSize: 12,
        closeSize: 12,
        dotSize: 'h-1.5 w-1.5',
        minH: 'min-h-4'
      },
      sm: {
        text: 'text-sm',
        px: 'px-2',
        py: 'py-1',
        gap: 'gap-1.5',
        iconSize: 14,
        closeSize: 14,
        dotSize: 'h-2 w-2',
        minH: 'min-h-5'
      },
      md: {
        text: 'text-base',
        px: 'px-3',
        py: 'py-1.5',
        gap: 'gap-2',
        iconSize: 16,
        closeSize: 16,
        dotSize: 'h-2.5 w-2.5',
        minH: 'min-h-6'
      },
      lg: {
        text: 'text-lg',
        px: 'px-4',
        py: 'py-2',
        gap: 'gap-2.5',
        iconSize: 20,
        closeSize: 20,
        dotSize: 'h-3 w-3',
        minH: 'min-h-8'
      }
    }
  }, [])

  // --- Shape mapping ---
  const shapeMap = useMemo(() => {
    return {
      rounded: 'rounded-md',
      pill: 'rounded-full',
      square: 'rounded-none'
    }
  }, [])

  // --- Compute displayed content ---
  const displayCount = useMemo(() => {
    if (count === undefined || count === null) return null
    if (count > maxCount) return `${maxCount}+`
    return String(count)
  }, [count, maxCount])

  const content = useMemo(() => {
    if (dot) return null
    if (displayCount !== null) return displayCount
    return children
  }, [dot, displayCount, children])

  // --- Build class names ---
  const colorClasses = useMemo(() => {
    const c = colorMap[color] || colorMap.neutral
    switch (variant) {
      case 'fill':
        return `${c.bg} ${c.text} ${c.hover} border-transparent`
      case 'outline':
        return `bg-transparent ${c.outlineText} border ${c.outlineBorder} hover:${c.bg} hover:${c.text} hover:border-transparent`
      case 'ghost':
        return `bg-transparent ${c.ghostText} border-transparent ${c.ghostHover}`
      default:
        return `${c.bg} ${c.text}`
    }
  }, [color, colorMap, variant])

  const sizeClasses = useMemo(() => {
    const s = sizeMap[size] || sizeMap.md
    return `${s.text} ${s.px} ${s.py} ${s.gap} ${s.minH}`
  }, [size, sizeMap])

  const shapeClasses = useMemo(() => {
    if (dot) return 'rounded-full'
    return shapeMap[shape] || shapeMap.rounded
  }, [dot, shape, shapeMap])

  const dotSizeClass = useMemo(() => {
    if (!dot) return ''
    return sizeMap[size]?.dotSize || 'h-2 w-2'
  }, [dot, size, sizeMap])

  const pulsateClass = useMemo(() => {
    return pulsate ? 'animate-pulse' : ''
  }, [pulsate])

  const clickableClass = useMemo(() => {
    if (onClick && !disabled)
      return 'cursor-pointer hover:shadow-sm active:scale-95 transition-all'
    return ''
  }, [onClick, disabled])

  const disabledClass = useMemo(() => {
    return disabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none select-none'
      : ''
  }, [disabled])

  const closeButtonSize = useMemo(() => {
    return sizeMap[size]?.closeSize || 16
  }, [size, sizeMap])

  // --- Handlers ---
  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onClose?.()
    },
    [onClose]
  )

  const handleClick = useCallback(() => {
    if (!disabled && onClick) onClick()
  }, [disabled, onClick])

  // --- Render icon (fixed type issue) ---
  const renderIcon = useCallback(() => {
    if (!icon || dot) return null
    const iconSize = sizeMap[size]?.iconSize || 16
    // Clone icon and preserve its existing className
    const existingClassName = (icon as any)?.props?.className || ''
    return React.cloneElement(icon as any, {
      size: iconSize,
      className: `shrink-0 ${existingClassName}`.trim()
    })
  }, [icon, dot, size, sizeMap])

  // --- Render close button ---
  const renderClose = useCallback(() => {
    if (!closable || disabled) return null
    return (
      <button
        type='button'
        onClick={handleClose}
        className='ml-0.5 -mr-1.5 flex shrink-0 items-center justify-center rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors'
        aria-label='Remove'
      >
        <CloseCircle
          size={closeButtonSize}
          variant='Bold'
          className='stroke-current opacity-70 hover:opacity-100'
        />
      </button>
    )
  }, [closable, disabled, handleClose, closeButtonSize])

  // --- Combine classes ---
  const rootClassName = useMemo(() => {
    const classes = [
      'inline-flex items-center justify-center',
      'font-medium',
      'transition-all duration-200',
      colorClasses,
      sizeClasses,
      shapeClasses,
      pulsateClass,
      clickableClass,
      disabledClass,
      customClassName
    ]
      .filter(Boolean)
      .join(' ')
    return classes
  }, [
    colorClasses,
    sizeClasses,
    shapeClasses,
    pulsateClass,
    clickableClass,
    disabledClass,
    customClassName
  ])

  // --- If dot mode, render simple dot ---
  if (dot) {
    return (
      <span
        className={`inline-block ${dotSizeClass} ${
          colorMap[color]?.dot || 'bg-gray-500'
        } rounded-full ${pulsateClass} ${disabledClass}`}
        title={title}
        style={{ width, height, maxWidth, maxHeight, ...inlineStyle }}
      />
    )
  }

  // --- Main render ---
  return (
    <span
      className={rootClassName}
      onClick={handleClick}
      title={title}
      style={{ width, height, maxWidth, maxHeight, ...inlineStyle }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {iconPosition === 'left' && renderIcon()}
      <span className='truncate leading-none'>{content}</span>
      {iconPosition === 'right' && renderIcon()}
      {renderClose()}
    </span>
  )
})

Badge.displayName = 'Badge'

export default Badge
