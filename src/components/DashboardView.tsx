import React from 'react';
import { 
  FileText, 
  DollarSign, 
  Users, 
  Layers, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Copy, 
  Trash2, 
  Download, 
  Building2, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Invoice, SavedCustomer, SavedService, BusinessProfile } from '../types';
import { calculateInvoiceTotals } from '../utils/calculations';
import { CURRENCIES } from '../data/currencies';

interface DashboardViewProps {
  invoices: Invoice[];
  customers: SavedCustomer[];
  services: SavedService[];
  businessProfile: BusinessProfile;
  onNavigateToCreate: () => void;
  onNavigateToCustomers: () => void;
  onNavigateToServices: () => void;
  onNavigateToProfile: () => void;
  onNavigateToHistory: () => void;
  onLoadInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onDownloadPdf: (invoice: Invoice) => void;
  onRequestConfirmDelete: (title: string, message: string, onConfirm: () => void) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  customers,
  services,
  businessProfile,
  onNavigateToCreate,
  onNavigateToCustomers,
  onNavigateToServices,
  onNavigateToProfile,
  onNavigateToHistory,
  onLoadInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onDownloadPdf,
  onRequestConfirmDelete,
}) => {
  // Aggregate stats
  const totalBilled = invoices.reduce((sum, inv) => {
    const totals = calculateInvoiceTotals(inv);
    return sum + (totals.grandTotal || 0);
  }, 0);

  const paidInvoicesCount = invoices.filter((i) => i.status === 'paid').length;
  const recentInvoices = invoices.slice(0, 5);

  const handleDelete = (inv: Invoice) => {
    onRequestConfirmDelete(
      'Delete Invoice?',
      `Are you sure you want to delete invoice ${inv.invoiceNumber}? This action cannot be undone.`,
      () => onDeleteInvoice(inv.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {businessProfile.name || 'InvoicePro'}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
              Active Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Create, manage, and export professional corporate invoices with instant state fee calculation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={onNavigateToCreate}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Invoices */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{invoices.length}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {paidInvoicesCount} marked as paid
            </p>
          </div>
        </div>

        {/* Metric 2: Total Revenue Billed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Billed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              ${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              Cumulative volume
            </p>
          </div>
        </div>

        {/* Metric 3: Saved Customers */}
        <div 
          onClick={onNavigateToCustomers}
          className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-2xs space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saved Clients</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{customers.length}</div>
            <p className="text-[11px] text-indigo-600 font-medium mt-0.5 flex items-center gap-0.5">
              <span>Manage clients</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Metric 4: Saved Services */}
        <div 
          onClick={onNavigateToServices}
          className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 shadow-2xs space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Catalog Services</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{services.length}</div>
            <p className="text-[11px] text-indigo-600 font-medium mt-0.5 flex items-center gap-0.5">
              <span>Manage rates</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>

      {/* Quick Setup / Shortcuts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={onNavigateToProfile}
          className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 p-4 shadow-2xs flex items-center gap-3 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Business Profile
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {businessProfile.name || 'Setup business details & logo'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
        </div>

        <div
          onClick={onNavigateToCustomers}
          className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-200 p-4 shadow-2xs flex items-center gap-3 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Customer Directory
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {customers.length} saved customer contacts
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
        </div>

        <div
          onClick={onNavigateToServices}
          className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 p-4 shadow-2xs flex items-center gap-3 cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Service Items & State Fees
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {services.length} items with default pricing
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0" />
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Invoices</h3>
            <p className="text-xs text-slate-500">Most recent finalized and drafted invoices</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToHistory}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All ({invoices.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No invoices yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by creating your first corporate or service invoice.
            </p>
            <button
              type="button"
              onClick={onNavigateToCreate}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create First Invoice</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((inv) => {
                  const totals = calculateInvoiceTotals(inv);
                  const curr = CURRENCIES[inv.currencyCode] || CURRENCIES.USD;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-indigo-600">
                        {inv.invoiceNumber || 'Untitled'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {inv.customer.companyName || inv.customer.name || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {inv.invoiceDate || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {inv.dueDate || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {curr.symbol}
                        {totals.grandTotal.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inv.status === 'issued'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : inv.status === 'overdue'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {inv.status || 'draft'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onLoadInvoice(inv)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Duplicate Invoice"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDownloadPdf(inv)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(inv)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
