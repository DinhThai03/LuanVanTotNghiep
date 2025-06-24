"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    Row,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns } from "lucide-react"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    className?: string
    onAddClick?: () => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    className = "h-full",
    onAddClick
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const initialVisibility: VisibilityState = Object.fromEntries(
        columns
            .filter((col) => (col.meta as any)?.hidden)
            .map((col) => [col.id, false])
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility)

    const [searchValue, setSearchValue] = useState(globalFilter)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setGlobalFilter(searchValue)
        }, 200)
        return () => clearTimeout(timeout)
    }, [searchValue])

    useEffect(() => {
        table.setPageIndex(0)
    }, [globalFilter])

    useEffect(() => {
        const { pageIndex } = table.getState().pagination
        if (table.getRowModel().rows.length === 0 && pageIndex > 0) {
            table.setPageIndex(pageIndex - 1)
        }
    }, [data])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: fuzzyFilter,
        autoResetPageIndex: false,
    })

    const getPageNumbers = () => {
        const currentPage = table.getState().pagination.pageIndex + 1;
        const totalPages = table.getPageCount();
        const pageNumbers = [];

        pageNumbers.push(1);

        if (currentPage > 3) {
            pageNumbers.push('...');
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - 2) {
            pageNumbers.push('...');
        }

        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className={`w-full max-h-full flex flex-col gap-4 ${className}`}>
            <div className="w-full flex items-center justify-between gap-2">
                <Input
                    placeholder="Tìm kiếm..."
                    className="max-w-sm"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                />
                <div className='flex gap-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto ">
                                <Columns className=" h-4 w-4" />
                                <p className="hidden md:inline ml-2">Lọc cột</p>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllLeafColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    const metaDisplayName = (column.columnDef.meta as any)?.displayName;
                                    const headerText = metaDisplayName || column.id;

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {headerText}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {onAddClick &&
                        <Button variant="outline" onClick={onAddClick}>
                            <FaPlus className=" h-4 w-4" />
                            <p className="hidden md:inline ml-2">Thêm mới</p>
                        </Button>
                    }
                </div>
            </div>

            <div className="rounded-md border flex flex-1/1 flex-col overflow-hidden">
                <Table className="table-fixed w-[99%]">
                    <TableHeader className="sticky top-0 z-20 shadow-sm bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-bold" style={{ width: `${header.getSize()}px` }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="py-3 whitespace-normal break-words"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="relative flex items-center justify-between px-2">
                <div className=" flex-1 text-sm text-muted-foreground">
                    <span className="hidden md:inline">{"Đã chọn "}</span>
                    {table.getFilteredSelectedRowModel().rows.length} {" / "}
                    {table.getFilteredRowModel().rows.length}
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2 self-center">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Trang đầu</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Trang trước</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {getPageNumbers().map((pageNumber, index) => (
                        <Button
                            key={index}
                            variant={
                                pageNumber === table.getState().pagination.pageIndex + 1
                                    ? "default"
                                    : "outline"
                            }
                            className="h-8 w-8 p-0"
                            onClick={() => {
                                if (typeof pageNumber === 'number') {
                                    table.setPageIndex(pageNumber - 1)
                                }
                            }}
                            disabled={pageNumber === '...'}
                        >
                            {pageNumber}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Trang sau</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Trang cuối</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="hidden sm:inline text-sm font-medium">Số dòng</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[1, 10, 20, 30, 40, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>
            </div>


        </div>
    )
}

function normalizeString(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
}

function fuzzyFilter<TData>(
    row: Row<TData>,
    _columnId: string,
    filterValue: string
): boolean {
    const visibleCells = row
        .getAllCells()
        .filter(cell =>
            cell.column.getIsVisible() &&
            cell.column.getCanGlobalFilter()
        )

    return visibleCells.some(cell => {
        const value = cell.getValue()
        if (typeof value === 'number') {
            return value.toString().includes(filterValue)
        }
        if (typeof value === 'string') {
            return normalizeString(value).includes(normalizeString(filterValue))
        }
        return false
    })
}
