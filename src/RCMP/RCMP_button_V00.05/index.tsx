import { Link } from 'react-router-dom'
import { type ReactNode } from 'react'
import TextIcon from '../RCMP_textIcon_v00.05'

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
  const badgePositionClasses: Record <'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' , string > = {
  'top-right': '-top-2 -right-2',
  'top-left': '-top-2 -left-2',
  'bottom-right': '-bottom-2 -right-2',
  'bottom-left': '-bottom-2 -left-2'
}

function getBadgeClasses (
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right'
): string {
  return [
    'absolute min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-xs font-semibold bg-primary text-primary-active-text',
    badgePositionClasses[position]
  ].join(' ')
}

const variantClasses: Record<ButtonVariant, string> = {
  fill: 'border border-primary-border hover:bg-primary-hover-bg hover:border-primary-border hover:text-primary-active-text bg-primary border-primary-border text-primary-active-text  focus:ring-primary-ring disabled:bg-primary-disabled-bg disabled:border-primary-disabled-border disabled:text-primary-disabled-text',
  secondary:
    'bg-info text-info-text hover:bg-info-bg active:bg-info-active-bg focus:ring-info-ring disabled:bg-info-disabled-bg disabled:text-info-disabled-text',
  outline:
    'border border-primary-border text-primary-text hover:border-primary-hover-border hover:text-primary-hover-border active:border-primary-active-border active:text-primary-active-text  disabled:border-primary-disabled-border disabled:text-primary-disabled-text',
  text: ' text-primary-text hover:text-primary-hover-text  active:text-primary-active-text  disabled:text-primary-disabled-text',
  default:
    'border border-neutral-border text-neutral-text active:bg-neutral-active-bg active:text-neutral-active-text active:border-neutral-active-border hover:bg-neutral-active-bg hover:border-neutral-active-border hover:text-neutral-active-text'
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

// badge classes
const badgeClasses =
  'absolute -top-2 -right-2 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-xs font-semibold bg-primary text-primary-active-text pointer-events-none'

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
    badgePosition = 'top-right' // <-- جدید
  } = logic || {}

  const isDisabled = state === 'disabled'
  const className = getButtonClasses({ variant, size, state, fullWidth })

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

  const badgeElement =
    badge !== undefined && badge !== null ? (
      <span className={getBadgeClasses(badgePosition)}>
        {badge > 99 ? '99+' : badge}
      </span>
    ) : null

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
