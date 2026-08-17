import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Edit3, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  CreditCard, 
  FileText, 
  ShieldCheck,
  Save,
  X
} from 'lucide-react';
import { BusinessProfile, PaymentDetails } from '../types';

interface BusinessProfileViewProps {
  profile: BusinessProfile;
  onSaveProfile: (updated: BusinessProfile) => void;
  onNavigateToCreate?: () => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  profile,
  onSaveProfile,
  onNavigateToCreate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEdit = () => {
    setFormData({ ...profile });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
  };

  const handleLogoUpload = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Logo image size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData((prev) => ({ ...prev, logoUrl: e.target?.result as string }));
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {profile.logoUrl ? (
            <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2 overflow-hidden shrink-0">
              <img
                src={profile.logoUrl}
                alt={profile.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl border border-indigo-100 shrink-0">
              {profile.name ? profile.name.charAt(0).toUpperCase() : <Building2 className="w-8 h-8" />}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{profile.name || 'Your Business Name'}</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Persistent Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {profile.city && profile.state ? `${profile.city}, ${profile.state}, ${profile.country}` : 'Complete your company details to auto-fill all new invoices'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleOpenEdit}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Identity & Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Company & Contact Info</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Business Name</span>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">{profile.name || '—'}</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Tax ID / EIN / VAT</span>
              <p className="font-mono text-slate-800 font-medium mt-0.5">{profile.taxId || '—'}</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Address</span>
              <p className="text-slate-800 mt-0.5 leading-relaxed">
                {profile.address ? (
                  <>
                    {profile.address}
                    <br />
                    {profile.city}, {profile.state} {profile.zipCode}
                    <br />
                    {profile.country}
                  </>
                ) : (
                  '—'
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Email</span>
                <p className="text-slate-800 font-medium mt-0.5 truncate">{profile.email || '—'}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase font-semibold">Phone</span>
                <p className="text-slate-800 font-medium mt-0.5">{profile.phone || '—'}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Website</span>
              <p className="text-indigo-600 font-medium mt-0.5 truncate">{profile.website || '—'}</p>
            </div>
          </div>
        </div>

        {/* Default Remittance & Terms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Default Payment & Invoicing Terms</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Default Payment Terms</span>
              <p className="font-semibold text-slate-800 mt-0.5 capitalize">
                {profile.defaultPaymentTerms ? `Net ${profile.defaultPaymentTerms.replace('net', '')} Days` : 'Due Upon Receipt'}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Bank / Wire Details</span>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1 space-y-1 text-slate-700">
                <p><strong className="text-slate-900">Bank:</strong> {profile.defaultPaymentDetails?.bankName || '—'}</p>
                <p><strong className="text-slate-900">Account Name:</strong> {profile.defaultPaymentDetails?.accountName || '—'}</p>
                <p><strong className="text-slate-900">Account Number:</strong> {profile.defaultPaymentDetails?.accountNumber || '—'}</p>
                <p><strong className="text-slate-900">Routing / SWIFT:</strong> {profile.defaultPaymentDetails?.routingNumber || profile.defaultPaymentDetails?.swiftBic || '—'}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Online Payment / Portal Link</span>
              <p className="text-indigo-600 font-medium mt-0.5 truncate">{profile.defaultPaymentDetails?.paypalOrLink || '—'}</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Default Invoice Notes</span>
              <p className="text-slate-600 mt-0.5 text-xs italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                "{profile.defaultNotes || 'Thank you for your business!'}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Business Profile</h3>
                  <p className="text-xs text-slate-500">Saved profile automatically applies to all new invoices</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Logo</label>
                {formData.logoUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <img src={formData.logoUrl} alt="Logo" className="w-14 h-12 object-contain bg-white rounded p-1 border border-slate-200" />
                    <div className="flex-1 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">Logo attached</p>
                      <p className="text-[11px] text-slate-400">Renders on all future invoice headers</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-xl p-3.5 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
                      <Upload className="w-4 h-4 text-indigo-500" />
                      <span>Upload business logo (PNG, JPG, SVG up to 5MB)</span>
                    </div>
                  </div>
                )}
                {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
              </div>

              {/* Business Name & Tax ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tax ID / EIN / VAT
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Email, Phone, Website */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* City, State, ZIP, Country */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Default Bank Details */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Default Bank & Payment Remittance</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={formData.defaultPaymentDetails?.bankName || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultPaymentDetails: {
                            ...(formData.defaultPaymentDetails as PaymentDetails),
                            bankName: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. JPMorgan Chase"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={formData.defaultPaymentDetails?.accountName || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultPaymentDetails: {
                            ...(formData.defaultPaymentDetails as PaymentDetails),
                            accountName: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. ABC Business LLC"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number / IBAN</label>
                    <input
                      type="text"
                      value={formData.defaultPaymentDetails?.accountNumber || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultPaymentDetails: {
                            ...(formData.defaultPaymentDetails as PaymentDetails),
                            accountNumber: e.target.value,
                          },
                        })
                      }
                      placeholder="Account number"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Routing Number / SWIFT</label>
                    <input
                      type="text"
                      value={formData.defaultPaymentDetails?.routingNumber || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultPaymentDetails: {
                            ...(formData.defaultPaymentDetails as PaymentDetails),
                            routingNumber: e.target.value,
                          },
                        })
                      }
                      placeholder="Routing number"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Default Notes & Terms */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Invoice Notes</label>
                  <textarea
                    rows={2}
                    value={formData.defaultNotes || ''}
                    onChange={(e) => setFormData({ ...formData, defaultNotes: e.target.value })}
                    placeholder="Thank you for your business..."
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
