'use client'

import type React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ColumnDef<T> {
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  keyExtractor: (row: T) => string
  renderCard: (row: T) => React.ReactNode
  loading?: boolean
  emptyMessage?: string
  skeletonRows?: number
  rowClassName?: (row: T) => string | undefined
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  renderCard,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  skeletonRows = 5,
  rowClassName,
}: DataTableProps<T>) {
  if (loading) return (
    <div className="space-y-2">
      {Array.from({ length: skeletonRows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )

  if (!data.length) return (
    <p className="text-sm text-muted-foreground text-center py-10">{emptyMessage}</p>
  )

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i} className={col.headerClassName}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={keyExtractor(row)} className={rowClassName?.(row)}>
                {columns.map((col, i) => (
                  <TableCell key={i} className={col.className}>{col.cell(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {data.map((row) => (
          <div key={keyExtractor(row)}>{renderCard(row)}</div>
        ))}
      </div>
    </>
  )
}

