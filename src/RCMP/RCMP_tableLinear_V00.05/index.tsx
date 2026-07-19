/*------------------------------------------------------------
Meta Data

ID:             RCOM_tableLinear 
Title:          Table Linear Component - Optimized v2.2
Version:        02.02.00
VAR:            03

last-update:    D2026.07.14
owner:          apps68

Description:    Highly optimized table with fixed action column,
                horizontal column navigation, dark/light mode,
                virtualization, sorting, filtering, column resizing,
                and integrated modal system for CRUD operations.
------------------------------------------------------------*/

/**************************************
 * Step 01 import dependencies - kernels
 **************************************/
import {
  AddCircle,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  ArrowUp2,
  CloseCircle,
  Edit,
  ElementEqual,
  FilterSearch,
  MoreSquare,
  Send,
  Setting2,
  Sort,
  Trash,
  Sun,
  Moon,
  HambergerMenu,
  ArrowDown3,
  ArrowUp3,
  Login
} from 'iconsax-react'
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  memo
} from 'react'
import { createPortal } from 'react-dom'

/**************************************
 * Step.02:    import dependency - widgets
 **************************************/
import Button from 'RCMP/RCMP_button_V00.05'
import ModalBase from '../RCMP_modal_V00.05'
import DropdownLarge from 'RCMP/RCMP_dropdown_V00.05'
import Tooltip from 'RCMP/RCMP_tooltip_V00.05'
import Input, { IInputRef } from 'RCMP/RCMP_input_V00.05'

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

export interface IColumn {
  key: string
  title: string
  width?: number | string
  minWidth?: number
  maxWidth?: number
  sortable?: boolean
  filterable?: boolean
  editable?: boolean
  hidden?: boolean
  align?: 'left' | 'center' | 'right'
  dataType?: 'text' | 'number' | 'date' | 'boolean' | 'custom'
  render?: (value: any, row: any, index: number) => React.ReactNode
  filterRender?: (
    value: string,
    onChange: (val: string) => void
  ) => React.ReactNode
}

interface ITableEvents {
  onSelect?: (rows: any[]) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onSearch?: (value: string) => void
  onPageChange?: (page: number) => void
  onSort?: (sortConfig: ISortConfig[]) => void
  onFilter?: (filters: Record<string, string>) => void
  onRowClick?: (row: any, index: number) => void
  onBulkDelete?: (rows: any[]) => void
  onExport?: (data: any[]) => void
  onAdd?: () => void
  onRowsPerPageChange?: (newSize: number) => void
}

interface IActionProps {
  view?: boolean
  edit?: boolean
  delete?: boolean
  expand?: boolean
}

interface ISortConfig {
  key: string
  direction: 'asc' | 'desc'
}

interface IFilterState {
  [key: string]: string
}

interface IExpandedRows {
  [key: string | number]: boolean
}

interface IInlineEditState {
  rowIndex: number | null
  columnKey: string | null
  value: any
}

interface IModalConfig {
  add?: {
    title?: string
    description?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    confirmText?: string
    cancelText?: string
    children?: React.ReactNode
  }
  edit?: {
    title?: string
    description?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    confirmText?: string
    cancelText?: string
    children?: React.ReactNode
  }
  delete?: {
    title?: string
    description?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    confirmText?: string
    cancelText?: string
    confirmButtonVariant?:
      | 'primary'
      | 'secondary'
      | 'danger'
      | 'success'
      | 'warning'
  }
}

interface ILogicProps extends ITableEvents {
  columns?: IColumn[]
  data?: any[]
  selection?: boolean
  pagination?: boolean
  pageSize?: number
  editable?: 'edit' | 'view'
  title?: string
  agreeBar?: boolean
  actions?: IActionProps
  loading?: boolean
  emptyText?: string
  enableVirtualization?: boolean
  virtualItemHeight?: number
  enableColumnResize?: boolean
  enableExport?: boolean
  rowKey?: string
  summaryData?: { label: string; value: string | number }[]
  modalConfig?: IModalConfig
  enableAddModal?: boolean
  enableEditModal?: boolean
  enableDeleteModal?: boolean
  addButtonText?: string
  onAddSubmit?: (data: any) => void
  onEditSubmit?: (data: any) => void
  onDeleteConfirm?: (row: any) => void
  onReorder?: (newData: any[]) => void
}

interface IStyleProps {
  headerBg?: string
  rowHoverBg?: string
  stripeColor?: string
  borderColor?: string
  textColor?: string
  fontSize?: string
  compact?: boolean
}

interface ITableLinearProps {
  meta?: IMetaProps
  geo?: IGeoProps
  logic?: ILogicProps
  style?: IStyleProps
}

// ============================================
// SUB-COMPONENTS (Memoized)
// ============================================

/**
 * Loading Skeleton Component
 */
const TableSkeleton = memo(
  ({ columns, rowCount = 5 }: { columns: IColumn[]; rowCount?: number }) => (
    <tbody>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <tr key={`skeleton-${rowIdx}`} className='h-10'>
          <td className='px-3'>
            <div className='h-4 w-4 animate-pulse rounded bg-neutral' />
          </td>
          {columns
            .filter(c => !c.hidden)
            .map((col, colIdx) => (
              <td key={`skel-${rowIdx}-${colIdx}`} className='px-3'>
                <div
                  className='h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700'
                  style={{
                    width: typeof col.width === 'number' ? col.width : '80%'
                  }}
                />
              </td>
            ))}
          <td className='px-3'>
            <div className='h-4 w-8 animate-pulse rounded bg-neutral' />
          </td>
        </tr>
      ))}
    </tbody>
  )
)
TableSkeleton.displayName = 'TableSkeleton'

/**
 * Empty State Component
 */
const EmptyState = memo(({ text = 'No data found.' }: { text?: string }) => (
  <tbody>
    <tr>
      <td colSpan={100} className='py-16 text-center'>
        <div className='flex flex-col items-center gap-3'>
          <ElementEqual size={48} className='stroke-neutral-text' />
          <p className='text-sm text-neutral-text font-medium'>{text}</p>
        </div>
      </td>
    </tr>
  </tbody>
))
EmptyState.displayName = 'EmptyState'

/**
 * Inline Edit Cell
 */
const InlineEditCell = memo(
  ({
    value,
    dataType,
    onSave,
    onCancel
  }: {
    value: any
    dataType?: string
    onSave: (val: any) => void
    onCancel: () => void
  }) => {
    const [editValue, setEditValue] = useState(value)
    const inputRefs = useRef<IInputRef>(null)

    useEffect(() => {
      inputRefs.current?.focus()
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') onSave(editValue)
      if (e.key === 'Escape') onCancel()
    }

    return (
      <div className='flex items-center gap-1'>
        <Input
          ref={inputRefs}
          logic={{
            size: 'xs',
            variant: 'fill',
            type: dataType === 'number' ? 'number' : 'text',
            value: editValue,
            onChange: e => setEditValue(e.target.value),
            onBlur: () => onSave(editValue)
          }}
        />
      </div>
    )
  }
)
InlineEditCell.displayName = 'InlineEditCell'

// **
//  * Column Filter Component
//  */
const ColumnFilter = memo(
  ({
    column,
    value,
    onChange
  }: {
    column: IColumn
    value: string
    onChange: (val: string) => void
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (isOpen) {
        inputRef.current?.focus()
      }
    }, [isOpen])

    if (!column.filterable) return null

    return (
      <div className='relative inline-block'>
        <button
          onClick={e => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className='ml-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
          aria-label={`Filter ${column.title}`}
        >
          <FilterSearch size={12} className='stroke-neutral-text' />
        </button>
        {isOpen && (
          <div
            className='absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20 min-w-[180px]'
            onClick={e => e.stopPropagation()}
          >
            {column.filterRender ? (
              column.filterRender(value, onChange)
            ) : (
              <input
                ref={inputRef}
                type='text'
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={`Filter ${column.title}`}
                className='w-full h-7 rounded border border-gray-200 dark:border-gray-600 px-2 text-sm
                         bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                         focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'
              />
            )}
            <div className='flex justify-end mt-1'>
              <button
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
                className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)
ColumnFilter.displayName = 'ColumnFilter'

// ============================================
// MAIN COMPONENT
// ============================================

const TableLinear = memo(function TableLinear ({
  meta,
  geo,
  logic,
  style
}: ITableLinearProps) {
  /**************************************
   * Step 06 - assignments for this BioWidget
   **************************************/
  const {
    columns = [],
    data = [],
    selection = true,
    pagination = true,
    pageSize = 10,
    editable = 'view',
    title = 'Table',
    agreeBar = true,
    loading = false,
    emptyText = 'No data found.',
    enableColumnResize = false,
    rowKey = 'id',
    summaryData,
    modalConfig = {},
    enableAddModal = true,
    enableEditModal = true,
    enableDeleteModal = true,
    addButtonText = 'ADD',
    onRowsPerPageChange,
    onAdd,
    onAddSubmit,
    onEdit,
    onEditSubmit,
    onDelete,
    onDeleteConfirm,
    onSelect,
    onSearch,
    onPageChange,
    onSort,
    onFilter,
    onRowClick,
    onBulkDelete,
    onReorder
  } = logic || {}

  const {
    headerBg = '',
    rowHoverBg = '#f0f7ff',
    stripeColor = '#f9fafc',
    borderColor = '#e2e8f0',
    textColor = '#1e293b',
    fontSize = '0.75rem',
    compact = false
  } = style || {}

  // --- STATE MANAGEMENT ---
  const [tooltipOpen, setTooltipOpen] = useState<Record<string, boolean>>({})
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )
  const [isEditMode, setIsEditMode] = useState<'edit' | 'view'>(editable)
  const [search, setSearch] = useState<string>('')
  const [sortConfig, setSortConfig] = useState<ISortConfig[]>([])
  const [filters, setFilters] = useState<IFilterState>({})
  const [expandedRows, setExpandedRows] = useState<IExpandedRows>({})
  const [inlineEdit, setInlineEdit] = useState<IInlineEditState>({
    rowIndex: null,
    columnKey: null,
    value: null
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(c => c.key))
  )
  const [internalPageSize, setInternalPageSize] = useState(pageSize)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const [visibleColumnStart, setVisibleColumnStart] = useState(0)
  const [visibleColumnCount, setVisibleColumnCount] = useState(5)

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRowForAction, setSelectedRowForAction] = useState<any>(null)
  const [editFormData, setEditFormData] = useState<any>({})
  const [addFormData, setAddFormData] = useState<any>({})

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const settingButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const [reorderableData, setReorderableData] = useState<any[]>(data)
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null)

  // Keep visible-columns state in sync when the `columns` prop changes
  // (e.g. columns added/removed dynamically) instead of only at mount,
  // where the initial useState(new Set(...)) would otherwise never see
  // newly-added column keys.
  useEffect(() => {
    setVisibleColumns(prev => {
      const columnKeys = columns.map(c => c.key)
      const prevKeys = new Set(prev)
      const merged = new Set(prev)
      let changed = false

      // Newly-added columns become visible by default.
      columnKeys.forEach(k => {
        if (!prevKeys.has(k)) {
          merged.add(k)
          changed = true
        }
      })
      // Columns that no longer exist are dropped from the visible set.
      prev.forEach(k => {
        if (!columnKeys.includes(k)) {
          merged.delete(k)
          changed = true
        }
      })

      return changed ? merged : prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.map(c => c.key).join(',')])
  const toggleTooltip = (rowKey: string | number) => {
    setTooltipOpen(prev => ({
      ...prev,
      [rowKey]: !prev[rowKey]
    }))
  }
  const handleDragStart = useCallback(
    (e: React.DragEvent, paginatedRowIndex: number) => {
      // Resolve the index within the *full* reorderable dataset, since
      // paginatedData may be filtered/sorted/paginated relative to it.
      const row = paginatedData[paginatedRowIndex]
      const sourceKey = getRowKey(row, paginatedRowIndex)
      const sourceIndex = reorderableData.findIndex(
        (r, i) => getRowKey(r, i) === sourceKey
      )
      setDragSourceIndex(sourceIndex)
      e.dataTransfer.effectAllowed = 'move'
    },
    // paginatedData/getRowKey/reorderableData are defined below via useMemo/useCallback;
    // this callback is re-created each render which is fine given its cheap body.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reorderableData]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent, paginatedTargetIndex: number) => {
      e.preventDefault()
      if (dragSourceIndex === null) return

      const targetRow = paginatedData[paginatedTargetIndex]
      const targetKey = getRowKey(targetRow, paginatedTargetIndex)
      const targetIndex = reorderableData.findIndex(
        (r, i) => getRowKey(r, i) === targetKey
      )

      if (targetIndex === -1 || dragSourceIndex === targetIndex) {
        setDragSourceIndex(null)
        return
      }

      const newData = [...reorderableData]
      const [movedRow] = newData.splice(dragSourceIndex, 1)
      newData.splice(targetIndex, 0, movedRow)

      setReorderableData(newData)
      onReorder?.(newData)
      setDragSourceIndex(null)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dragSourceIndex, reorderableData, onReorder]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showColumnMenu &&
        settingButtonRef.current &&
        !settingButtonRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setShowColumnMenu(false)
        setMenuPosition(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showColumnMenu])

  // --- MEMOIZED COMPUTATIONS ---

  const getRowKey = useCallback(
    (row: any, index: number): string | number => {
      return row?.[rowKey] ?? `row-${index}`
    },
    [rowKey]
  )

  const processedData = useMemo(() => {
    let result = [...reorderableData]

    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const cellValue = String(row[key] ?? '').toLowerCase()
          return cellValue.includes(filterValue.toLowerCase())
        })
      }
    })

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(row =>
        columns.some(col => {
          const val = String(row[col.key] ?? '').toLowerCase()
          return val.includes(searchLower)
        })
      )
    }

    if (sortConfig.length > 0) {
      result.sort((a, b) => {
        for (const sort of sortConfig) {
          const column = columns.find(c => c.key === sort.key)
          let aVal = a[sort.key]
          let bVal = b[sort.key]

          if (aVal === bVal) continue
          if (aVal == null) return sort.direction === 'asc' ? -1 : 1
          if (bVal == null) return sort.direction === 'asc' ? 1 : -1

          // Type-aware comparison based on the column's declared dataType,
          // so numbers/dates stored as strings sort correctly instead of
          // falling back to lexicographic string comparison.
          let comparison: number
          if (column?.dataType === 'number') {
            const aNum = Number(aVal)
            const bNum = Number(bVal)
            comparison = aNum < bNum ? -1 : aNum > bNum ? 1 : 0
          } else if (column?.dataType === 'date') {
            const aTime = new Date(aVal).getTime()
            const bTime = new Date(bVal).getTime()
            comparison = aTime < bTime ? -1 : aTime > bTime ? 1 : 0
          } else if (column?.dataType === 'boolean') {
            comparison = aVal === bVal ? 0 : aVal ? 1 : -1
          } else {
            comparison = String(aVal).localeCompare(String(bVal))
          }

          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    return result
  }, [reorderableData, filters, search, sortConfig, columns])
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData
    const start = (currentPage - 1) * internalPageSize
    return processedData.slice(start, start + internalPageSize)
  }, [processedData, pagination, currentPage, internalPageSize])

  const totalPages = useMemo(
    () => (pagination ? Math.ceil(processedData.length / internalPageSize) : 1),
    [processedData.length, pagination, internalPageSize]
  )

  const displayColumns = useMemo(
    () => columns.filter(col => !col.hidden && visibleColumns.has(col.key)),
    [columns, visibleColumns]
  )

  const paginatedColumns = useMemo(() => {
    return displayColumns.slice(
      visibleColumnStart,
      visibleColumnStart + visibleColumnCount
    )
  }, [displayColumns, visibleColumnStart, visibleColumnCount])

  const canScrollLeft = visibleColumnStart > 0
  const canScrollRight =
    visibleColumnStart + visibleColumnCount < displayColumns.length

  const leftHidden = visibleColumnStart
  const rightHidden =
    displayColumns.length - (visibleColumnStart + visibleColumnCount)

  const allSelected = useMemo(
    () =>
      paginatedData.length > 0 &&
      paginatedData.every((row, idx) => selectedRows.has(getRowKey(row, idx))),
    [paginatedData, selectedRows, getRowKey]
  )

  const selectedRowsData = useMemo(
    () =>
      paginatedData.filter((row, idx) => selectedRows.has(getRowKey(row, idx))),
    [paginatedData, selectedRows, getRowKey]
  )

  // --- CALLBACKS ---

  const handleSort = useCallback(
    (columnKey: string) => {
      setSortConfig(prev => {
        const existingIndex = prev.findIndex(s => s.key === columnKey)
        let newConfig: ISortConfig[]

        if (existingIndex === -1) {
          newConfig = [...prev, { key: columnKey, direction: 'asc' }]
        } else if (prev[existingIndex].direction === 'asc') {
          newConfig = prev.map((s, i) =>
            i === existingIndex ? { ...s, direction: 'desc' } : s
          )
        } else {
          newConfig = prev.filter((_, i) => i !== existingIndex)
        }

        onSort?.(newConfig)
        return newConfig
      })
    },
    [onSort]
  )

  const getSortDirection = useCallback(
    (columnKey: string): 'asc' | 'desc' | null => {
      const sort = sortConfig.find(s => s.key === columnKey)
      return sort ? sort.direction : null
    },
    [sortConfig]
  )

  const toggleRow = useCallback(
    (row: any, index: number) => {
      const key = getRowKey(row, index)
      setSelectedRows(prev => {
        const newSet = new Set(prev)
        if (newSet.has(key)) {
          newSet.delete(key)
        } else {
          newSet.add(key)
        }

        const selectedData = paginatedData.filter((r, i) =>
          newSet.has(getRowKey(r, i))
        )
        onSelect?.(selectedData)
        return newSet
      })
    },
    [getRowKey, paginatedData, onSelect]
  )

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedRows(new Set())
      onSelect?.([])
    } else {
      const newSet = new Set(
        paginatedData.map((row, idx) => getRowKey(row, idx))
      )
      setSelectedRows(newSet)
      onSelect?.(paginatedData)
    }
  }, [allSelected, paginatedData, getRowKey, onSelect])

  // Modal Handlers
  const handleAddClick = useCallback(() => {
    setAddFormData({})
    setAddModalOpen(true)
    onAdd?.()
  }, [onAdd])

  const handleAddConfirm = useCallback(() => {
    onAddSubmit?.(addFormData)
    setAddModalOpen(false)
  }, [addFormData, onAddSubmit])

  const handleEditClick = useCallback(
    (row: any) => {
      setSelectedRowForAction(row)
      setEditFormData({ ...row })
      setEditModalOpen(true)
      onEdit?.(row)
    },
    [onEdit]
  )

  const handleEditConfirm = useCallback(() => {
    onEditSubmit?.(editFormData)
    setEditModalOpen(false)
    setSelectedRowForAction(null)
  }, [editFormData, onEditSubmit])

  const handleDeleteClick = useCallback(
    (row: any) => {
      setSelectedRowForAction(row)
      setDeleteModalOpen(true)
      onDelete?.(row)
    },
    [onDelete]
  )

  const handleDeleteConfirm = useCallback(() => {
    if (selectedRowForAction) {
      onDeleteConfirm?.(selectedRowForAction)
    }
    setDeleteModalOpen(false)
    setSelectedRowForAction(null)
  }, [selectedRowForAction, onDeleteConfirm])

  // Bulk delete now opens the shared delete confirmation modal instead of
  // the native window.confirm(), keeping the interaction consistent with
  // the rest of the CRUD flows.
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)

  const handleBulkDelete = useCallback(() => {
    if (selectedRowsData.length === 0) return
    setBulkDeleteModalOpen(true)
  }, [selectedRowsData])

  const handleBulkDeleteConfirm = useCallback(() => {
    onBulkDelete?.(selectedRowsData)
    setSelectedRows(new Set())
    setBulkDeleteModalOpen(false)
  }, [selectedRowsData, onBulkDelete])

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value)
      setCurrentPage(1)
      onSearch?.(value)
    },
    [onSearch]
  )

  const handleFilterChange = useCallback(
    (columnKey: string, value: string) => {
      setFilters(prev => {
        const newFilters = { ...prev, [columnKey]: value }
        onFilter?.(newFilters)
        return newFilters
      })
      setCurrentPage(1)
    },
    [onFilter]
  )

  const toggleExpand = useCallback((rowKey: string | number) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowKey]: !prev[rowKey]
    }))
  }, [])

  const handleInlineEdit = useCallback(
    (rowIndex: number, columnKey: string, value: any) => {
      setInlineEdit({ rowIndex, columnKey, value })
    },
    []
  )

  const saveInlineEdit = useCallback(
    (newValue: any) => {
      if (inlineEdit.rowIndex !== null && inlineEdit.columnKey) {
        const row = paginatedData[inlineEdit.rowIndex]
        if (row) {
          const updatedRow = { ...row, [inlineEdit.columnKey]: newValue }
          onEdit?.(updatedRow)
        }
      }
      setInlineEdit({ rowIndex: null, columnKey: null, value: null })
    },
    [inlineEdit, paginatedData, onEdit]
  )

  const cancelInlineEdit = useCallback(() => {
    setInlineEdit({ rowIndex: null, columnKey: null, value: null })
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return
      setCurrentPage(page)
      onPageChange?.(page)
    },
    [totalPages, onPageChange]
  )

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey)
      } else {
        newSet.add(columnKey)
      }
      return newSet
    })
  }, [])

  const handleScrollColumnsLeft = useCallback(() => {
    setVisibleColumnStart(prev => Math.max(0, prev - 1))
  }, [])

  const handleScrollColumnsRight = useCallback(() => {
    setVisibleColumnStart(prev => {
      const maxStart = Math.max(0, displayColumns.length - visibleColumnCount)
      return Math.min(maxStart, prev + 1)
    })
  }, [displayColumns.length, visibleColumnCount])

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnKey: string, currentWidth: number) => {
      if (!enableColumnResize) return
      setResizingColumn(columnKey)
      setStartX(e.clientX)
      setStartWidth(currentWidth)
      e.preventDefault()
    },
    [enableColumnResize]
  )

  useEffect(() => {
    if (!resizingColumn) return

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX
      const newWidth = Math.max(50, startWidth + diff)
      setColumnWidths(prev => ({ ...prev, [resizingColumn]: newWidth }))
    }

    const handleMouseUp = () => {
      setResizingColumn(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizingColumn, startX, startWidth])
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // اگر کلیک روی دکمهٔ More نبود، همهٔ تولتیپ‌ها را ببند
      const target = e.target as HTMLElement
      if (!target.closest('.more-button')) {
        setTooltipOpen({})
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])
  useEffect(() => {
    setCurrentPage(1)
  }, [data.length])

  useEffect(() => {
    setVisibleColumnStart(0)
  }, [columns.length])
  useEffect(() => {
    setReorderableData(data || [])
  }, [data])
  useEffect(() => {
    setInternalPageSize(pageSize)
  }, [pageSize])
  // --- RENDER HELPERS ---

  const renderSortIcon = (columnKey: string) => {
    const direction = getSortDirection(columnKey)
    if (!direction)
      return <Sort size={14} className='stroke-gray-700 dark:stroke-gray-500' />
    if (direction === 'asc')
      return <ArrowUp3 variant='Bulk' size={14} color='#4b5563' />
    return <ArrowDown3 size={14} variant='Bulk' color='#4b5563' />
  }

  // ============================================
  // داخل کامپوننت اصلی (مثلاً TableLinear)
  // ============================================

  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  // تابع renderPagination اصلاح شده
  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null

    const rowsPerPageValue = rowsPerPage
    const totalItems = processedData.length
    const start = (currentPage - 1) * rowsPerPageValue + 1
    const end = Math.min(currentPage * rowsPerPageValue, totalItems)

    const pages: (number | string)[] = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        )
      }
    }

    // تابع مدیریت تغییر تعداد ردیف در هر صفحه
    const handleRowsPerPageChange = (value: any) => {
      const newSize = Number(value)
      setRowsPerPage(newSize) // به‌روزرسانی state
      setInternalPageSize(newSize) // اگر داخل کامپوننت دارید
      onRowsPerPageChange?.(newSize) // در صورت نیاز به والد
      handlePageChange(1) // رفتن به صفحه اول
    }

    return (
      <footer
        className='sticky bottom-0 z-40 flex items-center justify-between gap-2 px-4 py-3 
                 border-t border-neutral-border
                 bg-neutral
                 backdrop-blur-md'
      >
        {/* بخش چپ: بازه ردیف‌ها */}
        <span className='text-sm text-neutral-text whitespace-nowrap'>
          {start} – {end} of {totalItems}
        </span>

        <div className='flex items-center gap-6'>
          {/* بخش وسط: انتخاب تعداد ردیف در هر صفحه */}
          <div className='flex items-center gap-3 text-sm text-neutral-text whitespace-nowrap'>
            <div className='flex items-center gap-1'>
              <span>Rows per page:</span>
              <DropdownLarge
                logic={{
                  options: [
                    { key: 1, label: '10', value: '10' },
                    { key: 2, label: '20', value: '20' },
                    { key: 3, label: '50', value: '50' },
                    { key: 4, label: '100', value: '100' }
                  ],
                  onChange: handleRowsPerPageChange,
                  searchable: false,
                  clearable: false,
                  value: String(rowsPerPage),
                  bordered: false
                }}
              />
            </div>
          </div>

          {/* بخش راست: دکمه‌های ناوبری صفحه */}
          <div className='flex items-center gap-3'>
            <Button
              logic={{
                onClick: () => handlePageChange(currentPage - 1),
                variant: 'default',
                state: currentPage === 1 ? 'disabled' : 'active',
                icon: <ArrowLeft2 size={18} />,
                size: 'xs'
              }}
            />
            <span>
              {currentPage} / {totalPages}
            </span>
            <Button
              logic={{
                onClick: () => handlePageChange(currentPage + 1),
                variant: 'default',
                state: currentPage === totalPages ? 'disabled' : 'active',
                icon: <ArrowRight2 size={18} />,
                size: 'xs'
              }}
            />
          </div>
        </div>
      </footer>
    )
  }
  const renderAgreeBar = () => {
    if (!agreeBar) return null

    const summaries = summaryData || [
      { label: 'Total Records', value: processedData.length },
      { label: 'Selected', value: selectedRowsData.length },
      { label: 'Filtered', value: processedData.length },
      { label: 'Pages', value: totalPages },
      { label: 'Current Page', value: currentPage }
    ]

    return (
      <section className='flex gap-3 px-4 pb-3 overflow-x-auto'>
        {summaries.map((item, idx) => (
          <div
            key={idx}
            className='flex h-11 flex-1 min-w-[120px] items-center justify-between 
                       rounded-lg bg-neutral px-4 py-2 shadow-sm border border-neutral-border
                       hover:shadow-sm transition-shadow hover:shadow-neutral-ring'
          >
            <span className='text-sm text-neutral-text font-medium'>
              {item.label}
            </span>
            <span className='text-sm font-bold text-primary'>{item.value}</span>
          </div>
        ))}
      </section>
    )
  }

  // --- MODAL RENDERERS ---

  const renderAddModal = () => {
    if (!enableAddModal) return null

    const config = modalConfig.add || {}

    return (
      <ModalBase
        logic={{
          isOpen: addModalOpen,
          onOpenChange: setAddModalOpen,
          title: config.title || `Add New ${title}`,
          description:
            config.description ||
            `Fill in the details to add a new ${title.toLowerCase()}.`,
          size: config.size || 'md',
          confirmText: config.confirmText || 'Add',
          cancelText: config.cancelText || 'Cancel',
          confirmButtonVariant: 'success',
          onConfirm: handleAddConfirm,
          onCancel: () => setAddModalOpen(false),
          closeOnBackdropClick: true,
          closeOnEscapeKey: true,
          children: (
            <div className='space-y-4'>
              {columns
                .filter(c => !c.hidden && c.key !== rowKey)
                .map(column => (
                  <div key={column.key} className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {column.title}
                    </label>
                    <input
                      type={column.dataType === 'number' ? 'number' : 'text'}
                      value={addFormData[column.key] || ''}
                      onChange={e =>
                        setAddFormData((prev: any) => ({
                          ...prev,
                          [column.key]: e.target.value
                        }))
                      }
                      placeholder={`Enter ${column.title}`}
                      className='h-9 rounded-lg border border-gray-200 dark:border-gray-600 px-3 text-sm
                           focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                           placeholder:text-gray-400 dark:placeholder:text-gray-500'
                    />
                  </div>
                ))}
            </div>
          )
        }}
        style={{
          compact: true
        }}
      />
    )
  }

  const renderEditModal = () => {
    if (!enableEditModal) return null

    const config = modalConfig.edit || {}

    return (
      <ModalBase
        logic={{
          isOpen: editModalOpen,
          onOpenChange: setEditModalOpen,
          title: config.title || `Edit ${title}`,
          description:
            config.description ||
            `Update the details for this ${title.toLowerCase()}.`,
          size: config.size || 'md',
          confirmText: config.confirmText || 'Save Changes',
          cancelText: config.cancelText || 'Cancel',
          confirmButtonVariant: 'primary',
          children: (
            <div className='space-y-4'>
              {columns
                .filter(c => !c.hidden && c.key !== rowKey)
                .map(column => (
                  <div key={column.key} className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {column.title}
                    </label>
                    <input
                      type={column.dataType === 'number' ? 'number' : 'text'}
                      value={editFormData[column.key] || ''}
                      onChange={e =>
                        setEditFormData((prev: any) => ({
                          ...prev,
                          [column.key]: e.target.value
                        }))
                      }
                      placeholder={`Enter ${column.title}`}
                      className='h-9 rounded-lg border border-gray-200 dark:border-gray-600 px-3 text-sm
                           focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                           placeholder:text-gray-400 dark:placeholder:text-gray-500'
                    />
                  </div>
                ))}
            </div>
          ),
          onConfirm: handleEditConfirm,
          onCancel: () => {
            setEditModalOpen(false)
            setSelectedRowForAction(null)
          },
          closeOnBackdropClick: true,
          closeOnEscapeKey: true
        }}
        style={{
          compact: true
        }}
      />
    )
  }

  const renderDeleteModal = () => {
    if (!enableDeleteModal) return null

    const config = modalConfig.delete || {}

    return (
      <ModalBase
        logic={{
          isOpen: deleteModalOpen,
          onOpenChange: setDeleteModalOpen,
          title: config.title || 'Confirm Deletion',
          description:
            config.description ||
            `Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`,
          variant: 'error',
          size: config.size || 'sm',
          confirmText: config.confirmText || 'Delete',
          cancelText: config.cancelText || 'Cancel',
          confirmButtonVariant: config.confirmButtonVariant || 'danger',
          cancelButtonVariant: 'ghost',
          onConfirm: handleDeleteConfirm,
          onCancel: () => {
            setDeleteModalOpen(false)
            setSelectedRowForAction(null)
          },
          closeOnBackdropClick: true,
          closeOnEscapeKey: true
        }}
        style={{
          compact: true
        }}
      />
    )
  }

  // Confirmation modal for bulk delete — replaces the native window.confirm()
  // so bulk delete matches the same modal-driven UX as single-row delete.
  const renderBulkDeleteModal = () => {
    if (!enableDeleteModal) return null

    return (
      <ModalBase
        logic={{
          isOpen: bulkDeleteModalOpen,
          onOpenChange: setBulkDeleteModalOpen,
          title: 'Confirm Bulk Deletion',
          description: `Are you sure you want to delete ${selectedRowsData.length} selected row(s)? This action cannot be undone.`,
          variant: 'error',
          size: 'sm',
          confirmText: 'Delete',
          cancelText: 'Cancel',
          confirmButtonVariant: 'danger',
          cancelButtonVariant: 'ghost',
          onConfirm: handleBulkDeleteConfirm,
          onCancel: () => setBulkDeleteModalOpen(false),
          closeOnBackdropClick: true,
          closeOnEscapeKey: true
        }}
        style={{
          compact: true
        }}
      />
    )
  }

  // --- MAIN RENDER ---

  return (
    <>
      <section
        className={`overflow-hidden rounded-xl border border-neutral-border bg-[#f4f7fc] tablebg shadow-sm shadow-neutral-ring`}
        style={{
          width: geo?.width,
          height: geo?.height,
          fontSize
        }}
      >
        {/* Table Header Toolbar */}
        <header className='flex flex-wrap items-center justify-between gap-3 rounded-t-xl px-4 py-3 bg-[#f4f7fc] tablebg backdrop-blur-sm'>
          <div className='flex items-center gap-4'>
            <h3 className='text-sm font-bold text-neutral-text flex items-center gap-2'>
              {title}
            </h3>

            {/* View/Edit Toggle */}
            <div className='inline-flex bg-neutral  rounded-lg p-0.5 border border-neutral-border text-neutral-text'>
              <button
                onClick={() => setIsEditMode('view')}
                className={`flex items-center justify-center gap-1.5 px-4 h-7 rounded-md text-sm font-medium transition-all duration-200
                  ${
                    isEditMode === 'view'
                      ? 'text-primary-active-text bg-primary shadow-sm stroke-primary-active-text'
                      : 'text-neutral-text hover:text-neutral-hover-text stroke-neutral-text hover:stroke-neutral-hover-text'
                  }`}
              >
                <MoreSquare size={16} />
                View
              </button>
              <button
                onClick={() => setIsEditMode('edit')}
                className={`flex items-center justify-center gap-1.5 px-4 h-7 rounded-md text-sm font-medium transition-all duration-200
                  ${
                    isEditMode === 'edit'
                      ? 'text-primary-active-text bg-primary shadow-sm stroke-primary-active-text'
                      : 'ext-neutral-text hover:text-neutral-hover-text stroke-neutral-text hover:stroke-neutral-hover-text'
                  }`}
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {/* Add Button - Opens Add Modal */}
            {enableAddModal && (
              <Button
                logic={{
                  onClick: handleAddClick,
                  variant: 'outline',
                  icon: <AddCircle size={16} className='stroke-primary-text' />,
                  content: addButtonText,
                  size: 'sm'
                }}
              />
            )}

            {/* Column Visibility Toggle */}
            <div className='relative'>
              <button
                ref={settingButtonRef}
                onClick={() => {
                  if (showColumnMenu) {
                    setShowColumnMenu(false)
                    setMenuPosition(null)
                  } else {
                    const rect =
                      settingButtonRef.current?.getBoundingClientRect()
                    if (rect) {
                      setMenuPosition({
                        top: rect.bottom + window.scrollY + 4,
                        left: rect.left + window.scrollX
                      })
                    }
                    setShowColumnMenu(true)
                  }
                }}
                className='h-8 w-8 flex items-center justify-center rounded-lg border border-neutral-border hover:border-neutral-hover-border'
                title='Column Management'
              >
                <Setting2 size={16} className='stroke-neutral-text' />
              </button>
              {showColumnMenu &&
                menuPosition &&
                createPortal(
                  <div
                    ref={menuRef}
                    className='fixed bg-neutral text-neutral-text rounded-lg shadow-lg border border-neutral-border py-2'
                    style={{
                      top: menuPosition.top,
                      left: menuPosition.left,
                      minWidth: 80,
                      zIndex: 9999
                    }}
                  >
                    <div className='px-3 py-1.5 text-sm font-bold text-neutral-text border-b border-neutral-border mb-1'>
                      Show columns
                    </div>
                    {columns.map(col => (
                      <label
                        key={col.key}
                        className='flex items-center gap-2 px-3 py-1.5 cursor-pointer '
                      >
                        <Input
                          logic={{
                            type: 'checkbox',
                            size: 'sm',
                            state: 'normal',
                            value: visibleColumns.has(col.key),
                            onChange: () => toggleColumnVisibility(col.key)
                          }}
                        />
                        <span className='text-sm text-neutral-text '>
                          {col.title}
                        </span>
                      </label>
                    ))}
                  </div>,
                  document.body
                )}
            </div>

            {/* Search */}

            <Input
              logic={{
                size: 'sm',
                type: 'search',
                variant: 'fill',
                placeholder: 'search . . . ',
                onChange: value => handleSearch(value),
                value: search
              }}
            />
            {/* Bulk Actions */}
            {selectedRowsData.length > 0 && (
              <div className='flex items-center gap-2 bg-danger  rounded-lg px-3 py-1'>
                <span className='text-sm text-danger-text font-medium'>
                  {selectedRowsData.length} Selected
                </span>
                <Button
                  logic={{
                    onClick: handleBulkDelete,
                    variant: 'text',
                    size: 'xs',
                    icon: <Trash size={16} className='stroke-neutral-text' />
                  }}
                />
                <Button
                  logic={{
                    onClick: () => {
                      setSelectedRows(new Set())
                      onSelect?.([])
                    },
                    variant: 'text',
                    size: 'xs',
                    icon: (
                      <CloseCircle size={16} className='stroke-neutral-text' />
                    )
                  }}
                />
              </div>
            )}
          </div>
        </header>

        {/* Agree Bar */}
        {renderAgreeBar()}

        {/* Table Container */}
        <div
          ref={tableContainerRef}
          className='overflow-auto custom-scrollbar'
          style={{ maxHeight: geo?.maxHeight || '600px' }}
        >
          <table className='w-full border-collapse  '>
            {/* Table Head - Sticky */}
            <thead
              className='sticky top-0 table-header-bg-dark table-header-bg-light'
              style={{ zIndex: 30 }}
            >
              <tr
                className='h-10 text-left text-sm table-header-bg-dark table-header-bg-light'
                style={{ backgroundColor: 'var(--table-header-bg)' }}
              >
                {/* ===== سلول کنترل چپ (جایگزین #/همبرگر) ===== */}
                <th
                  className='px-1 w-12 sticky left-0 z-30 text-center table-header-bg-dark table-header-bg-light'
                  style={{ backgroundColor: 'var(--table-header-bg)', left: 0 }}
                >
                  <div className='flex items-center justify-center gap-0.5'>
                    <Button
                      logic={{
                        onClick: handleScrollColumnsLeft,
                        variant: 'text',
                        size: 'xs',
                        icon: (
                          <ArrowLeft2
                            size={16}
                            className='stroke-neutral-text'
                          />
                        ),
                        badge: leftHidden > 0 ? leftHidden : null,
                        badgeColor: 'primary',
                        badgePosition: 'top-left'
                      }}
                    />
                  </div>
                </th>

                {/* ===== ستون انتخاب (checkbox) ===== */}
                {selection && (
                  <th
                    className='px-3 w-10 sticky left-0 z-20 table-header-bg-dark table-header-bg-light'
                    style={{
                      backgroundColor: 'var(--table-header-bg)',
                      left: '48px'
                    }}
                  >
                    <Input
                      logic={{
                        type: 'checkbox',
                        size: 'sm',
                        state: 'normal',
                        value: allSelected,
                        onChange: toggleAll
                      }}
                    />
                  </th>
                )}

                {/* ===== ستون‌های داده (قابل پیمایش) ===== */}
                {paginatedColumns.map(column => (
                  <th
                    key={column.key}
                    className='px-3 relative group select-none'
                    style={{
                      width: columnWidths[column.key] || column.width,
                      minWidth: column.minWidth || 80,
                      textAlign: column.align || 'left'
                    }}
                  >
                    <div className='flex items-center gap-1'>
                      <span className='font-semibold text-neutral-text'>
                        {column.title}
                      </span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.key)}
                          className='p-0.5 rounded hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors'
                          aria-label={`Sort by ${column.title}`}
                        >
                          {renderSortIcon(column.key)}
                        </button>
                      )}
                    </div>

                    {/* Column Filter */}
                    {column.filterable && (
                      <ColumnFilter
                        column={column}
                        value={filters[column.key] || ''}
                        onChange={val => handleFilterChange(column.key, val)}
                      />
                    )}

                    {/* Resize Handle */}
                    {enableColumnResize && (
                      <div
                        className='absolute right-0 top-0 h-full w-1 cursor-col-resize 
                                   hover:bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity'
                        onMouseDown={e =>
                          handleResizeStart(
                            e,
                            column.key,
                            (columnWidths[column.key] ||
                              (typeof column.width === 'number'
                                ? column.width
                                : 150)) as number
                          )
                        }
                      />
                    )}
                  </th>
                ))}
                {/* ===== ستون اکشن (ثابت در راست) ===== */}
                <th
                  className='px-3 sticky right-0 z-20 table-header-bg-dark table-header-bg-light'
                  style={{ backgroundColor: 'var(--table-header-bg)' }}
                >
                  <div className='flex items-center justify-between gap-2'>
                    <Setting2 size={24} className='stroke-neutral-text' />

                    <div className=' flex items-center gap-1'>
                      <Button
                        logic={{
                          onClick: handleScrollColumnsRight,
                          variant: 'text',
                          size: 'xs',
                          icon: (
                            <ArrowRight2
                              size={16}
                              className='stroke-neutral-text'
                            />
                          ),
                          badge: rightHidden > 0 ? rightHidden : null,
                          badgeColor: 'primary'
                        }}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            {loading ? (
              <TableSkeleton columns={paginatedColumns} rowCount={5} />
            ) : paginatedData.length === 0 ? (
              <EmptyState text={emptyText} />
            ) : (
              <tbody>
                {paginatedData.map((row, rowIndex) => {
                  const key = getRowKey(row, rowIndex)
                  const isSelected = selectedRows.has(key)
                  const isExpanded = expandedRows[key]
                  const rowBgColor = isSelected
                    ? 'var(--row-selected-bg)'
                    : rowIndex % 2 === 1
                    ? 'var(--row-odd-bg)'
                    : 'var(--row-even-bg)'

                  const colSpanCount =
                    paginatedColumns.length + (selection ? 1 : 0) + 3

                  return (
                    <React.Fragment key={key}>
                      <tr
                        className={`h-10 transition-colors duration-150 cursor-pointer text-neutral-text`}
                        onClick={() => onRowClick?.(row, rowIndex)}
                        style={{
                          backgroundColor: rowBgColor
                        }}
                        onDoubleClick={() => {
                          if (isEditMode === 'edit') {
                            const firstEditable = paginatedColumns.find(
                              c => c.editable
                            )
                            if (firstEditable) {
                              handleInlineEdit(
                                rowIndex,
                                firstEditable.key,
                                row[firstEditable.key]
                              )
                            }
                          }
                        }}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            toggleRow(row, rowIndex)
                          }
                        }}
                        role='row'
                        aria-selected={isSelected}
                      >
                        <td
                          className='px-3 sticky left-0 z-10 text-center text-sm text-neutral-text'
                          style={{
                            backgroundColor: rowBgColor,
                            left: selection ? '0' : '0'
                          }}
                        >
                          {isEditMode === 'edit' ? (
                            <div
                              draggable
                              onDragStart={e => handleDragStart(e, rowIndex)}
                              onDragOver={e => e.preventDefault()}
                              onDrop={e => handleDrop(e, rowIndex)}
                              className='cursor-grab flex justify-center items-center py-1 active:cursor-grabbing text-neutral-text'
                            >
                              <HambergerMenu
                                size={14}
                                className='stroke-gray-400 dark:stroke-gray-500'
                              />
                            </div>
                          ) : (
                            // در حالت نمایش: شماره ردیف (بر اساس اندازه صفحه‌ی فعلی)
                            (currentPage - 1) * internalPageSize + rowIndex + 1
                          )}
                        </td>
                        {selection && (
                          <td
                            className='px-3 sticky left-0 z-20 text-neutral-text'
                            style={{ backgroundColor: rowBgColor, top: '40px' }}
                            onClick={e => e.stopPropagation()}
                          >
                            <Input
                              logic={{
                                type: 'checkbox',
                                size: 'sm',
                                state: 'normal',
                                value: isSelected,
                                onChange: () => toggleRow(row, rowIndex)
                              }}
                            />
                          </td>
                        )}

                        {/* ستون‌های داده */}
                        {paginatedColumns.map(column => (
                          <td
                            key={column.key}
                            className='px-3 text-sm text-neutral-text'
                            style={{ textAlign: column.align || 'left' }}
                          >
                            {inlineEdit.rowIndex === rowIndex &&
                            inlineEdit.columnKey === column.key ? (
                              <InlineEditCell
                                value={inlineEdit.value}
                                dataType={column.dataType}
                                onSave={saveInlineEdit}
                                onCancel={cancelInlineEdit}
                              />
                            ) : column.render ? (
                              column.render(row[column.key], row, rowIndex)
                            ) : (
                              <span
                                className={
                                  column.editable && isEditMode === 'edit'
                                    ? 'border-b border-dashed border-cyan-300 dark:border-cyan-600 cursor-text hover:bg-cyan-50 dark:hover:bg-cyan-900/30 px-1 rounded'
                                    : ''
                                }
                                onDoubleClick={e => {
                                  e.stopPropagation()
                                  if (
                                    column.editable &&
                                    isEditMode === 'edit'
                                  ) {
                                    handleInlineEdit(
                                      rowIndex,
                                      column.key,
                                      row[column.key]
                                    )
                                  }
                                }}
                              >
                                {row[column.key] ?? '-'}
                              </span>
                            )}
                          </td>
                        ))}

                        {/* Fixed Action Column */}
                        <td
                          className='px-3 w-12 sticky z-10'
                          style={{
                            backgroundColor: rowBgColor,
                            top: '40px',
                            right: 0
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          <div className='flex items-center justify-between gap-4'>
                            {logic?.actions?.expand && (
                              <button
                                onClick={() => toggleExpand(key)}
                                className='flex size-7 items-center justify-center rounded-md 
                                           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                              >
                                {isExpanded ? (
                                  <ArrowUp2
                                    size={16}
                                    className='stroke-neutral-text'
                                  />
                                ) : (
                                  <ArrowDown2
                                    size={16}
                                    className='stroke-neutral-text'
                                  />
                                )}
                              </button>
                            )}

                            {isEditMode === 'edit' ? (
                              <>
                                {/* Edit Button - Opens Edit Modal (gated on actions.edit when provided) */}
                                {enableEditModal &&
                                  (logic?.actions?.edit ?? true) && (
                                    <button
                                      onClick={() => handleEditClick(row)}
                                      className='flex size-7 items-center justify-center rounded-md 
                                               hover:bg-success-hover-bg hover:stroke-success-text hover:text-success-text text-neutral-text stroke-neutral-text transition-colors'
                                      title='Edit'
                                    >
                                      <Edit size={20} className='' />
                                    </button>
                                  )}
                                {/* Delete Button - Opens Delete Modal (gated on actions.delete when provided) */}
                                {enableDeleteModal &&
                                  (logic?.actions?.delete ?? true) && (
                                    <button
                                      onClick={() => handleDeleteClick(row)}
                                      className='flex size-7 items-center justify-center rounded-md 
                                               hover:bg-danger-hover-bg text-danger-text stroke-danger-text transition-colors'
                                      title='Delete'
                                    >
                                      <Trash size={20} />
                                    </button>
                                  )}
                              </>
                            ) : (
                              <>
                                <Tooltip
                                  logic={{
                                    children: (
                                      <button
                                        className='flex size-7 items-center justify-center rounded-md 
                   hover:bg-neutral-hover-bg transition-colors'
                                        title='Details'
                                      >
                                        <MoreSquare
                                          size={20}
                                          className='stroke-neutral-text'
                                        />
                                      </button>
                                    ),
                                    placement: 'left',
                                    content:
                                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui nulla blanditiis magnam dolorem error quae recusandae rem pariatur cumque facilis sit cum et quaerat, delectus obcaecati libero labore molestias? Aut.',
                                    trigger: 'click'
                                  }}
                                />

                                <button
                                  className='flex size-7 items-center justify-center rounded-md 
                                             hover:bg-neutral-hover-bg transition-colors'
                                  title='Go to'
                                >
                                  <Login
                                    size={20}
                                    className='stroke-neutral-text'
                                  />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row Content */}
                      {isExpanded && logic?.actions?.expand && (
                        <tr>
                          <td
                            colSpan={colSpanCount}
                            className='px-4 py-3 bg-neutral-disabled-bg border border-neutral-border'
                          >
                            <div className='text-sm text-neutral-text'>
                              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                {paginatedColumns.map(col => (
                                  <div
                                    key={col.key}
                                    className='flex flex-col gap-1'
                                  >
                                    <span className='text-neutral-active-text font-medium'>
                                      {col.title}
                                    </span>
                                    <span className='font-medium text-neutral-disabled-text'>
                                      {col.render
                                        ? col.render(
                                            row[col.key],
                                            row,
                                            rowIndex
                                          )
                                        : row[col.key] ?? '-'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}

        {/* Print Styles */}
        <style>{`
          @media print {
            .overflow-auto { overflow: visible !important; }
            button, input[type="checkbox"] { display: none !important; }
            tr { page-break-inside: avoid; }
            thead { display: table-header-group; }
          }
        `}</style>
      </section>

      {/* Modals */}
      {renderAddModal()}
      {renderEditModal()}
      {renderDeleteModal()}
      {renderBulkDeleteModal()}
    </>
  )
})

TableLinear.displayName = 'TableLinear'

export default TableLinear
