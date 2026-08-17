import React from 'react';
import { Calculator, Percent, DollarSign, Truck, Receipt } from 'lucide-react';
import { Invoice, InvoiceTotals } from '../types';
import { formatCurrency, safeNumber } from '../utils/calculations';
import { CURRENCIES } from '../data/currencies';

interface SummaryAndDiscountsProps {
  invoice: Invoice;
  totals: InvoiceTotals;
  onChange: (updated: Partial<Invoice>) => void;
}

export const SummaryAndDiscounts: React.FC<SummaryAndDiscountsProps> = ({
  invoice,
  totals,
  onChange,
}) => {
  const currency = CURRENCIES[invoice.currencyCode] || CURRENCIES.USD;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Summary & Taxes / Discounts</h3>
            <p className="text-xs text-slate-500">Configure discounts, tax rates, and delivery charges</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Discount Controls */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-slate-500" />
              Discount (Optional)
            </span>
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-md text-[11px] font-semibold">
              <button
                type="button"
                id="discount-percent-btn"
                onClick={() => onChange({ discountType: 'percentage' })}
                className={`px-2 py-0.5 rounded transition-all ${
                  invoice.discountType === 'percentage'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                % Percent
              </button>
              <button
                type="button"
                id="discount-fixed-btn"
                onClick={() => onChange({ discountType: 'fixed' })}
                className={`px-2 py-0.5 rounded transition-all ${
                  invoice.discountType === 'fixed'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fixed ({currency.symbol})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                {invoice.discountType === 'percentage' ? '%' : currency.symbol}
              </span>
              <input
                type="number"
                id="discount-value-input"
                min="0"
                max={invoice.discountType === 'percentage' ? 100 : undefined}
                step="any"
                value={invoice.discountValue === 0 ? '' : invoice.discountValue}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  onChange({ discountValue: Math.max(0, val) });
                }}
                placeholder="0"
                className="w-full text-xs sm:text-sm font-mono-num rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="text-right text-xs text-slate-500 font-medium">
              Deduction: -{formatCurrency(totals.discountAmount, invoice.currencyCode)}
            </div>
          </div>
        </div>

        {/* Tax Controls */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              Tax / VAT / GST Rate (%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Tax Label
              </label>
              <input
                type="text"
                id="tax-label-input"
                value={invoice.globalTaxLabel}
                onChange={(e) => onChange({ globalTaxLabel: e.target.value })}
                placeholder="e.g. VAT (10%) or Sales Tax"
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Rate (%)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  %
                </span>
                <input
                  type="number"
                  id="tax-rate-input"
                  min="0"
                  max="100"
                  step="any"
                  value={invoice.globalTaxRate === 0 ? '' : invoice.globalTaxRate}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onChange({ globalTaxRate: Math.max(0, val) });
                  }}
                  placeholder="0"
                  className="w-full text-xs sm:text-sm font-mono-num rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping / Extra Charges */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              Shipping & Extra Charges (Optional)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Fee Description
              </label>
              <input
                type="text"
                id="shipping-label-input"
                value={invoice.shippingLabel}
                onChange={(e) => onChange({ shippingLabel: e.target.value })}
                placeholder="e.g. Shipping / Delivery / Service Fee"
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Amount ({currency.symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  id="shipping-fee-input"
                  min="0"
                  step="any"
                  value={invoice.shippingFee === 0 ? '' : invoice.shippingFee}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onChange({ shippingFee: Math.max(0, val) });
                  }}
                  placeholder="0.00"
                  className="w-full text-xs sm:text-sm font-mono-num rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Totals Breakdown */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono-num font-semibold text-slate-900">
              {formatCurrency(totals.subtotal, invoice.currencyCode)}
            </span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600">
              <span>
                Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'})
              </span>
              <span className="font-mono-num font-semibold">
                -{formatCurrency(totals.discountAmount, invoice.currencyCode)}
              </span>
            </div>
          )}

          {totals.taxAmount > 0 && (
            <div className="flex justify-between text-xs text-slate-600">
              <span>{invoice.globalTaxLabel || 'Tax / VAT'}</span>
              <span className="font-mono-num font-semibold text-slate-900">
                +{formatCurrency(totals.taxAmount, invoice.currencyCode)}
              </span>
            </div>
          )}

          {totals.shippingAmount > 0 && (
            <div className="flex justify-between text-xs text-slate-600">
              <span>{invoice.shippingLabel || 'Shipping & Handling'}</span>
              <span className="font-mono-num font-semibold text-slate-900">
                +{formatCurrency(totals.shippingAmount, invoice.currencyCode)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Grand Total</span>
            <span className="text-lg font-extrabold font-mono-num text-indigo-700">
              {formatCurrency(totals.grandTotal, invoice.currencyCode)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
