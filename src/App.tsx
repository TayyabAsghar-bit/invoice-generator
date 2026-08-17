import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  Plus, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Edit3,
  Building2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  Invoice, 
  InvoiceItem, 
  BusinessInfo, 
  CustomerInfo, 
  PaymentDetails, 
  InvoiceTheme, 
  ValidationErrors,
  AppNavTab,
  SavedCustomer,
  SavedService,
  BusinessProfile,
  InvoiceSettings
} from './types';
import { 
  loadCurrentDraft, 
  saveCurrentDraft, 
  loadInvoiceHistory, 
  saveInvoice, 
  deleteInvoice, 
  getNextInvoiceNumber,
  loadBusinessProfile,
  saveBusinessProfile,
  loadCustomers,
  saveCustomer,
  deleteCustomer,
  saveCustomers,
  loadServices,
  saveService,
  deleteService,
  saveServices,
  loadSettings,
  saveSettings,
  DEFAULT_SERVICES
} from './utils/storage';
import { calculateInvoiceTotals, validateInvoice, calculateDueDate } from './utils/calculations';
import { downloadInvoicePdf, triggerPrintInvoice } from './utils/pdfGenerator';
import { SAMPLE_INVOICES, EMPTY_INVOICE } from './data/sampleInvoices';
import { DEFAULT_THEME } from './data/themes';

import { Header } from './components/Header';
import { BusinessForm } from './components/BusinessForm';
import { CustomerForm } from './components/CustomerForm';
import { InvoiceDetailsForm } from './components/InvoiceDetailsForm';
import { InvoiceItemsTable } from './components/InvoiceItemsTable';
import { SummaryAndDiscounts } from './components/SummaryAndDiscounts';
import { PaymentAndNotes } from './components/PaymentAndNotes';
import { ThemeSelector } from './components/ThemeSelector';
import { InvoicePreview } from './components/InvoicePreview';
import { SampleTemplateModal } from './components/SampleTemplateModal';
import { ConfirmModal } from './components/ConfirmModal';

// Dedicated Full-Page View Components
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { ServicesView } from './components/ServicesView';
import { BusinessProfileView } from './components/BusinessProfileView';
import { InvoiceHistoryView } from './components/InvoiceHistoryView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppNavTab>('create');

  // Centralized State from Storage
  const [invoice, setInvoice] = useState<Invoice>(() => loadCurrentDraft());
  const [history, setHistory] = useState<Invoice[]>(() => loadInvoiceHistory());
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => loadBusinessProfile());
  const [customers, setCustomers] = useState<SavedCustomer[]>(() => loadCustomers());
  const [services, setServices] = useState<SavedService[]>(() => loadServices());
  const [settings, setSettings] = useState<InvoiceSettings>(() => loadSettings());

  // UI States
  const [activeTabMobile, setActiveTabMobile] = useState<'editor' | 'preview'>('editor');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: true,
    onConfirm: () => {},
  });

  // Real-time calculations & validations
  const totals = useMemo(() => calculateInvoiceTotals(invoice), [invoice]);
  const errors: ValidationErrors = useMemo(() => validateInvoice(invoice), [invoice]);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  }, []);

  // Request reusable confirmation dialog
  const requestConfirm = useCallback((title: string, message: string, onConfirm: () => void, isDestructive = true, confirmLabel = 'Delete') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmLabel,
      isDestructive,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  }, []);

  // Auto-save draft on invoice change
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveCurrentDraft(invoice);
      setSaveStatus('saved');
    }, 400);

    return () => clearTimeout(timer);
  }, [invoice]);

  // Form Update Handlers
  const updateInvoice = useCallback((updates: Partial<Invoice>) => {
    setInvoice((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateBusiness = useCallback((updates: Partial<BusinessInfo>) => {
    setInvoice((prev) => ({
      ...prev,
      business: { ...prev.business, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateCustomer = useCallback((updates: Partial<CustomerInfo>) => {
    setInvoice((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateItems = useCallback((items: InvoiceItem[]) => {
    setInvoice((prev) => ({
      ...prev,
      items,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updatePaymentDetails = useCallback((updates: Partial<PaymentDetails>) => {
    setInvoice((prev) => ({
      ...prev,
      paymentDetails: { ...prev.paymentDetails, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateTheme = useCallback((theme: InvoiceTheme) => {
    setInvoice((prev) => ({
      ...prev,
      theme,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Action: Business Profile Save
  const handleSaveProfile = useCallback((updated: BusinessProfile) => {
    const saved = saveBusinessProfile(updated);
    setBusinessProfile(saved);
    // Also optionally update current invoice business if it was using default
    setInvoice((prev) => ({
      ...prev,
      business: {
        name: saved.name,
        address: saved.address,
        city: saved.city,
        state: saved.state,
        country: saved.country,
        zipCode: saved.zipCode,
        email: saved.email,
        phone: saved.phone,
        website: saved.website,
        taxId: saved.taxId,
        logoUrl: saved.logoUrl,
      },
      paymentDetails: saved.defaultPaymentDetails || prev.paymentDetails,
      notes: saved.defaultNotes || prev.notes,
      paymentTermsPreset: saved.defaultPaymentTerms || prev.paymentTermsPreset,
    }));
    showToast('Business Profile saved successfully.');
  }, [showToast]);

  // Action: Customer Management
  const handleSaveCustomer = useCallback((cust: Omit<SavedCustomer, 'id'> & { id?: string }) => {
    saveCustomer(cust);
    const updatedList = loadCustomers();
    setCustomers(updatedList);
    showToast(`Customer ${cust.name || cust.companyName} saved.`);
  }, [showToast]);

  const handleDeleteCustomer = useCallback((id: string) => {
    const updated = deleteCustomer(id);
    setCustomers(updated);
    showToast('Customer deleted.');
  }, [showToast]);

  const handleCreateInvoiceForCustomer = useCallback((cust: SavedCustomer) => {
    const nextNumber = getNextInvoiceNumber(history);
    const newInv: Invoice = {
      ...EMPTY_INVOICE,
      id: `draft-${Date.now()}`,
      invoiceNumber: nextNumber,
      business: {
        name: businessProfile.name,
        address: businessProfile.address,
        city: businessProfile.city,
        state: businessProfile.state,
        country: businessProfile.country,
        zipCode: businessProfile.zipCode,
        email: businessProfile.email,
        phone: businessProfile.phone,
        website: businessProfile.website,
        taxId: businessProfile.taxId,
        logoUrl: businessProfile.logoUrl,
      },
      customer: {
        name: cust.name,
        companyName: cust.companyName,
        email: cust.email,
        phone: cust.phone,
        address: cust.address,
        city: cust.city,
        state: cust.state,
        country: cust.country,
        zipCode: cust.zipCode,
      },
      currencyCode: settings.defaultCurrency || 'USD',
      theme: DEFAULT_THEME,
      paymentTermsPreset: settings.defaultPaymentTerms || 'net15',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: calculateDueDate(new Date().toISOString().split('T')[0], settings.defaultPaymentTerms || 'net15'),
      notes: businessProfile.defaultNotes || '',
      paymentDetails: businessProfile.defaultPaymentDetails || EMPTY_INVOICE.paymentDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoice(newInv);
    setActiveTab('create');
    showToast(`Started new invoice for ${cust.name || cust.companyName}`);
  }, [businessProfile, history, settings, showToast]);

  // Action: Services Management
  const handleSaveService = useCallback((srv: Omit<SavedService, 'id'> & { id?: string }) => {
    saveService(srv);
    const updatedList = loadServices();
    setServices(updatedList);
    showToast(`Service "${srv.name}" saved.`);
  }, [showToast]);

  const handleDeleteService = useCallback((id: string) => {
    const updated = deleteService(id);
    setServices(updated);
    showToast('Service deleted from catalog.');
  }, [showToast]);

  const handleResetServicesToDefault = useCallback(() => {
    saveServices(DEFAULT_SERVICES as SavedService[]);
    setServices(loadServices());
    showToast('Services catalog reset to factory defaults.');
  }, [showToast]);

  // Action: Settings Management
  const handleSaveSettings = useCallback((updated: InvoiceSettings) => {
    const saved = saveSettings(updated);
    setSettings(saved);
    showToast('Settings saved.');
  }, [showToast]);

  const handleRestoreAllData = useCallback(() => {
    setBusinessProfile(loadBusinessProfile());
    setCustomers(loadCustomers());
    setServices(loadServices());
    setSettings(loadSettings());
    setHistory(loadInvoiceHistory());
    setInvoice(loadCurrentDraft());
    showToast('All workspace data restored from backup.');
  }, [showToast]);

  // Action: Create Brand New Invoice
  const handleNewInvoice = useCallback(() => {
    const nextNumber = getNextInvoiceNumber(history);
    const newInv: Invoice = {
      ...EMPTY_INVOICE,
      id: `draft-${Date.now()}`,
      invoiceNumber: nextNumber,
      business: {
        name: businessProfile.name,
        address: businessProfile.address,
        city: businessProfile.city,
        state: businessProfile.state,
        country: businessProfile.country,
        zipCode: businessProfile.zipCode,
        email: businessProfile.email,
        phone: businessProfile.phone,
        website: businessProfile.website,
        taxId: businessProfile.taxId,
        logoUrl: businessProfile.logoUrl,
      },
      currencyCode: settings.defaultCurrency || 'USD',
      theme: DEFAULT_THEME,
      paymentTermsPreset: settings.defaultPaymentTerms || 'net15',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: calculateDueDate(new Date().toISOString().split('T')[0], settings.defaultPaymentTerms || 'net15'),
      notes: businessProfile.defaultNotes || '',
      paymentDetails: businessProfile.defaultPaymentDetails || EMPTY_INVOICE.paymentDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvoice(newInv);
    setActiveTab('create');
    showToast(`Created new invoice ${nextNumber}`);
  }, [businessProfile, history, settings, showToast]);

  // Action: Reset Draft Confirmation
  const handlePromptReset = useCallback(() => {
    requestConfirm(
      'Reset Current Invoice?',
      'This will clear all items and customer details on your current draft. Are you sure?',
      () => {
        setInvoice({
          ...EMPTY_INVOICE,
          id: `draft-${Date.now()}`,
          invoiceNumber: getNextInvoiceNumber(history),
          business: {
            name: businessProfile.name,
            address: businessProfile.address,
            city: businessProfile.city,
            state: businessProfile.state,
            country: businessProfile.country,
            zipCode: businessProfile.zipCode,
            email: businessProfile.email,
            phone: businessProfile.phone,
            website: businessProfile.website,
            taxId: businessProfile.taxId,
            logoUrl: businessProfile.logoUrl,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        showToast('Invoice fields reset.');
      },
      true,
      'Clear Draft'
    );
  }, [businessProfile, history, requestConfirm, showToast]);

  // Action: Select Template
  const handleSelectSample = useCallback((sample: Invoice) => {
    const freshSample: Invoice = {
      ...sample,
      id: `draft-${Date.now()}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: calculateDueDate(new Date().toISOString().split('T')[0], sample.paymentTermsPreset || 'net15'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoice(freshSample);
    setActiveTab('create');
    showToast('Loaded sample invoice template.');
  }, [showToast]);

  // Action: Duplicate Invoice from History
  const handleDuplicateInvoice = useCallback((source: Invoice) => {
    const nextNumber = getNextInvoiceNumber(history);
    const duplicated: Invoice = {
      ...source,
      id: `draft-${Date.now()}`,
      invoiceNumber: nextNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: calculateDueDate(new Date().toISOString().split('T')[0], source.paymentTermsPreset || 'net15'),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedHistory = saveInvoice(duplicated);
    setHistory(updatedHistory);
    setInvoice(duplicated);
    setActiveTab('create');
    showToast(`Duplicated as ${nextNumber}`);
  }, [history, showToast]);

  // Action: Delete Invoice
  const handleDeleteInvoice = useCallback((invoiceId: string) => {
    const updated = deleteInvoice(invoiceId);
    setHistory(updated);
    showToast('Invoice deleted from archive.');
  }, [showToast]);

  // Action: Download PDF
  const handleDownloadPdf = useCallback(async (targetInvoice?: Invoice) => {
    const currentInv = targetInvoice || invoice;
    const validationErrors = validateInvoice(currentInv);
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      showToast(`Please check required fields: ${firstError}`);
      setActiveTab('create');
      setActiveTabMobile('editor');
      return;
    }

    setIsGeneratingPdf(true);
    try {
      // Archive snapshot to history
      const updatedHistory = saveInvoice(currentInv);
      setHistory(updatedHistory);

      await downloadInvoicePdf({
        elementId: 'invoice-document-preview',
        invoice: currentInv,
      });

      showToast('PDF invoice downloaded successfully!');
    } catch (err: any) {
      console.error('PDF export failed', err);
      showToast('Failed to export PDF. Please try Print as a reliable alternative.');
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [invoice, showToast]);

  // Action: Print Invoice
  const handlePrint = useCallback(() => {
    const updatedHistory = saveInvoice(invoice);
    setHistory(updatedHistory);
    triggerPrintInvoice();
  }, [invoice]);

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col text-slate-900">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Header with Tabs */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onNewInvoice={handleNewInvoice}
        onResetInvoice={handlePromptReset}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onPrint={handlePrint}
        onDownloadPdf={() => handleDownloadPdf()}
        isGeneratingPdf={isGeneratingPdf}
        saveStatus={saveStatus}
        historyCount={history.length}
      />

      {/* Mobile Switcher (Only on Create view) */}
      {activeTab === 'create' && (
        <div className="lg:hidden px-4 pt-3 pb-1 no-print">
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTabMobile('editor')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTabMobile === 'editor'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Invoice Form</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTabMobile('preview')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTabMobile === 'preview'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardView
            invoices={history}
            customers={customers}
            services={services}
            businessProfile={businessProfile}
            onNavigateToCreate={handleNewInvoice}
            onNavigateToCustomers={() => setActiveTab('customers')}
            onNavigateToServices={() => setActiveTab('services')}
            onNavigateToProfile={() => setActiveTab('profile')}
            onNavigateToHistory={() => setActiveTab('history')}
            onLoadInvoice={(inv) => {
              setInvoice(inv);
              setActiveTab('create');
            }}
            onDuplicateInvoice={handleDuplicateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onDownloadPdf={(inv) => {
              setInvoice(inv);
              handleDownloadPdf(inv);
            }}
            onRequestConfirmDelete={requestConfirm}
          />
        )}

        {/* VIEW 2: CREATE INVOICE (EDITOR + PREVIEW) */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Controls */}
            <div
              className={`lg:col-span-6 xl:col-span-5 space-y-5 ${
                activeTabMobile === 'editor' ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* Quick Template Tips */}
              <div className="bg-gradient-to-r from-indigo-50/80 to-blue-50/80 border border-indigo-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-indigo-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Fill in details — live A4 preview recalculates on the right</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTemplatesModalOpen(true)}
                  className="font-bold underline text-indigo-700 hover:text-indigo-800 shrink-0 cursor-pointer"
                >
                  Templates
                </button>
              </div>

              {/* 1. Business Info */}
              <BusinessForm
                business={invoice.business}
                errors={errors}
                onChange={updateBusiness}
                onNavigateToProfile={() => setActiveTab('profile')}
                onResetToSavedProfile={() => {
                  updateBusiness({
                    name: businessProfile.name,
                    address: businessProfile.address,
                    city: businessProfile.city,
                    state: businessProfile.state,
                    country: businessProfile.country,
                    zipCode: businessProfile.zipCode,
                    email: businessProfile.email,
                    phone: businessProfile.phone,
                    website: businessProfile.website,
                    taxId: businessProfile.taxId,
                    logoUrl: businessProfile.logoUrl,
                  });
                  showToast('Re-applied saved business profile.');
                }}
              />

              {/* 2. Customer Info */}
              <CustomerForm
                customer={invoice.customer}
                savedCustomers={customers}
                errors={errors}
                onChange={updateCustomer}
                onSaveAsNewCustomer={(cust) => {
                  handleSaveCustomer({
                    name: cust.name,
                    companyName: cust.companyName,
                    email: cust.email,
                    phone: cust.phone,
                    address: cust.address,
                    city: cust.city,
                    state: cust.state,
                    country: cust.country,
                    zipCode: cust.zipCode,
                  });
                }}
              />

              {/* 3. Invoice Details & Currency */}
              <InvoiceDetailsForm
                invoice={invoice}
                errors={errors}
                onChange={updateInvoice}
              />

              {/* 4. Line Items Table with Predefined Services & 50 State Fees */}
              <InvoiceItemsTable
                items={invoice.items}
                currencyCode={invoice.currencyCode}
                errors={errors}
                onChange={updateItems}
              />

              {/* 5. Summary, Taxes, Discount & Shipping */}
              <SummaryAndDiscounts
                invoice={invoice}
                totals={totals}
                onChange={updateInvoice}
              />

              {/* 6. Payment Remittance, Terms & Notes */}
              <PaymentAndNotes
                invoice={invoice}
                onChange={updateInvoice}
                onPaymentChange={updatePaymentDetails}
              />

              {/* 7. Theme & Template Style Customizer */}
              <ThemeSelector
                currentTheme={invoice.theme}
                onThemeChange={updateTheme}
              />

              {/* Bottom Actions for Form */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf()}
                  disabled={isGeneratingPdf}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download PDF Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-700" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live A4 Document Preview */}
            <div
              className={`lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 space-y-3 ${
                activeTabMobile === 'preview' ? 'block' : 'hidden lg:block'
              }`}
            >
              <InvoicePreview invoice={invoice} totals={totals} />
            </div>
          </div>
        )}

        {/* VIEW 3: CUSTOMERS */}
        {activeTab === 'customers' && (
          <CustomersView
            customers={customers}
            onSaveCustomer={handleSaveCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onCreateInvoiceForCustomer={handleCreateInvoiceForCustomer}
            onRequestConfirmDelete={requestConfirm}
          />
        )}

        {/* VIEW 4: SERVICES */}
        {activeTab === 'services' && (
          <ServicesView
            services={services}
            currencySymbol={totals ? '$' : '$'}
            onSaveService={handleSaveService}
            onDeleteService={handleDeleteService}
            onResetServicesToDefault={handleResetServicesToDefault}
            onRequestConfirmDelete={requestConfirm}
          />
        )}

        {/* VIEW 5: INVOICE HISTORY */}
        {activeTab === 'history' && (
          <InvoiceHistoryView
            invoices={history}
            onLoadInvoice={(inv) => {
              setInvoice(inv);
              setActiveTab('create');
              showToast(`Loaded invoice ${inv.invoiceNumber}`);
            }}
            onDuplicateInvoice={handleDuplicateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onDownloadPdf={(inv) => {
              setInvoice(inv);
              handleDownloadPdf(inv);
            }}
            onNavigateToCreate={handleNewInvoice}
            onRequestConfirmDelete={requestConfirm}
          />
        )}

        {/* VIEW 6: BUSINESS PROFILE */}
        {activeTab === 'profile' && (
          <BusinessProfileView
            profile={businessProfile}
            onSaveProfile={handleSaveProfile}
            onNavigateToCreate={handleNewInvoice}
          />
        )}

        {/* VIEW 7: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onRequestConfirmReset={requestConfirm}
            onRestoreAllData={handleRestoreAllData}
          />
        )}
      </main>

      {/* Preset Sample Templates Modal */}
      <SampleTemplateModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectSample={handleSelectSample}
      />

      {/* Generic Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
