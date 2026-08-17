export interface PredefinedService {
  id: string;
  name: string;
  defaultPrice: number;
  defaultQty: number;
  description: string;
  hasStateSelector?: boolean;
}

export interface StateFeeOption {
  state: string;
  code: string;
  fee: number;
}

export const US_STATE_FEES: StateFeeOption[] = [
  { state: 'Alabama', code: 'AL', fee: 200 },
  { state: 'Alaska', code: 'AK', fee: 250 },
  { state: 'Arizona', code: 'AZ', fee: 50 },
  { state: 'Arkansas', code: 'AR', fee: 45 },
  { state: 'California', code: 'CA', fee: 70 },
  { state: 'Colorado', code: 'CO', fee: 180 },
  { state: 'Connecticut', code: 'CT', fee: 120 },
  { state: 'Delaware', code: 'DE', fee: 90 },
  { state: 'Florida', code: 'FL', fee: 125 },
  { state: 'Georgia', code: 'GA', fee: 100 },
  { state: 'Hawaii', code: 'HI', fee: 50 },
  { state: 'Idaho', code: 'ID', fee: 100 },
  { state: 'Illinois', code: 'IL', fee: 150 },
  { state: 'Indiana', code: 'IN', fee: 95 },
  { state: 'Iowa', code: 'IA', fee: 50 },
  { state: 'Kansas', code: 'KS', fee: 160 },
  { state: 'Kentucky', code: 'KY', fee: 40 },
  { state: 'Louisiana', code: 'LA', fee: 100 },
  { state: 'Maine', code: 'ME', fee: 175 },
  { state: 'Maryland', code: 'MD', fee: 100 },
  { state: 'Massachusetts', code: 'MA', fee: 500 },
  { state: 'Michigan', code: 'MI', fee: 50 },
  { state: 'Minnesota', code: 'MN', fee: 155 },
  { state: 'Mississippi', code: 'MS', fee: 50 },
  { state: 'Missouri', code: 'MO', fee: 50 },
  { state: 'Montana', code: 'MT', fee: 70 },
  { state: 'Nebraska', code: 'NE', fee: 105 },
  { state: 'Nevada', code: 'NV', fee: 425 },
  { state: 'New Hampshire', code: 'NH', fee: 100 },
  { state: 'New Jersey', code: 'NJ', fee: 125 },
  { state: 'New Mexico', code: 'NM', fee: 50 },
  { state: 'New York', code: 'NY', fee: 200 },
  { state: 'North Carolina', code: 'NC', fee: 125 },
  { state: 'North Dakota', code: 'ND', fee: 135 },
  { state: 'Ohio', code: 'OH', fee: 99 },
  { state: 'Oklahoma', code: 'OK', fee: 100 },
  { state: 'Oregon', code: 'OR', fee: 100 },
  { state: 'Pennsylvania', code: 'PA', fee: 125 },
  { state: 'Rhode Island', code: 'RI', fee: 150 },
  { state: 'South Carolina', code: 'SC', fee: 110 },
  { state: 'South Dakota', code: 'SD', fee: 150 },
  { state: 'Tennessee', code: 'TN', fee: 300 },
  { state: 'Texas', code: 'TX', fee: 300 },
  { state: 'Utah', code: 'UT', fee: 54 },
  { state: 'Vermont', code: 'VT', fee: 125 },
  { state: 'Virginia', code: 'VA', fee: 100 },
  { state: 'Washington', code: 'WA', fee: 200 },
  { state: 'West Virginia', code: 'WV', fee: 100 },
  { state: 'Wisconsin', code: 'WI', fee: 130 },
  { state: 'Wyoming', code: 'WY', fee: 102 },
];

export const DEFAULT_SERVICES: PredefinedService[] = [
  {
    id: 'unique-address',
    name: 'UNIQUE ADDRESS',
    defaultPrice: 50,
    defaultQty: 1,
    description: 'UNIQUE ADDRESS',
  },
  {
    id: 'state-fee',
    name: 'STATE FEE',
    defaultPrice: 300,
    defaultQty: 1,
    description: 'STATE FEE (Texas)',
    hasStateSelector: true,
  },
  {
    id: 'usa-number',
    name: 'USA NUMBER',
    defaultPrice: 8,
    defaultQty: 1,
    description: 'USA NUMBER',
  },
  {
    id: 'registered-agent',
    name: 'REGISTERED AGENT',
    defaultPrice: 99,
    defaultQty: 1,
    description: 'REGISTERED AGENT',
  },
  {
    id: 'portal-access',
    name: 'PORTAL ACCESS',
    defaultPrice: 49,
    defaultQty: 1,
    description: 'PORTAL ACCESS',
  },
  {
    id: 'articles-of-organization',
    name: 'ARTICLES OF ORGANIZATION',
    defaultPrice: 150,
    defaultQty: 1,
    description: 'ARTICLES OF ORGANIZATION',
  },
  {
    id: 'ein',
    name: 'EIN',
    defaultPrice: 80,
    defaultQty: 1,
    description: 'EIN',
  },
  {
    id: 'bank-accounts',
    name: 'BANK ACCOUNTS',
    defaultPrice: 200,
    defaultQty: 1,
    description: 'BANK ACCOUNTS',
  },
  {
    id: 'vat',
    name: 'VAT',
    defaultPrice: 120,
    defaultQty: 1,
    description: 'VAT',
  },
];

const SAVED_SERVICES_STORAGE_KEY = 'invoicePro_services';

export function getSavedServices(): PredefinedService[] {
  try {
    const raw = localStorage.getItem(SAVED_SERVICES_STORAGE_KEY);
    if (!raw) return DEFAULT_SERVICES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load saved services', err);
  }
  return DEFAULT_SERVICES;
}

export function saveServicesToStorage(services: PredefinedService[]): void {
  try {
    localStorage.setItem(SAVED_SERVICES_STORAGE_KEY, JSON.stringify(services));
  } catch (err) {
    console.error('Failed to save services', err);
  }
}
