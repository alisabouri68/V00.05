/*------------------------------------------------------------
Meta Data

ID:             RCOM_tableLinear 
Title:          Table Linear Component - Optimized v2.4
Version:        02.04.00
VAR:            05

last-update:    D2026.07.17
owner:          apps68

Description:    Highly optimized table with fixed action column,
                horizontal column navigation, dark/light mode,
                virtualization, sorting, filtering, column resizing,
                and integrated modal system for CRUD operations.
                Changed: prev/next buttons are now always mounted
                (disabled state instead of unmount), and per-click
                scroll now moves exactly one item using an index
                derived from real item geometry (no more multi-item
                jumps).
                New: hide navigation controls when all items fit.
------------------------------------------------------------*/

/**************************************
 * Step 01 import dependencies - kernels
 **************************************/

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from 'RCMP/RCMP_button_V00.05'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft2, ArrowRight2, More } from 'iconsax-react'

interface IMeta {
  id?: string
  title?: string
  version?: string
  var?: string
  last_update?: string
  owner?: string
  description?: string
}
interface IGeo {}
interface ILogic {
  CANV: any
  service: any
  bundleSlug: any
}
interface IStyle {}
interface IServicePickerProps {
  meta?: IMeta
  geo?: IGeo
  logic: ILogic
  style?: IStyle
}

const DRAG_CLICK_THRESHOLD_PX = 6
const SCROLL_EPSILON_PX = 2 // برای رفع خطای گرد کردن اعشار در محاسبه موقعیت

function ServicePicker ({ meta, geo, logic, style }: IServicePickerProps) {
  const navigate = useNavigate()

  const scrollRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [hiddenLeftCount, setHiddenLeftCount] = useState(0)
  const [hiddenRightCount, setHiddenRightCount] = useState<number>(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false) // <-- وضعیت سرریز

  const dragState = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: 0,
    pointerId: null as number | null
  })

  const sortedItems = useMemo(
    () => [...(logic.CANV ?? [])].sort((a, b) => a?.order - b?.order),
    [logic.CANV]
  )

  /**************************************
   * Step 02 - وضعیت اسکرول و بج‌های مخفی
   **************************************/
  const updateScrollState = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth

    setCanScrollLeft(scrollLeft > SCROLL_EPSILON_PX)
    setCanScrollRight(scrollLeft < maxScroll - SCROLL_EPSILON_PX)

    // بررسی سرریز شدن محتوا
    setHasOverflow(scrollWidth > clientWidth + SCROLL_EPSILON_PX)

    const containerRect = container.getBoundingClientRect()
    let hiddenLeft = 0
    let hiddenRight = 0

    itemRefs.current.forEach(el => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.right <= containerRect.left + 1) hiddenLeft++
      else if (rect.left >= containerRect.right - 1) hiddenRight++
    })

    setHiddenLeftCount(hiddenLeft)
    setHiddenRightCount(hiddenRight)
  }, [])

  useEffect(() => {
    itemRefs.current.length = sortedItems.length
  }, [sortedItems.length])

  useEffect(() => {
    updateScrollState()
    const container = scrollRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => updateScrollState())
    resizeObserver.observe(container)
    container.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, sortedItems.length])

  /**************************************
   * Step 03 - بستن دراپ‌داون (کلیک بیرون + کیبورد) و بستن در صورت عدم سرریز
   **************************************/
  useEffect(() => {
    if (!menuOpen) return

    function handlePointerDownOutside (e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function handleKeyDown (e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDownOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  // بستن منو در صورتی که سرریز از بین برود (مثلاً در حین رزایز)
  useEffect(() => {
    if (!hasOverflow && menuOpen) {
      setMenuOpen(false)
    }
  }, [hasOverflow, menuOpen])

  /**************************************
   * Step 04 - اسکرول دقیقاً یک آیتم در هر کلیک
   **************************************/
  const getItemPositions = (
    container: HTMLDivElement,
    items: HTMLDivElement[]
  ) => {
    const containerRect = container.getBoundingClientRect()
    return items.map(el => {
      const rect = el.getBoundingClientRect()
      return rect.left - containerRect.left + container.scrollLeft
    })
  }

  const scrollByOneItem = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[]
    if (items.length === 0) return

    const positions = getItemPositions(container, items)
    const maxScroll = container.scrollWidth - container.clientWidth

    let currentIndex = positions.findIndex(
      pos => pos >= container.scrollLeft - SCROLL_EPSILON_PX
    )
    if (currentIndex === -1) currentIndex = positions.length - 1

    const targetIndex =
      direction === 'right'
        ? Math.min(currentIndex + 1, positions.length - 1)
        : Math.max(currentIndex - 1, 0)

    const targetScroll = Math.min(
      Math.max(positions[targetIndex], 0),
      maxScroll
    )
    container.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }

  /**************************************
   * Step 05 - درگ با Pointer Events
   **************************************/
  const handlePointerDown = (e: React.PointerEvent) => {
    const container = scrollRef.current
    if (!container) return

    dragState.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: container.scrollLeft,
      moved: 0,
      pointerId: e.pointerId
    }

    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    function handlePointerMove (e: PointerEvent) {
      const state = dragState.current
      const container = scrollRef.current
      if (!state.active || !container || e.pointerId !== state.pointerId) return

      const delta = e.clientX - state.startX
      state.moved = Math.max(state.moved, Math.abs(delta))
      container.scrollLeft = state.startScrollLeft - delta
    }

    function endDrag (e: PointerEvent) {
      const state = dragState.current
      if (!state.active || e.pointerId !== state.pointerId) return
      state.active = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [])

  /**************************************
   * Step 06 - اسکرول با چرخ ماوس
   **************************************/
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    function handleWheel (e: WheelEvent) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      scrollByOneItem(e.deltaY > 0 ? 'right' : 'left')
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**************************************
   * Step 07 - اکشن‌ها
   **************************************/
  const goTo = (item: any) => {
    if (dragState.current.moved > DRAG_CLICK_THRESHOLD_PX) {
      dragState.current.moved = 0
      return
    }
    navigate(`/${logic.bundleSlug}/${item.slug}/${item?.sheets?.[0]?.slug}`, {
      flushSync: true
    })
    setMenuOpen(false)
  }

  /**************************************
   * Step 08 - رندر (نمایش دکمه‌ها فقط در صورت سرریز)
   **************************************/
  return (
    <div className='relative flex flex-row items-center justify-center gap-2 w-full bg-neutral text-neutral-text rounded-lg'>
      {/* دکمه چپ - فقط در صورت سرریز */}
      {hasOverflow && (
        <Button
          logic={{
            onClick: () => scrollByOneItem('left'),
            variant: 'default',
            state: hiddenLeftCount > 0 ? 'active' : 'disabled',
            size: 'xs',
            icon: <ArrowLeft2 size={18} />,
            badge:
              canScrollLeft && hiddenLeftCount > 0 ? +hiddenLeftCount : null,
            badgePosition: 'top-left',
            badgeColor: 'primary'
          }}
        />
      )}

      {/* ناحیه اسکرول دکمه‌ها */}
      <div
        ref={scrollRef}
        role='tablist'
        aria-label='لیست Servises list'
        className='no-scrollbar flex flex-row flex-nowrap gap-2 overflow-x-auto scroll-smooth flex-1 cursor-grab select-none touch-pan-y px-4'
        style={{ scrollbarWidth: 'none', scrollSnapType: 'x proximity' }}
        onPointerDown={handlePointerDown}
      >
        {sortedItems?.map((item, idx) => {
          const isActive = item.serviceName === logic.service?.serviceName
          return (
            <div
              key={item.slug ?? idx}
              ref={el => {
                itemRefs.current[idx] = el
              }}
              className='flex-shrink-0'
              style={{ scrollSnapAlign: 'start' }}
              role='tab'
              aria-selected={isActive}
            >
              <Button
                logic={{
                  onClick: () => goTo(item),
                  content: item?.serviceName,
                  icon: item.icon,
                  size: 'sm',
                  variant: isActive ? 'fill' : 'outline',
                  className: isActive
                    ? 'stroke-primary-active-text'
                    : 'stroke-primary-text'
                }}
              />
            </div>
          )
        })}
      </div>

      {/* دکمه سه‌نقطه = نمایش کل لیست - فقط در صورت سرریز */}
      {hasOverflow && (
        <div className='relative flex-shrink-0' ref={menuRef}>
          <Button
            logic={{
              icon: (
                <More size={21} className='stroke-neutral-text rotate-90' />
              ),
              variant: 'default',
              size: 'sm',
              onClick: () => setMenuOpen(o => !o)
            }}
          />
          {menuOpen && (
            <div
              role='menu'
              aria-label=''
              className='custom-scrollbar absolute z-50 mt-2 end-0 min-w-[200px] max-h-[300px] overflow-y-auto bg-neutral text-neutral-text border border-neutral-border rounded-lg shadow-lg py-1'
            >
              {sortedItems?.map((item, idx) => {
                const isActive = item.serviceName === logic.service?.serviceName
                return (
                  <button
                    key={item.slug ?? idx}
                    type='button'
                    role='menuitem'
                    onClick={() => goTo(item)}
                    className={`w-full text-start px-3 py-2 text-sm flex items-center gap-2 text-neutral-text hover:bg-neutral-hover-bg hover:text-neutral-text ${
                      isActive
                        ? 'text-sky-600 font-medium'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {item?.serviceName}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* دکمه راست - فقط در صورت سرریز */}
      {hasOverflow && (
        <Button
          logic={{
            onClick: () => scrollByOneItem('right'),
            variant: 'default',
            state: hiddenRightCount > 0 ? 'active' : 'disabled',
            size: 'xs',
            icon: <ArrowRight2 size={18} />,
            badge:
              canScrollRight && hiddenRightCount > 0 ? +hiddenRightCount : null,
              badgePosition:"top-right"
          }}
        />
      )}
    </div>
  )
}

export default ServicePicker
