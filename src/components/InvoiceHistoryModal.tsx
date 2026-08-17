import React, { useState } from 'react';
import { 
  X, 
  FolderClock, 
  Search, 
  Trash2, 
  Copy, 
  ArrowUpRight, 
  FileText,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Invoice } from '../types';
import { getHistorySummaries } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/calculations';

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: Invoice[];
  onLoadInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onLoadInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const summaries = getHistorySummaries(history);
  const filtered = summaries.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.invoiceNumber.toLowerCase().includes(query) ||
      item.clientName.toLowerCase().includes(query) ||
      item.businessName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Saved Invoices History</h3>
              <p className="text-xs text-slate-500">
                Manage, duplicate, or reload previously generated invoices
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice number, client name, or business..."
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* List of Invoices */}
        <div className="p-6 space-y-3 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-10 h-10 mx-auto stroke-[1.5] mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-600">No saved invoices found</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {searchQuery ? 'Try adjusting your search criteria' : 'Generated invoices will appear here'}
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const fullInvoice = history.find((inv) => inv.id === item.id);
              if (!fullInvoice) return null;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-num font-bold text-sm text-slate-900">
                        {item.invoiceNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          item.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'issued'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 truncate">
                      Client: {item.clientName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Date: {formatDate(item.date)} • Due: {formatDate(item.dueDate)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block">Grand Total</span>
                      <span className="text-sm font-bold font-mono-num text-slate-900">
                        {formatCurrency(item.grandTotal, fullInvoice.currencyCode)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Load & Edit */}
                      <button
                        type="button"
                        onClick={() => {
                          onLoadInvoice(fullInvoice);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={() => onDuplicateInvoice(fullInvoice)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Duplicate as new invoice"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteInvoice(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete invoice from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>{history.length} invoice(s) stored locally</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
