import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, HelpCircle, Phone, Globe, Instagram, Twitter, Facebook, Shirt, Trophy, Star, Flame, Sparkles, Tag, Box, Award, ShoppingBag, Compass, Heart, MapPin } from 'lucide-react';
import { STORE_LOCATIONS } from '../data/storeData';
import { AppConfig } from '../types';

interface FooterProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  appConfig: AppConfig;
}

export const Footer: React.FC<FooterProps> = ({ currentPage, setCurrentPage, appConfig }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const renderNavIcon = (iconName?: string, size = 13) => {
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
      default: return null;
    }
  };

  const handleFooterLinkClick = (url: string) => {
    if (!url) return;
    if (url.startsWith('#')) {
      const anchor = url.replace('#', '');
      if (['seller', 'faq', 'about', 'contact', 'dashboard', 'authenticity', 'privacy', 'refund', 'terms', 'shipping'].includes(anchor)) {
        setCurrentPage(anchor);
      } else {
        setCurrentPage('listing');
        window.location.hash = url;
      }
    } else if (['seller', 'faq', 'about', 'contact', 'dashboard', 'authenticity', 'privacy', 'refund', 'terms', 'shipping', 'home', 'listing'].includes(url.toLowerCase())) {
      setCurrentPage(url.toLowerCase());
    } else {
      setCurrentPage('listing');
    }
  };

  const footerMenuItems = (appConfig?.menuItems || [])
    .filter(m => m.placement === 'Footer Menu' && (m.status === 'Active' || m.status === 'active'))
    .sort((a, b) => a.order - b.order);

  return (
    <footer className="bg-emerald-50/50 text-emerald-950 border-t border-emerald-100">
      
      {/* Newsletter signup & social media bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-b border-emerald-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-2">
          <h3 className="text-emerald-950 text-lg font-bold uppercase tracking-tight">
            Join the Jersey Collectors League
          </h3>
          <p className="text-emerald-800 text-xs">
            Subscribe to get immediate notification of rare vintage restocks, limited world cup drops, and 10% off your first purchase.
          </p>
        </div>
        <div className="lg:col-span-7">
          {subscribed ? (
            <div className="bg-emerald-100 border border-emerald-200 px-6 py-4 rounded-full text-center text-emerald-800 text-xs font-bold font-mono tracking-wide animate-fadeIn">
              ✓ YOU ARE NOW IN THE JERSEY ADDICTS CLUB. CHECK YOUR INBOX FOR YOUR 10% WELCOME CODE.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your collector email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-full py-3.5 px-6 pl-12 text-emerald-950 placeholder-emerald-700/60 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/40 transition-all h-12"
                />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-700 w-4.5 h-4.5" />
              </div>
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-8 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/10 h-12 self-stretch sm:self-auto"
              >
                <span>Sign Up</span> <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Multi-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-xs">
        
        {/* Brand Information Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-emerald-50 p-1 rounded-lg border border-emerald-100">
              <svg viewBox="0 0 100 100" className="w-7 h-7">
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
            <div className="flex items-center gap-1">
              <span className="text-emerald-600 font-sans font-black text-sm uppercase">
                Jersey
              </span>
              <span className="text-emerald-950 font-sans font-black text-sm uppercase">
                Addicts
              </span>
              <span className="text-emerald-800 font-mono font-bold text-[8px] px-1 bg-emerald-100 rounded border border-emerald-200 leading-none ml-1">
                BD
              </span>
            </div>
          </div>
          <p className="text-emerald-800 leading-relaxed">
            {appConfig.footerAbout}
          </p>
          <div className="flex gap-3 text-emerald-700">
            <a href="#" className="hover:text-emerald-950 transition-colors"><Instagram size={18} /></a>
            <a href="#" className="hover:text-emerald-950 transition-colors"><Twitter size={18} /></a>
            <a href="#" className="hover:text-emerald-950 transition-colors"><Facebook size={18} /></a>
          </div>
        </div>

        {/* Store Locations Column */}
        <div className="space-y-4">
          <h4 className="font-mono uppercase tracking-widest text-xs font-black text-emerald-700">
            Store Locations
          </h4>
          <div className="space-y-3">
            {appConfig.footerLocations.map((loc) => (
              <div key={loc.city} className="border-l border-emerald-200 pl-3 space-y-1">
                <p className="font-bold text-emerald-950 uppercase">{loc.city}</p>
                <p className="text-emerald-800 text-[11px]">{loc.address}</p>
                <p className="text-[10px] text-emerald-600 font-mono">{loc.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Helpful Resources Column (Dynamic Navigation Builder Menu) */}
        <div className="space-y-4">
          <h4 className="font-mono uppercase tracking-widest text-xs font-black text-emerald-700">
            Useful Links
          </h4>
          <ul className="space-y-2.5 font-medium text-xs">
            {footerMenuItems.length > 0 ? (
              footerMenuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleFooterLinkClick(item.url)}
                    className="hover:text-emerald-700 text-left transition-colors hover:underline flex items-center gap-2"
                  >
                    {renderNavIcon(item.icon, 13)}
                    <span>{item.name}</span>
                    {item.badgeText && (
                      <span className="bg-emerald-800 text-white font-mono text-[8px] font-black px-1.5 py-0.2 rounded">
                        {item.badgeText}
                      </span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <>
                <li>
                  <button onClick={() => setCurrentPage('seller')} className="hover:text-emerald-700 text-left transition-colors hover:underline">
                    Sell Your Shirts (Submit Details)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('faq')} className="hover:text-emerald-700 text-left transition-colors hover:underline">
                    Frequently Asked Questions (FAQ)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('about')} className="hover:text-emerald-700 text-left transition-colors hover:underline">
                    About Jersey Addicts BD / Sourcing Story
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('contact')} className="hover:text-emerald-700 text-left transition-colors hover:underline">
                    Contact Customer Care Desk
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Policy & Security Column */}
        <div className="space-y-4">
          <h4 className="font-mono uppercase tracking-widest text-xs font-black text-emerald-700">
            Policy & Security
          </h4>
          <ul className="space-y-2.5 font-medium text-emerald-800">
            <li>
              <button onClick={() => setCurrentPage('privacy')} className="hover:text-emerald-700 text-left transition-colors hover:underline">
                Privacy & Data Encryption Policy
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('refund')} className="hover:text-emerald-700 text-left transition-colors hover:underline">
                Refunds & Return Guidelines
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('terms')} className="hover:text-emerald-700 text-left transition-colors hover:underline">
                Terms of Service & Licensing
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('shipping')} className="hover:text-emerald-700 text-left transition-colors hover:underline">
                Shipping Rates & Customs Info
              </button>
            </li>
          </ul>
          <div className="pt-2 border-t border-emerald-100 flex items-center gap-2 text-[10px] text-emerald-600 font-mono">
            <ShieldCheck size={14} />
            <span>SSL Secured checkout environment</span>
          </div>
        </div>

      </div>

      {/* Trademark Legal Bar */}
      <div className="bg-emerald-100/50 py-6 border-t border-emerald-100 text-center text-[10px] text-emerald-800 tracking-wider uppercase font-mono px-6">
        <p>{appConfig.footerCopyright}</p>
        <p className="mt-1 text-emerald-700">This platform has NO affiliation with Nike, Adidas, Umbro, or FIFA. All designs are completely original vectors.</p>
      </div>

    </footer>
  );
};
