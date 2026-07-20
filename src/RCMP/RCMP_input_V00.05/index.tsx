// Input.tsx
import React, {
  forwardRef,
  useState,
  useCallback,
  useImperativeHandle,
  useRef,
  useMemo,
  useId,
  ChangeEvent,
  FocusEvent,
  ReactNode
} from 'react'

// ====================== Types ======================

export type InputVariant =
  | 'fill'
  | 'outline'
  | 'underline'
  | 'ghost'
  | 'white'  
  | 'gray'   
export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type InputState =
  | 'normal'
  | 'hover'
  | 'focus'
  | 'disabled'
  | 'error'
  | 'success'
export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'file'
  | 'checkbox'
  | 'radio'

export interface SelectOption {
  value: string | number
  label: ReactNode
  disabled?: boolean
}

export interface IInputLogic {
  /** نوع ورودی */
  type?: InputType
  /** مقدار ورودی (کنترل‌شده) */
  value?: string | number | readonly string[] | boolean
  /** مقدار پیش‌فرض (غیرکنترل‌شده) */
  defaultValue?: string | number | readonly string[] | boolean
  /** تغییردهنده مقدار */
  onChange?: (
    value: any,
    event?: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  /** رویداد blur */
  onBlur?: (
    event: FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  /** رویداد focus */
  onFocus?: (
    event: FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  /** placeholder */
  placeholder?: string
  /** برچسب */
  label?: ReactNode
  /** متن راهنما */
  hint?: ReactNode
  /** پیام خطا (اگر ست شود، بر خطای validate داخلی اولویت دارد) */
  error?: ReactNode
  /** وضعیت (برای استایل) */
  state?: InputState
  /** اندازه ظاهری کامپوننت */
  size?: InputSize
  /** نوع ظاهری */
  variant?: InputVariant
  /** تمام عرض را بگیرد */
  fullWidth?: boolean
  /** غیرفعال */
  disabled?: boolean
  /** در حال بارگذاری (نمایش اسپینر، غیرفعال‌سازی تعامل) */
  loading?: boolean
  /** فقط خواندنی */
  readOnly?: boolean
  /** اجباری */
  required?: boolean
  /** جهت متن؛ پیش‌فرض خودکار بر اساس نوع فیلد نیست، صراحتاً ست کنید */
  dir?: 'rtl' | 'ltr' | 'auto'
  /** نام فیلد */
  name?: string
  /** id (در صورت عدم ارسال، به‌صورت خودکار و پایدار تولید می‌شود) */
  id?: string
  /** آیکون سمت شروع (start) */
  icon?: ReactNode
  /** پیشوند متنی/المان سمت شروع */
  prefix?: ReactNode
  /** پسوند سمت پایان — برخلاف icon/prefix که تزئینی‌اند، suffix کلیک‌پذیر است (مثلاً دکمهٔ پاک‌کردن یا نمایش رمز) */
  suffix?: ReactNode
  /** کلاس‌های اضافی برای کانتینر */
  className?: string
  /** کلاس‌های اضافی برای input */
  inputClassName?: string
  /** کلاس‌های اضافی برای label */
  labelClassName?: string
  /** کلاس‌های اضافی برای hint/error */
  helperClassName?: string
  /** حداقل طول (برای validation) */
  minLength?: number
  /** حداکثر طول */
  maxLength?: number
  /** نمایش شمارنده کاراکتر (نیازمند maxLength) */
  showCharCount?: boolean
  /** الگوی regex */
  pattern?: string
  /** حداقل مقدار (برای number) */
  min?: number
  /** حداکثر مقدار (برای number) */
  max?: number
  /** گام (step) برای number */
  step?: number
  /** ردیف‌های textarea */
  rows?: number
  /** گزینه‌های select */
  options?: SelectOption[]
  /** چند انتخابی برای select */
  multiple?: boolean
  /** تعداد ردیف نمایشی select (متفاوت از size ظاهری کامپوننت) */
  selectVisibleRows?: number
  /** پذیرش فایل (برای file) */
  accept?: string
  /** چند فایل (برای file) */
  multipleFiles?: boolean
  /** max file size (bytes) — در validate پیش‌فرض فایل بررسی می‌شود */
  maxFileSize?: number
  /** تابع اعتبارسنجی سفارشی؛ رشته یعنی خطا، null/undefined یعنی معتبر */
  validate?: (value: any) => string | null | undefined
  /** سایر ویژگی‌های استاندارد HTML (autoComplete، autoFocus، ...) */
  autoComplete?: string
  autoFocus?: boolean
}

export interface IInputProps {
  meta?: any
  geo?: any
  logic?: IInputLogic
  style?: React.CSSProperties
}

export interface IInputRef {
  focus: () => void
  blur: () => void
  reset: () => void
  validate: () => boolean
  getValue: () => any
  setValue: (value: any) => void
  /** دسترسی مستقیم به عنصر DOM زیرین (input/textarea/select) */
  getElement: () =>
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null
}

// ====================== کلاس‌های ثابت ======================

const baseInputClasses =
  'w-full rounded-md border bg-transparent text-gray-900 placeholder-gray-400 !outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 read-only:opacity-80 dark:text-gray-100 dark:placeholder-gray-500'

const variantClasses: Record<InputVariant, string> = {
  fill: 'bg-[#e9e9e9] border-gray-100 dark:bg-gray-800 dark:border-gray-800',
  outline: 'bg-transparent border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 dark:border-gray-600 dark:focus:border-orange-400 dark:focus:ring-orange-400/30',
  underline: 'border-b rounded-none border-gray-300 focus:border-cyan-500 focus:ring-0 dark:border-gray-600 dark:focus:border-orange-400',
  ghost: 'border-transparent bg-transparent focus:border-transparent focus:ring-0 hover:bg-gray-50 dark:hover:bg-gray-800/50',

  // --- وریشن‌های جدید ---
  white: 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600',
  gray: '!bg-[#E9E9E9] !border-gray-200 !dark:bg-gray-700 !dark:border-gray-600',  
};

const sizeClasses: Record<InputSize, string> = {
  xs: 'text-xs px-2 py-1 h-7',
  sm: 'text-sm px-3 py-1.5 h-8',
  md: 'text-base px-4 py-2 h-11',
  lg: 'text-lg px-5 py-2.5 h-13',
  xl: 'text-xl px-6 py-3 h-15'
}

// padding اضافه سمت شروع/پایان وقتی آیکون/پیشوند/پسوند وجود دارد
const startPaddingBySize: Record<InputSize, string> = {
  xs: 'ps-7',
  sm: 'ps-8',
  md: 'ps-10',
  lg: 'ps-11',
  xl: 'ps-12'
}

const endPaddingBySize: Record<InputSize, string> = {
  xs: 'pe-7',
  sm: 'pe-8',
  md: 'pe-10',
  lg: 'pe-11',
  xl: 'pe-12'
}

const stateClasses: Record<InputState, string> = {
  normal: '',
  hover: '',
  focus: '',
  disabled: '',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500/30 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400/30',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500/30 dark:border-green-400 dark:focus:border-green-400 dark:focus:ring-green-400/30'
}

// چک‌باکس/رادیو: خودِ input واقعی به‌صورت نامرئی روی یک باکس بصری قرار می‌گیرد.
// رنگ حالت تیک‌خورده با ترکیب «peer-checked:bg-current» + «text-{state}» ساخته می‌شود —
// این دو، کلاس‌های عمومی و همیشه‌موجود Tailwind هستند (نه یک ترکیب variant+رنگ سفارشی مثل
// checked:bg-primary که ممکن است در برخی تنظیمات build اصلاً ساخته نشود)، پس قابل‌اعتمادتر است.
const checkableHiddenInputClasses =
  'peer absolute inset-0 h-full w-full cursor-pointer opacity-0'

const checkableSizeClasses: Record<InputSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-5.5 w-5.5',
  xl: 'h-6 w-6'
}

// اندازه آیکون تیک/دایره داخلی (کمی کوچک‌تر از باکس)
const checkableIconSizeClasses: Record<InputSize, string> = {
  xs: 'h-2 w-2',
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
  xl: 'h-4 w-4'
}

const checkableDotSizeClasses: Record<InputSize, string> = {
  xs: 'h-1 w-1',
  sm: 'h-1.5 w-1.5',
  md: 'h-1.5 w-1.5',
  lg: 'h-2 w-2',
  xl: 'h-2.5 w-2.5'
}

function getCheckableVisualClasses ({
  size,
  state,
  type,
  disabledOrLoading,
  className
}: {
  size: InputSize
  state: InputState
  type: 'checkbox' | 'radio'
  disabledOrLoading: boolean
  className: string
}): string {
  const colorClasses =
    state === 'error'
      ? 'border-red-500 text-red-500 peer-focus-visible:ring-red-500/30 dark:border-red-400 dark:text-red-400 dark:peer-focus-visible:ring-red-400/30'
      : state === 'success'
      ? 'border-green-500 text-green-500 peer-focus-visible:ring-green-500/30 dark:border-green-400 dark:text-green-400 dark:peer-focus-visible:ring-green-400/30'
      : 'border-gray-300 text-cyan-500 peer-focus-visible:ring-cyan-500/30 dark:border-gray-500 dark:text-orange-400 dark:peer-focus-visible:ring-orange-400/30'

  return cx(
    'flex shrink-0 items-center justify-center rounded border bg-transparent transition-colors duration-150',
    checkableSizeClasses[size],
    type === 'radio' && 'rounded-full',
    colorClasses,
    'peer-checked:bg-current peer-checked:border-current',
    'hover:border-gray-400 dark:hover:border-gray-400 peer-focus-visible:ring-2',
    disabledOrLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    className
  )
}

const labelClasses = 'block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-200'
const helperTextClasses =
  'mt-1.5 text-sm flex items-center justify-between gap-2'
const errorTextClasses = 'text-red-500 dark:text-red-400'
const successTextClasses = 'text-green-500 dark:text-green-400'
const hintTextClasses = 'text-gray-500/70 dark:text-gray-400/70'

// ====================== توابع کمکی ======================

function cx (...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

function getInputClasses ({
  variant,
  size,
  state,
  fullWidth,
  hasStartAdornment,
  hasEndAdornment,
  className
}: {
  variant: InputVariant
  size: InputSize
  state: InputState
  fullWidth: boolean
  hasStartAdornment: boolean
  hasEndAdornment: boolean
  className: string
}): string {
  return cx(
    baseInputClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses[state],
    fullWidth && 'w-full',
    hasStartAdornment && startPaddingBySize[size],
    hasEndAdornment && endPaddingBySize[size],
    className
  )
}

function getDefaultInternalValue (type: InputType, defaultValue: any) {
  if (defaultValue !== undefined) return defaultValue
  if (type === 'checkbox' || type === 'radio') return false
  return ''
}

// ====================== زیرکامپوننت‌ها ======================

const FieldLabel: React.FC<{
  htmlFor: string
  required?: boolean
  className?: string
  children: ReactNode
}> = ({ htmlFor, required, className, children }) => (
  <label htmlFor={htmlFor} className={cx(labelClasses, className)}>
    {children}
    {required && (
      <span className='text-red-500 ms-1 dark:text-red-400' aria-hidden='true'>
        *
      </span>
    )}
  </label>
)

const HelperText: React.FC<{
  id: string
  hasError: boolean
  isSuccess: boolean
  text: ReactNode
  charCount?: { current: number; max: number }
  className?: string
}> = ({ id, hasError, isSuccess, text, charCount, className }) => {
  if (!text && !charCount) return null
  return (
    <div
      id={id}
      role={hasError ? 'alert' : undefined}
      className={cx(
        helperTextClasses,
        hasError
          ? errorTextClasses
          : isSuccess
          ? successTextClasses
          : hintTextClasses,
        className
      )}
    >
      <span>{text}</span>
      {charCount && (
        <span className='shrink-0 tabular-nums text-gray-400 dark:text-gray-500'>
          {charCount.current}/{charCount.max}
        </span>
      )}
    </div>
  )
}

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cx('animate-spin', className)}
    viewBox='0 0 24 24'
    fill='none'
    aria-hidden='true'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
    />
  </svg>
)

// تیک چک‌باکس — به‌صورت SVG خودمان رندر می‌شود، نه رندر native مرورگر،
// تا رنگ و شکل مستقل از پشتیبانی مرورگر از accent-color تضمین‌شده بماند.
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox='0 0 16 16' fill='none' className={className} aria-hidden='true'>
    <path
      d='M3 8.2L6.2 11.5L13 4.5'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

// ====================== کامپوننت اصلی ======================

const Input = forwardRef<IInputRef, IInputProps>(
  ({ meta, geo, logic, style }, ref) => {
    const {
      type = 'text',
      value: controlledValue,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      label,
      hint,
      error,
      state: propState = 'normal',
      size = 'md',
      variant = 'fill',
      fullWidth = false,
      disabled = false,
      loading = false,
      readOnly = false,
      required = false,
      dir,
      name,
      id: idProp,
      icon,
      prefix,
      suffix,
      className = '',
      inputClassName = '',
      labelClassName = '',
      helperClassName = '',
      minLength,
      maxLength,
      showCharCount = false,
      pattern,
      min,
      max,
      step,
      rows = 4,
      options = [],
      multiple = false,
      selectVisibleRows,
      accept,
      multipleFiles = false,
      maxFileSize,
      validate,
      autoComplete,
      autoFocus
    } = logic || {}

    // ===== شناسه‌های پایدار برای a11y (بدون نیاز به prop id) =====
    const generatedId = useId()
    const fieldId = idProp || name || generatedId
    const helperId = `${fieldId}-helper`

    // ===== State =====
    const [internalValue, setInternalValue] = useState<any>(() =>
      getDefaultInternalValue(type, defaultValue)
    )
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const inputRef = useRef<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(null)

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const setValue = useCallback(
      (newValue: any) => {
        if (!isControlled) setInternalValue(newValue)
      },
      [isControlled]
    )

    const runValidation = useCallback(
      (val: any) => {
        if (!validate) return null
        const err = validate(val) || null
        setErrorMessage(err)
        return err
      },
      [validate]
    )

    const handleChange = useCallback(
      (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        if (disabled || readOnly || loading) return

        let newValue: any
        const target = event.target

        if (type === 'checkbox') {
          newValue = (target as HTMLInputElement).checked
        } else if (type === 'radio') {
          newValue = (target as HTMLInputElement).value
        } else if (type === 'file') {
          const files = (target as HTMLInputElement).files
          newValue = multipleFiles ? files : files?.[0] || null
        } else if (type === 'select') {
          const selectEl = target as HTMLSelectElement
          newValue = multiple
            ? Array.from(selectEl.selectedOptions).map(opt => opt.value)
            : selectEl.value
        } else {
          newValue = target.value
        }

        setValue(newValue)
        onChange?.(newValue, event)
        runValidation(newValue)
      },
      [
        disabled,
        readOnly,
        loading,
        type,
        multipleFiles,
        multiple,
        setValue,
        onChange,
        runValidation
      ]
    )

    const handleBlur = useCallback(
      (
        event: FocusEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        runValidation(value)
        onBlur?.(event)
      },
      [runValidation, value, onBlur]
    )

    const handleFocus = useCallback(
      (
        event: FocusEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        onFocus?.(event)
      },
      [onFocus]
    )

    // ===== ref امری =====
    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        reset: () => {
          if (!isControlled)
            setInternalValue(getDefaultInternalValue(type, defaultValue))
          setErrorMessage(null)
        },
        validate: () => !runValidation(value),
        getValue: () => value,
        setValue: (val: any) => setValue(val),
        getElement: () => inputRef.current
      }),
      [isControlled, type, defaultValue, runValidation, value, setValue]
    )

    // ===== وضعیت نهایی =====
    const hasError = !!errorMessage || !!error
    const finalState: InputState = disabled
      ? 'disabled'
      : hasError
      ? 'error'
      : propState === 'success'
      ? 'success'
      : propState

    const hasStartAdornment = !!(icon || prefix)
    const hasEndAdornment = !!suffix || loading

    const inputClasses = useMemo(
      () =>
        getInputClasses({
          variant,
          size,
          state: finalState,
          fullWidth,
          hasStartAdornment,
          hasEndAdornment,
          className: inputClassName
        }),
      [
        variant,
        size,
        finalState,
        fullWidth,
        hasStartAdornment,
        hasEndAdornment,
        inputClassName
      ]
    )

    const checkableVisualClasses = useMemo(
      () =>
        getCheckableVisualClasses({
          size,
          state: finalState,
          type: type === 'radio' ? 'radio' : 'checkbox',
          disabledOrLoading: disabled || loading,
          className: inputClassName
        }),
      [size, finalState, type, disabled, loading, inputClassName]
    )

    const commonProps = {
      id: fieldId,
      name,
      placeholder,
      disabled: disabled || loading,
      readOnly,
      required,
      dir,
      autoComplete,
      autoFocus,
      className: inputClasses,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      style,
      'aria-invalid': hasError || undefined,
      'aria-describedby':
        hint || hasError || showCharCount ? helperId : undefined,
      'aria-required': required || undefined
    } as const

    // ===== رندر بدنه ورودی بر اساس نوع =====
    const renderInput = () => {
      switch (type) {
        case 'textarea':
          return (
            <textarea
              {...commonProps}
              ref={inputRef as any}
              value={value as string}
              rows={rows}
              maxLength={maxLength}
            />
          )

        case 'select':
          return (
            <select
              {...commonProps}
              ref={inputRef as any}
              value={value as string | string[]}
              multiple={multiple}
              size={selectVisibleRows}
            >
              {options.map(opt => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          )

        case 'file':
          return (
            <input
              {...commonProps}
              ref={inputRef as any}
              type='file'
              accept={accept}
              multiple={multipleFiles}
            />
          )

        case 'checkbox':
        case 'radio': {
          const isChecked = !!value
          return (
            <div className='inline-flex items-center gap-2'>
              <span
                className='relative inline-flex'
                style={{ width: 'fit-content' }}
              >
                <input
                  {...commonProps}
                  className={checkableHiddenInputClasses}
                  ref={inputRef as any}
                  type={type}
                  checked={isChecked}
                  value={type === 'radio' ? (value as string) : undefined}
                />
                {/* باکس بصری — رنگش با peer-checked:bg-current از روی رنگ input نامرئی تعیین می‌شود */}
                <span className={checkableVisualClasses}>
                  {isChecked &&
                    (type === 'radio' ? (
                      <span
                        className={cx(
                          'rounded-full bg-white',
                          checkableDotSizeClasses[size]
                        )}
                      />
                    ) : (
                      <CheckIcon
                        className={cx(
                          'text-white',
                          checkableIconSizeClasses[size]
                        )}
                      />
                    ))}
                </span>
              </span>
              {label && (
                <label
                  htmlFor={fieldId}
                  className={cx(
                    'text-sm text-gray-700 cursor-pointer select-none dark:text-gray-200',
                    labelClassName
                  )}
                >
                  {label}
                </label>
              )}
            </div>
          )
        }

        default:
          return (
            <input
              {...commonProps}
              ref={inputRef as any}
              type={type}
              value={value as string | number}
              minLength={minLength}
              maxLength={maxLength}
              pattern={pattern}
              min={min}
              max={max}
              step={step}
            />
          )
      }
    }

    const helperText = hasError ? errorMessage || error : hint
    const charCount =
      showCharCount && maxLength
        ? {
            current: typeof value === 'string' ? value.length : 0,
            max: maxLength
          }
        : undefined

    const isCheckable = type === 'checkbox' || type === 'radio'

    return (
      <div
        className={cx('relative', fullWidth && 'w-full', className)}
        dir={dir}
      >
        {label && !isCheckable && (
          <FieldLabel
            htmlFor={fieldId}
            required={required}
            className={labelClassName}
          >
            {label}
          </FieldLabel>
        )}

        {hasStartAdornment || hasEndAdornment ? (
          <div className='relative'>
            {icon && (
              <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-400 dark:text-gray-500'>
                {icon}
              </div>
            )}
            {!icon && prefix && (
              <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500 dark:text-gray-400'>
                {prefix}
              </div>
            )}
            {renderInput()}
            {loading ? (
              <div className='absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 dark:text-gray-500'>
                <Spinner className='h-4 w-4' />
              </div>
            ) : (
              suffix && (
                <div className='absolute inset-y-0 end-0 flex items-center pe-3 text-gray-500 dark:text-gray-400'>
                  {suffix}
                </div>
              )
            )}
          </div>
        ) : (
          renderInput()
        )}

        <HelperText
          id={helperId}
          hasError={hasError}
          isSuccess={finalState === 'success'}
          text={helperText}
          charCount={charCount}
          className={helperClassName}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
