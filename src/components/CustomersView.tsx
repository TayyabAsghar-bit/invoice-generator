import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  FilePlus, 
  Building,
  UserCheck,
  X,
  Save
} from 'lucide-react';
import { SavedCustomer } from '../types';

interface CustomersViewProps {
  customers: SavedCustomer[];
  onSaveCustomer: (customer: Omit<SavedCustomer, 'id'> & { id?: string }) => void;
  onDeleteCustomer: (id: string) => void;
  onCreateInvoiceForCustomer: (customer: SavedCustomer) => void;
  onRequestConfirmDelete: (title: string, message: string, onConfirm: () => void) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onSaveCustomer,
  onDeleteCustomer,
  onCreateInvoiceForCustomer,
  onRequestConfirmDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<SavedCustomer | null>(null);

  // Form state
  const [formState, setFormState] = useState<Omit<SavedCustomer, 'id'>>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    zipCode: '',
  });

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormState({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: 'United States',
      zipCode: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: SavedCustomer) => {
    setEditingCustomer(customer);
    setFormState({
      name: customer.name,
      companyName: customer.companyName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      country: customer.country,
      zipCode: customer.zipCode,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() && !formState.companyName.trim()) {
      return;
    }

    onSaveCustomer({
      ...formState,
      id: editingCustomer ? editingCustomer.id : undefined,
    });
    setIsModalOpen(false);
  };

  const handleDelete = (customer: SavedCustomer) => {
    onRequestConfirmDelete(
      'Delete Customer?',
      `Are you sure you want to delete "${customer.name || customer.companyName}" from your saved customers?`,
      () => onDeleteCustomer(customer.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Saved Customers</h2>
            <p className="text-xs text-slate-500">
              {customers.length} client{customers.length === 1 ? '' : 's'} saved for instant auto-population
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customers List Grid / Cards */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {searchQuery ? 'No matching customers found' : 'No customers saved yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search keywords.'
              : 'Add your clients to save time when generating new corporate and business invoices.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Customer</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {cust.companyName
                        ? cust.companyName.charAt(0).toUpperCase()
                        : cust.name
                        ? cust.name.charAt(0).toUpperCase()
                        : 'C'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {cust.name || cust.companyName}
                      </h4>
                      {cust.companyName && cust.name && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 line-clamp-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {cust.companyName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cust)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cust)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  {cust.email && (
                    <div className="flex items-center gap-2 text-slate-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                  )}
                  {cust.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cust.phone}</span>
                    </div>
                  )}
                  {(cust.city || cust.state || cust.country) && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {[cust.city, cust.state, cust.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  {cust.createdAt ? `Added ${new Date(cust.createdAt).toLocaleDateString()}` : 'Saved'}
                </span>
                <button
                  type="button"
                  onClick={() => onCreateInvoiceForCustomer(cust)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Create Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </h3>
                  <p className="text-xs text-slate-500">Save client details for quick future invoice creation</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formState.companyName}
                    onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                    placeholder="e.g. Horizon Ventures Inc."
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="billing@client.com"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Street Address</label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  placeholder="Street address..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formState.city}
                    onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Prov</label>
                  <input
                    type="text"
                    value={formState.state}
                    onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP / Postal</label>
                  <input
                    type="text"
                    value={formState.zipCode}
                    onChange={(e) => setFormState({ ...formState, zipCode: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formState.country}
                    onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCustomer ? 'Update Customer' : 'Save Customer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
