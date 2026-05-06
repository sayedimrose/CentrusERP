'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Plus, 
  FileText, 
  Printer, 
  RefreshCcw, 
  Eye, 
  Building2, 
  Settings2,
  Users,
  Wallet,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Table as TableIcon,
  Download,
  Search,
  ChevronDown,
  Layers,
  SortAsc,
  Filter as FilterIcon,
  LayoutGrid,
  ClipboardList,
  Monitor,
  FileDown,
  FileSpreadsheet,
  File as FileCsv,
  ZoomIn,
  ZoomOut,
  Maximize
} from 'lucide-react';
import { 
  CCard, 
  CButton, 
  CIconBadge, 
  CPageTitle,
  CDataTable,
  CDialog,
  CSelect,
  CInput,
  CBadge,
  CSectionHeader,
  useToasts,
  CToast,
  CDropdownMenu
} from '@/components/centrus';

type ReportType = 'EMPLOYEE_MASTER' | 'PAYROLL_DISBURSEMENT' | 'LEAVE_AUDIT' | 'ATTENDANCE_ANALYTICS';
type ViewMode = 'DATA' | 'REPORT';

interface ReportConfig {
  type: ReportType;
  title: string;
  ref: string;
  date: string;
  groupBy: string;
  sortBy: string;
}

export default function HRReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [viewMode, setViewMode] = useState<ViewMode>('DATA');
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const { toasts, addToast, removeToast } = useToasts();

  const reportData = useMemo(() => {
    if (!activeReport) return [];
    
    if (activeReport.type === 'EMPLOYEE_MASTER') {
      return [
        { id: 'EMP-1001', name: 'Sayed Abbas', department: 'Engineering', designation: 'Senior Developer', status: 'Active', joined: 'Jan 15, 2023' },
        { id: 'EMP-1002', name: 'Mohammed Ali', department: 'Management', designation: 'Operations Manager', status: 'Active', joined: 'Mar 10, 2022' },
        { id: 'EMP-1003', name: 'John Smith', department: 'Engineering', designation: 'Specialist', status: 'On Leave', joined: 'Jun 22, 2024' },
        { id: 'EMP-1004', name: 'Sarah Ahmed', department: 'Marketing', designation: 'Lead Designer', status: 'Active', joined: 'Feb 14, 2024' },
        { id: 'EMP-1005', name: 'Ali Hassan', department: 'Management', designation: 'Director', status: 'Active', joined: 'Oct 01, 2021' },
      ];
    }
    
    if (activeReport.type === 'PAYROLL_DISBURSEMENT') {
      return [
        { employee: 'Sayed Abbas', department: 'Engineering', base: 12000, allowances: 3000, deductions: 500, net_pay: 14500 },
        { employee: 'Mohammed Ali', department: 'Management', base: 15000, allowances: 2000, deductions: 0, net_pay: 17000 },
        { employee: 'John Smith', department: 'Engineering', base: 8000, allowances: 1500, deductions: 200, net_pay: 9300 },
        { employee: 'Sarah Ahmed', department: 'Marketing', base: 11000, allowances: 1000, deductions: 100, net_pay: 11900 },
      ];
    }

    if (activeReport.type === 'LEAVE_AUDIT') {
      return [
        { employee: 'Sayed Abbas', department: 'Engineering', type: 'Annual', days: 10, status: 'Approved' },
        { employee: 'Sarah Ahmed', department: 'Marketing', type: 'Sick', days: 2, status: 'Approved' },
        { employee: 'John Smith', department: 'Engineering', type: 'Casual', days: 1, status: 'Pending' },
      ];
    }

    return [];
  }, [activeReport]);

  const handleGenerate = () => {
    if (!reportType) return;

    const titles = {
      'EMPLOYEE_MASTER': 'Employee Master Directory',
      'PAYROLL_DISBURSEMENT': 'Monthly Payroll Disbursement Report',
      'LEAVE_AUDIT': 'Employee Leave & Vacation Audit',
      'ATTENDANCE_ANALYTICS': 'Attendance Performance Analytics'
    };
    
    setActiveReport({
      type: reportType as ReportType,
      title: titles[reportType as ReportType],
      ref: `HR-${reportType.substring(0, 3)}-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
      groupBy: 'Department',
      sortBy: 'Employee Name'
    });
    setIsModalOpen(false);
    addToast('HR Intelligence Report generated!', 'success');
  };

  const handleZoom = (type: 'IN' | 'OUT' | 'RESET') => {
    if (type === 'IN') setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
    if (type === 'OUT') setZoomLevel(prev => Math.max(prev - 0.1, 0.4));
    if (type === 'RESET') setZoomLevel(0.8);
  };

  const exportActions = [
    {
      group: 'Document Formats',
      items: [
        { label: 'Export as Excel', icon: <FileSpreadsheet className="w-4 h-4 text-green-600" />, onClick: () => addToast('Exporting to Excel...', 'info') },
        { label: 'Export as CSV', icon: <FileCsv className="w-4 h-4 text-blue-600" />, onClick: () => addToast('Exporting to CSV...', 'info') },
        { label: 'Save as PDF', icon: <FileDown className="w-4 h-4 text-red-600" />, onClick: () => window.print() },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      <CToast toasts={toasts} onRemove={removeToast} />

      {/* Global Print Styling */}
      <style jsx global>{`
        @media print {
          @page { size: auto; margin: 5mm; }
          body * { visibility: hidden; box-sizing: border-box; }
          .print-document, .print-document * { visibility: visible; }
          .print-document {
            position: absolute !important;
            left: 0 !important; top: 0 !important;
            width: 100% !important;
            padding: 1.5cm !important;
            background: white !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .document-section { width: 100% !important; margin-bottom: 2rem !important; page-break-inside: avoid !important; }
          header, nav, aside, footer, .screen-only { display: none !important; }
        }
      `}</style>

      {/* Screen Action Bar */}
      <div className="flex items-center justify-between screen-only">
        <div className="flex items-center gap-4">
          <CIconBadge icon={<BarChart3 className="w-4 h-4" />} colorClass="bg-gray-100 text-text-muted" shape="circle" size="lg" />
          <CPageTitle>HR Intelligence Reports</CPageTitle>
        </div>
        <div className="flex items-center gap-2">
          {activeReport && (
            <>
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-border-subtle mr-2 shadow-sm">
                <button 
                  onClick={() => setViewMode('DATA')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${viewMode === 'DATA' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main'}`}
                >
                  <TableIcon className="w-3.5 h-3.5" /> Data View
                </button>
                <button 
                  onClick={() => setViewMode('REPORT')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${viewMode === 'REPORT' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main'}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Report View
                </button>
              </div>
              <CDropdownMenu 
                trigger={<CButton variant="outline" size="md" icon={<Download className="w-4 h-4" />}>Export</CButton>}
                groups={exportActions}
                align="right"
              />
              <CButton variant="primary" size="md" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>Print</CButton>
            </>
          )}
          <CButton 
            variant="outline" 
            size="md" 
            className="!border-primary !text-primary hover:!bg-primary/5"
            icon={<Plus className="w-4 h-4" />} 
            onClick={() => setIsModalOpen(true)}
          >
            Create Report
          </CButton>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {!activeReport ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 screen-only">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-border-subtle">
              <FileText className="w-10 h-10 text-primary/30" />
            </div>
            <h3 className="text-base font-bold text-text-main text-center">No Active HR Report</h3>
            <p className="text-xs text-text-muted mt-2 max-w-xs text-center leading-relaxed font-sans">
              Select a template and customize your parameters to generate a professional document.
            </p>
            <CButton variant="primary" size="md" className="mt-8 shadow-lg shadow-primary/20 px-8" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
              Create Report
            </CButton>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* 1. DATA VIEW (Standard Table) */}
            {viewMode === 'DATA' && (
              <CCard padding="none" className="flex-1 flex flex-col overflow-hidden shadow-sm border-border-subtle screen-only">
                <div className="px-5 py-4 border-b border-border-subtle bg-white flex items-center justify-between">
                  <CSectionHeader 
                    title={activeReport.title}
                    subtitle={`Raw data table with smart sorting · ${reportData.length} records`}
                  />
                  <div className="flex items-center gap-2">
                    <CButton variant="outline" size="sm" icon={<RefreshCcw className="w-3.5 h-3.5" />} onClick={handleGenerate}>Re-run</CButton>
                    <CButton variant="outline" size="sm" icon={<Settings2 className="w-3.5 h-3.5" />} onClick={() => setIsModalOpen(true)}>Adjust</CButton>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-gray-50/30">
                  <CDataTable 
                    data={reportData} 
                    columns={Object.keys(reportData[0] || {}).map(key => ({
                      accessorKey: key,
                      header: key.replace('_', ' ').toUpperCase(),
                      cell: info => <span className={typeof info.getValue() === 'number' ? 'font-mono' : ''}>{info.getValue() as string}</span>
                    }))} 
                  />
                </div>
              </CCard>
            )}

            {/* 2. REPORT VIEW (Interactive Paper Preview) */}
            {viewMode === 'REPORT' && (
              <div className="flex-1 overflow-auto p-10 bg-slate-100 rounded-2xl screen-only relative group scrollbar-hide">
                {/* Zoom Controls Floating Toolbar */}
                <div className="fixed top-[180px] right-12 flex items-center gap-1 bg-white p-1 rounded-xl shadow-xl border border-border-subtle z-30 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleZoom('OUT')} className="p-2 hover:bg-gray-100 rounded-lg text-text-muted"><ZoomOut className="w-4 h-4" /></button>
                  <div className="px-2 text-[10px] font-bold text-text-main min-w-[40px] text-center">{Math.round(zoomLevel * 100)}%</div>
                  <button onClick={() => handleZoom('IN')} className="p-2 hover:bg-gray-100 rounded-lg text-text-muted"><ZoomIn className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button onClick={() => handleZoom('RESET')} className="p-2 hover:bg-gray-100 rounded-lg text-text-muted"><Maximize className="w-4 h-4" /></button>
                </div>

                <div className="flex flex-col items-center w-full min-h-full">
                  <div 
                    className="bg-white w-[210mm] min-h-[297mm] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-0 mb-20 flex-shrink-0"
                    style={{ zoom: zoomLevel } as any}
                  >
                    <div className="p-[1.5cm]">
                      <HRReportDocument report={activeReport} data={reportData} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. HIDDEN PRINT CONTAINER */}
            <div className="hidden print:block print-document">
              <HRReportDocument report={activeReport} data={reportData} />
            </div>
          </div>
        )}
      </div>

      {/* Configuration Dialog */}
      <CDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report Configuration"
        icon={<Settings2 className="w-5 h-5" />}
        maxWidth="max-w-xl"
        buttons={[
          { label: 'Cancel', onClick: () => setIsModalOpen(false), variant: 'outline' },
          { label: 'Generate Report', onClick: handleGenerate, variant: 'primary', disabled: !reportType },
        ]}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <CSectionHeader title="1. Report Template" subtitle="Choose the base module for your report" icon={<ClipboardList className="w-4 h-4 text-primary" />} />
            <CSelect placeholder="Choose a template..." options={[{ label: 'Employee Master List', value: 'EMPLOYEE_MASTER' }, { label: 'Payroll Disbursement Report', value: 'PAYROLL_DISBURSEMENT' }, { label: 'Employee Leave & Vacation Audit', value: 'LEAVE_AUDIT' }, { label: 'Attendance Performance Analytics', value: 'ATTENDANCE_ANALYTICS' }]} onChange={(e: any) => setReportType(e.target.value as ReportType)} defaultValue={reportType} />
          </div>

          {reportType && (
            <div className="pt-8 border-t border-border-subtle space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-6">
                <CSectionHeader title="2. Smart Customization" subtitle="Define filters, grouping, and document structure" icon={<LayoutGrid className="w-4 h-4 text-primary" />} />
                <div className="grid grid-cols-2 gap-6">
                  <CSelect label="Filter By Status" options={[{ label: 'All Statuses', value: 'all' }, { label: 'Active Only', value: 'active' }, { label: 'On Leave', value: 'leave' }]} defaultValue="all" selectSize="sm" />
                  <CSelect label="Data Grouping" options={[{ label: 'None', value: 'none' }, { label: 'Department', value: 'department' }, { label: 'Branch', value: 'branch' }]} defaultValue="department" selectSize="sm" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <CSelect label="Primary Sort" options={[{ label: 'Employee Name (A-Z)', value: 'name' }, { label: 'ID Number', value: 'id' }, { label: 'Joined Date', value: 'date' }]} defaultValue="name" selectSize="sm" />
                  <div className="grid grid-cols-2 gap-2 items-end">
                    <CInput label="From Date" type="date" className="!h-[34px] !text-xs !py-1" />
                    <CInput label="To Date" type="date" className="!h-[34px] !text-xs !py-1" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CDialog>
    </div>
  );
}

// FORMAL HR DOCUMENT COMPONENT WITH GROUPING SUPPORT
function HRReportDocument({ report, data }: { report: ReportConfig, data: any[] }) {
  // Grouping Logic
  const groupedData = useMemo(() => {
    if (!report.groupBy || report.groupBy === 'None') return { 'Report Records': data };
    
    const key = report.groupBy.toLowerCase();
    return data.reduce((acc: any, curr: any) => {
      const groupVal = curr[key] || 'Unassigned';
      if (!acc[groupVal]) acc[groupVal] = [];
      acc[groupVal].push(curr);
      return acc;
    }, {});
  }, [report, data]);

  const totals = useMemo(() => {
    if (report.type === 'PAYROLL_DISBURSEMENT') {
      return data.reduce((acc, curr) => ({
        net: acc.net + (curr.net_pay || 0),
      }), { net: 0 });
    }
    return null;
  }, [report, data]);

  return (
    <div className="w-full text-black font-serif">
      <div className="flex justify-between items-start border-b-[3px] border-black pb-8 mb-10 document-section">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center rounded-2xl text-white text-2xl font-black">C</div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none text-black">Centrus ERP</h1>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mt-2 text-black">Human Resources Intelligence</p>
            <div className="text-[9px] text-gray-500 mt-4 leading-relaxed font-sans text-black/60">
              Riyadh Head Office, Kingdom of Saudi Arabia<br />
              CR: 1010887766 · VAT: 300099887700003
            </div>
          </div>
        </div>
        <div className="text-right font-sans">
          <h2 className="text-3xl font-black text-gray-100 uppercase tracking-tighter mb-4 opacity-50 text-black">OFFICIAL COPY</h2>
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Document Ref</p>
            <p className="text-xs font-black tracking-tight text-black">{report.ref}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-3">Issue Date</p>
            <p className="text-xs font-bold text-black">{report.date}</p>
          </div>
        </div>
      </div>

      <div className="mb-12 text-center document-section">
        <h3 className="text-xl font-black uppercase underline decoration-2 underline-offset-8 mb-4 tracking-tight text-black">{report.title}</h3>
        <p className="text-[10px] text-gray-500 font-sans italic max-w-lg mx-auto text-black/80">Report grouped by {report.groupBy} and sorted by {report.sortBy}.</p>
      </div>

      {/* Grouped Data Table */}
      <div className="mb-12 document-section">
        <table className="w-full border-collapse font-sans">
          <thead>
            <tr className="border-y-2 border-black bg-gray-50">
              {Object.keys(data[0] || {}).filter(k => k !== report.groupBy.toLowerCase()).map((key, i) => (
                <th key={i} className="text-left py-3 px-2 text-[10px] font-black uppercase tracking-wider text-black">{key.replace('_', ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([group, rows]: [string, any], gi) => (
              <React.Fragment key={gi}>
                {/* Group Header Row */}
                <tr className="bg-gray-100 border-b border-black">
                  <td colSpan={Object.keys(data[0] || {}).length} className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-3 bg-primary rounded-full" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-black">{group}</span>
                      <span className="text-[9px] text-gray-500 font-bold ml-2">({rows.length} Records)</span>
                    </div>
                  </td>
                </tr>
                {/* Data Rows */}
                {rows.map((row: any, ri: number) => (
                  <tr key={ri} className="border-b border-gray-100 hover:bg-gray-50/30">
                    {Object.entries(row).filter(([k]) => k !== report.groupBy.toLowerCase()).map(([k, val]: [string, any], ci) => (
                      <td key={ci} className={`py-4 px-2 text-[11px] text-black ${typeof val === 'number' ? 'font-mono text-right font-bold' : ''}`}>
                        {typeof val === 'number' ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {totals && (
        <div className="flex justify-end mb-16 document-section">
          <div className="w-72 space-y-2 font-sans text-black">
            <div className="flex justify-between text-base font-black py-4 border-t-2 border-black">
              <span className="uppercase text-black">Grand Net Total</span>
              <span className="text-black">SAR {totals.net.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 grid grid-cols-2 gap-20 font-sans document-section">
        <div className="space-y-6">
          <div className="h-24 w-44 border-2 border-dashed border-gray-200 flex items-center justify-center relative">
             <ShieldCheck className="w-8 h-8 text-gray-100" />
             <span className="absolute bottom-2 text-[7px] font-black text-gray-300 uppercase">Official HR Seal</span>
          </div>
          <div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Prepared By</p>
            <p className="text-[10px] font-bold uppercase text-black">HR Intelligence Unit</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end justify-end">
          <div className="w-56 h-px bg-black mb-2" />
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-black">Authorized HR Signatory</p>
          <p className="text-[8px] text-gray-400 mt-5 uppercase italic">Electronic record: Non-editable system copy.</p>
        </div>
      </div>

      <div className="fixed bottom-10 left-0 right-0 px-0 print:block hidden">
        <div className="border-t border-gray-100 pt-6 flex justify-between items-center text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] font-sans">
          <p>© 2026 CENTRUS ERP · KSA REGION</p>
          <p>CONFIDENTIAL · PAGE 1 OF 1</p>
        </div>
      </div>
    </div>
  );
}
