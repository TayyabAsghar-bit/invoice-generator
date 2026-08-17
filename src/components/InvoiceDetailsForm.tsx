import React from 'react';
import { Calendar, Hash, Coins, Clock, AlertCircle } from 'lucide-react';
import { Invoice, ValidationErrors } from '../types';
import { CURRENCIES } from '../data/currencies';
import { calculateDueDate } from '../utils/calculations';

interface InvoiceDetailsFormProps {
  invoice: Invoice;
  errors: ValidationErrors;
  onChange: (updated: Partial<Invoice>) => void;
}

export const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({
  invoice,
  errors,
  onChange,
}) => {
  const handlePresetChange = (preset: Invoice['paymentTermsPreset']) => {
    if (preset === 'custom') {
      onChange({ paymentTermsPreset: 'custom' });
    } else {
      const computedDueDate = calculateDueDate(invoice.invoiceDate, preset);
      onChange({
        paymentTermsPreset: preset,
        dueDate: computedDueDate,
      });
    }
  };

  const handleIssueDateChange = (newDate: string) => {
    if (invoice.paymentTermsPreset !== 'custom') {
      const computedDueDate = calculateDueDate(newDate, invoice.paymentTermsPreset);
      onChange({
        invoiceDate: newDate,
        dueDate: computedDueDate,
      });
    } else {
      onChange({ invoiceDate: newDate });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Invoice Details & Currency</h3>
            <p className="text-xs text-slate-500">Dates, numbering, currency, and payment terms</p>
          </div>
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Status:</span>
          <select
            id="invoice-status-select"
            value={invoice.status}
            onChange={(e) => onChange({ status: e.target.value as any })}
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none ${
              invoice.status === 'paid'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : invoice.status === 'issued'
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : invoice.status === 'overdue'
                ? 'bg-red-50 text-red-700 border-red-300'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <option value="draft">DRAFT</option>
            <option value="issued">ISSUED</option>
            <option value="paid">PAID</option>
            <option value="overdue">OVERDUE</option>
          </select>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Invoice Number & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Invoice Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="invoice-number-input"
                value={invoice.invoiceNumber}
                onChange={(e) => onChange({ invoiceNumber: e.target.value })}
                placeholder="e.g. INV-001"
                className={`w-full text-xs sm:text-sm font-mono-num rounded-lg border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors['invoiceNumber']
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors['invoiceNumber'] && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors['invoiceNumber']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Currency
            </label>
            <div className="relative">
              <select
                id="currency-select"
                value={invoice.currencyCode}
                onChange={(e) => onChange({ currencyCode: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white cursor-pointer"
              >
                {Object.values(CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name} — {curr.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Issue Date & Payment Terms Preset */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="invoice-date-input"
                value={invoice.invoiceDate}
                onChange={(e) => handleIssueDateChange(e.target.value)}
                className={`w-full text-xs sm:text-sm rounded-lg border px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 bg-white ${
                  errors['invoiceDate']
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Terms Preset
            </label>
            <select
              id="payment-terms-preset-select"
              value={invoice.paymentTermsPreset}
              onChange={(e) => handlePresetChange(e.target.value as any)}
              className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white cursor-pointer"
            >
              <option value="receipt">Due on Receipt (0 days)</option>
              <option value="net7">Net 7 (7 days)</option>
              <option value="net15">Net 15 (15 days)</option>
              <option value="net30">Net 30 (30 days)</option>
              <option value="net45">Net 45 (45 days)</option>
              <option value="net60">Net 60 (60 days)</option>
              <option value="custom">Custom Due Date</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="invoice-due-date-input"
              value={invoice.dueDate}
              onChange={(e) => {
                onChange({
                  dueDate: e.target.value,
                  paymentTermsPreset: 'custom',
                });
              }}
              className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
