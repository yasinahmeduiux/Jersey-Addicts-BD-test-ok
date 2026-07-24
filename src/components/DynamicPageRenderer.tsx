import React, { useState, useEffect } from 'react';
import { Product, AppConfig, PageSection, CustomPage } from '../types';
import { ProductCard } from './ProductCard';
import { BiddingSection } from './BiddingSection';
import { 
  Star, ArrowRight, Sparkles, Flame, Percent, Gift, Trophy, RefreshCw, 
  Layers, Eye, ShieldCheck, Mail, MapPin, Instagram, Play, HelpCircle, 
  ChevronRight, ChevronLeft, Calendar, UserCheck, Heart, AlertCircle, ShoppingBag, BadgeCheck, X 
} from 'lucide-react';

interface DynamicPageRendererProps {
  currentPage: string;
  products: Product[];
  appConfig: AppConfig;
  formatPrice: (amount: number) => string;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, size: string, quantity: number) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Product[];
  setCurrentPage: (page: string) => void;
  setSelectedCategory: (cat: string) => void;
  handleQuickAdd: (p: Product) => void;
  handleUpdateProductImage: (id: string, base64: string) => void;
  handleCheckoutDirectly: (p: Product) => void;
}

export const DEFAULT_HOMEPAGE_SECTIONS: PageSection[] = [
  { id: 'hero-slider', name: 'Hero Banner Slider', visible: true, bgColor: 'bg-emerald-950', padding: 'py-0', margin: 'my-0', title: 'WORLD CUP 2026 EDITION', subtitle: 'The Grandest Stage of Football', status: 'active' },
  { id: 'trending-searches', name: 'Trending Searches bar', visible: true, bgColor: 'bg-emerald-50/50', padding: 'py-3.5', margin: 'my-2', status: 'active' },
  { id: 'shop-by-league', name: 'Shop by League badges', visible: true, bgColor: 'bg-white', padding: 'py-10', margin: 'my-0', title: 'SHOP BY FOOTBALL LEAGUE', subtitle: 'Sourced kits from leagues worldwide', status: 'active' },
  { id: 'live-auction', name: 'Bidding & Live Auctions', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', status: 'active' },
  { id: 'shop-by-club', name: 'Shop by Club circles', visible: true, bgColor: 'bg-emerald-50/30', padding: 'py-10', margin: 'my-0', title: 'SHOP BY CLUB VAULTS', subtitle: 'Authentic retro & modern club matchwear', status: 'active' },
  { id: 'daily-deals', name: 'Daily Deals Countdown', visible: true, bgColor: 'bg-amber-500/10', padding: 'py-12', margin: 'my-4', title: 'LIMITED DAILY DEAL DECK', subtitle: '24-hour flash sale on ultra rare collectibles', status: 'active' },
  { id: 'featured-collection', name: 'Featured Collection Row', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'VERIFIED FEATURED CLASSICS', subtitle: 'Curated 1-of-1 historic collectibles', status: 'active' },
  { id: 'worldcup-collection', name: 'World Cup Vault Section', visible: true, bgColor: 'bg-emerald-900/5', padding: 'py-12', margin: 'my-0', title: 'WORLD CUP HERITAGE VAULT', subtitle: 'Historical match issue kits from 1970 to 2026', status: 'active' },
  { id: 'current-season', name: 'Current Season Row', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'CURRENT SEASON STOCK', subtitle: 'Direct from authorized team supplier docks', status: 'active' },
  { id: 'mystery-box', name: 'Mystery Box Challenge', visible: false, bgColor: 'bg-gradient-to-r from-purple-950 to-indigo-950', padding: 'py-14', margin: 'my-6', title: 'THE VAULT MYSTERY BOX', subtitle: 'Receive one random 100% authentic retro or modern kit with premium certificates', status: 'inactive' },
  { id: 'clearance', name: 'Clearance & Sale Rack', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'OUTLET CLEARANCE SALE', subtitle: 'End of collection deadstock at cost prices', status: 'active' },
  { id: 'best-sellers', name: 'Best Sellers Grid', visible: true, bgColor: 'bg-emerald-50/25', padding: 'py-12', margin: 'my-0', title: 'TOP DEMAND CLASSICS', subtitle: 'Most reviewed and requested reissues', status: 'active' },
  { id: 'latest-products', name: 'Latest Products Row', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'LATEST WORKSHOP DROPS', subtitle: 'Freshly authenticated physical catalog arrivals', status: 'active' },
  { id: 'popular-teams', name: 'Popular Teams Grid', visible: true, bgColor: 'bg-emerald-50/20', padding: 'py-10', margin: 'my-0', title: 'FAVORITE FAN NATIONS', subtitle: 'Rep the historic world heavyweights', status: 'active' },
  { id: 'shop-by-legends', name: 'Shop by Legends portraits', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'THE LEGENDS STORE', subtitle: 'Embroidered match prints of historical deities', status: 'active' },
  { id: 'community-gallery', name: 'Dhaka Fan Community Gallery', visible: true, bgColor: 'bg-emerald-50/30', padding: 'py-12', margin: 'my-0', title: 'COLLECTORS IN DHAKA', subtitle: 'Fan gallery sharing local unboxings on Bailey Road', status: 'active' },
  { id: 'testimonials', name: 'Testimonials Deck', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'WHAT COLLECTORS DECLARE', subtitle: 'Genuine reviews from verified buyers', status: 'active' },
  { id: 'video-banner', name: 'Video Feature Banner', visible: true, bgColor: 'bg-emerald-950', padding: 'py-16', margin: 'my-0', title: 'THE ART OF AUTHENTICATION', subtitle: 'A look inside our 12-point micro-fabric check laboratory in Dhaka', status: 'active' },
  { id: 'instagram-feed', name: 'Instagram Feed Mockup', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'FOLLOW @JERSEYADDICTS_BD', subtitle: 'Daily vintage drops, buyer photos, and restocks', status: 'active' },
  { id: 'newsletter', name: 'Newsletter Subscription', visible: true, bgColor: 'bg-emerald-900', padding: 'py-12', margin: 'my-4', title: 'JOIN THE EXCLUSIVE CIRCLE', subtitle: 'Be first to receive physical workshop inventory arrivals', status: 'active' },
  { id: 'store-locations', name: 'Physical Store Maps', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'PHYSICAL OUTLET POINTS', subtitle: 'Visit us for physical sizing and authentications', status: 'active' },
];

export const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({
  currentPage,
  products,
  appConfig,
  formatPrice,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  setCurrentPage,
  setSelectedCategory,
  handleQuickAdd,
  handleUpdateProductImage,
  handleCheckoutDirectly,
}) => {
  // Extract sections based on the active page
  const [sections, setSections] = useState<PageSection[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');
  const [mysterySize, setMysterySize] = useState('M');
  const [dealTimeLeft, setDealTimeLeft] = useState({ hrs: 14, mins: 42, secs: 19 });
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [showPopupBanner, setShowPopupBanner] = useState(false);

  // Active Banners Selector Helpers
  const activeHeroBanners = (appConfig.banners || []).filter(
    (b) => (b.type === 'Hero Slider' || b.id === 'hero-slider') && (b.status === 'Active' || b.status === 'active')
  );
  const activePopupBanner = (appConfig.banners || []).find(
    (b) => b.type === 'Popup Banner' && (b.status === 'Active' || b.status === 'active')
  );

  // Countdown timer simulation for Daily Deals
  useEffect(() => {
    const timer = setInterval(() => {
      setDealTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { hrs: prev.hrs, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        return { hrs: 23, mins: 59, secs: 59 }; // wrap
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentPage === 'home') {
      setSections(appConfig.homepageSections || DEFAULT_HOMEPAGE_SECTIONS);
      setPageTitle('HOME');
    } else {
      // Check if this is a custom page ID or custom category page
      const matchedPage = appConfig.pages?.find(
        (p) => p.id === currentPage || `page-${p.id}` === currentPage || p.slug === currentPage || p.name === currentPage || p.name.toLowerCase() === currentPage.toLowerCase()
      );
      if (matchedPage) {
        setSections(matchedPage.sections || []);
        setPageTitle(matchedPage.name);
        setPageSubtitle(`Dynamic Page • Sourced and Managed via Command CMS`);
      } else {
        // Fallback or category filters
        setSections([]);
      }
    }
  }, [currentPage, appConfig]);

  if (sections.length === 0 && currentPage !== 'home') {
    // If it's a category page without custom layout sections, return null so App.tsx can render standard listing
    return null;
  }

  // Handle mystery box purchase
  const handleBuyMysteryBox = () => {
    const mysteryProd: Product = {
      id: 'mystery-box-item',
      name: `Premium Vintage Mystery Box (${mysterySize})`,
      slug: 'premium-mystery-box',
      price: 130, // in USD base
      originalPrice: 220,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'],
      brand: 'Vault Brand',
      season: 'Retro Classic',
      year: 2026,
      condition: 'Mint',
      conditionDetail: 'Deadstock sealed with holographic authentication tags and original certificates.',
      color: 'Mysterious Obsidian',
      sizes: [mysterySize],
      sku: 'MYSTERY-BOX-BD',
      badgeAvailable: true,
      printAvailable: false,
      rating: 4.9,
      reviewsCount: 184,
      description: 'The ultimate soccer collector adrenaline rush. Inside this sealed obsidian cardboard case lies one 100% genuine vintage shirt from seasons 1980 to 2018 (including Argentina 86, Milan 90s, Arsenal 2004, etc.). Completely physically audited. Double refunded if replica.',
      specification: {
        material: 'Authentic Climalite / Dri-Fit Blend',
        madeIn: 'Europe / South America Vaults',
        fit: 'Standard Retro Fit'
      },
      category: 'Mystery',
      stock: 5,
    };
    onAddToCart(mysteryProd, mysterySize, 1);
    setCurrentPage('cart');
  };

  const getAnimationClass = (anim: string | undefined) => {
    if (!anim || anim === 'none') return '';
    if (anim === 'fadeIn') return 'animate-fadeIn';
    if (anim === 'slideUp') return 'animate-slideUp';
    if (anim === 'pulse') return 'animate-pulse';
    return '';
  };

  return (
    <div className="space-y-0 w-full">
      {sections.map((section, idx) => {
        if (!section.visible || section.status === 'draft' || section.status === 'inactive' || section.id === 'mystery-box') return null;

        const containerStyle = `${section.bgColor} ${section.padding} ${section.margin} ${getAnimationClass(section.animation)} transition-all duration-300 relative`;
        const headingColor = section.bgColor.includes('emerald-9') || section.bgColor.includes('purple') || section.bgColor.includes('indigo') ? 'text-white' : 'text-emerald-950';
        const subColor = section.bgColor.includes('emerald-9') || section.bgColor.includes('purple') || section.bgColor.includes('indigo') ? 'text-emerald-300' : 'text-emerald-800';

        return (
          <div key={`${section.id}-${idx}`} className={containerStyle} id={`section-${section.id}`}>
            
            {/* SECTION RENDER DISTRIBUTOR */}

            {/* 1. HERO SLIDER DYNAMIC DISPLAY */}
            {section.id === 'hero-slider' && (
              <div className="relative overflow-hidden min-h-[460px] md:min-h-[560px] flex items-center justify-center bg-emerald-950 text-white rounded-3xl mx-2 md:mx-4 my-2 border border-emerald-900 shadow-xl">
                {activeHeroBanners.length > 0 ? (
                  (() => {
                    const currentSlide = activeHeroBanners[heroSlideIndex % activeHeroBanners.length];
                    if (!currentSlide) return null;

                    return (
                      <>
                        <picture className="absolute inset-0 w-full h-full">
                          {currentSlide.desktopImage && <source media="(min-width: 1024px)" srcSet={currentSlide.desktopImage} />}
                          {currentSlide.tabletImage && <source media="(min-width: 640px)" srcSet={currentSlide.tabletImage} />}
                          <img
                            src={
                              currentSlide.mobileImage ||
                              currentSlide.desktopImage ||
                              currentSlide.image ||
                              'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1600'
                            }
                            alt={currentSlide.title}
                            className="w-full h-full object-cover opacity-35 transition-all duration-700 scale-105"
                          />
                        </picture>

                        {/* Content Overlay */}
                        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 py-20 flex flex-col items-center justify-center space-y-6">
                          <span className="bg-emerald-500 text-emerald-950 text-[10px] font-mono tracking-widest px-4 py-1.5 rounded-full font-black uppercase">
                            {currentSlide.subtitle || section.subtitle || 'VINTAGE KITS CHAMPIONSHIP'}
                          </span>
                          <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none max-w-4xl font-display drop-shadow-md">
                            {currentSlide.title || section.title || 'THE HOLY GRAIL OF FOOTBALL'}
                          </h1>
                          <p className="text-xs md:text-base text-emerald-100 max-w-2xl leading-relaxed drop-shadow">
                            {currentSlide.description ||
                              'Genuine player issue kits, classic sponsor embroideries, and verified historical World Cup stock. Sourced globally, physically checked in Dhaka.'}
                          </p>
                          <div className="flex flex-wrap justify-center gap-4 pt-2">
                            <button
                              onClick={() => {
                                if (currentSlide.buttonUrl) {
                                  if (currentSlide.openNewTab) {
                                    window.open(currentSlide.buttonUrl, '_blank');
                                  } else {
                                    window.location.hash = currentSlide.buttonUrl;
                                  }
                                } else {
                                  setSelectedCategory('All');
                                  setCurrentPage('listing');
                                }
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-xl cursor-pointer transition-all hover:scale-105 shadow-lg"
                            >
                              {currentSlide.cta || currentSlide.ctaText || 'Explore Vault Catalog'}
                            </button>
                          </div>
                        </div>

                        {/* Navigation Carousel Controls if multiple slides */}
                        {activeHeroBanners.length > 1 && (
                          <>
                            <button
                              onClick={() => setHeroSlideIndex((prev) => (prev === 0 ? activeHeroBanners.length - 1 : prev - 1))}
                              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md transition-all cursor-pointer"
                              title="Previous Slide"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              onClick={() => setHeroSlideIndex((prev) => (prev + 1) % activeHeroBanners.length)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md transition-all cursor-pointer"
                              title="Next Slide"
                            >
                              <ChevronRight size={20} />
                            </button>

                            {/* Pagination Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                              {activeHeroBanners.map((_, dotIdx) => (
                                <button
                                  key={dotIdx}
                                  onClick={() => setHeroSlideIndex(dotIdx)}
                                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                                    heroSlideIndex % activeHeroBanners.length === dotIdx ? 'w-8 bg-emerald-400' : 'w-2.5 bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <div className="max-w-7xl mx-auto text-center text-white px-6 py-20 flex flex-col items-center justify-center space-y-6">
                    <span className="bg-emerald-500 text-emerald-950 text-[10px] font-mono tracking-widest px-4 py-1.5 rounded-full font-black uppercase">
                      {section.subtitle || 'VINTAGE KITS CHAMPIONSHIP'}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none max-w-4xl font-display">
                      {section.title || 'THE HOLY GRAIL OF FOOTBALL'}
                    </h1>
                    <p className="text-sm md:text-base text-emerald-100 max-w-xl leading-relaxed">
                      Genuine player issue kits, classic sponsor embroideries, and verified historical World Cup stock. Sourced globally, physically checked in Dhaka.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => { setSelectedCategory('All'); setCurrentPage('listing'); }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-xl cursor-pointer transition-all hover:scale-105"
                      >
                        Explore Vault Catalog
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. TRENDING SEARCHES BAR */}
            {section.id === 'trending-searches' && (
              <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <span className="text-[10px] font-mono font-black text-emerald-900 flex items-center gap-1.5 uppercase">
                  <Flame size={12} className="text-amber-500 animate-pulse" />
                  Trending searches BD:
                </span>
                {['Ronaldo 1998', 'Manchester United 1999', 'Argentina 1986', 'Beckham Real Madrid', 'Germany Retro Collar'].map((kw) => (
                  <button
                    key={kw}
                    onClick={() => {
                      setSelectedCategory('All');
                      setCurrentPage('listing');
                    }}
                    className="bg-white hover:bg-emerald-100/50 text-[10.5px] font-sans font-bold border border-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-full cursor-pointer transition-all"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            )}

            {/* 3. SHOP BY LEAGUE */}
            {section.id === 'shop-by-league' && (
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'SHOP BY LEAGUE'}</h2>
                  <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Browse kits grouped by European and Global leagues'}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    {
                      name: 'Premier League',
                      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/256px-Premier_League_Logo.svg.png',
                      id: 'England',
                      count: 18,
                    },
                    {
                      name: 'La Liga',
                      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/LaLiga_logo_%282023%29.svg/256px-LaLiga_logo_%282023%29.svg.png',
                      id: 'Classic',
                      count: 14,
                    },
                    {
                      name: 'Serie A',
                      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Serie_A_logo_%282019%29.svg/256px-Serie_A_logo_%282019%29.svg.png',
                      id: 'Classic',
                      count: 12,
                    },
                    {
                      name: 'Bundesliga',
                      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/256px-Bundesliga_logo_%282017%29.svg.png',
                      id: 'Classic',
                      count: 8,
                    },
                    {
                      name: 'World Cup Teams',
                      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/FIFA_World_Cup_trophy.svg/256px-FIFA_World_Cup_trophy.svg.png',
                      id: 'World Cup',
                      count: 24,
                    },
                    {
                      name: 'Bangladesh League',
                      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Bangladesh_Football_Federation_logo.svg/256px-Bangladesh_Football_Federation_logo.svg.png',
                      id: 'Current Season',
                      count: 6,
                    },
                  ].map((league) => (
                    <div
                      key={league.name}
                      onClick={() => {
                        setSelectedCategory(league.id);
                        setCurrentPage('listing');
                      }}
                      className="bg-emerald-50/20 hover:bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 group hover:scale-[1.03] flex flex-col items-center justify-between min-h-[160px]"
                    >
                      <div className="h-16 w-16 flex items-center justify-center mb-3">
                        <img
                          src={league.logo}
                          alt={`${league.name} Logo`}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-emerald-950 uppercase">{league.name}</h4>
                        <span className="text-[10px] text-emerald-700 font-mono font-bold mt-1 block">{league.count} verified shirts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. LIVE AUCTIONS / BIDDING SECTION */}
            {section.id === 'live-auction' && (
              <BiddingSection onAddToCart={onAddToCart} setCurrentPage={setCurrentPage} formatPrice={formatPrice} />
            )}

            {/* 5. SHOP BY CLUB */}
            {section.id === 'shop-by-club' && (
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'SHOP BY CLUB VAULTS'}</h2>
                  <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Classic team shields sourced directly from local collectors'}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {[
                    { name: 'Manchester United', badge: '🔴', id: 'Classic' },
                    { name: 'Real Madrid', badge: '⚪', id: 'Classic' },
                    { name: 'FC Barcelona', badge: '🔵', id: 'Classic' },
                    { name: 'AC Milan', badge: '⚫', id: 'Classic' },
                    { name: 'Arsenal FC', badge: '🔴', id: 'Classic' },
                    { name: 'Dhaka Abahani', badge: '🇧🇩', id: 'Current Season' },
                  ].map((club) => (
                    <div
                      key={club.name}
                      onClick={() => {
                        setSelectedCategory(club.id);
                        setCurrentPage('listing');
                      }}
                      className="flex flex-col items-center cursor-pointer group"
                    >
                      <div className="h-16 w-16 rounded-full bg-white border border-emerald-100 shadow-sm flex items-center justify-center text-2xl group-hover:bg-emerald-800 group-hover:text-white transition-all duration-300">
                        {club.badge}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-900 uppercase mt-2 text-center max-w-[100px] leading-tight group-hover:text-emerald-700">
                        {club.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. DAILY DEALS */}
            {section.id === 'daily-deals' && (
              <div className="max-w-7xl mx-auto px-6">
                <div className="bg-white border-2 border-amber-500 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white font-mono text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-sm">
                    FLASH OFFER VAULT
                  </div>
                  
                  {/* Countdown Timer Visual */}
                  <div className="space-y-4 md:border-r border-emerald-100 pr-0 md:pr-10">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-mono tracking-widest px-3 py-1 rounded-full font-extrabold uppercase">
                      HURRY! EXPIRES TODAY
                    </span>
                    <h3 className="text-2xl font-black text-emerald-950 uppercase leading-tight font-display">
                      {section.title || 'DAILY DEAL SPECIAL'}
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-sm">
                      Each morning we select one extremely coveted vintage kit and slash the price for collectors. Once the clock strikes midnight, the offer vanishes forever.
                    </p>
                    
                    <div className="flex gap-2 font-mono text-center">
                      <div className="bg-emerald-950 text-white p-2.5 rounded-lg min-w-[50px]">
                        <span className="block font-black text-base">{String(dealTimeLeft.hrs).padStart(2, '0')}</span>
                        <span className="text-[8px] text-emerald-400">HRS</span>
                      </div>
                      <span className="text-emerald-950 font-black self-center text-lg">:</span>
                      <div className="bg-emerald-950 text-white p-2.5 rounded-lg min-w-[50px]">
                        <span className="block font-black text-base">{String(dealTimeLeft.mins).padStart(2, '0')}</span>
                        <span className="text-[8px] text-emerald-400">MINS</span>
                      </div>
                      <span className="text-emerald-950 font-black self-center text-lg">:</span>
                      <div className="bg-emerald-950 text-white p-2.5 rounded-lg min-w-[50px]">
                        <span className="block font-black text-base">{String(dealTimeLeft.secs).padStart(2, '0')}</span>
                        <span className="text-[8px] text-emerald-400">SECS</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlight Deal Product card */}
                  <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
                    {products[0] ? (
                      <>
                        <img 
                          src={products[0].image} 
                          alt={products[0].name} 
                          className="h-44 w-36 object-contain rounded-xl bg-emerald-50/50 p-2 border border-emerald-100"
                        />
                        <div className="space-y-3 flex-1">
                          <div className="flex gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400" />)}
                          </div>
                          <h4 className="text-base font-extrabold text-emerald-950 uppercase leading-snug">{products[0].name}</h4>
                          <p className="text-[10px] text-emerald-700 font-mono">Size Available: M, L • Mint Vintage Condition</p>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-red-600">{formatPrice(products[0].price * 0.7)}</span>
                            <span className="text-xs text-emerald-700 line-through font-bold">{formatPrice(products[0].price)}</span>
                            <span className="bg-rose-100 text-rose-800 text-[9px] font-mono font-black px-2 py-0.5 rounded">SAVE 30%</span>
                          </div>
                          <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-amber-500 h-full w-[80%]" />
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-emerald-800">
                            <span>Only 2 items left in Bailey Road store</span>
                            <span className="font-bold">80% Claimed</span>
                          </div>
                          <button
                            onClick={() => onSelectProduct(products[0])}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl cursor-pointer w-full transition-all"
                          >
                            CLAIM DAILY FLASH DEAL
                          </button>
                        </div>
                      </>
                      ) : (
                        <p className="text-emerald-800 text-xs font-mono">No items active in flash desk.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* 7. FEATURED COLLECTION */}
            {section.id === 'featured-collection' && (
              <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="flex justify-between items-end border-b border-emerald-100 pb-3">
                  <div>
                    <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'FEATURED COLLECTION'}</h2>
                    <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Rare vintage physical restocks checked this week'}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedCategory('All'); setCurrentPage('listing'); }}
                    className="text-xs font-bold font-mono text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    VIEW ALL <ArrowRight size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.filter(p => p.isFeatured).slice(0, 4).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={onSelectProduct}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === prod.id)}
                      onQuickAdd={handleQuickAdd}
                      onUpdateImage={handleUpdateProductImage}
                      formatPrice={formatPrice}
                      onCheckout={handleCheckoutDirectly}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 8. WORLD CUP COLLECTION */}
            {section.id === 'worldcup-collection' && (
              <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="flex justify-between items-end border-b border-emerald-100 pb-3">
                  <div>
                    <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'WORLD CUP VAULT'}</h2>
                    <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Historic World Cup reissues'}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedCategory('World Cup'); setCurrentPage('listing'); }}
                    className="text-xs font-bold font-mono text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    EXPLORE VAULT <ArrowRight size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.filter(p => p.category === 'World Cup' || p.club === 'France' || p.country === 'Brazil').slice(0, 4).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={onSelectProduct}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === prod.id)}
                      onQuickAdd={handleQuickAdd}
                      onUpdateImage={handleUpdateProductImage}
                      formatPrice={formatPrice}
                      onCheckout={handleCheckoutDirectly}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 9. CURRENT SEASON */}
            {section.id === 'current-season' && (
              <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="flex justify-between items-end border-b border-emerald-100 pb-3">
                  <div>
                    <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'CURRENT SEASON'}</h2>
                    <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Modern team kit collections'}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedCategory('Current Season'); setCurrentPage('listing'); }}
                    className="text-xs font-bold font-mono text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    EXPLORE MODERN <ArrowRight size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.filter(p => p.category === 'Current Season').slice(0, 4).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={onSelectProduct}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === prod.id)}
                      onQuickAdd={handleQuickAdd}
                      onUpdateImage={handleUpdateProductImage}
                      formatPrice={formatPrice}
                      onCheckout={handleCheckoutDirectly}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 10. MYSTERY BOX CHALLENGE */}
            {section.id === 'mystery-box' && (
              <div className="max-w-5xl mx-auto px-6 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <span className="bg-purple-800 text-purple-100 text-[10px] font-mono tracking-widest px-3 py-1 rounded-full font-black uppercase">
                      HOLOGRAPHIC VERIFIED SEALS
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none font-display">
                      {section.title || 'THE RETRO MYSTERY BOX'}
                    </h2>
                    <p className="text-xs text-indigo-200 leading-relaxed">
                      Select your desired collar size and we will dispatch one 100% genuine vintage shirt. Sourced directly from our premium private collection caches in Barcelona, Tokyo, and Buenos Aires. Each mystery box includes an authenticated physical certificate, tissue wrap, and special edition collectors box packaging.
                    </p>
                    
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono font-bold text-indigo-300 uppercase">CHOOSE YOUR CHEST COLLAR SIZE:</label>
                      <div className="flex gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setMysterySize(sz)}
                            className={`h-11 w-11 rounded-lg border text-xs font-mono font-black transition-all cursor-pointer ${mysterySize === sz ? 'bg-purple-500 text-white border-purple-400 shadow-md scale-105' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t border-purple-800 pt-4">
                      <div>
                        <span className="text-[10px] font-mono block text-purple-300 uppercase">PROMOTIONAL OFFER PRICE:</span>
                        <h3 className="text-3xl font-black text-purple-300">{formatPrice(130)} <span className="text-xs line-through text-indigo-400 font-bold">{formatPrice(220)}</span></h3>
                      </div>
                      <button
                        onClick={handleBuyMysteryBox}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        <Gift size={14} /> Buy Mystery Box
                      </button>
                    </div>
                  </div>

                  <div className="relative flex justify-center">
                    <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
                    <img
                      src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800"
                      alt="Mystery Box Obsidians"
                      className="h-64 md:h-80 object-contain rounded-3xl relative z-10 hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 11. CLEARANCE RACK */}
            {section.id === 'clearance' && (
              <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="flex justify-between items-end border-b border-emerald-100 pb-3">
                  <div>
                    <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'CLEARANCE RACK'}</h2>
                    <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Authentic vintage shirts with high markdown clearances'}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedCategory('Clearance'); setCurrentPage('listing'); }}
                    className="text-xs font-bold font-mono text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    EXPLORE OUTLET <ArrowRight size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.filter(p => p.category === 'Clearance' || p.originalPrice).slice(0, 4).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={onSelectProduct}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === prod.id)}
                      onQuickAdd={handleQuickAdd}
                      onUpdateImage={handleUpdateProductImage}
                      formatPrice={formatPrice}
                      onCheckout={handleCheckoutDirectly}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 12. BEST SELLERS */}
            {section.id === 'best-sellers' && (
              <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="flex justify-between items-end border-b border-emerald-100 pb-3">
                  <div>
                    <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'BEST SELLERS'}</h2>
                    <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'The absolute high demand collector favorites'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.filter(p => p.isBestSeller).slice(0, 4).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={onSelectProduct}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === prod.id)}
                      onQuickAdd={handleQuickAdd}
                      onUpdateImage={handleUpdateProductImage}
                      formatPrice={formatPrice}
                      onCheckout={handleCheckoutDirectly}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 13. LATEST PRODUCTS */}
            {section.id === 'latest-products' && (
              <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="flex justify-between items-end border-b border-emerald-100 pb-3">
                  <div>
                    <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'LATEST ARRIVALS'}</h2>
                    <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Freshly physical laboratory-audited additions'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={onSelectProduct}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlist.some((w) => w.id === prod.id)}
                      onQuickAdd={handleQuickAdd}
                      onUpdateImage={handleUpdateProductImage}
                      formatPrice={formatPrice}
                      onCheckout={handleCheckoutDirectly}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 14. POPULAR TEAMS */}
            {section.id === 'popular-teams' && (
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'POPULAR NATIONS'}</h2>
                  <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Rep the giants of football'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'France', logo: '🇫🇷', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800' },
                    { name: 'Brazil', logo: '🇧🇷', img: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800' },
                    { name: 'England', logo: '🇬🇧', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800' },
                    { name: 'Germany', logo: '🇩🇪', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800' },
                  ].map((team) => (
                    <div
                      key={team.name}
                      onClick={() => {
                        setSelectedCategory('World Cup');
                        setCurrentPage('listing');
                      }}
                      className="bg-white border border-emerald-100 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:scale-[1.02] transition-all"
                    >
                      <img src={team.img} className="h-40 w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" alt={team.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent flex items-end p-4">
                        <div>
                          <span className="text-2xl block mb-1">{team.logo}</span>
                          <h4 className="text-sm font-black text-white uppercase">{team.name} Classic Vault</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 15. SHOP BY LEGENDS */}
            {section.id === 'shop-by-legends' && (
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'THE LEGENDS STORE'}</h2>
                  <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Authentic namesets from history’s ultimate deities'}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                  {[
                    { name: 'Maradona', number: 10, flag: '🇦🇷' },
                    { name: 'Beckham', number: 7, flag: '🇬🇧' },
                    { name: 'Zidane', number: 10, flag: '🇫🇷' },
                    { name: 'Ronaldinho', number: 10, flag: '🇧🇷' },
                    { name: 'Messi', number: 10, flag: '🇦🇷' },
                    { name: 'Cristiano', number: 7, flag: '🇵🇹' },
                  ].map((legend) => (
                    <div
                      key={legend.name}
                      onClick={() => {
                        setSelectedCategory('Legends');
                        setCurrentPage('listing');
                      }}
                      className="bg-emerald-50/10 hover:bg-emerald-50/60 border border-emerald-100 hover:border-emerald-300 p-4 rounded-full text-center cursor-pointer transition-all duration-300 flex items-center gap-3.5 group"
                    >
                      <div className="h-12 w-12 rounded-full bg-emerald-950 text-emerald-400 font-mono font-black flex items-center justify-center text-sm shadow">
                        No.{legend.number}
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] block text-emerald-700 font-mono font-black">{legend.flag} HERO</span>
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">{legend.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 16. COMMUNITY GALLERY */}
            {section.id === 'community-gallery' && (
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'DHAKA FAN GALLERY'}</h2>
                  <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Collectors sharing physical tags unboxings in Banani, Gulshan & Bailey Road'}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
                    'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=600',
                    'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=600',
                    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600'
                  ].map((imgUrl, idx) => (
                    <div key={idx} className="bg-white border border-emerald-100 rounded-2xl overflow-hidden relative group shadow-sm">
                      <img src={imgUrl} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300" alt="community" />
                      <div className="absolute bottom-2 left-2 bg-emerald-950/80 text-white rounded px-2 py-0.5 text-[9px] font-mono font-bold">
                        Verified Buyer Dhaka #{idx+1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 17. TESTIMONIALS */}
            {section.id === 'testimonials' && (
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'VERIFIED COLLECTOR REVIEWS'}</h2>
                  <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Review logs verified by Bangladesh vintage authentication experts'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 1, name: 'Siyam Rahman', quote: 'The AC Milan 1996 shirt has absolute perfect manufacturer stitching tags. Authentic holographic stamps included. Highly recommended for premium kit collectors in Dhaka.', rating: 5, date: '2026-07-12' },
                    { id: 2, name: 'Fahim Chowdhury', quote: 'Been looking for the France 1998 Zidane jersey for literal years. Finally secured it at Jersey Addicts BD with custom physics certificates. Unrivaled experience.', rating: 5, date: '2026-07-08' },
                    { id: 3, name: 'Anika Bushra', quote: 'Extremely fast delivery inside Dhaka (secured within 24 hours). The vacuum packaging smelled wonderful, complete with care instructions.', rating: 5, date: '2026-07-05' }
                  ].map((t) => (
                    <div key={t.id} className="bg-white border border-emerald-100 p-5 rounded-2xl space-y-3 relative shadow-sm">
                      <div className="flex gap-1 text-amber-500">
                        {[...Array(t.rating)].map((_, i) => <Star key={i} size={11} className="fill-amber-500 text-amber-500" />)}
                      </div>
                      <p className="text-emerald-800 text-[11.5px] italic leading-relaxed">"{t.quote}"</p>
                      <div className="border-t border-emerald-100 pt-2 flex justify-between items-center text-[10px] font-mono">
                        <span className="text-emerald-950 font-bold">{t.name.toUpperCase()}</span>
                        <span className="text-emerald-700 font-bold">✓ VERIFIED COLLECTOR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 18. VIDEO BANNER */}
            {section.id === 'video-banner' && (
              <div className="max-w-5xl mx-auto px-6 text-white text-center space-y-6">
                <span className="bg-emerald-500 text-emerald-950 text-[10px] font-mono tracking-widest px-3 py-1 rounded-full font-black uppercase">
                  DOCUMENTARY FEATURE
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none font-display">
                  {section.title || 'Micro-Fabric Authentication Suite'}
                </h2>
                <p className="text-xs text-emerald-200 max-w-xl mx-auto">
                  A look behind our rigorous 12-point micro-fabric check laboratory. Watch how we analyze individual wash care tagging patterns, emblem cross stitching, and vintage button engravings.
                </p>
                <div className="relative max-w-xl mx-auto h-52 md:h-64 rounded-3xl overflow-hidden border border-emerald-800 shadow-2xl bg-emerald-900 flex items-center justify-center cursor-pointer group">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all" />
                  <div className="h-16 w-16 rounded-full bg-white text-emerald-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10">
                    <Play size={20} className="fill-emerald-950 translate-x-0.5" />
                  </div>
                  <span className="absolute bottom-4 right-4 bg-emerald-950/80 text-[9px] font-mono px-2 py-0.5 rounded text-emerald-300">
                    04:12 HD DOCUMENTARY
                  </span>
                </div>
              </div>
            )}

            {/* 19. INSTAGRAM FEED */}
            {section.id === 'instagram-feed' && (
              <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'INSTAGRAM CATALOGUE'}</h2>
                  <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Real-time photos of collector feedback in Bangladesh'}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=400',
                    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400',
                    'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=400',
                    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=400',
                  ].map((imgUrl, i) => (
                    <div key={i} className="aspect-square bg-emerald-50 rounded-2xl overflow-hidden relative group cursor-pointer border border-emerald-100">
                      <img src={imgUrl} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" alt="instagram" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono gap-1.5 font-bold">
                        <Heart size={14} className="fill-white" /> 184 LIKES
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 20. NEWSLETTER */}
            {section.id === 'newsletter' && (
              <div className="max-w-4xl mx-auto px-6 text-center text-white space-y-5">
                <span className="bg-emerald-800 text-emerald-100 text-[9px] font-mono tracking-widest px-3 py-1 rounded-full font-black uppercase">
                  ZERO SPAM SECURE NETWORK
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none font-display">
                  {section.title || 'Be First to Receive Restocks'}
                </h2>
                <p className="text-xs text-emerald-200 max-w-md mx-auto">
                  Our physical inventory checks complete on Saturdays. Join our email alert newsletter to get catalog listings 2 hours before standard publication.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-xs font-mono text-white placeholder-emerald-300 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  <button 
                    onClick={() => alert('Successfully joined the exclusive Dhaka restock newsletter circle!')}
                    className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer whitespace-nowrap transition-all"
                  >
                    Subscribe Alerts
                  </button>
                </div>
              </div>
            )}

            {/* 21. STORE LOCATIONS */}
            {section.id === 'store-locations' && (
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${headingColor}`}>{section.title || 'VISIT OUR OUTLET VAULTS'}</h2>
                  <p className={`text-xs font-mono ${subColor}`}>{section.subtitle || 'Stop by for sizing configurations and physically authenticated checks'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {[
                    { city: 'Dhaka HQ Bailey Road', address: 'Shop No. 8, 3rd Floor, AQP Shopping Mall, 143/2 New Bailey Road, Dhaka 1217, Bangladesh', hours: '11:00 AM - 09:30 PM (Saturday - Thursday)', phone: '+880 1840-990700' },
                    { city: 'Banani Sourcing Vault', address: 'Plot 42, Block E, Banani Road 11, Dhaka 1213, Bangladesh', hours: 'By Sourcing Appointment Only', phone: '+880 1711-223344' }
                  ].map((loc) => (
                    <div key={loc.city} className="bg-white border border-emerald-100 p-6 rounded-2xl space-y-3 shadow-sm relative">
                      <span className="absolute top-4 right-4 text-emerald-800"><MapPin size={20} /></span>
                      <h4 className="text-xs font-black text-emerald-950 uppercase">{loc.city}</h4>
                      <p className="text-[11px] text-emerald-800 leading-relaxed font-sans">{loc.address}</p>
                      <div className="text-[9px] font-mono text-emerald-700 space-y-1 pt-2 border-t border-emerald-50">
                        <span className="block">🕒 HOURS: {loc.hours}</span>
                        <span className="block">☎ TELEPHONE: {loc.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        );
      })}

      {/* DYNAMIC POPUP BANNER MODAL OVERLAY */}
      {showPopupBanner && activePopupBanner && (
        <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-auto">
            <button
              onClick={() => setShowPopupBanner(false)}
              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
              title="Close Popup"
            >
              <X size={16} />
            </button>

            <div className="relative h-56 bg-emerald-950 overflow-hidden">
              <picture className="w-full h-full">
                {activePopupBanner.desktopImage && <source media="(min-width: 1024px)" srcSet={activePopupBanner.desktopImage} />}
                {activePopupBanner.tabletImage && <source media="(min-width: 640px)" srcSet={activePopupBanner.tabletImage} />}
                <img
                  src={
                    activePopupBanner.mobileImage ||
                    activePopupBanner.desktopImage ||
                    activePopupBanner.image ||
                    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={activePopupBanner.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent p-6 flex flex-col justify-end">
                <span className="bg-emerald-500 text-emerald-950 text-[9px] font-mono tracking-widest px-3 py-1 rounded-full font-black uppercase w-max mb-1">
                  {activePopupBanner.subtitle || 'LIMITED EDITION PROMO'}
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">
                  {activePopupBanner.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4 text-center">
              <p className="text-xs text-emerald-800 leading-relaxed font-sans">
                {activePopupBanner.description || 'Exclusive deal offer available now for vault members.'}
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowPopupBanner(false);
                    if (activePopupBanner.buttonUrl) {
                      if (activePopupBanner.openNewTab) {
                        window.open(activePopupBanner.buttonUrl, '_blank');
                      } else {
                        window.location.hash = activePopupBanner.buttonUrl;
                      }
                    } else {
                      setSelectedCategory('All');
                      setCurrentPage('listing');
                    }
                  }}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-md hover:scale-[1.02]"
                >
                  {activePopupBanner.cta || activePopupBanner.ctaText || 'CLAIM EXCLUSIVE ACCESS'}
                </button>
                <button
                  onClick={() => setShowPopupBanner(false)}
                  className="text-[10px] font-mono text-emerald-700 hover:underline uppercase py-1"
                >
                  No thanks, continue browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
