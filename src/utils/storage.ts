import { 
  Invoice, 
  BusinessProfile, 
  SavedCustomer, 
  SavedService, 
  InvoiceSettings, 
  SavedInvoiceSummary 
} from '../types';
import { calculateInvoiceTotals } from './calculations';
import { CURRENCIES } from '../data/currencies';
import { DEFAULT_SERVICES, US_STATE_FEES } from '../data/servicesData';
export { DEFAULT_SERVICES };
import { SAMPLE_INVOICES, EMPTY_INVOICE } from '../data/sampleInvoices';
import { DEFAULT_THEME } from '../data/themes';

// Storage keys as explicitly required
export const STORAGE_KEYS = {
  BUSINESS_PROFILE: 'invoicePro_businessProfile',
  CUSTOMERS: 'invoicePro_customers',
  SERVICES: 'invoicePro_services',
  INVOICE_SETTINGS: 'invoicePro_invoiceSettings',
  INVOICE_HISTORY: 'invoicePro_invoiceHistory',
  CURRENT_INVOICE: 'invoicePro_currentInvoice',
} as const;

// Default initial Business Profile
export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Apex Corporate Services LLC',
  address: '1201 North Market Street, Suite 800',
  city: 'Wilmington',
  state: 'DE',
  country: 'United States',
  zipCode: '19801',
  email: 'billing@apexcorporate.io',
  phone: '+1 (302) 555-0188',
  website: 'https://apexcorporate.io',
  taxId: 'US-EIN-88-2940192',
  logoUrl: '',
  defaultPaymentTerms: 'net15',
  defaultNotes: 'Thank you for your business. Please remit payment via bank wire or credit card within 15 days of invoice date.',
  defaultPaymentDetails: {
    terms: 'Payment due within 15 calendar days',
    bankName: 'JPMorgan Chase Bank, N.A.',
    accountName: 'Apex Corporate Services LLC',
    accountNumber: '•••••••• 4892',
    routingNumber: '021000021',
    swiftBic: 'CHASUS33XXX',
    paypalOrLink: 'https://pay.apexcorporate.io/portal',
    customInstructions: 'Please include Invoice Number on the wire/ACH payment reference.',
  },
  updatedAt: new Date().toISOString(),
};

// Default initial Settings
export const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  invoicePrefix: 'INV-',
  nextNumberSequence: 101,
  defaultCurrency: 'USD',
  defaultTaxRate: 0,
  defaultTaxLabel: 'Tax / VAT',
  defaultDiscountType: 'percentage',
  defaultDiscountValue: 0,
  defaultPaymentTerms: 'net15',
  defaultNotes: 'Thank you for your business. Please remit payment by the due date.',
  defaultPaymentDetails: DEFAULT_BUSINESS_PROFILE.defaultPaymentDetails!,
};

// Default initial Customers
export const DEFAULT_CUSTOMERS: SavedCustomer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    companyName: 'Horizon Ventures Inc.',
    address: '400 Congress Avenue, Suite 1400',
    city: 'Austin',
    state: 'TX',
    country: 'United States',
    zipCode: '78701',
    email: 'accounts@horizonventures.tech',
    phone: '+1 (512) 555-0144',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cust-2',
    name: 'David Miller',
    companyName: 'Nova Digital Labs LLC',
    address: '1600 Amphitheatre Pkwy',
    city: 'Mountain View',
    state: 'CA',
    country: 'United States',
    zipCode: '94043',
    email: 'billing@novadigital.io',
    phone: '+1 (650) 555-0199',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cust-3',
    name: 'Elena Rostova',
    companyName: 'Global Commerce Partner Co.',
    address: '100 King Street West',
    city: 'Toronto',
    state: 'ON',
    country: 'Canada',
    zipCode: 'M5X 1A9',
    email: 'finance@globalcommerce.ca',
    phone: '+1 (416) 555-0177',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper for safe JSON parse
function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

// Helper for safe JSON stringify
function safeSetItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
    return false;
  }
}

/* =========================================================================
   1. BUSINESS PROFILE STORAGE
   ========================================================================= */

export function loadBusinessProfile(): BusinessProfile {
  return safeGetItem<BusinessProfile>(STORAGE_KEYS.BUSINESS_PROFILE, DEFAULT_BUSINESS_PROFILE);
}

export function saveBusinessProfile(profile: BusinessProfile): BusinessProfile {
  const updated: BusinessProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  safeSetItem(STORAGE_KEYS.BUSINESS_PROFILE, updated);
  return updated;
}

/* =========================================================================
   2. CUSTOMERS STORAGE
   ========================================================================= */

export function loadCustomers(): SavedCustomer[] {
  const saved = safeGetItem<SavedCustomer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  if (!Array.isArray(saved) || saved.length === 0) {
    saveCustomers(DEFAULT_CUSTOMERS);
    return DEFAULT_CUSTOMERS;
  }
  return saved;
}

export function saveCustomers(customers: SavedCustomer[]): SavedCustomer[] {
  safeSetItem(STORAGE_KEYS.CUSTOMERS, customers);
  return customers;
}

export function saveCustomer(customer: Omit<SavedCustomer, 'id'> & { id?: string }): SavedCustomer {
  const customers = loadCustomers();
  const now = new Date().toISOString();
  
  if (customer.id) {
    const index = customers.findIndex((c) => c.id === customer.id);
    if (index >= 0) {
      const updatedCustomer: SavedCustomer = {
        ...customers[index],
        ...customer,
        id: customer.id,
        updatedAt: now,
      };
      customers[index] = updatedCustomer;
      saveCustomers(customers);
      return updatedCustomer;
    }
  }

  const newCustomer: SavedCustomer = {
    ...customer,
    id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };
  const updatedList = [newCustomer, ...customers];
  saveCustomers(updatedList);
  return newCustomer;
}

export function deleteCustomer(id: string): SavedCustomer[] {
  const customers = loadCustomers();
  const filtered = customers.filter((c) => c.id !== id);
  saveCustomers(filtered);
  return filtered;
}

/* =========================================================================
   3. SERVICES STORAGE
   ========================================================================= */

export function loadServices(): SavedService[] {
  const saved = safeGetItem<SavedService[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES as SavedService[]);
  if (!Array.isArray(saved) || saved.length === 0) {
    saveServices(DEFAULT_SERVICES as SavedService[]);
    return DEFAULT_SERVICES as SavedService[];
  }
  return saved;
}

export function saveServices(services: SavedService[]): SavedService[] {
  safeSetItem(STORAGE_KEYS.SERVICES, services);
  return services;
}

export function saveService(service: Omit<SavedService, 'id'> & { id?: string }): SavedService {
  const services = loadServices();
  const now = new Date().toISOString();

  if (service.id) {
    const index = services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      const updatedService: SavedService = {
        ...services[index],
        ...service,
        id: service.id,
        updatedAt: now,
      };
      services[index] = updatedService;
      saveServices(services);
      return updatedService;
    }
  }

  const newService: SavedService = {
    ...service,
    id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };
  const updatedList = [newService, ...services];
  saveServices(updatedList);
  return newService;
}

export function deleteService(id: string): SavedService[] {
  const services = loadServices();
  const filtered = services.filter((s) => s.id !== id);
  saveServices(filtered);
  return filtered;
}

/* =========================================================================
   4. INVOICE SETTINGS STORAGE
   ========================================================================= */

export function loadSettings(): InvoiceSettings {
  return safeGetItem<InvoiceSettings>(STORAGE_KEYS.INVOICE_SETTINGS, DEFAULT_INVOICE_SETTINGS);
}

export function saveSettings(settings: InvoiceSettings): InvoiceSettings {
  safeSetItem(STORAGE_KEYS.INVOICE_SETTINGS, settings);
  return settings;
}

/* =========================================================================
   5. INVOICE HISTORY STORAGE (ARCHIVE)
   ========================================================================= */

export function loadInvoiceHistory(): Invoice[] {
  const saved = safeGetItem<Invoice[]>(STORAGE_KEYS.INVOICE_HISTORY, SAMPLE_INVOICES.map((s) => s.invoice));
  if (!Array.isArray(saved) || saved.length === 0) {
    saveInvoiceHistory(SAMPLE_INVOICES.map((s) => s.invoice));
    return SAMPLE_INVOICES.map((s) => s.invoice);
  }
  return saved;
}

export function saveInvoiceHistory(history: Invoice[]): Invoice[] {
  // Keep up to 100 recent invoices in storage
  const trimmed = history.slice(0, 100);
  safeSetItem(STORAGE_KEYS.INVOICE_HISTORY, trimmed);
  return trimmed;
}

export function saveInvoice(invoice: Invoice): Invoice[] {
  const history = loadInvoiceHistory();
  const now = new Date().toISOString();
  
  const finalizedInvoice: Invoice = {
    ...invoice,
    id: invoice.id.startsWith('draft') ? `inv-${Date.now()}` : invoice.id,
    updatedAt: now,
  };

  const existingIndex = history.findIndex(
    (inv) => inv.id === finalizedInvoice.id || inv.invoiceNumber === finalizedInvoice.invoiceNumber
  );

  let newHistory: Invoice[];
  if (existingIndex >= 0) {
    newHistory = [...history];
    newHistory[existingIndex] = finalizedInvoice;
  } else {
    newHistory = [finalizedInvoice, ...history];
  }

  saveInvoiceHistory(newHistory);
  return newHistory;
}

export function deleteInvoice(invoiceId: string): Invoice[] {
  const history = loadInvoiceHistory();
  const filtered = history.filter((inv) => inv.id !== invoiceId);
  saveInvoiceHistory(filtered);
  return filtered;
}

/* =========================================================================
   6. CURRENT DRAFT STORAGE
   ========================================================================= */

export function loadCurrentDraft(): Invoice {
  const saved = safeGetItem<Invoice | null>(STORAGE_KEYS.CURRENT_INVOICE, null);
  if (saved && saved.invoiceNumber && saved.items) {
    return saved;
  }
  // Initialize from default profile & sample invoice
  const profile = loadBusinessProfile();
  const sample = SAMPLE_INVOICES[0].invoice;

  return {
    ...sample,
    id: `draft-${Date.now()}`,
    business: {
      name: profile.name,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      zipCode: profile.zipCode,
      email: profile.email,
      phone: profile.phone,
      website: profile.website,
      taxId: profile.taxId,
      logoUrl: profile.logoUrl,
    },
    paymentDetails: profile.defaultPaymentDetails || sample.paymentDetails,
    notes: profile.defaultNotes || sample.notes,
    paymentTermsPreset: profile.defaultPaymentTerms || 'net15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function saveCurrentDraft(invoice: Invoice): void {
  const updated: Invoice = {
    ...invoice,
    updatedAt: new Date().toISOString(),
  };
  safeSetItem(STORAGE_KEYS.CURRENT_INVOICE, updated);
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_INVOICE);
  } catch (err) {
    console.error('Failed to clear draft', err);
  }
}

/* =========================================================================
   7. UTILITY & NUMBER SEQUENCE GENERATOR
   ========================================================================= */

export function getNextInvoiceNumber(history?: Invoice[]): string {
  const settings = loadSettings();
  const historyList = history || loadInvoiceHistory();

  let highestNum = settings.nextNumberSequence || 100;
  const prefix = settings.invoicePrefix || 'INV-';

  for (const inv of historyList) {
    if (inv.invoiceNumber) {
      const match = inv.invoiceNumber.match(/^(.*?)(\d+)$/);
      if (match) {
        const num = parseInt(match[2], 10);
        if (!isNaN(num) && num >= highestNum) {
          highestNum = num + 1;
        }
      }
    }
  }

  const padding = String(highestNum).length >= 3 ? String(highestNum).length : 3;
  return `${prefix}${String(highestNum).padStart(padding, '0')}`;
}

export function getHistorySummaries(history: Invoice[]): SavedInvoiceSummary[] {
  return history.map((inv) => {
    const totals = calculateInvoiceTotals(inv);
    const curr = CURRENCIES[inv.currencyCode] || CURRENCIES.USD;
    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber || 'Untitled',
      businessName: inv.business.name || 'Your Business',
      clientName: inv.customer.companyName || inv.customer.name || 'Unknown Client',
      grandTotal: totals.grandTotal,
      currencySymbol: curr.symbol,
      date: inv.invoiceDate,
      dueDate: inv.dueDate,
      status: inv.status || 'draft',
      updatedAt: inv.updatedAt || inv.createdAt || new Date().toISOString(),
    };
  });
}
