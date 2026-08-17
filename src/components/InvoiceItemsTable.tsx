import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Layers,
  MapPin,
  Check,
  ChevronDown,
  Settings,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { InvoiceItem, ValidationErrors } from '../types';
import { formatCurrency, safeNumber } from '../utils/calculations';
import { CURRENCIES } from '../data/currencies';
import { 
  DEFAULT_SERVICES, 
  US_STATE_FEES, 
  PredefinedService, 
  getSavedServices, 
  saveServicesToStorage,
  StateFeeOption
} from '../data/servicesData';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currencyCode: string;
  errors: ValidationErrors;
  onChange: (items: InvoiceItem[]) => void;
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  items,
  currencyCode,
  errors,
  onChange,
}) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const [savedServices, setSavedServices] = useState<PredefinedService[]>(getSavedServices);
  const [activeStateDropdownRowId, setActiveStateDropdownRowId] = useState<string | null>(null);
  const [showManageServicesModal, setShowManageServicesModal] = useState(false);
  const [editingServicesList, setEditingServicesList] = useState<PredefinedService[]>([]);

  // Keep saved services in sync
  useEffect(() => {
    setSavedServices(getSavedServices());
  }, []);

  // Handler for adding a standard empty line item as required
  const handleAddEmptyItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
    };
    onChange([...items, newItem]);
  };

  // Handler for adding a predefined / saved service item
  const handleAddPredefinedService = (service: PredefinedService) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: service.description || service.name,
      quantity: service.defaultQty || 1,
      unitPrice: service.defaultPrice,
      taxRate: 0,
    };
    onChange([...items, newItem]);
  };

  // Handler for applying a saved service to an existing line item
  const handleApplyServiceToRow = (rowId: string, serviceName: string) => {
    const matched = savedServices.find((s) => s.name === serviceName);
    if (!matched) return;

    const updated = items.map((item) => {
      if (item.id === rowId) {
        return {
          ...item,
          description: matched.description || matched.name,
          unitPrice: matched.defaultPrice,
        };
      }
      return item;
    });
    onChange(updated);
  };

  // Handler for selecting a US State for State Fee
  const handleSelectStateForFee = (rowId: string, stateOption: StateFeeOption) => {
    const updated = items.map((item) => {
      if (item.id === rowId) {
        return {
          ...item,
          description: `STATE FEE (${stateOption.state})`,
          unitPrice: stateOption.fee,
        };
      }
      return item;
    });
    onChange(updated);
    setActiveStateDropdownRowId(null);
  };

  // Update a specific line item property
  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    const updated = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
    onChange(updated);
  };

  // Delete line item immediately and recalculate
  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) {
      // Keep at least one empty line item row
      onChange([
        {
          id: `item-${Date.now()}`,
          description: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: 0,
        },
      ]);
      return;
    }
    onChange(items.filter((item) => item.id !== id));
  };

  // Duplicate an item
  const handleDuplicateItem = (item: InvoiceItem) => {
    const duplicated: InvoiceItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    onChange([...items, duplicated]);
  };

  // Reorder items
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onChange(newItems);
  };

  // Open saved services management
  const handleOpenManageServices = () => {
    setEditingServicesList([...savedServices]);
    setShowManageServicesModal(true);
  };

  const handleSaveServiceDefaults = () => {
    saveServicesToStorage(editingServicesList);
    setSavedServices(editingServicesList);
    setShowManageServicesModal(false);
  };

  const handleResetServiceDefaults = () => {
    setEditingServicesList(DEFAULT_SERVICES);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      {/* Header & Services Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Line Items & Services</h3>
              <p className="text-xs text-slate-500">
                Select predefined corporate services or create custom line items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="manage-saved-services-btn"
              onClick={handleOpenManageServices}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Customize default service rates"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Default Rates</span>
            </button>
          </div>
        </div>

        {/* Predefined Quick-Select Service Buttons */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Predefined Services (Click to Add):</span>
            </div>
            <span className="text-[11px] text-slate-400">Clicking adds a new item with default price</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
            {savedServices.map((service, sIndex) => (
              <button
                key={service.id}
                type="button"
                id={`quick-add-service-${sIndex}`}
                onClick={() => handleAddPredefinedService(service)}
                className="group flex flex-col p-2 bg-white hover:bg-indigo-50/60 border border-slate-200/90 hover:border-indigo-300 rounded-lg text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              >
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-700 tracking-tight leading-tight line-clamp-1">
                  {service.name}
                </span>
                <span className="text-[11px] font-mono-num font-semibold text-indigo-600 mt-1">
                  {formatCurrency(service.defaultPrice, currencyCode)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {errors['items'] && (
        <div className="mx-4 sm:mx-5 mt-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
          {errors['items']}
        </div>
      )}

      {/* Items Table Form */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Table Header on Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-3 text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100 px-2">
          <div className="col-span-5">Item Description & Scope</div>
          <div className="col-span-2 text-center">Qty / Hours</div>
          <div className="col-span-2 text-right">Price ({currency.symbol})</div>
          <div className="col-span-2 text-right">Amount ({currency.symbol})</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {items.map((item, index) => {
            const qty = safeNumber(item.quantity, 0);
            const price = safeNumber(item.unitPrice, 0);
            const rowAmount = Math.round(qty * price * 100) / 100;
            const isStateFeeItem = item.description.toUpperCase().includes('STATE FEE');

            return (
              <div
                key={item.id}
                className="group relative p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-3 lg:items-center"
              >
                {/* Description & Quick Service Selection */}
                <div className="lg:col-span-5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-slate-500 lg:hidden">
                      Item Description & Scope
                    </label>
                    
                    {/* Quick apply saved service dropdown */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <select
                        aria-label="Select saved service preset"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleApplyServiceToRow(item.id, e.target.value);
                          }
                        }}
                        className="text-[11px] py-0.5 px-2 bg-white border border-slate-200 rounded text-slate-600 hover:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-200 cursor-pointer"
                      >
                        <option value="">Load Preset Service...</option>
                        {savedServices.map((srv) => (
                          <option key={srv.id} value={srv.name}>
                            {srv.name} ({currency.symbol}{srv.defaultPrice})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      id={`item-desc-${index}`}
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                      placeholder="e.g. UNIQUE ADDRESS, STATE FEE, or custom service..."
                      className="w-full text-xs sm:text-sm font-medium rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* State Fee Helper Bar if item is State Fee */}
                  {isStateFeeItem && (
                    <div className="relative flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        Select State:
                      </span>
                      
                      {/* Popular State Quick Chips */}
                      {['Texas', 'Colorado', 'Delaware', 'Wyoming', 'California', 'Florida'].map((stateName) => {
                        const feeOpt = US_STATE_FEES.find((s) => s.state === stateName);
                        if (!feeOpt) return null;
                        const isCurrentState = item.description.includes(stateName);

                        return (
                          <button
                            key={stateName}
                            type="button"
                            onClick={() => handleSelectStateForFee(item.id, feeOpt)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                              isCurrentState
                                ? 'bg-amber-600 text-white font-bold'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {stateName} (${feeOpt.fee})
                          </button>
                        );
                      })}

                      {/* All States Dropdown Trigger */}
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveStateDropdownRowId(
                              activeStateDropdownRowId === item.id ? null : item.id
                            )
                          }
                          className="px-1.5 py-0.5 bg-white border border-slate-300 hover:border-indigo-400 rounded text-[10px] font-medium text-slate-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>All 50 States</span>
                          <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                        </button>

                        {/* State selection popup */}
                        {activeStateDropdownRowId === item.id && (
                          <div className="absolute left-0 bottom-full mb-1 z-30 w-56 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg p-1 space-y-0.5 text-xs">
                            <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                              US State Filing Fees
                            </div>
                            {US_STATE_FEES.map((opt) => (
                              <button
                                key={opt.state}
                                type="button"
                                onClick={() => handleSelectStateForFee(item.id, opt)}
                                className="w-full px-2 py-1 rounded text-left flex items-center justify-between text-xs hover:bg-indigo-50 hover:text-indigo-700"
                              >
                                <span>{opt.state}</span>
                                <span className="font-mono-num font-semibold text-slate-500">
                                  ${opt.fee}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1 lg:hidden">
                    Qty / Hours
                  </label>
                  <input
                    type="number"
                    id={`item-qty-${index}`}
                    min="0.01"
                    step="any"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      handleUpdateItem(item.id, { quantity: Math.max(0, val) });
                    }}
                    placeholder="1"
                    className="w-full text-xs sm:text-sm font-mono-num rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 text-left lg:text-center focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Unit Price */}
                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1 lg:hidden">
                    Price ({currency.symbol})
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      id={`item-price-${index}`}
                      min="0"
                      step="any"
                      value={item.unitPrice === 0 ? '' : item.unitPrice}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        handleUpdateItem(item.id, { unitPrice: Math.max(0, val) });
                      }}
                      placeholder="0.00"
                      className="w-full text-xs sm:text-sm font-mono-num rounded-lg border border-slate-300 bg-white pl-7 pr-3 py-2 text-slate-900 text-right focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Calculated Amount */}
                <div className="lg:col-span-2 flex items-center justify-between lg:justify-end">
                  <span className="text-[11px] font-semibold text-slate-500 lg:hidden">
                    Calculated Amount:
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-mono-num text-slate-900">
                    {formatCurrency(rowAmount, currencyCode)}
                  </span>
                </div>

                {/* Row Actions */}
                <div className="lg:col-span-1 flex items-center justify-end gap-1 pt-2 lg:pt-0 border-t border-slate-200 lg:border-t-0">
                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveItem(index, 'up')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => handleMoveItem(index, 'down')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicateItem(item)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                    title="Duplicate item"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Line Item Button */}
        <button
          type="button"
          id="add-item-btn"
          onClick={handleAddEmptyItem}
          className="w-full py-3 px-4 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Line Item</span>
        </button>
      </div>

      {/* Modal: Customize Saved Services Default Rates */}
      {showManageServicesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Manage Default Service Rates</h4>
                  <p className="text-xs text-slate-500">Configure default prices when adding services</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManageServicesModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
              {editingServicesList.map((srv, idx) => (
                <div key={srv.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {srv.name}
                    </label>
                  </div>
                  <div className="w-28 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={srv.defaultPrice}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const copy = [...editingServicesList];
                        copy[idx] = { ...copy[idx], defaultPrice: val };
                        setEditingServicesList(copy);
                      }}
                      className="w-full text-xs font-mono-num font-semibold rounded border border-slate-300 bg-white pl-6 pr-2 py-1 text-right text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetServiceDefaults}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowManageServicesModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveServiceDefaults}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Save Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
