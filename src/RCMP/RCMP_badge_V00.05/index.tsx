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

  // --- Color mapping (Tailwind default classes) ---
  const colorMap = useMemo(() => {
    const base = {
      primary: {
        bg: 'bg-cyan-600 dark:bg-orange-600',
        text: 'text-white dark:text-white',
        border: 'border-cyan-600 dark:border-orange-600',
        hover: 'hover:bg-cyan-700 dark:hover:bg-orange-700',
        ghostText: 'text-cyan-600 dark:text-orange-600',
        outlineText: 'text-cyan-600 dark:text-orange-600',
        outlineBorder: 'border-cyan-600 dark:border-orange-600',
        ghostHover: 'hover:bg-cyan-50 dark:hover:bg-cyan-950',
        dot: 'bg-cyan-600'
      },
      secondary: {
        bg: 'bg-purple-600',
        text: 'text-white',
        border: 'border-purple-600',
        hover: 'hover:bg-purple-700',
        ghostText: 'text-purple-600',
        outlineText: 'text-purple-600',
        outlineBorder: 'border-purple-600',
        ghostHover: 'hover:bg-purple-50 dark:hover:bg-purple-950',
        dot: 'bg-purple-600'
      },
      success: {
        bg: 'bg-green-600',
        text: 'text-white',
        border: 'border-green-600',
        hover: 'hover:bg-green-700',
        ghostText: 'text-green-600',
        ghostHover: 'hover:bg-green-50 dark:hover:bg-green-950',
        outlineText: 'text-green-600',
        outlineBorder: 'border-green-600',
        dot: 'bg-green-600'
      },
      warning: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-950',
        border: 'border-yellow-500',
        hover: 'hover:bg-yellow-600',
        ghostText: 'text-yellow-600',
        outlineText: 'text-yellow-600',
        outlineBorder: 'border-yellow-500',
        ghostHover: 'hover:bg-yellow-50 dark:hover:bg-yellow-950',
        dot: 'bg-yellow-500'
      },
      danger: {
        bg: 'bg-red-600',
        text: 'text-white',
        border: 'border-red-600',
        hover: 'hover:bg-red-700',
        ghostText: 'text-red-600',
        outlineText: 'text-red-600',
        outlineBorder: 'border-red-600',
        ghostHover: 'hover:bg-red-50 dark:hover:bg-red-950',
        dot: 'bg-red-600'
      },
      info: {
        bg: 'bg-light_blue-600',
        text: 'text-white',
        border: 'border-light_blue-600',
        hover: 'hover:bg-light_blue-700',
        ghostText: 'text-light_blue-600',
        outlineText: 'text-light_blue-600',
        outlineBorder: 'border-light_blue-600',
        ghostHover: 'hover:bg-light_blue-50 dark:hover:bg-light_blue-950',
        dot: 'bg-light_blue-600'
      },
      neutral: {
        bg: 'bg-gray-500',
        text: 'text-white',
        border: 'border-gray-500',
        hover: 'hover:bg-gray-600',
        ghostText: 'text-gray-600',
        outlineText: 'text-gray-600',
        outlineBorder: 'border-gray-500',
        ghostHover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
        dot: 'bg-gray-500'
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