import React, { useState } from 'react';
import { 
  Search, Heart, ShoppingBag, Menu, X, ShieldCheck, HelpCircle, Phone, 
  ArrowRight, Award, Trash2, Shirt, Trophy, Star, Flame, Sparkles, Tag, 
  Box, Globe, Compass, ChevronDown, Layers, Grid 
} from 'lucide-react';
import { Product, CartItem, User, AppConfig, MenuItem } from '../types';
import { POPULAR_SEARCHES } from '../data/storeData';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: Product[];
  onSelectProduct: (product: Product) => void;
  onSearch: (query: string) => void;
  onLogout?: () => void;
  currentUser?: User | null;
  appConfig: AppConfig;
  formatPrice: (amount: number) => string;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  selectedCategory,
  setSelectedCategory,
  cart,
  setCart,
  wishlist,
  onSelectProduct,
  onSearch,
  onLogout,
  currentUser,
  appConfig,
  formatPrice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMegaMenuDropdown, setShowMegaMenuDropdown] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setCurrentPage('listing');
      setShowSearchDropdown(false);
    }
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchQuery(term);
    onSearch(term);
    setCurrentPage('listing');
    setShowSearchDropdown(false);
  };

  const renderNavIcon = (iconName?: string, size = 14) => {
    switch (iconName) {
      case 'Shirt': return <Shirt size={size} />;
      case 'Trophy': return <Trophy size={size} />;
      case 'Star': return <Star size={size} />;
      case 'Flame': return <Flame size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Tag': return <Tag size={size} />;
      case 'Box': return <Box size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'ShieldCheck': return <ShieldCheck size={size} />;
      case 'Award': return <Award size={size} />;
      case 'ShoppingBag': return <ShoppingBag size={size} />;
      case 'HelpCircle': return <HelpCircle size={size} />;
      case 'Phone': return <Phone size={size} />;
      case 'Compass': return <Compass size={size} />;
      case 'Heart': return <Heart size={size} />;
      case 'Layers': return <Layers size={size} />;
      case 'Grid': return <Grid size={size} />;
      default: return null;
    }
  };

  const handleMenuClick = (url: string) => {
    setIsMobileMenuOpen(false);
    setShowMegaMenuDropdown(false);
    if (!url) return;
    if (url.startsWith('#')) {
      const anchor = url.replace('#', '');
      if (['seller', 'faq', 'about', 'contact', 'dashboard', 'authenticity'].includes(anchor)) {
        setCurrentPage(anchor);
      } else {
        setSelectedCategory('All');
        setCurrentPage('listing');
        window.location.hash = url;
      }
    } else if (['seller', 'faq', 'about', 'contact', 'dashboard', 'authenticity', 'home', 'listing'].includes(url.toLowerCase())) {
      setCurrentPage(url.toLowerCase());
    } else {
      setSelectedCategory(url);
      setCurrentPage('listing');
    }
  };

  // Main & Mega Menu Data from Config with Fallbacks
  const activeMenuItems = (appConfig?.menuItems || []).filter(
    m => (m.status === 'Active' || m.status === 'active')
  );

  const rawMainNavItems = activeMenuItems
    .filter(m => m.placement === 'Main Menu')
    .sort((a, b) => a.order - b.order);

  const DEFAULT_MAIN_MENU: MenuItem[] = [
    { id: 'nav-main-1', name: 'All Jerseys', placement: 'Main Menu', order: 1, url: 'All', status: 'Active', icon: 'Shirt' },
    { id: 'nav-main-2', name: 'World Cup Vault', placement: 'Main Menu', order: 2, url: 'World Cup', status: 'Active', icon: 'Trophy', badgeText: 'RARE' },
    { id: 'nav-main-3', name: 'England Classic', placement: 'Main Menu', order: 3, url: 'England', status: 'Active', icon: 'Flame' },
    { id: 'nav-main-4', name: 'Legends Store', placement: 'Main Menu', order: 4, url: 'Legends', status: 'Active', icon: 'Star', badgeText: 'HOT' },
    { id: 'nav-main-5', name: 'Current Season', placement: 'Main Menu', order: 5, url: 'Current Season', status: 'Active', icon: 'Sparkles' },
    { id: 'nav-main-6', name: 'Mystery Box', placement: 'Main Menu', order: 6, url: 'Mystery', status: 'Active', icon: 'Box', badgeText: 'POPULAR' },
    { id: 'nav-main-7', name: 'Clearance Vault', placement: 'Main Menu', order: 7, url: 'Clearance', status: 'Active', icon: 'Tag' },
  ];

  const mainNavItems = rawMainNavItems.length > 0 ? rawMainNavItems : DEFAULT_MAIN_MENU;

  const rawMegaNavItems = activeMenuItems
    .filter(m => m.placement === 'Mega Menu')
    .sort((a, b) => a.order - b.order);

  const DEFAULT_MEGA_MENU: MenuItem[] = [
    { id: 'nav-mega-cat-1', name: 'Top European Leagues', placement: 'Mega Menu', parentId: null, icon: 'Trophy', order: 1, url: '#listing', status: 'Active' },
    { id: 'nav-mega-item-1', name: 'Premier League Legends', placement: 'Mega Menu', parentId: 'nav-mega-cat-1', icon: 'Shirt', order: 1, url: 'Premier League', status: 'Active' },
    { id: 'nav-mega-item-2', name: 'La Liga Timeless Kits', placement: 'Mega Menu', parentId: 'nav-mega-cat-1', icon: 'Tag', order: 2, url: 'La Liga', status: 'Active' },
    { id: 'nav-mega-item-3', name: 'Serie A Golden Era', placement: 'Mega Menu', parentId: 'nav-mega-cat-1', icon: 'ShieldCheck', order: 3, url: 'Serie A', status: 'Active' },
    { id: 'nav-mega-cat-2', name: 'Legendary Player Drops', placement: 'Mega Menu', parentId: null, icon: 'Star', order: 2, url: '#listing', status: 'Active' },
    { id: 'nav-mega-item-4', name: 'Messi No. 10 Re-issues', placement: 'Mega Menu', parentId: 'nav-mega-cat-2', icon: 'Sparkles', order: 1, url: 'Messi', status: 'Active', badgeText: 'HOT' },
    { id: 'nav-mega-item-5', name: 'Maradona World Cup 86', placement: 'Mega Menu', parentId: 'nav-mega-cat-2', icon: 'Flame', order: 2, url: 'Maradona', status: 'Active', badgeText: 'VAULT' },
    { id: 'nav-mega-item-6', name: 'Ronaldo CR7 Deadstock', placement: 'Mega Menu', parentId: 'nav-mega-cat-2', icon: 'Trophy', order: 3, url: 'Ronaldo', status: 'Active' },
    { id: 'nav-mega-cat-3', name: 'National Teams', placement: 'Mega Menu', parentId: null, icon: 'Globe', order: 3, url: '#listing', status: 'Active' },
    { id: 'nav-mega-item-7', name: 'Argentina Albiceleste', placement: 'Mega Menu', parentId: 'nav-mega-cat-3', icon: 'Globe', order: 1, url: 'Argentina', status: 'Active' },
    { id: 'nav-mega-item-8', name: 'Brazil Seleção Classics', placement: 'Mega Menu', parentId: 'nav-mega-cat-3', icon: 'Globe', order: 2, url: 'Brazil', status: 'Active' },
  ];

  const megaNavItems = rawMegaNavItems.length > 0 ? rawMegaNavItems : DEFAULT_MEGA_MENU;
  const megaParents = megaNavItems.filter(m => !m.parentId);

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Promotion Announcement Bar */}
      <div className="bg-emerald-950 text-[10px] sm:text-xs text-emerald-200 font-medium tracking-wider text-center py-2 px-4 border-b border-emerald-900 flex justify-between items-center px-6 md:px-12">
        <div className="hidden md:flex items-center gap-2">
          <Award size={14} className="animate-pulse text-emerald-300" />
          <span>100% AUTHENTIC FOOTBALL JERSEYS</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-emerald-200">
          <span className="hover:text-white cursor-pointer flex items-center gap-1" onClick={() => setCurrentPage('seller')}>
            <ShieldCheck size={14} /> Sell Your Shirts
          </span>
          <span className="hover:text-white cursor-pointer flex items-center gap-1" onClick={() => setCurrentPage('contact')}>
            <Phone size={14} /> Support
          </span>
        </div>
      </div>

      {/* Top Navigation Row */}
      <div className="bg-white border-b border-emerald-100 py-4 px-4 lg:px-12 flex justify-between items-center transition-all duration-300">
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            setCurrentPage('home');
            setSelectedCategory('All');
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          id="brand-logo"
        >
          {/* Custom Jersey Addicts Logo Graphic */}
          <div className="flex-shrink-0 bg-emerald-50 p-1 rounded-xl border border-emerald-100 group-hover:border-emerald-500 transition-all">
            <svg viewBox="0 0 100 100" className="w-9 h-9">
              {/* Leftmost green triangle pointing down-left */}
              <path d="M 8 44 L 26 44 L 17 60 Z" fill="#059669" />
              {/* Green slanted bar */}
              <path d="M 28 76 L 46 24" stroke="#059669" strokeWidth="12" strokeLinecap="round" />
              {/* Navy slanted bar */}
              <path d="M 48 76 L 66 24" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              {/* Navy right triangle pointing up-right */}
              <path d="M 74 56 L 92 56 L 83 40 Z" fill="#10b981" />
            </svg>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-sans font-black text-sm md:text-lg tracking-tight leading-none uppercase group-hover:text-emerald-500 transition-colors">
                Jersey
              </span>
              <span className="text-emerald-950 font-sans font-black text-sm md:text-lg tracking-tight leading-none uppercase">
                Addicts
              </span>
              <span className="text-emerald-800 font-mono font-bold text-[9px] md:text-[10px] px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-200 leading-none">
                BD
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="relative hidden lg:block w-full max-w-lg mx-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Club Jersey, International Jersey, League..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full h-12 bg-emerald-50/30 text-emerald-950 placeholder-emerald-800/40 text-sm pl-12 pr-28 rounded-full border border-emerald-100/80 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all duration-300"
              />
              <Search className="absolute left-4 text-emerald-600 w-5 h-5 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow hover:scale-[1.01] active:scale-95 uppercase tracking-wider flex items-center justify-center"
              >
                Search
              </button>
            </div>
          </form>

          {/* Autocomplete / Popular Searches Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-100 rounded-2xl shadow-2xl p-5 z-50 text-emerald-950 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-emerald-800/80 tracking-wider uppercase">
                  Popular Searches
                </span>
                <button
                  onClick={() => setShowSearchDropdown(false)}
                  className="text-emerald-600 hover:text-emerald-900 text-xs"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearchClick(term)}
                    className="bg-emerald-50/50 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-300 text-xs px-3.5 py-1.5 rounded-full text-emerald-800 hover:text-emerald-950 transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="border-t border-emerald-100 pt-3">
                <span className="text-[11px] text-emerald-600 font-mono flex items-center gap-1">
                  <ShieldCheck size={12} /> Search is secured & real-time
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Icons Right Side */}
        <div className="hidden lg:flex items-center gap-4 text-emerald-950">
          {/* Dynamic Authentication Session Control Bar */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right pr-2">
                <span className="text-[9px] text-emerald-600 font-mono font-bold uppercase tracking-wider">{currentUser.role}</span>
                <span className="text-xs text-emerald-950 font-bold truncate max-w-[100px]">{currentUser.fullName}</span>
              </div>
              
              {currentUser.role === 'Admin' ? (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="bg-emerald-50 border border-emerald-200 hover:border-emerald-400 text-emerald-800 text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 rounded cursor-pointer transition-colors"
                  id="admin-dashboard-shortcut"
                >
                  Admin Room
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="bg-emerald-50 border border-emerald-100 hover:border-emerald-300 text-emerald-800 text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 rounded cursor-pointer transition-colors"
                  id="my-account-btn"
                >
                  My Account
                </button>
              )}

              <button
                onClick={() => {
                  if (onLogout) onLogout();
                }}
                className="text-[10px] font-mono text-emerald-700 hover:text-red-600 uppercase tracking-wider px-2 py-1 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage('auth')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-md cursor-pointer transition-all"
              id="header-sign-in-btn"
            >
              Sign In
            </button>
          )}

          {/* Wishlist Link */}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentPage('dashboard');
            }}
            className="relative p-2 hover:bg-emerald-50 rounded-full hover:text-emerald-700 transition-all cursor-pointer"
            id="wishlist-btn"
          >
            <Heart size={20} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Icon with Preview Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrentPage('cart')}
              onMouseEnter={() => setShowCartDropdown(true)}
              className="relative p-2.5 bg-emerald-50 border border-emerald-100 rounded-full hover:border-emerald-300 text-emerald-800 hover:text-emerald-950 transition-all cursor-pointer"
              id="shopping-bag-btn"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Bag Preview Dropdown */}
            {showCartDropdown && cart.length > 0 && (
              <div
                onMouseLeave={() => setShowCartDropdown(false)}
                className="absolute right-0 mt-2 w-80 bg-white border border-emerald-100 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn text-emerald-950"
              >
                <div className="flex justify-between items-center border-b border-emerald-100 pb-2 mb-3">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    My Jersey Bag ({cartCount})
                  </span>
                  <button
                    onClick={() => setCurrentPage('cart')}
                    className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold"
                  >
                    View Bag
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3 text-emerald-950 border-b border-emerald-50 pb-2">
                      <div className="w-12 h-12 bg-emerald-50 rounded p-1 flex items-center justify-center border border-emerald-100/30">
                        {/* Tiny Preview */}
                        <svg viewBox="0 0 200 240" className="w-full h-full">
                          <rect width="200" height="240" rx="10" fill="#f0fdf4" />
                          <circle cx="100" cy="120" r="60" fill="#059669" opacity="0.3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate hover:text-emerald-700 cursor-pointer" onClick={() => { onSelectProduct(item.product); setCurrentPage('details'); }}>
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-mono">
                          Size: {item.selectedSize} | Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-black text-emerald-800 mt-0.5">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-emerald-600 hover:text-red-600 self-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-emerald-100 pt-3 mt-3">
                  <div className="flex justify-between items-center text-sm font-semibold mb-3">
                    <span className="text-emerald-700">Subtotal:</span>
                    <span className="text-emerald-900 font-black">{formatPrice(cartTotal)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCartDropdown(false);
                      setCurrentPage('checkout');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-full flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    Instant Checkout <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-only Controls on the Right Side (lg:hidden) */}
        <div className="flex lg:hidden items-center gap-1.5 text-emerald-950" id="mobile-right-controls">
          {/* Wishlist Link for Mobile */}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentPage('dashboard');
            }}
            className="relative p-2 text-emerald-800 hover:text-emerald-950 transition-all cursor-pointer"
            id="mobile-wishlist-btn"
            aria-label="Wishlist"
          >
            <Heart size={20} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white font-black text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Link for Mobile */}
          <button
            onClick={() => setCurrentPage('cart')}
            className="relative p-2 text-emerald-800 hover:text-emerald-950 transition-all cursor-pointer mr-0.5"
            id="mobile-cart-btn"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white font-black text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* High-quality Hamburger Menu Icon (matching user-provided image) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 hover:bg-emerald-50 rounded-xl text-emerald-950 border border-emerald-100 bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all duration-200"
            id="mobile-hamburger-btn"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X size={20} className="text-emerald-800 animate-fadeIn" strokeWidth={2.5} />
            ) : (
              <div className="w-5 h-3 flex flex-col justify-between items-center animate-fadeIn">
                <span className="w-5 h-[2.5px] bg-emerald-800 rounded-full"></span>
                <span className="w-5 h-[2.5px] bg-emerald-800 rounded-full"></span>
                <span className="w-5 h-[2.5px] bg-emerald-800 rounded-full"></span>
              </div>
            )}
          </button>
        </div>

      </div>

      {/* Dynamic Main & Mega Navigation Row */}
      <nav className="bg-emerald-50/80 border-b border-emerald-100/80 py-2.5 px-4 lg:px-12 hidden lg:flex items-center justify-center gap-6 relative">
        {mainNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.url)}
            className="text-xs font-sans tracking-widest font-bold uppercase relative text-emerald-950 hover:text-emerald-700 py-1 px-1 transition-colors cursor-pointer group flex items-center gap-1.5"
          >
            {renderNavIcon(item.icon, 14)}
            <span>{item.name}</span>
            {item.badgeText && (
              <span className="bg-emerald-800 text-white font-mono text-[8px] font-black px-1.5 py-0.5 rounded tracking-normal">
                {item.badgeText}
              </span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}

        {/* Mega Menu Dropdown Trigger */}
        {megaParents.length > 0 && (
          <div
            className="relative"
            onMouseEnter={() => setShowMegaMenuDropdown(true)}
            onMouseLeave={() => setShowMegaMenuDropdown(false)}
          >
            <button className="text-xs font-sans tracking-widest font-extrabold uppercase relative bg-emerald-800 text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:bg-emerald-900">
              <Grid size={14} />
              <span>MEGA VAULT CATALOG</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showMegaMenuDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Dropdown Board */}
            {showMegaMenuDropdown && (
              <div className="absolute top-full right-0 w-[680px] bg-white border border-emerald-100 rounded-2xl shadow-2xl p-6 z-50 animate-fadeIn grid grid-cols-3 gap-6 text-emerald-950">
                {megaParents.map((parent) => {
                  const children = megaNavItems.filter(c => c.parentId === parent.id);

                  return (
                    <div key={parent.id} className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                        <div className="p-1 bg-emerald-50 text-emerald-800 rounded">
                          {renderNavIcon(parent.icon, 16)}
                        </div>
                        <h5 className="font-extrabold text-xs uppercase tracking-tight text-emerald-950 font-display">
                          {parent.name}
                        </h5>
                      </div>
                      <div className="space-y-2">
                        {children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleMenuClick(child.url)}
                            className="w-full text-left p-2 rounded-xl hover:bg-emerald-50/80 transition-all cursor-pointer flex items-center justify-between group text-xs"
                          >
                            <div className="flex items-center gap-2 text-emerald-900 group-hover:text-emerald-700">
                              {renderNavIcon(child.icon, 14)}
                              <span className="font-semibold">{child.name}</span>
                            </div>
                            {child.badgeText && (
                              <span className="bg-amber-100 text-amber-900 font-mono text-[8px] font-black px-1.5 py-0.5 rounded">
                                {child.badgeText}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile & Tab Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-emerald-100 shadow-2xl z-50 py-6 px-5 space-y-6 animate-slideDown lg:hidden text-emerald-950 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Club Jersey, International Jersey, League..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-emerald-50/30 text-emerald-950 placeholder-emerald-800/40 text-sm pl-12 pr-28 rounded-full border border-emerald-100/80 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all duration-300"
              />
              <Search className="absolute left-4 text-emerald-600 w-5 h-5 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow hover:scale-[1.01] active:scale-95 uppercase tracking-wider flex items-center justify-center"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats / Direct Pages Options */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-bold uppercase block text-left">
              My Personal Room
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cart Button Option */}
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('cart');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-emerald-50/30 hover:bg-emerald-50 border border-emerald-100 rounded-2xl transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100/60 text-emerald-800 rounded-xl">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-950">Cart Bag</p>
                    <p className="text-[10px] text-emerald-700/80 font-mono font-bold">{cartCount} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-900 font-mono">{formatPrice(cartTotal)}</p>
                  <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-widest">View →</span>
                </div>
              </button>

              {/* Wishlist Button Option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentPage('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-emerald-50/30 hover:bg-emerald-50 border border-emerald-100 rounded-2xl transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                    <Heart size={18} className={wishlist.length > 0 ? "fill-red-500 text-red-500" : ""} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-950">Favorites</p>
                    <p className="text-[10px] text-emerald-700/80 font-mono font-bold">{wishlist.length} saved</p>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-widest">View →</span>
              </button>
            </div>
          </div>

          {/* User Account / Access Options */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-bold uppercase block text-left">
              Account Control
            </span>
            {currentUser ? (
              <div className="p-4 bg-slate-50/60 border border-emerald-100 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[9px] text-emerald-600 font-mono font-bold uppercase tracking-wider leading-none">{currentUser.role}</p>
                    <p className="text-xs font-black text-emerald-950 mt-1">{currentUser.fullName}</p>
                    <p className="text-[10px] text-emerald-700/70 font-mono truncate max-w-[200px]">{currentUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onLogout) onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-[10px] font-mono text-red-600 hover:text-red-700 underline font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100/60">
                  {currentUser.role === 'Admin' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('admin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-emerald-950 hover:bg-emerald-900 text-white py-2.5 rounded-xl text-center text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Admin Room
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100 py-2.5 rounded-xl text-center text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                    >
                      My Account
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage('seller');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-center text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Sell Shirts
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('auth');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Sign In to Your Account</span>
              </button>
            )}
          </div>

          {/* Main Navigation Categories in Mobile */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-bold uppercase block text-left">
              Main Navigation Menu
            </span>
            <div className="grid grid-cols-2 gap-2">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMenuClick(item.url)}
                  className="text-left text-xs py-3 px-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 text-emerald-950 font-semibold transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {renderNavIcon(item.icon, 14)}
                    <span>{item.name}</span>
                  </div>
                  {item.badgeText && (
                    <span className="bg-emerald-800 text-white font-mono text-[8px] px-1.5 py-0.5 rounded font-black">
                      {item.badgeText}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mega Menu Options in Mobile */}
          {megaParents.length > 0 && (
            <div className="space-y-3 border-t border-emerald-100 pt-3">
              <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-bold uppercase block text-left">
                Mega Menu Vault Collections
              </span>
              <div className="space-y-3">
                {megaParents.map((parent) => {
                  const children = megaNavItems.filter((c) => c.parentId === parent.id);
                  return (
                    <div key={parent.id} className="bg-emerald-50/30 p-3 rounded-2xl border border-emerald-100/60 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-emerald-950 uppercase">
                        {renderNavIcon(parent.icon, 14)}
                        <span>{parent.name}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 pl-2">
                        {children.map((child) => (
                          <button
                            key={child.id}
                            type="button"
                            onClick={() => handleMenuClick(child.url)}
                            className="text-left text-xs py-1.5 px-2.5 bg-white border border-emerald-100 rounded-lg hover:border-emerald-400 text-emerald-900 font-medium flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {renderNavIcon(child.icon, 12)}
                              <span>{child.name}</span>
                            </div>
                            {child.badgeText && (
                              <span className="bg-amber-100 text-amber-900 font-mono text-[8px] font-black px-1.5 py-0.5 rounded">
                                {child.badgeText}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
