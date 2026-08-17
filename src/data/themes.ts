import { InvoiceTheme } from '../types';

export const INVOICE_THEMES: InvoiceTheme[] = [
  {
    id: 'theme-slate',
    name: 'Corporate Slate',
    primaryColor: '#0f172a', // Slate 900
    secondaryColor: '#334155', // Slate 700
    accentBg: '#f8fafc',
    template: 'modern',
  },
  {
    id: 'theme-indigo',
    name: 'Modern Indigo',
    primaryColor: '#4338ca', // Indigo 700
    secondaryColor: '#6366f1', // Indigo 500
    accentBg: '#eef2ff',
    template: 'modern',
  },
  {
    id: 'theme-emerald',
    name: 'Emerald Agency',
    primaryColor: '#047857', // Emerald 700
    secondaryColor: '#10b981', // Emerald 500
    accentBg: '#ecfdf5',
    template: 'modern',
  },
  {
    id: 'theme-ocean',
    name: 'Ocean Blue',
    primaryColor: '#0284c7', // Sky 600
    secondaryColor: '#38bdf8', // Sky 400
    accentBg: '#f0f9ff',
    template: 'executive',
  },
  {
    id: 'theme-crimson',
    name: 'Classic Crimson',
    primaryColor: '#991b1b', // Red 800
    secondaryColor: '#dc2626', // Red 600
    accentBg: '#fef2f2',
    template: 'classic',
  },
  {
    id: 'theme-amber',
    name: 'Amber Bronze',
    primaryColor: '#b45309', // Amber 700
    secondaryColor: '#f59e0b', // Amber 500
    accentBg: '#fffbeb',
    template: 'minimal',
  },
];

export const DEFAULT_THEME = INVOICE_THEMES[0];
