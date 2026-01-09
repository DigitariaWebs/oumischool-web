"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Columns,
  Filter,
  Search,
} from "lucide-react";
import { Fragment, useState } from "react";

export interface ColumnDef<T> {
  key: string;
  label: string;
  icon?: LucideIcon;
  render?: (item: T) => React.ReactNode;
  defaultVisible?: boolean;
  sortable?: boolean;
  sortValue?: (item: T) => unknown;
}

export interface FilterDef {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filters?: FilterDef[];
  searchKey?: keyof T;
  searchKeys?: (keyof T)[];
  getSearchValue?: (item: T) => string;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  actions?: (item: T) => React.ReactNode;
  rowClassName?: (item: T) => string;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  getRowId?: (item: T) => string;
  onRowClick?: (item: T) => void;
  expandableContent?: (item: T) => React.ReactNode;
  groupBy?: string;
  groupByLabel?: (value: unknown) => string;
  groupByOptions?: { value: string; label: string }[];
  onGroupByChange?: (value: string | undefined) => void;
}

export function DataTable<T extends object>({
  data,
  columns,
  filters = [],
  searchKey,
  searchKeys,
  getSearchValue,
  searchPlaceholder = "Search...",
  itemsPerPage = 10,
  actions,
  rowClassName,
  selectable = false,
  onSelectionChange,
  getRowId,
  onRowClick,
  expandableContent,
  groupBy,
  groupByLabel,
  groupByOptions,
  onGroupByChange,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters.reduce((acc, filter) => ({ ...acc, [filter.key]: "all" }), {}),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce(
      (acc, col) => ({
        ...acc,
        [col.key]: col.defaultVisible !== false,
      }),
      {},
    ),
  );
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredData = data.filter((item) => {
    // Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();

      if (getSearchValue) {
        const searchValue = getSearchValue(item).toLowerCase();
        if (!searchValue.includes(lowerSearchTerm)) {
          return false;
        }
      } else if (searchKeys && searchKeys.length > 0) {
        const matches = searchKeys.some((key) => {
          const value = String(
            (item as Record<string, unknown>)[key as string] ?? "",
          ).toLowerCase();
          return value.includes(lowerSearchTerm);
        });
        if (!matches) {
          return false;
        }
      } else if (searchKey) {
        const searchValue = String(
          (item as Record<string, unknown>)[searchKey as string],
        ).toLowerCase();
        if (!searchValue.includes(lowerSearchTerm)) {
          return false;
        }
      }
    }

    // Custom filters
    for (const filter of filters) {
      const filterValue = filterValues[filter.key];
      if (filterValue && filterValue !== "all") {
        if (
          String((item as Record<string, unknown>)[filter.key]) !== filterValue
        ) {
          return false;
        }
      }
    }

    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || col.sortable === false) return 0;
    const getSortValue = (item: T) => {
      if (col.sortValue) return col.sortValue(item);
      return item[col.key as keyof T];
    };
    const aVal = getSortValue(a);
    const bVal = getSortValue(b);
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
    if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Group data if groupBy is provided
  const groupedData = groupBy
    ? sortedData.reduce(
        (acc, item) => {
          const groupKey = String(
            (item as Record<string, unknown>)[groupBy] ?? "",
          );
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(item);
          return acc;
        },
        {} as Record<string, T[]>,
      )
    : null;

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = groupedData
    ? sortedData
    : sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );

  const visibleColumnDefs = columns.filter((col) => visibleColumns[col.key]);

  const getItemId = (item: T, index: number): string => {
    if (getRowId) return getRowId(item);
    if ("id" in item && typeof item.id === "string") return item.id;
    return String(index);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(
        paginatedData.map((item, index) => getItemId(item, index)),
      );
      setSelectedRows(allIds);
      if (onSelectionChange) {
        onSelectionChange(paginatedData);
      }
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectRow = (item: T, index: number, checked: boolean) => {
    const itemId = getItemId(item, index);
    const newSelectedRows = new Set(selectedRows);

    if (checked) {
      newSelectedRows.add(itemId);
    } else {
      newSelectedRows.delete(itemId);
    }

    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedItems = paginatedData.filter((item, idx) =>
        newSelectedRows.has(getItemId(item, idx)),
      );
      onSelectionChange(selectedItems);
    }
  };

  const handleSelectGroup = (groupItems: T[], checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);

    groupItems.forEach((item, index) => {
      const itemId = getItemId(item, index);
      if (checked) {
        newSelectedRows.add(itemId);
      } else {
        newSelectedRows.delete(itemId);
      }
    });

    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const allData = groupedData
        ? Object.values(groupedData).flat()
        : paginatedData;
      const selectedItems = allData.filter((item, idx) =>
        newSelectedRows.has(getItemId(item, idx)),
      );
      onSelectionChange(selectedItems);
    }
  };

  const isGroupFullySelected = (groupItems: T[]): boolean => {
    return groupItems.every((item, index) =>
      selectedRows.has(getItemId(item, index)),
    );
  };

  const isGroupPartiallySelected = (groupItems: T[]): boolean => {
    const selectedCount = groupItems.filter((item, index) =>
      selectedRows.has(getItemId(item, index)),
    ).length;
    return selectedCount > 0 && selectedCount < groupItems.length;
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item, index) =>
      selectedRows.has(getItemId(item, index)),
    );

  const toggleRowExpansion = (itemId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(itemId)) {
      newExpandedRows.delete(itemId);
    } else {
      newExpandedRows.add(itemId);
    }
    setExpandedRows(newExpandedRows);
  };

  const totalColumns =
    visibleColumnDefs.length +
    (actions ? 1 : 0) +
    (selectable ? 1 : 0) +
    (expandableContent ? 1 : 0);

  return (
    <div className="w-full max-w-full space-y-4 overflow-x-hidden">
      {/* Filters */}
      <div className="flex flex-wrap items-center space-x-2 gap-y-2">
        {(searchKey || searchKeys || getSearchValue) && (
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
        {showFilters && (
          <>
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={filterValues[filter.key]}
                onValueChange={(value) => {
                  setFilterValues((prev) => ({ ...prev, [filter.key]: value }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </>
        )}
        {filters.length > 0 && (
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}
        {columns.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Columns className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="space-y-1">
              <DropdownMenuLabel>Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((col) => (
                <DropdownMenuItem
                  key={col.key}
                  className="p-0"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Label className="hover:bg-primary/30 has-aria-checked:bg-accent/5 flex w-full cursor-pointer items-center gap-2 rounded-md border p-2">
                    <Checkbox
                      checked={visibleColumns[col.key]}
                      onCheckedChange={(checked) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [col.key]: !!checked,
                        }))
                      }
                      className="data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-primary-foreground mt-0.5"
                    />
                    <div className="grid gap-1 font-normal">
                      <p className="flex items-center gap-2 text-xs leading-none font-medium">
                        {col.icon && <col.icon className="h-3.5 w-3.5" />}
                        {col.label}
                      </p>
                    </div>
                  </Label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {groupByOptions && groupByOptions.length > 0 && (
          <Select
            value={groupBy || "none"}
            onValueChange={(value) =>
              onGroupByChange?.(value === "none" ? undefined : value)
            }
          >
            <SelectTrigger className="w-45">
              Grouper par
              <SelectValue placeholder="Grouper par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun groupement</SelectItem>
              {groupByOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {expandableContent && <TableHead className="w-12"></TableHead>}
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className="data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-primary-foreground"
                  />
                </TableHead>
              )}
              {visibleColumnDefs.map((col) => (
                <TableHead
                  key={col.key}
                  className={
                    col.sortable !== false ? "cursor-pointer select-none" : ""
                  }
                  onClick={() => {
                    if (col.sortable === false) return;
                    if (sortKey === col.key) {
                      setSortDirection(
                        sortDirection === "asc" ? "desc" : "asc",
                      );
                    } else {
                      setSortKey(col.key);
                      setSortDirection("asc");
                    }
                    setCurrentPage(1);
                  }}
                >
                  {col.icon && <col.icon className="mr-2 inline h-4 w-4" />}
                  {col.label}
                  {sortKey === col.key &&
                    col.sortable !== false &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 inline h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 inline h-4 w-4" />
                    ))}
                </TableHead>
              ))}
              {actions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumns}
                  className="text-muted-foreground py-8 text-center"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : groupedData ? (
              Object.entries(groupedData).map(([groupKey, groupItems]) => (
                <Fragment key={`group-${groupKey}`}>
                  <TableRow className="bg-muted/50">
                    {expandableContent && (
                      <TableCell className="w-12"></TableCell>
                    )}
                    {selectable && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={
                            isGroupFullySelected(groupItems)
                              ? true
                              : isGroupPartiallySelected(groupItems)
                                ? "indeterminate"
                                : false
                          }
                          onCheckedChange={(checked) =>
                            handleSelectGroup(groupItems, !!checked)
                          }
                          aria-label="Select group"
                          className="data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-primary-foreground"
                        />
                      </TableCell>
                    )}
                    <TableCell
                      colSpan={
                        totalColumns -
                        (expandableContent ? 1 : 0) -
                        (selectable ? 1 : 0)
                      }
                      className="py-3 font-semibold"
                    >
                      {groupByLabel ? groupByLabel(groupKey) : groupKey}
                    </TableCell>
                  </TableRow>
                  {groupItems.map((item, index) => {
                    const itemId = getItemId(item, index);
                    const isSelected = selectedRows.has(itemId);
                    const isExpanded = expandedRows.has(itemId);

                    return (
                      <Fragment key={itemId}>
                        <TableRow
                          className={rowClassName?.(item)}
                          data-state={isSelected ? "selected" : undefined}
                          onClick={(e) => {
                            const target = e.target as HTMLElement;
                            if (
                              target.closest("button") ||
                              target.closest('[role="checkbox"]') ||
                              target.tagName === "INPUT"
                            ) {
                              return;
                            }
                            onRowClick?.(item);
                          }}
                          style={onRowClick ? { cursor: "pointer" } : undefined}
                        >
                          {expandableContent && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleRowExpansion(itemId)}
                              >
                                <ChevronRight
                                  className={`h-4 w-4 transition-transform ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </Button>
                            </TableCell>
                          )}
                          {selectable && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleSelectRow(item, index, !!checked)
                                }
                                aria-label="Select row"
                                className="data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-primary-foreground"
                              />
                            </TableCell>
                          )}
                          {visibleColumnDefs.map((col) => (
                            <TableCell
                              key={col.key}
                              className={
                                col.key === columns[0].key ? "font-medium" : ""
                              }
                            >
                              {col.render
                                ? col.render(item)
                                : String(
                                    (item as Record<string, unknown>)[col.key],
                                  )}
                            </TableCell>
                          ))}
                          {actions && (
                            <TableCell
                              className="text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {actions(item)}
                            </TableCell>
                          )}
                        </TableRow>
                        {expandableContent && isExpanded && (
                          <TableRow key={`${itemId}-expanded`}>
                            <TableCell
                              colSpan={totalColumns}
                              className="bg-muted/50 p-4"
                            >
                              {expandableContent(item)}
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </Fragment>
              ))
            ) : (
              paginatedData.map((item, index) => {
                const itemId = getItemId(item, index);
                const isSelected = selectedRows.has(itemId);
                const isExpanded = expandedRows.has(itemId);

                return (
                  <Fragment key={itemId}>
                    <TableRow
                      className={rowClassName?.(item)}
                      data-state={isSelected ? "selected" : undefined}
                      onClick={(e) => {
                        // Prevent row click when clicking checkboxes or buttons
                        const target = e.target as HTMLElement;
                        if (
                          target.closest("button") ||
                          target.closest('[role="checkbox"]') ||
                          target.tagName === "INPUT"
                        ) {
                          return;
                        }
                        onRowClick?.(item);
                      }}
                      style={onRowClick ? { cursor: "pointer" } : undefined}
                    >
                      {expandableContent && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleRowExpansion(itemId)}
                          >
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </Button>
                        </TableCell>
                      )}
                      {selectable && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRow(item, index, !!checked)
                            }
                            aria-label="Select row"
                            className="data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-primary-foreground"
                          />
                        </TableCell>
                      )}
                      {visibleColumnDefs.map((col) => (
                        <TableCell
                          key={col.key}
                          className={
                            col.key === columns[0].key ? "font-medium" : ""
                          }
                        >
                          {col.render
                            ? col.render(item)
                            : String(
                                (item as Record<string, unknown>)[col.key],
                              )}
                        </TableCell>
                      ))}
                      {actions && (
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {actions(item)}
                        </TableCell>
                      )}
                    </TableRow>
                    {expandableContent && isExpanded && (
                      <TableRow key={`${itemId}-expanded`}>
                        <TableCell
                          colSpan={totalColumns}
                          className="bg-muted/50 p-4"
                        >
                          {expandableContent(item)}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!groupedData && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
