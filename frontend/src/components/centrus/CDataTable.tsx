'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getFilteredRowModel,
  RowSelectionState,
  OnChangeFn,
} from '@tanstack/react-table';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onRowClick?: (row: T) => void;
}

// Sortable Header Component
const SortableHeader = ({ header, isLast }: { header: any; isLast: boolean }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    position: 'relative',
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-4 py-3 font-medium text-text-muted bg-gray-50/50 border-b border-border-subtle select-none"
    >
      <div className="flex items-center gap-2 relative">
        {header.column.id !== 'select' && header.column.id !== 'actions' && (
          <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 focus:outline-none">
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        )}
        <span className="truncate">{flexRender(header.column.columnDef.header, header.getContext())}</span>
        
        {/* Resize Handle */}
        {header.column.getCanResize() && (
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 transition-colors ${
              header.column.getIsResizing() ? 'bg-primary' : ''
            }`}
            style={{ transform: 'translateX(50%)' }}
          />
        )}
      </div>
    </th>
  );
};

export default function CDataTable<T>({ 
  data, 
  columns, 
  rowSelection = {}, 
  onRowSelectionChange,
  onRowClick
}: CDataTableProps<T>) {
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Selection Column
  const selectionColumn = useMemo<ColumnDef<T>>(() => ({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className="rounded border-gray-300 cursor-pointer"
        style={{ accentColor: '#673ee6' }}
        checked={table.getIsAllRowsSelected()}
        ref={el => {
          if (el) el.indeterminate = table.getIsSomeRowsSelected();
        }}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="rounded border-gray-300 cursor-pointer opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ accentColor: '#673ee6' }}
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    size: 50,
    enableResizing: false,
  }), []);

  const finalColumns = useMemo(() => {
    const cols = [...columns];
    if (!cols.find(c => c.id === 'select')) {
      cols.unshift(selectionColumn);
    }
    return cols;
  }, [columns, selectionColumn]);

  useEffect(() => {
    setColumnOrder(finalColumns.map(c => c.id || (c as any).accessorKey as string).filter(Boolean));
  }, [finalColumns]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: onRowSelectionChange,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: 'onChange',
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder(prev => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const TableContent = (
    <table 
      className="w-full text-left border-collapse min-w-full"
      style={{ tableLayout: 'auto', fontSize: '0.8125rem' }}
    >
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {isMounted ? (
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {headerGroup.headers.map((header, index) => {
                  const isLast = index === headerGroup.headers.length - 1;
                  return (
                    <SortableHeader 
                      key={header.id} 
                      header={header} 
                      isLast={isLast} 
                    />
                  );
                })}
              </SortableContext>
            ) : (
              headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  className="px-4 py-3 font-medium text-text-muted bg-gray-50/50 border-b border-border-subtle whitespace-nowrap"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))
            )}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y divide-border-subtle">
        {table.getRowModel().rows.map(row => (
          <tr 
            key={row.id} 
            onClick={() => onRowClick?.(row.original)}
            className={`
              hover:bg-gray-50 transition-colors group 
              ${row.getIsSelected() ? 'bg-primary-light/20' : ''}
              ${onRowClick ? 'cursor-pointer' : ''}
            `}
          >
            {row.getVisibleCells().map((cell, index) => {
              return (
                <td
                  key={cell.id}
                  className="px-4 py-3 whitespace-nowrap"
                >
                  <div className="flex items-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto border border-border-subtle rounded-lg bg-surface shadow-sm">
        {isMounted ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {TableContent}
          </DndContext>
        ) : (
          TableContent
        )}
      </div>
    </div>
  );
}
