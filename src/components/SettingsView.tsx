import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Hash, 
  FileText,
  Sliders,
  HardDrive
} from 'lucide-react';
import { InvoiceSettings } from '../types';
import { CURRENCIES, ALL_CURRENCIES } from '../data/currencies';
import { STORAGE_KEYS } from '../utils/storage';

interface SettingsViewProps {
  settings: InvoiceSettings;
  onSaveSettings: (updated: InvoiceSettings) => void;
  onRequestConfirmReset: (title: string, message: string, onConfirm: () => void) => void;
  onRestoreAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onRequestConfirmReset,
  onRestoreAllData,
}) => {
  const [formData, setFormData] = useState<InvoiceSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      businessProfile: JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESS_PROFILE) || '{}'),
      customers: JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]'),
      services: JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]'),
      invoiceSettings: JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICE_SETTINGS) || '{}'),
      invoiceHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICE_HISTORY) || '[]'),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `invoicepro-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          if (parsed.businessProfile) {
            localStorage.setItem(STORAGE_KEYS.BUSINESS_PROFILE, JSON.stringify(parsed.businessProfile));
          }
          if (parsed.customers) {
            localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(parsed.customers));
          }
          if (parsed.services) {
            localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(parsed.services));
          }
          if (parsed.invoiceSettings) {
            localStorage.setItem(STORAGE_KEYS.INVOICE_SETTINGS, JSON.stringify(parsed.invoiceSettings));
            setFormData(parsed.invoiceSettings);
          }
          if (parsed.invoiceHistory) {
            localStorage.setItem(STORAGE_KEYS.INVOICE_HISTORY, JSON.stringify(parsed.invoiceHistory));
          }
          onRestoreAllData();
          alert('Backup restored successfully!');
        }
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllStorage = () => {
    onRequestConfirmReset(
      'Reset All Application Data?',
      'Warning: This will clear all saved customers, custom services, and invoice history from your local browser storage. This cannot be undone.',
      () => {
        localStorage.clear();
        window.location.reload();
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Application Settings</h2>
            <p className="text-xs text-slate-500">Configure numbering schemes, default currency, and backup/restore</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Numbering & Currency Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Hash className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Invoice Numbering & Default Currency</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Number Prefix
              </label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                placeholder="e.g. INV-"
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Example: INV-001</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Next Sequence Number
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.nextNumberSequence}
                onChange={(e) => setFormData({ ...formData, nextNumberSequence: parseInt(e.target.value, 10) || 1 })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Increments on each invoice</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Currency
              </label>
              <select
                value={formData.defaultCurrency}
                onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 bg-white"
              >
                {ALL_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Default Tax & Terms Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Default Taxes & Terms</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.defaultTaxRate}
                onChange={(e) => setFormData({ ...formData, defaultTaxRate: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Tax Label
              </label>
              <input
                type="text"
                value={formData.defaultTaxLabel}
                onChange={(e) => setFormData({ ...formData, defaultTaxLabel: e.target.value })}
                placeholder="Tax / VAT / Sales Tax"
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Payment Terms
              </label>
              <select
                value={formData.defaultPaymentTerms}
                onChange={(e) => setFormData({ ...formData, defaultPaymentTerms: e.target.value as any })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="receipt">Due Upon Receipt</option>
                <option value="net7">Net 7 Days</option>
                <option value="net15">Net 15 Days</option>
                <option value="net30">Net 30 Days</option>
                <option value="net45">Net 45 Days</option>
                <option value="net60">Net 60 Days</option>
                <option value="custom">Custom Terms</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Backup, Export & Reset Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <HardDrive className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900">Data Management & Backup</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Export Full Workspace Backup</h4>
            <p className="text-[11px] text-slate-500">
              Download all your saved business profiles, customers, service catalog, and invoice history as a single JSON file.
            </p>
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Restore from Backup</h4>
            <p className="text-[11px] text-slate-500">
              Import a previously exported JSON backup file to restore all your profiles and records.
            </p>
            <input
              ref={importFileRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => importFileRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON Backup</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-red-600 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Reset Local Storage
            </h4>
            <p className="text-[11px] text-slate-400">Clear all local workspace cached files and start fresh</p>
          </div>
          <button
            type="button"
            onClick={handleClearAllStorage}
            className="px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};
