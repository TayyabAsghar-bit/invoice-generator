export interface Currency {
  code: string;
  symbol: string;
  name: string;
  position: 'before' | 'after';
  decimals: number;
  locale: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  logoUrl?: string;
}

export interface PaymentDetails {
  terms: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  paypalOrLink: string;
  customInstructions: string;
}

export interface BusinessProfile extends BusinessInfo {
  defaultPaymentDetails?: PaymentDetails;
  defaultNotes?: string;
  defaultPaymentTerms?: 'custom' | 'receipt' | 'net7' | 'net15' | 'net30' | 'net45' | 'net60';
  updatedAt?: string;
}

export interface CustomerInfo {
  name: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  email: string;
  phone: string;
}

export interface SavedCustomer extends CustomerInfo {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage, e.g. 0, 10, 20
}

export interface SavedService {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
  defaultQty: number;
  hasStateSelector?: boolean;
  state?: string;
  fee?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceSettings {
  invoicePrefix: string;
  nextNumberSequence: number;
  defaultCurrency: string;
  defaultTaxRate: number;
  defaultTaxLabel: string;
  defaultDiscountType: 'percentage' | 'fixed';
  defaultDiscountValue: number;
  defaultPaymentTerms: 'custom' | 'receipt' | 'net7' | 'net15' | 'net30' | 'net45' | 'net60';
  defaultNotes: string;
  defaultPaymentDetails: PaymentDetails;
}

export type TemplateStyle = 'modern' | 'classic' | 'minimal' | 'executive';

export interface InvoiceTheme {
  id: string;
  name: string;
  primaryColor: string; // Hex e.g. '#2563eb'
  secondaryColor: string;
  accentBg: string;
  template: TemplateStyle;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTermsPreset: 'custom' | 'receipt' | 'net7' | 'net15' | 'net30' | 'net45' | 'net60';
  currencyCode: string;
  business: BusinessInfo;
  customer: CustomerInfo;
  items: InvoiceItem[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxCalculation: 'itemized' | 'global';
  globalTaxRate: number;
  globalTaxLabel: string;
  shippingFee: number;
  shippingLabel: string;
  notes: string;
  paymentDetails: PaymentDetails;
  theme: InvoiceTheme;
  status: 'draft' | 'issued' | 'paid' | 'overdue';
  includeSignature: boolean;
  signerName: string;
  signerTitle: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemCalculation {
  id: string;
  amount: number;
  taxAmount: number;
  totalWithTax: number;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  itemsCalculations: ItemCalculation[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface SavedInvoiceSummary {
  id: string;
  invoiceNumber: string;
  businessName: string;
  clientName: string;
  grandTotal: number;
  currencySymbol: string;
  date: string;
  dueDate: string;
  status: string;
  updatedAt: string;
}

export type AppNavTab = 'dashboard' | 'create' | 'customers' | 'services' | 'history' | 'profile' | 'settings';
