import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Percent, Award, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCheckout: () => void;
  onBackToCatalog: () => void;
  formatPrice: (amount: number) => string;
}

export const Cart: React.FC<CartProps> = ({ cart, setCart, onCheckout, onBackToCatalog, formatPrice }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      copy[index] = { ...copy[index], quantity: newQty };
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = couponCode.toUpperCase().trim();
    if (formatted === 'CLASSIC10') {
      setDiscountPercent(10);
      setCouponMessage('✓ Promo code applied! 10% discount subtracted from subtotal.');
    } else if (formatted === 'WORLDCUP26') {
      setDiscountPercent(15);
      setCouponMessage('✓ WORLD CUP 2026 Promo code applied! 15% discount subtracted from subtotal.');
    } else {
      setDiscountPercent(0);
      setCouponMessage('✗ Invalid promo code. Try CLASSIC10 or WORLDCUP26.');
    }
  };

  // Computations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const activeSubtotal = subtotal - discountAmount;
  const shippingCost = activeSubtotal >= 150 || activeSubtotal === 0 ? 0 : 15;
  const estTax = Math.round(activeSubtotal * 0.08); // 8% estimated VAT/Sales tax
  const grandTotal = activeSubtotal + shippingCost + estTax;

  const isEligibleForFreeShipping = activeSubtotal >= 150;
  const progressToFreeShipping = Math.min(100, Math.round((activeSubtotal / 150) * 100));

  if (cart.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16 text-center text-emerald-950 space-y-6">
        <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-xl">
          <ShoppingCart size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tight">Your Jersey Bag is Empty</h1>
          <p className="text-emerald-800 text-sm max-w-md mx-auto leading-relaxed">
            There are currently no vintage items inside your bag. Explore our historical collections and secure a piece of football legacy today.
          </p>
        </div>
        <button
          onClick={onBackToCatalog}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full cursor-pointer transition-all shadow-lg shadow-emerald-800/10"
        >
          Browse Our Collections
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white text-emerald-950 py-10 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      
      <div className="flex justify-between items-end border-b border-emerald-100 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-emerald-950">Shopping Bag</h1>
          <p className="text-xs text-emerald-600 font-mono">
            {cart.length} unique item{cart.length > 1 ? 's' : ''} • Checked & sanitized
          </p>
        </div>
        <button
          onClick={onBackToCatalog}
          className="text-xs text-emerald-700 hover:text-emerald-950 font-mono font-semibold uppercase cursor-pointer"
        >
          + Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Col: Cart Items list */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Tracker */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between items-center font-semibold">
              <span className="text-emerald-900">
                {isEligibleForFreeShipping
                  ? '✓ Congratulations! You qualify for Free Premium Sourced Shipping.'
                  : `Add ${formatPrice(150 - activeSubtotal)} more to unlock Free Premium Sourced Shipping`}
              </span>
              <span className="text-emerald-800 font-mono">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* List of items */}
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-emerald-100 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                {/* Product Detail Thumbnail and Info */}
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-emerald-50/50 rounded-xl p-2 flex items-center justify-center border border-emerald-100 relative flex-shrink-0">
                    <svg viewBox="0 0 200 240" className="w-full h-full">
                      <rect width="200" height="240" rx="10" fill="#f0fdf4" />
                      <circle cx="100" cy="120" r="50" fill="#047857" opacity="0.25" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase text-emerald-700 font-black">
                      {item.product.brand} • {item.product.season}
                    </span>
                    <h3 className="text-sm font-bold tracking-tight text-emerald-950 hover:text-emerald-700 cursor-pointer">
                      {item.product.name}
                    </h3>
                    
                    {/* Display customization details */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>
                      {item.customPrint && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-100">
                          Print: {item.customPrint.name} #{item.customPrint.number}
                        </span>
                      )}
                      {item.addBadge && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-100">
                          + Sleeve Badge
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing, Quantity adjustment, and Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  
                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-100 p-1.5 rounded-full text-emerald-950">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="p-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-full transition-all"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-xs font-mono font-bold px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="p-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-full transition-all"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-800">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-mono">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-emerald-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                    aria-label="Delete Item"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Checkout Order summary and Coupon box */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Code Entry */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-mono font-black text-emerald-800 uppercase tracking-widest">
              Offer Coupon Code
            </h4>
            <form onSubmit={applyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. WORLDCUP26"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-white border border-emerald-100 rounded-xl py-2 px-3 text-emerald-950 text-xs uppercase focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 text-white text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider font-bold cursor-pointer"
              >
                Apply
              </button>
            </form>
            {couponMessage && (
              <p className={`text-[10px] font-semibold leading-relaxed font-mono ${
                couponMessage.startsWith('✓') ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {couponMessage}
              </p>
            )}
            <div className="text-[10px] text-emerald-600 leading-relaxed font-medium">
              * Enter <span className="text-emerald-800 font-mono font-bold">CLASSIC10</span> to save 10% on your orders, or <span className="text-emerald-800 font-mono font-bold">WORLDCUP26</span> for 15% off.
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-mono font-black text-emerald-850 uppercase tracking-widest border-b border-emerald-100 pb-2">
              Order Pricing Summary
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-800">
              <div className="flex justify-between">
                <span>Original Subtotal:</span>
                <span className="text-emerald-950 font-mono">{formatPrice(subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({discountPercent}%):</span>
                  <span className="font-mono">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Curated Sourced Shipping:</span>
                <span className="text-emerald-950 font-mono">
                  {shippingCost === 0 ? <span className="text-emerald-700 font-bold uppercase">FREE</span> : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales VAT (8%):</span>
                <span className="text-emerald-950 font-mono">{formatPrice(estTax)}</span>
              </div>
              <div className="border-t border-emerald-100 pt-3 flex justify-between items-end text-sm">
                <span className="text-emerald-900 font-bold">Estimated Grand Total:</span>
                <span className="text-emerald-800 font-black text-xl font-mono">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/10 transition-all"
              id="proceed-to-checkout-btn"
            >
              Proceed to Secure Checkout <ArrowRight size={15} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-600 font-mono pt-2">
              <CreditCard size={12} className="text-emerald-700" />
              <span>Checkout processes are 256-bit encrypted</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
