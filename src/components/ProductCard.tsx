import React, { useState } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { JerseyRenderer } from './JerseyRenderer';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onQuickAdd?: (product: Product, size?: string, quantity?: number) => void;
  onCheckout?: (product: Product, size: string, quantity: number) => void;
  onUpdateImage?: (productId: string, base64: string) => void;
  formatPrice: (amount: number) => string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onToggleWishlist,
  isWishlisted,
  onQuickAdd,
  onUpdateImage,
  formatPrice,
  onCheckout,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product, selectedSize, quantity);
    }
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCheckout) {
      onCheckout(product, selectedSize, quantity);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.files && e.target.files[0] && onUpdateImage) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage(product.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white border border-emerald-100 hover:border-emerald-500 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(4,36,22,0.06)] relative flex flex-col justify-between"
      id={`product-card-${product.id}`}
    >
      <div>
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white border border-emerald-100 rounded-full text-emerald-800 hover:text-red-500 hover:bg-white shadow-sm transition-all cursor-pointer"
          aria-label="Add to Wishlist"
        >
          <Heart
            size={15}
            className={isWishlisted ? 'fill-red-500 text-red-500 scale-110 transition-transform' : 'transition-transform'}
          />
        </button>

        {/* Jersey Render Window */}
        <div className="bg-emerald-50/40 rounded-2xl py-6 px-4 mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-emerald-50/60 transition-all duration-300 min-h-[180px]">
          {/* Subtle circular grid watermark */}
          <div className="absolute w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
          
          {/* Actual SVG representation of shirt */}
          <div className="transform group-hover:scale-105 transition-transform duration-500 w-full h-full">
            <JerseyRenderer productId={product.id} uploadedImage={product.uploadedImage} />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold">
              {product.brand} • {product.category}
            </span>
          </div>

          <h3 className="text-emerald-950 text-sm font-black tracking-tight line-clamp-1 group-hover:text-emerald-600 transition-colors text-left">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Select Size, Quantity, and Actions Footer */}
      <div className="space-y-3 pt-3 mt-3 border-t border-emerald-100">
        
        {/* Size Selection */}
        <div className="space-y-1.5 text-left">
          <span className="text-[9px] font-bold text-emerald-700/60 uppercase tracking-widest font-mono">SELECT SIZE</span>
          <div className="flex gap-1.5 flex-wrap">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center cursor-pointer ${
                  selectedSize === size
                    ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
                    : 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-300 text-emerald-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between text-left">
          <span className="text-[9px] font-bold text-emerald-700/60 uppercase tracking-widest font-mono">QUANTITY</span>
          <div className="flex items-center border border-emerald-100 rounded-lg overflow-hidden bg-emerald-50/30">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(prev => Math.max(1, prev - 1));
              }}
              className="px-2.5 py-1 text-xs font-black text-emerald-800 hover:bg-emerald-100/80 transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="px-3 text-xs font-black font-mono text-emerald-950">{quantity}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(prev => prev + 1);
              }}
              className="px-2.5 py-1 text-xs font-black text-emerald-800 hover:bg-emerald-100/80 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Bottom Price and Actions Bar */}
        <div className="space-y-2.5 pt-3 border-t border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-700/60 font-mono font-bold uppercase tracking-wider">In Stock</span>
            <div className="flex items-baseline gap-1.5 text-right">
              {product.originalPrice && (
                <span className="text-emerald-700/40 text-xs line-through font-mono">
                  {formatPrice(product.originalPrice * quantity)}
                </span>
              )}
              <span className="text-emerald-800 text-base font-black font-mono">{formatPrice(product.price * quantity)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickAdd}
              type="button"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer font-sans"
              title="Add to shopping bag"
              id={`quick-add-${product.id}`}
            >
              <ShoppingCart size={11} />
              <span>ADD TO BAG</span>
            </button>
            <button
              onClick={handleCheckoutClick}
              type="button"
              className="bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-800 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer font-sans shadow-md shadow-emerald-900/10"
              title="Checkout directly"
              id={`checkout-${product.id}`}
            >
              <span>CHECK OUT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
