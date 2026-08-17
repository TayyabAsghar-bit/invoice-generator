import React, { useState } from 'react';
import { UserCheck, Building, Mail, Phone, MapPin, UserPlus, Check } from 'lucide-react';
import { CustomerInfo, ValidationErrors, SavedCustomer } from '../types';

interface CustomerFormProps {
  customer: CustomerInfo;
  savedCustomers: SavedCustomer[];
  errors: ValidationErrors;
  onChange: (updated: Partial<CustomerInfo>) => void;
  onSaveAsNewCustomer?: (customer: CustomerInfo) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  savedCustomers,
  errors,
  onChange,
  onSaveAsNewCustomer,
}) => {
  const [justSaved, setJustSaved] = useState(false);

  const handleSelectCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const found = savedCustomers.find((c) => c.id === selectedId);
    if (found) {
      onChange({
        name: found.name,
        companyName: found.companyName,
        email: found.email,
        phone: found.phone,
        address: found.address,
        city: found.city,
        state: found.state,
        country: found.country,
        zipCode: found.zipCode,
      });
    }
  };

  const handleQuickSaveCustomer = () => {
    if (onSaveAsNewCustomer && (customer.name || customer.companyName)) {
      onSaveAsNewCustomer(customer);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Client / Customer Details (Billed To)</h3>
            <p className="text-xs text-slate-500">Who is this invoice being billed to?</p>
          </div>
        </div>

        {/* Quick Save Customer Button */}
        {onSaveAsNewCustomer && (customer.name || customer.companyName) && (
          <button
            type="button"
            onClick={handleQuickSaveCustomer}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {justSaved ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Saved to Directory!</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3 text-emerald-600" />
                <span>Save to Directory</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Saved Customer Dropdown Picker */}
        {savedCustomers.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select from Saved Customers (Auto-Fill)
            </label>
            <select
              defaultValue=""
              onChange={handleSelectCustomer}
              className="w-full text-xs rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="" disabled>
                -- Choose a saved client to auto-fill --
              </option>
              {savedCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.companyName} {c.companyName && c.name ? `(${c.companyName})` : ''} — {c.city || c.state || c.country}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Customer Name & Company Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact / Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customer-name-input"
              value={customer.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className={`w-full text-xs sm:text-sm rounded-xl border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors['customer.name']
                  ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors['customer.name'] && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors['customer.name']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Name (Optional)
            </label>
            <input
              type="text"
              id="customer-company-input"
              value={customer.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              placeholder="e.g. Horizon Ventures Inc."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client Email
            </label>
            <input
              type="email"
              id="customer-email-input"
              value={customer.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="accounts@horizonventures.tech"
              className={`w-full text-xs sm:text-sm rounded-xl border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors['customer.email']
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {errors['customer.email'] && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors['customer.email']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client Phone
            </label>
            <input
              type="text"
              id="customer-phone-input"
              value={customer.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 (512) 555-0144"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Billing Address
          </label>
          <input
            type="text"
            id="customer-address-input"
            value={customer.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="400 Congress Avenue, Suite 1400"
            className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* City, State, Country, ZIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              id="customer-city-input"
              value={customer.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="Austin"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
            <input
              type="text"
              id="customer-state-input"
              value={customer.state}
              onChange={(e) => onChange({ state: e.target.value })}
              placeholder="TX"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP / Postal</label>
            <input
              type="text"
              id="customer-zip-input"
              value={customer.zipCode}
              onChange={(e) => onChange({ zipCode: e.target.value })}
              placeholder="78701"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
            <input
              type="text"
              id="customer-country-input"
              value={customer.country}
              onChange={(e) => onChange({ country: e.target.value })}
              placeholder="United States"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
