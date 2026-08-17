import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Eye, 
  Building2, 
  CreditCard, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Invoice, InvoiceTotals } from '../types';
import { formatCurrency, formatDate, safeNumber } from '../utils/calculations';
import { CURRENCIES } from '../data/currencies';

interface InvoicePreviewProps {
  invoice: Invoice;
  totals: InvoiceTotals;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, totals }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const currency = CURRENCIES[invoice.currencyCode] || CURRENCIES.USD;
  const theme = invoice.theme;

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(130, Math.max(65, prev + delta)));
  };

  const getStatusBadge = () => {
    const status = invoice.status || 'draft';
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            PAID
          </span>
        );
      case 'issued':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            ISSUED
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
            OVERDUE
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
            DRAFT
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Preview Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 rounded-t-xl no-print">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-bold text-slate-800">Live Document Preview</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">(A4 Dimensions)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleZoom(-10)}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono-num font-medium text-slate-600 w-12 text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(10)}
            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(100)}
            className="px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors ml-1"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Document Viewport Canvas */}
      <div className="flex-1 overflow-auto bg-slate-200/60 p-3 sm:p-6 flex justify-center items-start rounded-b-xl min-h-[680px]">
        {/* The Actual A4 Paper Document Container */}
        <div
          id="invoice-document-preview"
          style={{
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : 'none',
            transformOrigin: 'top center',
          }}
          className="invoice-paper w-full max-w-[794px] min-h-[1050px] bg-white text-slate-800 shadow-xl rounded-sm p-8 sm:p-12 relative flex flex-col justify-between transition-transform duration-200"
        >
          {/* TOP SECTION BASED ON TEMPLATE */}
          <div>
            {/* Executive Top Banner (if executive template) */}
            {theme.template === 'executive' && (
              <div
                className="-mx-8 -mt-8 sm:-mx-12 sm:-mt-12 p-6 sm:p-8 text-white flex justify-between items-center mb-8"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">INVOICE</h1>
                  <p className="text-xs text-white/80 mt-0.5 font-mono-num">
                    #{invoice.invoiceNumber || 'INV-001'}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge()}
                  <p className="text-xs text-white/90 mt-2">
                    Issue Date: {formatDate(invoice.invoiceDate)}
                  </p>
                  {invoice.dueDate && (
                    <p className="text-xs text-white/90">
                      Due Date: {formatDate(invoice.dueDate)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Header: Company Profile & Invoice Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
              {/* Business Info / Logo */}
              <div className="max-w-[340px] space-y-2">
                {invoice.business.logoUrl ? (
                  <div className="mb-3 max-h-16 flex items-center">
                    <img
                      src={invoice.business.logoUrl}
                      alt={invoice.business.name || 'Company Logo'}
                      className="max-h-14 max-w-[200px] object-contain"
                    />
                  </div>
                ) : null}

                <h2
                  className="text-xl font-bold tracking-tight"
                  style={{ color: theme.primaryColor }}
                >
                  {invoice.business.name || 'Your Business Name'}
                </h2>

                <div className="text-xs text-slate-600 leading-relaxed space-y-0.5">
                  {invoice.business.address && <p>{invoice.business.address}</p>}
                  {(invoice.business.city || invoice.business.state || invoice.business.zipCode) && (
                    <p>
                      {[invoice.business.city, invoice.business.state, invoice.business.zipCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                  {invoice.business.country && <p>{invoice.business.country}</p>}
                  {invoice.business.email && <p>Email: {invoice.business.email}</p>}
                  {invoice.business.phone && <p>Phone: {invoice.business.phone}</p>}
                  {invoice.business.website && <p>{invoice.business.website}</p>}
                  {invoice.business.taxId && (
                    <p className="font-medium text-slate-700">Tax ID: {invoice.business.taxId}</p>
                  )}
                </div>
              </div>

              {/* Invoice Meta details (for non-executive) */}
              {theme.template !== 'executive' && (
                <div className="sm:text-right space-y-2">
                  <div className="flex sm:justify-end items-center gap-2">
                    <h1
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                      style={{ color: theme.primaryColor }}
                    >
                      INVOICE
                    </h1>
                    {getStatusBadge()}
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex sm:justify-end gap-2 text-slate-600">
                      <span className="text-slate-500 font-medium">Invoice Number:</span>
                      <span className="font-mono-num font-bold text-slate-900">
                        {invoice.invoiceNumber || 'INV-001'}
                      </span>
                    </div>

                    <div className="flex sm:justify-end gap-2 text-slate-600">
                      <span className="text-slate-500 font-medium">Invoice Date:</span>
                      <span className="font-semibold text-slate-900">
                        {formatDate(invoice.invoiceDate)}
                      </span>
                    </div>

                    {invoice.dueDate && (
                      <div className="flex sm:justify-end gap-2 text-slate-600">
                        <span className="text-slate-500 font-medium">Due Date:</span>
                        <span className="font-semibold text-slate-900">
                          {formatDate(invoice.dueDate)}
                        </span>
                      </div>
                    )}

                    {invoice.paymentDetails.terms && (
                      <div className="flex sm:justify-end gap-2 text-slate-600">
                        <span className="text-slate-500 font-medium">Terms:</span>
                        <span className="text-slate-800">{invoice.paymentDetails.terms}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* BILL TO & CLIENT SECTION */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                <span
                  className="text-[11px] font-extrabold uppercase tracking-wider block mb-2"
                  style={{ color: theme.primaryColor }}
                >
                  Billed To
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {invoice.customer.name || 'Client Name'}
                </p>
                {invoice.customer.companyName && (
                  <p className="text-xs font-semibold text-slate-700">
                    {invoice.customer.companyName}
                  </p>
                )}
                <div className="text-xs text-slate-600 leading-relaxed mt-1 space-y-0.5">
                  {invoice.customer.address && <p>{invoice.customer.address}</p>}
                  {(invoice.customer.city || invoice.customer.state || invoice.customer.zipCode) && (
                    <p>
                      {[invoice.customer.city, invoice.customer.state, invoice.customer.zipCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                  {invoice.customer.country && <p>{invoice.customer.country}</p>}
                  {invoice.customer.email && <p>Email: {invoice.customer.email}</p>}
                  {invoice.customer.phone && <p>Phone: {invoice.customer.phone}</p>}
                </div>
              </div>

              {/* Quick Summary Pill for due amount */}
              <div className="flex flex-col justify-between p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                <div>
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wider block mb-1"
                    style={{ color: theme.primaryColor }}
                  >
                    Payment Balance Due
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-slate-900 mt-1">
                    {formatCurrency(totals.grandTotal, invoice.currencyCode)}
                  </div>
                </div>
                {invoice.dueDate && (
                  <p className="text-xs text-slate-500 mt-2">
                    Please remit payment by <strong className="text-slate-800">{formatDate(invoice.dueDate)}</strong>.
                  </p>
                )}
              </div>
            </div>

            {/* LINE ITEMS TABLE */}
            <div className="my-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className="text-xs font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <th className="py-2.5 px-4 rounded-l-md w-8 text-center">#</th>
                    <th className="py-2.5 px-3">Item / Service Description</th>
                    <th className="py-2.5 px-3 text-center w-20">Qty</th>
                    <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
                    <th className="py-2.5 px-4 rounded-r-md text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {invoice.items.map((item, index) => {
                    const qty = safeNumber(item.quantity, 0);
                    const price = safeNumber(item.unitPrice, 0);
                    const rowAmount = Math.round(qty * price * 100) / 100;

                    return (
                      <tr key={item.id} className={index % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                        <td className="py-3 px-4 text-center font-mono-num text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900">
                            {item.description || 'Description of product or service'}
                          </p>
                        </td>
                        <td className="py-3 px-3 text-center font-mono-num text-slate-700">
                          {qty}
                        </td>
                        <td className="py-3 px-3 text-right font-mono-num text-slate-700">
                          {formatCurrency(price, invoice.currencyCode)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-num font-bold text-slate-900">
                          {formatCurrency(rowAmount, invoice.currencyCode)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* TOTALS & SUMMARY SECTION */}
            <div className="pt-4 flex flex-col sm:flex-row justify-between items-start gap-6">
              {/* Payment Details Remittance */}
              <div className="w-full sm:max-w-[340px] space-y-3">
                {(invoice.paymentDetails.bankName ||
                  invoice.paymentDetails.accountNumber ||
                  invoice.paymentDetails.paypalOrLink) && (
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider block"
                      style={{ color: theme.primaryColor }}
                    >
                      Payment Remittance Instructions
                    </span>
                    {invoice.paymentDetails.bankName && (
                      <p className="text-slate-700">
                        <span className="font-semibold text-slate-900">Bank:</span>{' '}
                        {invoice.paymentDetails.bankName}
                      </p>
                    )}
                    {invoice.paymentDetails.accountName && (
                      <p className="text-slate-700">
                        <span className="font-semibold text-slate-900">Beneficiary:</span>{' '}
                        {invoice.paymentDetails.accountName}
                      </p>
                    )}
                    {invoice.paymentDetails.accountNumber && (
                      <p className="text-slate-700 font-mono-num">
                        <span className="font-semibold text-slate-900 font-sans">Account/IBAN:</span>{' '}
                        {invoice.paymentDetails.accountNumber}
                      </p>
                    )}
                    {(invoice.paymentDetails.routingNumber || invoice.paymentDetails.swiftBic) && (
                      <p className="text-slate-700 font-mono-num">
                        <span className="font-semibold text-slate-900 font-sans">
                          Routing/SWIFT:
                        </span>{' '}
                        {invoice.paymentDetails.routingNumber || invoice.paymentDetails.swiftBic}
                      </p>
                    )}
                    {invoice.paymentDetails.paypalOrLink && (
                      <p className="text-slate-700 truncate">
                        <span className="font-semibold text-slate-900">Online Link:</span>{' '}
                        {invoice.paymentDetails.paypalOrLink}
                      </p>
                    )}
                    {invoice.paymentDetails.customInstructions && (
                      <p className="text-slate-500 text-[11px] italic pt-1 border-t border-slate-200">
                        {invoice.paymentDetails.customInstructions}
                      </p>
                    )}
                  </div>
                )}

                {invoice.notes && (
                  <div className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Invoice Notes:</span>
                    <p className="leading-relaxed whitespace-pre-line">{invoice.notes}</p>
                  </div>
                )}
              </div>

              {/* Financial Calculation Box */}
              <div className="w-full sm:w-[280px] bg-slate-50 rounded-lg p-4 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono-num font-semibold text-slate-900">
                    {formatCurrency(totals.subtotal, invoice.currencyCode)}
                  </span>
                </div>

                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>
                      Discount{' '}
                      {invoice.discountType === 'percentage'
                        ? `(${invoice.discountValue}%)`
                        : ''}
                    </span>
                    <span className="font-mono-num font-semibold">
                      -{formatCurrency(totals.discountAmount, invoice.currencyCode)}
                    </span>
                  </div>
                )}

                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{invoice.globalTaxLabel || 'Tax / VAT'}</span>
                    <span className="font-mono-num font-semibold text-slate-900">
                      +{formatCurrency(totals.taxAmount, invoice.currencyCode)}
                    </span>
                  </div>
                )}

                {totals.shippingAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{invoice.shippingLabel || 'Shipping & Charges'}</span>
                    <span className="font-mono-num font-semibold text-slate-900">
                      +{formatCurrency(totals.shippingAmount, invoice.currencyCode)}
                    </span>
                  </div>
                )}

                <div
                  className="pt-2.5 border-t-2 border-slate-300 flex justify-between items-center text-sm font-bold"
                  style={{ color: theme.primaryColor }}
                >
                  <span>Grand Total:</span>
                  <span className="text-base font-extrabold font-mono-num">
                    {formatCurrency(totals.grandTotal, invoice.currencyCode)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Signatures & Document Footer */}
          <div className="pt-8 mt-8 border-t border-slate-200">
            {invoice.includeSignature && (
              <div className="flex justify-end mb-6">
                <div className="text-right w-56">
                  <div className="border-b border-slate-400 pb-1 mb-1.5 h-12 flex items-end justify-end">
                    <span className="text-slate-400 italic font-serif text-sm">
                      {invoice.signerName || 'Authorized Signatory'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {invoice.signerName || 'Authorized Signature'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {invoice.signerTitle || 'Director / Authorized Representative'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 pt-3 border-t border-slate-100 gap-2">
              <p>Thank you for choosing {invoice.business.name || 'our services'}!</p>
              <p className="font-mono-num">Page 1 of 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
