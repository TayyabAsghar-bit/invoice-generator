import React from 'react';
import { CreditCard, MessageSquare, PenTool, Landmark, ShieldCheck } from 'lucide-react';
import { Invoice, PaymentDetails } from '../types';

interface PaymentAndNotesProps {
  invoice: Invoice;
  onChange: (updated: Partial<Invoice>) => void;
  onPaymentChange: (updated: Partial<PaymentDetails>) => void;
}

export const PaymentAndNotes: React.FC<PaymentAndNotesProps> = ({
  invoice,
  onChange,
  onPaymentChange,
}) => {
  const { paymentDetails } = invoice;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment Instructions & Notes</h3>
            <p className="text-xs text-slate-500">Bank transfer details, client notes & signature</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Payment Terms Text */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Payment Terms & Due Notice
          </label>
          <input
            type="text"
            id="payment-terms-input"
            value={paymentDetails.terms}
            onChange={(e) => onPaymentChange({ terms: e.target.value })}
            placeholder="e.g. Payment is due within 15 days of invoice date."
            className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Bank & Account Details */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            Bank & Remittance Details (Optional)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                id="bank-name-input"
                value={paymentDetails.bankName}
                onChange={(e) => onPaymentChange({ bankName: e.target.value })}
                placeholder="e.g. JPMorgan Chase Bank / Barclays"
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Account Beneficiary Name
              </label>
              <input
                type="text"
                id="account-name-input"
                value={paymentDetails.accountName}
                onChange={(e) => onPaymentChange({ accountName: e.target.value })}
                placeholder="e.g. Apex Creative Studio LLC"
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Account Number / IBAN
              </label>
              <input
                type="text"
                id="account-number-input"
                value={paymentDetails.accountNumber}
                onChange={(e) => onPaymentChange({ accountNumber: e.target.value })}
                placeholder="e.g. 1234567890 or DE89..."
                className="w-full text-xs sm:text-sm font-mono-num rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Routing / Sort Code / SWIFT
              </label>
              <input
                type="text"
                id="routing-code-input"
                value={paymentDetails.routingNumber || paymentDetails.swiftBic}
                onChange={(e) => onPaymentChange({ routingNumber: e.target.value, swiftBic: e.target.value })}
                placeholder="e.g. 021000021 / CHASUS33"
                className="w-full text-xs sm:text-sm font-mono-num rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Online Payment Link / PayPal / Stripe
              </label>
              <input
                type="text"
                id="payment-link-input"
                value={paymentDetails.paypalOrLink}
                onChange={(e) => onPaymentChange({ paypalOrLink: e.target.value })}
                placeholder="e.g. https://buy.stripe.com/... or paypal.me/apexstudio"
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Client Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes to Customer
          </label>
          <textarea
            id="invoice-notes-input"
            rows={2}
            value={invoice.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="e.g. Thank you for your business! Please feel free to reach out if you have any questions."
            className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-y"
          />
        </div>

        {/* Authorized Signature Toggle */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-slate-500" />
              Authorized Signatory Box
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="signature-toggle-checkbox"
                checked={invoice.includeSignature}
                onChange={(e) => onChange({ includeSignature: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {invoice.includeSignature && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Signer Full Name
                </label>
                <input
                  type="text"
                  id="signer-name-input"
                  value={invoice.signerName}
                  onChange={(e) => onChange({ signerName: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Signer Title / Role
                </label>
                <input
                  type="text"
                  id="signer-title-input"
                  value={invoice.signerTitle}
                  onChange={(e) => onChange({ signerTitle: e.target.value })}
                  placeholder="e.g. Managing Partner & Design Lead"
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
