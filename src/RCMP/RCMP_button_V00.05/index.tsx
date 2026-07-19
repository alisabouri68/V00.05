import { Link } from 'react-router-dom'
import { type ReactNode } from 'react'
import TextIcon from '../RCMP_textIcon_v00.05'
import Badge from 'RCMP/RCMP_badge_V00.05'

// ====================== Types ======================

type ButtonVariant = 'fill' | 'secondary' | 'outline' | 'text' | 'default'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' // 32, 40, 48, 56
type ButtonState = 'normal' | 'hover' | 'active' | 'disabled' | 'loading'

interface IButtonLogic {
  to?: string
  href?: string
  content?: ReactNode
  icon?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  state?: ButtonState
  type?: 'headline' | 'lable' | 'body'
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  className?: string
  badge?: number | null
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** تنظیمات اضافی برای Badge (مانند pulsate، variant و غیره) */
  badgeProps?: Omit<React.ComponentProps<typeof Badge>['logic'], 'count' | 'size'>
  /** رنگ Badge (اگر تنظیم شود، بر رنگ پیش‌فرض و badgeProps.color اولویت دارد) */
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

interface IButtonProps {
  meta?: any
  geo?: any
  logic?: IButtonLogic
  style?: React.CSSProperties
}

// ====================== کلاس‌های دکمه ======================

const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-md '

const badgePositionClasses: Record<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left', string> = {
  'top-right': '-top-2 -right-2',
  'top-left': '-top-2 -left-2',
  'bottom-right': '-bottom-2 -right-2',
  'bottom-left': '-bottom-2 -left-2'
}

// تابع کمکی برای تبدیل سایز دکمه به سایز Badge
function mapButtonSizeToBadgeSize(buttonSize: ButtonSize): 'xs' | 'sm' | 'md' | 'lg' {
  const map: Record<ButtonSize, 'xs' | 'sm' | 'md' | 'lg'> = {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'lg'
  }
  return map[buttonSize] || 'md'
}

// تابع کمکی برای انتخاب رنگ Badge بر اساس variant دکمه (پیش‌فرض)
function getBadgeColorFromVariant(variant: ButtonVariant): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  const map: Record<ButtonVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    fill: 'primary',
    secondary: 'info',
    outline: 'primary',
    text: 'neutral',
    default: 'primary'
  }
  return map[variant] || 'primary'
}

const variantClasses: Record<ButtonVariant, string> = {
  fill: 'border border-primary-border hover:bg-primary-hover-bg hover:border-primary-border hover:text-primary-active-text bg-primary border-primary-border text-primary-active-text  focus:ring-primary-ring disabled:bg-primary-disabled-bg disabled:border-primary-disabled-border disabled:text-primary-disabled-text',
  secondary:
    'bg-info text-info-text hover:bg-info-bg active:bg-info-active-bg focus:ring-info-ring disabled:bg-info-disabled-bg disabled:text-info-disabled-text',
  outline:
    'border border-primary-border text-primary-text hover:border-primary-hover-border hover:text-primary-hover-border active:border-primary-active-border active:text-primary-active-text  disabled:border-primary-disabled-border disabled:text-primary-disabled-text',
  text: ' text-primary-text hover:text-primary-hover-text  active:text-primary-active-text  disabled:text-primary-disabled-text',
  default:
    'border border-neutral-border text-neutral-text stroke-neutral-text active:bg-neutral-active-bg active:text-neutral-active-text active:border-neutral-active-border hover:bg-neutral-active-bg hover:border-neutral-active-border hover:text-neutral-active-text disabled:border-neutral-disabled-border disabled:text-neutral-disabled-text disabled:stroke-neutral-disabled-text disabled:bg-neutral-disabled-bg'
}

const stateClasses: Record<ButtonState, string> = {
  normal: '',
  hover: 'hover:brightness-95',
  active: 'active:scale-95',
  disabled: 'cursor-not-allowed pointer-events-none',
  loading: ''
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'w-6 h-6',
  sm: 'px-2 h-8',
  md: 'px-4 h-10',
  lg: 'px-5 h-12',
  xl: 'px-6 h-14'
}

const fullWidthClass = 'w-full'

// ====================== تابع ترکیب کلاس‌ها ======================

function getButtonClasses ({
  variant = 'fill',
  size = 'md',
  state = 'normal',
  fullWidth = false
}: Required<
  Pick<IButtonLogic, 'variant' | 'size' | 'state' | 'fullWidth'>
>): string {
  return [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses[state],
    fullWidth ? fullWidthClass : ''
  ]
    .filter(Boolean)
    .join(' ')
}

// ====================== کامپوننت اصلی ======================

function Button ({ meta, geo, logic, style }: IButtonProps) {
  const {
    to,
    href,
    content,
    icon,
    variant = 'fill',
    size = 'md',
    fullWidth = false,
    type = 'body',
    state = 'normal',
    onClick,
    className: customClassName,
    badge,
    badgePosition = 'top-right',
    badgeProps = {},
    badgeColor: customBadgeColor // <-- رنگ سفارشی Badge از بیرون
  } = logic || {}

  const isDisabled = state === 'disabled'
  const className = getButtonClasses({ variant, size, state, fullWidth })

  // تعیین سایز Badge بر اساس سایز دکمه
  const badgeSize = mapButtonSizeToBadgeSize(size)

  // تعیین رنگ نهایی Badge: اولویت با رنگ سفارشی است، در غیر این صورت از variant استخراج می‌شود
  const finalBadgeColor = customBadgeColor || getBadgeColorFromVariant(variant)

  // ساخت المان Badge
  const badgeElement =
    badge !== undefined && badge !== null ? (
      <div className={`absolute ${badgePositionClasses[badgePosition]} pointer-events-none`}>
        <Badge
          logic={{
            count: badge,
            size: badgeSize,
            color: finalBadgeColor, // <-- استفاده از رنگ نهایی
            shape: 'pill',
            variant: 'fill',
            ...badgeProps // props اضافی (می‌توانند color را override کنند)
          }}
        />
      </div>
    ) : null

  const renderContent = () => {
    if (!content && !icon) return null

    if (typeof content === 'string') {
      const combinedClassName = `inline-flex items-center justify-center  ${
        sizeClasses[size]
      } ${customClassName || ''}`.trim()

      return (
        <TextIcon
          logic={{
            text: content,
            icon: icon,
            type: type,
            className: combinedClassName,
            typographySize:
              size === 'sm'
                ? 'md'
                : size === 'md'
                ? 'lg'
                : size === 'lg'
                ? 'lg'
                : '2xl'
          }}
        />
      )
    }

    return (
      <>
        {icon && <span className=''>{icon}</span>}
        {content}
      </>
    )
  }

  const children = (
    <>
      {renderContent()}
      {state === 'loading' && (
        <span className='ml-2'>
          <svg className='animate-spin h-4 w-4 text-current bg-neutral pointer-events-none' />
        </span>
      )}
    </>
  )

  // رندر نهایی با استفاده از Link, a یا button
  if (to) {
    return (
      <span className='relative inline-flex'>
        <Link to={to} className={className} style={style} onClick={onClick}>
          {children}
        </Link>
        {badgeElement}
      </span>
    )
  }

  if (href) {
    return (
      <span className='relative inline-flex '>
        <a
          href={href}
          className={className}
          style={style}
          target='_blank'
          rel='noopener noreferrer'
          onClick={onClick}
        >
          {children}
        </a>
        {badgeElement}
      </span>
    )
  }

  return (
    <span className='relative inline-flex '>
      <button
        className={className}
        style={style}
        disabled={isDisabled}
        type='button'
        onClick={onClick}
      >
        {children}
      </button>
      {badgeElement}
    </span>
  )
}

export default Button