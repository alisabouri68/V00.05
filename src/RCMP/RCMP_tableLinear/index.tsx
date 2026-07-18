import React, { useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import classNames from "classnames";
import {
  Pagination,
  Dropdown,
  Button,
  Badge,
  Checkbox,
  DropdownItem,
} from "flowbite-react"; // Added Checkbox
import {
  Add,
  ArrowDown2,
  ArrowUp2,
  FilterSearch,
  SearchNormal,
  Sort,
  Broom,
  CloseCircle,
  TickCircle,
  Setting4,
  HambergerMenu,
  Setting2,
  Eye,
  Edit2,
  AddCircle,
} from "iconsax-react";
import { useState, useMemo } from "react";

// --- DND Kit Imports ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Interfaces ---

// Define supported filter types
type FilterType = "text" | "number" | "select" | "date" | "boolean";

// Define logical operators
type FilterOperator = "contains" | "equals" | "gt" | "lt" | "between" | "in";

interface FilterValue {
  value: any;
  operator: FilterOperator;
}

interface FilterObject {
  [key: string]: FilterValue;
}

interface ColumnVisibilityConfig {
  view?: string[];
  edit?: string[];
}
interface SubRowCompProps {
  row: any;
  subMode: "view" | "edit";
}

interface TableProps {
  data: any[];
  columns: ColumnDef<any, any>[];
  sort?: SortingState;
  setSort?: any;
  onRowClick?: (rowData: any) => void;
  title?: string;
  setSearch?: (value: string) => void;
  onFilterChange?: (filters: FilterObject) => void;
  setCurrentPage?: any;
  currentPage?: number;
  totalPages?: number;
  onAddClick?: () => void;
  addTitle?: string;
  subRowComp?: any;
  minimal?: boolean;
  subMode?: "view" | "edit";
  rowClassName?: string | ((row: any) => string);
  sortable?: boolean;
  onReorder?: (data: any[]) => void;
  columnVisibilityConfig?: ColumnVisibilityConfig;
  pageSize?: number;
  setPageSize?: (value: number) => void;
  getSubRows?: any;
}

/**
 * DraggableRow Component
 * Provides drag-and-drop functionality for table rows using @dnd-kit/sortable.
 * Includes visual feedback for dragging and row selection.
 */
function DraggableRow({
  row,
  reorderEnabled,
  children,
  rowClassName,
  onRowClick,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    disabled: !reorderEnabled,
  });

  // Check if the current row is selected via TanStack Table API
  const isSelected = row.getIsSelected();

  // Dynamic styles for smooth dragging and positioning
  const style = {
    transform: CSS?.Transform?.toString(transform),
    transition,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
    position: "relative" as const,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={classNames(
        "transition-all duration-200 cursor-pointer border-b",
        // Default hover effect
        "hover:bg-[#e8f2fa]",
        // Styles when the row is selected/clicked
        {
          "bg-blue-100/50 shadow-sm ring-1 ring-blue-200 z-10": isSelected,
          "shadow-2xl bg-white z-50": isDragging,
        },
        // Allow custom classes from props
        rowClassName ? rowClassName(row) : "",
      )}
      onClick={(e) => {
        // Prevent event bubbling if necessary and trigger selection logic
        if (onRowClick) {
          onRowClick(row.original);
        }
        // Toggle selection if you are using TanStack selection feature
        row.toggleSelected?.();
      }}
    >
      {React?.Children?.map(children, (child: any) => {
        // Inject drag attributes and listeners into the specific handle cell
        if (child?.props?.id === "drag-handle-cell") {
          return React.cloneElement(child, { ...attributes, ...listeners });
        }
        return child;
      })}
    </tr>
  );
}

const FilterInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type?: string;
}) => {
  const [localValue, setLocalValue] = React.useState(value);

  // Sync local state with prop if prop changes (e.g. on Clear All)
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e?.target?.value;
    setLocalValue(val); // Instant feedback for the user
    onChange(val); // Update parent state
  };

  return (
    <input
      type={type}
      className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-xs rounded-md focus:ring-1 focus:ring-indigo-500 p-2"
      placeholder={placeholder}
      value={localValue}
      onChange={handleChange}
      // Crucial: Prevent Flowbite Dropdown from hijacking the events
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    />
  );
};

function Table(props: TableProps) {
  const {
    data,
    columns,
    sort,
    setSort,
    onRowClick,
    title,
    setSearch,
    onFilterChange,
    setCurrentPage,
    currentPage,
    totalPages,
    onAddClick,
    addTitle = "Add New Record",
    subRowComp: SubRowComp = () => {},
    minimal = false,
    subMode = "view",
    rowClassName = "",
    sortable = false,
    onReorder,
    columnVisibilityConfig = {
      view: ["action"],
      edit: [],
    },
    pageSize = 10,
    setPageSize,
    getSubRows = (row: any) => row.subRows,
  } = props;

  // Local State
  const [tempFilters, setTempFilters] = useState<FilterObject>({});
  const [activeFilters, setActiveFilters] = useState<FilterObject>({});
  const [mode, setMode] = useState<"view" | "edit">("view");
  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const isActuallySortable = sortable && mode === "edit";

  useEffect(() => {
    if (mode === subMode) return;
    setMode(subMode);
  }, [subMode]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const finalColumns = useMemo(() => {
    const hiddenForCurrentMode = columnVisibilityConfig[mode] || [];

    let baseCols = [...columns].filter((col: any) => {
      const columnId = col.id || col.accessorKey;
      return !hiddenForCurrentMode.includes(columnId);
    });

    // Add drag-handle if necessary
    if (isActuallySortable) {
      const dragColumn = {
        id: "drag-handle",
        header: () => null,
        cell: () => (
          <div className="flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400">
            <HambergerMenu size={18} color="currentColor" />
          </div>
        ),
      };
      baseCols = [dragColumn, ...baseCols];
    }

    // Logic: Attach the gear icon to the header of the LAST column instead of creating a new column
    if (mode === "view" && baseCols.length > 0) {
      const lastIdx = baseCols.length - 1;
      const lastCol = { ...baseCols[lastIdx] };
      const originalHeader = lastCol.header;

      lastCol.header = (info: any) => (
        <div className="flex items-center justify-between w-full group/header">
          <div className="flex items-center gap-1">
            {typeof originalHeader === "function"
              ? originalHeader(info)
              : originalHeader}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              arrowIcon={false}
              inline
              placement="bottom-end"
              label={
                <Setting2
                  size={18}
                  className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer ml-2"
                  color="currentColor"
                />
              }
            >
              <div className="p-3 min-w-[180px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-1 tracking-wider">
                  Visible Columns
                </p>
                <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                  {table.getAllLeafColumns().map((column) => {
                    if (
                      column.id === "drag-handle" ||
                      !column?.columnDef?.header
                    )
                      return null;
                    const isVisible = column.getIsVisible();
                    const headerText =
                      typeof column?.columnDef?.header === "string"
                        ? column?.columnDef?.header
                        : column.id;

                    return (
                      <div
                        key={column.id}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded transition-colors"
                      >
                        <Checkbox
                          id={`col-vis-${column.id}`}
                          checked={isVisible}
                          className="w-3.5 h-3.5"
                          onChange={column.getToggleVisibilityHandler()}
                        />
                        <label
                          htmlFor={`col-vis-${column.id}`}
                          className="text-xs text-gray-600 cursor-pointer flex-1"
                        >
                          {headerText}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      );
      baseCols[lastIdx] = lastCol;
    }

    return baseCols;
  }, [
    columns,
    mode,
    isActuallySortable,
    columnVisibilityConfig,
    columnVisibility,
  ]);

  const table = useReactTable({
    data: data as any[],
    columns: finalColumns,
    state: {
      sorting: sort,
      columnVisibility, // Controlled visibility state
      pagination: {
        pageIndex: (currentPage ?? 1) - 1,
        pageSize: pageSize,
      },
    },
    onColumnVisibilityChange: setColumnVisibility,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSort as any,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    getSubRows: getSubRows,
    getRowId: (row) => row._id || row.id || row.uuid,
    enableMultiRowSelection: false,
  });

  const items = useMemo(
    () => table.getRowModel().rows.map((r) => r.id),
    [table.getRowModel().rows],
  );

  const handleApplyFilters = () => {
    const cleanFilters: FilterObject = {};
    Object.keys(tempFilters).forEach((key) => {
      const filter = tempFilters[key];
      if (filter && filter.value !== "" && filter.value !== undefined) {
        cleanFilters[key] = filter;
      }
    });

    setActiveFilters(cleanFilters);
    setCurrentPage(1);
    if (onFilterChange) onFilterChange(cleanFilters);
  };

  const handleClearAll = () => {
    setTempFilters({});
    setActiveFilters({});
    setCurrentPage(1);
    if (onFilterChange) onFilterChange({});
  };

  const removeSingleFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    const newTemp = { ...tempFilters };
    delete newTemp[key];

    setTempFilters(newTemp);
    setActiveFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      const newData = arrayMove(data, oldIndex, newIndex);
      onReorder(newData);
    }
  }

  const activeSortCount = sort?.length || 0;
  const activeFilterCount = Object.keys(activeFilters).length;
  const totalVisibleColumns = table.getAllLeafColumns().length;

  return (
    <div className="w-full font-sans bg-[#f2f6fb] border rounded-lg">
      {!minimal ? (
        <div className="p-4">
          <div className="flex flex-row items-center justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-2">
              <h2 className="text-sm text-gray-800 leading-tight w-20 truncate">
                {title}
              </h2>
              <div className="flex justify-center">
                {/* Container with light gray background and rounded corners */}
                <div className="inline-flex bg-[#f1f5f9] rounded-lg border border-gray-200">
                  {/* View Button */}
                  <button
                    onClick={() => setMode("view")}
                    className={`flex items-center justify-center gap-2 w-20 h-6 rounded-lg transition-all duration-300 ${
                      mode === "view"
                        ? "text-white bg-[#0891b2]"
                        : "bg-[#f2f2f2] text-[#1e293b] shadow-sm"
                    }`}
                  >
                    <span className="text-xs">View</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => setMode("edit")}
                    className={`flex items-center justify-center gap-2 w-20 h-6 rounded-lg transition-all duration-300 ${
                      mode === "edit"
                        ? "text-white bg-[#0891b2]"
                        : "bg-[#f2f2f2] text-[#1e293b] shadow-sm"
                    }`}
                  >
                    <span className="text-xs">Edit</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 w-full">
              {/* Action Buttons - More compact */}
              <div className="flex items-center gap-1.5 border-l border-gray-100 ml-1 pl-2">
                {onAddClick && (
                  <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 justify-center px-2 w-fit h-8 bg-[#e8e7e7] rounded-md shadow-sm transition-all transform active:scale-95 text-xs"
                    title={addTitle}
                  >
                    <AddCircle
                      size={14}
                      variant="Outline"
                      color="currentColor"
                    />
                    <span className="font-bold">Add</span>
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <Dropdown
                arrowIcon={false}
                inline={true}
                placement="bottom-end"
                label={
                  <div
                    className={classNames(
                      "flex items-center gap-2 px-1.5 py-1.5 rounded-md border transition-all duration-200 text-xs font-medium",
                      activeSortCount > 0
                        ? "bg-blue-50 border-blue-100 text-blue-700"
                        : "bg-[#e8e7e7] border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
                    )}
                  >
                    <Sort
                      size={14}
                      variant={activeSortCount > 0 ? "Bold" : "Linear"}
                      color="currentColor"
                    />
                    <span>Sort</span>
                    {activeSortCount > 0 && (
                      <span className="ml-0.5 bg-blue-600 text-white text-[9px] h-3.5 w-3.5 flex items-center justify-center rounded-full">
                        {activeSortCount}
                      </span>
                    )}
                    <ArrowDown2
                      size={12}
                      className={classNames(
                        "ml-0.5 opacity-50 transition-transform",
                        activeSortCount > 0 ? "text-blue-700" : "",
                      )}
                      color="currentColor"
                    />
                  </div>
                }
              >
                <div className="w-52 p-1.5">
                  <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Sort by Column
                  </div>
                  <ul className="space-y-0.5">
                    {table.getAllLeafColumns().map((column) => {
                      if (!column.getCanSort()) return null;
                      const isSorted = column.getIsSorted();
                      return (
                        <li
                          key={column.id}
                          onClick={() => column.toggleSorting()}
                          className={classNames(
                            "flex items-center justify-between px-1.5 py-1.5 rounded-md cursor-pointer text-xs transition-colors",
                            isSorted
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {isSorted && (
                              <TickCircle
                                size={12}
                                variant="Bold"
                                color="currentColor"
                              />
                            )}
                            {!isSorted && <div className="w-3" />}
                            {column?.columnDef?.header as string}
                          </span>
                          {isSorted === "asc" && (
                            <ArrowUp2 size={14} color="currentColor" />
                          )}
                          {isSorted === "desc" && (
                            <ArrowDown2 size={14} color="currentColor" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {activeSortCount > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-50">
                      <button
                        onClick={() => setSort([])}
                        className="w-full text-center text-[11px] text-red-500 hover:text-red-600 py-1"
                      >
                        Reset Sorting
                      </button>
                    </div>
                  )}
                </div>
              </Dropdown>

              {/* Filter Dropdown */}
              <Dropdown
                arrowIcon={false}
                inline={true}
                placement="bottom-end"
                dismissOnClick={false}
                label={
                  <div
                    className={classNames(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-md border transition-all duration-200 text-xs font-medium",
                      activeFilterCount > 0
                        ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                        : "bg-[#e8e7e7] border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
                    )}
                  >
                    <FilterSearch
                      size={14}
                      variant={activeFilterCount > 0 ? "Bold" : "Linear"}
                      color="currentColor"
                    />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                      <span className="ml-0.5 bg-indigo-600 text-white text-[9px] h-3.5 w-3.5 flex items-center justify-center rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                    <ArrowDown2
                      size={12}
                      className="ml-0.5 opacity-50"
                      color="currentColor"
                    />
                  </div>
                }
              >
                <div className="w-72 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Advanced Filters
                    </h3>
                    <button
                      onClick={handleClearAll}
                      className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors uppercase font-bold"
                    >
                      <Broom size={12} color="currentColor" /> Clear
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                    {table.getAllLeafColumns().map((column) => {
                      if (column.id === "action" || !column?.columnDef?.header)
                        return null;

                      // Get filter config from column meta (we'll define this in the columns array)
                      const meta = column?.columnDef?.meta as any;
                      const filterType: FilterType = meta?.filterType;

                      if (!filterType) return null;

                      const currentFilter = tempFilters[column.id] || {
                        value: "",
                        operator: "contains",
                      };

                      return (
                        <div
                          key={column.id}
                          className="group border-b border-gray-50 pb-3 last:border-0"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-0.5">
                              {column?.columnDef?.header as string}
                            </label>

                            {/* Operator Selector */}
                            <select
                              className="text-[9px] border-none bg-transparent text-indigo-600 focus:ring-0 p-0 h-4 cursor-pointer"
                              value={currentFilter.operator}
                              onChange={(e) => {
                                const op = e?.target?.value as FilterOperator;
                                setTempFilters((prev) => ({
                                  ...prev,
                                  [column.id]: {
                                    ...currentFilter,
                                    operator: op,
                                  },
                                }));
                              }}
                            >
                              <option value="contains">Contains</option>
                              <option value="equals">Equals</option>
                              {filterType === "number" && (
                                <option value="gt">Greater Than</option>
                              )}
                              {filterType === "number" && (
                                <option value="lt">Less Than</option>
                              )}
                            </select>
                          </div>

                          <div className="relative">
                            {/* Dynamic UI based on filterType */}
                            {filterType === "select" ? (
                              <select
                                className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-xs rounded-md focus:ring-1 focus:ring-indigo-500 p-2"
                                value={currentFilter.value}
                                onChange={(e) =>
                                  setTempFilters((prev) => ({
                                    ...prev,
                                    [column.id]: {
                                      ...currentFilter,
                                      value: e?.target?.value,
                                    },
                                  }))
                                }
                              >
                                <option value="">All</option>
                                {meta?.filterOptions?.map((opt: any) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : filterType === "date" ? (
                              <FilterInput
                                type="date"
                                placeholder=""
                                value={currentFilter.value}
                                onChange={(val) =>
                                  setTempFilters((prev) => ({
                                    ...prev,
                                    [column.id]: {
                                      ...currentFilter,
                                      value: val,
                                    },
                                  }))
                                }
                              />
                            ) : (
                              <FilterInput
                                type={
                                  filterType === "number" ? "number" : "text"
                                }
                                placeholder={`Filter ${column?.columnDef?.header}...`}
                                value={currentFilter.value}
                                onChange={(val) => {
                                  setTempFilters((prev) => ({
                                    ...prev,
                                    [column.id]: {
                                      ...currentFilter,
                                      value: val,
                                    },
                                  }));
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
                    <Button
                      size="xs"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs py-1.5"
                      onClick={handleApplyFilters}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </Dropdown>

              {/* Quick Search - Reduced width and height for elegance */}
              <div className="relative">
                <input
                  type="text"
                  onChange={(e) => {
                    if (setSearch) {
                      setSearch(e?.target?.value);
                      setCurrentPage(1);
                    }
                  }}
                  className="w-40 pl-9 pr-3 py-1.5 bg-[#e8e7e7] border border-gray-200 text-gray-900 text-xs rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all hover:bg-[#e8e7e7]"
                  placeholder="Quick search..."
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <SearchNormal size={14} color="currentColor" variant="Outline" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Section */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-dashed border-gray-100 animate-fade-in-down">
              <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">
                Active Filters:
              </span>
              {Object.entries(activeFilters).map(([key, filterObj]) => {
                let colHeader = table.getColumn(key)?.columnDef
                  .header as string;

                if (typeof colHeader !== "string" || !colHeader.length)
                  colHeader = key;

                return (
                  <Badge
                    key={key}
                    color="indigo"
                    size="sm"
                    className="px-2 py-1 rounded-md flex items-center gap-1.5 cursor-default bg-indigo-50/50 text-indigo-700 border border-indigo-100/50 hover:bg-indigo-100 transition-colors"
                  >
                    <span className="text-[10px] font-medium opacity-70">
                      {colHeader}:
                    </span>
                    <span className="text-[10px] font-bold">
                      {filterObj.value}
                    </span>
                    <button
                      onClick={() => removeSingleFilter(key)}
                      className="ml-1 text-indigo-300 hover:text-indigo-800 transition-colors"
                    >
                      <CloseCircle
                        size={14}
                        variant="Bold"
                        color="currentColor"
                      />
                    </button>
                  </Badge>
                );
              })}
              <button
                onClick={handleClearAll}
                className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase ml-2 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-2 pt-0 font-bold text-sm">{title}:</div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-500">
            <thead className="text-xs font-bold text-gray-800 uppercase bg-[#d9e4f4] border-b border-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup?.headers?.map((header) => (
                    <th key={header.id} className="px-1 py-2">
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={() =>
                            header.id !== "column-settings" &&
                            header?.column?.toggleSorting()
                          }
                          className={classNames(
                            "flex items-center gap-1 group",
                            {
                              "cursor-pointer select-none hover:text-gray-800":
                                header?.column?.getCanSort() &&
                                header.id !== "column-settings",
                            },
                          )}
                        >
                          {flexRender(
                            header?.column?.columnDef.header,
                            header.getContext(),
                          )}

                          {header.id !== "column-settings" && (
                            <span className="transition-opacity opacity-0 group-hover:opacity-100 text-gray-400">
                              {{
                                asc: (
                                  <ArrowUp2
                                    size={14}
                                    className="opacity-100 text-blue-600"
                                    variant="Bold"
                                    color="currentColor"
                                  />
                                ),
                                desc: (
                                  <ArrowDown2
                                    size={14}
                                    className="opacity-100 text-blue-600"
                                    variant="Bold"
                                    color="currentColor"
                                  />
                                ),
                              }[header?.column?.getIsSorted() as string] ??
                                (header?.column?.getCanSort() ? (
                                  <Sort size={14} color="currentColor" />
                                ) : null)}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={totalVisibleColumns}
                    className="text-center py-8"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <SearchNormal
                        size={25}
                        variant="TwoTone"
                        color="currentColor"
                      />
                      <span className="mt-2 text-sm">No records found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                    disabled={!isActuallySortable}
                  >
                    {table
                      .getRowModel()
                      .rows.filter((row) => row.depth === 0)
                      .map((row) => (
                        <React.Fragment key={row.id}>
                          <DraggableRow
                            row={row}
                            reorderEnabled={isActuallySortable}
                            rowClassName={rowClassName}
                            onRowClick={onRowClick}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td
                                key={cell.id}
                                id={
                                  cell?.column?.id === "drag-handle"
                                    ? "drag-handle-cell"
                                    : undefined
                                }
                                className={classNames(
                                  "px-1 py-2 whitespace-nowrap",
                                  {
                                    "py-0":
                                      cell?.column?.id === "column-settings", // No height/width padding for gear column rows
                                  },
                                )}
                              >
                                {flexRender(
                                  cell?.column?.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </td>
                            ))}
                          </DraggableRow>

                          {row.getIsExpanded() &&
                            row?.original?.subRows?.length > 0 && (
                              <SubRowComp row={row} subMode={mode} />
                            )}
                        </React.Fragment>
                      ))}
                  </SortableContext>
                </DndContext>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!minimal && (
        <div className="flex items-center justify-between w-full mt-4 px-2">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            {setPageSize && (
              <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Rows:
                </span>
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                      {pageSize}
                      <ArrowDown2 size={10} color="currentColor" />
                    </div>
                  }
                  placement="top"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <DropdownItem
                      key={size}
                      onClick={() => setPageSize?.(size)}
                      className={classNames("text-xs px-4 py-1.5", {
                        "bg-blue-50 text-blue-700 font-bold": pageSize === size,
                      })}
                    >
                      {size}
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>
            )}
          </div>

          <Pagination
            currentPage={currentPage ?? 1}
            totalPages={totalPages ?? 0}
            onPageChange={setCurrentPage}
            showIcons
            className="flex-wrap"
          />
        </div>
      )}
    </div>
  );
}

export default Table;
