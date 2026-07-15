import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import TextIcon from '../RCMP_textIcon_v00.05';

// ====================== Types ======================

type ButtonVariant = 'fill' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'; // 32, 40, 48, 56
type ButtonState = 'normal' | 'hover' | 'active' | 'disabled' | 'loading';

interface IButtonLogic {
  to?: string;
  href?: string;
  content?: ReactNode;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  state?: ButtonState;
  type?: 'headline' | 'lable' | 'body';
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}

interface IButtonProps {
  meta?: any;
  geo?: any;
  logic?: IButtonLogic;
  style?: React.CSSProperties;
}

// ====================== کلاس‌های دکمه ======================

const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200';

const variantClasses: Record<ButtonVariant, string> = {
  fill:
    "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 focus:ring-cyan-500 disabled:bg-gray-300 disabled:text-gray-500",
  secondary:
    "bg-cyan-200 text-cyan-700 hover:bg-cyan-300 active:bg-cyan-400 focus:ring-cyan-500 disabled:bg-gray-200 disabled:text-gray-400",
  outline:
    "border-2 border-cyan-600 text-cyan-600 disabled:border-gray-300 disabled:text-gray-400",
  text: "text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 active:text-cyan-800 active:bg-cyan-100 focus:ring-cyan-500 disabled:text-gray-400",
};

const stateClasses: Record<ButtonState, string> = {
  normal: '',
  hover: 'hover:brightness-95',
  active: 'active:scale-95',
  disabled: 'cursor-not-allowed pointer-events-none',
  loading: '',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 h-8',
  md: 'px-4 h-10',
  lg: 'px-5 h-12',
  xl: 'px-6 h-14',
};



const fullWidthClass = 'w-full';

// ====================== تابع ترکیب کلاس‌ها ======================

function getButtonClasses({
  variant = 'fill',
  size = 'md',
  state = 'normal',
  fullWidth = false,
}: Required<Pick<IButtonLogic, 'variant' | 'size' | 'state' | 'fullWidth'>>): string {
  return [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses[state],
    fullWidth ? fullWidthClass : '',
  ]
    .filter(Boolean)
    .join(' ');
}

// ====================== کامپوننت اصلی ======================

function Button({ meta, geo, logic, style }: IButtonProps) {
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
    className: customClassName, // کلاس‌های اضافی از بیرون
  } = logic || {};

  const isDisabled = state === 'disabled';

  // ====== کلاس‌های نهایی دکمه (قبل از هر استفاده‌ای) ======
  const className = getButtonClasses({ variant, size, state, fullWidth });

  const renderContent = () => {
  if (!content && !icon) return null;

  if (typeof content === 'string') {
    // اضافه کردن inline-flex items-center justify-center برای وسط‌چین کردن محتوا درون TextIcon
    const combinedClassName = `inline-flex items-center justify-center ${sizeClasses[size]} ${customClassName || ''}`.trim();

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
              : '2xl',
        }}
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


  const children = (
    <>
      {renderContent()}
      {state === 'loading' && (
        <span className="ml-2">
          <svg className="animate-spin h-4 w-4 text-current" />
        </span>
      )}
    </>
  );

  // ====== رندر نهایی با در نظر گرفتن نوع المان ======
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