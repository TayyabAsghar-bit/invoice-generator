import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  Trash2, 
  Download, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { Invoice } from '../types';
import { calculateInvoiceTotals } from '../utils/calculations';
import { CURRENCIES } from '../data/currencies';

interface InvoiceHistoryViewProps {
  invoices: Invoice[];
  onLoadInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onDownloadPdf: (invoice: Invoice) => void;
  onNavigateToCreate: () => void;
  onRequestConfirmDelete: (title: string, message: string, onConfirm: () => void) => void;
}

export const InvoiceHistoryView: React.FC<InvoiceHistoryViewProps> = ({
  invoices,
  onLoadInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onDownloadPdf,
  onNavigateToCreate,
  onRequestConfirmDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'issued' | 'paid' | 'overdue'>('all');

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.customer?.companyName?.toLowerCase().includes(q) ||
      inv.customer?.name?.toLowerCase().includes(q) ||
      inv.business?.name?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (inv: Invoice) => {
    onRequestConfirmDelete(
      'Delete Invoice Record?',
      `Are you sure you want to permanently delete invoice ${inv.invoiceNumber}?`,
      () => onDeleteInvoice(inv.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Invoice History & Snapshots</h2>
            <p className="text-xs text-slate-500">
              {invoices.length} historical invoice record{invoices.length === 1 ? '' : 's'} archived in browser storage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateToCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, customer name..."
            className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {(['all', 'draft', 'issued', 'paid', 'overdue'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No invoices match your filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try resetting your search query or status filter.'
                : 'No invoice history found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer / Client</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Items</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const totals = calculateInvoiceTotals(inv);
                  const curr = CURRENCIES[inv.currencyCode] || CURRENCIES.USD;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-indigo-600">
                        {inv.invoiceNumber || 'Untitled'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">
                          {inv.customer.companyName || inv.customer.name || '—'}
                        </div>
                        {inv.customer.companyName && inv.customer.name && (
                          <div className="text-[11px] text-slate-400">{inv.customer.name}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {inv.invoiceDate || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {inv.dueDate || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 font-medium">
                        {inv.items.length} item{inv.items.length === 1 ? '' : 's'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
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
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate Invoice"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDownloadPdf(inv)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(inv)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
