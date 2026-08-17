import React from 'react';
import { X, Sparkles, Check, FilePlus, ArrowRight } from 'lucide-react';
import { SAMPLE_INVOICES, EMPTY_INVOICE } from '../data/sampleInvoices';
import { Invoice } from '../types';
import { formatCurrency, calculateInvoiceTotals } from '../utils/calculations';

interface SampleTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (invoice: Invoice) => void;
}

export const SampleTemplateModal: React.FC<SampleTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Preset Sample Templates</h3>
              <p className="text-xs text-slate-500">
                Choose a pre-filled business template to start with
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

        {/* Templates Grid */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {SAMPLE_INVOICES.map((sample) => {
            const totals = calculateInvoiceTotals(sample.invoice);
            return (
              <div
                key={sample.id}
                onClick={() => {
                  onSelectSample(sample.invoice);
                  onClose();
                }}
                className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-800">
                      {sample.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-num">
                      {sample.invoice.currencyCode}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {sample.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {sample.invoice.business.name} • {sample.invoice.items.length} line items
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Total</span>
                    <span className="text-sm font-bold font-mono-num text-slate-900">
                      {formatCurrency(totals.grandTotal, sample.invoice.currencyCode)}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Clean / Blank Template */}
          <div
            onClick={() => {
              onSelectSample(EMPTY_INVOICE);
              onClose();
            }}
            className="group p-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Blank / Empty Invoice</h4>
                <p className="text-xs text-slate-500">Start with a fresh, empty invoice canvas</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">
              Select &rarr;
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
