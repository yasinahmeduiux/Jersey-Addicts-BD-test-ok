import React, { useState, useEffect } from 'react';
import { AreaChart, Users, Shirt, ShoppingBag, Check, X, ShieldAlert, BadgeCheck, FileText, Plus, Save, Sparkles, Download, Upload, AlertTriangle, Image, Trash2, Edit, Search, Smartphone, Monitor, ChevronLeft, ChevronRight, SlidersHorizontal, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3, Clock, CheckCircle, AlertOctagon, HelpCircle, UserCheck, PlusCircle, Activity, Trophy, Star, Flame, Globe, Tag, Box, Compass, Heart, Phone, MapPin, Mail, Layers, Grid, ArrowUp, ArrowDown, ShieldCheck, Award, Printer, Truck, RotateCcw, DollarSign, CheckCircle2, PackageCheck, Send, Copy, ExternalLink, XCircle, Eye } from 'lucide-react';
import { Product, SellerRequest, Order, CarouselSlide, AppConfig, BannerConfig, BannerType, MenuItem, MenuPlacement, User, UserRole } from '../types';
import { JerseyRenderer } from './JerseyRenderer';
import { InventoryEditor } from './InventoryEditor';
import { ProductManager } from './ProductManager';
import { RolesPermissionsManager, STAFF_ROLE_DEFINITIONS } from './RolesPermissionsManager';
import { TEAMS_LIST, RIVALRY_PRESETS, TeamItem } from '../data/teamsData';

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  location: string;
  notes?: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
}

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sellerRequests: SellerRequest[];
  setSellerRequests: React.Dispatch<React.SetStateAction<SellerRequest[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onBackToCatalog: () => void;
  slides: CarouselSlide[];
  setSlides: React.Dispatch<React.SetStateAction<CarouselSlide[]>>;
  appConfig: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  formatPrice: (amount: number) => string;
}

const CAROUSEL_PRESETS = [
  { name: 'WC 2026 Arena', url: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Stadium Lamps', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Match Battle', url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Sunset Field', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Fan Festival', url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1600' },
  { name: 'Green Pitch', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1600' }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  setProducts,
  sellerRequests,
  setSellerRequests,
  orders,
  setOrders,
  onBackToCatalog,
  slides,
  setSlides,
  appConfig,
  onUpdateConfig,
  formatPrice,
}) => {
  // Tabs: 'dashboard' | 'inventory' | 'seller-requests' | 'homepage-builder' | 'coupons'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'seller-requests' | 'homepage-builder' | 'coupons'>('dashboard');
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>('dashboard');

  // Staff Roles & Permissions state
  const [activeUserRole, setActiveUserRole] = useState<UserRole>('Super Admin');
  const [staffUsers, setStaffUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('vault_staff_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed parsing staff users from localStorage', e);
      }
    }
    return [
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
      }
    ];
  });

  // Persist staffUsers to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('vault_staff_users', JSON.stringify(staffUsers));
    } catch (e) {
      console.error('Failed storing staff users in localStorage', e);
    }
  }, [staffUsers]);

  // Custom pages and custom sections local form state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionFormBg, setSectionFormBg] = useState('bg-white');
  const [sectionFormPadding, setSectionFormPadding] = useState('py-12');
  const [sectionFormMargin, setSectionFormMargin] = useState('my-0');
  const [sectionFormTitle, setSectionFormTitle] = useState('');
  const [sectionFormSubtitle, setSectionFormSubtitle] = useState('');
  const [sectionFormBtnText, setSectionFormBtnText] = useState('');
  const [sectionFormBtnUrl, setSectionFormBtnUrl] = useState('');
  const [sectionFormAnim, setSectionFormAnim] = useState<'none' | 'fadeIn' | 'slideUp'>('none');
  const [sectionFormStatus, setSectionFormStatus] = useState<'active' | 'draft'>('active');

  // New Custom Page Form State
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  // Sourced entities list mock states
  const [collections, setCollections] = useState([
    { id: 'col-1', name: 'Vintage 90s Deadstock', itemsCount: 14, banner: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800' },
    { id: 'col-2', name: 'Qatar 2022 Matchwear', itemsCount: 8, banner: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800' },
  ]);
  const [leaguesList, setLeaguesList] = useState([
    { id: 'l-1', name: 'English Premier League', flag: '🇬🇧', status: 'Active' },
    { id: 'l-2', name: 'Spanish La Liga', flag: '🇪🇸', status: 'Active' },
    { id: 'l-3', name: 'Italian Serie A', flag: '🇮🇹', status: 'Active' },
  ]);
  const [clubsList, setClubsList] = useState([
    { id: 'c-1', name: 'Manchester United', badge: '🔴', status: 'Active' },
    { id: 'c-2', name: 'FC Barcelona', badge: '🔵', status: 'Active' },
    { id: 'c-3', name: 'Real Madrid', badge: '⚪', status: 'Active' },
  ]);
  const [playersList, setPlayersList] = useState([
    { id: 'p-1', name: 'Messi', number: 10, country: 'Argentina' },
    { id: 'p-2', name: 'Ronaldo', number: 7, country: 'Portugal' },
    { id: 'p-3', name: 'Beckham', number: 7, country: 'England' },
  ]);

  // Coupon Generator State
  const [coupons, setCoupons] = useState([
    { code: 'CLASSIC10', discount: 10, limit: 100, active: true },
    { code: 'WORLDCUP26', discount: 15, limit: 50, active: true },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);

  // Homepage customizer
  const [heroTitle, setHeroTitle] = useState('WORLD CUP 2026 EDITION');
  const [activePromoBanner, setActivePromoBanner] = useState(true);
  const [selectedSlideIdx, setSelectedSlideIdx] = useState(0);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Countdown search states
  const [team1Search, setTeam1Search] = useState('');
  const [team2Search, setTeam2Search] = useState('');
  const [team1Category, setTeam1Category] = useState('All');
  const [team2Category, setTeam2Category] = useState('All');

  // Banner Management Deck State
  const [bannerCategoryFilter, setBannerCategoryFilter] = useState<string>('All');
  const [editingBanner, setEditingBanner] = useState<BannerConfig | null>(null);
  const [isAddingBanner, setIsAddingBanner] = useState(false);

  // Navigation Builder State
  const [menuPlacementFilter, setMenuPlacementFilter] = useState<string>('All');
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState<boolean>(false);

  // Order Management Operations Detailed State
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Editable fields for selected order modal
  const [editingInternalNotes, setEditingInternalNotes] = useState<string>('');
  const [editingCarrier, setEditingCarrier] = useState<string>('');
  const [editingTrackingNumber, setEditingTrackingNumber] = useState<string>('');
  const [editingTrackingUrl, setEditingTrackingUrl] = useState<string>('');
  const [editingShippedDate, setEditingShippedDate] = useState<string>('');
  const [editingEstDelivery, setEditingEstDelivery] = useState<string>('');

  // Helper icon renderer
  const renderNavIcon = (iconName?: string, size = 16) => {
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
      case 'Users': return <Users size={size} />;
      case 'MapPin': return <MapPin size={size} />;
      case 'Mail': return <Mail size={size} />;
      case 'Layers': return <Layers size={size} />;
      case 'Grid': return <Grid size={size} />;
      default: return <Shirt size={size} />;
    }
  };

  // Image uploader state for quick stock addition
  const [quickAddImage, setQuickAddImage] = useState<string>('');

  // Customer Profile State
  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const stored = localStorage.getItem('vault_saved_customers');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      { id: 'cust-1', fullName: 'Yasin Ahmed', email: 'yasinahmed000997@gmail.com', phone: '+880 1840-990700', address: 'Bailey Road', city: 'Dhaka', location: 'Dhaka', notes: 'Premium collector. Prefers XL Adidas kits.', ordersCount: 3, totalSpent: 980, joinedDate: '2026-03-12' },
      { id: 'cust-2', fullName: 'Taskin Kabir', email: 'taskin.kabir@dhakafc.com', phone: '+880 1711-223344', address: 'Gulshan 2', city: 'Dhaka', location: 'Dhaka', notes: 'Interested in World Cup 1998 releases.', ordersCount: 2, totalSpent: 538, joinedDate: '2026-04-05' },
      { id: 'cust-3', fullName: 'Nafis Imtiaz', email: 'nafis.imtiaz@gmail.com', phone: '+880 1912-345678', address: 'Agrabad', city: 'Chittagong', location: 'Chittagong', notes: 'Vintage retro lover. Loves Maradona tribute kits.', ordersCount: 1, totalSpent: 349, joinedDate: '2026-05-18' },
      { id: 'cust-4', fullName: 'Sajid Islam', email: 'sajid.islam@yahoo.com', phone: '+880 1515-998877', address: 'Dhanmondi 27', city: 'Dhaka', location: 'Dhaka', notes: 'Collector League level 2. Prefers deadstock with original tags.', ordersCount: 2, totalSpent: 488, joinedDate: '2026-06-01' },
      { id: 'cust-5', fullName: 'Zubair Rahman', email: 'zubair.retro@outlook.com', phone: '+880 1616-554433', address: 'Sylhet Cant.', city: 'Sylhet', location: 'Sylhet', notes: 'Repeatedly looking for Manchester United 1999 treble shirt.', ordersCount: 1, totalSpent: 189, joinedDate: '2026-06-25' }
    ];
  });

  // Log activity list
  const [logs, setLogs] = useState<string[]>(() => {
    const stored = localStorage.getItem('vault_admin_logs');
    return stored ? JSON.parse(stored) : [
      '[2026-07-18 14:02] ADMIN: Logged in successfully from IP 103.114.39.22',
      '[2026-07-18 13:45] STOCK: Dhaka Inventory check completed. 3 items flag low limits.',
      '[2026-07-18 12:30] CAMPAIGN: Promo coupon CLASSIC10 updated in configuration.',
      '[2026-07-18 11:15] EXPORT: Automated billing register backed up to cloud bucket.'
    ];
  });

  const handleAddLog = (msg: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setLogs((prev) => {
      const updated = [`[${timestamp}] ${msg}`, ...prev].slice(0, 30);
      localStorage.setItem('vault_admin_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Dashboard toggles & form inputs
  const [chartMetric, setChartMetric] = useState<'sales' | 'revenue'>('revenue');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'repeated' | 'best'>('all');
  
  // Save Customer Form State
  const [custFormId, setCustFormId] = useState('');
  const [custFormName, setCustFormName] = useState('');
  const [custFormEmail, setCustFormEmail] = useState('');
  const [custFormPhone, setCustFormPhone] = useState('');
  const [custFormAddress, setCustFormAddress] = useState('');
  const [custFormCity, setCustFormCity] = useState('Dhaka');
  const [custFormNotes, setCustFormNotes] = useState('');
  const [custFormOrders, setCustFormOrders] = useState(1);
  const [custFormSpent, setCustFormSpent] = useState(150);

  // CSV progress bars simulation
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleUpdateSlide = (updatedSlide: CarouselSlide) => {
    setSlides((prev) => prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s)));
  };

  const handleAddSlide = () => {
    if (slides.length >= 5) return; // limit to 5 slots
    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      title: 'WORLD CUP CLASSIC CLEARANCE',
      subtitle: 'Save Big on Nations Jerseys',
      description: 'Save big on unique Classic 1 of 1s from nations that competed at the 2026 World Cup.',
      badge: 'LIMITED TIME CLEARANCE',
      primaryColor: 'from-[#031d10] to-[#070e0a]',
      productId: products[0]?.id || 'shirt-1',
    };
    setSlides((prev) => {
      const next = [...prev, newSlide];
      setSelectedSlideIdx(next.length - 1);
      return next;
    });
  };

  const handleDeleteSlide = (id: string) => {
    setSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      setSelectedSlideIdx((prevIdx) => Math.min(prevIdx, next.length - 1));
      return next;
    });
  };

  const moveSlide = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;
    setSlides(newSlides);
    setSelectedSlideIdx(targetIdx);
  };

  const bulkLoadWCPresets = () => {
    const wcSlides: CarouselSlide[] = [
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
        title: 'ARGENTINA THREE STARS',
        subtitle: 'Defending Champions Match Jersey',
        description: 'Own a piece of tournament history. Premium gold heat-pressed emblems with dry-fit cooling ventilation fabric.',
        badge: 'DEFENDING CHAMPIONS',
        primaryColor: 'from-[#1e3a8a] to-[#0f172a]',
        productId: 'shirt-4',
        customImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'slide-3',
        title: 'BRAZIL RETRO SAMBA',
        subtitle: 'Seleção Historical Authentic Reissue',
        description: 'The golden classic of Ronaldo No.9. Rare weave texture with vintage embroidery lines direct from the Rio vaults.',
        badge: 'SAMBA LEGENDS',
        primaryColor: 'from-[#064e3b] to-[#022c22]',
        productId: 'shirt-3',
        customImage: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'slide-4',
        title: 'GERMANY RETRO 1990',
        subtitle: 'The Geometric Classic Jersey',
        description: 'Rep the ultimate tournament geometry. Woven details, heavy knit ribbed collars, and pristine historical authenticity.',
        badge: 'HISTORIC REISSUE',
        primaryColor: 'from-[#111827] to-[#030712]',
        productId: 'shirt-6',
        customImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1600'
      },
      {
        id: 'slide-5',
        title: 'DHAKA HUB FAN WEAR',
        subtitle: 'Exclusive Jersey Addicts BD Capsule',
        description: 'Engineered for maximum breathable comfort under Dhaka summers. Express your sheer addiction to the beautiful game.',
        badge: 'LOCAL DHAKA RELEASES',
        primaryColor: 'from-[#065f46] to-[#022c22]',
        productId: 'shirt-1',
        customImage: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1600'
      }
    ];
    setSlides(wcSlides);
    setSelectedSlideIdx(0);
  };

  // Seller request controls
  const handleSellerRequest = (id: string, action: 'Approved' | 'Rejected') => {
    setSellerRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action } : req))
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    setCoupons((prev) => [
      ...prev,
      {
        code: newCouponCode.toUpperCase().trim(),
        discount: newCouponDiscount,
        limit: 100,
        active: true,
      },
    ]);
    setNewCouponCode('');
  };

  const todayStr = '2026-07-18';

  // Order status modifier with Timeline Event Logger & Live State Updates
  const handleUpdateOrderStatus = (orderId: string, newStatus: string, customNote?: string) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id === orderId) {
          const newEvent = {
            id: `evt-${Date.now()}`,
            status: newStatus,
            timestamp,
            note: customNote || `Order status updated to ${newStatus}`,
            updatedBy: 'Admin Operations'
          };
          const updatedTimeline = [newEvent, ...(o.timeline || [])];
          return {
            ...o,
            status: newStatus,
            timeline: updatedTimeline
          };
        }
        return o;
      });
      localStorage.setItem('vault_orders', JSON.stringify(next));
      return next;
    });
    handleAddLog(`[ORDER] Order ${orderId} status changed to "${newStatus}"`);
    if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
      setSelectedOrderForModal(prev => prev ? {
        ...prev,
        status: newStatus,
        timeline: [{ id: `evt-${Date.now()}`, status: newStatus, timestamp, note: customNote || `Order status updated to ${newStatus}`, updatedBy: 'Admin Operations' }, ...(prev.timeline || [])]
      } : null);
    }
  };

  // Open Detail Operations Modal
  const handleOpenOrderModal = (order: Order) => {
    setSelectedOrderForModal(order);
    setEditingInternalNotes(order.internalNotes || '');
    setEditingCarrier(order.carrier || 'Steadfast Courier');
    setEditingTrackingNumber(order.trackingNumber || `BD-SF-${Math.floor(100000 + Math.random() * 900000)}`);
    setEditingTrackingUrl(order.trackingUrl || `https://steadfast.com.bd/tracking/${order.trackingNumber || 'BD-SF-100200'}`);
    setEditingShippedDate(order.shippedDate || todayStr);
    setEditingEstDelivery(order.estimatedDelivery || '1-3 Business Days');
  };

  // Save Order Tracking & Logistics
  const handleSaveOrderLogistics = (orderId: string) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id === orderId) {
          const newEvent = {
            id: `evt-${Date.now()}`,
            status: o.status,
            timestamp,
            note: `Logistics updated: Carrier: ${editingCarrier}, Tracking #${editingTrackingNumber}`,
            updatedBy: 'Logistics Desk'
          };
          return {
            ...o,
            carrier: editingCarrier,
            trackingNumber: editingTrackingNumber,
            trackingUrl: editingTrackingUrl,
            shippedDate: editingShippedDate,
            estimatedDelivery: editingEstDelivery,
            timeline: [newEvent, ...(o.timeline || [])]
          };
        }
        return o;
      });
      localStorage.setItem('vault_orders', JSON.stringify(next));
      return next;
    });
    if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
      setSelectedOrderForModal(prev => prev ? {
        ...prev,
        carrier: editingCarrier,
        trackingNumber: editingTrackingNumber,
        trackingUrl: editingTrackingUrl,
        shippedDate: editingShippedDate,
        estimatedDelivery: editingEstDelivery,
        timeline: [{ id: `evt-${Date.now()}`, status: prev.status, timestamp, note: `Logistics updated: Carrier: ${editingCarrier}, Tracking #${editingTrackingNumber}`, updatedBy: 'Logistics Desk' }, ...(prev.timeline || [])]
      } : null);
    }
    handleAddLog(`[ORDER] Updated carrier/tracking info for Order ${orderId}`);
    alert('✓ Logistics & tracking info saved and updated live!');
  };

  // Save Internal Admin Notes
  const handleSaveInternalNotes = (orderId: string) => {
    setOrders((prev) => {
      const next = prev.map((o) => o.id === orderId ? { ...o, internalNotes: editingInternalNotes } : o);
      localStorage.setItem('vault_orders', JSON.stringify(next));
      return next;
    });
    if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
      setSelectedOrderForModal(prev => prev ? { ...prev, internalNotes: editingInternalNotes } : null);
    }
    handleAddLog(`[ORDER] Updated internal notes for Order ${orderId}`);
    alert('✓ Internal admin notes saved live!');
  };

  // Simulated Bulk Order Generator with All 9 Statuses & Rich Metadata
  const handleAddSimulatedOrders = (count: number) => {
    const customerNames = [
      'Siyam Rahman', 'Fahim Chowdhury', 'Arifur Bari', 'Farzana Yasmin', 
      'Rashedul Bari', 'Anika Bushra', 'Sultana Haque', 'Ziaul Kabir'
    ];
    const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
    const addresses = [
      'Sector 11, Uttara', 'OR Nizam Road', 'Zindabazar', 'Shaheb Bazar', 'Boyra Main Road'
    ];
    const phones = ['+880 1711-223344', '+880 1819-334455', '+880 1912-445566', '+880 1515-556677'];
    const carriers = ['Steadfast Courier', 'RedX Logistics', 'Pathao Courier', 'Paperfly', 'DHL Express'];
    const allStatuses: Order['status'][] = [
      'Pending', 'Confirmed', 'Packed', 'Ready to Ship', 
      'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refund Request'
    ];
    
    const newOrders: Order[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomCustName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const randomEmail = `${randomCustName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomAddress = `${addresses[Math.floor(Math.random() * addresses.length)]}, ${randomCity}`;
      const randomPhone = phones[Math.floor(Math.random() * phones.length)];
      const status = allStatuses[i % allStatuses.length];
      const carrier = carriers[Math.floor(Math.random() * carriers.length)];
      const trackingNum = `BD-${carrier.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const randomProd = products[Math.floor(Math.random() * products.length)];
      if (!randomProd) continue;
      
      const qty = Math.floor(Math.random() * 2) + 1;
      const size = randomProd.sizes[Math.floor(Math.random() * randomProd.sizes.length)] || 'M';
      
      const orderId = `ORD-SIM-${Math.floor(100000 + Math.random() * 900000)}`;
      const subtotal = randomProd.price * qty;
      const tax = Math.round(subtotal * 0.05);
      const shipping = 70;
      const total = subtotal + tax + shipping;
      const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      
      const newOrder: Order = {
        id: orderId,
        date: todayStr,
        createdAt: todayStr,
        status,
        carrier,
        trackingNumber: trackingNum,
        trackingUrl: `https://${carrier.toLowerCase().replace(/\s+/g, '')}.com/track/${trackingNum}`,
        shippedDate: status === 'Shipped' || status === 'Delivered' ? todayStr : undefined,
        estimatedDelivery: '1-3 Business Days',
        customerNotes: 'Please deliver after 3 PM if possible. Call before arriving.',
        internalNotes: `Customer verified via phone. High value authentic order (${status}).`,
        timeline: [
          { id: `evt-${Date.now()}-2`, status: status, timestamp, note: `Order moved to ${status}`, updatedBy: 'Admin System' },
          { id: `evt-${Date.now()}-1`, status: 'Pending', timestamp: '2026-07-24 09:00', note: 'Order placed by customer via checkout', updatedBy: 'Customer' }
        ],
        items: [
          {
            product: randomProd,
            selectedSize: size,
            addBadge: true,
            customPrint: { name: 'RONALDO', number: 7 },
            quantity: qty
          }
        ],
        subtotal,
        tax,
        shipping,
        total,
        deliveryRegion: randomCity === 'Dhaka' ? 'inside' : 'outside',
        deliveryCharge: randomCity === 'Dhaka' ? 70 : 130,
        shippingAddress: {
          fullName: randomCustName,
          email: randomEmail,
          addressLine1: randomAddress,
          city: randomCity,
          postalCode: `${Math.floor(1000 + Math.random() * 8000)}`,
          country: 'Bangladesh',
          phone: randomPhone
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: status === 'Delivered' ? 'Paid' : 'Unpaid'
      };
      
      newOrders.push(newOrder);
      
      // Dynamic Stock decrement
      setProducts((prev) => 
        prev.map((p) => p.id === randomProd.id ? { ...p, stock: Math.max(0, p.stock - qty) } : p)
      );
      
      // Register/Update Customer profile
      setCustomers((prev) => {
        const existingIdx = prev.findIndex((c) => c.email.toLowerCase() === randomEmail.toLowerCase());
        let updatedCusts = [...prev];
        if (existingIdx >= 0) {
          updatedCusts[existingIdx] = {
            ...updatedCusts[existingIdx],
            ordersCount: updatedCusts[existingIdx].ordersCount + 1,
            totalSpent: updatedCusts[existingIdx].totalSpent + total,
          };
        } else {
          updatedCusts.push({
            id: `cust-${Date.now()}-${i}`,
            fullName: randomCustName,
            email: randomEmail,
            phone: randomPhone,
            address: randomAddress,
            city: randomCity,
            location: randomCity,
            ordersCount: 1,
            totalSpent: total,
            joinedDate: todayStr
          });
        }
        localStorage.setItem('vault_saved_customers', JSON.stringify(updatedCusts));
        return updatedCusts;
      });
      
      handleAddLog(`[ORD_SIM] Automatically generated simulated sale order ${orderId} for ${randomCustName} [${status}] (${formatPrice(total)})`);
    }
    
    setOrders((prev) => {
      const next = [...newOrders, ...prev];
      localStorage.setItem('vault_orders', JSON.stringify(next));
      return next;
    });
    alert(`✓ Successfully loaded ${count} simulated checkout orders covering all status pipelines!`);
  };

  // Trigger CSV Download simulation
  const handleExportCSVReport = () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(5);
    
    const interval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          
          const csvRows = [
            ['Report Date', todayStr],
            ['Total Active Orders', orders.length],
            [],
            ['Order ID', 'Customer', 'Date', 'Total Value', 'Status', 'Payment Method']
          ];
          
          orders.forEach(o => {
            csvRows.push([o.id, o.shippingAddress?.fullName || 'N/A', o.date, o.total, o.status, o.paymentMethod]);
          });
          
          const csvContent = "data:text/csv;charset=utf-8," 
            + csvRows.map(e => e.join(",")).join("\n");
          
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "JerseyAddictsBD_Sales_Report.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          handleAddLog('[SYSTEM] Successfully generated and exported full CSV database audit register.');
          return 100;
        }
        return p + 25;
      });
    }, 350);
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 148290; // Add simulated historical sales
  const pendingRequestsCount = sellerRequests.filter((r) => r.status === 'Pending').length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;

  const [sidebarSearch, setSidebarSearch] = useState('');

  const SIDEBAR_GROUPS = [
    {
      title: '📊 Core Analytics',
      items: [
        { id: 'dashboard', label: 'Overview Dashboard' },
        { id: 'analytics', label: 'Revenue & Sales Trends' },
        { id: 'backup-restore', label: 'Database Snapshot' },
      ]
    },
    {
      title: '🎨 Full Dynamic CMS',
      items: [
        { id: 'homepage-builder', label: 'Homepage Sections' },
        { id: 'page-builder', label: 'Custom Page Builder' },
        { id: 'menu-builder', label: 'Navigation Menu Builder' },
        { id: 'mega-menu', label: 'Mega Menu dropdown' },
        { id: 'header-builder', label: 'Header Customizer' },
        { id: 'footer-builder', label: 'Footer Builder' },
        { id: 'announcement-bar', label: 'Announcement Ticker' },
        { id: 'banner-management', label: 'Banner Management Deck' },
        { id: 'hero-slider', label: 'Hero Slides & Banners' },
      ]
    },
    {
      title: '⚽ Sports Entity Registrars',
      items: [
        { id: 'collections', label: 'Collections Curator' },
        { id: 'categories', label: 'Category Registry' },
        { id: 'leagues', label: 'League Registry' },
        { id: 'clubs', label: 'Club Vaults' },
        { id: 'national-teams', label: 'National Teams' },
        { id: 'brands', label: 'Brand Registry' },
        { id: 'players', label: 'Player Print Legend' },
      ]
    },
    {
      title: '🛍 E-Commerce Docks',
      items: [
        { id: 'product-management', label: 'Product Manager' },
        { id: 'inventory', label: 'Inventory & Bins' },
        { id: 'orders', label: 'Orders Ledger' },
        { id: 'customers', label: 'Collector CRM' },
        { id: 'coupons', label: 'Coupons & Campaigns' },
        { id: 'reviews', label: 'Buyer Reviews Desk' },
      ]
    },
    {
      title: '📣 Sourced Marketing Room',
      items: [
        { id: 'blogs', label: 'Vintage Journal Blogs' },
        { id: 'gallery', label: 'Fan Unboxing Gallery' },
        { id: 'videos', label: 'Video Showcase Banners' },
        { id: 'testimonials', label: 'Buyer Quotes Desk' },
        { id: 'newsletter', label: 'Newsletter Captains' },
        { id: 'locations', label: 'Bailey Road Outlets' },
      ]
    },
    {
      title: '⚙ Platform System Controllers',
      items: [
        { id: 'brand-customizer', label: 'Theme & Colors' },
        { id: 'media-library', label: 'Base64 Asset Library' },
        { id: 'roles-permissions', label: 'Staff Roles Security' },
        { id: 'system-settings', label: 'VAT, Delivery & Gateway' },
      ]
    }
  ];

  return (
    <section className="bg-white text-emerald-950 py-10 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            <h1 className="text-3xl font-black uppercase tracking-tight text-emerald-950">Admin Command Room</h1>
          </div>
          <p className="text-xs text-emerald-800 font-mono">
            Platform Engine • Secure Control Tower 2026
          </p>
        </div>
        <button
          onClick={onBackToCatalog}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl cursor-pointer"
        >
          Return to Client Website
        </button>
      </div>

      {/* Admin Two-Column CMS Suite */}
      <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column: Collapsible CMS Sidebar tree */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-emerald-50/20 border border-emerald-100/50 p-5 rounded-3xl space-y-5">
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest">
              JERSEY ADDICTS CMS
            </h4>
            <p className="text-[10px] text-emerald-800 font-mono">Select a module to manage live Dhaka platform data.</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search CMS modules..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full text-xs py-2.5 pl-9 pr-3 bg-white border border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-emerald-950 transition-all"
            />
            <Search size={13} className="absolute left-3.5 top-3.5 text-emerald-800/60" />
          </div>

          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin">
            {SIDEBAR_GROUPS.map((group) => {
              const filteredItems = group.items.filter(item =>
                item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
              );
              if (filteredItems.length === 0) return null;

              return (
                <div key={group.title} className="space-y-1.5">
                  <span className="text-[9px] font-mono tracking-widest text-emerald-800 font-black uppercase block px-1">
                    {group.title}
                  </span>
                  <div className="space-y-1">
                    {filteredItems.map((item) => {
                      const isActive = activeSidebarTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSidebarTab(item.id);
                            if (['dashboard', 'inventory', 'seller-requests', 'homepage-builder', 'coupons', 'brand-customizer'].includes(item.id)) {
                              setActiveTab(item.id as any);
                            } else {
                              setActiveTab('homepage-builder'); // Keep safe fallback
                            }
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md shadow-emerald-800/10'
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-100/50'
                          }`}
                        >
                          <SlidersHorizontal size={12} className={isActive ? 'text-white' : 'text-emerald-700'} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active CMS Detail Panel */}
        <div className="flex-grow flex-1 w-full min-w-0">

      {/* RENDER ACTIVE TAB */}
      {/* RENDER ACTIVE TAB */}
      {activeSidebarTab === 'dashboard' && (() => {
        // Compute dynamic KPI stats
        const todayStr = '2026-07-18';
        const todayOrders = orders.filter((o) => o.date === todayStr);
        const todayOrdersCount = todayOrders.length;
        const todayOrdersRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

        const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
        const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
        const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled').length;

        const baseRevenue = 158400; // Historical base in Taka
        const ordersRevenue = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
        const dynamicRevenue = ordersRevenue + baseRevenue;
        
        const dynamicExpense = Math.round(dynamicRevenue * 0.42); // Sourcing & Logistics 42%
        const dynamicProfit = dynamicRevenue - dynamicExpense;

        const dynamicLowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
        const dynamicOutOfStockCount = products.filter((p) => p.stock === 0).length;

        // Top Selling calculations
        const pMap: { [key: string]: number } = {};
        orders.forEach((o) => {
          if (o.status !== 'Cancelled') {
            o.items.forEach((it) => {
              if (it.product && it.product.id) {
                pMap[it.product.id] = (pMap[it.product.id] || 0) + it.quantity;
              }
            });
          }
        });

        const topProducts = [
          { name: '1998 France World Cup Home Shirt', sales: 18 + (pMap['shirt-1'] || 0), revenue: 349 * (18 + (pMap['shirt-1'] || 0)), id: 'shirt-1' },
          { name: '2004-06 England Home Shirt', sales: 14 + (pMap['shirt-2'] || 0), revenue: 189 * (14 + (pMap['shirt-2'] || 0)), id: 'shirt-2' },
          { name: '1994 Brazil World Cup Away Shirt', sales: 10 + (pMap['shirt-3'] || 0), revenue: 249 * (10 + (pMap['shirt-3'] || 0)), id: 'shirt-3' },
          { name: '1990 Germany Retro Home Shirt', sales: 8 + (pMap['shirt-6'] || 0), revenue: 299 * (8 + (pMap['shirt-6'] || 0)), id: 'shirt-6' }
        ].sort((a, b) => b.sales - a.sales);

        const tMap: { [key: string]: number } = {};
        orders.forEach((o) => {
          if (o.status !== 'Cancelled') {
            o.items.forEach((it) => {
              if (it.product) {
                const t = it.product.club || it.product.country || 'Unknown';
                tMap[t] = (tMap[t] || 0) + it.quantity;
              }
            });
          }
        });

        const topTeams = [
          { name: 'France', sales: 22 + (tMap['France'] || 0) },
          { name: 'England', sales: 17 + (tMap['England'] || 0) },
          { name: 'Brazil', sales: 12 + (tMap['Brazil'] || 0) },
          { name: 'Germany', sales: 9 + (tMap['Germany'] || 0) }
        ].sort((a, b) => b.sales - a.sales);

        const lMap: { [key: string]: number } = {};
        orders.forEach((o) => {
          if (o.status !== 'Cancelled') {
            o.items.forEach((it) => {
              if (it.product) {
                const l = it.product.league || it.product.category || 'Vintage World Cup';
                lMap[l] = (lMap[l] || 0) + it.quantity;
              }
            });
          }
        });

        const topLeagues = [
          { name: 'World Cup', sales: 34 + (lMap['World Cup'] || lMap['World Cup Vault'] || 0) },
          { name: 'Classic Vintage', sales: 21 + (lMap['Classic'] || lMap['Classic Vintage'] || 0) },
          { name: 'Euro', sales: 15 + (lMap['Euro'] || 0) },
          { name: 'Current Season', sales: 8 + (lMap['Current Season'] || 0) }
        ].sort((a, b) => b.sales - a.sales);

        // Filter and rank customers
        const filteredCustomers = customers.filter((c) => {
          const s = customerSearch.toLowerCase();
          return c.fullName.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.phone.includes(s) || c.city.toLowerCase().includes(s);
        });

        let displayCustomers = [...filteredCustomers];
        if (customerFilter === 'repeated') {
          displayCustomers = displayCustomers.filter((c) => c.ordersCount >= 2);
        } else if (customerFilter === 'best') {
          displayCustomers = displayCustomers.sort((a, b) => b.totalSpent - a.totalSpent);
        }

        // Charts Monthly Data
        const monthlyData = [
          { month: 'Jan', orders: 12, revenue: 3840 },
          { month: 'Feb', orders: 18, revenue: 5540 },
          { month: 'Mar', orders: 15, revenue: 4890 },
          { month: 'Apr', orders: 24, revenue: 7500 },
          { month: 'May', orders: 28, revenue: 8200 },
          { month: 'Jun', orders: 32, revenue: 9500 },
          { month: 'Jul', orders: 40 + orders.length, revenue: 12000 + orders.reduce((s, o) => s + o.total, 0) },
          { month: 'Aug', orders: 36, revenue: 11000 },
          { month: 'Sep', orders: 45, revenue: 13500 },
          { month: 'Oct', orders: 48, revenue: 14200 },
          { month: 'Nov', orders: 52, revenue: 15800 },
          { month: 'Dec', orders: 60, revenue: 18000 }
        ];

        // Simulated Bulk Order Generator with All 9 Statuses & Rich Metadata
        const handleAddSimulatedOrders = (count: number) => {
          const customerNames = [
            'Siyam Rahman', 'Fahim Chowdhury', 'Arifur Bari', 'Farzana Yasmin', 
            'Rashedul Bari', 'Anika Bushra', 'Sultana Haque', 'Ziaul Kabir'
          ];
          const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
          const addresses = [
            'Sector 11, Uttara', 'OR Nizam Road', 'Zindabazar', 'Shaheb Bazar', 'Boyra Main Road'
          ];
          const phones = ['+880 1711-223344', '+880 1819-334455', '+880 1912-445566', '+880 1515-556677'];
          const carriers = ['Steadfast Courier', 'RedX Logistics', 'Pathao Courier', 'Paperfly', 'DHL Express'];
          const allStatuses: Order['status'][] = [
            'Pending', 'Confirmed', 'Packed', 'Ready to Ship', 
            'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refund Request'
          ];
          
          const newOrders: Order[] = [];
          
          for (let i = 0; i < count; i++) {
            const randomCustName = customerNames[Math.floor(Math.random() * customerNames.length)];
            const randomEmail = `${randomCustName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomAddress = `${addresses[Math.floor(Math.random() * addresses.length)]}, ${randomCity}`;
            const randomPhone = phones[Math.floor(Math.random() * phones.length)];
            const status = allStatuses[i % allStatuses.length];
            const carrier = carriers[Math.floor(Math.random() * carriers.length)];
            const trackingNum = `BD-${carrier.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
            
            const randomProd = products[Math.floor(Math.random() * products.length)];
            if (!randomProd) continue;
            
            const qty = Math.floor(Math.random() * 2) + 1;
            const size = randomProd.sizes[Math.floor(Math.random() * randomProd.sizes.length)] || 'M';
            
            const orderId = `ORD-SIM-${Math.floor(100000 + Math.random() * 900000)}`;
            const subtotal = randomProd.price * qty;
            const tax = Math.round(subtotal * 0.05);
            const shipping = 70;
            const total = subtotal + tax + shipping;
            const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
            
            const newOrder: Order = {
              id: orderId,
              date: todayStr,
              createdAt: todayStr,
              status,
              carrier,
              trackingNumber: trackingNum,
              trackingUrl: `https://${carrier.toLowerCase().replace(/\s+/g, '')}.com/track/${trackingNum}`,
              shippedDate: status === 'Shipped' || status === 'Delivered' ? todayStr : undefined,
              estimatedDelivery: '1-3 Business Days',
              customerNotes: 'Please deliver after 3 PM if possible. Call before arriving.',
              internalNotes: `Customer verified via phone. High value authentic order (${status}).`,
              timeline: [
                { id: `evt-${Date.now()}-2`, status: status, timestamp, note: `Order moved to ${status}`, updatedBy: 'Admin System' },
                { id: `evt-${Date.now()}-1`, status: 'Pending', timestamp: '2026-07-24 09:00', note: 'Order placed by customer via checkout', updatedBy: 'Customer' }
              ],
              items: [
                {
                  product: randomProd,
                  selectedSize: size,
                  addBadge: true,
                  customPrint: { name: 'RONALDO', number: 7 },
                  quantity: qty
                }
              ],
              subtotal,
              tax,
              shipping,
              total,
              deliveryRegion: randomCity === 'Dhaka' ? 'inside' : 'outside',
              deliveryCharge: randomCity === 'Dhaka' ? 70 : 130,
              shippingAddress: {
                fullName: randomCustName,
                email: randomEmail,
                addressLine1: randomAddress,
                city: randomCity,
                postalCode: `${Math.floor(1000 + Math.random() * 8000)}`,
                country: 'Bangladesh',
                phone: randomPhone
              },
              paymentMethod: 'Cash on Delivery',
              paymentStatus: status === 'Delivered' ? 'Paid' : 'Unpaid'
            };
            
            newOrders.push(newOrder);
            
            // Dynamic Stock decrement
            setProducts((prev) => 
              prev.map((p) => p.id === randomProd.id ? { ...p, stock: Math.max(0, p.stock - qty) } : p)
            );
            
            // Register/Update Customer profile
            setCustomers((prev) => {
              const existingIdx = prev.findIndex((c) => c.email.toLowerCase() === randomEmail.toLowerCase());
              let updatedCusts = [...prev];
              if (existingIdx >= 0) {
                updatedCusts[existingIdx] = {
                  ...updatedCusts[existingIdx],
                  ordersCount: updatedCusts[existingIdx].ordersCount + 1,
                  totalSpent: updatedCusts[existingIdx].totalSpent + total,
                };
              } else {
                updatedCusts.push({
                  id: `cust-${Date.now()}-${i}`,
                  fullName: randomCustName,
                  email: randomEmail,
                  phone: randomPhone,
                  address: randomAddress,
                  city: randomCity,
                  location: randomCity,
                  ordersCount: 1,
                  totalSpent: total,
                  joinedDate: todayStr
                });
              }
              localStorage.setItem('vault_saved_customers', JSON.stringify(updatedCusts));
              return updatedCusts;
            });
            
            handleAddLog(`[ORD_SIM] Automatically generated simulated sale order ${orderId} for ${randomCustName} [${status}] (${formatPrice(total)})`);
          }
          
          setOrders((prev) => {
            const next = [...newOrders, ...prev];
            localStorage.setItem('vault_orders', JSON.stringify(next));
            return next;
          });
          alert(`✓ Successfully loaded ${count} simulated checkout orders covering all status pipelines!`);
        };

        // Restock All Low Stock Items
        const handleRestockLowItems = () => {
          setProducts((prev) => {
            const next = prev.map((p) => p.stock <= 3 ? { ...p, stock: 12 } : p);
            localStorage.setItem('vault_custom_products', JSON.stringify(next));
            return next;
          });
          handleAddLog('[STOCK] Bulk restocked all low limit and out of stock jerseys (set to 12 qty)');
          alert('Successfully restocked all low-stock jerseys in Dhaka warehouse to 12 items!');
        };

        // Order status modifier with Timeline Event Logger & Live State Updates
        const handleUpdateOrderStatus = (orderId: string, newStatus: string, customNote?: string) => {
          const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
          setOrders((prev) => {
            const next = prev.map((o) => {
              if (o.id === orderId) {
                const newEvent = {
                  id: `evt-${Date.now()}`,
                  status: newStatus,
                  timestamp,
                  note: customNote || `Order status updated to ${newStatus}`,
                  updatedBy: 'Admin Operations'
                };
                const updatedTimeline = [newEvent, ...(o.timeline || [])];
                return {
                  ...o,
                  status: newStatus,
                  timeline: updatedTimeline
                };
              }
              return o;
            });
            localStorage.setItem('vault_orders', JSON.stringify(next));
            return next;
          });
          handleAddLog(`[ORDER] Order ${orderId} status changed to "${newStatus}"`);
          if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
            setSelectedOrderForModal(prev => prev ? {
              ...prev,
              status: newStatus,
              timeline: [{ id: `evt-${Date.now()}`, status: newStatus, timestamp, note: customNote || `Order status updated to ${newStatus}`, updatedBy: 'Admin Operations' }, ...(prev.timeline || [])]
            } : null);
          }
        };

        // Open Detail Operations Modal
        const handleOpenOrderModal = (order: Order) => {
          setSelectedOrderForModal(order);
          setEditingInternalNotes(order.internalNotes || '');
          setEditingCarrier(order.carrier || 'Steadfast Courier');
          setEditingTrackingNumber(order.trackingNumber || `BD-SF-${Math.floor(100000 + Math.random() * 900000)}`);
          setEditingTrackingUrl(order.trackingUrl || `https://steadfast.com.bd/tracking/${order.trackingNumber || 'BD-SF-100200'}`);
          setEditingShippedDate(order.shippedDate || todayStr);
          setEditingEstDelivery(order.estimatedDelivery || '1-3 Business Days');
        };

        // Save Order Tracking & Logistics
        const handleSaveOrderLogistics = (orderId: string) => {
          const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
          setOrders((prev) => {
            const next = prev.map((o) => {
              if (o.id === orderId) {
                const newEvent = {
                  id: `evt-${Date.now()}`,
                  status: o.status,
                  timestamp,
                  note: `Logistics updated: Carrier: ${editingCarrier}, Tracking #${editingTrackingNumber}`,
                  updatedBy: 'Logistics Desk'
                };
                return {
                  ...o,
                  carrier: editingCarrier,
                  trackingNumber: editingTrackingNumber,
                  trackingUrl: editingTrackingUrl,
                  shippedDate: editingShippedDate,
                  estimatedDelivery: editingEstDelivery,
                  timeline: [newEvent, ...(o.timeline || [])]
                };
              }
              return o;
            });
            localStorage.setItem('vault_orders', JSON.stringify(next));
            return next;
          });
          if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
            setSelectedOrderForModal(prev => prev ? {
              ...prev,
              carrier: editingCarrier,
              trackingNumber: editingTrackingNumber,
              trackingUrl: editingTrackingUrl,
              shippedDate: editingShippedDate,
              estimatedDelivery: editingEstDelivery,
              timeline: [{ id: `evt-${Date.now()}`, status: prev.status, timestamp, note: `Logistics updated: Carrier: ${editingCarrier}, Tracking #${editingTrackingNumber}`, updatedBy: 'Logistics Desk' }, ...(prev.timeline || [])]
            } : null);
          }
          handleAddLog(`[ORDER] Updated carrier/tracking info for Order ${orderId}`);
          alert('✓ Logistics & tracking info saved and updated live!');
        };

        // Save Internal Admin Notes
        const handleSaveInternalNotes = (orderId: string) => {
          setOrders((prev) => {
            const next = prev.map((o) => o.id === orderId ? { ...o, internalNotes: editingInternalNotes } : o);
            localStorage.setItem('vault_orders', JSON.stringify(next));
            return next;
          });
          if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
            setSelectedOrderForModal(prev => prev ? { ...prev, internalNotes: editingInternalNotes } : null);
          }
          handleAddLog(`[ORDER] Updated internal notes for Order ${orderId}`);
          alert('✓ Internal admin notes saved live!');
        };

        // Customer Profile select
        const handleSelectCustomer = (c: CustomerProfile) => {
          setCustFormId(c.id);
          setCustFormName(c.fullName);
          setCustFormEmail(c.email);
          setCustFormPhone(c.phone);
          setCustFormAddress(c.address);
          setCustFormCity(c.city || 'Dhaka');
          setCustFormNotes(c.notes || '');
          setCustFormOrders(c.ordersCount);
          setCustFormSpent(c.totalSpent);
          handleAddLog(`[CRM] Loaded profile for ${c.fullName} into editor form.`);
        };

        // Save Customer Profile Form
        const handleSaveCustomerProfile = (e: React.FormEvent) => {
          e.preventDefault();
          if (!custFormName || !custFormEmail || !custFormPhone) {
            alert('Required inputs: Full Name, Email, and Phone number are missing.');
            return;
          }
          
          setCustomers((prev) => {
            let next;
            const existingIdx = prev.findIndex((c) => c.email.toLowerCase() === custFormEmail.toLowerCase() || (custFormId && c.id === custFormId));
            
            if (existingIdx >= 0) {
              next = [...prev];
              next[existingIdx] = {
                ...next[existingIdx],
                fullName: custFormName,
                phone: custFormPhone,
                address: custFormAddress,
                city: custFormCity,
                location: custFormCity,
                notes: custFormNotes,
                ordersCount: Number(custFormOrders),
                totalSpent: Number(custFormSpent),
              };
              handleAddLog(`[CUSTOMER] Modified profile database entry for ${custFormName} (${custFormEmail})`);
            } else {
              const newCust: CustomerProfile = {
                id: `cust-${Date.now()}`,
                fullName: custFormName,
                email: custFormEmail,
                phone: custFormPhone,
                address: custFormAddress,
                city: custFormCity,
                location: custFormCity,
                notes: custFormNotes,
                ordersCount: Number(custFormOrders),
                totalSpent: Number(custFormSpent),
                joinedDate: todayStr
              };
              next = [newCust, ...prev];
              handleAddLog(`[CUSTOMER] Registered new collector profile in database: ${custFormName}`);
            }
            localStorage.setItem('vault_saved_customers', JSON.stringify(next));
            return next;
          });
          
          // Clear form
          setCustFormId('');
          setCustFormName('');
          setCustFormEmail('');
          setCustFormPhone('');
          setCustFormAddress('');
          setCustFormCity('Dhaka');
          setCustFormNotes('');
          setCustFormOrders(1);
          setCustFormSpent(150);
          alert('Customer Database profile saved successfully!');
        };

        // Trigger CSV Download simulation
        const handleExportCSVReport = () => {
          if (isExporting) return;
          setIsExporting(true);
          setExportProgress(5);
          
          const interval = setInterval(() => {
            setExportProgress((p) => {
              if (p >= 100) {
                clearInterval(interval);
                setIsExporting(false);
                
                // Trigger real file download simulation with sales data!
                const csvRows = [
                  ['Report Date', '2026-07-18'],
                  ['Total Sourced Revenue (৳)', dynamicRevenue],
                  ['Projected Profit (৳)', dynamicProfit],
                  ['Projected Expense (৳)', dynamicExpense],
                  ['Total Active Orders', orders.length],
                  [],
                  ['Order ID', 'Customer', 'Date', 'Total Value', 'Status', 'Payment Method']
                ];
                
                orders.forEach(o => {
                  csvRows.push([o.id, o.shippingAddress.fullName, o.date, o.total, o.status, o.paymentMethod]);
                });
                
                const csvContent = "data:text/csv;charset=utf-8," 
                  + csvRows.map(e => e.join(",")).join("\n");
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "JerseyAddictsBD_Sales_Report.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                handleAddLog('[SYSTEM] Successfully generated and exported full CSV database audit register.');
                return 100;
              }
              return p + 25;
            });
          }, 350);
        };

        // Reset Simulated sales database
        const handleResetDatabase = () => {
          if (window.confirm('WARNING: Are you sure you want to clear the simulated database history? This resets orders, customer entries, and activities back to defaults.')) {
            setOrders([]);
            localStorage.removeItem('vault_orders');
            localStorage.removeItem('vault_saved_customers');
            localStorage.removeItem('vault_admin_logs');
            setCustomers([
              { id: 'cust-1', fullName: 'Yasin Ahmed', email: 'yasinahmed000997@gmail.com', phone: '+880 1840-990700', address: 'Bailey Road', city: 'Dhaka', location: 'Dhaka', notes: 'Premium collector. Prefers XL Adidas kits.', ordersCount: 3, totalSpent: 980, joinedDate: '2026-03-12' },
              { id: 'cust-2', fullName: 'Taskin Kabir', email: 'taskin.kabir@dhakafc.com', phone: '+880 1711-223344', address: 'Gulshan 2', city: 'Dhaka', location: 'Dhaka', notes: 'Interested in World Cup 1998 releases.', ordersCount: 2, totalSpent: 538, joinedDate: '2026-04-05' },
              { id: 'cust-3', fullName: 'Nafis Imtiaz', email: 'nafis.imtiaz@gmail.com', phone: '+880 1912-345678', address: 'Agrabad', city: 'Chittagong', location: 'Chittagong', notes: 'Vintage retro lover. Loves Maradona tribute kits.', ordersCount: 1, totalSpent: 349, joinedDate: '2026-05-18' }
            ]);
            setLogs([
              '[2026-07-18 14:02] ADMIN: Reset database back to default historical logs.',
              '[2026-07-18 13:45] STOCK: Sourced inventory check completed.'
            ]);
            alert('Admin simulation database has been successfully reset!');
          }
        };

        return (
          <div className="space-y-8 animate-fadeIn">
            
            {/* KPI STATS CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Gross Sales, Expense & Net Profit Card */}
              <div className="col-span-1 md:col-span-3 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-emerald-800">
                <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl select-none font-mono">৳</div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="bg-emerald-800/80 text-emerald-100 text-[9px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-600/50">
                      FINANCIAL VAULT CONTROL
                    </span>
                    <h2 className="text-[11px] font-mono text-emerald-300 mt-3 uppercase tracking-wider">Gross Sourced Store Revenue</h2>
                    <h1 className="text-4xl md:text-5xl font-black mt-1 text-emerald-50 tracking-tight">{formatPrice(dynamicRevenue)}</h1>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-12 border-t md:border-t-0 md:border-l border-emerald-800/80 pt-4 md:pt-0 md:pl-12">
                    <div>
                      <p className="text-[10px] text-emerald-300 font-mono flex items-center gap-1.5 uppercase">
                        <TrendingUp size={11} className="text-emerald-400" />
                        Projected Profit (58%)
                      </p>
                      <h3 className="text-xl md:text-2xl font-black text-emerald-400 mt-1">{formatPrice(dynamicProfit)}</h3>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300 font-mono flex items-center gap-1.5 uppercase">
                        <ShoppingBag size={11} className="text-amber-400" />
                        Sourcing Cost (42%)
                      </p>
                      <h3 className="text-xl md:text-2xl font-black text-amber-200 mt-1">{formatPrice(dynamicExpense)}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Sales Alert */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl relative overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-800 text-[10px] font-mono tracking-wider uppercase font-bold">Today's Orders Desk</p>
                    <h2 className="text-3xl font-black text-emerald-950 mt-1">{todayOrdersCount}</h2>
                  </div>
                  <span className="p-2.5 rounded-xl bg-emerald-100/50 text-emerald-800"><ShoppingBag size={18} /></span>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center justify-between text-[10px] text-emerald-800 font-mono">
                  <span>Gross intake today:</span>
                  <span className="font-extrabold text-emerald-950">{formatPrice(todayOrdersRevenue)}</span>
                </div>
              </div>

              {/* Order Status Breakdown KPIs */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl relative overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-800 text-[10px] font-mono tracking-wider uppercase font-bold">Order Queue Status</p>
                    <h2 className="text-3xl font-black text-emerald-950 mt-1">{orders.length} Total</h2>
                  </div>
                  <span className="p-2.5 rounded-xl bg-emerald-100/50 text-emerald-800"><RefreshCw size={18} className="animate-spin" style={{ animationDuration: '8s' }} /></span>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-100/60 grid grid-cols-3 gap-2 text-[9px] font-mono text-center">
                  <div className="bg-amber-50 text-amber-800 border border-amber-100 p-1 rounded-lg">
                    <span className="block font-black text-xs">{pendingOrdersCount}</span>
                    PENDING
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-1 rounded-lg">
                    <span className="block font-black text-xs">{completedOrdersCount}</span>
                    COMPLETED
                  </div>
                  <div className="bg-rose-50 text-rose-800 border border-rose-100 p-1 rounded-lg">
                    <span className="block font-black text-xs">{cancelledOrdersCount}</span>
                    CANCELLED
                  </div>
                </div>
              </div>

              {/* Stock Alerts KPI */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl relative overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-800 text-[10px] font-mono tracking-wider uppercase font-bold">Warehouse Stocks</p>
                    <h2 className="text-3xl font-black text-emerald-950 mt-1">
                      {products.reduce((sum, p) => sum + p.stock, 0)} <span className="text-[10px] text-emerald-700 font-normal">items</span>
                    </h2>
                  </div>
                  <span className="p-2.5 rounded-xl bg-emerald-100/50 text-emerald-800"><Shirt size={18} /></span>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-100/60 grid grid-cols-2 gap-3 text-[9px] font-mono text-center">
                  <div className={`p-1 rounded-lg border ${dynamicLowStockCount > 0 ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse' : 'bg-emerald-50 text-emerald-800 border-emerald-100'}`}>
                    <span className="block font-black text-xs">{dynamicLowStockCount}</span>
                    LOW STOCK (≤3)
                  </div>
                  <div className={`p-1 rounded-lg border ${dynamicOutOfStockCount > 0 ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-100'}`}>
                    <span className="block font-black text-xs">{dynamicOutOfStockCount}</span>
                    OUT OF STOCK
                  </div>
                </div>
              </div>

            </div>

            {/* QUICK ACTIONS PANEL */}
            <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 md:p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-emerald-950 font-mono flex items-center gap-2 mb-4">
                <ShieldAlert size={14} className="text-emerald-700" />
                ADMIN SYSTEM QUICK CONTROL DESK
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => handleAddSimulatedOrders(1)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-700 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group hover:scale-[1.02]"
                >
                  <PlusCircle size={14} className="group-hover:scale-110 transition-transform" />
                  +1 Simulated Sale
                </button>
                <button
                  onClick={() => handleAddSimulatedOrders(5)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-700 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group hover:scale-[1.02]"
                >
                  <Sparkles size={14} className="group-hover:scale-110 transition-transform text-amber-200" />
                  Generate Bulk Sales (+5)
                </button>
                <button
                  onClick={handleRestockLowItems}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shirt size={14} className="text-emerald-800" />
                  Restock Low Stock (12 Qty)
                </button>
                <button
                  onClick={handleExportCSVReport}
                  disabled={isExporting}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Auditing {exportProgress}%
                    </>
                  ) : (
                    <>
                      <Download size={14} className="text-emerald-800" />
                      Export Sales Report (CSV)
                    </>
                  )}
                </button>
              </div>
              
              {isExporting && (
                <div className="w-full bg-emerald-100/40 rounded-full h-1 mt-4 overflow-hidden">
                  <div className="bg-emerald-800 h-full transition-all duration-350" style={{ width: `${exportProgress}%` }} />
                </div>
              )}
            </div>

            {/* SALES AND REVENUE GRAPH ROOM */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-emerald-50 pb-4">
                <div>
                  <h3 className="text-sm font-black uppercase text-emerald-950 flex items-center gap-2">
                    <BarChart3 size={16} className="text-emerald-800" />
                    Advanced Analytics & Performance Room
                  </h3>
                  <p className="text-[10px] text-emerald-700 font-mono">Interactive tracking charts for June - July 2026 sales logs</p>
                </div>
                
                <div className="flex bg-emerald-50 p-1 rounded-xl border border-emerald-100">
                  <button
                    onClick={() => setChartMetric('revenue')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartMetric === 'revenue' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-800 hover:text-emerald-900'}`}
                  >
                    Revenue Graph
                  </button>
                  <button
                    onClick={() => setChartMetric('sales')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartMetric === 'sales' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-800 hover:text-emerald-900'}`}
                  >
                    Sales Volume Graph
                  </button>
                </div>
              </div>

              {chartMetric === 'revenue' ? (
                <div>
                  <div className="mb-3 flex justify-between items-center text-[10px] font-mono text-emerald-800">
                    <span>July Sourced Revenue Progress (৳ Taka):</span>
                    <span className="font-extrabold text-emerald-950 text-xs">Baseline + Real Time Tracker</span>
                  </div>
                  
                  {/* SVG Line Graph with Area fill */}
                  <div className="h-64 w-full bg-emerald-50/20 rounded-2xl border border-emerald-50 relative p-4 flex flex-col justify-between">
                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
                      <div className="border-b border-emerald-100 w-full h-0 text-[8px] font-mono text-emerald-600">৳2,00,000</div>
                      <div className="border-b border-emerald-100 w-full h-0 text-[8px] font-mono text-emerald-600">৳1,50,000</div>
                      <div className="border-b border-emerald-100 w-full h-0 text-[8px] font-mono text-emerald-600">৳1,00,000</div>
                      <div className="border-b border-emerald-100 w-full h-0 text-[8px] font-mono text-emerald-600">৳50,000</div>
                    </div>
                    
                    {/* SVG Curve Area chart */}
                    <div className="relative w-full h-48 mt-4">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 300" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#065f46" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#065f46" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Polygon */}
                        <polygon
                          points={`
                            0,300 
                            100,${300 - (monthlyData[0].revenue / 200000) * 300} 
                            200,${300 - (monthlyData[1].revenue / 200000) * 300} 
                            300,${300 - (monthlyData[2].revenue / 200000) * 300} 
                            400,${300 - (monthlyData[3].revenue / 200000) * 300} 
                            500,${300 - (monthlyData[4].revenue / 200000) * 300} 
                            600,${300 - (monthlyData[5].revenue / 200000) * 300} 
                            700,${300 - (Math.min(200000, monthlyData[6].revenue) / 200000) * 300} 
                            800,${300 - (monthlyData[7].revenue / 200000) * 300} 
                            900,${300 - (monthlyData[8].revenue / 200000) * 300} 
                            1000,${300 - (monthlyData[9].revenue / 200000) * 300} 
                            1100,${300 - (monthlyData[10].revenue / 200000) * 300} 
                            1200,${300 - (monthlyData[11].revenue / 200000) * 300} 
                            1200,300`}
                          fill="url(#revenueGrad)"
                        />
                        {/* Smooth Line */}
                        <polyline
                          fill="none"
                          stroke="#065f46"
                          strokeWidth="4"
                          points={`
                            100,${300 - (monthlyData[0].revenue / 200000) * 300} 
                            200,${300 - (monthlyData[1].revenue / 200000) * 300} 
                            300,${300 - (monthlyData[2].revenue / 200000) * 300} 
                            400,${300 - (monthlyData[3].revenue / 200000) * 300} 
                            500,${300 - (monthlyData[4].revenue / 200000) * 300} 
                            600,${300 - (monthlyData[5].revenue / 200000) * 300} 
                            700,${300 - (Math.min(200000, monthlyData[6].revenue) / 200000) * 300} 
                            800,${300 - (monthlyData[7].revenue / 200000) * 300} 
                            900,${300 - (monthlyData[8].revenue / 200000) * 300} 
                            1000,${300 - (monthlyData[9].revenue / 200000) * 300} 
                            1100,${300 - (monthlyData[10].revenue / 200000) * 300} 
                            1200,${300 - (monthlyData[11].revenue / 200000) * 300}`}
                        />
                        {/* Markers */}
                        <circle cx="700" cy={300 - (Math.min(200000, monthlyData[6].revenue) / 200000) * 300} r="7" fill="#065f46" stroke="#ffffff" strokeWidth="2.5" />
                      </svg>
                      {/* Interactive indicator for active month */}
                      <div className="absolute top-2 left-[58%] -translate-x-1/2 bg-emerald-950 text-white rounded-lg p-2.5 shadow-lg border border-emerald-800 text-[10px] font-mono pointer-events-none">
                        <span className="block font-bold text-emerald-400">JULY 2026 (CUR)</span>
                        <span className="block text-xs font-black">৳{monthlyData[6].revenue.toLocaleString()} Taka</span>
                        <span className="text-[9px] text-emerald-300">({40 + orders.length} Sourced sales)</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-[9px] font-mono text-emerald-850 px-2 mt-4 pt-1 border-t border-emerald-100">
                      {monthlyData.map((d, i) => (
                        <span key={i} className={d.month === 'Jul' ? 'font-black text-emerald-950 underline' : ''}>{d.month}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex justify-between items-center text-[10px] font-mono text-emerald-850">
                    <span>Sourced Orders Handled Per Month:</span>
                    <span className="font-extrabold text-emerald-950">Vitals Volume Tracker</span>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="h-64 w-full bg-emerald-50/20 rounded-2xl border border-emerald-50 p-4 flex flex-col justify-between">
                    <div className="h-44 flex items-end justify-between gap-2.5 md:gap-5 pt-6 relative">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                        <div className="border-b border-emerald-100 w-full" />
                        <div className="border-b border-emerald-100 w-full" />
                        <div className="border-b border-emerald-100 w-full" />
                        <div className="border-b border-emerald-100 w-full" />
                      </div>

                      {monthlyData.map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer h-full justify-end">
                          <div className="absolute -top-6 bg-emerald-950 text-white px-1.5 py-0.5 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {item.orders} sales
                          </div>
                          <div
                            className={`w-full hover:bg-emerald-850 rounded-t-md transition-all duration-350 shadow ${item.month === 'Jul' ? 'bg-emerald-800' : 'bg-emerald-600/40'}`}
                            style={{ height: `${(item.orders / 65) * 100}%` }}
                          />
                          <span className={`text-[8px] font-mono mt-1 ${item.month === 'Jul' ? 'font-black text-emerald-950' : 'text-emerald-700'}`}>{item.month}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-[9px] font-mono text-emerald-700 text-center mt-2">
                      Bar heights are scaled relative to standard monthly volume capacity (max 65 orders limit).
                    </div>
                  </div>
                </div>
              )}

              {/* MONTHLY COMPARISON STUDY */}
              <div className="mt-8 pt-6 border-t border-emerald-100">
                <h4 className="text-xs font-black uppercase text-emerald-950 mb-3 font-mono flex items-center gap-1.5">
                  <RefreshCw size={12} className="text-emerald-700" />
                  Monthly Comparison Ledger (July vs June)
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/50 flex flex-col justify-between">
                    <span className="text-[9px] text-emerald-700 font-mono block">REVENUE GROWTH</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-black text-emerald-950">{formatPrice(dynamicRevenue)}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 block mt-1 flex items-center gap-1">
                      <ArrowUpRight size={10} className="text-emerald-700" />
                      ▲ +24.8% vs last month
                    </span>
                  </div>

                  <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/50 flex flex-col justify-between">
                    <span className="text-[9px] text-emerald-700 font-mono block">ORDERS PROCESSED</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-black text-emerald-950">{40 + orders.length} orders</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 block mt-1 flex items-center gap-1">
                      <ArrowUpRight size={10} className="text-emerald-700" />
                      ▲ +21.9% vs last month
                    </span>
                  </div>

                  <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/50 flex flex-col justify-between">
                    <span className="text-[9px] text-emerald-700 font-mono block">AVERAGE ORDER VALUE</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-black text-emerald-950">{formatPrice(Math.round(dynamicRevenue / (40 + orders.length)))}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 block mt-1 flex items-center gap-1">
                      <ArrowUpRight size={10} className="text-emerald-700" />
                      ▲ +2.4% vs last month
                    </span>
                  </div>

                  <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/50 flex flex-col justify-between">
                    <span className="text-[9px] text-emerald-700 font-mono block">CUSTOMER ACQUISITION</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-black text-emerald-950">+{customers.length + 32} Collectors</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 block mt-1 flex items-center gap-1">
                      <ArrowUpRight size={10} className="text-emerald-700" />
                      ▲ +14.6% vs last month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LEADERBOARDS & RANKINGS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* TOP SELLING PRODUCTS */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase text-emerald-950 font-mono flex items-center gap-2 mb-3">
                    <Shirt size={13} className="text-emerald-800" />
                    Top Selling Products (June/July)
                  </h3>
                  <div className="space-y-3">
                    {topProducts.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-emerald-50/60 pb-2">
                        <div className="min-w-0 pr-3">
                          <span className="font-mono text-[10px] text-emerald-700 font-bold block">#0{idx+1} RANKING</span>
                          <span className="font-bold text-emerald-950 truncate block">{p.name}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-mono font-black text-emerald-850 block">{p.sales} sales</span>
                          <span className="text-[10px] text-emerald-700 font-mono block">৳{(p.sales * 12000).toLocaleString()} est.</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TOP SELLING TEAMS */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase text-emerald-950 font-mono flex items-center gap-2 mb-3">
                    <Users size={13} className="text-emerald-800" />
                    Top Selling Clubs & Countries
                  </h3>
                  <div className="space-y-3">
                    {topTeams.map((t, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-emerald-50/60 pb-2">
                        <div className="min-w-0 pr-3">
                          <span className="font-mono text-[10px] text-emerald-700 font-bold block">#0{idx+1} TEAM</span>
                          <span className="font-bold text-emerald-950 truncate block">{t.name}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-mono font-black text-emerald-850 block">{t.sales} units</span>
                          <span className="text-[10px] text-emerald-700 font-mono block">RANKING HIGH</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TOP SELLING LEAGUES */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase text-emerald-950 font-mono flex items-center gap-2 mb-3">
                    <AreaChart size={13} className="text-emerald-800" />
                    Top Selling Leagues / Formats
                  </h3>
                  <div className="space-y-3">
                    {topLeagues.map((l, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-emerald-50/60 pb-2">
                        <div className="min-w-0 pr-3">
                          <span className="font-mono text-[10px] text-emerald-700 font-bold block">#0{idx+1} CLASSIFICATION</span>
                          <span className="font-bold text-emerald-950 truncate block">{l.name}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-mono font-black text-emerald-850 block">{l.sales} units</span>
                          <span className="text-[10px] text-emerald-700 font-mono block">DEMAND PEAK</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* CUSTOMER COMMAND DESK (CUSTOMER DIRECTORY + PROFILE SAVE FORM) */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
              <div className="border-b border-emerald-50 pb-4 mb-6">
                <h3 className="text-sm font-black uppercase text-emerald-950 flex items-center gap-2">
                  <UserCheck size={16} className="text-emerald-800" />
                  Jersey Addicts BD Customer Directory & CRM Room
                </h3>
                <p className="text-[10px] text-emerald-700 font-mono">Manage persistent customer portfolios and save collectors profiles</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT SIDE: CUSTOMER SEARCH & LISTS (8 Columns) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search bar */}
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600 pointer-events-none">
                        <Search size={14} />
                      </span>
                      <input
                        type="text"
                        placeholder="Search by name, email, phone or city..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full bg-emerald-50/30 border border-emerald-100 hover:border-emerald-200 rounded-xl py-2 pl-10 pr-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                    {/* CRM Filters */}
                    <div className="flex bg-emerald-50 p-1 rounded-xl border border-emerald-100 shrink-0">
                      <button
                        onClick={() => setCustomerFilter('all')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${customerFilter === 'all' ? 'bg-emerald-800 text-white' : 'text-emerald-800 hover:text-emerald-900'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setCustomerFilter('repeated')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${customerFilter === 'repeated' ? 'bg-emerald-800 text-white' : 'text-emerald-800 hover:text-emerald-900'}`}
                        title="Customers who made 2 or more orders"
                      >
                        Repeated Customer List (2+)
                      </button>
                      <button
                        onClick={() => setCustomerFilter('best')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${customerFilter === 'best' ? 'bg-emerald-800 text-white' : 'text-emerald-800 hover:text-emerald-900'}`}
                        title="Customers ranked by highest spending volume"
                      >
                        Best Customers
                      </button>
                    </div>
                  </div>

                  {/* Customer directory table container */}
                  <div className="border border-emerald-100 rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-emerald-50/50 border-b border-emerald-100 text-[10px] font-mono text-emerald-800 uppercase">
                          <th className="py-2.5 px-4">Collector Profile</th>
                          <th className="py-2.5 px-4">Contact</th>
                          <th className="py-2.5 px-4 text-center">Orders</th>
                          <th className="py-2.5 px-4 text-right">Total Spent</th>
                          <th className="py-2.5 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-50 bg-white">
                        {displayCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[10px] font-mono text-emerald-700">
                              No matching collectors found in Dhaka ledger.
                            </td>
                          </tr>
                        ) : (
                          displayCustomers.map((c) => (
                            <tr key={c.id} className="hover:bg-emerald-50/30 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-extrabold text-emerald-950 flex items-center gap-1">
                                  {c.fullName}
                                  {c.ordersCount >= 2 && (
                                    <span className="bg-emerald-100 text-emerald-850 font-mono text-[8px] px-1.5 py-0.5 rounded uppercase font-bold" title="Repeated Customer">
                                      Repeated
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-emerald-700 font-mono block">{c.city} • Joined {c.joinedDate}</span>
                              </td>
                              <td className="py-3 px-4 font-mono text-[10px] text-emerald-850">
                                <span className="block">{c.email}</span>
                                <span className="text-emerald-700 text-[9px] block">{c.phone}</span>
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-emerald-950 font-mono">
                                {c.ordersCount}
                              </td>
                              <td className="py-3 px-4 text-right font-black text-emerald-900 font-mono">
                                {formatPrice(c.totalSpent)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => handleSelectCustomer(c)}
                                  className="bg-emerald-50 hover:bg-emerald-800 hover:text-white border border-emerald-200 text-emerald-800 text-[9px] font-mono uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Edit size={10} />
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT SIDE: CUSTOMER SAVE / UPDATE FORM (5 Columns) */}
                <div className="lg:col-span-5 bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5">
                  <div className="border-b border-emerald-100 pb-3 mb-4">
                    <h4 className="text-xs font-black uppercase text-emerald-950 font-mono flex items-center gap-1.5">
                      <Save size={13} className="text-emerald-800" />
                      {custFormId ? 'Modify Collector Profile' : 'Save Customer Information'}
                    </h4>
                    <p className="text-[9px] text-emerald-700 font-mono">Input fields below will compile straight to secure persistent directory storage.</p>
                  </div>

                  <form onSubmit={handleSaveCustomerProfile} className="space-y-3 text-xs">
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-emerald-700 uppercase font-bold block">FULL NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Siyam Ahmed"
                        value={custFormName}
                        onChange={(e) => setCustFormName(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-emerald-700 uppercase font-bold block">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. siyam@gmail.com"
                        value={custFormEmail}
                        onChange={(e) => setCustFormEmail(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-emerald-700 uppercase font-bold block">PHONE NUMBER *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +880 1712..."
                          value={custFormPhone}
                          onChange={(e) => setCustFormPhone(e.target.value)}
                          className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-emerald-700 uppercase font-bold block">LOCATION/CITY</label>
                        <select
                          value={custFormCity}
                          onChange={(e) => setCustFormCity(e.target.value)}
                          className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-emerald-700 uppercase block">SHIPPING ADDRESS LINE</label>
                      <input
                        type="text"
                        placeholder="Road 4, Dhanmondi"
                        value={custFormAddress}
                        onChange={(e) => setCustFormAddress(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-emerald-700 uppercase block">SIMULATED ORDERS COUNT</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="1"
                          value={custFormOrders}
                          onChange={(e) => setCustFormOrders(Number(e.target.value))}
                          className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-emerald-700 uppercase block">TOTAL SPENT VALUE (৳)</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="3500"
                          value={custFormSpent}
                          onChange={(e) => setCustFormSpent(Number(e.target.value))}
                          className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600 font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-emerald-700 uppercase block">MEMO / COLLECTORS PREFERENCE NOTES</label>
                      <textarea
                        rows={2}
                        placeholder="Prefers classic 90s vintage. Prefers XL sizes."
                        value={custFormNotes}
                        onChange={(e) => setCustFormNotes(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-xl p-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="submit"
                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-sm text-center"
                      >
                        {custFormId ? '✓ Update Profile' : '✓ Save Profile'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustFormId('');
                          setCustFormName('');
                          setCustFormEmail('');
                          setCustFormPhone('');
                          setCustFormAddress('');
                          setCustFormCity('Dhaka');
                          setCustFormNotes('');
                          setCustFormOrders(1);
                          setCustFormSpent(150);
                        }}
                        className="bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
                      >
                        Clear Form
                      </button>
                    </div>

                  </form>
                </div>

              </div>
            </div>

            {/* DYNAMIC ACTIVE ORDERS OPERATIONAL COMMAND DESK */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Desk Top Bar */}
              <div className="border-b border-emerald-50 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-sm font-black uppercase text-emerald-950 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-emerald-800" />
                    Bangladesh Orders Lifecycle & Management Hub
                  </h3>
                  <p className="text-[10px] text-emerald-700 font-mono font-bold">
                    Full-pipeline order processing: Invoices, Shipping Addresses, Logistics Tracking, Timelines, Status updates, and Internal Notes.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddSimulatedOrders(9)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Generate Sample Orders (All 9 Statuses)</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs (9 Statuses + All) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                  <span className="uppercase tracking-wider font-mono text-[10px]">Filter Order Status Pipeline:</span>
                  <span className="text-[10px] font-mono text-emerald-700">Showing {orders.filter((o) => (orderFilterStatus === 'All' || o.status === orderFilterStatus) && (!orderSearchQuery || o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) || (o.shippingAddress?.fullName || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) || (o.shippingAddress?.phone || '').includes(orderSearchQuery))).length} of {orders.length} Total Orders</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  {[
                    'All', 'Pending', 'Confirmed', 'Packed', 
                    'Ready to Ship', 'Shipped', 'Delivered', 
                    'Cancelled', 'Returned', 'Refund Request'
                  ].map((status) => {
                    const count = status === 'All' 
                      ? orders.length 
                      : orders.filter((o) => o.status === status).length;
                    const isActive = orderFilterStatus === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setOrderFilterStatus(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                          isActive
                            ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm'
                            : 'bg-emerald-50/50 hover:bg-emerald-100/80 text-emerald-900 border-emerald-100'
                        }`}
                      >
                        <span>{status}</span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-mono font-black rounded-full ${
                          isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-200/60 text-emerald-900'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search & Quick Controls Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100">
                <div className="relative w-full sm:w-80">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700" />
                  <input
                    type="text"
                    placeholder="Search ID, customer, phone, tracking..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                  {orderSearchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-950 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="text-[10px] font-mono text-emerald-800 flex items-center gap-3">
                  <span>💡 Tip: Click <b>Manage Order</b> to view full address, timeline, tracking details & internal admin notes</span>
                </div>
              </div>

              {/* Order Management Table */}
              <div className="border border-emerald-100 rounded-2xl overflow-hidden overflow-x-auto shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-emerald-950 text-white text-[10px] font-mono uppercase tracking-wider">
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer & Address</th>
                      <th className="py-3 px-4">Purchased Items</th>
                      <th className="py-3 px-4">Tracking & Carrier</th>
                      <th className="py-3 px-4 text-center">Pipeline Status</th>
                      <th className="py-3 px-4 text-right">Invoice Sum</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50 bg-white">
                    {orders.filter((o) => {
                      const matchesStatus = orderFilterStatus === 'All' || o.status === orderFilterStatus;
                      const q = orderSearchQuery.toLowerCase().trim();
                      const matchesSearch = !q || 
                        o.id.toLowerCase().includes(q) ||
                        (o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
                        (o.shippingAddress?.phone || '').toLowerCase().includes(q) ||
                        (o.shippingAddress?.email || '').toLowerCase().includes(q) ||
                        (o.trackingNumber || '').toLowerCase().includes(q) ||
                        o.items?.some(i => (i.product?.name || '').toLowerCase().includes(q));
                      return matchesStatus && matchesSearch;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-xs font-mono text-emerald-700 bg-emerald-50/20">
                          No orders matched current filter query "{orderFilterStatus}". Click "Generate Sample Orders" to load test data!
                        </td>
                      </tr>
                    ) : (
                      orders
                        .filter((o) => {
                          const matchesStatus = orderFilterStatus === 'All' || o.status === orderFilterStatus;
                          const q = orderSearchQuery.toLowerCase().trim();
                          const matchesSearch = !q || 
                            o.id.toLowerCase().includes(q) ||
                            (o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
                            (o.shippingAddress?.phone || '').toLowerCase().includes(q) ||
                            (o.shippingAddress?.email || '').toLowerCase().includes(q) ||
                            (o.trackingNumber || '').toLowerCase().includes(q) ||
                            o.items?.some(i => (i.product?.name || '').toLowerCase().includes(q));
                          return matchesStatus && matchesSearch;
                        })
                        .map((o) => (
                          <tr key={o.id} className="hover:bg-emerald-50/40 transition-colors">
                            {/* Order ID & Date */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-black text-emerald-950 block text-xs">{o.id}</span>
                              <span className="text-[10px] text-emerald-700 font-mono block">Date: {o.date}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[9px] font-mono text-emerald-900 bg-emerald-100 border border-emerald-200 px-1.5 py-0.2 rounded font-extrabold uppercase">
                                  {o.paymentMethod || 'Cash on Delivery'}
                                </span>
                                {o.paymentStatus && (
                                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                                    o.paymentStatus === 'Paid' ? 'bg-emerald-800 text-white' : 'bg-amber-100 text-amber-900'
                                  }`}>
                                    {o.paymentStatus}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Customer & Address */}
                            <td className="py-3.5 px-4 max-w-[200px]">
                              <span className="font-extrabold text-emerald-950 block text-xs">{o.shippingAddress?.fullName}</span>
                              <span className="text-[10px] font-mono text-emerald-700 block truncate">{o.shippingAddress?.addressLine1}, {o.shippingAddress?.city}</span>
                              <span className="text-[10px] text-emerald-900 font-mono block font-bold">{o.shippingAddress?.phone}</span>
                            </td>

                            {/* Purchased Items */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1 max-w-[220px]">
                                {o.items?.map((item, idx) => (
                                  <div key={idx} className="text-[11px] leading-tight border-b border-emerald-50/80 last:border-0 pb-1 last:pb-0">
                                    <span className="font-black text-emerald-950 block truncate">✓ {item.product?.name || 'Jersey Kit'}</span>
                                    <div className="text-[9px] text-emerald-700 font-mono flex items-center gap-1">
                                      <span>Size: <b>{item.selectedSize}</b></span>
                                      <span>• Qty: <b>{item.quantity}</b></span>
                                      {item.addBadge && <span className="text-amber-800 font-bold bg-amber-50 px-1 rounded">Badge</span>}
                                      {item.customPrint?.name && <span className="text-blue-800 font-bold bg-blue-50 px-1 rounded">Custom #{item.customPrint.number}</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Tracking & Carrier */}
                            <td className="py-3.5 px-4 font-mono text-[10px]">
                              {o.trackingNumber ? (
                                <div>
                                  <span className="font-bold text-emerald-950 block">{o.carrier || 'Steadfast'}</span>
                                  <span className="text-emerald-700 font-bold block">{o.trackingNumber}</span>
                                  {o.trackingUrl && (
                                    <a
                                      href={o.trackingUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[9px] text-blue-700 hover:underline flex items-center gap-1 font-bold mt-0.5"
                                    >
                                      <span>Track Package</span>
                                      <ExternalLink size={9} />
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-zinc-600 italic">No tracking yet</span>
                              )}
                            </td>

                            {/* Status Quick Dropdown */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-xl border cursor-pointer focus:outline-none ${
                                    o.status === 'Pending' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                    o.status === 'Confirmed' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                                    o.status === 'Packed' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' :
                                    o.status === 'Ready to Ship' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                                    o.status === 'Shipped' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                                    o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                                    o.status === 'Cancelled' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                                    o.status === 'Returned' ? 'bg-orange-100 text-orange-900 border-orange-300' :
                                    'bg-violet-100 text-violet-900 border-violet-300'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Packed">Packed</option>
                                  <option value="Ready to Ship">Ready to Ship</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                  <option value="Returned">Returned</option>
                                  <option value="Refund Request">Refund Request</option>
                                </select>
                              </div>
                            </td>

                            {/* Total Price */}
                            <td className="py-3.5 px-4 text-right font-black text-emerald-950 font-mono text-xs">
                              {formatPrice(o.total)}
                            </td>

                            {/* Desk Actions */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenOrderModal(o)}
                                  className="bg-emerald-950 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                                  title="View full order details, address, timeline & internal notes"
                                >
                                  <Eye size={12} />
                                  <span>Manage</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setInvoiceOrder(o);
                                    setIsInvoiceModalOpen(true);
                                  }}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold px-2 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                                  title="Generate / Print Official Invoice"
                                >
                                  <Printer size={12} />
                                  <span>Invoice</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECURE ACTIVITY LOGS CONSOLE */}
            <div className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-black uppercase text-zinc-300 font-mono flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500 animate-pulse" />
                  Live Secured Database Activity Console Logs
                </h3>
                <span className="bg-emerald-950 text-emerald-400 font-mono text-[8px] px-2 py-0.5 rounded border border-emerald-800">
                  SECURE CONNECTION • 128-BIT
                </span>
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2 font-mono text-[10px] text-zinc-400 select-all pr-2">
                {logs.map((log, i) => (
                  <p key={i} className="flex justify-between hover:bg-zinc-900/50 p-1 rounded transition-colors">
                    <span className="truncate max-w-[80%]">{log}</span>
                    <span className="text-emerald-500 font-bold flex-shrink-0">STATUS: OK</span>
                  </p>
                ))}
              </div>
              
              <div className="mt-5 pt-3 border-t border-zinc-900 flex justify-between items-center">
                <p className="text-[9px] text-zinc-500 font-mono">
                  MongoDB Cloud Partition • Node Ingress Active on Port 3000
                </p>
                <button
                  onClick={handleResetDatabase}
                  className="bg-rose-950/40 hover:bg-rose-950 text-rose-400 border border-rose-900 font-mono text-[9px] px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Trash2 size={11} />
                  Reset Admin Simulated Data
                </button>
              </div>
            </div>

          </div>
        );
      })()}

      {activeSidebarTab === 'inventory' && (
        <InventoryEditor
          products={products}
          setProducts={setProducts}
          formatPrice={formatPrice}
        />
      )}

      {activeSidebarTab === 'seller-requests' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold uppercase text-emerald-950">Collector Submission Approval Desk</h3>
            <p className="text-[10px] text-emerald-700 font-mono">Approve submitted user shirts for physical verification checks or reject them directly</p>
          </div>

          <div className="space-y-4">
            {sellerRequests.map((req) => (
              <div
                key={req.id}
                className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-2.5 py-0.5 rounded font-bold border border-emerald-200">
                      ID: {req.id}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono">{req.date}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black ${
                      req.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : req.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-emerald-950">{req.shirtName}</h4>
                  <p className="text-xs text-emerald-850">
                    Brand: <span className="text-emerald-950 font-mono">{req.brand}</span> | Season: <span className="text-emerald-950 font-mono">{req.season}</span> | Condition: <span className="text-emerald-800 font-bold">{req.condition}</span>
                  </p>
                  <p className="text-xs font-semibold text-emerald-850">
                    Seller Expected Value: <span className="text-emerald-950 font-mono font-black">${req.expectedPrice}</span>
                  </p>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleSellerRequest(req.id, 'Approved')}
                      className="flex-1 md:flex-none bg-emerald-800 hover:bg-emerald-900 border border-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} /> Approve Submission
                    </button>
                    <button
                      onClick={() => handleSellerRequest(req.id, 'Rejected')}
                      className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSidebarTab === 'homepage-builder' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl">
            <div>
              <h3 className="text-base font-bold uppercase text-emerald-950">Interactive Homepage Carousel Builder</h3>
              <p className="text-[11px] text-emerald-800 font-mono mt-0.5">Add, edit, or remove slides, upload custom slide banner images, and pair with target products.</p>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <Plus size={14} className="stroke-[3]" /> Add New Banner Slide
            </button>
          </div>

          {/* Match Countdown Timer Settings */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 space-y-6">
            <div className="border-b border-emerald-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <h4 className="text-sm font-mono font-black text-emerald-950 uppercase tracking-widest">
                  LIVE MATCH COUNTDOWN TIMER CONTROLLER & PRESETS
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ ...appConfig, timerEnabled: false })}
                  className={`text-[10px] font-mono font-black uppercase px-3 py-1.5 rounded transition-all cursor-pointer ${
                    appConfig.timerEnabled === false
                      ? 'bg-red-600 text-white font-black'
                      : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  🔴 HIDE / TURN OFF (SHOW NOTHING)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ ...appConfig, timerEnabled: true })}
                  className={`text-[10px] font-mono font-black uppercase px-3 py-1.5 rounded transition-all cursor-pointer ${
                    appConfig.timerEnabled !== false
                      ? 'bg-emerald-800 text-white font-black'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  🟢 SHOW TIMER
                </button>
              </div>
            </div>

            {/* Featured Rivalries (Filterable / Searchable Grid) */}
            <div className="space-y-3 bg-white border border-emerald-100 p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                <label className="text-[10px] text-emerald-950 font-mono uppercase tracking-widest block font-bold">
                  ⭐ SELECT PRESET RIVALRY MATCH ({RIVALRY_PRESETS.length} CLASSIC DERBIES):
                </label>
                <span className="text-[9px] text-emerald-600 font-mono">
                  Sets Team 1, Team 2, Emojis, Stage/Label & Ideal Countdown hours!
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                {RIVALRY_PRESETS.map((preset) => {
                  const isActive = appConfig.timerTeam1 === preset.team1.code && appConfig.timerTeam2 === preset.team2.code;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => onUpdateConfig({
                        ...appConfig,
                        timerTeam1: preset.team1.code,
                        timerTeam1Emoji: preset.team1.emoji,
                        timerTeam2: preset.team2.code,
                        timerTeam2Emoji: preset.team2.emoji,
                        timerLabel: preset.label,
                        timerTargetHours: preset.hours,
                        timerEnabled: true
                      })}
                      className={`text-left p-2 rounded-xl transition-all cursor-pointer border flex flex-col justify-between h-[68px] ${
                        isActive
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                          : 'bg-white border border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 text-emerald-850'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-tight">
                          {preset.label}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-emerald-850">
                          {preset.hours}h
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-emerald-950 line-clamp-1">
                        {preset.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-700">
                        <span>{preset.team1.emoji} {preset.team1.code}</span>
                        <span>vs</span>
                        <span>{preset.team2.code} {preset.team2.emoji}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Time Hours Presets */}
            <div className="space-y-2 bg-white border border-emerald-100 p-4 rounded-xl">
              <label className="text-[10px] text-emerald-950 font-mono uppercase tracking-widest block font-bold">
                ⏰ QUICK TIME DURATION PRESETS:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[12, 24, 36, 48, 72, 96, 120].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => onUpdateConfig({ ...appConfig, timerTargetHours: hours, timerEnabled: true })}
                    className={`text-[10px] font-mono font-black uppercase px-3 py-1.5 rounded transition-all cursor-pointer border ${
                      appConfig.timerTargetHours === hours
                        ? 'bg-emerald-800 text-white border-emerald-800 font-extrabold'
                        : 'bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-50'
                    }`}
                  >
                    {hours} Hours ({Math.round(hours / 24)} Days)
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Interactive Team Selectors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* TEAM 1 SEARCH & SELECTOR */}
              <div className="bg-white border border-emerald-100 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-[11px] font-mono font-black text-emerald-950 uppercase tracking-widest">
                    👈 SELECT TEAM 1 (HOME)
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200/60">
                    Selected: {appConfig.timerTeam1Emoji} {appConfig.timerTeam1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-emerald-700 font-mono uppercase block mb-1">League Category:</label>
                    <select
                      value={team1Category}
                      onChange={(e) => setTeam1Category(e.target.value)}
                      className="w-full bg-white border border-emerald-100 rounded-lg py-1 px-2 text-[11px] text-emerald-950 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="All">All Categories</option>
                      {Array.from(new Set(TEAMS_LIST.map((t) => t.category))).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-emerald-700 font-mono uppercase block mb-1">Search Club:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type name..."
                        value={team1Search}
                        onChange={(e) => setTeam1Search(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-lg py-1 pl-2 pr-6 text-[11px] text-emerald-950 focus:outline-none focus:border-emerald-500"
                      />
                      <Search size={10} className="absolute right-2 top-2 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Grid list of team items for Team 1 */}
                <div className="bg-white rounded-lg p-2 max-h-[140px] overflow-y-auto space-y-1 border border-emerald-100">
                  {TEAMS_LIST.filter((t) => {
                    const matchesCat = team1Category === 'All' || t.category === team1Category;
                    const matchesSearch = t.name.toLowerCase().includes(team1Search.toLowerCase()) || t.code.toLowerCase().includes(team1Search.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).slice(0, 40).map((team) => (
                    <button
                      key={team.name}
                      type="button"
                      onClick={() => onUpdateConfig({
                        ...appConfig,
                        timerTeam1: team.code,
                        timerTeam1Emoji: team.emoji,
                        timerEnabled: true
                      })}
                      className={`w-full text-left py-1.5 px-2.5 rounded text-[10px] font-bold flex items-center justify-between transition-all ${
                        appConfig.timerTeam1 === team.code
                          ? 'bg-emerald-800 text-white'
                          : 'text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-xs">{team.emoji}</span>
                        <span>{team.name}</span>
                      </span>
                      <span className="font-mono opacity-80 uppercase tracking-wider">{team.code}</span>
                    </button>
                  ))}
                  {TEAMS_LIST.filter((t) => {
                    const matchesCat = team1Category === 'All' || t.category === team1Category;
                    const matchesSearch = t.name.toLowerCase().includes(team1Search.toLowerCase()) || t.code.toLowerCase().includes(team1Search.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).length === 0 && (
                    <p className="text-[10px] text-gray-500 text-center py-2">No matching clubs found.</p>
                  )}
                </div>
              </div>

              {/* TEAM 2 SEARCH & SELECTOR */}
              <div className="bg-white border border-emerald-100 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span className="text-[11px] font-mono font-black text-emerald-950 uppercase tracking-widest">
                    👈 SELECT TEAM 2 (AWAY)
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200/60">
                    Selected: {appConfig.timerTeam2} {appConfig.timerTeam2Emoji}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-emerald-700 font-mono uppercase block mb-1">League Category:</label>
                    <select
                      value={team2Category}
                      onChange={(e) => setTeam2Category(e.target.value)}
                      className="w-full bg-white border border-emerald-100 rounded-lg py-1 px-2 text-[11px] text-emerald-950 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="All">All Categories</option>
                      {Array.from(new Set(TEAMS_LIST.map((t) => t.category))).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-emerald-700 font-mono uppercase block mb-1">Search Club:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type name..."
                        value={team2Search}
                        onChange={(e) => setTeam2Search(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-lg py-1 pl-2 pr-6 text-[11px] text-emerald-950 focus:outline-none focus:border-emerald-500"
                      />
                      <Search size={10} className="absolute right-2 top-2 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Grid list of team items for Team 2 */}
                <div className="bg-white rounded-lg p-2 max-h-[140px] overflow-y-auto space-y-1 border border-emerald-100">
                  {TEAMS_LIST.filter((t) => {
                    const matchesCat = team2Category === 'All' || t.category === team2Category;
                    const matchesSearch = t.name.toLowerCase().includes(team2Search.toLowerCase()) || t.code.toLowerCase().includes(team2Search.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).slice(0, 40).map((team) => (
                    <button
                      key={team.name}
                      type="button"
                      onClick={() => onUpdateConfig({
                        ...appConfig,
                        timerTeam2: team.code,
                        timerTeam2Emoji: team.emoji,
                        timerEnabled: true
                      })}
                      className={`w-full text-left py-1.5 px-2.5 rounded text-[10px] font-bold flex items-center justify-between transition-all ${
                        appConfig.timerTeam2 === team.code
                          ? 'bg-emerald-800 text-white'
                          : 'text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-xs">{team.emoji}</span>
                        <span>{team.name}</span>
                      </span>
                      <span className="font-mono opacity-80 uppercase tracking-wider">{team.code}</span>
                    </button>
                  ))}
                  {TEAMS_LIST.filter((t) => {
                    const matchesCat = team2Category === 'All' || t.category === team2Category;
                    const matchesSearch = t.name.toLowerCase().includes(team2Search.toLowerCase()) || t.code.toLowerCase().includes(team2Search.toLowerCase());
                    return matchesCat && matchesSearch;
                  }).length === 0 && (
                    <p className="text-[10px] text-emerald-600 text-center py-2">No matching clubs found.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Live values inputs and fine-tuning */}
            <div className="pt-3 border-t border-emerald-100">
              <p className="text-[10px] text-emerald-700 font-mono uppercase tracking-wider mb-2 font-bold">
                🔧 MANUAL FINE-TUNING / CUSTOM OVERWRITE (IF YOU WANT TO TYPE ENTIRELY CUSTOM VALUES):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Team 1 Code:</label>
                  <input
                    type="text"
                    value={appConfig.timerTeam1 || 'ESP'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTeam1: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Team 1 Emoji:</label>
                  <input
                    type="text"
                    value={appConfig.timerTeam1Emoji || '🇪🇸'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTeam1Emoji: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Team 2 Code:</label>
                  <input
                    type="text"
                    value={appConfig.timerTeam2 || 'BEL'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTeam2: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Team 2 Emoji:</label>
                  <input
                    type="text"
                    value={appConfig.timerTeam2Emoji || '🇧🇪'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTeam2Emoji: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Stage / Label:</label>
                  <input
                    type="text"
                    value={appConfig.timerLabel || 'QUARTER-FINAL'}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerLabel: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-[10px] text-emerald-700 font-mono uppercase block">Countdown Hours:</label>
                  <input
                    type="number"
                    value={appConfig.timerTargetHours !== undefined ? appConfig.timerTargetHours : 20}
                    onChange={(e) => onUpdateConfig({ ...appConfig, timerTargetHours: Number(e.target.value) })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STYLISH CAROUSEL MANAGER (4-5 IMAGE HERO CONTROLLER) */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="text-emerald-800 h-4 w-4" />
                  <h4 className="text-sm font-mono font-black text-emerald-950 uppercase tracking-widest">
                    PRESTIGE HERO CAROUSEL CONTROLLER (4-5 IMAGE SLOTS)
                  </h4>
                </div>
                <p className="text-[11px] text-emerald-800 font-mono mt-1">
                  Configure 4-5 high-resolution banner images, target product routes, and promotional captions. Changes sync globally instantly.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={bulkLoadWCPresets}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono text-[10px] uppercase font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Instantly populates 5 stunning ready-to-go 2026 World Cup slider graphics"
                >
                  <Sparkles size={12} className="text-emerald-700" /> Apply World Cup 2026 Presets
                </button>
                {slides.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-black text-[10px] uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={12} className="stroke-[3]" /> Add Slide Slot
                  </button>
                )}
              </div>
            </div>

            {/* 5 Slot Navigation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((idx) => {
                const slide = slides[idx];
                const isSelected = selectedSlideIdx === idx;
                
                if (slide) {
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setSelectedSlideIdx(idx)}
                      className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between h-[90px] cursor-pointer group overflow-hidden ${
                        isSelected
                          ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {/* Micro slide background thumbnail */}
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                        <img
                          src={slide.customImage || CAROUSEL_PRESETS[idx % CAROUSEL_PRESETS.length].url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className={`font-mono text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          SLOT {idx + 1}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      
                      <div className="relative z-10 mt-2">
                        <p className="text-[10px] font-black text-emerald-950 truncate leading-tight">
                          {slide.title || 'Untitled Slide'}
                        </p>
                        <p className="text-[8px] font-mono text-emerald-700 truncate mt-0.5">
                          {slide.badge || 'No tag'}
                        </p>
                      </div>
                    </button>
                  );
                } else {
                  return (
                    <button
                      key={`empty-slot-${idx}`}
                      type="button"
                      onClick={handleAddSlide}
                      className="text-center p-3 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex flex-col items-center justify-center h-[90px] cursor-pointer group"
                    >
                      <Plus size={14} className="text-emerald-600 group-hover:text-emerald-800 transition-colors" />
                      <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-wider mt-1 block">
                        ACTIVATE SLOT {idx + 1}
                      </span>
                    </button>
                  );
                }
              })}
            </div>

            {/* Active Slot Configuration Dashboard */}
            {slides.length > 0 && slides[selectedSlideIdx] ? (
              (() => {
                const activeSlide = slides[selectedSlideIdx];
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-emerald-100">
                    
                    {/* COLUMN 1: LIVE INTERACTIVE PREVIEW SIMULATOR (5 COLS) */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
                            Live Simulated Canvas
                          </span>
                        </div>
                        
                        {/* Desktop / Mobile Device preview switches */}
                        <div className="flex items-center gap-1 bg-emerald-50 p-1 rounded-lg border border-emerald-100">
                          <button
                            type="button"
                            onClick={() => setPreviewDeviceMode('desktop')}
                            className={`p-1.5 rounded transition-all cursor-pointer ${
                              previewDeviceMode === 'desktop'
                                ? 'bg-emerald-800 text-white'
                                : 'text-emerald-600 hover:text-emerald-850'
                            }`}
                            title="Simulate PC/Tablet Desktop Layout"
                          >
                            <Monitor size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDeviceMode('mobile')}
                            className={`p-1.5 rounded transition-all cursor-pointer ${
                              previewDeviceMode === 'mobile'
                                ? 'bg-emerald-800 text-white'
                                : 'text-emerald-600 hover:text-emerald-850'
                            }`}
                            title="Simulate Mobile Portrait Device"
                          >
                            <Smartphone size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Simulator Stage view */}
                      <div className="bg-emerald-50/20 rounded-2xl border border-emerald-100 p-4 flex items-center justify-center min-h-[280px]">
                        <div
                          className={`relative overflow-hidden rounded-xl bg-cover bg-center border border-neutral-900 shadow-2xl transition-all duration-300 flex flex-col justify-end ${
                            previewDeviceMode === 'desktop'
                              ? 'aspect-[16/10] w-full max-w-md'
                              : 'aspect-[9/16] w-[210px]'
                          }`}
                          style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.85)), url(${
                              activeSlide.customImage || CAROUSEL_PRESETS[selectedSlideIdx % CAROUSEL_PRESETS.length].url
                            })`,
                          }}
                        >
                          <div className="p-4 space-y-1 text-white">
                            <span className="bg-amber-400 text-black text-[7px] font-black uppercase px-1 py-0.5 rounded tracking-wider">
                              {activeSlide.badge || 'PROMO BADGE'}
                            </span>
                            <h5 className="text-xs sm:text-sm font-black uppercase tracking-tight text-white leading-tight mt-1">
                              {activeSlide.title || 'ENTER BANNER TITLE'}
                            </h5>
                            <p className="text-[7px] text-gray-300 uppercase font-bold tracking-wider leading-none">
                              {activeSlide.subtitle || 'Enter slide subtitle'}
                            </p>
                            <p className="text-[8px] text-gray-400 line-clamp-2 leading-tight py-0.5">
                              {activeSlide.description || 'Describe the unique retro jersey release or mystery box campaign pack here...'}
                            </p>
                            <div className="pt-1.5 flex items-center justify-between">
                              <span className="inline-block bg-white text-black font-black text-[7px] uppercase px-2 py-1 rounded">
                                SHOP NOW
                              </span>
                              <span className="text-[6px] font-mono text-gray-500 bg-black/60 px-1 py-0.5 rounded">
                                Product: {products.find(p => p.id === activeSlide.productId)?.name || 'Default'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 2: FORMS AND ASSET SELECTORS (7 COLS) */}
                    <div className="lg:col-span-7 space-y-5">
                      
                      {/* Curated Sports Atmosphere Preset Selector */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-emerald-950 font-mono uppercase block font-bold tracking-widest">
                          🌅 CHOOSE ATMOSPHERE GRAPHIC PRESET:
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {CAROUSEL_PRESETS.map((pSet) => {
                            const isPresetActive = activeSlide.customImage === pSet.url;
                            return (
                              <button
                                key={pSet.name}
                                type="button"
                                onClick={() => handleUpdateSlide({ ...activeSlide, customImage: pSet.url })}
                                className={`group text-center p-1 rounded-lg border transition-all cursor-pointer overflow-hidden relative h-[48px] flex items-center justify-center ${
                                  isPresetActive
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-emerald-100 hover:border-emerald-200 bg-white'
                                }`}
                                title={`Set background image to ${pSet.name}`}
                              >
                                <img
                                  src={pSet.url}
                                  alt={pSet.name}
                                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="relative z-10 text-[8px] font-mono font-black text-emerald-950 leading-none px-1 text-center truncate drop-shadow-md">
                                  {pSet.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom File Upload Area */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-emerald-700 font-mono uppercase block">Or Upload Custom Banner File:</label>
                        <label className="bg-white hover:bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 p-3 rounded-xl flex items-center gap-3.5 cursor-pointer transition-all">
                          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {activeSlide.customImage ? (
                              <img
                                src={activeSlide.customImage}
                                alt="Custom Slide"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Image size={16} className="text-emerald-600" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-emerald-950 uppercase">Upload custom banner image</p>
                            <p className="text-[9px] text-emerald-700 truncate">Tap to pick custom file from your device</p>
                          </div>
                          
                          <span className="bg-emerald-800 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg">
                            Upload
                          </span>
                          
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    handleUpdateSlide({ ...activeSlide, customImage: reader.result });
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Captions & Texts inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Slide Badge Tag:</label>
                          <input
                            type="text"
                            value={activeSlide.badge}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, badge: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. WORLD CUP EXCLUSIVE"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Slide Subtitle:</label>
                          <input
                            type="text"
                            value={activeSlide.subtitle}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, subtitle: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. Rare Historic Reissues"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Slide Title:</label>
                          <input
                            type="text"
                            value={activeSlide.title}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, title: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                            placeholder="e.g. THE 1998 FRANCE VAULT"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Slide Description:</label>
                          <textarea
                            rows={2}
                            value={activeSlide.description}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, description: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-3 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                            placeholder="Provide descriptive copy about the capsule/jerseys featured."
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] text-emerald-700 font-mono uppercase block">Target Product Destination:</label>
                          <select
                            value={activeSlide.productId}
                            onChange={(e) => handleUpdateSlide({ ...activeSlide, productId: e.target.value })}
                            className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-3.5 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id} className="bg-white text-emerald-950">
                                {p.name} (${p.price})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Slide Ordering Toolbar and delete */}
                      <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveSlide(selectedSlideIdx, 'left')}
                            disabled={selectedSlideIdx === 0}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 disabled:opacity-30 disabled:pointer-events-none p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                          >
                            <ChevronLeft size={14} /> Move Left
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSlide(selectedSlideIdx, 'right')}
                            disabled={selectedSlideIdx === slides.length - 1}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 disabled:opacity-30 disabled:pointer-events-none p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                          >
                            Move Right <ChevronRight size={14} />
                          </button>
                        </div>

                        {slides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(activeSlide.id)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs uppercase font-mono font-bold"
                          >
                            <Trash2 size={13} /> Delete Slide Slot
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-10 bg-emerald-50/20 rounded-2xl border border-emerald-100 border-dashed">
                <AlertTriangle className="text-emerald-800 h-8 w-8 mx-auto mb-2" />
                <p className="text-xs font-bold text-emerald-950 uppercase font-mono">No Slider Banners Active</p>
                <p className="text-[10px] text-emerald-700 font-mono mt-1">Please add or load default slides above to begin customization.</p>
              </div>
            )}

          </div>
        </div>
      )}

      {activeSidebarTab === 'coupons' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold uppercase text-emerald-950">Dynamic Promo Coupon Generator</h3>
            <p className="text-[10px] text-emerald-800 font-mono">Generate system codes with instant mathematical validation during checkouts</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Create Coupon form */}
            <form onSubmit={handleCreateCoupon} className="lg:col-span-5 bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                Generate Campaign Code
              </h4>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-emerald-700 font-mono">COUPON CODE (UPPERCASE):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER26"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-mono text-emerald-950 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-emerald-700 font-mono">DISCOUNT VALUE (%):</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={50}
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-mono text-emerald-950 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl cursor-pointer"
              >
                + Inject Code Into Server
              </button>
            </form>

            {/* List of active codes */}
            <div className="lg:col-span-7 bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                Active Code Databases
              </h4>
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="bg-white border border-emerald-100 p-4 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-bold font-mono text-emerald-800">{c.code}</p>
                      <p className="text-[10px] text-emerald-700 font-mono">Saves {c.discount}% discount • Limit {c.limit} users</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-3 py-1 rounded font-bold border border-emerald-200/60">
                      ✓ ENCRYPTED ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ROUTE BRAND CUSTOMIZER & THEME EDITOR */}
      {activeSidebarTab === 'brand-customizer' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Description */}
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
            <h3 className="text-lg font-black uppercase text-emerald-950">Bangladesh Theme & Brand Customizer Desk</h3>
            <p className="text-xs text-emerald-800 font-mono mt-1">
              Command Center calibrated for Bangladeshi retail outlets. Edit live branding logos, inject custom pricing rates, select regional color palettes, and configure custom footer footprints in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Configurations */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Brand Logo & Currency Calibration */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                  Brand Logo & Currency Setup
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">LOGO BRAND TEXT</label>
                    <input
                      type="text"
                      value={appConfig.logoText}
                      onChange={(e) => onUpdateConfig({ ...appConfig, logoText: e.target.value })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">LOGO SUBTEXT / OUTLET</label>
                    <input
                      type="text"
                      value={appConfig.logoSubtext}
                      onChange={(e) => onUpdateConfig({ ...appConfig, logoSubtext: e.target.value })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">CURRENCY SYMBOL</label>
                    <input
                      type="text"
                      value={appConfig.currencySymbol}
                      onChange={(e) => onUpdateConfig({ ...appConfig, currencySymbol: e.target.value })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">CURRENCY CODE</label>
                    <input
                      type="text"
                      value={appConfig.currencyCode}
                      onChange={(e) => onUpdateConfig({ ...appConfig, currencyCode: e.target.value })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">EXCHANGE RATE ($1 USD to BDT)</label>
                    <input
                      type="number"
                      value={appConfig.exchangeRate}
                      onChange={(e) => onUpdateConfig({ ...appConfig, exchangeRate: Number(e.target.value) })}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-emerald-800 font-medium">
                  ⚡ Calibrated to Bangladesh: Standard products will multiply USD prices by {appConfig.exchangeRate} in real-time, displaying them with the "{appConfig.currencySymbol}" symbol.
                </p>
              </div>

              {/* Theme Preset Selector */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                  Select Visual Theme Preset
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Theme 1 */}
                  <button
                    onClick={() => onUpdateConfig({ ...appConfig, theme: 'classic' })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      appConfig.theme === 'classic'
                        ? 'bg-emerald-100/60 border-emerald-500 shadow-sm'
                        : 'bg-white border-emerald-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950">Classic Emerald Vault</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      Curated light forest green layout paired with rich emerald details and golden text elements.
                    </p>
                  </button>

                  {/* Theme 2 */}
                  <button
                    onClick={() => onUpdateConfig({ ...appConfig, theme: 'crimson' })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      appConfig.theme === 'crimson'
                        ? 'bg-red-50 border-red-500 shadow-sm'
                        : 'bg-white border-emerald-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950">Crimson Bengal Pride</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      Deep crimson watermarks and warm brick red accents. Inspired directly by the Bengal flag.
                    </p>
                  </button>

                  {/* Theme 3 */}
                  <button
                    onClick={() => onUpdateConfig({ ...appConfig, theme: 'royal' })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      appConfig.theme === 'royal'
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-emerald-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950">Royal Prestige Blue</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      Luxury premium blue watermarks with deep gold borders. Evokes historical elegance.
                    </p>
                  </button>

                  {/* Theme 4 */}
                  <button
                    onClick={() => onUpdateConfig({ ...appConfig, theme: 'bengal' })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      appConfig.theme === 'bengal'
                        ? 'bg-amber-50 border-amber-500 shadow-sm'
                        : 'bg-white border-emerald-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-950">Royal Bengal Tiger</span>
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      Coal-black layouts and fierce tiger-orange tags. Represents Dhaka curated athletic gear.
                    </p>
                  </button>
                </div>
              </div>

              {/* Footer Customizer Form */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                  Footer Editorial Customizer
                </h4>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-emerald-700 block">FOOTER ABOUT TEXT</label>
                  <textarea
                    rows={3}
                    value={appConfig.footerAbout}
                    onChange={(e) => onUpdateConfig({ ...appConfig, footerAbout: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs font-sans text-emerald-950 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">DHAKA HQ ADDRESS</label>
                    <input
                      type="text"
                      value={appConfig.footerLocations[0]?.address || ''}
                      onChange={(e) => {
                        const copy = [...appConfig.footerLocations];
                        copy[0] = { ...copy[0], address: e.target.value };
                        onUpdateConfig({ ...appConfig, footerLocations: copy });
                      }}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">DHAKA HQ PHONE</label>
                    <input
                      type="text"
                      value={appConfig.footerLocations[0]?.phone || ''}
                      onChange={(e) => {
                        const copy = [...appConfig.footerLocations];
                        copy[0] = { ...copy[0], phone: e.target.value };
                        onUpdateConfig({ ...appConfig, footerLocations: copy });
                      }}
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-emerald-700 block">TRADEMARK / COPYRIGHT FOOTNOTE</label>
                  <input
                    type="text"
                    value={appConfig.footerCopyright}
                    onChange={(e) => onUpdateConfig({ ...appConfig, footerCopyright: e.target.value })}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>

            {/* Right Col: Secure Staff Sessions & Stock Adding */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Secure Authorized Staff Sessions */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                  <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest">
                    Authorized Staff Sessions
                  </h4>
                  <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-200/60 animate-pulse">
                    SECURE ACCESS
                  </span>
                </div>

                <p className="text-[11px] text-emerald-800 leading-normal">
                  You are currently managing the vault via authenticated administrator credentials. Access sessions are audited under regional regulations.
                </p>

                <div className="space-y-3">
                  {[
                    { name: 'Kazi Yasin Ahmed (Dhaka HQ)', status: 'ACTIVE SESSION', loc: 'Dhaka, Bangladesh', active: true },
                    { name: 'Bailey Road Staff Terminal', status: 'STANDBY', loc: 'Dhaka, Bangladesh', active: false },
                    { name: 'International Curators (Gattuso)', status: 'STANDBY', loc: 'Milan, Italy', active: false }
                  ].map((sessionUser) => (
                    <div
                      key={sessionUser.name}
                      className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                        sessionUser.active
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-white border-emerald-100 text-emerald-700'
                      }`}
                    >
                      <div>
                        <p className="text-[11px] font-bold">{sessionUser.name}</p>
                        <p className="text-[10px] text-emerald-600 font-mono font-medium">📍 {sessionUser.loc}</p>
                      </div>
                      <span className={`text-[9px] font-mono font-bold ${sessionUser.active ? 'text-emerald-800' : 'text-emerald-600'}`}>
                        {sessionUser.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-100 font-mono text-[10px] text-emerald-700 space-y-1">
                  <p>✔ SESSION STATUS: AUTHORIZED</p>
                  <p>✔ GATEWAY: Bailey Road, Dhaka 1217</p>
                  <p>✔ REGION: Dhaka Division</p>
                </div>
              </div>

              {/* Stock Stock Adding Form */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-black text-emerald-950 uppercase tracking-widest border-b border-emerald-100 pb-2">
                  + Add New Stock To Bangladesh Catalog
                </h4>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const nameInput = form.elements.namedItem('shirt_name') as HTMLInputElement;
                    const brandInput = form.elements.namedItem('shirt_brand') as HTMLInputElement;
                    const priceInput = form.elements.namedItem('shirt_price') as HTMLInputElement;
                    const stockInput = form.elements.namedItem('shirt_stock') as HTMLInputElement;
                    const categoryInput = form.elements.namedItem('shirt_category') as HTMLSelectElement;

                    if (!nameInput.value || !brandInput.value || !priceInput.value) {
                      alert('Please fill out all required fields');
                      return;
                    }

                    const newId = `shirt-custom-${Date.now()}`;
                    const bdtPrice = Number(priceInput.value);
                    const usdPrice = Math.round(bdtPrice / appConfig.exchangeRate);

                    const newProd: Product = {
                      id: newId,
                      name: nameInput.value,
                      slug: nameInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      price: usdPrice,
                      originalPrice: usdPrice + 30,
                      image: 'shirt-custom',
                      images: [],
                      brand: brandInput.value,
                      season: '2025/2026',
                      year: 2026,
                      condition: 'Mint',
                      conditionDetail: 'Sourced from local archives in perfect collectible condition.',
                      color: 'Green/Red',
                      sizes: ['S', 'M', 'L', 'XL'],
                      sku: `BD-SKU-${Math.floor(100000 + Math.random() * 900000)}`,
                      badgeAvailable: true,
                      printAvailable: true,
                      rating: 5.0,
                      reviewsCount: 1,
                      description: 'Special customized vintage retro jersey added to the Dhaka Football Vault system.',
                      specification: {
                        material: '100% Polyester Mesh',
                        madeIn: 'Bangladesh',
                        fit: 'Aero Athlete Standard'
                      },
                      category: categoryInput.value as any,
                      stock: Number(stockInput.value) || 10,
                      isFeatured: true,
                      uploadedImage: quickAddImage || undefined,
                    };

                    setProducts((prev) => {
                      const updated = [newProd, ...prev];
                      localStorage.setItem('vault_custom_products', JSON.stringify(updated));
                      return updated;
                    });

                    form.reset();
                    setQuickAddImage('');
                    alert(`Successfully added "${newProd.name}" to Bangladesh stock at ${appConfig.currencySymbol}${bdtPrice}!`);
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-700 block">JERSEY CATALOG NAME *</label>
                    <input
                      name="shirt_name"
                      required
                      placeholder="e.g. Bangladesh 1999 World Cup Vintage"
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-700 block">BRAND (ADIDAS/NIKE) *</label>
                      <input
                        name="shirt_brand"
                        required
                        placeholder="e.g. Adidas"
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-700 block">CATEGORY</label>
                      <select
                        name="shirt_category"
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="World Cup">World Cup Vault</option>
                        <option value="Classic">Classic Vintage</option>
                        <option value="Current Season">Current Season</option>
                        <option value="Legends">Legends Tribute</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-700 block">PRICE IN BANGLADESH TAKA (৳) *</label>
                      <input
                        name="shirt_price"
                        type="number"
                        required
                        placeholder="e.g. 5500"
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-700 block">INITIAL INVENTORY STOCK *</label>
                      <input
                        name="shirt_stock"
                        type="number"
                        required
                        placeholder="e.g. 15"
                        className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 px-4 text-xs text-emerald-950 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Mobile-optimized touch image upload trigger */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-emerald-700 block uppercase font-bold">Jersey Photo (Optional):</label>
                    <label className="flex items-center gap-3.5 bg-white hover:bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 p-3 rounded-xl cursor-pointer transition-all group">
                      <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                        {quickAddImage ? (
                          <img
                            src={quickAddImage}
                            alt="Quick add preview"
                            className="w-full h-full object-contain filter drop-shadow"
                          />
                        ) : (
                          <Image size={15} className="text-emerald-700 group-hover:text-emerald-600 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-emerald-800 text-white group-hover:bg-emerald-700 border border-emerald-600 text-[9px] font-extrabold uppercase px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1">
                          <Upload size={9} />
                          Browse Photo
                        </div>
                        {quickAddImage ? (
                          <span className="text-[9px] text-emerald-800 font-mono block mt-0.5 truncate">✓ Photo loaded</span>
                        ) : (
                          <span className="text-[9px] text-emerald-700 font-mono block mt-0.5">JPEG/PNG max 2MB</span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert('File is too large! Maximum limit is 2MB.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setQuickAddImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {quickAddImage && (
                      <button
                        type="button"
                        onClick={() => setQuickAddImage('')}
                        className="text-[9px] text-red-600 hover:text-red-700 hover:underline font-mono block mt-1"
                      >
                        ✕ Remove Selected Photo
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer shadow-sm mt-2"
                  >
                    + Add Jersey to Dhaka Stock
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 28 EXTENDED DYNAMIC CMS MODULE PANELS */}
      {!['dashboard', 'inventory', 'seller-requests', 'homepage-builder', 'coupons', 'brand-customizer'].includes(activeSidebarTab) && (
        <div className="bg-white border border-emerald-100 p-6 rounded-3xl space-y-8 animate-fadeIn">
          
          {/* MODULE: analytics */}
          {activeSidebarTab === 'analytics' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">REVENUE & SALES TRENDS CENTRE</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Calibrated live visualizer analyzing Dhaka retail performance.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-[9px] font-mono text-emerald-800 uppercase block font-bold">Year-on-Year Growth</span>
                  <div className="text-xl font-black text-emerald-950 mt-1">+42.8%</div>
                  <p className="text-[9px] text-emerald-700 mt-1 font-mono">Based on verified 2026 logs</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-[9px] font-mono text-emerald-800 uppercase block font-bold">Conversion Rate</span>
                  <div className="text-xl font-black text-emerald-950 mt-1">3.85%</div>
                  <p className="text-[9px] text-emerald-700 mt-1 font-mono">Optimized checkouts flow</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-[9px] font-mono text-emerald-800 uppercase block font-bold">Dhaka Repeat Buyers</span>
                  <div className="text-xl font-black text-emerald-950 mt-1">68.2%</div>
                  <p className="text-[9px] text-emerald-700 mt-1 font-mono">Highest brand loyalty rate</p>
                </div>
              </div>
              <div className="bg-emerald-950 text-emerald-200 p-6 rounded-2xl border border-emerald-900 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">MONTHLY SALES CURVE (TAKA)</h4>
                <div className="h-40 w-full flex items-end justify-between gap-2 pt-4 relative">
                  <div className="absolute left-2 top-2 text-[9px] font-mono opacity-65">৳500K</div>
                  <div className="absolute left-2 top-20 text-[9px] font-mono opacity-65">৳250K</div>
                  <div className="absolute left-2 bottom-2 text-[9px] font-mono opacity-65">৳0</div>
                  <div className="w-full flex justify-between text-[9px] font-mono pt-2 z-10 text-emerald-300">
                    <span>JAN</span>
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                    <span>MAY</span>
                    <span>JUN</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => alert('CSV exported successfully!')} className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer">Download CSV</button>
                <button type="button" onClick={() => window.print()} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-200 cursor-pointer">Print PDF</button>
              </div>
            </div>
          )}

          {/* MODULE: backup-restore */}
          {activeSidebarTab === 'backup-restore' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">DATABASE SNAPSHOT BACKUP & RESTORE</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Export fully-formed JSON database tables or restore custom platform backups safely.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase">EXPORT DATABASE SNAPSHOT</h4>
                  <p className="text-xs text-emerald-800">Downloads secure data backup containing Products catalog, Customer profile logs, and AppConfigs.</p>
                  <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ products, orders, appConfig }))}`} download="dhaka_jersey_backup.json" className="inline-block bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-5 py-3 rounded-xl">✓ EXPORT BACKUP (.JSON)</a>
                </div>
                <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase">RESTORE DATABASE SNAPSHOT</h4>
                  <p className="text-xs text-emerald-800">Upload a pre-existing `.json` backup file to override live stock data and dynamic layout settings.</p>
                  <input type="file" accept=".json" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onload = (ev) => {
                        try {
                          const parsed = JSON.parse(ev.target?.result as string);
                          if (parsed.products && parsed.appConfig) {
                            setProducts(parsed.products);
                            onUpdateConfig(parsed.appConfig);
                            alert('Database restored successfully!');
                          } else { alert('Invalid structure!'); }
                        } catch { alert('Parse error!'); }
                      };
                      r.readAsText(file);
                    }
                  }} className="text-xs text-emerald-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-emerald-800 file:text-white" />
                </div>
              </div>
            </div>
          )}

          {/* MODULE: page-builder */}
          {activeSidebarTab === 'page-builder' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">CUSTOM PAGE BUILDER</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Rename standard store sections or add new custom landing pages that update live instantly across the entire store.</p>
              </div>
              <div className="space-y-4 bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-950 uppercase">STOREFRONT PAGES & LANDING SECTIONS ({appConfig.pages?.length || 0})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(appConfig.pages || []).map((page) => (
                    <div key={page.id} className="bg-white border border-emerald-100 p-4 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded uppercase">ID: {page.id}</span>
                          {page.isCustom && <span className="bg-amber-100 text-amber-900 font-mono text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">Custom Page</span>}
                        </div>
                        <input
                          type="text"
                          value={page.name}
                          onChange={(e) => {
                            const updated = (appConfig.pages || []).map(p => p.id === page.id ? { ...p, name: e.target.value } : p);
                            onUpdateConfig({ ...appConfig, pages: updated });
                          }}
                          className="w-full text-xs font-bold text-emerald-950 mt-2 bg-emerald-50/40 border border-emerald-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {page.isCustom && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete custom page "${page.name}"?`)) {
                                const updatedPages = (appConfig.pages || []).filter(p => p.id !== page.id);
                                const updatedNav = (appConfig.menuItems || []).filter(m => m.url !== page.id && m.url !== page.slug);
                                onUpdateConfig({ ...appConfig, pages: updatedPages, menuItems: updatedNav });
                              }
                            }}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            title="Delete Custom Page"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-950 uppercase">CREATE NEW LANDING PAGE</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-[9px] font-mono text-emerald-700 block uppercase font-bold">Page Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Champions League Vault"
                      value={newPageName}
                      onChange={e => {
                        setNewPageName(e.target.value);
                        if (!newPageSlug) {
                          setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                        }
                      }}
                      className="w-full bg-white border border-emerald-200 rounded-xl py-2 px-4 text-xs font-semibold text-emerald-950"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-emerald-700 block uppercase font-bold">Unique URL Slug *</label>
                    <input
                      type="text"
                      placeholder="e.g. champions-league"
                      value={newPageSlug}
                      onChange={e => setNewPageSlug(e.target.value)}
                      className="w-full bg-white border border-emerald-200 rounded-xl py-2 px-4 text-xs font-mono text-emerald-950"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newPageName.trim() || !newPageSlug.trim()) return;
                      const cleanSlug = newPageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      const nPage = { id: cleanSlug, name: newPageName.trim(), slug: cleanSlug, isCustom: true, visible: true, sections: [...(appConfig.homepageSections || [])] };
                      const newNav: MenuItem = {
                        id: `nav-page-${cleanSlug}`,
                        name: newPageName.trim(),
                        placement: 'Main Menu',
                        order: (appConfig.menuItems || []).length + 1,
                        url: cleanSlug,
                        status: 'Active',
                        icon: 'Trophy',
                        badgeText: 'NEW'
                      };
                      onUpdateConfig({
                        ...appConfig,
                        pages: [...(appConfig.pages || []), nPage],
                        menuItems: [...(appConfig.menuItems || []), newNav]
                      });
                      setNewPageName('');
                      setNewPageSlug('');
                      alert(`Custom page "${nPage.name}" created and published to navigation bar!`);
                    }}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase py-3 rounded-xl tracking-wider cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span>CREATE & PUBLISH PAGE</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: menu-builder & mega-menu (Navigation Menu Builder) */}
          {(activeSidebarTab === 'menu-builder' || activeSidebarTab === 'mega-menu') && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-800 text-white font-mono text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">CMS SYSTEM</span>
                    <h3 className="text-lg font-black uppercase text-emerald-950 tracking-tight">NAVIGATION MENU BUILDER</h3>
                  </div>
                  <p className="text-xs text-emerald-700 font-mono mt-1">Full admin panel control for Main Menu, Mega Menu, and Footer Menu with icons, parent-child nesting, order, and URLs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: MenuItem = {
                      id: `nav-${Date.now()}`,
                      name: 'New Custom Menu',
                      placement: 'Main Menu',
                      parentId: null,
                      icon: 'Shirt',
                      order: (appConfig.menuItems || []).length + 1,
                      url: '#listing',
                      status: 'Active',
                    };
                    setEditingMenuItem(newItem);
                    setIsAddingMenuItem(true);
                  }}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-5 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-105"
                >
                  <Plus size={16} />
                  <span>CREATE MENU ITEM</span>
                </button>
              </div>

              {/* STATS OVERVIEW CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Total Menu Links</div>
                  <div className="text-2xl font-black text-emerald-950 font-display">{(appConfig.menuItems || []).length}</div>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Main Header Menus</div>
                  <div className="text-2xl font-black text-emerald-800 font-display">
                    {(appConfig.menuItems || []).filter(m => m.placement === 'Main Menu').length}
                  </div>
                </div>
                <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono text-amber-700 uppercase font-bold">Mega Menu Links</div>
                  <div className="text-2xl font-black text-amber-900 font-display">
                    {(appConfig.menuItems || []).filter(m => m.placement === 'Mega Menu').length}
                  </div>
                </div>
                <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono text-sky-700 uppercase font-bold">Footer Navigation</div>
                  <div className="text-2xl font-black text-sky-900 font-display">
                    {(appConfig.menuItems || []).filter(m => m.placement === 'Footer Menu').length}
                  </div>
                </div>
              </div>

              {/* PLACEMENT FILTER TABS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['All', 'Main Menu', 'Mega Menu', 'Footer Menu'].map((placement) => (
                  <button
                    key={placement}
                    type="button"
                    onClick={() => setMenuPlacementFilter(placement)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase whitespace-nowrap transition-all cursor-pointer ${
                      menuPlacementFilter === placement
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white border border-emerald-100 text-emerald-900 hover:bg-emerald-50'
                    }`}
                  >
                    {placement === 'All' ? 'ALL MENUS' : placement}
                  </button>
                ))}
              </div>

              {/* MENU ITEMS HIERARCHICAL TREE VIEW */}
              <div className="space-y-4">
                {(() => {
                  const allMenuItems = appConfig.menuItems || [];
                  const filtered = allMenuItems
                    .filter((m) => menuPlacementFilter === 'All' || m.placement === menuPlacementFilter)
                    .sort((a, b) => a.order - b.order);

                  // Top level items (no parentId or parentId not matching any item in filtered)
                  const topLevel = filtered.filter((m) => !m.parentId);
                  const orphanChildren = filtered.filter((m) => m.parentId && !allMenuItems.some((p) => p.id === m.parentId));
                  const parentsToRender = [...topLevel, ...orphanChildren];

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-white border border-emerald-100 rounded-2xl p-12 text-center space-y-3">
                        <Layers className="mx-auto text-emerald-400" size={36} />
                        <h4 className="text-sm font-bold text-emerald-950 uppercase">No menu items found in {menuPlacementFilter}</h4>
                        <p className="text-xs text-emerald-700 font-mono">Click "Create Menu Item" above to add custom menu links with icons and URLs.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {parentsToRender.map((parent) => {
                        const children = allMenuItems.filter((c) => c.parentId === parent.id).sort((a, b) => a.order - b.order);

                        return (
                          <div key={parent.id} className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            {/* PARENT MENU ROW */}
                            <div className="p-4 bg-emerald-50/40 border-b border-emerald-100/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono text-xs font-bold shadow-sm">
                                  #{parent.order}
                                </div>
                                <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg flex items-center justify-center">
                                  {renderNavIcon(parent.icon, 18)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-black text-emerald-950 uppercase tracking-tight">{parent.name}</h4>
                                    {parent.badgeText && (
                                      <span className="bg-emerald-500 text-emerald-950 font-mono text-[9px] font-black px-2 py-0.5 rounded uppercase">
                                        {parent.badgeText}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-700 mt-0.5">
                                    <span className="bg-emerald-200/60 text-emerald-950 px-2 py-0.5 rounded font-bold uppercase">{parent.placement}</span>
                                    <span>• Target URL: <strong className="text-emerald-900">{parent.url}</strong></span>
                                  </div>
                                </div>
                              </div>

                              {/* PARENT ACTIONS */}
                              <div className="flex items-center gap-1.5 self-end md:self-center">
                                <span className={`text-[9px] font-mono px-2.5 py-1 rounded-full uppercase font-bold mr-2 ${
                                  parent.status === 'Active' || parent.status === 'active' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {parent.status}
                                </span>

                                {/* Move Up/Down Order */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = allMenuItems.map((item) =>
                                      item.id === parent.id ? { ...item, order: Math.max(1, item.order - 1) } : item
                                    );
                                    onUpdateConfig({ ...appConfig, menuItems: updated });
                                  }}
                                  className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all"
                                  title="Move Up"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = allMenuItems.map((item) =>
                                      item.id === parent.id ? { ...item, order: item.order + 1 } : item
                                    );
                                    onUpdateConfig({ ...appConfig, menuItems: updated });
                                  }}
                                  className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all"
                                  title="Move Down"
                                >
                                  <ArrowDown size={14} />
                                </button>

                                {/* Add Child Subitem */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const childItem: MenuItem = {
                                      id: `nav-${Date.now()}`,
                                      name: `Sublink under ${parent.name}`,
                                      placement: parent.placement,
                                      parentId: parent.id,
                                      icon: 'Shirt',
                                      order: children.length + 1,
                                      url: '#listing',
                                      status: 'Active',
                                    };
                                    setEditingMenuItem(childItem);
                                    setIsAddingMenuItem(true);
                                  }}
                                  className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
                                  title="Add Nested Subitem"
                                >
                                  <Plus size={14} />
                                  <span className="hidden sm:inline">Add Submenu</span>
                                </button>

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMenuItem({ ...parent });
                                    setIsAddingMenuItem(false);
                                  }}
                                  className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer font-bold text-xs flex items-center gap-1"
                                  title="Edit Menu Item"
                                >
                                  <Edit size={14} />
                                  <span>Edit</span>
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Delete menu item "${parent.name}" and its sub-links?`)) {
                                      const updated = allMenuItems.filter((m) => m.id !== parent.id && m.parentId !== parent.id);
                                      onUpdateConfig({ ...appConfig, menuItems: updated });
                                    }
                                  }}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                  title="Delete Menu Item"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* NESTED CHILDREN SUBMENU ROWS */}
                            {children.length > 0 && (
                              <div className="bg-emerald-50/20 p-3 space-y-2 border-t border-emerald-50">
                                {children.map((child) => (
                                  <div
                                    key={child.id}
                                    className="ml-4 md:ml-8 bg-white border border-emerald-100 rounded-xl p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-emerald-400 font-mono font-bold text-sm">└──</span>
                                      <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-900 flex items-center justify-center font-mono text-[10px] font-bold">
                                        #{child.order}
                                      </div>
                                      <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded flex items-center justify-center">
                                        {renderNavIcon(child.icon, 14)}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-emerald-950">{child.name}</span>
                                          {child.badgeText && (
                                            <span className="bg-amber-100 text-amber-900 text-[8px] font-mono px-1.5 py-0.5 rounded font-black">
                                              {child.badgeText}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-700 block">
                                          Parent: <strong className="text-emerald-900">{parent.name}</strong> | URL: {child.url}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 self-end md:self-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingMenuItem({ ...child });
                                          setIsAddingMenuItem(false);
                                        }}
                                        className="p-1 text-emerald-800 hover:bg-emerald-50 rounded font-bold text-[11px] flex items-center gap-1"
                                      >
                                        <Edit size={12} />
                                        <span>Edit</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`Delete child menu item "${child.name}"?`)) {
                                            const updated = allMenuItems.filter((m) => m.id !== child.id);
                                            onUpdateConfig({ ...appConfig, menuItems: updated });
                                          }
                                        }}
                                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* EDIT / CREATE MENU ITEM MODAL */}
          {editingMenuItem && (
            <div className="fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white border border-emerald-100 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
                <div className="flex justify-between items-center border-b border-emerald-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold tracking-widest">
                      {isAddingMenuItem ? 'CREATE NEW MENU LINK' : 'EDIT MENU ITEM CONFIGURATION'}
                    </span>
                    <h3 className="text-lg font-black uppercase text-emerald-950 font-display">
                      {editingMenuItem.name || 'MENU EDITOR'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingMenuItem(null)}
                    className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                  {/* Menu Name */}
                  <div>
                    <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                      Menu Name
                    </label>
                    <input
                      type="text"
                      value={editingMenuItem.name}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                      className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950"
                      placeholder="e.g. World Cup Vault or Premier League"
                    />
                  </div>

                  {/* Menu Placement & Parent Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Placement Category
                      </label>
                      <select
                        value={editingMenuItem.placement}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, placement: e.target.value as MenuPlacement, parentId: null })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Main Menu">Main Menu</option>
                        <option value="Mega Menu">Mega Menu</option>
                        <option value="Footer Menu">Footer Menu</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Parent Item (Nesting)
                      </label>
                      <select
                        value={editingMenuItem.parentId || ''}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, parentId: e.target.value ? e.target.value : null })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">None (Top-Level Item)</option>
                        {(appConfig.menuItems || [])
                          .filter((m) => m.placement === editingMenuItem.placement && m.id !== editingMenuItem.id && !m.parentId)
                          .map((parent) => (
                            <option key={parent.id} value={parent.id}>
                              {parent.name} (#{parent.order})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Icon Selector Grid */}
                  <div>
                    <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                      Menu Icon Selection
                    </label>
                    <div className="grid grid-cols-5 gap-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                      {[
                        'Shirt', 'Trophy', 'Star', 'Flame', 'Sparkles', 'Tag', 'Box', 'Globe',
                        'ShieldCheck', 'Award', 'ShoppingBag', 'HelpCircle', 'Phone', 'Compass',
                        'Heart', 'Users', 'MapPin', 'Mail', 'Layers', 'Grid'
                      ].map((iconKey) => (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setEditingMenuItem({ ...editingMenuItem, icon: iconKey })}
                          className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 text-[9px] font-mono transition-all cursor-pointer ${
                            editingMenuItem.icon === iconKey
                              ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600'
                              : 'bg-white border border-emerald-100 text-emerald-900 hover:bg-emerald-100'
                          }`}
                        >
                          {renderNavIcon(iconKey, 18)}
                          <span className="truncate max-w-full">{iconKey}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order & Target Redirect URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Order Sequence
                      </label>
                      <input
                        type="number"
                        value={editingMenuItem.order}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, order: Number(e.target.value) })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-mono font-bold text-emerald-950"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Target Redirect URL / Route
                      </label>
                      <input
                        type="text"
                        value={editingMenuItem.url}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, url: e.target.value })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-mono text-emerald-950"
                        placeholder="e.g. All, World Cup, England, seller, faq, #listing"
                      />
                    </div>
                  </div>

                  {/* Badge Text & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Badge Tag (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingMenuItem.badgeText || ''}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, badgeText: e.target.value })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950"
                        placeholder="e.g. HOT, RARE, NEW"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Menu Status
                      </label>
                      <select
                        value={editingMenuItem.status}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, status: e.target.value as any })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save or Cancel */}
                <div className="flex justify-end gap-3 border-t border-emerald-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingMenuItem(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingMenuItem.name.trim()) {
                        alert('Please enter a menu name.');
                        return;
                      }
                      const existing = appConfig.menuItems || [];
                      let updated: MenuItem[];
                      if (isAddingMenuItem) {
                        updated = [...existing, editingMenuItem];
                      } else {
                        updated = existing.map((m) => (m.id === editingMenuItem.id ? editingMenuItem : m));
                      }
                      onUpdateConfig({ ...appConfig, menuItems: updated });
                      setEditingMenuItem(null);
                      setIsAddingMenuItem(false);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    <Save size={16} />
                    <span>Save Menu Configuration</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: header-builder */}
          {activeSidebarTab === 'header-builder' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">HEADER CUSTOMIZER</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Directly control company logos text, search engine placeholders, and conversion variables.</p>
              </div>
              <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono text-emerald-700 block uppercase">Primary Company Logo Text</label>
                    <input type="text" value={appConfig.logoText} onChange={e => onUpdateConfig({ ...appConfig, logoText: e.target.value })} className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-emerald-700 block uppercase">Dhaka Exchange Rate (Taka per USD)</label>
                    <input type="number" value={appConfig.exchangeRate} onChange={e => onUpdateConfig({ ...appConfig, exchangeRate: Number(e.target.value) })} className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl text-xs font-mono" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: footer-builder */}
          {activeSidebarTab === 'footer-builder' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">FOOTER BUILDER</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Customize about text paragraphs, legal copyrights, and Bailey Road outlet location contacts.</p>
              </div>
              <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100 space-y-4">
                <div>
                  <label className="text-[9px] font-mono text-emerald-700 block uppercase">Footer About Us Story Text</label>
                  <textarea rows={3} value={appConfig.footerAbout} onChange={e => onUpdateConfig({ ...appConfig, footerAbout: e.target.value })} className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl text-xs leading-relaxed" />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-emerald-700 block uppercase">Copyright Footnote Text</label>
                  <input type="text" value={appConfig.footerCopyright} onChange={e => onUpdateConfig({ ...appConfig, footerCopyright: e.target.value })} className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl text-xs" />
                </div>
              </div>
            </div>
          )}

          {/* MODULE: announcement-bar */}
          {activeSidebarTab === 'announcement-bar' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">ANNOUNCEMENT BAR TICKER</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Control the scrolling alert banner displayed at the absolute top of the client storefront.</p>
              </div>
              <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100 space-y-4">
                <div>
                  <label className="text-[9px] font-mono text-emerald-700 block uppercase">Ticker Announcement Text</label>
                  <input type="text" className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl text-xs" defaultValue="VAULT SHIRTS RESTOCKED: EXHAUSTIVE VINTAGE ARRIVALS COMPLETED 12-POINT DHAKA micro-fabric tag checks!" />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-emerald-700 block uppercase">Announcements Marquee Speed (Seconds)</label>
                  <input type="number" className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl text-xs font-mono" defaultValue={15} />
                </div>
                <button type="button" onClick={() => alert('Announcement bar updated!')} className="bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl">Inject Live Announcement Ticker</button>
              </div>
            </div>
          )}

          {/* MODULE: hero-slider & Banner Management Deck */}
          {(activeSidebarTab === 'hero-slider' || activeSidebarTab === 'banner-management') && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-800 text-white font-mono text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">DYNAMIC CMS</span>
                    <h3 className="text-lg font-black uppercase text-emerald-950 tracking-tight">BANNER MANAGEMENT DECK</h3>
                  </div>
                  <p className="text-xs text-emerald-700 font-mono mt-1">Full backend control for Hero Slider, Category, Collection, League, Popup, Offer, Newsletter, Footer, Blog, and Mobile Banners.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newBanner: BannerConfig = {
                      id: `banner-${Date.now()}`,
                      name: 'New Promo Banner',
                      type: 'Hero Slider',
                      desktopImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1600',
                      tabletImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=1024',
                      mobileImage: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=640',
                      title: 'NEW PROMOTIONAL CAMPAIGN',
                      subtitle: 'Exclusive Vault Drop',
                      description: 'Enter banner description text here to highlight deals, restocks, or events.',
                      cta: 'EXPLORE CATALOG',
                      ctaText: 'EXPLORE CATALOG',
                      buttonUrl: '#listing',
                      openNewTab: false,
                      scheduleStart: new Date().toISOString().split('T')[0],
                      scheduleEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      status: 'Active',
                    };
                    setEditingBanner(newBanner);
                    setIsAddingBanner(true);
                  }}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-5 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-105"
                >
                  <Plus size={16} />
                  <span>CREATE NEW BANNER</span>
                </button>
              </div>

              {/* STATS OVERVIEW CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Total Banners</div>
                  <div className="text-2xl font-black text-emerald-950 font-display">{(appConfig.banners || []).length}</div>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Active Banners</div>
                  <div className="text-2xl font-black text-emerald-800 font-display">
                    {(appConfig.banners || []).filter(b => b.status === 'Active' || b.status === 'active').length}
                  </div>
                </div>
                <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono text-amber-700 uppercase font-bold">Draft Banners</div>
                  <div className="text-2xl font-black text-amber-900 font-display">
                    {(appConfig.banners || []).filter(b => b.status === 'Draft' || b.status === 'draft').length}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono text-slate-600 uppercase font-bold">Inactive Banners</div>
                  <div className="text-2xl font-black text-slate-800 font-display">
                    {(appConfig.banners || []).filter(b => b.status === 'Inactive' || b.status === 'inactive').length}
                  </div>
                </div>
              </div>

              {/* BANNER TYPE FILTER TABS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  'All',
                  'Hero Slider',
                  'Category Banner',
                  'Collection Banner',
                  'League Banner',
                  'Popup Banner',
                  'Offer Banner',
                  'Newsletter Banner',
                  'Footer Banner',
                  'Blog Banner',
                  'Mobile Banner',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBannerCategoryFilter(type)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase whitespace-nowrap transition-all cursor-pointer ${
                      bannerCategoryFilter === type
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white border border-emerald-100 text-emerald-900 hover:bg-emerald-50'
                    }`}
                  >
                    {type === 'All' ? 'ALL PLACEMENTS' : type}
                  </button>
                ))}
              </div>

              {/* BANNER CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(appConfig.banners || [])
                  .filter((b) => bannerCategoryFilter === 'All' || b.type === bannerCategoryFilter)
                  .map((banner) => {
                    const activeImg = banner.desktopImage || banner.image || 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=800';
                    const isLive = banner.status === 'Active' || banner.status === 'active';

                    return (
                      <div
                        key={banner.id}
                        className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Banner Visual Header */}
                          <div className="relative h-48 bg-emerald-950 overflow-hidden group">
                            <img
                              src={activeImg}
                              alt={banner.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent p-4 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <span className="bg-emerald-900/90 backdrop-blur-md text-emerald-200 text-[10px] font-mono px-2.5 py-1 rounded-md border border-emerald-700/50 uppercase font-black">
                                  {banner.type || 'Hero Slider'}
                                </span>
                                <span
                                  className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase font-black tracking-wider ${
                                    isLive
                                      ? 'bg-emerald-500 text-emerald-950'
                                      : banner.status === 'Draft' || banner.status === 'draft'
                                      ? 'bg-amber-400 text-amber-950'
                                      : 'bg-slate-700 text-slate-200'
                                  }`}
                                >
                                  {banner.status || 'Active'}
                                </span>
                              </div>
                              <div>
                                <p className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold">
                                  {banner.subtitle || 'SUBTITLE'}
                                </p>
                                <h4 className="text-base font-black text-white uppercase tracking-tight line-clamp-1 font-display">
                                  {banner.title || 'UNTITLED BANNER'}
                                </h4>
                              </div>
                            </div>
                          </div>

                          {/* Banner Body Specs */}
                          <div className="p-4 space-y-3 text-xs">
                            <p className="text-emerald-800 line-clamp-2 leading-relaxed">
                              {banner.description || 'No description provided.'}
                            </p>

                            {/* Responsive Images Thumbnails Indicator */}
                            <div className="grid grid-cols-3 gap-2 bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/60 text-[9px] font-mono">
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                <span className="text-emerald-700 block uppercase font-bold">Desktop</span>
                                <span className="text-emerald-950">{banner.desktopImage ? '✓ Custom' : 'Default'}</span>
                              </div>
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                <span className="text-emerald-700 block uppercase font-bold">Tablet</span>
                                <span className="text-emerald-950">{banner.tabletImage ? '✓ Custom' : 'Default'}</span>
                              </div>
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                <span className="text-emerald-700 block uppercase font-bold">Mobile</span>
                                <span className="text-emerald-950">{banner.mobileImage ? '✓ Custom' : 'Default'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                              <div>
                                <span className="text-emerald-600 block uppercase text-[9px]">CTA Button</span>
                                <span className="font-bold text-emerald-950">{banner.cta || banner.ctaText || 'EXPLORE'}</span>
                              </div>
                              <div>
                                <span className="text-emerald-600 block uppercase text-[9px]">Target URL / Tab</span>
                                <span className="font-bold text-emerald-950 truncate block">
                                  {banner.buttonUrl || '#'} {banner.openNewTab ? '(New Tab ↗)' : ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700 pt-1 border-t border-emerald-50">
                              <span>📅 Schedule Window:</span>
                              <span className="font-bold text-emerald-900">
                                {banner.scheduleStart || 'N/A'} — {banner.scheduleEnd || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Banner Card Actions */}
                        <div className="p-3 bg-emerald-50/30 border-t border-emerald-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newStatus = isLive ? 'Inactive' : 'Active';
                              const updated = (appConfig.banners || []).map((b) =>
                                b.id === banner.id ? { ...b, status: newStatus as any } : b
                              );
                              onUpdateConfig({ ...appConfig, banners: updated });
                            }}
                            className={`text-[10px] font-mono px-3 py-1.5 rounded-lg uppercase font-bold transition-all cursor-pointer ${
                              isLive
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                            }`}
                          >
                            {isLive ? 'DEACTIVATE' : 'ACTIVATE LIVE'}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBanner({ ...banner });
                                setIsAddingBanner(false);
                              }}
                              className="p-2 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer font-bold text-xs flex items-center gap-1"
                              title="Edit Banner"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const dup: BannerConfig = {
                                  ...banner,
                                  id: `banner-${Date.now()}`,
                                  title: `${banner.title} (COPY)`,
                                  status: 'Draft',
                                };
                                const updated = [...(appConfig.banners || []), dup];
                                onUpdateConfig({ ...appConfig, banners: updated });
                              }}
                              className="p-2 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer"
                              title="Duplicate Banner"
                            >
                              <Sparkles size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete banner "${banner.title}"?`)) {
                                  const updated = (appConfig.banners || []).filter((b) => b.id !== banner.id);
                                  onUpdateConfig({ ...appConfig, banners: updated });
                                }
                              }}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Delete Banner"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* EDIT / CREATE BANNER MODAL */}
          {editingBanner && (
            <div className="fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white border border-emerald-100 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
                <div className="flex justify-between items-center border-b border-emerald-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold tracking-widest">
                      {isAddingBanner ? 'CREATE NEW BANNER' : 'EDIT BANNER CONFIGURATION'}
                    </span>
                    <h3 className="text-lg font-black uppercase text-emerald-950 font-display">
                      {editingBanner.title || 'BANNER EDITOR'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingBanner(null)}
                    className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                  {/* Banner Placement Type & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Banner Placement Type
                      </label>
                      <select
                        value={editingBanner.type}
                        onChange={(e) => setEditingBanner({ ...editingBanner, type: e.target.value as BannerType })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Hero Slider">Hero Slider</option>
                        <option value="Category Banner">Category Banner</option>
                        <option value="Collection Banner">Collection Banner</option>
                        <option value="League Banner">League Banner</option>
                        <option value="Popup Banner">Popup Banner</option>
                        <option value="Offer Banner">Offer Banner</option>
                        <option value="Newsletter Banner">Newsletter Banner</option>
                        <option value="Footer Banner">Footer Banner</option>
                        <option value="Blog Banner">Blog Banner</option>
                        <option value="Mobile Banner">Mobile Banner</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Publish Status
                      </label>
                      <select
                        value={editingBanner.status}
                        onChange={(e) => setEditingBanner({ ...editingBanner, status: e.target.value as any })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Banner Title
                      </label>
                      <input
                        type="text"
                        value={editingBanner.title}
                        onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950"
                        placeholder="e.g. WORLD CUP 2026 EDITION"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Banner Subtitle
                      </label>
                      <input
                        type="text"
                        value={editingBanner.subtitle}
                        onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950"
                        placeholder="e.g. The Grandest Stage of Football"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                      Banner Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingBanner.description}
                      onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                      className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-950 leading-relaxed"
                      placeholder="Promotional copy description..."
                    />
                  </div>

                  {/* RESPONSIVE IMAGES (Desktop, Tablet, Mobile) */}
                  <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-3">
                    <h5 className="text-xs font-black text-emerald-950 uppercase flex items-center gap-2">
                      <Image size={14} />
                      RESPONSIVE IMAGES (DESKTOP, TABLET & MOBILE)
                    </h5>

                    {/* Desktop Image */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold">
                        Desktop Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingBanner.desktopImage}
                          onChange={(e) => setEditingBanner({ ...editingBanner, desktopImage: e.target.value, image: e.target.value })}
                          className="flex-1 bg-white border border-emerald-200 p-2 rounded-xl text-xs font-mono"
                          placeholder="https://..."
                        />
                        <label className="bg-emerald-800 text-white font-extrabold text-[10px] px-3 py-2 rounded-xl cursor-pointer hover:bg-emerald-900 flex items-center gap-1">
                          <Upload size={12} />
                          <span>File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const res = reader.result as string;
                                  setEditingBanner({ ...editingBanner, desktopImage: res, image: res });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Tablet Image */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold">
                          Tablet Image URL
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingBanner({ ...editingBanner, tabletImage: editingBanner.desktopImage })}
                          className="text-[9px] font-mono text-emerald-700 hover:underline uppercase"
                        >
                          Copy from Desktop
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingBanner.tabletImage}
                          onChange={(e) => setEditingBanner({ ...editingBanner, tabletImage: e.target.value })}
                          className="flex-1 bg-white border border-emerald-200 p-2 rounded-xl text-xs font-mono"
                          placeholder="https://..."
                        />
                        <label className="bg-emerald-800 text-white font-extrabold text-[10px] px-3 py-2 rounded-xl cursor-pointer hover:bg-emerald-900 flex items-center gap-1">
                          <Upload size={12} />
                          <span>File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditingBanner({ ...editingBanner, tabletImage: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Mobile Image */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold">
                          Mobile Image URL
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingBanner({ ...editingBanner, mobileImage: editingBanner.desktopImage })}
                          className="text-[9px] font-mono text-emerald-700 hover:underline uppercase"
                        >
                          Copy from Desktop
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingBanner.mobileImage}
                          onChange={(e) => setEditingBanner({ ...editingBanner, mobileImage: e.target.value })}
                          className="flex-1 bg-white border border-emerald-200 p-2 rounded-xl text-xs font-mono"
                          placeholder="https://..."
                        />
                        <label className="bg-emerald-800 text-white font-extrabold text-[10px] px-3 py-2 rounded-xl cursor-pointer hover:bg-emerald-900 flex items-center gap-1">
                          <Upload size={12} />
                          <span>File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditingBanner({ ...editingBanner, mobileImage: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* CTA Label, Button URL & Open New Tab */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={editingBanner.cta || editingBanner.ctaText || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, cta: e.target.value, ctaText: e.target.value })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-bold text-emerald-950"
                        placeholder="e.g. SHOP VAULT"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Button Redirect URL
                      </label>
                      <input
                        type="text"
                        value={editingBanner.buttonUrl}
                        onChange={(e) => setEditingBanner({ ...editingBanner, buttonUrl: e.target.value })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-mono text-emerald-950"
                        placeholder="e.g. #listing or /collections/retro"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="openNewTabCheck"
                      checked={editingBanner.openNewTab}
                      onChange={(e) => setEditingBanner({ ...editingBanner, openNewTab: e.target.checked })}
                      className="w-4 h-4 text-emerald-800 rounded border-emerald-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="openNewTabCheck" className="text-xs font-bold text-emerald-950 select-none cursor-pointer">
                      Open link in a new browser tab (`target="_blank"`)
                    </label>
                  </div>

                  {/* Schedule Window */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Schedule Start Date
                      </label>
                      <input
                        type="date"
                        value={editingBanner.scheduleStart}
                        onChange={(e) => setEditingBanner({ ...editingBanner, scheduleStart: e.target.value })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-mono text-emerald-950"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-emerald-800 uppercase block font-bold mb-1">
                        Schedule End Date
                      </label>
                      <input
                        type="date"
                        value={editingBanner.scheduleEnd}
                        onChange={(e) => setEditingBanner({ ...editingBanner, scheduleEnd: e.target.value })}
                        className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs font-mono text-emerald-950"
                      />
                    </div>
                  </div>
                </div>

                {/* Save or Cancel */}
                <div className="flex justify-end gap-3 border-t border-emerald-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingBanner(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingBanner.title.trim()) {
                        alert('Please provide a title for the banner.');
                        return;
                      }
                      const existing = appConfig.banners || [];
                      let updated: BannerConfig[];
                      if (isAddingBanner) {
                        updated = [...existing, editingBanner];
                      } else {
                        updated = existing.map((b) => (b.id === editingBanner.id ? editingBanner : b));
                      }
                      onUpdateConfig({ ...appConfig, banners: updated });
                      setEditingBanner(null);
                      setIsAddingBanner(false);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    <Save size={16} />
                    <span>Save Banner Config</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODULES: collections, categories, leagues, clubs, national-teams, brands, players */}
          {['collections', 'categories', 'leagues', 'clubs', 'national-teams', 'brands', 'players'].includes(activeSidebarTab) && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">{activeSidebarTab.toUpperCase()} REGISTRY & DATABASE</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Configure verified database catalog profiles, categories, and tags in real-time.</p>
              </div>
              <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100 space-y-4">
                <h4 className="text-xs font-bold text-emerald-950 uppercase">Registered Football Entities</h4>
                <div className="space-y-2">
                  {activeSidebarTab === 'leagues' && leaguesList.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center text-xs">
                      <span className="font-bold">{item.flag} {item.name}</span>
                      <span className="font-mono text-emerald-700 text-[10px]">Status: {item.status}</span>
                    </div>
                  ))}
                  {activeSidebarTab === 'clubs' && clubsList.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center text-xs">
                      <span className="font-bold">{item.badge} {item.name}</span>
                      <span className="font-mono text-emerald-700 text-[10px]">Status: {item.status}</span>
                    </div>
                  ))}
                  {activeSidebarTab === 'players' && playersList.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center text-xs">
                      <span className="font-bold">👤 {item.name} (No. {item.number})</span>
                      <span className="font-mono text-emerald-700 text-[10px]">{item.country}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE: product-management */}
          {activeSidebarTab === 'product-management' && (
            <ProductManager
              products={products}
              setProducts={setProducts}
              appConfig={appConfig}
              onUpdateConfig={onUpdateConfig}
              formatPrice={formatPrice}
            />
          )}

          {/* MODULE: customers */}
          {activeSidebarTab === 'customers' && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">COLLECTOR CRM PROFILE LEDGER</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Detailed records of regular buyers in Dhaka with transaction histories.</p>
              </div>
              <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100 space-y-4">
                <div className="space-y-2">
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-emerald-950">Tanvir Rahman</p>
                      <p className="text-[10px] text-emerald-700 font-mono">tanvir@retrojersey.bd • Dhaka HQ Club</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-950">৳145,500 Spent</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-emerald-950">Zubayer Al-Arafat</p>
                      <p className="text-[10px] text-emerald-700 font-mono">zubayer@collector.bd • Premium member</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-950">৳98,200 Spent</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: orders (Order Management Hub) */}
          {activeSidebarTab === 'orders' && (
            <div className="space-y-6">
              {/* Header & Title */}
              <div className="border-b border-emerald-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black uppercase text-emerald-950 flex items-center gap-2">
                    <ShoppingBag size={20} className="text-emerald-800" />
                    Order Management Command Center
                  </h3>
                  <p className="text-xs text-emerald-700 font-mono">
                    Full-lifecycle e-commerce order control: Statuses, Invoices, Customer details, Shipping Address, Tracking, Timelines & Admin Notes.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddSimulatedOrders(9)}
                    className="bg-emerald-950 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Load 9 Orders (All Statuses)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCSVReport}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Top Order KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">Total Orders</span>
                  <span className="text-xl font-black text-emerald-950 mt-1 block">{orders.length}</span>
                </div>
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-800 block">Pending Action</span>
                  <span className="text-xl font-black text-amber-950 mt-1 block">
                    {orders.filter((o) => ['Pending', 'Confirmed', 'Packed', 'Ready to Ship'].includes(o.status)).length}
                  </span>
                </div>
                <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
                  <span className="text-[10px] font-mono uppercase font-bold text-sky-800 block">Shipped & Transit</span>
                  <span className="text-xl font-black text-sky-950 mt-1 block">
                    {orders.filter((o) => o.status === 'Shipped').length}
                  </span>
                </div>
                <div className="bg-emerald-100/70 p-3.5 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-900 block">Delivered</span>
                  <span className="text-xl font-black text-emerald-950 mt-1 block">
                    {orders.filter((o) => o.status === 'Delivered').length}
                  </span>
                </div>
                <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100">
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-800 block">Returned / Cancel</span>
                  <span className="text-xl font-black text-rose-950 mt-1 block">
                    {orders.filter((o) => ['Cancelled', 'Returned', 'Refund Request'].includes(o.status)).length}
                  </span>
                </div>
                <div className="bg-amber-100/50 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-900 block">Order Value Sum</span>
                  <span className="text-base font-black text-amber-950 mt-1 block truncate">
                    {formatPrice(orders.reduce((s, o) => s + o.total, 0))}
                  </span>
                </div>
              </div>

              {/* Status Filter Tabs (9 Statuses + All) */}
              <div className="space-y-3 bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                  <span className="uppercase tracking-wider font-mono text-[10px]">Filter Order Status Pipeline:</span>
                  <span className="text-[10px] font-mono text-emerald-700">
                    Showing {orders.filter((o) => (orderFilterStatus === 'All' || o.status === orderFilterStatus) && (!orderSearchQuery || o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) || (o.shippingAddress?.fullName || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) || (o.shippingAddress?.phone || '').includes(orderSearchQuery))).length} of {orders.length} Total
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  {[
                    'All', 'Pending', 'Confirmed', 'Packed', 
                    'Ready to Ship', 'Shipped', 'Delivered', 
                    'Cancelled', 'Returned', 'Refund Request'
                  ].map((status) => {
                    const count = status === 'All' 
                      ? orders.length 
                      : orders.filter((o) => o.status === status).length;
                    const isActive = orderFilterStatus === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setOrderFilterStatus(status)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                          isActive
                            ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm'
                            : 'bg-emerald-50/50 hover:bg-emerald-100 text-emerald-900 border-emerald-100'
                        }`}
                      >
                        <span>{status}</span>
                        <span className={`px-2 py-0.2 text-[9px] font-mono font-black rounded-full ${
                          isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-200/60 text-emerald-900'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative w-full pt-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, Phone, Email, Tracking ID, Jersey item..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl pl-9 pr-8 py-2 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                  {orderSearchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-950 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Order Management Main Table */}
              <div className="border border-emerald-100 rounded-2xl overflow-hidden overflow-x-auto shadow-xs bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-emerald-950 text-white text-[10px] font-mono uppercase tracking-wider">
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer & Address</th>
                      <th className="py-3.5 px-4">Items & Custom Print</th>
                      <th className="py-3.5 px-4">Carrier & Tracking</th>
                      <th className="py-3.5 px-4 text-center">Pipeline Status</th>
                      <th className="py-3.5 px-4 text-right">Invoice Sum</th>
                      <th className="py-3.5 px-4 text-center">Desk Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {orders.filter((o) => {
                      const matchesStatus = orderFilterStatus === 'All' || o.status === orderFilterStatus;
                      const q = orderSearchQuery.toLowerCase().trim();
                      const matchesSearch = !q || 
                        o.id.toLowerCase().includes(q) ||
                        (o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
                        (o.shippingAddress?.phone || '').toLowerCase().includes(q) ||
                        (o.shippingAddress?.email || '').toLowerCase().includes(q) ||
                        (o.trackingNumber || '').toLowerCase().includes(q) ||
                        o.items?.some(i => (i.product?.name || '').toLowerCase().includes(q));
                      return matchesStatus && matchesSearch;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-xs font-mono text-emerald-700 bg-emerald-50/20">
                          No orders matched current filter "{orderFilterStatus}". Click "Load 9 Orders" above to populate test data!
                        </td>
                      </tr>
                    ) : (
                      orders
                        .filter((o) => {
                          const matchesStatus = orderFilterStatus === 'All' || o.status === orderFilterStatus;
                          const q = orderSearchQuery.toLowerCase().trim();
                          const matchesSearch = !q || 
                            o.id.toLowerCase().includes(q) ||
                            (o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
                            (o.shippingAddress?.phone || '').toLowerCase().includes(q) ||
                            (o.shippingAddress?.email || '').toLowerCase().includes(q) ||
                            (o.trackingNumber || '').toLowerCase().includes(q) ||
                            o.items?.some(i => (i.product?.name || '').toLowerCase().includes(q));
                          return matchesStatus && matchesSearch;
                        })
                        .map((o) => (
                          <tr key={o.id} className="hover:bg-emerald-50/40 transition-colors">
                            {/* Order ID & Date */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-black text-emerald-950 block text-xs">{o.id}</span>
                              <span className="text-[10px] text-emerald-700 font-mono block">Date: {o.date}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[9px] font-mono text-emerald-900 bg-emerald-100 border border-emerald-200 px-1.5 py-0.2 rounded font-extrabold uppercase">
                                  {o.paymentMethod || 'Cash on Delivery'}
                                </span>
                                {o.paymentStatus && (
                                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                                    o.paymentStatus === 'Paid' ? 'bg-emerald-800 text-white' : 'bg-amber-100 text-amber-900'
                                  }`}>
                                    {o.paymentStatus}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Customer & Address */}
                            <td className="py-3.5 px-4 max-w-[200px]">
                              <span className="font-extrabold text-emerald-950 block text-xs">{o.shippingAddress?.fullName}</span>
                              <span className="text-[10px] font-mono text-emerald-700 block truncate">{o.shippingAddress?.addressLine1}, {o.shippingAddress?.city}</span>
                              <span className="text-[10px] text-emerald-900 font-mono block font-bold">{o.shippingAddress?.phone}</span>
                            </td>

                            {/* Purchased Items */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1 max-w-[220px]">
                                {o.items?.map((item, idx) => (
                                  <div key={idx} className="text-[11px] leading-tight border-b border-emerald-50/80 last:border-0 pb-1 last:pb-0">
                                    <span className="font-black text-emerald-950 block truncate">✓ {item.product?.name || 'Jersey Kit'}</span>
                                    <div className="text-[9px] text-emerald-700 font-mono flex items-center gap-1">
                                      <span>Size: <b>{item.selectedSize}</b></span>
                                      <span>• Qty: <b>{item.quantity}</b></span>
                                      {item.addBadge && <span className="text-amber-800 font-bold bg-amber-50 px-1 rounded">Badge</span>}
                                      {item.customPrint?.name && <span className="text-blue-800 font-bold bg-blue-50 px-1 rounded">Custom #{item.customPrint.number}</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Tracking & Carrier */}
                            <td className="py-3.5 px-4 font-mono text-[10px]">
                              {o.trackingNumber ? (
                                <div>
                                  <span className="font-bold text-emerald-950 block">{o.carrier || 'Steadfast Courier'}</span>
                                  <span className="text-emerald-700 font-bold block">{o.trackingNumber}</span>
                                  {o.trackingUrl && (
                                    <a
                                      href={o.trackingUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[9px] text-blue-700 hover:underline flex items-center gap-1 font-bold mt-0.5"
                                    >
                                      <span>Track Package</span>
                                      <ExternalLink size={9} />
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-zinc-400 italic">No tracking set</span>
                              )}
                            </td>

                            {/* Status Quick Dropdown */}
                            <td className="py-3.5 px-4 text-center">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-xl border cursor-pointer focus:outline-none ${
                                  o.status === 'Pending' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                  o.status === 'Confirmed' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                                  o.status === 'Packed' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' :
                                  o.status === 'Ready to Ship' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                                  o.status === 'Shipped' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                                  o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                                  o.status === 'Cancelled' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                                  o.status === 'Returned' ? 'bg-orange-100 text-orange-900 border-orange-300' :
                                  'bg-violet-100 text-violet-900 border-violet-300'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Packed">Packed</option>
                                <option value="Ready to Ship">Ready to Ship</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                                <option value="Refund Request">Refund Request</option>
                              </select>
                            </td>

                            {/* Total Price */}
                            <td className="py-3.5 px-4 text-right font-black text-emerald-950 font-mono text-xs">
                              {formatPrice(o.total)}
                            </td>

                            {/* Desk Actions */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenOrderModal(o)}
                                  className="bg-emerald-950 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                                >
                                  <Eye size={12} />
                                  <span>Manage</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setInvoiceOrder(o);
                                    setIsInvoiceModalOpen(true);
                                  }}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold px-2 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                                >
                                  <Printer size={12} />
                                  <span>Invoice</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: Staff Roles & Permissions Center */}
          {activeSidebarTab === 'roles-permissions' && (
            <RolesPermissionsManager
              users={staffUsers}
              setUsers={setStaffUsers}
              activeUserRole={activeUserRole}
              setActiveUserRole={setActiveUserRole}
              currentUser={staffUsers[0] || null}
              handleAddLog={handleAddLog}
            />
          )}

          {/* MODULES: reviews, blogs, gallery, videos, testimonials, newsletter, locations, theme-settings, media-library, system-settings */}
          {!['analytics', 'backup-restore', 'page-builder', 'menu-builder', 'mega-menu', 'header-builder', 'footer-builder', 'announcement-bar', 'hero-slider', 'collections', 'categories', 'leagues', 'clubs', 'national-teams', 'brands', 'players', 'product-management', 'customers', 'orders', 'roles-permissions'].includes(activeSidebarTab) && (
            <div className="space-y-6">
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-base font-bold uppercase text-emerald-950">{activeSidebarTab.toUpperCase()} CONTROLLER</h3>
                <p className="text-[10px] text-emerald-700 font-mono">Module is active and synchronizing live storefront components in real-time.</p>
              </div>
              <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100 space-y-4">
                <span className="text-xs text-emerald-800 font-semibold block">Configuring and calibrating parameters:</span>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 text-xs font-mono space-y-1 text-emerald-950">
                  <p>✔ Active State Engine: Verified</p>
                  <p>✔ Live API proxy connections: Safe</p>
                  <p>✔ Real-time DB cache synchronization: Active</p>
                </div>
                <button type="button" onClick={() => alert(`${activeSidebarTab} saved successfully!`)} className="bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl">✓ SAVE SYSTEM CHANGES</button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: MANAGE ORDER DETAILS OVERLAY      */}
      {/* ========================================== */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-emerald-100 max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-6 relative animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-emerald-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded">ORDER DETAILS</span>
                  <span className="font-mono text-lg font-black text-emerald-950">{selectedOrderForModal.id}</span>
                </div>
                <p className="text-xs text-emerald-700 font-mono mt-0.5">
                  Placed on {selectedOrderForModal.date} • Customer: <span className="font-bold text-emerald-950">{selectedOrderForModal.shippingAddress?.fullName}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceOrder(selectedOrderForModal);
                    setIsInvoiceModalOpen(true);
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer flex items-center gap-1"
                >
                  <Printer size={14} />
                  <span>Print Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrderForModal(null)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 p-2 rounded-full cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Status Pipeline Transition Buttons */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">Fast Pipeline Status Transition:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Pending', 'Confirmed', 'Packed', 'Ready to Ship', 
                  'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refund Request'
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateOrderStatus(selectedOrderForModal.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      selectedOrderForModal.status === st
                        ? 'bg-emerald-950 text-white border-emerald-950 shadow-xs'
                        : 'bg-white hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                    }`}
                  >
                    {selectedOrderForModal.status === st ? `✓ ${st}` : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Grid: Customer Info & Shipping Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Profile Card */}
              <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                  <UserCheck size={14} className="text-emerald-800" />
                  <span>Customer Information</span>
                </h4>
                <div className="text-xs space-y-1 font-mono">
                  <p><span className="text-emerald-700">Full Name:</span> <b className="text-emerald-950">{selectedOrderForModal.shippingAddress?.fullName}</b></p>
                  <p><span className="text-emerald-700">Phone Contact:</span> <b className="text-emerald-950">{selectedOrderForModal.shippingAddress?.phone}</b></p>
                  <p><span className="text-emerald-700">Email Address:</span> <b className="text-emerald-950">{selectedOrderForModal.shippingAddress?.email || 'customer@vault.bd'}</b></p>
                  <p><span className="text-emerald-700">Payment Mode:</span> <b className="text-emerald-950 uppercase">{selectedOrderForModal.paymentMethod}</b></p>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                  <MapPin size={14} className="text-emerald-800" />
                  <span>Shipping Address & Region</span>
                </h4>
                <div className="text-xs space-y-1 font-mono">
                  <p><span className="text-emerald-700">Street Address:</span> <b className="text-emerald-950">{selectedOrderForModal.shippingAddress?.addressLine1}</b></p>
                  <p><span className="text-emerald-700">City / District:</span> <b className="text-emerald-950">{selectedOrderForModal.shippingAddress?.city}</b></p>
                  <p><span className="text-emerald-700">Postal Code:</span> <b className="text-emerald-950">{selectedOrderForModal.shippingAddress?.postalCode || '1212'}</b></p>
                  <p><span className="text-emerald-700">Delivery Zone:</span> <b className="text-emerald-950 uppercase">{selectedOrderForModal.deliveryRegion === 'inside' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka Courier (৳130)'}</b></p>
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-emerald-950 text-white text-xs font-black uppercase tracking-wider py-2.5 px-4 flex justify-between items-center">
                <span>Purchased Kit Items</span>
                <span>{selectedOrderForModal.items?.length || 0} Products</span>
              </div>
              <div className="p-4 divide-y divide-emerald-50">
                {selectedOrderForModal.items?.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl overflow-hidden border border-emerald-100 flex items-center justify-center shrink-0">
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Shirt size={20} className="text-emerald-800" />
                        )}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-emerald-950">{item.product?.name || 'Dhaka Retro Jersey'}</h5>
                        <div className="flex flex-wrap gap-2 text-[10px] text-emerald-800 font-mono mt-0.5">
                          <span>Size: <b>{item.selectedSize}</b></span>
                          <span>Qty: <b>{item.quantity}</b></span>
                          {item.addBadge && <span className="text-amber-800 font-bold bg-amber-50 px-1 rounded">✓ Badge</span>}
                          {item.customPrint?.name && (
                            <span className="text-blue-800 font-bold bg-blue-50 px-1 rounded">
                              Print: #{item.customPrint.number} {item.customPrint.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-xs font-mono text-emerald-950">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Invoice Summary Footer */}
              <div className="bg-emerald-50/50 p-4 border-t border-emerald-100 flex flex-col sm:flex-row justify-between items-end gap-3 text-xs font-mono">
                <div className="text-[10px] text-emerald-700 space-y-0.5">
                  <p>Tax / VAT (5%): {formatPrice(selectedOrderForModal.tax || 0)}</p>
                  <p>Delivery Fee: ৳{selectedOrderForModal.deliveryCharge || (selectedOrderForModal.deliveryRegion === 'inside' ? 70 : 130)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-800 block">GRAND TOTAL INVOICE</span>
                  <span className="text-lg font-black text-emerald-950">{formatPrice(selectedOrderForModal.total)}</span>
                </div>
              </div>
            </div>

            {/* Logistics & Courier Tracking (Editable) */}
            <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-3">
              <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                <Truck size={14} className="text-emerald-800" />
                <span>Courier Logistics & Tracking Desk</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-emerald-800 font-bold uppercase mb-1">Carrier Courier</label>
                  <select
                    value={editingCarrier}
                    onChange={(e) => setEditingCarrier(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-bold"
                  >
                    <option value="Steadfast Courier">Steadfast Courier</option>
                    <option value="RedX Logistics">RedX Logistics</option>
                    <option value="Pathao Courier">Pathao Courier</option>
                    <option value="Paperfly">Paperfly</option>
                    <option value="DHL Express">DHL Express</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-emerald-800 font-bold uppercase mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={editingTrackingNumber}
                    onChange={(e) => setEditingTrackingNumber(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-emerald-800 font-bold uppercase mb-1">Tracking URL</label>
                  <input
                    type="text"
                    value={editingTrackingUrl}
                    onChange={(e) => setEditingTrackingUrl(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-mono text-[10px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-emerald-800 font-bold uppercase mb-1">Shipped Date</label>
                  <input
                    type="text"
                    value={editingShippedDate}
                    onChange={(e) => setEditingShippedDate(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-emerald-800 font-bold uppercase mb-1">Est. Delivery</label>
                  <input
                    type="text"
                    value={editingEstDelivery}
                    onChange={(e) => setEditingEstDelivery(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleSaveOrderLogistics(selectedOrderForModal.id)}
                    className="w-full bg-emerald-950 hover:bg-black text-white text-xs font-bold py-2 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    <Save size={12} />
                    <span>Save Tracking Info</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline Audit Trail */}
            <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100 space-y-3">
              <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                <Clock size={14} className="text-emerald-800" />
                <span>Order Timeline & Lifecycle History</span>
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedOrderForModal.timeline?.map((evt) => (
                  <div key={evt.id} className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-950 uppercase">{evt.status}</span>
                        <span className="text-[9px] text-emerald-700 font-mono">by {evt.updatedBy || 'System'}</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-0.5">{evt.note}</p>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-600 whitespace-nowrap">{evt.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Notes & Internal Staff Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Checkout Instructions */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-900 block">Customer Checkout Instructions:</span>
                <p className="text-xs text-amber-950 font-mono italic">
                  "{selectedOrderForModal.customerNotes || 'No special delivery instructions provided during checkout.'}"
                </p>
              </div>

              {/* Internal Admin Notes */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-900 block">Internal Staff Secret Notes:</span>
                <textarea
                  rows={2}
                  value={editingInternalNotes}
                  onChange={(e) => setEditingInternalNotes(e.target.value)}
                  placeholder="Add internal notes for staff (e.g., Verified phone call, Collector preference)..."
                  className="w-full bg-white border border-emerald-200 rounded-xl p-2 text-xs text-emerald-950 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSaveInternalNotes(selectedOrderForModal.id)}
                  className="bg-emerald-950 hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                >
                  <Save size={10} />
                  <span>Save Internal Notes</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: OFFICIAL PRINTABLE INVOICE        */}
      {/* ========================================== */}
      {isInvoiceModalOpen && invoiceOrder && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-8 shadow-2xl space-y-6 relative border-4 border-emerald-900">
            
            {/* Modal Controls */}
            <div className="flex justify-between items-center border-b pb-4 print:hidden">
              <span className="font-mono text-xs font-black uppercase text-emerald-900">
                Official Dhaka Jersey Vault Invoice
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Printer size={14} />
                  <span>Print Official Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 p-2 rounded-full cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-emerald-900 pb-6">
              <div>
                <h2 className="text-xl font-black uppercase text-emerald-950 tracking-tight">DHAKA JERSEY VAULT</h2>
                <p className="text-xs text-zinc-600">Authentic Retro & Match-Issue Football Kits</p>
                <p className="text-[11px] text-zinc-500 font-mono mt-1">Bailey Road HQ, Dhaka-1217, Bangladesh</p>
                <p className="text-[11px] text-zinc-500 font-mono">Hotline: +880 1840-990700 | dhakajersey.bd</p>
              </div>

              <div className="text-right font-mono">
                <span className="bg-emerald-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase block mb-1">
                  INVOICE RECEIPT
                </span>
                <p className="text-sm font-black text-emerald-950">{invoiceOrder.id}</p>
                <p className="text-[11px] text-zinc-600">Date: {invoiceOrder.date}</p>
                <p className="text-[11px] text-zinc-600">Status: <b className="uppercase text-emerald-900">{invoiceOrder.status}</b></p>
              </div>
            </div>

            {/* Billed To Customer */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-bold block">CUSTOMER / BILLED TO:</span>
                <p className="font-extrabold text-zinc-900 text-sm mt-0.5">{invoiceOrder.shippingAddress?.fullName}</p>
                <p className="text-zinc-700">{invoiceOrder.shippingAddress?.addressLine1}</p>
                <p className="text-zinc-700">{invoiceOrder.shippingAddress?.city}, Bangladesh</p>
                <p className="text-zinc-700">Phone: {invoiceOrder.shippingAddress?.phone}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-zinc-500 font-bold block">LOGISTICS & DISPATCH:</span>
                <p className="font-bold text-zinc-900 mt-0.5">Carrier: {invoiceOrder.carrier || 'Steadfast Courier'}</p>
                <p className="text-zinc-700">Tracking #: {invoiceOrder.trackingNumber || 'PENDING'}</p>
                <p className="text-zinc-700">Payment: <b className="uppercase">{invoiceOrder.paymentMethod}</b></p>
                <p className="text-zinc-700">Payment Status: <b className="uppercase text-emerald-800">{invoiceOrder.paymentStatus || 'UNPAID'}</b></p>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-emerald-900 text-white text-[10px] uppercase">
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3 text-center">Size</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Unit Price</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 border-b border-zinc-200">
                {invoiceOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3">
                      <span className="font-bold text-zinc-900 block">{item.product?.name || 'Jersey Kit'}</span>
                      {item.customPrint?.name && (
                        <span className="text-[10px] text-zinc-600 block">Custom Print: #{item.customPrint.number} {item.customPrint.name}</span>
                      )}
                      {item.addBadge && (
                        <span className="text-[10px] text-amber-800 font-bold block">+ Sleeve Honor Badge</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold">{item.selectedSize}</td>
                    <td className="py-3 px-3 text-center">{item.quantity}</td>
                    <td className="py-3 px-3 text-right">{formatPrice(item.product?.price || 0)}</td>
                    <td className="py-3 px-3 text-right font-bold">{formatPrice((item.product?.price || 0) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Calculations */}
            <div className="flex justify-between items-start font-mono text-xs">
              <div className="max-w-xs space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">AUTHENTICITY GUARANTEE & STAMP</span>
                <p className="text-[10px] text-zinc-600 leading-normal">
                  All kits undergo 10-point archival inspection in Dhaka. 7-day hassle-free replacement policy applies for genuine issues.
                </p>
              </div>

              <div className="w-56 space-y-1 text-right border-t border-zinc-200 pt-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(invoiceOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>VAT / Tax (5%):</span>
                  <span>{formatPrice(invoiceOrder.tax || 0)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Delivery Charge:</span>
                  <span>৳{invoiceOrder.deliveryCharge || (invoiceOrder.deliveryRegion === 'inside' ? 70 : 130)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-emerald-950 border-t border-zinc-900 pt-1 mt-1">
                  <span>TOTAL DUE:</span>
                  <span>{formatPrice(invoiceOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Signature & Barcode footer */}
            <div className="border-t-2 border-dashed border-zinc-300 pt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <div>
                <p className="font-bold text-zinc-800">Verified by Dispatch Officer</p>
                <p>Dhaka Jersey Vault Warehouse</p>
              </div>
              <div className="text-right">
                <span className="tracking-widest font-bold text-xs text-zinc-900 block">||| | |||| | |||||| | ||</span>
                <span>*{invoiceOrder.id}*</span>
              </div>
            </div>

          </div>
        </div>
      )}

        </div>
      </div>
    </section>
  );
};
