import React from 'react';
import { 
  FileText, 
  Plus, 
  Printer, 
  Download, 
  History, 
  Sparkles,
  CheckCircle2,
  Loader2,
  LayoutDashboard,
  Users,
  Layers,
  Building2,
  Settings as SettingsIcon,
  RotateCcw
} from 'lucide-react';
import { AppNavTab } from '../types';

interface HeaderProps {
  activeTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
  onNewInvoice: () => void;
  onResetInvoice: () => void;
  onOpenTemplates: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onNewInvoice,
  onResetInvoice,
  onOpenTemplates,
  onPrint,
  onDownloadPdf,
  isGeneratingPdf,
  saveStatus,
  historyCount,
}) => {
  const navItems: { id: AppNavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Invoice', icon: Plus },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Business Profile', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand & Action Controls */}
        <div className="py-3 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-100">
          {/* Brand & Status */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div 
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Invoice<span className="text-indigo-600">Pro</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    Pro
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Storage Auto-Save Indicator */}
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all">
              {saveStatus === 'saving' ? (
                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 border-indigo-200 px-2 py-0.5 rounded-full">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-[11px]">Saving...</span>
                </div>
              ) : saveStatus === 'unsaved' ? (
                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border-amber-200 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[11px]">Unsaved changes</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px]">Saved</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Right-Hand Actions */}
          <div className="flex items-center flex-wrap justify-end gap-2 w-full md:w-auto">
            {activeTab === 'create' ? (
              <>
                <button
                  type="button"
                  onClick={onOpenTemplates}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Load sample template"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Templates</span>
                </button>

                <button
                  type="button"
                  onClick={onResetInvoice}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Clear current invoice draft"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  onClick={onPrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-700" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={onDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 rounded-xl shadow-sm shadow-indigo-200 transition-all cursor-pointer"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onNewInvoice}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-200 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Create Invoice</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'history' && historyCount > 0 && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {historyCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
