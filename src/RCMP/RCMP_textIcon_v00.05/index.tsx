import type { ReactNode, CSSProperties } from 'react'

interface IlogicProps {
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'pre'
  text?: string
  icon?: ReactNode
  direction?: 'vertical' | 'horizontal'
  iconPosition?: 'after' | 'before'
  type?: 'headline' | 'lable' | 'body'
  typographySize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  color?: string // اختیاری برای کنترل رنگ
}

interface ITextIconProps {
  meta?: any
  geo?: any
  logic: IlogicProps
  style?: CSSProperties
}

const typographyClasses: Record<string, string> = {
  'headline-2xl': 'text-[56px] leading-[84px] font-bold',
  'headline-xl': 'text-[48px] leading-[72px] font-bold',
  'headline-lg': 'text-[40px] leading-[60px] font-bold',
  'headline-md': 'text-[32px] leading-[56px] font-bold',
  'headline-sm': 'text-[28px] leading-[42px] font-bold',
  'headline-xs': 'text-[24px] leading-[36px] font-bold',

  'label-lg': 'text-[22px] leading-[36px] font-semibold',
  'label-xl': 'text-[20px] leading-[32px] font-semibold',
  'label-md': 'text-[18px] leading-[28px] font-semibold',
  'label-sm': 'text-[16px] leading-[26px] font-semibold',
  'label-xs': 'text-[14px] leading-[22px] font-semibold',
  'label-2xs': 'text-[12px] leading-[20px] font-semibold',

  'body-xl': 'text-[18px] leading-[28px] font-normal',
  'body-lg': 'text-[16px] leading-[26px] font-normal',
  'body-md': 'text-[14px] leading-[22px] font-normal',
  'body-sm': 'text-[12px] leading-[20px] font-normal',
  'body-xs': 'text-[10px] leading-[16px] font-normal',
}

function TextIcon({ meta, geo, logic, style = {} }: ITextIconProps) {
  const {
    element: Element = 'span',
    text,
    icon,
    direction = 'horizontal',
    iconPosition = 'before',
    type = 'body',
    typographySize = 'md',
    className = '',
    color = '',
  } = logic

  const key = `${type}-${typographySize}` as keyof typeof typographyClasses
  const baseTypographyClass = typographyClasses[key] || ''
  const combinedClassName = [baseTypographyClass, color, className]
    .filter(Boolean)
    .join(' ')
    .trim()

  // اگر آیکون وجود نداشته باشد، فقط متن برگردان
  if (!icon) {
    return (
      <div className={combinedClassName} style={style}>
        <Element>{text}</Element>
      </div>
    )
  }

  // چینش بر اساس direction
  const flexDirection = direction === 'vertical' ? 'flex-col' : 'flex-row items-center'
  const gap = direction === 'vertical' ? 'gap-1' : 'gap-2'

  // ترتیب آیکون و متن
  const content =
    iconPosition === 'before' ? (
      <>
        {icon}
        {text && <span>{text}</span>}
      </>
    ) : (
      <>
        {text && <span>{text}</span>}
        {icon}
      </>
    )

  return (
    <div className={`inline-flex ${flexDirection} ${gap} ${combinedClassName}`} style={style}>
      <Element className="inline-flex items-center gap-2">
        {content}
      </Element>
    </div>
  )
}

export default TextIcon