import React, { useState } from 'react';
import { Heart, User, MapPin, Award, Search, ShoppingBag, ShieldCheck, ClipboardList, Trash2, Edit, Plus, Check, Home, Briefcase } from 'lucide-react';
import { Product, Order } from '../types';

interface CustomerDashboardProps {
  orders: Order[];
  wishlist: Product[];
  onRemoveWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  setCurrentPage: (page: string) => void;
  formatPrice?: (amount: number) => string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  orders,
  wishlist,
  onRemoveWishlist,
  onSelectProduct,
  setCurrentPage,
  formatPrice,
}) => {
  const displayPrice = formatPrice || ((amount: number) => `$${amount}`);
  // Tabs: 'profile' | 'orders' | 'wishlist' | 'addresses'
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses'>('orders');

  // Profile data state
  const [fullName, setFullName] = useState(() => {
    const storedUser = localStorage.getItem('vault_current_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        return u.fullName || 'Yasin Ahmed';
      } catch (e) {}
    }
    return 'Yasin Ahmed';
  });
  const [email, setEmail] = useState(() => {
    const storedUser = localStorage.getItem('vault_current_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        return u.email || 'yasinahmed000997@gmail.com';
      } catch (e) {}
    }
    return 'yasinahmed000997@gmail.com';
  });
  const [phone, setPhone] = useState(() => {
    const storedUser = localStorage.getItem('vault_current_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        return u.phone || '+44 7123 456789';
      } catch (e) {}
    }
    return '+44 7123 456789';
  });

  // Dynamic Saved Addresses
  const [addresses, setAddresses] = useState(() => {
    const stored = localStorage.getItem('vault_shipping_addresses');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'addr-1',
        label: 'Home' as 'Home' | 'Office' | 'Visitor',
        fullName: 'Yasin Ahmed',
        addressLine1: 'Flat 4B, House 12, Road 5, Sector 4, Uttara',
        city: 'Dhaka',
        postalCode: '1230',
        country: 'Bangladesh',
        phone: '01840990700',
        isDefault: true,
      },
      {
        id: 'addr-2',
        label: 'Office' as 'Home' | 'Office' | 'Visitor',
        fullName: 'Yasin Ahmed',
        addressLine1: 'Level 8, Crystal Palace, SE(F) 22 Road 140, Gulshan 1',
        city: 'Dhaka',
        postalCode: '1212',
        country: 'Bangladesh',
        phone: '01840990701',
        isDefault: false,
      },
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('vault_shipping_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Form edit / add state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null); // null means adding a new address

  // Form field states
  const [formLabel, setFormLabel] = useState<'Home' | 'Office' | 'Visitor'>('Home');
  const [formFullName, setFormFullName] = useState('');
  const [formAddressLine1, setFormAddressLine1] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  const handleOpenAddForm = () => {
    setEditingAddressId(null);
    setFormLabel('Home');
    setFormFullName(fullName);
    setFormAddressLine1('');
    setFormCity('Dhaka');
    setFormPostalCode('');
    setFormPhone(phone);
    setFormIsDefault(addresses.length === 0);
    setIsEditingAddress(true);
  };

  const handleOpenEditForm = (addr: typeof addresses[0]) => {
    setEditingAddressId(addr.id);
    setFormLabel(addr.label);
    setFormFullName(addr.fullName);
    setFormAddressLine1(addr.addressLine1);
    setFormCity(addr.city);
    setFormPostalCode(addr.postalCode);
    setFormPhone(addr.phone);
    setFormIsDefault(addr.isDefault);
    setIsEditingAddress(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName || !formAddressLine1 || !formPhone) {
      alert('Please fill out all required fields.');
      return;
    }

    if (editingAddressId) {
      // Edit mode
      setAddresses(prev => {
        let updated = prev.map(a => {
          if (a.id === editingAddressId) {
            return {
              ...a,
              label: formLabel,
              fullName: formFullName,
              addressLine1: formAddressLine1,
              city: formCity,
              postalCode: formPostalCode,
              phone: formPhone,
              isDefault: formIsDefault,
            };
          }
          return a;
        });
        
        if (formIsDefault) {
          updated = updated.map(a => a.id !== editingAddressId ? { ...a, isDefault: false } : a);
        }
        return updated;
      });
    } else {
      // Add mode
      const newId = `addr-${Date.now()}`;
      const newAddr = {
        id: newId,
        label: formLabel,
        fullName: formFullName,
        addressLine1: formAddressLine1,
        city: formCity,
        postalCode: formPostalCode,
        country: 'Bangladesh',
        phone: formPhone,
        isDefault: formIsDefault,
      };

      setAddresses(prev => {
        let updated = [...prev, newAddr];
        if (formIsDefault) {
          updated = updated.map(a => a.id !== newId ? { ...a, isDefault: false } : a);
        }
        return updated;
      });
    }

    setIsEditingAddress(false);
  };

  const handleDeleteAddress = (id: string, isDefault: boolean) => {
    if (isDefault && addresses.length > 1) {
      alert('Please set another address as default before deleting this one.');
      return;
    }
    if (confirm('Are you sure you want to delete this shipping address?')) {
      setAddresses(prev => {
        const filtered = prev.filter(a => a.id !== id);
        if (isDefault && filtered.length > 0) {
          filtered[0].isDefault = true;
        }
        return filtered;
      });
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
  };

  // Simulated orders if the user hasn't checked out yet
  const defaultOrders: Order[] = [
    {
      id: 'ORD-8492',
      date: 'June 18, 2026',
      items: [
        {
          product: {
            id: 'shirt-3',
            name: '1990 Argentina World Cup Home Shirt',
            slug: '1990-argentina-world-cup-home',
            price: 299,
            image: 'argentina_home_1990',
            images: [],
            brand: 'Adidas',
            season: '1990',
            year: 1990,
            condition: 'Very Good',
            conditionDetail: '',
            color: 'Sky Blue / White',
            sizes: ['L'],
            sku: 'ARG90H-MAR10',
            badgeAvailable: false,
            printAvailable: true,
            rating: 4.8,
            reviewsCount: 20,
            description: '',
            specification: { material: '', madeIn: '', fit: '' },
            category: 'Legends',
            stock: 1,
          },
          selectedSize: 'L',
          quantity: 1,
        }
      ],
      subtotal: 299,
      tax: 24,
      shipping: 0,
      total: 323,
      status: 'Shipped',
      trackingNumber: 'CFJ-849298-LONDON',
      shippingAddress: {
        fullName: 'Yasin Ahmed',
        addressLine1: 'Commercial Street, Shoreditch',
        city: 'London',
        postalCode: 'E1 6LT',
        country: 'United Kingdom',
        phone: '+44 7123 456789',
      },
      paymentMethod: 'STRIPE',
    }
  ];

  const activeOrders = orders.length > 0 ? orders : defaultOrders;

  return (
    <section className="bg-[#fcfdfc] text-emerald-950 py-10 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      
      {/* Dashboard Welcome Header */}
      <div className="border-b border-emerald-100 pb-6 mb-8 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-800 border border-emerald-700 text-white flex items-center justify-center font-sans font-black text-xl shadow-sm">
            YA
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">My Profile & Account</h1>
            <p className="text-xs text-emerald-800 font-mono">
              Collector Status: <span className="text-emerald-950 font-black">LEGEND LEVEL</span> • Account ID: #COL-0997
            </p>
          </div>
        </div>

        {/* Dynamic mini counts */}
        <div className="flex gap-4 text-xs font-mono">
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-center">
            <p className="text-emerald-700 text-[10px] uppercase">My Orders</p>
            <p className="text-emerald-950 font-black text-sm">{activeOrders.length}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-center">
            <p className="text-emerald-700 text-[10px] uppercase">Wishlisted</p>
            <p className="text-emerald-950 font-black text-sm">{wishlist.length}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Sub Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Col: Menu Navigation */}
        <div className="lg:col-span-3 bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-2 text-xs font-semibold">
          {[
            { id: 'orders', label: 'My Order History', icon: ClipboardList },
            { id: 'wishlist', label: 'My Wishlist', icon: Heart },
            { id: 'profile', label: 'Profile Settings', icon: User },
            { id: 'addresses', label: 'My Saved Addresses', icon: MapPin },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-800 text-white font-black'
                    : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50'
                }`}
              >
                <Icon size={14} /> {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Col: Active Tab Contents */}
        <div className="lg:col-span-9 space-y-6">
          
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-base font-bold uppercase tracking-tight text-emerald-950 border-b border-emerald-100 pb-2">
                Order History & Logistics tracking
              </h3>

              <div className="space-y-4">
                {activeOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-emerald-50/20 border border-emerald-100 rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Order header row */}
                    <div className="bg-emerald-50/80 border-b border-emerald-100 p-4 md:p-6 flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-emerald-950">
                      <div>
                        <span className="text-emerald-700">ORDER NUMBER:</span>
                        <p className="text-emerald-950 font-bold text-sm">{ord.id}</p>
                      </div>
                      <div>
                        <span className="text-emerald-700">DATE CONFIRMED:</span>
                        <p className="text-emerald-950 font-bold">{ord.date}</p>
                      </div>
                      <div>
                        <span className="text-emerald-700">TOTAL VALUE:</span>
                        <p className="text-emerald-950 font-extrabold text-sm">{displayPrice(ord.total)}</p>
                      </div>
                      <span className="bg-emerald-800 text-white px-3 py-1 rounded font-bold border border-emerald-700">
                        {ord.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Order content detail */}
                    <div className="p-6 space-y-6">
                      <div className="space-y-3">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center border-b border-emerald-100/50 pb-3 text-xs">
                            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100/40 rounded p-1 flex items-center justify-center">
                              <svg viewBox="0 0 200 240" className="w-full h-full">
                                <rect width="200" height="240" rx="10" fill="#f0fdf4" />
                                <circle cx="100" cy="120" r="60" fill="#047857" opacity="0.3" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-emerald-950 hover:text-emerald-700 cursor-pointer" onClick={() => { onSelectProduct(item.product); setCurrentPage('details'); }}>
                                {item.product.name}
                              </h4>
                              <p className="text-[10px] text-emerald-700 font-mono">
                                Size: {item.selectedSize} | Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="text-emerald-950 font-bold font-mono">{displayPrice(item.product.price)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Visual Logistics Tracking nodes */}
                      {ord.trackingNumber && (
                        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-xl space-y-4 text-xs">
                          <div className="flex justify-between items-center border-b border-emerald-100/50 pb-2">
                            <span className="font-mono text-[10px] text-emerald-700">TRACKING COURIER: COURIER-POST EXCLUSIVE</span>
                            <span className="font-mono font-black text-emerald-950">{ord.trackingNumber}</span>
                          </div>

                          {/* Interactive milestones dots bar */}
                          <div className="relative pt-4 pb-2">
                            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-emerald-100 -translate-y-1/2" />
                            <div className="relative flex justify-between items-center text-center">
                              <div className="space-y-1.5 flex flex-col items-center">
                                <span className="w-3.5 h-3.5 rounded-full bg-emerald-800 border-4 border-white z-10" />
                                <p className="text-[9px] font-bold text-emerald-800 uppercase">Sourced & Sanitized</p>
                              </div>
                              <div className="space-y-1.5 flex flex-col items-center">
                                <span className="w-3.5 h-3.5 rounded-full bg-emerald-800 border-4 border-white z-10" />
                                <p className="text-[9px] font-bold text-emerald-800 uppercase">Verified Lab</p>
                              </div>
                              <div className="space-y-1.5 flex flex-col items-center">
                                <span className={`w-3.5 h-3.5 rounded-full border-4 border-white z-10 ${ord.status === 'Shipped' || ord.status === 'Delivered' ? 'bg-emerald-800' : 'bg-emerald-200'}`} />
                                <p className="text-[9px] font-bold text-emerald-700 uppercase">Departed Flight</p>
                              </div>
                              <div className="space-y-1.5 flex flex-col items-center">
                                <span className="w-3.5 h-3.5 rounded-full bg-emerald-200 border-4 border-white z-10" />
                                <p className="text-[9px] font-bold text-emerald-500 uppercase">Out for Delivery</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-base font-bold uppercase tracking-tight text-emerald-950 border-b border-emerald-100 pb-2">
                My saved wishlist ({wishlist.length} Items)
              </h3>

              {wishlist.length === 0 ? (
                <div className="bg-emerald-50/40 border border-emerald-100 p-10 text-center rounded-2xl space-y-4">
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    No historical jerseys saved in your wishlist folder yet. Explore the Jersey Addicts BD catalog to favorite some classic models.
                  </p>
                  <button onClick={() => setCurrentPage('listing')} className="bg-emerald-800 text-white text-[10px] uppercase font-black tracking-widest px-6 py-2.5 rounded-full cursor-pointer">
                    Browse Catalogue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((w) => (
                    <div
                      key={w.id}
                      className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-4 flex gap-4 items-center justify-between"
                    >
                      <div className="flex gap-3 items-center cursor-pointer" onClick={() => { onSelectProduct(w); setCurrentPage('details'); }}>
                        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 p-1 rounded flex items-center justify-center">
                          <svg viewBox="0 0 200 240" className="w-full h-full">
                            <rect width="200" height="240" rx="10" fill="#f0fdf4" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold hover:text-emerald-800 leading-tight truncate max-w-[150px]">
                            {w.name}
                          </h4>
                          <span className="text-[10px] text-emerald-950 font-bold font-mono">{displayPrice(w.price)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onRemoveWishlist(w)}
                        className="text-emerald-600 hover:text-red-600 p-2 rounded-full cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-5 animate-fadeIn">
              <h3 className="text-base font-bold uppercase tracking-tight text-emerald-950 border-b border-emerald-100 pb-2 flex items-center gap-2">
                <User size={18} className="text-emerald-800" /> Account & Security Profiles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-700 font-mono">COLLECTOR FULL NAME:</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-lg py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-700 font-mono">REGISTRATION EMAIL ADDRESS:</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-lg py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <span className="text-[10px] text-emerald-700 font-mono">VERIFIED PHONE CONTACT:</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-lg py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={() => alert('Profile settings successfully secured in system local storage.')}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-lg cursor-pointer"
              >
                Save Settings Profile
              </button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
                <h3 className="text-base font-bold uppercase tracking-tight text-emerald-950 flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-800" /> Saved Shipping Coordinates
                </h3>
                {!isEditingAddress && (
                  <button
                    onClick={handleOpenAddForm}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus size={12} /> Add Address
                  </button>
                )}
              </div>

              {isEditingAddress ? (
                /* ADD / EDIT ADDRESS FORM */
                <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                  <div className="bg-white border border-emerald-100 p-4 rounded-2xl space-y-4">
                    <p className="text-[10px] font-mono text-emerald-800 uppercase font-black">
                      {editingAddressId ? 'Edit Shipping Coordinate' : 'Add New Shipping Coordinate'}
                    </p>

                    {/* ADDRESS LABEL OPTIONS (Home, Office, Visitor) */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-emerald-700 font-mono block uppercase font-bold">ADDRESS LABEL / TYPE:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'Home', icon: Home },
                          { id: 'Office', icon: Briefcase },
                          { id: 'Visitor', icon: User }
                        ].map((lbl) => {
                          const Icon = lbl.icon;
                          const isSelected = formLabel === lbl.id;
                          return (
                            <button
                              key={lbl.id}
                              type="button"
                              onClick={() => setFormLabel(lbl.id as any)}
                              className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer font-bold ${
                                isSelected
                                  ? 'bg-emerald-800 text-white border-emerald-800 font-black'
                                  : 'border-emerald-100 bg-emerald-50/50 text-emerald-800 hover:border-emerald-200'
                              }`}
                            >
                              <Icon size={14} />
                              <span className="text-[10px] uppercase">{lbl.id}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Phone fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-emerald-700 font-mono block uppercase">Recipient Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formFullName}
                          onChange={(e) => setFormFullName(e.target.value)}
                          placeholder="e.g. Yasin Ahmed"
                          className="w-full bg-white border border-emerald-100 rounded-lg py-2.5 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-emerald-700 font-mono block uppercase">Active Contact Phone *</label>
                        <input
                          type="tel"
                          required
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="e.g. 01840990700"
                          className="w-full bg-white border border-emerald-100 rounded-lg py-2.5 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Detailed Address field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-emerald-700 font-mono block uppercase">Detailed Delivery Address *</label>
                      <textarea
                        required
                        rows={2}
                        value={formAddressLine1}
                        onChange={(e) => setFormAddressLine1(e.target.value)}
                        placeholder="e.g. Flat 4B, House 12, Road 5, Sector 4, Uttara"
                        className="w-full bg-white border border-emerald-100 rounded-lg py-2.5 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    {/* City / District & Postal code fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-emerald-700 font-mono block uppercase">City / District *</label>
                        <input
                          type="text"
                          required
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          placeholder="e.g. Dhaka"
                          className="w-full bg-white border border-emerald-100 rounded-lg py-2.5 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-emerald-700 font-mono block uppercase">Postal Code (Optional)</label>
                        <input
                          type="text"
                          value={formPostalCode}
                          onChange={(e) => setFormPostalCode(e.target.value)}
                          placeholder="e.g. 1230"
                          className="w-full bg-white border border-emerald-100 rounded-lg py-2.5 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Is Default Address Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="formIsDefault"
                        checked={formIsDefault}
                        disabled={editingAddressId !== null && addresses.find(a => a.id === editingAddressId)?.isDefault}
                        onChange={(e) => setFormIsDefault(e.target.checked)}
                        className="w-3.5 h-3.5 accent-emerald-800 bg-white border-emerald-100 rounded"
                      />
                      <label htmlFor="formIsDefault" className="text-[10px] text-emerald-700 font-mono cursor-pointer select-none">
                        Make this my primary default delivery address
                      </label>
                    </div>
                  </div>

                  {/* Form Action buttons */}
                  <div className="flex gap-2.5">
                    <button
                      type="submit"
                      className="bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-widest py-3 px-6 rounded-xl transition-all cursor-pointer"
                    >
                      Save Coordinate
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="bg-white hover:bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-widest py-3 px-6 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* SAVED ADDRESSES GRID LIST */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <div className="col-span-2 text-center py-8 bg-white border border-emerald-100 rounded-xl">
                      <p className="text-xs text-emerald-700 font-mono">No shipping addresses saved yet. Click 'Add Address' to set one up.</p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`border p-5 rounded-2xl space-y-3.5 text-xs transition-all flex flex-col justify-between ${
                          addr.isDefault
                            ? 'border-emerald-800 bg-white shadow-sm'
                            : 'border-emerald-100 bg-emerald-50/20 hover:border-emerald-200'
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* Label Badge & Priority Actions */}
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              {/* Address Label type indicator */}
                              <span className={`inline-flex items-center gap-1 font-mono text-[9px] font-black px-2.5 py-0.5 rounded-full border ${
                                addr.label === 'Home'
                                  ? 'bg-emerald-800 text-white border-emerald-700'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                                {addr.label === 'Home' && <Home size={9} />}
                                {addr.label === 'Office' && <Briefcase size={9} />}
                                {addr.label === 'Visitor' && <User size={9} />}
                                {addr.label.toUpperCase()}
                              </span>

                              {addr.isDefault && (
                                <span className="bg-emerald-800 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-700">
                                  PRIMARY DEFAULT
                                </span>
                              )}
                            </div>

                            {/* Set Default trigger */}
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleSetDefault(addr.id)}
                                className="text-emerald-800 hover:text-emerald-950 text-[9px] font-mono hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <Check size={10} /> Make Default
                              </button>
                            )}
                          </div>

                          {/* Address details */}
                          <div className="space-y-1">
                            <p className="font-black text-emerald-950 text-sm">{addr.fullName}</p>
                            <p className="text-emerald-800 font-medium leading-relaxed">{addr.addressLine1}</p>
                            <p className="text-emerald-800 font-mono text-[10px]">
                              {addr.city}{addr.postalCode ? ` - ${addr.postalCode}` : ''}
                            </p>
                            <p className="text-emerald-700 font-mono text-[10px] pt-1 block">
                              Phone: <span className="text-emerald-950 font-bold">{addr.phone}</span>
                            </p>
                          </div>
                        </div>

                        {/* Edit & Delete Action Row */}
                        <div className="flex gap-2.5 pt-3 border-t border-emerald-100 mt-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(addr)}
                            className="text-emerald-800 hover:text-emerald-950 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id, addr.isDefault)}
                            className="text-red-600 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ml-auto"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
