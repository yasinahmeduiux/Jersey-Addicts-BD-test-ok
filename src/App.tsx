import React, { useState, useMemo, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PRODUCTS, CUSTOMER_REVIEWS, SELLER_REQUESTS } from './data/storeData';
import { Product, CartItem, SellerRequest, Order, CarouselSlide, User, AppConfig } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BiddingSection } from './components/BiddingSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { AdminPanel } from './components/AdminPanel';
import { CustomerDashboard } from './components/CustomerDashboard';
import { SellerModule } from './components/SellerModule';
import { InfoPages } from './components/InfoPages';
import { Footer } from './components/Footer';
import { AuthScreen } from './components/AuthScreen';
import { DynamicPageRenderer } from './components/DynamicPageRenderer';
import { SlidersHorizontal, ArrowRight, CheckCircle, ShieldCheck, Heart, Sparkles, MessageSquare, BookOpen, Star, RotateCcw, Printer, Receipt, ShoppingBag, Download } from 'lucide-react';

const INITIAL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'WORLD CUP 2026 EDITION',
    subtitle: 'The Grandest Stage of Football',
    description: 'Explore the official jerseys, limited-edition jerseys, and exclusive fan collections for the upcoming FIFA World Cup 2026. Support your nation in style!',
    badge: 'WORLD CUP 2026 EXCLUSIVE',
    primaryColor: 'from-[#0b3c5d] to-[#041c2c]',
    productId: 'shirt-5',
    customImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1600'
  },
  {
    id: 'slide-2',
    title: 'BECKHAM EURO 2004',
    subtitle: 'England Timeless Home Classics',
    description: 'The iconic Umbro shoulder stripe returns. Mint condition deadstock with original certificate of vintage authentication.',
    badge: 'GOLDEN GENERATION',
    primaryColor: 'from-[#1e3a8a] to-[#0f172a]',
    productId: 'shirt-2',
  },
  {
    id: 'slide-3',
    title: 'PREMIUM SURPRISE VAULT',
    subtitle: 'The Ultimate Mystery Shirt Experience',
    description: 'Choose your size, and let our curators surprise you with a 100% genuine vintage or current season official kit in a premium presentation pack.',
    badge: 'TOP SELLING ANNUALLY',
    primaryColor: 'from-[#064e3b] to-[#022c22]',
    productId: 'shirt-7',
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr-super-admin',
    email: 'superadmin@jerseyaddicts.bd',
    fullName: 'Kazi Yasin Ahmed (Super Admin Root)',
    role: 'Super Admin',
    password: '01840990700',
    simulatedIp: '103.230.104.5',
    location: 'Dhaka HQ, Bangladesh',
    department: 'Executive Governance',
    status: 'Active',
    permissions: ['all_access', 'manage_users', 'manage_roles', 'manage_products', 'manage_orders', 'manage_inventory', 'manage_customers', 'manage_content', 'system_settings'],
    assignedBy: 'System Root',
    createdAt: '2026-01-01',
    lastLogin: '2026-07-24 09:15 AM',
    phone: '+880 1840-990700',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-admin-dhaka',
    email: 'admin.dhaka@vault.bd',
    fullName: 'Rashedul Bari (General Store Manager)',
    role: 'Admin',
    password: '01840990700',
    simulatedIp: '103.230.104.12',
    location: 'Dhaka, Bangladesh',
    department: 'Operations',
    status: 'Active',
    permissions: ['manage_products', 'manage_orders', 'manage_inventory', 'manage_customers', 'manage_content'],
    assignedBy: 'Kazi Yasin Ahmed',
    createdAt: '2026-02-10',
    lastLogin: '2026-07-23 04:30 PM',
    phone: '+880 1711-223344',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-inv-mgr',
    email: 'inventory@jerseyaddicts.bd',
    fullName: 'Tanvir Hossain (Inventory Captain)',
    role: 'Inventory Manager',
    password: 'password123',
    simulatedIp: '103.230.104.22',
    location: 'Dhaka Central Warehouse',
    department: 'Warehouse & Logistics',
    status: 'Active',
    permissions: ['manage_products', 'manage_inventory', 'stock_adjustment', 'restock_logs'],
    assignedBy: 'Kazi Yasin Ahmed',
    createdAt: '2026-03-01',
    lastLogin: '2026-07-24 08:00 AM',
    phone: '+880 1819-334455',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-order-mgr',
    email: 'orders@jerseyaddicts.bd',
    fullName: 'Farzana Chowdhury (Dispatch & Courier Lead)',
    role: 'Order Manager',
    password: 'password123',
    simulatedIp: '103.230.104.33',
    location: 'Bailey Road Dispatch Desk',
    department: 'Fulfillment & Express Shipping',
    status: 'Active',
    permissions: ['manage_orders', 'update_courier', 'process_refunds', 'print_invoices'],
    assignedBy: 'Kazi Yasin Ahmed',
    createdAt: '2026-03-15',
    lastLogin: '2026-07-24 09:05 AM',
    phone: '+880 1912-445566',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-support',
    email: 'support@jerseyaddicts.bd',
    fullName: 'Sultana Parveen (VIP Customer Care)',
    role: 'Customer Support',
    password: 'password123',
    simulatedIp: '103.230.104.44',
    location: 'Dhaka HQ Desk',
    department: 'Customer Relations',
    status: 'Active',
    permissions: ['view_customers', 'manage_reviews', 'view_orders', 'customer_notes'],
    assignedBy: 'Rashedul Bari',
    createdAt: '2026-04-01',
    lastLogin: '2026-07-23 06:12 PM',
    phone: '+880 1515-556677',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-content-mgr',
    email: 'content@jerseyaddicts.bd',
    fullName: 'Fahim Shahriar (Creative & Media Lead)',
    role: 'Content Manager',
    password: 'password123',
    simulatedIp: '103.230.104.55',
    location: 'Dhaka Studio',
    department: 'Digital Marketing',
    status: 'Active',
    permissions: ['manage_banners', 'manage_blogs', 'manage_pages', 'manage_gallery'],
    assignedBy: 'Kazi Yasin Ahmed',
    createdAt: '2026-04-10',
    lastLogin: '2026-07-22 11:30 AM',
    phone: '+880 1611-778899',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-seller-partner',
    email: 'seller.partner@vault.bd',
    fullName: 'Anik Rahman (Verified Vintage Collector Partner)',
    role: 'Seller',
    password: 'password123',
    simulatedIp: '103.230.104.66',
    location: 'Chittagong, Bangladesh',
    department: 'Seller Portal',
    status: 'Active',
    permissions: ['seller_portal', 'submit_kits', 'view_own_sales'],
    assignedBy: 'Rashedul Bari',
    createdAt: '2026-05-01',
    lastLogin: '2026-07-21 02:20 PM',
    phone: '+880 1818-990011',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'customer-marcus',
    email: 'customer@vault.com',
    fullName: 'Marcus Rashford',
    role: 'Customer',
    password: 'password',
    simulatedIp: '82.165.122.9',
    location: 'Manchester, UK',
    department: 'Buyer',
    status: 'Active',
    permissions: [],
    phone: '+44 7700 900077',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
  }
];

const DEFAULT_APP_CONFIG: AppConfig = {
  logoText: 'Jersey Addicts BD',
  logoSubtext: '',
  theme: 'bengal',
  footerAbout: "The world's premium destination for verified original vintage football jerseys. Founded by obsessive collectors, for obsessive collectors. Every kit undergoes a rigorous 12-point authentication process in our physical workshops in Dhaka, Bangladesh.",
  footerLocations: [
    { city: 'Dhaka HQ', address: 'Shop No. 8, 3rd Floor, AQP Shopping Mall, 143/2 New Bailey Road, Dhaka 1217, Bangladesh', phone: '+880 1840-990700' }
  ],
  footerCopyright: '© 2026 Jersey Addicts BD. All rights reserved. Registered trademark. Crafted for Bangladeshi Fans.',
  currencySymbol: '৳',
  currencyCode: 'BDT',
  exchangeRate: 115,
  timerTeam1: 'ESP',
  timerTeam1Emoji: '🇪🇸',
  timerTeam2: 'BEL',
  timerTeam2Emoji: '🇧🇪',
  timerLabel: 'QUARTER-FINAL',
  timerTargetHours: 20,
  timerEnabled: true,
  pages: [
    { id: 'World Cup', name: 'World Cup Vault', slug: 'world-cup', isCustom: false, visible: true, sections: [] },
    { id: 'England', name: 'England Classic', slug: 'england', isCustom: false, visible: true, sections: [] },
    { id: 'Legends', name: 'Legends Store', slug: 'legends', isCustom: false, visible: true, sections: [] },
    { id: 'Current Season', name: 'Current Season', slug: 'current-season', isCustom: false, visible: true, sections: [] },
    { id: 'Mystery', name: 'Mystery Box', slug: 'mystery', isCustom: false, visible: true, sections: [] },
    { id: 'Clearance', name: 'Clearance', slug: 'clearance', isCustom: false, visible: true, sections: [] },
    { id: 'Classic', name: 'Club Classic', slug: 'classic', isCustom: false, visible: true, sections: [] }
  ],
  homepageSections: [
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
    { id: 'store-locations', name: 'Physical Store Maps', visible: true, bgColor: 'bg-white', padding: 'py-12', margin: 'my-0', title: 'PHYSICAL OUTLET POINTS', subtitle: 'Visit us for physical sizing and authentications', status: 'active' }
  ],
  banners: [
    {
      id: 'banner-hero-1',
      name: 'Hero Banner Slider',
      type: 'Hero Slider',
      desktopImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=640',
      title: 'WORLD CUP 2026 EDITION',
      subtitle: 'The Grandest Stage of Football',
      description: 'Support your nation with authentic retro & current match kits.',
      cta: 'SHOP VAULT',
      ctaText: 'SHOP VAULT',
      buttonUrl: '#listing',
      openNewTab: false,
      scheduleStart: '2026-07-01',
      scheduleEnd: '2026-08-31',
      status: 'Active'
    },
    {
      id: 'banner-category-1',
      name: 'Category Banner',
      type: 'Category Banner',
      desktopImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=640',
      title: 'VINTAGE CLUB CLASSICS',
      subtitle: 'Sourced Direct from European Vaults',
      description: 'Rare 90s Manchester United, Real Madrid, AC Milan, and Barcelona kits.',
      cta: 'EXPLORE CLUBS',
      ctaText: 'EXPLORE CLUBS',
      buttonUrl: '#listing',
      openNewTab: false,
      scheduleStart: '2026-07-01',
      scheduleEnd: '2026-12-31',
      status: 'Active'
    },
    {
      id: 'banner-collection-1',
      name: 'Collection Banner',
      type: 'Collection Banner',
      desktopImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=640',
      title: 'QATAR 2022 CHAMPIONS',
      subtitle: 'Argentina Three Stars',
      description: 'Exclusive re-issue of Messi No.10 authentic match jerseys.',
      cta: 'CLAIM KIT',
      ctaText: 'CLAIM KIT',
      buttonUrl: '#listing',
      openNewTab: true,
      scheduleStart: '2026-07-10',
      scheduleEnd: '2026-08-10',
      status: 'Active'
    },
    {
      id: 'banner-league-1',
      name: 'League Banner',
      type: 'League Banner',
      desktopImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=640',
      title: 'PREMIER LEAGUE ANTHOLOGY',
      subtitle: 'English Heritage Collections',
      description: 'Unrivaled collections of English soccer legacy.',
      cta: 'EXPLORE LEAGUE',
      ctaText: 'EXPLORE LEAGUE',
      buttonUrl: '#listing',
      openNewTab: false,
      scheduleStart: '2026-07-01',
      scheduleEnd: '2026-09-30',
      status: 'Active'
    },
    {
      id: 'banner-popup-1',
      name: 'Popup Banner',
      type: 'Popup Banner',
      desktopImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
      tabletImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
      mobileImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=640',
      title: 'WELCOME TO DHAKA VAULT',
      subtitle: 'Get 15% Off Your First Authentic Kit',
      description: 'Use promo coupon CLASSIC15 at checkout. Verified physical stock on Bailey Road.',
      cta: 'CLAIM 15% DISCOUNT',
      ctaText: 'CLAIM 15% DISCOUNT',
      buttonUrl: '#listing',
      openNewTab: false,
      scheduleStart: '2026-07-15',
      scheduleEnd: '2026-08-31',
      status: 'Inactive'
    },
    {
      id: 'banner-offer-1',
      name: 'Offer Banner',
      type: 'Offer Banner',
      desktopImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=640',
      title: 'MONSOON CLEARANCE SURGE',
      subtitle: 'Up to 45% Off Selected Deadstock Kits',
      description: 'No replicas. Pure original vintage jerseys. While physical stocks last.',
      cta: 'SHOP CLEARANCE',
      ctaText: 'SHOP CLEARANCE',
      buttonUrl: '#listing',
      openNewTab: false,
      scheduleStart: '2026-07-18',
      scheduleEnd: '2026-08-15',
      status: 'Active'
    },
    {
      id: 'banner-newsletter-1',
      name: 'Newsletter Banner',
      type: 'Newsletter Banner',
      desktopImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=640',
      title: 'JOIN THE COLLECTORS CIRCLE',
      subtitle: 'Get Notified of Dhaka Restocks First',
      description: 'No spam. Just ultra-rare physical kit drops sent straight to your inbox.',
      cta: 'SUBSCRIBE NOW',
      ctaText: 'SUBSCRIBE NOW',
      buttonUrl: '#newsletter',
      openNewTab: false,
      scheduleStart: '2026-07-01',
      scheduleEnd: '2026-12-31',
      status: 'Active'
    },
    {
      id: 'banner-footer-1',
      name: 'Footer Banner',
      type: 'Footer Banner',
      desktopImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=640',
      title: 'DHAKA AUTHENTICATION LAB',
      subtitle: '100% Genuine Physical Guarantee',
      description: 'Every jersey inspected under 12-point micro-stitching and holographic tag protocols.',
      cta: 'READ PROMISE',
      ctaText: 'READ PROMISE',
      buttonUrl: '#about',
      openNewTab: false,
      scheduleStart: '2026-07-01',
      scheduleEnd: '2026-12-31',
      status: 'Active'
    },
    {
      id: 'banner-blog-1',
      name: 'Blog Banner',
      type: 'Blog Banner',
      desktopImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=640',
      title: 'RETRO KIT JOURNAL',
      subtitle: 'Stories Behind Iconic World Cup Apparel',
      description: 'Explore historical deep dives on legendary jersey designs and match-worn artifacts.',
      cta: 'READ JOURNAL',
      ctaText: 'READ JOURNAL',
      buttonUrl: '#blogs',
      openNewTab: false,
      scheduleStart: '2026-07-01',
      scheduleEnd: '2026-12-31',
      status: 'Active'
    },
    {
      id: 'banner-mobile-1',
      name: 'Mobile Banner',
      type: 'Mobile Banner',
      desktopImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1600',
      tabletImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1024',
      mobileImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=640',
      title: 'DHAKA EXPRESS DELIVERY',
      subtitle: 'Same-Day Shipping Across Dhaka',
      description: 'Order authentic kits before 3 PM for instant physical delivery to your doorstep.',
      cta: 'EXPRESS ORDER',
      ctaText: 'EXPRESS ORDER',
      buttonUrl: '#listing',
      openNewTab: false,
      scheduleStart: '2026-07-01',
      scheduleEnd: '2026-12-31',
      status: 'Active'
    }
  ],
  menuItems: [
    // Main Menu Items
    { id: 'nav-main-1', name: 'All Jerseys', placement: 'Main Menu', parentId: null, icon: 'Shirt', order: 1, url: 'All', status: 'Active' },
    { id: 'nav-main-2', name: 'World Cup Vault', placement: 'Main Menu', parentId: null, icon: 'Trophy', order: 2, url: 'World Cup', status: 'Active', badgeText: 'RARE' },
    { id: 'nav-main-3', name: 'England Classic', placement: 'Main Menu', parentId: null, icon: 'Flame', order: 3, url: 'England', status: 'Active' },
    { id: 'nav-main-4', name: 'Legends Store', placement: 'Main Menu', parentId: null, icon: 'Star', order: 4, url: 'Legends', status: 'Active', badgeText: 'HOT' },
    { id: 'nav-main-5', name: 'Current Season', placement: 'Main Menu', parentId: null, icon: 'Sparkles', order: 5, url: 'Current Season', status: 'Active' },
    { id: 'nav-main-6', name: 'Mystery Box', placement: 'Main Menu', parentId: null, icon: 'Box', order: 6, url: 'Mystery', status: 'Active', badgeText: 'POPULAR' },
    { id: 'nav-main-7', name: 'Clearance Vault', placement: 'Main Menu', parentId: null, icon: 'Tag', order: 7, url: 'Clearance', status: 'Active' },

    // Mega Menu Parent Columns & Children
    { id: 'nav-mega-cat-1', name: 'Top League Classics', placement: 'Mega Menu', parentId: null, icon: 'Trophy', order: 1, url: '#listing', status: 'Active' },
    { id: 'nav-mega-item-1', name: 'Premier League Retros', placement: 'Mega Menu', parentId: 'nav-mega-cat-1', icon: 'Shirt', order: 1, url: 'Premier League', status: 'Active' },
    { id: 'nav-mega-item-2', name: 'La Liga Legends', placement: 'Mega Menu', parentId: 'nav-mega-cat-1', icon: 'Award', order: 2, url: 'La Liga', status: 'Active' },
    { id: 'nav-mega-item-3', name: 'Serie A Golden Era', placement: 'Mega Menu', parentId: 'nav-mega-cat-1', icon: 'ShieldCheck', order: 3, url: 'Serie A', status: 'Active' },

    { id: 'nav-mega-cat-2', name: 'Legendary Player Drops', placement: 'Mega Menu', parentId: null, icon: 'Star', order: 2, url: '#listing', status: 'Active' },
    { id: 'nav-mega-item-4', name: 'Messi No. 10 Re-issues', placement: 'Mega Menu', parentId: 'nav-mega-cat-2', icon: 'Sparkles', order: 1, url: 'Messi', status: 'Active', badgeText: 'HOT' },
    { id: 'nav-mega-item-5', name: 'Maradona World Cup 86', placement: 'Mega Menu', parentId: 'nav-mega-cat-2', icon: 'Flame', order: 2, url: 'Maradona', status: 'Active', badgeText: 'VAULT' },
    { id: 'nav-mega-item-6', name: 'Ronaldo CR7 Deadstock', placement: 'Mega Menu', parentId: 'nav-mega-cat-2', icon: 'Trophy', order: 3, url: 'Ronaldo', status: 'Active' },

    { id: 'nav-mega-cat-3', name: 'National Teams', placement: 'Mega Menu', parentId: null, icon: 'Globe', order: 3, url: '#listing', status: 'Active' },
    { id: 'nav-mega-item-7', name: 'Argentina Albiceleste', placement: 'Mega Menu', parentId: 'nav-mega-cat-3', icon: 'Globe', order: 1, url: 'Argentina', status: 'Active' },
    { id: 'nav-mega-item-8', name: 'Brazil Seleção Classics', placement: 'Mega Menu', parentId: 'nav-mega-cat-3', icon: 'Globe', order: 2, url: 'Brazil', status: 'Active' },

    // Footer Menu Items
    { id: 'nav-footer-1', name: 'Sell Your Shirts', placement: 'Footer Menu', parentId: null, icon: 'ShieldCheck', order: 1, url: 'seller', status: 'Active' },
    { id: 'nav-footer-2', name: 'Frequently Asked Questions', placement: 'Footer Menu', parentId: null, icon: 'HelpCircle', order: 2, url: 'faq', status: 'Active' },
    { id: 'nav-footer-3', name: 'About Jersey Addicts BD', placement: 'Footer Menu', parentId: null, icon: 'Globe', order: 3, url: 'about', status: 'Active' },
    { id: 'nav-footer-4', name: 'Contact Dhaka Store', placement: 'Footer Menu', parentId: null, icon: 'Phone', order: 4, url: 'contact', status: 'Active' },
    { id: 'nav-footer-5', name: 'Customer Authenticity Guarantee', placement: 'Footer Menu', parentId: null, icon: 'Award', order: 5, url: 'authenticity', status: 'Active' },
    { id: 'nav-footer-6', name: 'Order Tracker & Account', placement: 'Footer Menu', parentId: null, icon: 'ShoppingBag', order: 6, url: 'dashboard', status: 'Active' },
  ]
};

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home'); // home, listing, details, cart, checkout, admin, dashboard, seller, faq, about, contact, etc.
  const [checkoutLoginRequired, setCheckoutLoginRequired] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Data State (allowing live edits by admin/seller modules to propagate, loaded from localStorage if custom card uploads occur!)
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('vault_custom_products');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return PRODUCTS;
      }
    }
    return PRODUCTS;
  });

  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>(SELLER_REQUESTS);
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem('vault_orders');
    return stored ? JSON.parse(stored) : [];
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Selected Detail product
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Last Order Confirmation Screen
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // App customization configuration state
  const [appConfig, setAppConfig] = useState<AppConfig>(() => {
    const stored = localStorage.getItem('vault_app_config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.logoText === 'THE VAULT BD' || parsed.logoText === 'Jersey Addicts BD') {
          parsed.logoText = 'Jersey Addicts BD';
        }
        parsed.logoSubtext = '';
        parsed.footerLocations = [
          { city: 'Dhaka HQ', address: 'Shop No. 8, 3rd Floor, AQP Shopping Mall, 143/2 New Bailey Road, Dhaka 1217, Bangladesh', phone: '+880 1840-990700' }
        ];
        if (!parsed.menuItems || !Array.isArray(parsed.menuItems) || parsed.menuItems.length === 0) {
          parsed.menuItems = DEFAULT_APP_CONFIG.menuItems;
        }
        if (!parsed.banners || !Array.isArray(parsed.banners) || parsed.banners.length === 0) {
          parsed.banners = DEFAULT_APP_CONFIG.banners;
        }
        if (parsed.homepageSections && Array.isArray(parsed.homepageSections)) {
          parsed.homepageSections = parsed.homepageSections.map((s: any) =>
            s.id === 'mystery-box' ? { ...s, visible: false, status: 'inactive' } : s
          );
        }
        return parsed;
      } catch (e) {
        return DEFAULT_APP_CONFIG;
      }
    }
    return DEFAULT_APP_CONFIG;
  });

  const handleUpdateConfig = (newConfig: AppConfig) => {
    setAppConfig(newConfig);
    localStorage.setItem('vault_app_config', JSON.stringify(newConfig));
  };

  // Carousel Slides state
  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    const stored = localStorage.getItem('vault_carousel_slides');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((s: CarouselSlide) => {
          if (s.id === 'slide-1' && (s.title === 'THE 1998 FRANCE VAULT' || s.title === 'WORLD CUP 2026 EDITION')) {
            return INITIAL_SLIDES[0];
          }
          return s;
        });
      } catch (e) {}
    }
    return INITIAL_SLIDES;
  });

  // Auth & Session state
  const [usersList, setUsersList] = useState<User[]>(() => {
    const stored = localStorage.getItem('vault_users_list');
    if (stored) {
      try {
        const parsed: User[] = JSON.parse(stored);
        return parsed.map((u) => {
          const match = INITIAL_USERS.find((du) => du.id === u.id || du.email.toLowerCase() === u.email.toLowerCase());
          if (match) {
            return { ...u, password: match.password, role: match.role };
          }
          return u;
        });
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('vault_current_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleSetSlides = (newSlides: CarouselSlide[] | ((prev: CarouselSlide[]) => CarouselSlide[])) => {
    setSlides((prev) => {
      const next = typeof newSlides === 'function' ? newSlides(prev) : newSlides;
      localStorage.setItem('vault_carousel_slides', JSON.stringify(next));
      return next;
    });
  };

  // Auto-sync all admin backend changes to localStorage for instant live persistence
  useEffect(() => {
    if (products && products.length > 0) {
      localStorage.setItem('vault_custom_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (appConfig) {
      localStorage.setItem('vault_app_config', JSON.stringify(appConfig));
    }
  }, [appConfig]);

  useEffect(() => {
    if (slides) {
      localStorage.setItem('vault_carousel_slides', JSON.stringify(slides));
    }
  }, [slides]);

  useEffect(() => {
    if (orders) {
      localStorage.setItem('vault_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const handleRegisterUser = (newUser: User) => {
    setUsersList((prev) => {
      const next = [...prev, newUser];
      localStorage.setItem('vault_users_list', JSON.stringify(next));
      return next;
    });
  };

  const handleLoginSuccess = (user: User, autoSave: boolean) => {
    setCurrentUser(user);
    if (autoSave) {
      localStorage.setItem('vault_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vault_current_user');
    }
    
    // Redirect role-based
    if (user.role === 'Admin') {
      setCurrentPage('admin');
    } else if (checkoutLoginRequired || cart.length > 0) {
      setCurrentPage('checkout');
      setCheckoutLoginRequired(false);
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vault_current_user');
    setCurrentPage('home');
  };

  const handleUpdateProductImage = (productId: string, base64: string) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === productId ? { ...p, uploadedImage: base64 } : p));
      localStorage.setItem('vault_custom_products', JSON.stringify(next));
      return next;
    });
  };

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured'); // featured, price-low, price-high, year-old, year-new, rating
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Add to Cart
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if item with same configuration (id + size + print name + print number) already exists
      const existingIdx = prev.findIndex((i) => {
        const matchProd = i.product.id === item.product.id;
        const matchSize = i.selectedSize === item.selectedSize;
        const matchPrint = JSON.stringify(i.customPrint) === JSON.stringify(item.customPrint);
        const matchBadge = i.addBadge === item.addBadge;
        return matchProd && matchSize && matchPrint && matchBadge;
      });

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
  };

  // Quick Add helper (adds standard first size with no custom nameset)
  const handleQuickAdd = (product: Product, size?: string, qty?: number) => {
    const standardSize = size || product.sizes[0] || 'M';
    const item: CartItem = {
      product,
      selectedSize: standardSize,
      quantity: qty || 1,
    };
    handleAddToCart(item);
    alert(`✓ Added ${product.name} (Size ${standardSize}, Qty: ${qty || 1}) to your Bag!`);
  };

  // Direct checkout routing
  const handleCheckoutDirectly = (product: Product, size: string, qty: number) => {
    const standardSize = size || product.sizes[0] || 'M';
    const item: CartItem = {
      product,
      selectedSize: standardSize,
      quantity: qty || 1,
    };
    handleAddToCart(item);
    if (!currentUser) {
      setCheckoutLoginRequired(true);
      setCurrentPage('auth');
    } else {
      setCurrentPage('checkout');
    }
  };

  // Wishlist heart toggler
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const isFav = prev.some((p) => p.id === product.id);
      if (isFav) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Add seller request from user form
  const handleAddSellerRequest = (req: SellerRequest) => {
    setSellerRequests((prev) => [req, ...prev]);
  };

  // Successful Order submission
  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => {
      const next = [order, ...prev];
      localStorage.setItem('vault_orders', JSON.stringify(next));
      return next;
    });
    setLastPlacedOrder(order);
    setCurrentPage('order-success');
  };

  // Helper to convert OKLCH to RGB color space for html2canvas compatibility
  const oklchToRgb = (L: number, C: number, H: number): [number, number, number] => {
    const a = C * Math.cos((H * Math.PI) / 180);
    const b = C * Math.sin((H * Math.PI) / 180);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

    const f = (c: number) => {
      return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    };

    const r = Math.max(0, Math.min(255, Math.round(f(rLin) * 255)));
    const g = Math.max(0, Math.min(255, Math.round(f(gLin) * 255)));
    const bVal = Math.max(0, Math.min(255, Math.round(f(bLin) * 255)));

    return [r, g, bVal];
  };

  // Parses any CSS text and replaces oklch(...) expressions with standard rgb/rgba fallbacks
  const parseAndReplaceOklch = (cssText: string): string => {
    // Match oklch(...) functions. Matches up to the closing parenthesis.
    const oklchRegex = /oklch\([^\)]+\)/g;
    return cssText.replace(oklchRegex, (match) => {
      try {
        const inner = match.substring(6, match.length - 1).trim();
        // Split by whitespace, commas, or forward slashes
        const parts = inner.split(/[\s,\/]+/).filter(Boolean);
        if (parts.length >= 3) {
          let lStr = parts[0];
          let cStr = parts[1];
          let hStr = parts[2];
          let aStr = parts[3];

          let L = parseFloat(lStr);
          if (lStr.includes('%')) {
            L = L / 100;
          }
          const C = parseFloat(cStr);
          const H = parseFloat(hStr);

          let A = 1;
          if (aStr) {
            A = parseFloat(aStr);
            if (aStr.includes('%')) {
              A = A / 100;
            }
          }

          if (!isNaN(L) && !isNaN(C) && !isNaN(H)) {
            const [r, g, b] = oklchToRgb(L, C, H);
            if (aStr !== undefined && !isNaN(A)) {
              return `rgba(${r}, ${g}, ${b}, ${A})`;
            } else {
              return `rgb(${r}, ${g}, ${b})`;
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse oklch color:', match, e);
      }
      
      // If parsing fails or is a complex CSS variable (like oklch(var(--foo))), 
      // replace with safe neutral color to prevent html2canvas crash.
      return 'rgb(120, 120, 120)';
    });
  };

  // Download PDF invoice/receipt using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    const invoiceElement = document.getElementById('printable-invoice');
    if (!invoiceElement) return;

    setIsGeneratingPDF(true);

    // Keep references to restore original browser functions afterward
    const originalGetComputedStyle = window.getComputedStyle;
    const originalGetPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;

    try {
      // 1. Temporarily patch prototype getPropertyValue to clean oklch colors on any CSSStyleDeclaration query
      CSSStyleDeclaration.prototype.getPropertyValue = function (propertyName: string) {
        const value = originalGetPropertyValue.call(this, propertyName);
        if (typeof value === 'string' && value.includes('oklch')) {
          return parseAndReplaceOklch(value);
        }
        return value;
      };

      // 2. Helper to intercept any computed style queries and translate oklch to standard RGB
      const patchWindow = (win: Window) => {
        const orig = win.getComputedStyle;
        win.getComputedStyle = function (elt, pseudoElt) {
          const style = orig.call(win, elt, pseudoElt);
          return new Proxy(style, {
            get(target, prop, receiver) {
              if (prop === 'getPropertyValue') {
                return function (propertyName: string) {
                  const value = target.getPropertyValue(propertyName);
                  if (typeof value === 'string' && value.includes('oklch')) {
                    return parseAndReplaceOklch(value);
                  }
                  return value;
                };
              }
              
              let value;
              try {
                // Read from native target to preserve proper native "this" context (avoids Illegal Invocation error)
                value = target[prop as any];
              } catch (e) {
                value = Reflect.get(target, prop, receiver);
              }

              if (typeof value === 'string' && value.includes('oklch')) {
                return parseAndReplaceOklch(value);
              }
              if (typeof value === 'function') {
                return value.bind(target);
              }
              return value;
            }
          }) as CSSStyleDeclaration;
        };
      };

      // Patch the main window
      patchWindow(window);

      // Convert all oklch colors in the active document stylesheets to rgb/rgba BEFORE running html2canvas
      try {
        const processRules = (rules: any) => {
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            try {
              if (rule.style && rule.style.cssText && rule.style.cssText.includes('oklch')) {
                rule.style.cssText = parseAndReplaceOklch(rule.style.cssText);
              }
              if (rule.cssRules) {
                processRules(rule.cssRules);
              }
            } catch (e) {
              // Ignore rule-level access errors or issues
            }
          }
        };

        for (const sheet of Array.from(document.styleSheets)) {
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (rules) {
              processRules(rules);
            }
          } catch (e) {
            // Ignore cross-origin stylesheet errors
          }
        }
      } catch (err) {
        console.error('Failed to pre-convert document stylesheets:', err);
      }

      // Capture invoice with 2x scale for crisp text rendering
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Patch the cloned iframe defaultView as well
          if (clonedDoc.defaultView) {
            patchWindow(clonedDoc.defaultView);
          }

          // Translate oklch colors inside all stylesheets in the clone to standard rgb/rgba
          clonedDoc.querySelectorAll('style').forEach(styleEl => {
            try {
              styleEl.innerHTML = parseAndReplaceOklch(styleEl.innerHTML);
            } catch (e) {
              console.warn('Failed to parse oklch in <style> element', e);
            }
          });

          // Translate oklch colors inside inline style attributes in the clone
          clonedDoc.querySelectorAll('[style]').forEach(el => {
            try {
              const styleAttr = el.getAttribute('style');
              if (styleAttr) {
                el.setAttribute('style', parseAndReplaceOklch(styleAttr));
              }
            } catch (e) {
              console.warn('Failed to parse oklch in inline style attribute', e);
            }
          });

          const el = clonedDoc.getElementById('printable-invoice');
          if (el) {
            el.style.boxShadow = 'none';
            el.style.border = '2px solid #a1a1aa'; // keep zinc border clean
            el.style.borderRadius = '0'; // remove rounding for standard document print
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate proportions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      // Keep a consistent 12mm page margin
      const margin = 12;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = contentWidth / ratio;

      // Add image to A4 PDF page
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);

      // Download PDF named after the order ID
      const orderRef = lastPlacedOrder ? lastPlacedOrder.id : 'INVOICE';
      pdf.save(`Jersey_Addicts_Invoice_${orderRef}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: trigger system print window if something breaks
      window.print();
    } finally {
      // Restore original native functions
      window.getComputedStyle = originalGetComputedStyle;
      CSSStyleDeclaration.prototype.getPropertyValue = originalGetPropertyValue;
      setIsGeneratingPDF(false);
    }
  };

  // Compute filtered/sorted product catalog array
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Category & Tag filter (Flexible matching)
    if (selectedCategory && selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase().trim();
      result = result.filter((p) => {
        if (p.targetPage && p.targetPage.toLowerCase().trim() === catLower) return true;
        if (p.targetPage && p.targetPage.toLowerCase().includes(catLower)) return true;
        if (p.pageName && p.pageName.toLowerCase().trim() === catLower) return true;
        if (p.pageName && p.pageName.toLowerCase().includes(catLower)) return true;
        if (p.category && p.category.toLowerCase() === catLower) return true;
        if (p.category && p.category.toLowerCase().includes(catLower)) return true;
        if (p.league && p.league.toLowerCase().includes(catLower)) return true;
        if (p.club && p.club.toLowerCase().includes(catLower)) return true;
        if (p.country && p.country.toLowerCase().includes(catLower)) return true;
        if (p.name && p.name.toLowerCase().includes(catLower)) return true;
        if (p.player && p.player.name && p.player.name.toLowerCase().includes(catLower)) return true;
        if (p.brand && p.brand.toLowerCase() === catLower) return true;
        if (p.condition && p.condition.toLowerCase() === catLower) return true;
        return false;
      });
    }

    // Condition filter
    if (selectedCondition !== 'All') {
      result = result.filter((p) => p.condition.toLowerCase() === selectedCondition.toLowerCase());
    }

    // Sorting operations
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year-new') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'year-old') {
      result.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedCondition, sortBy]);

  // Compute related items for Details screen
  const relatedJerseys = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.brand === selectedProduct.brand || p.category === selectedProduct.category)
    );
  }, [products, selectedProduct]);

  // Reset all catalog filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSortBy('featured');
  };

  const getThemeBgClass = () => {
    return 'bg-white';
  };

  const formatPrice = (amount: number): string => {
    const converted = Math.round(amount * appConfig.exchangeRate);
    return `${appConfig.currencySymbol}${converted.toLocaleString()}`;
  };

  return (
    <div className={`min-h-screen bg-white text-emerald-950 selection:bg-emerald-800 selection:text-white flex flex-col justify-between`}>
      
      {/* Embedded Sticky Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setCurrentPage('details');
        }}
        onSearch={(query) => {
          setSearchQuery(query);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        appConfig={appConfig}
        formatPrice={formatPrice}
      />

      {/* MAIN BODY DISPLAY */}
      <main className="flex-grow">
        
        {/* ROUTE 1: LANDING HOME VIEW & DYNAMIC CUSTOM PAGES */}
        {(currentPage === 'home' || currentPage.startsWith('page-') || (appConfig?.pages || []).some(p => p.id === currentPage || p.name === currentPage || p.slug === currentPage || p.name.toLowerCase() === currentPage.toLowerCase())) && (
          <DynamicPageRenderer
            currentPage={currentPage === 'home' ? 'home' : currentPage.replace(/^page-/, '')}
            products={products}
            appConfig={appConfig}
            formatPrice={formatPrice}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentPage('details');
            }}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            setCurrentPage={setCurrentPage}
            setSelectedCategory={setSelectedCategory}
            handleQuickAdd={handleQuickAdd}
            handleUpdateProductImage={handleUpdateProductImage}
            handleCheckoutDirectly={handleCheckoutDirectly}
          />
        )}

        {/* ROUTE 2: CATALOG LISTING */}
        {currentPage === 'listing' && (
          <section className="max-w-7xl mx-auto px-4 md:px-12 py-10 min-h-screen">
            
            {/* Catalog Banner */}
            <div className="border-b border-emerald-100 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-emerald-950 font-display">Historical Jersey Addicts BD</h1>
                <p className="text-xs text-emerald-700 font-mono mt-1">
                  Showing {filteredProducts.length} verified original jerseys
                </p>
              </div>

              {/* Reset filter tag */}
              {(selectedBrand !== 'All' || selectedCategory !== 'All' || selectedCondition !== 'All' || searchQuery !== '') && (
                <button
                  onClick={resetFilters}
                  className="bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-red-100"
                >
                  <RotateCcw size={11} /> Clear All Filter Parameters
                </button>
              )}
            </div>

            {/* Catalog Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Filter Sidebar */}
              <div className="lg:col-span-3 bg-white border border-emerald-100 rounded-2xl p-6 space-y-6 shadow-sm">
                
                <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                  <h3 className="text-xs font-mono font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                    <SlidersHorizontal size={13} /> Filter Engine
                  </h3>
                  <button onClick={resetFilters} className="text-[10px] text-emerald-600 hover:text-emerald-800 font-mono uppercase">
                    Reset
                  </button>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Keyword Search:</span>
                  <input
                    type="text"
                    placeholder="Search player, club, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2 px-3 text-emerald-950 placeholder-emerald-800/45 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                {/* Brands */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Brands:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {['All', 'Adidas', 'Nike', 'Umbro', 'Kappa', 'Puma'].map((b) => (
                      <div
                        key={b}
                        onClick={() => setSelectedBrand(b)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          selectedBrand === b ? 'bg-emerald-800 text-white font-extrabold shadow-sm' : 'hover:bg-emerald-50 text-emerald-900'
                        }`}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Category:</span>
                  <div className="space-y-1.5">
                    {['All', 'Legends', 'Club Jerseys', 'Training', 'International'].map((cat) => (
                      <div
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          selectedCategory === cat ? 'bg-emerald-800 text-white font-extrabold shadow-sm' : 'hover:bg-emerald-50 text-emerald-900'
                        }`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Condition Matrix:</span>
                  <div className="space-y-1.5">
                    {['All', 'Mint', 'Excellent', 'Very Good'].map((cond) => (
                      <div
                        key={cond}
                        onClick={() => setSelectedCondition(cond)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          selectedCondition === cond ? 'bg-emerald-800 text-white font-extrabold shadow-sm' : 'hover:bg-emerald-50 text-emerald-900'
                        }`}
                      >
                        {cond}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sorting Select */}
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Sort Catalogue:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2 px-3 text-emerald-950 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="featured">Sourced Featured</option>
                    <option value="price-low">Price: Low-to-High</option>
                    <option value="price-high">Price: High-to-Low</option>
                    <option value="year-new">Year: Modern-to-Old</option>
                    <option value="year-old">Year: Old-to-Modern</option>
                    <option value="rating">User Rating Score</option>
                  </select>
                </div>

              </div>

              {/* Right Column: Active catalog items matching filters */}
              <div className="lg:col-span-9">
                {filteredProducts.length === 0 ? (
                  <div className="bg-white border border-emerald-100 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                    <p className="text-emerald-800 text-sm max-w-sm mx-auto">
                      No vintage jerseys found matching the selected search query or category parameters inside the database.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full cursor-pointer transition-all shadow-md shadow-emerald-900/10"
                    >
                      Clear Active Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onSelect={(p) => {
                          setSelectedProduct(p);
                          setCurrentPage('details');
                        }}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.some((w) => w.id === prod.id)}
                        onQuickAdd={handleQuickAdd}
                        onUpdateImage={handleUpdateProductImage}
                        formatPrice={formatPrice}
                        onCheckout={handleCheckoutDirectly}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* ROUTE 3: DETAILED VIEW */}
        {currentPage === 'details' && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBackToCatalog={() => setCurrentPage('listing')}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            isWishlisted={wishlist.some((w) => w.id === selectedProduct.id)}
            relatedProducts={relatedJerseys}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo(0,0);
            }}
            formatPrice={formatPrice}
          />
        )}

        {/* ROUTE 4: SHOPPING BAG */}
        {currentPage === 'cart' && (
          <Cart
            cart={cart}
            setCart={setCart}
            onCheckout={() => {
              if (!currentUser) {
                setCheckoutLoginRequired(true);
                setCurrentPage('auth');
              } else {
                setCurrentPage('checkout');
              }
            }}
            onBackToCatalog={() => setCurrentPage('listing')}
            formatPrice={formatPrice}
          />
        )}

        {/* ROUTE 5: CHECKOUT GATEWAYS */}
        {currentPage === 'checkout' && (
          !currentUser ? (
            <div className="max-w-md mx-auto my-16 text-center space-y-6 bg-white border border-zinc-200 p-8 rounded-3xl text-zinc-950 shadow-md animate-fadeIn">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-emerald-800 border border-emerald-200">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black">Sign In Required</h3>
              <p className="text-xs text-zinc-600 font-mono">You must be logged in with your email to place cash on delivery orders.</p>
              <button
                onClick={() => {
                  setCheckoutLoginRequired(true);
                  setCurrentPage('auth');
                }}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Go to Login / Register
              </button>
            </div>
          ) : (
            <Checkout
              cart={cart}
              setCart={setCart}
              onOrderSuccess={handleOrderSuccess}
              onBackToCart={() => setCurrentPage('cart')}
              onBackToCatalog={() => setCurrentPage('listing')}
              formatPrice={formatPrice}
              appConfig={appConfig}
            />
          )
        )}
        {currentPage === 'order-success' && lastPlacedOrder && (
          <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 text-black animate-fadeIn">
            {/* STAGE 1: SUCCESS CELEBRATION CARD */}
            <div className="bg-white border-2 border-zinc-300 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-xl max-w-xl mx-auto">
              <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle size={32} className="text-emerald-700" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">Order Placed Successfully!</h1>
                <p className="text-xs text-zinc-700 font-mono font-bold uppercase tracking-wider">
                  Reference ID: {lastPlacedOrder.id} • STATUS: CONFIRMED
                </p>
              </div>

              <p className="text-zinc-800 text-xs md:text-sm font-medium leading-relaxed max-w-sm mx-auto">
                Thank you for your order! Your vintage jersey package is being prepared for secure delivery. You will pay the bill upon doorstep arrival. Below is your official invoice.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const invoiceElement = document.getElementById('printable-invoice');
                    if (invoiceElement) {
                      invoiceElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Receipt size={14} /> View Invoice & Bill
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className={`flex-1 font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer transition-all border-2 border-zinc-300 flex items-center justify-center gap-2 ${
                    isGeneratingPDF 
                      ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed' 
                      : 'bg-white hover:bg-zinc-100 text-black'
                  }`}
                >
                  <Download size={14} className={isGeneratingPDF ? 'animate-pulse' : ''} />
                  {isGeneratingPDF ? 'Downloading PDF...' : 'Download Invoice'}
                </button>
              </div>
            </div>

            {/* STAGE 2: THE PHYSICAL INVOICE & BILL RECEIPT */}
            <div 
              id="printable-invoice" 
              className="bg-white border-2 border-zinc-400 p-6 md:p-10 rounded-2xl shadow-2xl space-y-8 relative overflow-hidden font-mono text-xs text-black max-w-2xl mx-auto"
            >
              {/* Paper Top Dotted Pattern */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
              
              {/* Receipt Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-200 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    {/* Custom Jersey Addicts Logo Graphic */}
                    <div className="flex-shrink-0 bg-emerald-50 p-1 rounded-xl border border-emerald-200">
                      <svg viewBox="0 0 100 100" className="w-8 h-8">
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
                        <span className="text-emerald-600 font-sans font-black text-sm md:text-base tracking-tight leading-none uppercase">
                          Jersey
                        </span>
                        <span className="text-black font-sans font-black text-sm md:text-base tracking-tight leading-none uppercase">
                          Addicts
                        </span>
                        <span className="text-emerald-800 font-mono font-bold text-[9px] px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-200 leading-none">
                          BD
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-2.5 uppercase font-bold leading-relaxed">
                    Premium Authenticated Football Kits<br />
                    Shop No. 8, 3rd Floor, AQP Shopping Mall,<br />
                    143/2 New Bailey Road, Dhaka 1217, Bangladesh<br />
                    Email: support@jerseyvault.bd • <span className="text-zinc-800 font-black">Phone: +880 1840-990700</span>
                  </p>
                </div>
                <div className="text-left md:text-right font-mono text-[11px] space-y-1">
                  <p><span className="font-bold">INVOICE:</span> #{lastPlacedOrder.id.slice(0, 8).toUpperCase()}</p>
                  <p><span className="font-bold">DATE:</span> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p><span className="font-bold">TRACKING:</span> {lastPlacedOrder.trackingNumber}</p>
                  <p><span className="font-bold text-emerald-700">METHOD:</span> CASH ON DELIVERY</p>
                </div>
              </div>

              {/* Billed To Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">CLIENT DETAILS:</span>
                  <p className="font-black text-sm text-black uppercase">{lastPlacedOrder.shippingAddress.fullName}</p>
                  <p className="text-[11px] text-zinc-800 leading-normal font-bold">Phone: {lastPlacedOrder.shippingAddress.phone}</p>
                  {lastPlacedOrder.shippingAddress.email && (
                    <p className="text-[11px] text-zinc-600 truncate">Email: {lastPlacedOrder.shippingAddress.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">DELIVERY DESTINATION:</span>
                  <p className="font-medium text-zinc-800 leading-relaxed">
                    {lastPlacedOrder.shippingAddress.addressLine1}<br />
                    {lastPlacedOrder.shippingAddress.city} {lastPlacedOrder.shippingAddress.postalCode ? `- ${lastPlacedOrder.shippingAddress.postalCode}` : ''}
                  </p>
                  <span className="inline-block bg-black text-white text-[9px] px-2 py-0.5 rounded font-black uppercase mt-1">
                    {lastPlacedOrder.deliveryRegion === 'inside' ? 'Inside Dhaka (Home Delivery)' : 'Outside Dhaka (Courier)'}
                  </span>
                </div>
              </div>

              {/* Invoice Itemized Table */}
              <div className="space-y-3">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">ITEMIZED DESCRIPTION:</span>
                
                <div className="border-t border-b border-zinc-300 py-2">
                  <div className="grid grid-cols-12 gap-2 font-black text-black pb-1.5 uppercase tracking-wider text-[10px]">
                    <div className="col-span-6">JERSEY NAME</div>
                    <div className="col-span-2 text-center">SIZE</div>
                    <div className="col-span-1 text-center">QTY</div>
                    <div className="col-span-3 text-right">PRICE</div>
                  </div>
                  
                  <div className="divide-y divide-dashed divide-zinc-200">
                    {lastPlacedOrder.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 py-2 items-center text-[11px] text-zinc-950 font-semibold">
                        <div className="col-span-6 truncate font-extrabold text-black" title={item.product.name}>
                          {item.product.name}
                        </div>
                        <div className="col-span-2 text-center font-mono font-black">{item.selectedSize}</div>
                        <div className="col-span-1 text-center font-mono">{item.quantity}</div>
                        <div className="col-span-3 text-right font-mono">{formatPrice(item.product.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Billing Breakdown Bill */}
              <div className="flex flex-col items-end pt-2">
                <div className="w-full md:w-80 space-y-2.5 font-mono text-zinc-900 text-xs">
                  <div className="flex justify-between border-b border-zinc-200 pb-2">
                    <span className="font-bold">Subtotal:</span>
                    <span className="font-black text-black">{formatPrice(lastPlacedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 pb-2">
                    <span className="font-bold">Delivery Charge:</span>
                    <span className="font-black text-black">৳{lastPlacedOrder.deliveryCharge || (lastPlacedOrder.deliveryRegion === 'inside' ? 70 : 130)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="font-black text-black uppercase tracking-wide">GRAND TOTAL TO PAY:</span>
                    <span className="font-black text-black underline decoration-double decoration-2 underline-offset-4">{formatPrice(lastPlacedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Decorative Authentic Elements */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t-2 border-zinc-200">
                {/* Simulated Barcode */}
                <div className="flex flex-col items-start gap-1">
                  <div className="h-10 w-44 flex gap-[2px] items-stretch opacity-85">
                    {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1, 2, 3].map((w, i) => (
                      <div 
                        key={i} 
                        className="bg-black" 
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono tracking-[4px] text-zinc-500 font-bold uppercase">
                    *{lastPlacedOrder.id.slice(0, 8).toUpperCase()}*
                  </span>
                </div>

                {/* Vault Stamp / Guarantee */}
                <div className="border-4 border-double border-zinc-400 rounded-full px-5 py-2 text-center text-zinc-500 select-none scale-90 rotate-[-2deg]">
                  <p className="text-[8px] font-black tracking-widest uppercase">OFFICIAL SEAL</p>
                  <p className="text-[11px] font-black tracking-tight text-zinc-800 uppercase">JERSEY ADDICTS BD AUTHENTIC</p>
                  <p className="text-[8px] font-mono tracking-widest uppercase font-bold">100% DEADSTOCK CO.</p>
                </div>
              </div>

              {/* Print Footer Note */}
              <p className="text-center text-[9px] text-zinc-500 font-mono pt-4 leading-normal uppercase font-bold">
                Thank you for supporting historical football preservation.<br />
                This is a computer-generated invoice and serves as a valid Cash on Delivery receipt.
              </p>
            </div>

            {/* Action Buttons to Continue */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto pt-4">
              <button
                onClick={() => {
                  setLastPlacedOrder(null);
                  setCurrentPage('listing');
                }}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} /> Continue Shopping
              </button>
              <button
                onClick={() => {
                  setLastPlacedOrder(null);
                  setCurrentPage('dashboard');
                }}
                className="flex-1 bg-white hover:bg-zinc-100 text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition-all border-2 border-zinc-300 flex items-center justify-center gap-2"
              >
                View My Purchase History
              </button>
            </div>
          </section>
        )}

        {/* ROUTE 7: ADMIN CONTROL ROOM */}
        {currentPage === 'admin' && (
          currentUser?.role === 'Admin' ? (
            <AdminPanel
              products={products}
              setProducts={setProducts}
              sellerRequests={sellerRequests}
              setSellerRequests={setSellerRequests}
              orders={orders}
              setOrders={setOrders}
              onBackToCatalog={() => setCurrentPage('listing')}
              slides={slides}
              setSlides={handleSetSlides}
              appConfig={appConfig}
              onUpdateConfig={handleUpdateConfig}
              formatPrice={formatPrice}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 text-center space-y-6 bg-white border border-emerald-100 p-8 rounded-3xl text-emerald-950 shadow-sm">
              <span className="text-4xl">🛠</span>
              <h3 className="text-lg font-black uppercase tracking-tight text-emerald-800">Restricted Access Control Room</h3>
              <p className="text-xs text-emerald-700 font-mono">You must authenticate using administrator credentials to manage inventory and customize slides.</p>
              <button
                onClick={() => setCurrentPage('auth')}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Sign In as Admin
              </button>
            </div>
          )
        )}

        {/* ROUTE 8: CUSTOMER COCKPIT */}
        {currentPage === 'dashboard' && (
          currentUser ? (
            <CustomerDashboard
              orders={orders}
              wishlist={wishlist}
              onRemoveWishlist={handleRemoveWishlist}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setCurrentPage('details');
              }}
              setCurrentPage={setCurrentPage}
              formatPrice={formatPrice}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 text-center space-y-6 bg-white border border-emerald-100 p-8 rounded-3xl text-emerald-950 shadow-sm">
              <span className="text-4xl">🔐</span>
              <h3 className="text-lg font-black uppercase tracking-tight text-emerald-800">Locked Account Access</h3>
              <p className="text-xs text-emerald-700 font-mono">Sign in with your email or register to view your custom locker room, orders, and wishlist details.</p>
              <button
                onClick={() => setCurrentPage('auth')}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Sign In To Account
              </button>
            </div>
          )
        )}

        {/* ROUTE AUTHENTICATION */}
        {currentPage === 'auth' && (
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            usersList={usersList}
            onRegisterUser={handleRegisterUser}
            onCancel={() => setCurrentPage('home')}
            isCheckoutRedirect={checkoutLoginRequired}
          />
        )}

        {/* ROUTE 9: SELL SHIRT PORTAL */}
        {currentPage === 'seller' && (
          <SellerModule onAddRequest={handleAddSellerRequest} />
        )}

        {/* ROUTE 10+: INFORMATION COMPLIANCE PAGES */}
        {(currentPage === 'faq' ||
          currentPage === 'about' ||
          currentPage === 'contact' ||
          currentPage === 'privacy' ||
          currentPage === 'refund' ||
          currentPage === 'terms' ||
          currentPage === 'shipping') && (
          <InfoPages pageType={currentPage} onBack={() => setCurrentPage('listing')} />
        )}

      </main>

      {/* Embedded Brand Footer */}
      <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} appConfig={appConfig} />

    </div>
  );
}
