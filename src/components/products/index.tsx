'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { formatCurrency } from '@/lib/format';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import {
  CheckCircle,
  XCircle,
  Smile,
  Meh,
  Frown,
  Edit,
  Trash,
  Eye,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface ProductTableProps {
  data: Product[];
}

type PaginationState = { pageIndex: number; pageSize: number };

function StockBadge({ stock }: { stock: number }) {
  let cls = 'text-xs px-2 py-1 rounded-full font-semibold';
  if (stock > 50) cls += ' bg-green-100 text-green-800';
  else if (stock >= 10) cls += ' bg-yellow-100 text-yellow-800';
  else cls += ' bg-red-100 text-red-800';
  return <span className={cls}>{stock}</span>;
}

function StatusChip({ active }: { active: boolean }) {
  return active ? (
    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1">
      <CheckCircle size={12} /> Active
    </span>
  ) : (
    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 flex items-center gap-1">
      <XCircle size={12} /> Inactive
    </span>
  );
}

function ClientSatisfaction({ rating }: { rating: number }) {
  if (rating > 3) return <Smile className="text-green-500" size={16} />;
  if (rating === 3) return <Meh className="text-yellow-500" size={16} />;
  return <Frown className="text-red-500" size={16} />;
}

function DeliveryProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
      <div className="h-2 bg-blue-500" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

export default function ProductTable({ data }: ProductTableProps) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      { accessorKey: 'name', header: 'Product' },
      { accessorKey: 'sku', header: 'SKU' },
      { accessorKey: 'category', header: 'Category' },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: (info) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: (info) => <StockBadge stock={info.getValue() as number} />,
      },
      {
        accessorKey: 'active',
        header: 'Status',
        cell: (info) => <StatusChip active={info.getValue() as boolean} />,
      },
      {
        accessorKey: 'clientRating',
        header: 'Client Sat.',
        cell: (info) => <ClientSatisfaction rating={info.getValue() as number} />,
      },
      {
        accessorKey: 'deliveryProgress',
        header: 'Delivery',
        cell: (info) => <DeliveryProgress progress={info.getValue() as number} />,
      },
      {
        accessorKey: 'salesTrend',
        header: '7d Sales',
        cell: (info) => (
          <Sparklines data={info.getValue() as number[]} width={100} height={20}>
            <SparklinesLine color="#3b82f6" />
          </Sparklines>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Edit size={14} />
            </Button>
            <Button size="sm" variant="destructive">
              <Trash size={14} />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, columnFilters, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiSort: true,
  });

  return (
    <Card className="shadow-sm p-0 rounded-md">
      <div className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />

        <Popover>
          <PopoverTrigger>
            <Button size="sm">Columns</Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-1">
            {table.getAllColumns().map((col) =>
              col.id !== 'select' && col.id !== 'actions' ? (
                <Checkbox
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={() => col.toggleVisibility(!col.getIsVisible())}
                >
                  {col.id}
                </Checkbox>
              ) : null
            )}
          </PopoverContent>
        </Popover>

        <Select
          onValueChange={(value) =>
            setColumnFilters([{ id: 'category', value }])
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(data.map((d) => d.category))).map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CardContent className="p-0 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold tracking-wider">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="p-3 text-left">
                    <div
                      {...{
                        onClick: h.column.getToggleSortingHandler(),
                        style: { cursor: h.column.getCanSort() ? 'pointer' : 'default' },
                      }}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[String(h.column.getIsSorted()) as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b-[.5px] border-gray-200 dark:border-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      <div className="p-3 flex items-center justify-between">
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </div>
        <div className="text-xs text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </Card>
  );
}
