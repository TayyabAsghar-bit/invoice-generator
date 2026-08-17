import { Invoice, InvoiceItem, InvoiceTotals, ItemCalculation, ValidationErrors } from '../types';
import { CURRENCIES, DEFAULT_CURRENCY } from '../data/currencies';

/**
 * Safely parse numbers avoiding NaN or negative inputs when forbidden
 */
export function safeNumber(val: any, fallback = 0, allowNegative = false): number {
  if (val === null || val === undefined || val === '') return fallback;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''));
  if (isNaN(num)) return fallback;
  if (!allowNegative && num < 0) return 0;
  return num;
}

/**
 * Format a monetary amount using the specified currency code
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const currency = CURRENCIES[currencyCode] || DEFAULT_CURRENCY;
  const validAmount = isNaN(amount) ? 0 : amount;

  try {
    const formattedNum = new Intl.NumberFormat(currency.locale, {
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(validAmount);

    if (currency.position === 'before') {
      return `${currency.symbol}${formattedNum}`;
    }
    return `${formattedNum} ${currency.symbol}`;
  } catch {
    return `${currency.symbol}${validAmount.toFixed(currency.decimals)}`;
  }
}

/**
 * Calculate totals for a single invoice item
 */
export function calculateItem(item: InvoiceItem): { amount: number; taxAmount: number } {
  const qty = safeNumber(item.quantity, 0);
  const price = safeNumber(item.unitPrice, 0);
  const taxRate = safeNumber(item.taxRate, 0);

  const amount = Math.round(qty * price * 100) / 100;
  const taxAmount = Math.round(amount * (taxRate / 100) * 100) / 100;

  return { amount, taxAmount };
}

/**
 * Comprehensive invoice totals calculation engine
 */
export function calculateInvoiceTotals(invoice: Partial<Invoice>): InvoiceTotals {
  const items = invoice.items || [];
  let subtotal = 0;
  let itemizedTaxSum = 0;

  const itemsCalculations: ItemCalculation[] = items.map((item) => {
    const qty = safeNumber(item.quantity, 0);
    const unitPrice = safeNumber(item.unitPrice, 0);
    const taxRate = safeNumber(item.taxRate, 0);

    const amount = Math.round(qty * unitPrice * 100) / 100;
    const taxAmount = Math.round(amount * (taxRate / 100) * 100) / 100;
    const totalWithTax = Math.round((amount + taxAmount) * 100) / 100;

    subtotal += amount;
    itemizedTaxSum += taxAmount;

    return {
      id: item.id,
      amount,
      taxAmount,
      totalWithTax,
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;

  // Discount calculation
  let discountAmount = 0;
  const discountVal = safeNumber(invoice.discountValue, 0);

  if (invoice.discountType === 'percentage') {
    const cappedPercent = Math.min(100, Math.max(0, discountVal));
    discountAmount = Math.round(subtotal * (cappedPercent / 100) * 100) / 100;
  } else {
    discountAmount = Math.min(subtotal, Math.max(0, discountVal));
  }

  // Net taxable subtotal after discount
  const taxableAmount = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  // Tax calculation
  let taxAmount = 0;
  if (invoice.taxCalculation === 'global') {
    const globalRate = safeNumber(invoice.globalTaxRate, 0);
    taxAmount = Math.round(taxableAmount * (globalRate / 100) * 100) / 100;
  } else {
    // If discount was applied, proportionately scale itemized taxes
    if (subtotal > 0 && discountAmount > 0) {
      const discountRatio = (subtotal - discountAmount) / subtotal;
      taxAmount = Math.round(itemizedTaxSum * discountRatio * 100) / 100;
    } else {
      taxAmount = Math.round(itemizedTaxSum * 100) / 100;
    }
  }

  // Shipping / extra fees
  const shippingAmount = safeNumber(invoice.shippingFee, 0);

  // Grand Total
  const grandTotal = Math.max(0, Math.round((taxableAmount + taxAmount + shippingAmount) * 100) / 100);

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    shippingAmount,
    grandTotal,
    itemsCalculations,
  };
}

/**
 * Calculate due date based on issue date and preset
 */
export function calculateDueDate(issueDateStr: string, preset: Invoice['paymentTermsPreset']): string {
  if (!issueDateStr) return '';
  const date = new Date(issueDateStr);
  if (isNaN(date.getTime())) return issueDateStr;

  let daysToAdd = 0;
  switch (preset) {
    case 'receipt':
      daysToAdd = 0;
      break;
    case 'net7':
      daysToAdd = 7;
      break;
    case 'net15':
      daysToAdd = 15;
      break;
    case 'net30':
      daysToAdd = 30;
      break;
    case 'net45':
      daysToAdd = 45;
      break;
    case 'net60':
      daysToAdd = 60;
      break;
    case 'custom':
    default:
      return '';
  }

  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

/**
 * Format ISO date string into readable text
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Form validation check
 */
export function validateInvoice(invoice: Invoice): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!invoice.business.name.trim()) {
    errors['business.name'] = 'Business name is required';
  }

  if (!invoice.customer.name.trim() && !invoice.customer.companyName.trim()) {
    errors['customer.name'] = 'Client name or company name is required';
  }

  if (!invoice.invoiceNumber.trim()) {
    errors['invoiceNumber'] = 'Invoice number is required';
  }

  if (!invoice.invoiceDate.trim()) {
    errors['invoiceDate'] = 'Invoice issue date is required';
  }

  if (!invoice.items || invoice.items.length === 0) {
    errors['items'] = 'At least one invoice item is required';
  } else {
    const hasValidItem = invoice.items.some((item) => item.description.trim() && item.quantity > 0);
    if (!hasValidItem) {
      errors['items'] = 'Please provide a description and quantity > 0 for at least one item';
    }
  }

  if (invoice.business.email && !isValidEmail(invoice.business.email)) {
    errors['business.email'] = 'Invalid email address format';
  }

  if (invoice.customer.email && !isValidEmail(invoice.customer.email)) {
    errors['customer.email'] = 'Invalid email address format';
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
