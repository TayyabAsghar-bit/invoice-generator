import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  DollarSign, 
  RotateCcw, 
  MapPin, 
  Check, 
  X, 
  Save,
  Layers
} from 'lucide-react';
import { SavedService } from '../types';
import { US_STATE_FEES, DEFAULT_SERVICES } from '../data/servicesData';

interface ServicesViewProps {
  services: SavedService[];
  currencySymbol?: string;
  onSaveService: (service: Omit<SavedService, 'id'> & { id?: string }) => void;
  onDeleteService: (id: string) => void;
  onResetServicesToDefault: () => void;
  onRequestConfirmDelete: (title: string, message: string, onConfirm: () => void) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  currencySymbol = '$',
  onSaveService,
  onDeleteService,
  onResetServicesToDefault,
  onRequestConfirmDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<SavedService | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(50);
  const [formQty, setFormQty] = useState<number>(1);
  const [hasStateSelector, setHasStateSelector] = useState(false);
  const [selectedState, setSelectedState] = useState('DE');

  const filteredServices = services.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormName('');
    setFormDescription('');
    setFormPrice(50);
    setFormQty(1);
    setHasStateSelector(false);
    setSelectedState('DE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: SavedService) => {
    setEditingService(srv);
    setFormName(srv.name);
    setFormDescription(srv.description);
    setFormPrice(srv.defaultPrice);
    setFormQty(srv.defaultQty || 1);
    setHasStateSelector(Boolean(srv.hasStateSelector));
    setSelectedState(srv.state || 'DE');
    setIsModalOpen(true);
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    const foundState = US_STATE_FEES.find((s) => s.code === stateCode);
    if (foundState) {
      setFormPrice(foundState.fee);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    onSaveService({
      name: formName.trim().toUpperCase(),
      description: formDescription.trim(),
      defaultPrice: Number(formPrice) || 0,
      defaultQty: Number(formQty) || 1,
      hasStateSelector,
      state: hasStateSelector ? selectedState : undefined,
      fee: hasStateSelector ? Number(formPrice) : undefined,
      id: editingService ? editingService.id : undefined,
    });
    setIsModalOpen(false);
  };

  const handleDelete = (srv: SavedService) => {
    onRequestConfirmDelete(
      'Delete Service Item?',
      `Are you sure you want to remove "${srv.name}" from your service catalog?`,
      () => onDeleteService(srv.id)
    );
  };

  const handleResetDefaults = () => {
    onRequestConfirmDelete(
      'Reset Services to Factory Defaults?',
      'This will restore all default corporate services (Unique Address, State Fee, USA Number, Registered Agent, etc.) with their initial standard rates.',
      () => onResetServicesToDefault()
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Service Items & Catalog</h2>
            <p className="text-xs text-slate-500">
              Manage your default rates, descriptions, and state fee calculators
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Reset to Factory Defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No services found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'Try clearing your search query.' : 'Add your default services to easily add them to invoices.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                      {srv.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(srv)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(srv)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                  {srv.description || 'No detailed scope provided.'}
                </p>

                {srv.hasStateSelector && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200">
                    <MapPin className="w-3 h-3" />
                    <span>Dynamic 50-State Fee Matrix</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Default Rate</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {currencySymbol}
                  {srv.defaultPrice.toFixed(2)}
                  <span className="text-[11px] text-slate-400 font-normal ml-1">/ unit</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingService ? 'Edit Service Item' : 'Add New Service Item'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure default description and pricing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. REGISTERED AGENT"
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 uppercase font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scope & Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed description of deliverables..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Price ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Qty / Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formQty}
                    onChange={(e) => setFormQty(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* State Fee Matrix Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={hasStateSelector}
                    onChange={(e) => setHasStateSelector(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Enable 50 US State Filing Fee Selector</span>
                </label>

                {hasStateSelector && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                    <label className="block text-[11px] font-bold text-amber-800">
                      Default Initial State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full text-xs rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      {US_STATE_FEES.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.state} ({st.code}) — ${st.fee}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Update Service' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
