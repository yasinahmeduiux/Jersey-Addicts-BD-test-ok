import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Truck, ClipboardCheck, Sparkles, AlertCircle, MapPin, Phone, CheckCircle, Info, Home, Briefcase, User, Save, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem, Order, AppConfig } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSuccess: (order: Order) => void;
  onBackToCart: () => void;
  onBackToCatalog: () => void;
  formatPrice: (amount: number) => string;
  appConfig: AppConfig;
}

export const Checkout: React.FC<CheckoutProps> = ({
  cart,
  setCart,
  onOrderSuccess,
  onBackToCart,
  onBackToCatalog,
  formatPrice,
  appConfig,
}) => {
  // Empty Cart Safe Guard
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-6 bg-white border-2 border-zinc-200 p-8 rounded-3xl text-zinc-950 shadow-lg animate-fadeIn">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-500 border border-zinc-200">
          <ShoppingBag size={28} />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight text-black">Your Order Bag is Empty</h3>
        <p className="text-xs text-zinc-700 font-mono">You do not have any vintage shirts in your checkout session. Return to the catalog to select legendary items.</p>
        <button
          onClick={onBackToCatalog}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState(appConfig.logoSubtext?.includes('DHAKA') ? 'Dhaka' : '');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Delivery Region (Inside Dhaka: 70 TK, Outside Dhaka: 130 TK)
  const [deliveryRegion, setDeliveryRegion] = useState<'inside' | 'outside'>('inside');

  // Saved Shipping Coordinates for One-Click suggest
  const [savedAddresses, setSavedAddresses] = useState(() => {
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
        label: 'Home',
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
        label: 'Office',
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

  const [saveThisAddress, setSaveThisAddress] = useState(false);
  const [saveLabel, setSaveLabel] = useState<'Home' | 'Office' | 'Visitor'>('Home');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const handleSelectAddress = (addr: any) => {
    setFullName(addr.fullName);
    setAddressLine1(addr.addressLine1);
    setCity(addr.city || 'Dhaka');
    setPostalCode(addr.postalCode || '');
    setPhone(addr.phone);
    if (addr.city && addr.city.toLowerCase().includes('dhaka')) {
      setDeliveryRegion('inside');
    } else {
      setDeliveryRegion('outside');
    }
  };

  const handleSaveCurrentAddress = () => {
    if (!fullName || !addressLine1 || !phone) {
      alert('Please fill out Recipient Full Name, Address, and Phone first before saving.');
      return;
    }
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: saveLabel,
      fullName,
      addressLine1,
      city: city || 'Dhaka',
      postalCode: postalCode || '',
      country: 'Bangladesh',
      phone,
      isDefault: savedAddresses.length === 0,
    };
    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    localStorage.setItem('vault_shipping_addresses', JSON.stringify(updated));
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Delivery Charge in BDT
  const deliveryChargeBDT = deliveryRegion === 'inside' ? 70 : 130;
  
  // Convert BDT charge to base currency (USD) using the active exchangeRate
  const exchangeRate = appConfig.exchangeRate || 115;
  const shippingCostBase = deliveryChargeBDT / exchangeRate;
  
  // Grand total in base currency (USD)
  const grandTotal = subtotal + shippingCostBase;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !addressLine1 || !phone) {
      alert('Please fill out all the required fields for secure delivery.');
      return;
    }

    if (phone.length < 10) {
      alert('Please enter a valid active phone number.');
      return;
    }

    // Create a robust local Order object with CASH ON DELIVERY paymentMethod
    const trackingID = `CFJ-COD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      createdAt: new Date().toISOString(),
      deliveryRegion,
      deliveryCharge: deliveryChargeBDT,
      items: [...cart],
      subtotal,
      tax: 0,
      shipping: shippingCostBase,
      total: grandTotal,
      status: 'Processing',
      trackingNumber: trackingID,
      shippingAddress: {
        fullName,
        addressLine1,
        city: city || (deliveryRegion === 'inside' ? 'Dhaka' : 'Outside Dhaka'),
        postalCode: postalCode || 'N/A',
        country: 'Bangladesh',
        phone,
      },
      paymentMethod: 'CASH ON DELIVERY',
    };

    if (saveThisAddress) {
      const isDuplicate = savedAddresses.some(
        (a: any) => a.addressLine1.toLowerCase().trim() === addressLine1.toLowerCase().trim()
      );
      if (!isDuplicate) {
        const newAddr = {
          id: `addr-${Date.now()}`,
          label: saveLabel,
          fullName,
          addressLine1,
          city: city || 'Dhaka',
          postalCode: postalCode || 'N/A',
          country: 'Bangladesh',
          phone,
          isDefault: savedAddresses.length === 0,
        };
        const updated = [...savedAddresses, newAddr];
        localStorage.setItem('vault_shipping_addresses', JSON.stringify(updated));
      }
    }

    onOrderSuccess(newOrder);
    setCart([]); // Clear the shopping cart
  };

  return (
    <section className="bg-white text-emerald-950 py-8 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      
      {/* Navigation Back Link */}
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono font-bold tracking-wider text-emerald-850 hover:text-emerald-950 uppercase mb-6 cursor-pointer transition-all"
        id="checkout-back-to-cart"
      >
        <ArrowLeft size={14} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form & Options */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          
          {/* Header Title */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black font-display">
              Place Cash on Delivery Order
            </h1>
            <p className="text-xs text-zinc-800 font-mono font-medium">
              Fill in your active address and phone number. No advance payment required!
            </p>
          </div>

          {/* Section 1: Personal Contact Details */}
          <div className="bg-white border-2 border-zinc-300 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl text-black">
            <h3 className="text-xs md:text-sm font-mono font-black text-black uppercase tracking-widest border-b-2 border-zinc-200 pb-2.5 flex items-center gap-2">
              <ClipboardCheck size={16} className="text-emerald-700" /> 1. Contact Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-950 font-mono font-black block tracking-wider">RECIPIENT FULL NAME *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yasin Ahmed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-zinc-300 focus:border-emerald-600 focus:bg-white rounded-xl py-3 px-4 text-xs font-bold focus:outline-none transition-colors text-black placeholder-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-950 font-mono font-black block tracking-wider">MOBILE PHONE NUMBER *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01840990700"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border-2 border-zinc-300 focus:border-emerald-600 focus:bg-white rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors font-mono font-bold text-black placeholder-zinc-400"
                  />
                </div>
                <span className="text-[10px] text-zinc-700 font-mono block font-medium">We will call this number before delivery to verify.</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] text-zinc-950 font-mono font-black block tracking-wider">EMAIL ADDRESS (OPTIONAL)</label>
              <input
                type="email"
                placeholder="e.g. collector@vault.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border-2 border-zinc-300 focus:border-emerald-600 focus:bg-white rounded-xl py-3 px-4 text-xs font-bold focus:outline-none transition-colors text-black placeholder-zinc-400"
              />
            </div>
          </div>

          {/* Section 2: Delivery Address Details */}
          <div className="bg-white border-2 border-zinc-300 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl text-black">
            <h3 className="text-xs md:text-sm font-mono font-black text-black uppercase tracking-widest border-b-2 border-zinc-200 pb-2.5 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-700" /> 2. Delivery Address
            </h3>

            {/* SAVED ADDRESSES QUICK SUGGESTIONS GRID */}
            {savedAddresses.length > 0 && (
              <div className="bg-zinc-50 border-2 border-zinc-200 p-4 rounded-xl space-y-2.5">
                <span className="text-[10px] text-black font-mono font-black uppercase tracking-wider block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> 
                  ONE-CLICK SUGGESTIONS (SAVED ADDRESSES):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {savedAddresses.map((addr: any) => (
                    <button
                      type="button"
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className="text-left bg-white hover:bg-zinc-100 border-2 border-zinc-200 hover:border-black p-3.5 rounded-xl text-xs transition-all cursor-pointer flex flex-col justify-between shadow-xs"
                    >
                      <div className="flex justify-between items-center gap-2 mb-1.5">
                        <span className="bg-emerald-100 text-emerald-900 text-[9px] font-mono px-2 py-0.5 rounded-md uppercase font-black border border-emerald-300">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-emerald-800 font-mono text-[9px] font-black tracking-wide">PRIMARY</span>
                        )}
                      </div>
                      <p className="font-extrabold text-black truncate">{addr.fullName}</p>
                      <p className="text-zinc-800 text-[11px] font-medium truncate leading-tight mt-0.5">{addr.addressLine1}</p>
                      <p className="text-[10px] font-mono text-zinc-900 mt-1 font-bold">Phone: {addr.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-950 font-mono font-black block tracking-wider">FULL DETAILED ADDRESS (House, Flat, Road, Area) *</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Flat 4B, House 12, Road 5, Sector 4, Uttara, Dhaka"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full bg-zinc-50 border-2 border-zinc-300 focus:border-emerald-600 focus:bg-white rounded-xl py-3 px-4 text-xs font-bold focus:outline-none transition-colors resize-none leading-relaxed text-black placeholder-zinc-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-950 font-mono font-black block tracking-wider">CITY / DISTRICT</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-300 focus:border-emerald-600 focus:bg-white rounded-xl py-3 px-4 text-xs font-bold focus:outline-none transition-colors text-black placeholder-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-950 font-mono font-black block tracking-wider">POSTAL CODE (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. 1230"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-300 focus:border-emerald-600 focus:bg-white rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors font-mono font-bold text-black placeholder-zinc-400"
                />
              </div>
            </div>

            {/* OPTION TO SAVE CURRENT ADDRESS */}
            <div className="bg-zinc-50 border-2 border-zinc-200 p-4 rounded-xl space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="checkoutSaveThisAddress"
                  checked={saveThisAddress}
                  onChange={(e) => setSaveThisAddress(e.target.checked)}
                  className="w-3.5 h-3.5 accent-emerald-600 bg-white rounded border-zinc-300 cursor-pointer"
                />
                <label htmlFor="checkoutSaveThisAddress" className="text-[11px] text-zinc-950 font-black cursor-pointer select-none">
                  Save this address for future checkout suggestions
                </label>
              </div>

              <div className="space-y-3 pl-5 sm:pl-6 border-l-2 border-zinc-300 transition-all">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-900 font-mono font-bold block uppercase">ADDRESS LABEL:</span>
                  <div className="flex gap-2">
                    {['Home', 'Office', 'Visitor'].map((lbl) => {
                      const isSelected = saveLabel === lbl;
                      return (
                        <button
                          type="button"
                          key={lbl}
                          onClick={() => setSaveLabel(lbl as any)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-black text-white border-black'
                              : 'bg-white border-zinc-300 text-black hover:border-black'
                          }`}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveCurrentAddress}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <Save size={10} /> Save Address Now
                  </button>
                  {saveSuccessMsg && (
                    <span className="text-[10px] text-emerald-800 font-mono font-bold animate-fadeIn">✓ Saved successfully</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Localization Shipping Cost Selection */}
          <div className="bg-white border-2 border-zinc-300 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl text-black">
            <h3 className="text-xs md:text-sm font-mono font-black text-black uppercase tracking-widest border-b-2 border-zinc-200 pb-2.5 flex items-center gap-2">
              <Truck size={16} className="text-emerald-700" /> 3. Select Delivery Area
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Inside Dhaka Area */}
              <div
                onClick={() => setDeliveryRegion('inside')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                  deliveryRegion === 'inside'
                    ? 'bg-zinc-50 border-emerald-600 text-black shadow-lg'
                    : 'bg-white border-zinc-300 text-zinc-800 hover:border-black'
                }`}
                id="shipping-inside-dhaka"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${deliveryRegion === 'inside' ? 'border-emerald-600' : 'border-zinc-400'}`}>
                      {deliveryRegion === 'inside' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </span>
                    <p className="text-xs font-black uppercase tracking-wider text-black">Inside Dhaka</p>
                  </div>
                  <p className="text-[10px] text-zinc-700 font-medium leading-normal">Fast doorstep delivery within 24-48 hours inside capital limits.</p>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="text-sm font-mono font-black text-black">৳70</span>
                  <p className="text-[9px] text-zinc-600 font-mono font-bold">fee</p>
                </div>
              </div>

              {/* Outside Dhaka Area */}
              <div
                onClick={() => setDeliveryRegion('outside')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                  deliveryRegion === 'outside'
                    ? 'bg-zinc-50 border-emerald-600 text-black shadow-lg'
                    : 'bg-white border-zinc-300 text-zinc-800 hover:border-black'
                }`}
                id="shipping-outside-dhaka"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${deliveryRegion === 'outside' ? 'border-emerald-600' : 'border-zinc-400'}`}>
                      {deliveryRegion === 'outside' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </span>
                    <p className="text-xs font-black uppercase tracking-wider text-black">Outside Dhaka</p>
                  </div>
                  <p className="text-[10px] text-zinc-700 font-medium leading-normal">Standard courier service to all districts across Bangladesh (2-4 days).</p>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="text-sm font-mono font-black text-black">৳130</span>
                  <p className="text-[9px] text-zinc-600 font-mono font-bold">fee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Pure Cash on Delivery Payment Option */}
          <div className="bg-white border-2 border-zinc-300 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl text-black">
            <h3 className="text-xs md:text-sm font-mono font-black text-black uppercase tracking-widest border-b-2 border-zinc-200 pb-2.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700" /> 4. Order Verification
            </h3>

            <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-4 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-black uppercase tracking-wider">CASH ON DELIVERY (COD) SELECTED</h4>
                <p className="text-[11px] text-zinc-800 leading-relaxed font-medium">
                  You will pay the full amount of <span className="text-black font-extrabold font-mono">{formatPrice(grandTotal)}</span> directly to the delivery agent in cash when they bring the jersey package to your door. There are no advanced card charges.
                </p>
              </div>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs md:text-sm uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] transition-all"
            id="checkout-submit-btn"
          >
            <ShieldCheck size={16} /> Place Cash on Delivery Order ({formatPrice(grandTotal)})
          </button>

        </form>

        {/* Right Column: Mini Sticky Order Summary */}
        <div className="lg:col-span-4 bg-white border-2 border-zinc-300 rounded-2xl p-4 md:p-6 space-y-5 sticky top-28 text-black shadow-xl">
          <h4 className="text-xs font-mono font-black text-black uppercase tracking-widest border-b-2 border-zinc-200 pb-2.5 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="bg-black text-white text-[9px] px-2.5 py-0.5 rounded-full font-mono font-black">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
            </span>
          </h4>

          {/* Items Checklist */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {cart.map((item, idx) => {
              // Extract sizes available for the product, or default to S/M/L/XL/XXL
              const sizes = item.product.sizes && item.product.sizes.length > 0 
                ? item.product.sizes 
                : ['S', 'M', 'L', 'XL', 'XXL'];

              return (
                <div key={idx} className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-3 space-y-3 shadow-xs relative group">
                  <div className="flex gap-3 text-xs">
                    {/* Image */}
                    <div className="w-12 h-12 bg-white border border-zinc-300 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                      {item.product.uploadedImage ? (
                        <img src={item.product.uploadedImage} alt={item.product.name} className="w-full h-full object-contain filter drop-shadow" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500">Jersey</span>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="font-extrabold text-black truncate leading-tight" title={item.product.name}>{item.product.name}</p>
                      <p className="text-[10px] font-mono text-zinc-700 mt-1 font-bold">Unit: {formatPrice(item.product.price)}</p>
                    </div>

                    {/* Delete Icon */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = cart.filter((_, i) => i !== idx);
                        setCart(updated);
                      }}
                      className="absolute top-2.5 right-2.5 p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Size and Qty Controls Row */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200 text-xs">
                    {/* Size Selector */}
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono text-zinc-600 font-black uppercase">Size:</span>
                      <select
                        value={item.selectedSize}
                        onChange={(e) => {
                          const newSize = e.target.value;
                          setCart(prev => prev.map((itemVal, i) => i === idx ? { ...itemVal, selectedSize: newSize } : itemVal));
                        }}
                        className="bg-white border-2 border-zinc-300 text-black text-[11px] font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        {sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity Selector with increment and decrement buttons */}
                    <div className="flex items-center gap-1 bg-zinc-200/60 rounded-lg p-0.5 border border-zinc-300">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity > 1) {
                            setCart(prev => prev.map((itemVal, i) => i === idx ? { ...itemVal, quantity: itemVal.quantity - 1 } : itemVal));
                          } else {
                            // If quantity is 1, decrement deletes the item
                            const updated = cart.filter((_, i) => i !== idx);
                            setCart(updated);
                          }
                        }}
                        className="w-5 h-5 flex items-center justify-center text-zinc-700 hover:text-black font-black bg-white rounded shadow-xs cursor-pointer text-xs"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-mono font-black text-black text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCart(prev => prev.map((itemVal, i) => i === idx ? { ...itemVal, quantity: itemVal.quantity + 1 } : itemVal));
                        }}
                        className="w-5 h-5 flex items-center justify-center text-zinc-700 hover:text-black font-black bg-white rounded shadow-xs cursor-pointer text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal per item */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-700 pt-1 font-bold">
                    <span>Subtotal:</span>
                    <span className="font-extrabold text-black">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals Section */}
          <div className="space-y-2.5 text-xs text-zinc-900 border-t-2 border-zinc-200 pt-4 font-medium">
            <div className="flex justify-between items-center">
              <span>Items Subtotal:</span>
              <span className="text-black font-mono font-extrabold">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Delivery Charge ({deliveryRegion === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
              <span className="text-black font-extrabold font-mono">৳{deliveryChargeBDT}</span>
            </div>

            <div className="border-t-2 border-zinc-200 pt-4 flex justify-between items-baseline">
              <span className="text-zinc-950 font-black uppercase text-[10px] tracking-wider">Grand Total to Pay:</span>
              <span className="text-black font-black text-xl font-mono">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="bg-zinc-50 border-2 border-zinc-200 p-4 rounded-xl text-[10px] text-zinc-800 flex gap-2.5">
            <Info size={14} className="text-emerald-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">
              Every package is chemically sanitized and sealed inside historical vacuum-sealed cases with certificates of origin. Sourced for real fans.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};
