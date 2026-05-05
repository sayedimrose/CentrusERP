'use client';

import React, { useState, useMemo, CSSProperties } from 'react';
import Badge from './Badge';
import { Heart, MessageCircle, GripVertical } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getFilteredRowModel,
  RowSelectionState,
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

interface TaskRow {
  id: string;
  subject: string;
  status: 'Completed' | 'Working' | 'Overdue';
  project: string;
  isGroup: boolean;
  priority: 'High' | 'Low';
  comments: number;
  hearts: number;
}

const MOCK_DATA: TaskRow[] = [
  { id: 'TASK-2023-01', subject: 'Finalise plant venue', status: 'Completed', project: 'PROJ-0002', isGroup: false, priority: 'High', comments: 0, hearts: 0 },
  { id: 'TASK-2023-02', subject: 'Map budget', status: 'Completed', project: 'PROJ-0002', isGroup: false, priority: 'Low', comments: 0, hearts: 0 },
  { id: 'TASK-2023-03', subject: 'Identify responsible team', status: 'Completed', project: 'PROJ-0002', isGroup: false, priority: 'Low', comments: 0, hearts: 0 },
  { id: 'TASK-2023-04', subject: 'Registrations and Certifications', status: 'Working', project: 'PROJ-0002', isGroup: false, priority: 'Low', comments: 0, hearts: 0 },
  { id: 'TASK-2023-05', subject: 'Purchase assets', status: 'Overdue', project: 'PROJ-0002', isGroup: true, priority: 'Low', comments: 0, hearts: 0 },
  { id: 'TASK-2023-06', subject: 'Purchase machinery', status: 'Overdue', project: 'PROJ-0002', isGroup: false, priority: 'Low', comments: 0, hearts: 0 },
  { id: 'TASK-2023-07', subject: 'Purchase furniture', status: 'Overdue', project: 'PROJ-0002', isGroup: false, priority: 'Low', comments: 0, hearts: 0 },
  { id: 'TASK-2023-08', subject: 'Planning', status: 'Completed', project: 'PROJ-0002', isGroup: true, priority: 'Low', comments: 0, hearts: 0 },
  { id: 'TASK-2023-09', subject: 'Completion', status: 'Overdue', project: 'PROJ-0002', isGroup: true, priority: 'Low', comments: 0, hearts: 0 },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Working': return 'warning';
    case 'Overdue': return 'danger';
    default: return 'default';
  }
};

// Sortable Header Component
const SortableHeader = ({ header, table }: { header: any; table: any }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.getSize(),
    position: 'relative',
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-4 py-3 font-medium text-text-muted bg-gray-50/50 border-b border-border-subtle select-none"
    >
      <div className="flex items-center gap-2 relative">
        {header.column.id !== 'select' && header.column.id !== 'actions' && (
          <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        )}
        {flexRender(header.column.columnDef.header, header.getContext())}
        
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

export default function DataTable() {
  const [data] = useState(() => [...MOCK_DATA]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([
    'select', 'subject', 'status', 'project', 'isGroup', 'priority', 'id', 'actions'
  ]);

  const columns = useMemo<ColumnDef<TaskRow>[]>(
    () => [
      {
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
          />
        ),
        size: 50,
        enableResizing: false,
      },
      {
        accessorKey: 'subject',
        header: 'Subject',
        cell: info => <span className="font-medium text-text-main">{info.getValue() as string}</span>,
        size: 250,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => <Badge variant={getStatusVariant(info.getValue() as string)}>{info.getValue() as string}</Badge>,
        size: 120,
      },
      {
        accessorKey: 'project',
        header: 'Project',
        cell: info => <span className="text-text-main">{info.getValue() as string}</span>,
        size: 150,
      },
      {
        accessorKey: 'isGroup',
        header: 'Is Group',
        cell: info => info.getValue() ? (
          <div className="w-4 h-4 bg-gray-500 rounded text-white flex items-center justify-center text-[10px]">✓</div>
        ) : null,
        size: 100,
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: info => (
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${info.getValue() === 'High' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
            <span className="text-text-main">{info.getValue() as string}</span>
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: 'id',
        header: 'ID',
        cell: info => <span className="text-text-main">{info.getValue() as string}</span>,
        size: 150,
      },
      {
        id: 'actions',
        header: () => (
          <div className="flex justify-end gap-2 items-center w-full">
            <span>19 of 19</span>
            <Heart className="w-4 h-4" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-3 text-text-muted">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {row.original.comments}
            </span>
            <Heart className="w-3.5 h-3.5" />
          </div>
        ),
        size: 150,
        enableResizing: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: 'onChange',
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder(columnOrder => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="w-full flex flex-col h-full">


      {/* Table Container */}
      <div className="flex-1 overflow-auto border border-border-subtle rounded-lg bg-surface">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table 
            className="w-max text-sm text-left"
            style={{ width: table.getCenterTotalSize() }}
          >
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map(header => (
                      <SortableHeader key={header.id} header={header} table={table} />
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 truncate"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </DndContext>
      </div>
    </div>
  );
}
