'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/format';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
}

interface ProductTableProps {
  data: Product[];
}

function StockBadge({ stock }: { stock: number }) {
  let cls = "text-xs px-2 py-1 rounded-full";
  if (stock > 50) cls += " bg-green-100 text-green-800";
  else if (stock >= 10) cls += " bg-yellow-100 text-yellow-800";
  else cls += " bg-red-100 text-red-800";
  return <span className={cls}>{stock}</span>;
}

export default function ProductTable({ data }: ProductTableProps) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
    },
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
      cell: (info) =>
        (info.getValue() as boolean) ? (
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
        ) : (
          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">Inactive</span>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      setPageIndex(typeof updater === 'function' ? updater(pageIndex) : (updater as any).pageIndex ?? pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="shadow-sm p-0 rounded-none">
      <CardContent className="p-0 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold tracking-wider">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="text-left p-3 text-sm">
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
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b-[.5px] border-gray-200 dark:border-gray-700">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      {/* pagination */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded mr-2"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded mr-2"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded ml-2"
          >
            {'>>'}
          </button>
        </div>
        <div className="text-xs text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </Card>
  );
}
