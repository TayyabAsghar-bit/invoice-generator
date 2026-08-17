import React, { useRef, useState } from 'react';
import { Building2, Upload, Trash2, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { BusinessInfo, ValidationErrors } from '../types';

interface BusinessFormProps {
  business: BusinessInfo;
  errors: ValidationErrors;
  onChange: (updated: Partial<BusinessInfo>) => void;
  onNavigateToProfile?: () => void;
  onResetToSavedProfile?: () => void;
}

export const BusinessForm: React.FC<BusinessFormProps> = ({
  business,
  errors,
  onChange,
  onNavigateToProfile,
  onResetToSavedProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoProcess = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange({ logoUrl: e.target.result as string });
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    onChange({ logoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Your Business Details (Billed From)</h3>
            <p className="text-xs text-slate-500">Company identity & header branding</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onResetToSavedProfile && (
            <button
              type="button"
              onClick={onResetToSavedProfile}
              className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              title="Reset to default saved profile"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reload Profile</span>
            </button>
          )}
          {onNavigateToProfile && (
            <button
              type="button"
              onClick={onNavigateToProfile}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 transition-colors"
            >
              Edit Master Profile
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Logo Upload Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Logo</label>
          {business.logoUrl ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-16 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={business.logoUrl}
                  alt="Business Logo Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">Logo attached</p>
                <p className="text-[11px] text-slate-500">Rendered on top of invoice</p>
              </div>
              <button
                type="button"
                id="remove-logo-btn"
                onClick={handleRemoveLogo}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remove logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="business-logo-input"
              />
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">
                  Upload company logo
                </span>
                <span className="text-[11px] text-slate-400">(PNG, JPG, SVG)</span>
              </div>
            </div>
          )}
          {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
        </div>

        {/* Business Name & Tax ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business / Freelancer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="business-name-input"
              value={business.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Apex Corporate Services LLC"
              className={`w-full text-xs sm:text-sm rounded-xl border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors['business.name']
                  ? 'border-red-400 focus:ring-red-200 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors['business.name'] && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors['business.name']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tax ID / EIN / VAT
            </label>
            <input
              type="text"
              id="business-taxid-input"
              value={business.taxId}
              onChange={(e) => onChange({ taxId: e.target.value })}
              placeholder="e.g. US-EIN-88-2940192"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Email, Phone & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Email
            </label>
            <input
              type="email"
              id="business-email-input"
              value={business.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="billing@apexcorporate.io"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              id="business-phone-input"
              value={business.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 (302) 555-0188"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Website
            </label>
            <input
              type="text"
              id="business-website-input"
              value={business.website}
              onChange={(e) => onChange({ website: e.target.value })}
              placeholder="https://apexcorporate.io"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            id="business-address-input"
            value={business.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="1201 North Market Street, Suite 800"
            className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* City, State, Country, ZIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              id="business-city-input"
              value={business.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="Wilmington"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
            <input
              type="text"
              id="business-state-input"
              value={business.state}
              onChange={(e) => onChange({ state: e.target.value })}
              placeholder="DE"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP Code</label>
            <input
              type="text"
              id="business-zip-input"
              value={business.zipCode}
              onChange={(e) => onChange({ zipCode: e.target.value })}
              placeholder="19801"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
            <input
              type="text"
              id="business-country-input"
              value={business.country}
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
