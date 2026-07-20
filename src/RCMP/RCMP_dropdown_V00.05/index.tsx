/*------------------------------------------------------------
Meta Data

ID:             RCOM_dropdownLarge
Title:          Large Dropdown Component - Optimized v1.1
Version:        00.00.05
VAR:            01

last-update:    D2026.07.17
owner:          apps68

Description:  
------------------------------------------------------------*/

/**************************************
 * Step 01 import dependencies - kernels
 **************************************/
import {
  ArrowDown2,
  ArrowUp2,
  CloseCircle,
  SearchNormal1,
  TickCircle,
  ElementEqual,
  HambergerMenu,
  More,
  Warning2
} from 'iconsax-react'
import Badge from 'RCMP/RCMP_badge_V00.05'
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  memo,
  useId
} from 'react'
import { createPortal } from 'react-dom'

/**************************************
 * Step 04 - define properties - Static
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
  maxHeight?: string
  position?: string
  zIndex?: string
}

export interface IOption {
  key: string | number
  label: string
  value: any
  description?: string
  icon?: React.ReactNode
  group?: string
  disabled?: boolean
}

interface IDropdownEvents {
  onChange?: (value: any | any[], options: IOption | IOption[]) => void
  onOpen?: () => void
  onClose?: () => void
  onSearch?: (value: string) => void
  onClear?: () => void
}

interface ILogicProps extends IDropdownEvents {
  options?: IOption[]
  value?: any | any[]
  defaultValue?: any | any[]
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  emptyText?: string
  closeOnSelect?: boolean
  selectAllOption?: boolean
  maxSelectedDisplay?: number
  groupBy?: boolean
  enableVirtualization?: boolean
  virtualItemHeight?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  renderOption?: (option: IOption, isSelected: boolean) => React.ReactNode
  renderValue?: (selected: IOption[]) => React.ReactNode
  /**
   * v1.1 - Show the trigger border. Set to `false` for a borderless
   * (ghost) trigger with a subtle hover background instead.
   * Default: true
   */
  bordered?: boolean
  /**
   * v1.1 - Right-side indicator icon of the trigger:
   * "arrow" -> up/down chevrons that flip with open state,
   * "dots"  -> static three-dots (more) icon,
   * "none"  -> no indicator icon at all.
   * Default: "arrow"
   */
  indicatorIcon?: 'arrow' | 'dots' | 'none'
  /**
   * v1.1 - Show a counter badge between the option icon and the selected
   * label: "selected position / total options" for single select, and
   * "selected count / total options" for multi select.
   * Default: false
   */
  showCounter?: boolean
  /**
   * v1.1 - Always render a hamburger menu icon at the start of the
   * trigger, even when the selected option has its own icon.
   * Intended for menu-style dropdowns.
   * Default: false
   */
  hamburgerIcon?: boolean
   variant?: 'default' | 'white' | 'gray'
}

// * style پراپ فقط برای اضافه کردن کلاس‌های دلخواه (و نه رنگ‌ها) نگهداری می‌شود.
interface IStyleProps {
  className?: string // کلاس‌های اضافی برای ریشه
  triggerClassName?: string
  menuClassName?: string
}

interface IDropdownLargeProps {
  meta?: IMetaProps
  geo?: IGeoProps
  logic?: ILogicProps
  style?: IStyleProps
}


const sizeClasses: Record<string, string> = {
  xs: 'h-6 px-2 text-xs',
  sm: 'h-8 px-2 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  xl: 'h-14 px-6 text-lg'
}

const iconSizeMap: Record<string, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20
}

const badgeSizeMap: Record<string, 'xs' | 'sm' | 'md' | 'lg'> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
  xl: 'md'
}


// ============================================
// SUB-COMPONENTS (Memoized)
// ============================================

/**
 * Loading Skeleton for the option list
 */
const OptionSkeleton = memo(({ rowCount = 5 }: { rowCount?: number }) => (
  <div className='py-1'>
    {Array.from({ length: rowCount }).map((_, idx) => (
      <div key={`skel-${idx}`} className='flex items-center gap-2 px-3 h-9'>
        <div className='h-3.5 w-3.5 animate-pulse rounded bg-neutral ' />
        <div
          className='h-3 animate-pulse rounded bg-neutral'
          style={{ width: `${50 + ((idx * 13) % 40)}%` }}
        />
      </div>
    ))}
  </div>
))
OptionSkeleton.displayName = 'OptionSkeleton'

/**
 * Empty State Component
 */
const EmptyState = memo(({ text = 'No options found.' }: { text?: string }) => (
  <div className='flex flex-col items-center justify-center gap-2 py-8'>
    <ElementEqual size={32} className='stroke-gray-300 dark:stroke-gray-600' />
    <p className='text-xs text-neutral font-medium'>{text}</p>
  </div>
))
EmptyState.displayName = 'EmptyState'

/**
 * Single Option Row
 */
const OptionRow = memo(
  ({
    option,
    isSelected,
    isHighlighted,
    multiple,
    onSelect,
    onMouseEnter,
    renderOption,
    itemHeight
  }: {
    option: IOption
    isSelected: boolean
    isHighlighted: boolean
    multiple: boolean
    onSelect: (option: IOption) => void
    onMouseEnter: () => void
    renderOption?: (option: IOption, isSelected: boolean) => React.ReactNode
    itemHeight: number
  }) => {
    return (
      <div
        role='option'
        aria-selected={isSelected}
        aria-disabled={option.disabled}
        onClick={() => !option.disabled && onSelect(option)}
        onMouseEnter={onMouseEnter}
        className={`
          flex items-center gap-2 px-3 cursor-pointer select-none transition-colors duration-100
          ${option.disabled ? 'opacity-40 cursor-not-allowed' : ''}
          ${
            isHighlighted && !option.disabled
              ? 'bg-gray-50 dark:bg-gray-700/60'
              : ''
          }
          ${isSelected ? 'bg-cyan-50 dark:bg-cyan-900/30' : ''}
        `}
        style={{ height: itemHeight }}
      >
        {multiple && (
          <span
            className={`
              flex h-4 w-4 shrink-0 items-center justify-center rounded border
              ${
                isSelected
                  ? 'bg-cyan-600 '
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              }
            `}
          >
            {isSelected && (
              <svg viewBox='0 0 12 12' className='h-2.5 w-2.5' fill='none'>
                <path
                  d='M2 6.2L4.6 8.8L10 3'
                  stroke='white'
                  strokeWidth='1.7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
          </span>
        )}

        {renderOption ? (
          renderOption(option, isSelected)
        ) : (
          <div className='flex min-w-0 flex-1 items-center gap-2'>
            {option.icon && (
              <span className='shrink-0 flex items-center'>{option.icon}</span>
            )}
            <div className='min-w-0 flex-1'>
              <div className='truncate text-xs text-gray-700 dark:text-gray-200 font-medium'>
                {option.label}
              </div>
              {option.description && (
                <div className='truncate text-[11px] text-neutral'>
                  {option.description}
                </div>
              )}
            </div>
            {!multiple && isSelected && (
              <TickCircle
                size={16}
                variant='Bold'
                className='shrink-0 fill-cyan-600 dark:fill-cyan-400'
              />
            )}
          </div>
        )}
      </div>
    )
  }
)
OptionRow.displayName = 'OptionRow'

// ============================================
// MAIN COMPONENT
// ============================================

const DropdownLarge = memo(function DropdownLarge ({
  meta,
  geo,
  logic,
  style
}: IDropdownLargeProps) {
  /**************************************
   * Step 06 - assignments for this BioWidget
   **************************************/
  const {
    options = [],
    value,
    defaultValue,
    multiple = false,
    searchable = true,
    clearable = true,
    disabled = false,
    loading = false,
    placeholder = 'Select...',
    emptyText = 'No options found.',
    closeOnSelect,
    selectAllOption = true,
    maxSelectedDisplay = 3,
    groupBy = false,
    enableVirtualization = true,
    virtualItemHeight = 36,
    renderOption,
    renderValue,
    // --- v1.1 ---
    bordered = true,
    indicatorIcon = 'arrow',
    showCounter = false,
    hamburgerIcon = false,
    variant = 'default',
    size = 'md',
    // --- events ---
    onChange,
    onOpen,
    onClose,
    onSearch,
    onClear
  } = logic || {}

  const { className, triggerClassName, menuClassName } = style || {}

  // Resolve closeOnSelect default: single-select closes on pick, multi stays open.
  const resolvedCloseOnSelect = closeOnSelect ?? !multiple

  // --- STATE MANAGEMENT ---
  const uid = useId()
  const isControlled = value !== undefined

  const toValueArray = (v: any): any[] => {
    if (v === undefined || v === null) return []
    return Array.isArray(v) ? v : [v]
  }

  const [internalValue, setInternalValue] = useState<any[]>(
    toValueArray(defaultValue)
  )
  const selectedValues = isControlled ? toValueArray(value) : internalValue

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedKey, setHighlightedKey] = useState<string | number | null>(
    null
  )
  const [scrollTop, setScrollTop] = useState(0)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
    width: number
    openUpward: boolean
  } | null>(null)
  const [typeAheadBuffer, setTypeAheadBuffer] = useState('')

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const typeAheadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // --- MEMOIZED COMPUTATIONS ---

  const valueSet = useMemo(() => new Set(selectedValues), [selectedValues])

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const searchLower = search.toLowerCase()
    return options.filter(
      opt =>
        opt.label.toLowerCase().includes(searchLower) ||
        opt.description?.toLowerCase().includes(searchLower)
    )
  }, [options, search])

  // Flatten into a render list that interleaves group headers, so
  // virtualization can operate over a single flat array of fixed-height rows.
  type FlatRow =
    | { type: 'group'; key: string; label: string }
    | { type: 'option'; key: string | number; option: IOption }

  const flatRows = useMemo<FlatRow[]>(() => {
    if (!groupBy) {
      return filteredOptions.map(option => ({
        type: 'option' as const,
        key: option.key,
        option
      }))
    }

    const groups = new Map<string, IOption[]>()
    filteredOptions.forEach(opt => {
      const g = opt.group || 'Other'
      if (!groups.has(g)) groups.set(g, [])
      groups.get(g)!.push(opt)
    })

    const rows: FlatRow[] = []
    groups.forEach((opts, groupLabel) => {
      rows.push({
        type: 'group',
        key: `group-${groupLabel}`,
        label: groupLabel
      })
      opts.forEach(opt =>
        rows.push({ type: 'option', key: opt.key, option: opt })
      )
    })
    return rows
  }, [filteredOptions, groupBy])

  const selectableRows = useMemo(
    () =>
      flatRows.filter(
        (r): r is Extract<FlatRow, { type: 'option' }> =>
          r.type === 'option' && !r.option.disabled
      ),
    [flatRows]
  )

  const selectedOptions = useMemo(
    () => options.filter(opt => valueSet.has(opt.value)),
    [options, valueSet]
  )

  // v1.1 - 1-based position of the first selected option inside the FULL
  // options list (used by the counter badge). Returns 0 when nothing found.
  const selectedIndex = useMemo(() => {
    if (selectedOptions.length === 0) return 0
    const idx = options.findIndex(o => o.value === selectedOptions[0].value)
    return idx === -1 ? 0 : idx + 1
  }, [options, selectedOptions])

  // --- VIRTUALIZATION (manual windowing, consistent with table's approach) ---
  const groupHeaderHeight = 28
  const rowHeights = useMemo(
    () =>
      flatRows.map(r =>
        r.type === 'group' ? groupHeaderHeight : virtualItemHeight
      ),
    [flatRows, virtualItemHeight]
  )
  const rowOffsets = useMemo(() => {
    const offsets: number[] = []
    let acc = 0
    rowHeights.forEach(h => {
      offsets.push(acc)
      acc += h
    })
    return { offsets, total: acc }
  }, [rowHeights])

  const viewportHeight = 260
  const visibleRange = useMemo(() => {
    if (!enableVirtualization || flatRows.length < 40) {
      return { start: 0, end: flatRows.length }
    }
    const buffer = 4
    let start = 0
    while (
      start < rowOffsets.offsets.length &&
      rowOffsets.offsets[start] < scrollTop
    ) {
      start++
    }
    start = Math.max(0, start - buffer)

    let end = start
    while (
      end < rowOffsets.offsets.length &&
      rowOffsets.offsets[end] < scrollTop + viewportHeight
    ) {
      end++
    }
    end = Math.min(flatRows.length, end + buffer)

    return { start, end }
  }, [enableVirtualization, flatRows.length, rowOffsets, scrollTop])

  const visibleRows = useMemo(
    () => flatRows.slice(visibleRange.start, visibleRange.end),
    [flatRows, visibleRange]
  )
  const topPad = rowOffsets.offsets[visibleRange.start] ?? 0
  const bottomPad =
    rowOffsets.total -
    (rowOffsets.offsets[visibleRange.end] ?? rowOffsets.total)

  const allSelectableSelected = useMemo(
    () =>
      selectableRows.length > 0 &&
      selectableRows.every(r => valueSet.has(r.option.value)),
    [selectableRows, valueSet]
  )

  // --- CALLBACKS ---

  const commitValue = useCallback(
    (nextValues: any[], nextOptions: IOption[]) => {
      if (!isControlled) setInternalValue(nextValues)
      const outValue = multiple ? nextValues : nextValues[0]
      const outOptions = multiple ? nextOptions : nextOptions[0]
      onChange?.(outValue, outOptions as any)
    },
    [isControlled, multiple, onChange]
  )

  const handleSelect = useCallback(
    (option: IOption) => {
      if (multiple) {
        const exists = valueSet.has(option.value)
        const nextValues = exists
          ? selectedValues.filter(v => v !== option.value)
          : [...selectedValues, option.value]
        const nextOptions = options.filter(o => nextValues.includes(o.value))
        commitValue(nextValues, nextOptions)
      } else {
        commitValue([option.value], [option])
      }

      if (resolvedCloseOnSelect) {
        setIsOpen(false)
        onClose?.()
      }
    },
    [
      multiple,
      valueSet,
      selectedValues,
      options,
      commitValue,
      resolvedCloseOnSelect,
      onClose
    ]
  )

  const handleSelectAll = useCallback(() => {
    if (allSelectableSelected) {
      commitValue([], [])
    } else {
      const nextValues = selectableRows.map(r => r.option.value)
      const nextOptions = selectableRows.map(r => r.option)
      commitValue(nextValues, nextOptions)
    }
  }, [allSelectableSelected, selectableRows, commitValue])

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      commitValue([], [])
      onClear?.()
    },
    [commitValue, onClear]
  )

  const handleRemoveChip = useCallback(
    (e: React.MouseEvent, optValue: any) => {
      e.stopPropagation()
      const nextValues = selectedValues.filter(v => v !== optValue)
      const nextOptions = options.filter(o => nextValues.includes(o.value))
      commitValue(nextValues, nextOptions)
    },
    [selectedValues, options, commitValue]
  )

  const computeMenuPosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const menuEstimatedHeight = Math.min(
      340,
      Math.max(120, flatRows.length * virtualItemHeight + 56)
    )
    const spaceBelow = window.innerHeight - rect.bottom
    const openUpward =
      spaceBelow < menuEstimatedHeight && rect.top > menuEstimatedHeight

    setMenuPosition({
      top: openUpward
        ? rect.top + window.scrollY - menuEstimatedHeight - 6
        : rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width,
      openUpward
    })
  }, [flatRows.length, virtualItemHeight])

  const openMenu = useCallback(() => {
    if (disabled) return
    computeMenuPosition()
    setIsOpen(true)
    onOpen?.()
  }, [disabled, computeMenuPosition, onOpen])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setSearch('')
    onClose?.()
  }, [onClose])

  const toggleMenu = useCallback(() => {
    if (isOpen) closeMenu()
    else openMenu()
  }, [isOpen, openMenu, closeMenu])

  const handleSearchChange = useCallback(
    (v: string) => {
      setSearch(v)
      onSearch?.(v)
    },
    [onSearch]
  )

  // --- EFFECTS ---

  // Reposition on open, on resize/scroll of the page, and focus the search input.
  useEffect(() => {
    if (!isOpen) return
    computeMenuPosition()

    const handleReposition = () => computeMenuPosition()
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    const focusTimer = setTimeout(() => {
      if (searchable) searchInputRef.current?.focus()
    }, 0)

    return () => {
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
      clearTimeout(focusTimer)
    }
  }, [isOpen, computeMenuPosition, searchable])

  // Click outside closes the menu.
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeMenu])

  // Reset highlight to the first selectable row whenever the filtered list changes.
  useEffect(() => {
    if (!isOpen) return
    if (selectableRows.length === 0) {
      setHighlightedKey(null)
      return
    }
    const stillExists = selectableRows.some(
      r => r.option.key === highlightedKey
    )
    if (!stillExists) {
      setHighlightedKey(selectableRows[0].option.key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectableRows])

  // --- KEYBOARD NAVIGATION ---

  const moveHighlight = useCallback(
    (direction: 1 | -1) => {
      if (selectableRows.length === 0) return
      const currentIndex = selectableRows.findIndex(
        r => r.option.key === highlightedKey
      )
      let nextIndex = currentIndex + direction
      if (nextIndex < 0) nextIndex = selectableRows.length - 1
      if (nextIndex >= selectableRows.length) nextIndex = 0
      const nextKey = selectableRows[nextIndex].option.key
      setHighlightedKey(nextKey)

      // Ensure the highlighted row is scrolled into view within the virtual list.
      const flatIndex = flatRows.findIndex(r => r.key === nextKey)
      if (flatIndex !== -1 && listRef.current) {
        const rowTop = rowOffsets.offsets[flatIndex]
        const rowBottom = rowTop + rowHeights[flatIndex]
        const el = listRef.current
        if (rowTop < el.scrollTop) {
          el.scrollTop = rowTop
        } else if (rowBottom > el.scrollTop + viewportHeight) {
          el.scrollTop = rowBottom - viewportHeight
        }
      }
    },
    [selectableRows, highlightedKey, flatRows, rowOffsets, rowHeights]
  )

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      if (!isOpen) {
        if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
          e.preventDefault()
          openMenu()
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          moveHighlight(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          moveHighlight(-1)
          break
        case 'Enter': {
          e.preventDefault()
          const row = selectableRows.find(r => r.option.key === highlightedKey)
          if (row) handleSelect(row.option)
          break
        }
        case 'Escape':
          e.preventDefault()
          closeMenu()
          triggerRef.current?.focus()
          break
        case 'Tab':
          closeMenu()
          break
        default:
          // Type-ahead: jump to the first option starting with the typed letters,
          // only when the search box isn't already capturing keystrokes.
          if (!searchable && e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
            const nextBuffer = typeAheadBuffer + e.key.toLowerCase()
            setTypeAheadBuffer(nextBuffer)
            if (typeAheadTimeout.current) clearTimeout(typeAheadTimeout.current)
            typeAheadTimeout.current = setTimeout(
              () => setTypeAheadBuffer(''),
              600
            )

            const match = selectableRows.find(r =>
              r.option.label.toLowerCase().startsWith(nextBuffer)
            )
            if (match) setHighlightedKey(match.option.key)
          }
      }
    },
    [
      disabled,
      isOpen,
      openMenu,
      moveHighlight,
      selectableRows,
      highlightedKey,
      handleSelect,
      closeMenu,
      searchable,
      typeAheadBuffer
    ]
  )

  // --- RENDER HELPERS ---

  const renderTriggerContent = () => {
    if (selectedOptions.length === 0) {
      return (
        <span className='truncate text-neutral-placeholder'>{placeholder}</span>
      )
    }

    if (renderValue) return renderValue(selectedOptions)

    if (!multiple) {
      const opt = selectedOptions[0]
      return (
        <span className='flex min-w-0 items-center gap-1 truncate'>
          {opt.icon}
          <span className='truncate text-neutral-text font-medium'>
            {opt.label}
          </span>
          {showCounter && (
            <Badge
              logic={{
                children: `${selectedIndex}/${options.length}`,
                size: 'xs',
                shape: 'rounded',
                color: 'info'
              }}
            />
          )}
        </span>
      )
    }

    const visibleChips = selectedOptions.slice(0, maxSelectedDisplay)
    const overflowCount = selectedOptions.length - visibleChips.length

    return (
      <div className='flex min-w-0 flex-wrap items-center gap-1'>
        {showCounter && (
          <Badge
            logic={{
              children: `${selectedOptions.length}/${options.length}`,
              size: 'xs',
              shape: 'rounded',
              color: 'info'
            }}
          />
        )}
        {visibleChips.map(opt => (
          <span
            key={opt.key}
            className='flex items-center gap-1 rounded-md bg-cyan-50 dark:bg-cyan-900/30 px-1.5 py-0.5 text-[11px] font-medium text-cyan-700 dark:text-cyan-300'
          >
            <span className='max-w-[100px] truncate'>{opt.label}</span>
            <CloseCircle
              size={12}
              className='shrink-0 stroke-cyan-500 dark:stroke-cyan-400 hover:stroke-cyan-700 dark:hover:stroke-cyan-200'
              onClick={e => handleRemoveChip(e, opt.value)}
            />
          </span>
        ))}
        {overflowCount > 0 && (
          <span className='rounded-md bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 dark:text-gray-400'>
            +{overflowCount} more
          </span>
        )}
      </div>
    )
  }

  const renderMenu = () => {
    if (!isOpen || !menuPosition) return null

    return createPortal(
      <div
        ref={menuRef}
        role='listbox'
        aria-multiselectable={multiple}
        className={`
          fixed rounded-xl border shadow-lg overflow-hidden flex flex-col
          bg-white dark:bg-gray-800
          border-gray-200 dark:border-gray-700
          ${menuClassName || ''}
        `}
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
          width: Math.max(menuPosition.width, 220),
          maxHeight: 340,
          zIndex: 9999
        }}
      >
        {searchable && (
          <div className='flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-3 py-2 shrink-0'>
            <SearchNormal1
              size={14}
              className='shrink-0 stroke-gray-400 dark:stroke-gray-500'
            />
            <input
              ref={searchInputRef}
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              onKeyDown={handleTriggerKeyDown}
              placeholder='Search options...'
              className='w-full bg-transparent text-xs text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none'
            />
            {search && (
              <button
                onClick={() => handleSearchChange('')}
                className='shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <CloseCircle size={13} className='stroke-current' />
              </button>
            )}
          </div>
        )}

        {multiple && selectAllOption && selectableRows.length > 0 && (
          <button
            onClick={handleSelectAll}
            className={`
              flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-3 h-9 shrink-0
              text-left hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors
            `}
          >
            <span
              className={`
                flex h-4 w-4 shrink-0 items-center justify-center rounded border
                ${
                  allSelectableSelected
                    ? 'bg-cyan-600 border-cyan-600'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }
              `}
            >
              {allSelectableSelected && (
                <svg viewBox='0 0 12 12' className='h-2.5 w-2.5' fill='none'>
                  <path
                    d='M2 6.2L4.6 8.8L10 3'
                    stroke='white'
                    strokeWidth='1.7'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
            </span>
            <span className='text-xs font-semibold text-gray-600 dark:text-gray-300'>
              {allSelectableSelected ? 'Deselect all' : 'Select all'}
            </span>
          </button>
        )}

        <div
          ref={listRef}
          className='overflow-y-auto custom-scrollbar flex-1'
          style={{ maxHeight: viewportHeight }}
          onScroll={e => setScrollTop((e.target as HTMLDivElement).scrollTop)}
        >
          {loading ? (
            <OptionSkeleton rowCount={5} />
          ) : flatRows.length === 0 ? (
            <EmptyState text={emptyText} />
          ) : (
            <div style={{ height: rowOffsets.total, position: 'relative' }}>
              <div style={{ transform: `translateY(${topPad}px)` }}>
                {visibleRows.map(row => {
                  if (row.type === 'group') {
                    return (
                      <div
                        key={row.key}
                        className='sticky top-0 flex items-center px-3 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/80'
                        style={{ height: groupHeaderHeight }}
                      >
                        {row.label}
                      </div>
                    )
                  }
                  const isSelected = valueSet.has(row.option.value)
                  return (
                    <OptionRow
                      key={row.key}
                      option={row.option}
                      isSelected={isSelected}
                      isHighlighted={highlightedKey === row.option.key}
                      multiple={multiple}
                      onSelect={handleSelect}
                      onMouseEnter={() => setHighlightedKey(row.option.key)}
                      renderOption={renderOption}
                      itemHeight={virtualItemHeight}
                    />
                  )
                })}
              </div>
              <div style={{ height: bottomPad }} />
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  }
const variantBgClass = useMemo(() => {
  if (variant === 'white') return 'bg-white dark:bg-gray-800'
  if (variant === 'gray') return 'bg-[#e9e9e9] dark:bg-gray-700'
  return ''
}, [variant])

const variantBorderClass = useMemo(() => {
  if (variant === 'default') {
    // رفتار پیش‌فرض: از پراپ `bordered` پیروی می‌کند
    return bordered
      ? 'border-gray-200 dark:border-gray-700'
      : 'border-transparent'
  }
  // برای white/gray حتی اگر bordered=false باشد، باز هم حاشیه‌ی ملایم می‌دهیم
  return 'border-gray-200 dark:border-gray-600'
}, [variant, bordered])
  // --- MAIN RENDER ---

  return (
    <div
      className={className || ''}
      style={{
        width: geo?.width,
        position: (geo?.position as any) || 'relative',
        zIndex: geo?.zIndex
      }}
    >
      <button
  ref={triggerRef}
  type='button'
  disabled={disabled}
  onClick={toggleMenu}
  onKeyDown={handleTriggerKeyDown}
  aria-haspopup='listbox'
  aria-expanded={isOpen}
  aria-disabled={disabled}
  className={`
    flex w-full items-center justify-between gap-3 rounded-md border px-3 transition-all
    ${geo?.height ? '' : sizeClasses[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${variantBgClass}
    ${variantBorderClass}
    ${triggerClassName || ''}
  `}
  style={{
    height: geo?.height || undefined
  }}
>
        <div className='flex min-w-0 flex-1 items-center gap-1.5'>
          {hamburgerIcon && (
            <HambergerMenu
              size={24}
              className='shrink-0 stroke-gray-500 dark:stroke-gray-400'
            />
          )}
          {renderTriggerContent()}
        </div>

        <div className='flex shrink-0 items-center gap-1'>
          {clearable && !disabled && selectedOptions.length > 0 && (
            <span
              onClick={handleClear}
              className='flex items-center justify-center rounded-md p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700'
              title='Clear'
            >
              <CloseCircle
                size={15}
                className='stroke-gray-400 dark:stroke-gray-500 hover:stroke-gray-600 dark:hover:stroke-gray-300'
              />
            </span>
          )}

          {indicatorIcon === 'arrow' &&
            (isOpen ? (
              <ArrowUp2
                size={16}
                className='stroke-gray-500 dark:stroke-gray-400'
              />
            ) : (
              <ArrowDown2
                size={16}
                className='stroke-gray-500 dark:stroke-gray-400'
              />
            ))}

          {indicatorIcon === 'dots' && (
            <More
              size={16}
              className='stroke-gray-500 dark:stroke-gray-400 rotate-90'
            />
          )}
        </div>
      </button>

      {renderMenu()}
    </div>
  )
})

DropdownLarge.displayName = 'DropdownLarge'

export default DropdownLarge
