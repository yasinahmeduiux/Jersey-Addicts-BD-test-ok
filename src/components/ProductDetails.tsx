import React, { useState } from 'react';
import { Heart, Share2, Star, CheckCircle, ShieldAlert, BadgeCheck, ShoppingCart, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product, CartItem } from '../types';
import { JerseyRenderer } from './JerseyRenderer';

interface ProductDetailsProps {
  product: Product;
  onBackToCatalog: () => void;
  onAddToCart: (item: CartItem) => void;
  onAddToWishlist: (product: Product) => void;
  isWishlisted: boolean;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  formatPrice: (amount: number) => string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBackToCatalog,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  relatedProducts,
  onSelectProduct,
  formatPrice,
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [isBackView, setIsBackView] = useState(false);
  const [customName, setCustomName] = useState(product.player?.name || '');
  const [customNumber, setCustomNumber] = useState<number | ''>(product.player?.number || '');
  const [addBadge, setAddBadge] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedConfirm, setAddedConfirm] = useState(false);

  // Compute actual price based on customized selections
  const basePrice = product.price;
  const customizationCost = (customName || customNumber !== '') ? 15 : 0;
  const badgeCost = addBadge ? 15 : 0;
  const finalPrice = basePrice + customizationCost + badgeCost;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToCartSubmit = (buyNow = false) => {
    const item: CartItem = {
      product: {
        ...product,
        price: finalPrice, // Save with calculated configuration price
      },
      selectedSize,
      customPrint: (customName || customNumber !== '') ? {
        name: customName.toUpperCase(),
        number: Number(customNumber) || 10,
      } : undefined,
      addBadge,
      quantity: 1,
    };
    onAddToCart(item);
    setAddedConfirm(true);
    setTimeout(() => setAddedConfirm(false), 2500);
  };

  return (
    <section className="bg-white text-emerald-950 py-10 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      
      {/* Back button */}
      <button
        onClick={onBackToCatalog}
        className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-700 hover:text-emerald-950 uppercase mb-8 cursor-pointer transition-colors"
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Interactive 360 SVG Jersey Showcase & View Rotator */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-100 rounded-3xl p-8 flex items-center justify-center min-h-[400px] overflow-hidden group shadow-2xl">
            {/* Ambient light ring */}
            <div className="absolute w-64 h-64 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[280px] h-auto transition-all duration-500 transform hover:scale-102">
              <JerseyRenderer
                productId={product.id}
                isBackView={isBackView}
                customName={customName}
                customNumber={customNumber === '' ? undefined : Number(customNumber)}
                showBadge={addBadge}
                uploadedImage={product.uploadedImage}
              />
            </div>

            {/* Quick angle indicators inside preview screen */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-white px-4 py-2.5 rounded-full border border-emerald-100">
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                {isBackView ? 'Showing: REVERSE (Back nameset)' : 'Showing: OBVERSE (Front sponsor)'}
              </span>
              <button
                onClick={() => setIsBackView(!isBackView)}
                className="text-[10px] bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider cursor-pointer"
              >
                Inspect {isBackView ? 'Front' : 'Back'} View
              </button>
            </div>
          </div>

          {/* Quick Specifications list below preview */}
          <div className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-6 space-y-4">
            <h3 className="text-emerald-800 font-mono font-bold text-xs uppercase tracking-wider">
              Authentication & Physical Condition
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/40">
                <span className="text-emerald-600 font-mono block mb-1">OFFICIAL SKU:</span>
                <span className="text-emerald-950 font-mono font-semibold">{product.sku}</span>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/40">
                <span className="text-emerald-600 font-mono block mb-1">CONDITION RATING:</span>
                <span className="text-emerald-900 font-black">{product.condition}</span>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-lg col-span-2 border border-emerald-100/40">
                <span className="text-emerald-600 font-mono block mb-1">VERIFIER METRICS:</span>
                <span className="text-emerald-850 leading-relaxed text-[11px] block">{product.conditionDetail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Panel & Buying controls */}
        <div className="lg:col-span-6 space-y-8 text-emerald-950">
          
          {/* Header Title Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] font-black uppercase px-3 py-1 rounded border border-emerald-200">
                {product.season} season
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-mono text-[10px] font-black uppercase px-3 py-1 rounded border border-emerald-100">
                {product.brand} Authentic
              </span>
              {product.stock <= 3 && (
                <span className="bg-red-50 text-red-600 border border-red-100 font-mono text-[10px] font-black uppercase px-3 py-1 rounded animate-pulse">
                  Only {product.stock} Left in Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight text-emerald-950">
              {product.name}
            </h1>

            {/* Price & Rating Bar */}
            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-emerald-800 text-2xl font-black">{formatPrice(finalPrice)}</span>
                {product.originalPrice && (
                  <span className="text-emerald-600 text-sm line-through font-mono">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {customizationCost > 0 && (
                  <span className="text-[10px] text-emerald-700 font-mono">
                    (Includes Nameset +{formatPrice(15)})
                  </span>
                )}
              </div>
              <div className="h-5 w-px bg-emerald-100" />
              <div className="flex items-center gap-1.5">
                <div className="flex text-emerald-700">
                  <Star size={13} className="fill-emerald-600 text-emerald-600" />
                </div>
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-emerald-600 text-xs">({product.reviewsCount} verified orders)</span>
              </div>
            </div>
          </div>

          <p className="text-emerald-800 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector Form */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold tracking-widest text-emerald-800 uppercase">
              Select Curated Sizing
            </label>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-12 rounded-xl text-xs font-mono font-black border transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-emerald-800 border-emerald-800 text-white shadow-lg shadow-emerald-800/15'
                      : 'bg-white border-emerald-100 text-emerald-950 hover:border-emerald-500'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Live Nameset Customization Creator */}
          {product.printAvailable && (
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold tracking-widest text-emerald-850 uppercase flex items-center gap-1">
                  <BadgeCheck size={14} className="text-emerald-700" /> Custom Nameset Printing (+$15)
                </label>
                <span className="text-[10px] text-emerald-600 font-mono">Live Vector Preview</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-600 font-mono">PLAYER LAST NAME:</span>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. ZIDANE"
                    value={customName}
                    onChange={(e) => {
                      setCustomName(e.target.value.toUpperCase());
                      setIsBackView(true); // Automatically show back when editing nameset
                    }}
                    className="w-full bg-white border border-emerald-100 rounded-lg py-2 px-3 text-emerald-950 placeholder-emerald-300 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-600 font-mono">SQUAD NUMBER (0-99):</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    placeholder="e.g. 10"
                    value={customNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomNumber(val === '' ? '' : Math.min(99, Math.max(0, Number(val))));
                      setIsBackView(true);
                    }}
                    className="w-full bg-white border border-emerald-100 rounded-lg py-2 px-3 text-emerald-950 placeholder-emerald-300 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sleeve Patch Adder */}
          {product.badgeAvailable && (
            <div className="flex items-center justify-between p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-emerald-950">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="add-sleeve-patch"
                  checked={addBadge}
                  onChange={(e) => setAddBadge(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer rounded"
                />
                <label htmlFor="add-sleeve-patch" className="text-xs font-semibold cursor-pointer">
                  Add Premium Tournament Sleeve Badges (+$15)
                </label>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold">WC '26</span>
            </div>
          )}

          {/* Cart Buttons & Utility Bar */}
          <div className="space-y-3.5 pt-2">
            {addedConfirm && (
              <div className="bg-emerald-50 border border-emerald-500/20 text-emerald-700 text-xs font-bold font-mono py-2.5 px-4 rounded-xl text-center tracking-wide animate-fadeIn">
                ✓ SHIRT SUCCESFULLY INTEGRATED INTO YOUR BAG!
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <button
                onClick={() => handleAddToCartSubmit(false)}
                className="sm:col-span-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-full shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 font-sans"
                id="add-to-bag-button"
              >
                <ShoppingCart size={15} /> ADD TO CART
              </button>
              
              <button
                onClick={() => onAddToWishlist(product)}
                className={`sm:col-span-4 border py-4 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-emerald-150 hover:border-emerald-500 text-emerald-800 bg-white'
                }`}
              >
                <Heart size={14} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Share / Security Trust features */}
            <div className="flex flex-wrap justify-between items-center text-xs text-emerald-600 pt-4 border-t border-emerald-100">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-emerald-950 transition-colors cursor-pointer"
              >
                <Share2 size={13} /> {copiedLink ? 'Link Copied!' : 'Share Jersey Details'}
              </button>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-700">
                <ShieldCheck size={13} />
                <span>Verified original with lifetime guarantee</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-emerald-100 pt-12 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold uppercase tracking-tight text-emerald-950">
              Related Historical Jerseys
            </h2>
            <span className="text-xs text-emerald-700 font-mono font-bold tracking-widest uppercase">
              Curated Selection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rp) => {
              return (
                <div
                  key={rp.id}
                  onClick={() => onSelectProduct(rp)}
                  className="group bg-emerald-50/20 hover:bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 rounded-2xl p-4 cursor-pointer transition-all duration-300"
                >
                  <div className="h-40 bg-emerald-50/40 rounded-xl flex items-center justify-center p-4 relative mb-3">
                    <JerseyRenderer productId={rp.id} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-emerald-700 block">{rp.brand} • {rp.season}</span>
                    <h3 className="text-xs font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors truncate">
                      {rp.name}
                    </h3>
                    <p className="text-xs font-black text-emerald-850">{formatPrice(rp.price)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </section>
  );
};
