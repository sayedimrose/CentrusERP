'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Search, 
  X,
  Check,
  Bookmark,
  Pencil,
  Trash2
} from 'lucide-react';

export interface FilterOption {
  label: string;
  count?: number;
  color?: string;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

interface CFilterSidebarProps {
  groups: FilterGroup[];
  className?: string;
}

export default function CFilterSidebar({ 
  groups,
  className = ""
}: CFilterSidebarProps) {
  const [filterName, setFilterName] = useState('');
  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'Active Records' },
    { id: 2, name: 'Recently Added' },
  ]);
  const [activeFilterId, setActiveFilterId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSave = () => {
    if (!filterName.trim()) return;
    const nextId = savedFilters.length ? Math.max(...savedFilters.map(f => f.id)) + 1 : 1;
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
    <div className={`w-52 flex-shrink-0 flex flex-col gap-3 pr-2 border-r border-border-subtle mr-3 overflow-y-auto ${className}`}>
      
      {/* 1. Saved Filters */}
      {savedFilters.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">Saved Filters</p>
          <div className="flex flex-col gap-0.5">
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
      <div className="px-1">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Save Filter</p>
        <input
          type="text"
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          placeholder="Filter Name"
          className="w-full px-2.5 py-1.5 text-sm border border-border-subtle rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-[1.5px] focus:ring-inset focus:ring-primary focus:border-primary transition-all"
        />
        {filterName.trim() && (
          <button 
            onClick={handleSave} 
            className="mt-2 w-full bg-primary text-white text-xs font-bold py-2 rounded-md hover:bg-primary-hover transition-colors shadow-sm"
          >
            Save Filter
          </button>
        )}
      </div>

      {/* 3. Filter By */}
      <div className="pt-3 border-t border-border-subtle">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-1">Filter By</p>
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <ComboboxFilter key={group.id} {...group} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ComboboxFilter({ title, options }: FilterGroup) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (label: string) => {
    setSelected(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="relative px-1" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md border text-sm transition-all ${
          isOpen
            ? 'border-primary ring-[1.5px] ring-inset ring-primary bg-white shadow-sm'
            : 'border-border-subtle hover:border-gray-300 bg-gray-50 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">
            {title}
          </span>
          {selected.length > 0 && (
            <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-border-subtle rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-border-subtle bg-gray-50/50">
            <Search className="w-3.5 h-3.5 text-text-muted" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-text-muted"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => toggleOption(opt.label)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 text-sm transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {opt.color && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: opt.color }} />
                    )}
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                      selected.includes(opt.label) ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
                    }`}>
                      {selected.includes(opt.label) && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    <span className={selected.includes(opt.label) ? 'font-semibold text-text-main' : 'text-text-main'}>
                      {opt.label}
                    </span>
                  </div>
                  {opt.count !== undefined && (
                    <span className="text-xs text-text-muted font-medium">{opt.count}</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-text-muted text-sm italic">
                No results found
              </div>
            )}
          </div>
          {selected.length > 0 && (
            <div className="px-3 py-2 border-t border-border-subtle flex justify-between items-center bg-gray-50/30">
              <span className="text-[10px] font-bold text-text-muted uppercase">{selected.length} selected</span>
              <button
                onClick={() => setSelected([])}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
