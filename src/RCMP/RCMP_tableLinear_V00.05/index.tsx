/*------------------------------------------------------------
Meta Data

ID:             RCOM_tableLinear 
Title:          Table Linear Component - Optimized v2.0
Version:        02.00.00
VAR:            01

last-update:    D2026.07.13
owner:          apps68

Description:    Highly optimized table with virtualization, 
                sorting, filtering, column resizing, and more.
------------------------------------------------------------*/

/**************************************
 * Step 01 import dependencies - kernels
 **************************************/
import {
  AddCircle,
  ArrowDown2,
  ArrowUp2,
  CloseCircle,
  DocumentDownload,
  Edit,
  ElementEqual,
  FilterSearch,
  MoreSquare,
  Refresh,
  Send,
  Setting2,
  Sort,
  Trash,
  TickCircle,
} from "iconsax-react";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  memo,
  useId,
} from "react";
import { createPortal } from "react-dom";
// For virtualization (optional - install: npm install @tanstack/react-virtual)
// import { useVirtualizer } from '@tanstack/react-virtual'

/**************************************
 * Step.02:    import dependency - widgets
 **************************************/
import Button from "RCMP/RCMP_button_V00.05";
/**************************************
 * Step.03:    co-actor dependencies
 **************************************/
/**************************************
 * Step 04 - define properties - Static
 **************************************/

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Deep clone helper for immutable updates
 */
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

/**
 * CSV Export utility
 */
const exportToCSV = (
  data: any[],
  columns: IColumn[],
  filename: string = "export",
) => {
  const headers = columns
    .filter((c) => !c.hidden)
    .map((c) => c.title)
    .join(",");
  const rows = data
    .map((row) =>
      columns
        .filter((c) => !c.hidden)
        .map((c) => {
          const val = row[c.key];
          // Escape commas and quotes
          if (
            typeof val === "string" &&
            (val.includes(",") || val.includes('"'))
          ) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val ?? "";
        })
        .join(","),
    )
    .join("\n");

  const csvContent = `\uFEFF${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
// ============================================
// INTERFACES
// ============================================

interface IMetaProps {
  id?: string;
  title?: string;
  version?: string;
  lastUpgrade?: string;
  owner?: string;
  type?: string;
  origin_model?: string;
  origin_model_Ver?: string;
  rem?: string;
}

interface IGeoProps {
  width?: string;
  height?: string;
  maxHeight?: string;
  position?: string;
  zIndex?: string;
}
export interface IColumn {
  key: string;
  title: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  hidden?: boolean;
  align?: "left" | "center" | "right";
  dataType?: "text" | "number" | "date" | "boolean" | "custom";
  render?: (value: any, row: any, index: number) => React.ReactNode;
  filterRender?: (
    value: string,
    onChange: (val: string) => void,
  ) => React.ReactNode;
}

interface ITableEvents {
  onSelect?: (rows: any[]) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onSearch?: (value: string) => void;
  onPageChange?: (page: number) => void;
  onSort?: (sortConfig: ISortConfig[]) => void;
  onFilter?: (filters: Record<string, string>) => void;
  onRowClick?: (row: any, index: number) => void;
  onBulkDelete?: (rows: any[]) => void;
  onExport?: (data: any[]) => void;
}

interface IActionProps {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
  expand?: boolean;
}

interface ISortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface IFilterState {
  [key: string]: string;
}

interface IExpandedRows {
  [key: string | number]: boolean;
}

interface IInlineEditState {
  rowIndex: number | null;
  columnKey: string | null;
  value: any;
}

interface ILogicProps extends ITableEvents {
  columns?: IColumn[];
  data?: any[];
  selection?: boolean;
  pagination?: boolean;
  pageSize?: number;
  editable?: "edit" | "view";
  title?: string;
  agreeBar?: boolean;
  actions?: IActionProps;
  loading?: boolean;
  emptyText?: string;
  enableVirtualization?: boolean;
  virtualItemHeight?: number;
  enableColumnResize?: boolean;
  enableExport?: boolean;
  rowKey?: string;
  summaryData?: { label: string; value: string | number }[];
}

interface IStyleProps {
  headerBg?: string;
  rowHoverBg?: string;
  stripeColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: string;
  compact?: boolean;
}

interface ITableLinearProps {
  meta?: IMetaProps;
  geo?: IGeoProps;
  logic?: ILogicProps;
  style?: IStyleProps;
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
        <tr key={`skeleton-${rowIdx}`} className="h-10">
          <td className="px-3">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          </td>
          {columns
            .filter((c) => !c.hidden)
            .map((col, colIdx) => (
              <td key={`skel-${rowIdx}-${colIdx}`} className="px-3">
                <div
                  className="h-4 animate-pulse rounded bg-gray-200"
                  style={{
                    width: typeof col.width === "number" ? col.width : "80%",
                  }}
                />
              </td>
            ))}
          <td className="px-3">
            <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
          </td>
        </tr>
      ))}
    </tbody>
  ),
);
TableSkeleton.displayName = "TableSkeleton";

/**
 * Empty State Component
 */
const EmptyState = memo(({ text = "No data found." }: { text?: string }) => (
  <tbody>
    <tr>
      <td colSpan={100} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <ElementEqual size={48} className="stroke-gray-300" />
          <p className="text-sm text-gray-400 font-medium">{text}</p>
        </div>
      </td>
    </tr>
  </tbody>
));
EmptyState.displayName = "EmptyState";

/**
 * Column Filter Input
 */
const ColumnFilter = memo(
  ({
    column,
    value,
    onChange,
  }: {
    column: IColumn;
    value: string;
    onChange: (val: string) => void;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    if (column.filterRender) {
      return column.filterRender(value, onChange);
    }

    return (
      <div className="relative mt-1">
        <input
          ref={inputRef}
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Filter ${column.title}...`}
          className="w-full h-7 rounded border border-gray-200 px-2 text-xs 
                   focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500
                   bg-white/80 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        />
        {value && (
          <Button
            logic={{
              onClick: (e) => {
                e.stopPropagation();
                onChange("");
              },
              icon: <CloseCircle size={14} color="#9ca3af" />,
            }}
            style={{
              position: "absolute",
              right: "0.25rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
        )}
      </div>
    );
  },
);
ColumnFilter.displayName = "ColumnFilter";

/**
 * Inline Edit Cell
 */
const InlineEditCell = memo(
  ({
    value,
    dataType,
    onSave,
    onCancel,
  }: {
    value: any;
    dataType?: string;
    onSave: (val: any) => void;
    onCancel: () => void;
  }) => {
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") onSave(editValue);
      if (e.key === "Escape") onCancel();
    };

    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type={dataType === "number" ? "number" : "text"}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => onSave(editValue)}
          className="h-7 w-full rounded border border-cyan-500 px-2 text-xs 
                   focus:outline-none focus:ring-2 focus:ring-cyan-200"
        />
      </div>
    );
  },
);
InlineEditCell.displayName = "InlineEditCell";

// ============================================
// MAIN COMPONENT
// ============================================

const TableLinear = memo(function TableLinear({
  meta,
  geo,
  logic,
  style,
}: ITableLinearProps) {
  /**************************************
   * Step 06 - assignments for this BioWidget
   **************************************/
  const {
    columns = [],
    data = [],
    selection = true,
    pagination = false,
    pageSize = 10,
    editable = "view",
    title = "Table",
    agreeBar = true,
    loading = false,
    emptyText = "No data found.",
    enableVirtualization = false,
    virtualItemHeight = 40,
    enableColumnResize = false,
    enableExport = false,
    rowKey = "id",
    summaryData,
    onSelect,
    onEdit,
    onDelete,
    onSearch,
    onPageChange,
    onSort,
    onFilter,
    onRowClick,
    onBulkDelete,
    onExport,
  } = logic || {};

  const {
    headerBg = "#d9e7ff",
    rowHoverBg = "#f0f7ff",
    stripeColor = "#f9fafc",
    borderColor = "#e2e8f0",
    textColor = "#1e293b",
    fontSize = "0.75rem",
    compact = false,
  } = style || {};

  // --- STATE MANAGEMENT ---
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [isEditMode, setIsEditMode] = useState<"edit" | "view">(editable);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<ISortConfig[]>([]);
  const [filters, setFilters] = useState<IFilterState>({});
  const [expandedRows, setExpandedRows] = useState<IExpandedRows>({});
  const [inlineEdit, setInlineEdit] = useState<IInlineEditState>({
    rowIndex: null,
    columnKey: null,
    value: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.key)),
  );
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const componentId = useId();
  const settingButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showColumnMenu &&
        settingButtonRef.current &&
        !settingButtonRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setShowColumnMenu(false);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColumnMenu]);
  // --- MEMOIZED COMPUTATIONS ---

  /**
   * Generate stable row keys
   */
  const getRowKey = useCallback(
    (row: any, index: number): string | number => {
      return row?.[rowKey] ?? `row-${index}`;
    },
    [rowKey],
  );

  /**
   * Filtered and sorted data - MEMOIZED
   */
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply column filters
    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue) {
        result = result.filter((row) => {
          const cellValue = String(row[key] ?? "").toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply global search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = String(row[col.key] ?? "").toLowerCase();
          return val.includes(searchLower);
        }),
      );
    }

    // Apply sorting
    if (sortConfig.length > 0) {
      result.sort((a, b) => {
        for (const sort of sortConfig) {
          const aVal = a[sort.key];
          const bVal = b[sort.key];

          if (aVal === bVal) continue;
          if (aVal == null) return sort.direction === "asc" ? -1 : 1;
          if (bVal == null) return sort.direction === "asc" ? 1 : -1;

          const comparison = aVal < bVal ? -1 : 1;
          return sort.direction === "asc" ? comparison : -comparison;
        }
        return 0;
      });
    }

    return result;
  }, [data, filters, search, sortConfig, columns]);

  /**
   * Paginated data
   */
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, pagination, currentPage, pageSize]);

  const totalPages = useMemo(
    () => (pagination ? Math.ceil(processedData.length / pageSize) : 1),
    [processedData.length, pagination, pageSize],
  );

  /**
   * Visible columns (respecting hidden prop and visibility toggle)
   */
  const displayColumns = useMemo(
    () => columns.filter((col) => !col.hidden && visibleColumns.has(col.key)),
    [columns, visibleColumns],
  );

  /**
   * All selected flag
   */
  const allSelected = useMemo(
    () =>
      paginatedData.length > 0 &&
      paginatedData.every((row, idx) => selectedRows.has(getRowKey(row, idx))),
    [paginatedData, selectedRows, getRowKey],
  );

  /**
   * Selected rows data
   */
  const selectedRowsData = useMemo(
    () =>
      paginatedData.filter((row, idx) => selectedRows.has(getRowKey(row, idx))),
    [paginatedData, selectedRows, getRowKey],
  );

  // --- CALLBACKS (useCallback) ---

  const handleSort = useCallback(
    (columnKey: string) => {
      setSortConfig((prev) => {
        const existingIndex = prev.findIndex((s) => s.key === columnKey);
        let newConfig: ISortConfig[];

        if (existingIndex === -1) {
          // Add new sort
          newConfig = [...prev, { key: columnKey, direction: "asc" }];
        } else if (prev[existingIndex].direction === "asc") {
          // Change to desc
          newConfig = prev.map((s, i) =>
            i === existingIndex ? { ...s, direction: "desc" } : s,
          );
        } else {
          // Remove sort
          newConfig = prev.filter((_, i) => i !== existingIndex);
        }

        onSort?.(newConfig);
        return newConfig;
      });
    },
    [onSort],
  );

  const getSortDirection = useCallback(
    (columnKey: string): "asc" | "desc" | null => {
      const sort = sortConfig.find((s) => s.key === columnKey);
      return sort ? sort.direction : null;
    },
    [sortConfig],
  );

  const toggleRow = useCallback(
    (row: any, index: number) => {
      const key = getRowKey(row, index);
      setSelectedRows((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }

        const selectedData = paginatedData.filter((r, i) =>
          newSet.has(getRowKey(r, i)),
        );
        onSelect?.(selectedData);
        return newSet;
      });
    },
    [getRowKey, paginatedData, onSelect],
  );

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedRows(new Set());
      onSelect?.([]);
    } else {
      const newSet = new Set(
        paginatedData.map((row, idx) => getRowKey(row, idx)),
      );
      setSelectedRows(newSet);
      onSelect?.(paginatedData);
    }
  }, [allSelected, paginatedData, getRowKey, onSelect]);

  const handleEdit = useCallback(
    (row: any) => {
      onEdit?.(row);
    },
    [onEdit],
  );

  const handleDelete = useCallback(
    (row: any) => {
      if (window.confirm("Are you sure you want to delete this row?")) {
        onDelete?.(row);
      }
    },
    [onDelete],
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedRowsData.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRowsData.length} of these rows? `,
      )
    ) {
      onBulkDelete?.(selectedRowsData);
      setSelectedRows(new Set());
    }
  }, [selectedRowsData, onBulkDelete]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setCurrentPage(1);
      onSearch?.(value);
    },
    [onSearch],
  );

  const handleFilterChange = useCallback(
    (columnKey: string, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [columnKey]: value };
        onFilter?.(newFilters);
        return newFilters;
      });
      setCurrentPage(1);
    },
    [onFilter],
  );

  const toggleExpand = useCallback((rowKey: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  }, []);

  const handleInlineEdit = useCallback(
    (rowIndex: number, columnKey: string, value: any) => {
      setInlineEdit({ rowIndex, columnKey, value });
    },
    [],
  );

  const saveInlineEdit = useCallback(
    (newValue: any) => {
      if (inlineEdit.rowIndex !== null && inlineEdit.columnKey) {
        const row = paginatedData[inlineEdit.rowIndex];
        if (row) {
          const updatedRow = { ...row, [inlineEdit.columnKey]: newValue };
          onEdit?.(updatedRow);
        }
      }
      setInlineEdit({ rowIndex: null, columnKey: null, value: null });
    },
    [inlineEdit, paginatedData, onEdit],
  );

  const cancelInlineEdit = useCallback(() => {
    setInlineEdit({ rowIndex: null, columnKey: null, value: null });
  }, []);

  const handleExport = useCallback(() => {
    const exportData =
      selectedRowsData.length > 0 ? selectedRowsData : processedData;
    if (enableExport) {
      exportToCSV(exportData, displayColumns, title);
    }
    onExport?.(exportData);
  }, [
    selectedRowsData,
    processedData,
    displayColumns,
    title,
    enableExport,
    onExport,
  ]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
      onPageChange?.(page);
    },
    [totalPages, onPageChange],
  );

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  }, []);

  // Column resize handlers
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnKey: string, currentWidth: number) => {
      if (!enableColumnResize) return;
      setResizingColumn(columnKey);
      setStartX(e.clientX);
      setStartWidth(currentWidth);
      e.preventDefault();
    },
    [enableColumnResize],
  );

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      setColumnWidths((prev) => ({ ...prev, [resizingColumn]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn, startX, startWidth]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "a") {
          e.preventDefault();
          toggleAll();
        }
        if (e.key === "e" && enableExport) {
          e.preventDefault();
          handleExport();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleAll, handleExport, enableExport]);

  // Reset page when data changes significantly
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // --- RENDER HELPERS ---

  const renderSortIcon = (columnKey: string) => {
    const direction = getSortDirection(columnKey);
    if (!direction) return <Sort size={14} className="strock-gray-300" />;
    if (direction === "asc") return <ArrowUp2 size={14} color="#4b5563" />;
    return <ArrowDown2 size={14} color="#4b5563" />;
  };

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return (
      <footer className="flex items-center justify-end gap-1 px-4 py-3 border-t border-gray-100">
        <span className="text-xs text-gray-500 ml-2">
          {processedData.length} Rows | Page {currentPage} of {totalPages}
        </span>

        <Button
          logic={{
            onClick: () => handlePageChange(currentPage - 1),
            variant: "outline",
            state: `${currentPage === 1 ? "disabled" : "active"}`,
            content: "Previous",
            size: "small",
            textIconProps: { size: "xs" },
          }}
        />
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`h-8 min-w-[2rem] px-2 rounded-md text-xs font-medium transition-colors
              ${
                page === currentPage
                  ? "bg-cyan-600 text-white"
                  : page === "..."
                    ? "cursor-default text-gray-400"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-3 rounded-md border border-gray-200 text-xs font-medium
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-50 transition-colors"
        >
          Next{" "}
        </button>
      </footer>
    );
  };

  const renderAgreeBar = () => {
    if (!agreeBar) return null;

    const summaries = [
      { label: "agree Bar", value: 10 },
      { label: "agree Bar", value: 10 },
      { label: "agree Bar", value: 10 },
      { label: "agree Bar", value: 10 },
      { label: "agree Bar", value: 10 },
    ];

    return (
      <section className="flex gap-3 px-4 pb-3 overflow-x-auto">
        {summaries.map((item, idx) => (
          <div
            key={idx}
            className="flex h-11 flex-1 min-w-[120px] items-center justify-between 
                       rounded-lg bg-white px-4 py-2 shadow-sm border border-gray-100
                       hover:shadow-md transition-shadow"
          >
            <span className="text-xs text-gray-500 font-medium">
              {item.label}
            </span>
            <span className="text-sm font-bold text-cyan-700">
              {item.value}
            </span>
          </div>
        ))}
      </section>
    );
  };

  // --- MAIN RENDER ---

  return (
    <section
      className="overflow-hidden rounded-xl border border-gray-200 bg-[#f4f7fc] shadow-sm"
      style={{
        width: geo?.width,
        height: geo?.height,
        fontSize,
      }}
    >
      {/* Table Header Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl px-4 py-3 bg-[#f4f7fc] backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            {title}
          </h3>

          {/* View/Edit Toggle */}
          <div className="inline-flex bg-gray-100 rounded-lg p-0.5 border border-gray-200">
            <button
              onClick={() => setIsEditMode("view")}
              className={`flex items-center justify-center gap-1.5 px-4 h-7 rounded-md text-xs font-medium transition-all duration-200
                ${
                  isEditMode === "view"
                    ? "text-white bg-cyan-600 shadow-sm stroke-white"
                    : "text-gray-600 hover:text-gray-800 stroke-gray-600 hover:stroke-gray-800"
                }`}
            >
              <MoreSquare size={16} />
              View
            </button>
            <button
              onClick={() => setIsEditMode("edit")}
              className={`flex items-center justify-center gap-1.5 px-4 h-7 rounded-md text-xs font-medium transition-all duration-200
                ${
                  isEditMode === "edit"
                    ? "text-white bg-cyan-600 shadow-sm stroke-white"
                    : "text-gray-600 hover:text-gray-800 stroke-gray-600 hover:stroke-gray-800"
                }`}
            >
              <Edit size={16} />
              Edit
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Button */}
          <button
            className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-transparent text-[#0891b2] border border-[#0891b2]
                       text-xs font-bold active:scale-95 transition-all shadow-sm"
          >
            <AddCircle size={16} variant="Outline" color="#0891b2" />
            ADD
          </button>
          {/* Column Visibility Toggle */}
          <div className="relative">
            <button
              ref={settingButtonRef}
              onClick={() => {
                if (showColumnMenu) {
                  setShowColumnMenu(false);
                  setMenuPosition(null);
                } else {
                  const rect =
                    settingButtonRef.current?.getBoundingClientRect();
                  if (rect) {
                    setMenuPosition({
                      top: rect.bottom + window.scrollY + 4,
                      left: rect.left + window.scrollX,
                    });
                  }
                  setShowColumnMenu(true);
                }
              }}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Column Management"
            >
              <Setting2 size={16} color="#4b5563" />
            </button>
            {showColumnMenu &&
              menuPosition &&
              createPortal(
                <div
                  ref={menuRef}
                  className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  style={{
                    top: menuPosition.top,
                    left: menuPosition.left,
                    minWidth: "180px",
                    zIndex: 9999,
                  }}
                >
                  <div className="px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-100 mb-1">
                    Show columns
                  </div>
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(col.key)}
                        onChange={() => toggleColumnVisibility(col.key)}
                        className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-xs text-gray-700">{col.title}</span>
                    </label>
                  ))}
                </div>,
                document.body,
              )}
          </div>
          {/* Search */}
          <div className="relative">
            <FilterSearch
              size={16}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search . . ."
              className="h-8 w-48 rounded-lg border border-gray-200 pr-9 pl-3 text-xs
                         focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100
                         bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <CloseCircle size={14} color="#4b5563" />
              </button>
            )}
          </div>

          {/* Export */}
          {enableExport && (
            <button
              onClick={handleExport}
              className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-gray-200
                         text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              title="Export CSV"
            >
              <DocumentDownload size={14} color="#4b5563" />
              Export
            </button>
          )}

          {/* Bulk Actions */}
          {selectedRowsData.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-1">
              <span className="text-xs text-red-600 font-medium">
                {selectedRowsData.length} Select
              </span>
              <button
                onClick={handleBulkDelete}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Group deletion"
              >
                <Trash size={16} className="stroke-black" />
              </button>
              <button
                onClick={() => {
                  setSelectedRows(new Set());
                  onSelect?.([]);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="cancle"
              >
                <CloseCircle size={16} className="stroke-black" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Agree Bar */}
      {renderAgreeBar()}

      {/* Table Container */}
      <div
        ref={tableContainerRef}
        className="overflow-auto custom-scrollbar"
        style={{ maxHeight: geo?.maxHeight || "600px" }}
      >
        <table className="w-full border-collapse">
          {/* Table Head - Sticky */}
          <thead className="sticky top-0" style={{ zIndex: 10 }}>
            <tr
              className="h-10 text-left text-xs"
              style={{ backgroundColor: headerBg }}
            >
              {selection && (
                <th className="px-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                    aria-label="Select all"
                  />
                </th>
              )}

              {displayColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 relative group select-none"
                  style={{
                    width: columnWidths[column.key] || column.width,
                    minWidth: column.minWidth || 80,
                    textAlign: column.align || "left",
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-700">
                      {column.title}
                    </span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="p-0.5 rounded hover:bg-white/50 transition-colors"
                        aria-label={`sorting ${column.title}`}
                      >
                        {renderSortIcon(column.key)}
                      </button>
                    )}
                  </div>

                  {/* Column Filter */}
                  {column.filterable && (
                    <ColumnFilter
                      column={column}
                      value={filters[column.key] || ""}
                      onChange={(val) => handleFilterChange(column.key, val)}
                    />
                  )}

                  {/* Resize Handle */}
                  {enableColumnResize && (
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize 
                                 hover:bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) =>
                        handleResizeStart(
                          e,
                          column.key,
                          (columnWidths[column.key] ||
                            (typeof column.width === "number"
                              ? column.width
                              : 150)) as number,
                        )
                      }
                    />
                  )}
                </th>
              ))}

              <th className="px-3 w-10">
                <Setting2 size={18} color="#4b5563" />
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          {loading ? (
            <TableSkeleton columns={displayColumns} rowCount={5} />
          ) : paginatedData.length === 0 ? (
            <EmptyState text={emptyText} />
          ) : (
            <tbody>
              {paginatedData.map((row, rowIndex) => {
                const key = getRowKey(row, rowIndex);
                const isSelected = selectedRows.has(key);
                const isExpanded = expandedRows[key];

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={`h-10 transition-colors duration-150 cursor-pointer
                        ${
                          isSelected
                            ? "bg-cyan-50"
                            : rowIndex % 2 === 0
                              ? "bg-white"
                              : ""
                        }
                        hover:bg-[${rowHoverBg}]
                      `}
                      style={{
                        backgroundColor: isSelected
                          ? "#ecfeff"
                          : rowIndex % 2 === 1
                            ? stripeColor
                            : "white",
                      }}
                      onClick={() => onRowClick?.(row, rowIndex)}
                      onDoubleClick={() => {
                        if (isEditMode === "edit") {
                          // Start inline edit on first editable column
                          const firstEditable = displayColumns.find(
                            (c) => c.editable,
                          );
                          if (firstEditable) {
                            handleInlineEdit(
                              rowIndex,
                              firstEditable.key,
                              row[firstEditable.key],
                            );
                          }
                        }
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleRow(row, rowIndex);
                        }
                      }}
                      role="row"
                      aria-selected={isSelected}
                    >
                      {selection && (
                        <td
                          className="px-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(row, rowIndex)}
                            className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                            aria-label={`انتخاب ردیف ${rowIndex + 1}`}
                          />
                        </td>
                      )}

                      {displayColumns.map((column) => (
                        <td
                          key={column.key}
                          className="px-3 text-xs text-gray-700"
                          style={{ textAlign: column.align || "left" }}
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
                                column.editable && isEditMode === "edit"
                                  ? "border-b border-dashed border-cyan-300 cursor-text hover:bg-cyan-50 px-1 rounded"
                                  : ""
                              }
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                if (column.editable && isEditMode === "edit") {
                                  handleInlineEdit(
                                    rowIndex,
                                    column.key,
                                    row[column.key],
                                  );
                                }
                              }}
                            >
                              {row[column.key] ?? "-"}
                            </span>
                          )}
                        </td>
                      ))}

                      {/* Actions */}
                      <td className="px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {logic?.actions?.expand && (
                            <button
                              onClick={() => toggleExpand(key)}
                              className="flex size-7 items-center justify-center rounded-md 
                                         hover:bg-gray-100 transition-colors"
                              aria-label={isExpanded ? "بستن" : "باز کردن"}
                            >
                              {isExpanded ? (
                                <ArrowUp2 size={16} />
                              ) : (
                                <ArrowDown2 size={16} />
                              )}
                            </button>
                          )}

                          {isEditMode === "edit" ? (
                            <>
                              <button
                                onClick={() => handleEdit(row)}
                                className="flex size-7 items-center justify-center rounded-md 
                                           hover:bg-cyan-50 text-cyan-600 transition-colors"
                                title="Edit"
                              >
                                <Edit size={20} color="#4b5563" />
                              </button>
                              <button
                                onClick={() => handleDelete(row)}
                                className="flex size-7 items-center justify-center rounded-md 
                                           hover:bg-red-50 text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash size={20} color="#4b5563" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(row)}
                                className="flex size-7 items-center justify-center rounded-md 
                                           hover:bg-gray-100 transition-colors"
                                title=" Description"
                              >
                                <MoreSquare size={20} color="#4b5563" />
                              </button>
                              <button
                                className="flex size-7 items-center justify-center rounded-md 
                                           hover:bg-gray-100 transition-colors"
                                title="go to"
                              >
                                <Send size={20} color="#4b5563" />
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
                          colSpan={displayColumns.length + (selection ? 2 : 1)}
                          className="px-4 py-3 bg-gray-50 border-b border-gray-100"
                        >
                          <div className="text-xs text-gray-600">
                            {/* Custom expandable content can be rendered here */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {displayColumns.map((col) => (
                                <div
                                  key={col.key}
                                  className="flex flex-col gap-1"
                                >
                                  <span className="text-gray-400 font-medium">
                                    {col.title}
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {col.render
                                      ? col.render(row[col.key], row, rowIndex)
                                      : (row[col.key] ?? "-")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
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
  );
});

TableLinear.displayName = "TableLinear";

export default TableLinear;
