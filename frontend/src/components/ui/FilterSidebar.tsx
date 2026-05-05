'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search, Bookmark, Trash2, Pencil } from 'lucide-react';

interface FilterOption {
  label: string;
  count?: number;
  color?: string;
}

interface ComboboxFilterProps {
  title: string;
  options: FilterOption[];
}

function ComboboxFilter({ title, options }: ComboboxFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (label: string) => {
    setSelected(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const removeSelected = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(prev => prev.filter(l => l !== label));
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md border text-sm transition-all ${
          isOpen
            ? 'border-primary ring-[1.5px] ring-inset ring-primary bg-white'
            : 'border-border-subtle hover:border-gray-300 bg-gray-50 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">
            {title}
          </span>
          {selected.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {selected.slice(0, 2).map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-0.5 bg-primary-light text-primary text-xs px-1.5 py-0.5 rounded font-medium"
                >
                  {s}
                  <button onClick={(e) => removeSelected(s, e)} className="hover:text-primary-hover">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {selected.length > 2 && (
                <span className="text-xs text-text-muted">+{selected.length - 2}</span>
              )}
            </div>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted flex-shrink-0 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-border-subtle rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-border-subtle">
            <Search className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="flex-1 text-sm outline-none text-text-main placeholder:text-text-muted bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-main">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-text-muted text-center">No results found</div>
            ) : (
              filtered.map(opt => {
                const isSelected = selected.includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    onClick={() => toggle(opt.label)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                      isSelected ? 'bg-primary-light text-primary' : 'hover:bg-gray-50 text-text-main'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.color && (
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: opt.color }} />
                      )}
                      <div className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-primary border-primary' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span>{opt.label}</span>
                    </div>
                    {opt.count !== undefined && (
                      <span className="text-xs text-text-muted">{opt.count}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {selected.length > 0 && (
            <div className="px-3 py-2 border-t border-border-subtle flex justify-between items-center">
              <span className="text-xs text-text-muted">{selected.length} selected</span>
              <button
                onClick={() => setSelected([])}
                className="text-xs text-primary hover:underline font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar() {
  const [filterName, setFilterName] = useState('');
  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'My Overdue Tasks' },
    { id: 2, name: 'High Priority' },
  ]);
  const [activeFilterId, setActiveFilterId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  let nextId = savedFilters.length ? Math.max(...savedFilters.map(f => f.id)) + 1 : 1;

  const handleSave = () => {
    if (!filterName.trim()) return;
    setSavedFilters(prev => [...prev, { id: nextId, name: filterName.trim() }]);
    setFilterName('');
  };

  const handleApply = (id: number) => {
    if (editingId) return;
    setActiveFilterId(prev => prev === id ? null : id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFilters(prev => prev.filter(f => f.id !== id));
    if (activeFilterId === id) setActiveFilterId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleEditStart = (id: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(name);
  };

  const handleEditSave = (id: number) => {
    if (editValue.trim()) {
      setSavedFilters(prev => prev.map(f => f.id === id ? { ...f, name: editValue.trim() } : f));
    }
    setEditingId(null);
  };

  return (
    <div className="w-52 flex-shrink-0 flex flex-col gap-3 pr-2 border-r border-border-subtle mr-3 overflow-y-auto">

      {/* 1. Saved Filters */}
      {savedFilters.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Saved Filters</p>
          <div className="flex flex-col gap-1">
            {savedFilters.map(f => (
              <div
                key={f.id}
                onClick={() => handleApply(f.id)}
                className={`group flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                  activeFilterId === f.id
                    ? 'bg-primary-light text-primary font-medium'
                    : 'text-text-main hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 flex-shrink-0 ${
                  activeFilterId === f.id ? 'text-primary fill-primary' : 'text-text-muted'
                }`} />
                {editingId === f.id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => handleEditSave(f.id)}
                    onKeyDown={e => { if (e.key === 'Enter') handleEditSave(f.id); if (e.key === 'Escape') setEditingId(null); }}
                    onClick={e => e.stopPropagation()}
                    className="flex-1 min-w-0 text-sm bg-transparent border-b border-primary outline-none py-0"
                  />
                ) : (
                  <span className="flex-1 truncate">{f.name}</span>
                )}
                {editingId !== f.id && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => handleEditStart(f.id, f.name, e)}
                      className="p-0.5 text-text-muted hover:text-primary"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(f.id, e)}
                      className="p-0.5 text-text-muted hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Save Filter */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Save Filter</p>
        <input
          type="text"
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          placeholder="Filter Name"
          className="w-full px-2.5 py-1.5 text-sm border border-border-subtle rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-[1.5px] focus:ring-inset focus:ring-primary focus:border-primary transition-all"
        />
        {filterName && (
          <button onClick={handleSave} className="mt-2 w-full btn btn-primary h-8 text-xs">
            Save
          </button>
        )}
      </div>

      {/* 3. Filter By */}
      <div className="pt-3 border-t border-border-subtle">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Filter By</p>

        <div className="flex flex-col gap-3">
          <ComboboxFilter
            title="Assigned To"
            options={[
              { label: 'Sayed Abbas', count: 5 },
              { label: 'Ahmed Al-Rashidi', count: 3 },
              { label: 'Fatima Khalid', count: 2 },
              { label: 'Unassigned', count: 4 },
            ]}
          />

          <ComboboxFilter
            title="Created By"
            options={[
              { label: 'Sayed Abbas', count: 9 },
              { label: 'Ahmed Al-Rashidi', count: 5 },
            ]}
          />

          <ComboboxFilter
            title="Status"
            options={[
              { label: 'Completed', count: 4, color: '#22c55e' },
              { label: 'Working', count: 2, color: '#f97316' },
              { label: 'Overdue', count: 5, color: '#ef4444' },
            ]}
          />

          <ComboboxFilter
            title="Priority"
            options={[
              { label: 'High', count: 1, color: '#ef4444' },
              { label: 'Low', count: 8, color: '#9ca3af' },
            ]}
          />

          <ComboboxFilter
            title="Tags"
            options={[
              { label: 'Finance', count: 3 },
              { label: 'Operations', count: 4 },
              { label: 'Procurement', count: 2 },
              { label: 'HR', count: 1 },
            ]}
          />
        </div>
      </div>

    </div>
  );
}
