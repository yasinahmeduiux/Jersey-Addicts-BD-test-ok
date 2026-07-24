import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit, Trash2, Copy, Archive, RotateCcw, Upload, Download, 
  Search, Filter, Layers, Grid, FileText, Check, X, AlertTriangle, 
  Shirt, Tag, Trophy, Star, Sparkles, Image as ImageIcon, CheckCircle, 
  ChevronRight, ArrowUp, ArrowDown, FolderPlus, Eye, ShieldCheck, DollarSign,
  AlertCircle, History, Package, Flame, Flag, Zap, Shield, Activity, Award,
  Box, CornerDownRight, CheckSquare, RefreshCw
} from 'lucide-react';
import { Product, AppConfig, CategoryItem, StockLog } from '../types';

interface ProductManagerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  appConfig: AppConfig;
  onUpdateConfig?: (newConfig: AppConfig) => void;
  setAppConfig?: React.Dispatch<React.SetStateAction<AppConfig>>;
  formatPrice: (amount: number) => string;
}

// Preset Category Icons list
const CATEGORY_ICONS = [
  { id: 'Trophy', label: 'Trophy', icon: Trophy },
  { id: 'Shirt', label: 'Shirt', icon: Shirt },
  { id: 'Star', label: 'Star', icon: Star },
  { id: 'Flame', label: 'Flame', icon: Flame },
  { id: 'Flag', label: 'Flag', icon: Flag },
  { id: 'Zap', label: 'Zap', icon: Zap },
  { id: 'Package', label: 'Package', icon: Package },
  { id: 'Tag', label: 'Tag', icon: Tag },
  { id: 'Shield', label: 'Shield', icon: Shield },
  { id: 'Activity', label: 'Activity', icon: Activity },
  { id: 'Award', label: 'Award', icon: Award },
];

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  setProducts,
  appConfig,
  onUpdateConfig,
  setAppConfig,
  formatPrice,
}) => {
  // Main Navigation Tabs
  const [activeTab, setActiveTab] = useState<'products' | 'inventory' | 'categories' | 'import-export'>('products');
  
  // Product Status Filter
  const [productStatusFilter, setProductStatusFilter] = useState<'Active' | 'Draft' | 'Archived' | 'Trashed'>('Active');
  
  // Inventory Sub-Filter State
  const [inventorySubTab, setInventorySubTab] = useState<'all' | 'low-stock' | 'out-of-stock' | 'clearance' | 'damaged' | 'history'>('all');

  // Search and Category/Page Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPage, setFilterPage] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Dynamically computed list of Storefront pages connected with appConfig
  const storefrontPages = useMemo(() => {
    const list: { id: string; name: string; pageNumber: number; slug: string }[] = [
      { id: 'page-1', name: 'Page 1 (First Page Storefront)', pageNumber: 1, slug: 'home' },
    ];

    const defaultPages = [
      { id: 'World Cup', name: 'World Cup Vault', pageNumber: 1, slug: 'world-cup' },
      { id: 'England', name: 'England Classic', pageNumber: 1, slug: 'england' },
      { id: 'Legends', name: 'Legends Store', pageNumber: 2, slug: 'legends' },
      { id: 'Current Season', name: 'Current Season', pageNumber: 2, slug: 'current-season' },
      { id: 'Mystery', name: 'Mystery Box', pageNumber: 3, slug: 'mystery' },
      { id: 'Clearance', name: 'Clearance Vault', pageNumber: 3, slug: 'clearance' },
      { id: 'Classic', name: 'Club Classic', pageNumber: 4, slug: 'classic' },
    ];

    const configPages = appConfig?.pages || [];
    
    defaultPages.forEach(dp => {
      const matched = configPages.find(p => p.id === dp.id || p.name.toLowerCase() === dp.name.toLowerCase());
      list.push({
        id: dp.id,
        name: matched ? matched.name : dp.name,
        pageNumber: dp.pageNumber,
        slug: dp.slug,
      });
    });

    configPages.forEach(cp => {
      if (!list.some(p => p.id === cp.id || p.name.toLowerCase() === cp.name.toLowerCase())) {
        list.push({
          id: cp.id,
          name: cp.name,
          pageNumber: list.length + 1,
          slug: cp.slug || cp.id.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        });
      }
    });

    return list;
  }, [appConfig?.pages]);

  // Default Categories Pre-populated with User Examples
  const defaultCategories: CategoryItem[] = [
    { id: 'cat-world-cup', name: 'World Cup', slug: 'world-cup', pageNumber: 1, rowOrder: 1, description: 'National team World Cup historic kits', icon: 'Trophy', status: 'Active', bannerImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200' },
    { id: 'cat-epl', name: 'Premier League', slug: 'premier-league', pageNumber: 1, rowOrder: 2, description: 'English Premier League iconic club shirts', icon: 'Shirt', status: 'Active', bannerImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1200' },
    { id: 'cat-laliga', name: 'La Liga', slug: 'la-liga', pageNumber: 2, rowOrder: 1, description: 'Spanish La Liga football club jerseys', icon: 'Flag', status: 'Active' },
    { id: 'cat-seriea', name: 'Serie A', slug: 'serie-a', pageNumber: 2, rowOrder: 2, description: 'Italian Serie A classic vintage kits', icon: 'Shield', status: 'Active' },
    { id: 'cat-bundesliga', name: 'Bundesliga', slug: 'bundesliga', pageNumber: 2, rowOrder: 3, description: 'German Bundesliga authentic releases', icon: 'Award', status: 'Active' },
    { id: 'cat-ligue1', name: 'Ligue 1', slug: 'ligue-1', pageNumber: 3, rowOrder: 1, description: 'French Ligue 1 match issue jerseys', icon: 'Star', status: 'Active' },
    { id: 'cat-retro', name: 'Retro', slug: 'retro', pageNumber: 3, rowOrder: 2, description: 'Rare 80s, 90s & 2000s vintage reissues', icon: 'Flame', status: 'Active' },
    { id: 'cat-training', name: 'Training', slug: 'training', pageNumber: 3, rowOrder: 3, description: 'Pre-match warm up and drill wear', icon: 'Activity', status: 'Active' },
    { id: 'cat-jackets', name: 'Jackets', slug: 'jackets', parentId: 'cat-training', pageNumber: 3, rowOrder: 4, description: 'Anthem & track jackets (Nested under Training)', icon: 'Package', status: 'Active' },
    { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', pageNumber: 4, rowOrder: 1, description: 'Caps, scarves & collectors items', icon: 'Tag', status: 'Active' },
    { id: 'cat-new-in', name: 'New In', slug: 'new-in', pageNumber: 1, rowOrder: 3, description: 'Freshly arrived stock drops & releases', icon: 'Zap', status: 'Active' },
    { id: 'cat-clearance', name: 'Clearance', slug: 'clearance', pageNumber: 4, rowOrder: 2, description: 'Special price clearance sale jerseys', icon: 'Tag', status: 'Active' },
    { id: 'cat-limited-edition', name: 'Limited Edition', slug: 'limited-edition', pageNumber: 1, rowOrder: 4, description: 'Numbered limited run anniversary shirts', icon: 'Star', status: 'Active' },
    { id: 'cat-player-edition', name: 'Player Edition', slug: 'player-edition', pageNumber: 2, rowOrder: 4, description: 'Authentic slim-fit match issue quality', icon: 'Zap', status: 'Active' },
    { id: 'cat-thai-premium', name: 'Thai Premium', slug: 'thai-premium', pageNumber: 3, rowOrder: 5, description: 'High quality Thai 1:1 master grade jerseys', icon: 'Award', status: 'Active' },
  ];

  // Configured Categories List
  const categoryItems: CategoryItem[] = useMemo(() => {
    if (appConfig?.categoryItems && appConfig.categoryItems.length > 0) {
      return appConfig.categoryItems;
    }
    return defaultCategories;
  }, [appConfig?.categoryItems]);

  // Stock Audit Logs
  const stockLogs: StockLog[] = useMemo(() => {
    if (appConfig?.stockLogs && appConfig.stockLogs.length > 0) {
      return appConfig.stockLogs;
    }
    return [
      { id: 'log-1', productId: 'p1', productName: 'England 1998 Home Kit', sku: 'JAB-ENG98-001', previousStock: 5, newStock: 12, change: 7, reason: 'Supplier Receiving', timestamp: '2026-07-22 14:30', user: 'Admin' },
      { id: 'log-2', productId: 'p2', productName: 'Barcelona 2008/09 UCL Final', sku: 'JAB-BAR08-002', previousStock: 3, newStock: 2, change: -1, reason: 'Sale', timestamp: '2026-07-23 09:15', user: 'System' },
      { id: 'log-3', productId: 'p3', productName: 'AC Milan 2006/07 Kaká #22', sku: 'JAB-ACM06-003', previousStock: 2, newStock: 0, change: -2, reason: 'Damaged Write-off', timestamp: '2026-07-23 11:00', user: 'Admin' },
    ];
  }, [appConfig?.stockLogs]);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Quick Stock Adjustment Modal State
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [stockChangeAmount, setStockChangeAmount] = useState<number>(0);
  const [stockReason, setStockReason] = useState<StockLog['reason']>('Manual Adjustment');

  // Category Form State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catParentId, setCatParentId] = useState<string | 'none'>('none');
  const [catPageNum, setCatPageNum] = useState<number>(1);
  const [catRowOrder, setCatRowOrder] = useState<number>(1);
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Shirt');
  const [catBannerImage, setCatBannerImage] = useState('');
  const [catStatus, setCatStatus] = useState<'Active' | 'Inactive'>('Active');

  // Add New Page Quick Modal States
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageNameInput, setNewPageNameInput] = useState('');
  const [newPageSlugInput, setNewPageSlugInput] = useState('');
  const [newPageIconInput, setNewPageIconInput] = useState('Shirt');
  const [newPageShowInMenu, setNewPageShowInMenu] = useState(true);

  // Full Product Form States
  const [pName, setPName] = useState('');
  const [pSlug, setPSlug] = useState('');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pLongDesc, setPLongDesc] = useState('');
  const [pFeatures, setPFeatures] = useState('');
  const [pMaterial, setPMaterial] = useState('100% Recycled Polyester Mesh');
  const [pSeason, setPSeason] = useState('2025/2026');
  const [pYear, setPYear] = useState<number>(2026);
  const [pLeague, setPLeague] = useState('');
  const [pClub, setPClub] = useState('');
  const [pNationalTeam, setPNationalTeam] = useState('');
  const [pPlayerName, setPPlayerName] = useState('');
  const [pPlayerNum, setPPlayerNum] = useState<number | ''>('');
  const [pBrand, setPBrand] = useState('Nike');
  const [pGender, setPGender] = useState<string>('Men');
  const [pCondition, setPCondition] = useState<string>('Mint');
  const [pConditionDetail, setPConditionDetail] = useState('');
  const [pSizes, setPSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [pColor, setPColor] = useState('Red/White');
  const [pSku, setPSku] = useState('');
  const [pCostPrice, setPCostPrice] = useState<number>(1200);
  const [pSellingPrice, setPSellingPrice] = useState<number>(1850);
  const [pDiscount, setPDiscount] = useState<number>(0);
  const [pStock, setPStock] = useState<number>(10);
  const [pLowStockThreshold, setPLowStockThreshold] = useState<number>(3);
  const [pIsClearance, setPIsClearance] = useState<boolean>(false);
  const [pIsDamaged, setPIsDamaged] = useState<boolean>(false);
  const [pDamagedQty, setPDamagedQty] = useState<number>(0);
  const [pDimensions, setPDimensions] = useState('30 x 20 x 3 cm / 250g');
  const [pTargetPage, setPTargetPage] = useState<string>('World Cup Vault');
  const [pPageNumber, setPPageNumber] = useState<number>(1);
  const [pCategoryRow, setPCategoryRow] = useState<number>(1);
  const [pCategory, setPCategory] = useState<string>('World Cup');
  const [pMainImage, setPMainImage] = useState<string>('');
  const [pGallery, setPGallery] = useState<string[]>([]);
  const [pGalleryInput, setPGalleryInput] = useState<string>('');
  const [pStatus, setPStatus] = useState<'Active' | 'Draft' | 'Archived' | 'Trashed'>('Active');

  const updateConfig = (newConfig: AppConfig) => {
    if (onUpdateConfig) {
      onUpdateConfig(newConfig);
    } else if (setAppConfig) {
      setAppConfig(newConfig);
    }
  };

  // Create new custom storefront page & save to config
  const handleCreateNewPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageNameInput.trim()) return;

    const pageName = newPageNameInput.trim();
    const cleanSlug = (newPageSlugInput.trim() || pageName).toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const newCustomPage = {
      id: pageName,
      name: pageName,
      slug: cleanSlug,
      isCustom: true,
      visible: true,
      sections: [...(appConfig?.homepageSections || [])],
    };

    const updatedPages = [...(appConfig?.pages || []), newCustomPage];
    let updatedMenuItems = [...(appConfig?.menuItems || [])];

    if (newPageShowInMenu) {
      updatedMenuItems.push({
        id: `nav-${Date.now()}`,
        name: pageName,
        placement: 'Main Menu',
        order: updatedMenuItems.length + 1,
        url: pageName,
        status: 'Active',
        icon: newPageIconInput || 'Shirt',
      });
    }

    updateConfig({
      ...appConfig,
      pages: updatedPages,
      menuItems: updatedMenuItems,
    });

    setPTargetPage(pageName);
    setIsAddPageModalOpen(false);
    setNewPageNameInput('');
    setNewPageSlugInput('');
  };

  // Reset Product Form
  const resetProductForm = () => {
    setEditingProduct(null);
    setPName('');
    setPSlug('');
    setPShortDesc('');
    setPLongDesc('');
    setPFeatures('Official Patches, Sublimated Sponsor, Vintage Collar');
    setPMaterial('100% Recycled Polyester Mesh');
    setPSeason('2025/2026');
    setPYear(2026);
    setPLeague('Premier League');
    setPClub('Manchester United');
    setPNationalTeam('England');
    setPPlayerName('');
    setPPlayerNum('');
    setPBrand('Nike');
    setPGender('Men');
    setPCondition('Mint');
    setPConditionDetail('Original tags attached. Deadstock pristine condition.');
    setPSizes(['S', 'M', 'L', 'XL']);
    setPColor('Red/White');
    setPSku(`JAB-${Math.floor(1000 + Math.random() * 9000)}`);
    setPCostPrice(1200);
    setPSellingPrice(1850);
    setPDiscount(0);
    setPStock(10);
    setPLowStockThreshold(3);
    setPIsClearance(false);
    setPIsDamaged(false);
    setPDamagedQty(0);
    setPDimensions('30 x 20 x 3 cm / 250g');
    setPTargetPage('World Cup Vault');
    setPPageNumber(1);
    setPCategoryRow(1);
    setPCategory('World Cup');
    setPMainImage('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800');
    setPGallery([]);
    setPGalleryInput('');
    setPStatus('Active');
  };

  // Populate Product Form for Edit
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setPName(product.name || '');
    setPSlug(product.slug || '');
    setPShortDesc(product.shortDescription || product.description || '');
    setPLongDesc(product.longDescription || product.description || '');
    setPFeatures(Array.isArray(product.features) ? product.features.join(', ') : (product.features || ''));
    setPMaterial(product.material || product.specification?.material || '100% Polyester');
    setPSeason(product.season || '');
    setPYear(product.year || 2026);
    setPLeague(product.league || '');
    setPClub(product.club || '');
    setPNationalTeam(product.nationalTeam || product.country || '');
    setPPlayerName(product.player?.name || '');
    setPPlayerNum(product.player?.number || '');
    setPBrand(product.brand || 'Nike');
    setPGender(product.gender || 'Men');
    setPCondition(product.condition || 'Mint');
    setPConditionDetail(product.conditionDetail || '');
    setPSizes(product.sizes || ['S', 'M', 'L', 'XL']);
    setPColor(product.color || '');
    setPSku(product.sku || '');
    setPCostPrice(product.costPrice || Math.round((product.price || 1500) * 0.65));
    setPSellingPrice(product.sellingPrice || product.price || 0);
    setPDiscount(product.discount || 0);
    setPStock(product.stock || 0);
    setPLowStockThreshold(product.lowStockThreshold || 3);
    setPIsClearance(product.isClearance || false);
    setPIsDamaged(product.isDamaged || false);
    setPDamagedQty(product.damagedQty || 0);
    setPDimensions(product.dimensions || '30 x 20 x 3 cm / 250g');
    const initialTargetPage = product.targetPage || product.pageName || (product.pageNumber === 1 ? 'Page 1 (First Page Storefront)' : product.category || 'World Cup Vault');
    setPTargetPage(initialTargetPage);
    setPPageNumber(product.pageNumber || 1);
    setPCategoryRow(product.categoryRow || 1);
    setPCategory(product.category || 'World Cup');
    setPMainImage(product.uploadedImage || product.image || '');
    setPGallery(product.gallery || product.images || []);
    setPGalleryInput('');
    setPStatus((product.status as any) || (product.isTrashed ? 'Trashed' : product.isArchived ? 'Archived' : 'Active'));
    setIsProductModalOpen(true);
  };

  // Submit Product Form (Add / Edit)
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pBrand) {
      alert('Please fill in required fields (Name & Brand).');
      return;
    }

    const calculatedPrice = pSellingPrice > 0 ? pSellingPrice : 1000;
    const finalSlug = pSlug.trim() ? pSlug.trim() : pName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const featuresArr = pFeatures ? pFeatures.split(',').map(f => f.trim()).filter(Boolean) : [];
    const selectedPageObj = storefrontPages.find(p => p.name === pTargetPage || p.id === pTargetPage);
    const resolvedPageNum = selectedPageObj ? selectedPageObj.pageNumber : (Number(pPageNumber) || 1);

    const updatedProduct: Product = {
      id: editingProduct ? editingProduct.id : `shirt-${Date.now()}`,
      name: pName,
      slug: finalSlug,
      shortDescription: pShortDesc,
      longDescription: pLongDesc,
      description: pShortDesc || pLongDesc || `${pBrand} ${pName} - ${pSeason}`,
      features: featuresArr,
      material: pMaterial,
      season: pSeason,
      year: Number(pYear) || 2026,
      league: pLeague,
      club: pClub,
      country: pNationalTeam,
      nationalTeam: pNationalTeam,
      player: pPlayerName ? { name: pPlayerName, number: Number(pPlayerNum) || 10 } : undefined,
      brand: pBrand,
      gender: pGender,
      condition: pCondition as any,
      conditionDetail: pConditionDetail,
      sizes: pSizes,
      color: pColor,
      sku: pSku || `JAB-${Math.floor(1000 + Math.random() * 9000)}`,
      costPrice: pCostPrice,
      sellingPrice: calculatedPrice,
      price: calculatedPrice,
      originalPrice: pDiscount > 0 ? calculatedPrice + pDiscount : undefined,
      discount: pDiscount,
      stock: Number(pStock) || 0,
      lowStockThreshold: Number(pLowStockThreshold) || 3,
      isClearance: pIsClearance,
      isDamaged: pIsDamaged,
      damagedQty: Number(pDamagedQty) || 0,
      dimensions: pDimensions,
      category: pCategory,
      targetPage: pTargetPage,
      pageName: selectedPageObj ? selectedPageObj.name : pTargetPage,
      pageNumber: resolvedPageNum,
      categoryRow: Number(pCategoryRow) || 1,
      image: pMainImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
      images: pGallery.length > 0 ? pGallery : [pMainImage],
      gallery: pGallery,
      uploadedImage: pMainImage.startsWith('data:') ? pMainImage : undefined,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 12,
      badgeAvailable: true,
      printAvailable: true,
      specification: {
        material: pMaterial,
        madeIn: 'Bangladesh',
        fit: 'Athlete Aero Standard Fit',
      },
      status: pStatus,
      isArchived: pStatus === 'Archived',
      isTrashed: pStatus === 'Trashed',
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    } else {
      setProducts(prev => [updatedProduct, ...prev]);
    }

    setIsProductModalOpen(false);
    resetProductForm();
  };

  // Duplicate Product
  const handleDuplicateProduct = (product: Product) => {
    const clone: Product = {
      ...product,
      id: `${product.id}-copy-${Date.now()}`,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      slug: `${product.slug}-copy`,
      status: 'Active',
      isArchived: false,
      isTrashed: false,
    };
    setProducts(prev => [clone, ...prev]);
    alert(`Duplicated "${product.name}" successfully!`);
  };

  // Archive / Unarchive Product
  const handleToggleArchive = (product: Product) => {
    const newStatus = product.status === 'Archived' || product.isArchived ? 'Active' : 'Archived';
    setProducts(prev => prev.map(p => p.id === product.id ? {
      ...p,
      status: newStatus,
      isArchived: newStatus === 'Archived',
      isTrashed: false,
    } : p));
  };

  // Trash Product
  const handleTrashProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? {
      ...p,
      status: 'Trashed',
      isTrashed: true,
      isArchived: false,
    } : p));
  };

  // Restore Product
  const handleRestoreProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? {
      ...p,
      status: 'Active',
      isTrashed: false,
      isArchived: false,
    } : p));
  };

  // Permanent Delete
  const handlePermanentDelete = (id: string) => {
    if (confirm('Are you sure you want to PERMANENTLY delete this shirt? This cannot be undone.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Stock Adjustment Handler
  const handleConfirmStockAdjust = () => {
    if (!stockModalProduct || stockChangeAmount === 0) return;

    const prevStock = stockModalProduct.stock;
    const newStock = Math.max(0, prevStock + stockChangeAmount);

    // Update Product Stock
    setProducts(prev => prev.map(p => p.id === stockModalProduct.id ? { ...p, stock: newStock } : p));

    // Append Stock Log entry
    const newLog: StockLog = {
      id: `log-${Date.now()}`,
      productId: stockModalProduct.id,
      productName: stockModalProduct.name,
      sku: stockModalProduct.sku,
      previousStock: prevStock,
      newStock: newStock,
      change: stockChangeAmount,
      reason: stockReason,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: 'Admin Backend'
    };

    updateConfig({
      ...appConfig,
      stockLogs: [newLog, ...stockLogs]
    });

    setIsStockModalOpen(false);
    setStockModalProduct(null);
    setStockChangeAmount(0);
  };

  // Category Save Handler
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCat: CategoryItem = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: catName.trim(),
      slug: catSlug.trim() ? catSlug.trim() : catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      parentId: catParentId === 'none' ? null : catParentId,
      pageNumber: Number(catPageNum) || 1,
      rowOrder: Number(catRowOrder) || 1,
      description: catDesc,
      icon: catIcon,
      bannerImage: catBannerImage,
      status: catStatus,
    };

    let updatedCats: CategoryItem[];
    if (editingCategory) {
      updatedCats = categoryItems.map(c => c.id === editingCategory.id ? newCat : c);
    } else {
      updatedCats = [...categoryItems, newCat];
    }

    updateConfig({ ...appConfig, categoryItems: updatedCats });
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatParentId('none');
    setCatDesc('');
    setCatBannerImage('');
  };

  // Delete Category
  const handleDeleteCategory = (catId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const updated = categoryItems.filter(c => c.id !== catId);
      updateConfig({ ...appConfig, categoryItems: updated });
    }
  };

  const handleMoveCategoryRow = (catId: string, direction: 'up' | 'down') => {
    const updated = categoryItems.map(c => {
      if (c.id === catId) {
        const nextRow = direction === 'up' ? Math.max(1, c.rowOrder - 1) : c.rowOrder + 1;
        return { ...c, rowOrder: nextRow };
      }
      return c;
    });
    updateConfig({ ...appConfig, categoryItems: updated });
  };

  // Bulk Export JSON / CSV
  const handleExportData = (type: 'json' | 'csv') => {
    if (type === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `jersey_vault_products_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // CSV Export
      const headers = ['id', 'name', 'sku', 'brand', 'season', 'category', 'pageNumber', 'categoryRow', 'costPrice', 'price', 'stock', 'status'];
      const rows = products.map(p => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.sku,
        p.brand,
        p.season,
        p.category,
        p.pageNumber || 1,
        p.categoryRow || 1,
        p.costPrice || 0,
        p.price,
        p.stock,
        p.status || 'Active'
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", encodeURI(csvContent));
      downloadAnchor.setAttribute("download", `jersey_vault_products_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  // Bulk Import
  const handleProcessImport = () => {
    try {
      if (!importText.trim()) return;
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        setProducts(prev => [...parsed, ...prev]);
        setImportStatus(`Successfully imported ${parsed.length} products!`);
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportText('');
          setImportStatus(null);
        }, 1200);
      } else {
        setImportStatus('Invalid JSON format. Must be an array of product objects.');
      }
    } catch (err: any) {
      setImportStatus(`Parse error: ${err.message}`);
    }
  };

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Status Filter
      const status = p.status || (p.isTrashed ? 'Trashed' : p.isArchived ? 'Archived' : 'Active');
      if (status !== productStatusFilter) return false;

      // Page Filter
      if (filterPage !== 'All') {
        const filterLower = String(filterPage).toLowerCase().trim();
        const pageMatches =
          p.targetPage?.toLowerCase().trim() === filterLower ||
          p.pageName?.toLowerCase().trim() === filterLower ||
          p.category?.toLowerCase().trim() === filterLower ||
          (p.pageNumber && String(p.pageNumber) === filterLower) ||
          (filterLower === '1' && (p.pageNumber === 1 || !p.pageNumber));
        if (!pageMatches) return false;
      }

      // Category Filter
      if (filterCategory !== 'All' && p.category?.toLowerCase() !== filterCategory.toLowerCase()) return false;

      // Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku?.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        const matchesPlayer = p.player?.name.toLowerCase().includes(q);
        return matchesName || matchesSku || matchesBrand || matchesCategory || matchesPlayer;
      }

      return true;
    });
  }, [products, productStatusFilter, filterPage, filterCategory, searchTerm]);

  // Inventory Filtered Products
  const inventoryProducts = useMemo(() => {
    return products.filter(p => {
      const isNotTrashed = !p.isTrashed && p.status !== 'Trashed';
      if (!isNotTrashed) return false;

      if (inventorySubTab === 'low-stock') {
        const threshold = p.lowStockThreshold || 3;
        return p.stock > 0 && p.stock <= threshold;
      }
      if (inventorySubTab === 'out-of-stock') {
        return p.stock === 0;
      }
      if (inventorySubTab === 'clearance') {
        return p.isClearance || (p.discount && p.discount > 0);
      }
      if (inventorySubTab === 'damaged') {
        return p.isDamaged || (p.damagedQty && p.damagedQty > 0);
      }
      return true;
    });
  }, [products, inventorySubTab]);

  // Inventory Metrics
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 3) && !p.isTrashed).length;
  const outOfStockCount = products.filter(p => p.stock === 0 && !p.isTrashed).length;
  const clearanceCount = products.filter(p => (p.isClearance || (p.discount && p.discount > 0)) && !p.isTrashed).length;
  const damagedCount = products.filter(p => (p.isDamaged || (p.damagedQty && p.damagedQty > 0)) && !p.isTrashed).length;

  // Statistics
  const activeCount = products.filter(p => (!p.status || p.status === 'Active') && !p.isArchived && !p.isTrashed).length;
  const draftCount = products.filter(p => p.status === 'Draft').length;
  const archivedCount = products.filter(p => p.status === 'Archived' || p.isArchived).length;
  const trashedCount = products.filter(p => p.status === 'Trashed' || p.isTrashed).length;

  return (
    <div className="space-y-6">
      
      {/* Header Deck */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-100 pb-4">
        <div>
          <h3 className="text-base font-bold uppercase text-emerald-950 flex items-center gap-2">
            <Shirt className="text-emerald-800" size={18} />
            PRODUCT & CATALOGUE MANAGEMENT
          </h3>
          <p className="text-[11px] text-emerald-700 font-mono">
            Full control over products, stock alerts, damaged/clearance items, stock history, nested categories, and page row placement.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              resetProductForm();
              setIsProductModalOpen(true);
            }}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload size={14} />
            <span>Bulk Import</span>
          </button>

          <button
            type="button"
            onClick={() => handleExportData('json')}
            className="bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Bulk Export</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-emerald-200 gap-4 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'products' ? 'border-emerald-800 text-emerald-900' : 'border-transparent text-emerald-600 hover:text-emerald-900'
          }`}
        >
          <Grid size={15} />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory' ? 'border-emerald-800 text-emerald-900' : 'border-transparent text-emerald-600 hover:text-emerald-900'
          }`}
        >
          <Box size={15} />
          <span>Inventory Management</span>
          {lowStockCount + outOfStockCount > 0 && (
            <span className="bg-rose-600 text-white font-mono text-[9px] px-1.5 py-0.2 rounded-full">
              {lowStockCount + outOfStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'categories' ? 'border-emerald-800 text-emerald-900' : 'border-transparent text-emerald-600 hover:text-emerald-900'
          }`}
        >
          <Layers size={15} />
          <span>Categories & Nested Rows ({categoryItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('import-export')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'import-export' ? 'border-emerald-800 text-emerald-900' : 'border-transparent text-emerald-600 hover:text-emerald-900'
          }`}
        >
          <FileText size={15} />
          <span>Data Import / Export</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          
          {/* Status Sub-Filters & Quick Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProductStatusFilter('Active')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  productStatusFilter === 'Active' ? 'bg-emerald-800 text-white shadow-sm' : 'bg-white text-emerald-900 border hover:bg-emerald-100'
                }`}
              >
                Active ({activeCount})
              </button>

              <button
                type="button"
                onClick={() => setProductStatusFilter('Draft')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  productStatusFilter === 'Draft' ? 'bg-emerald-800 text-white shadow-sm' : 'bg-white text-emerald-900 border hover:bg-emerald-100'
                }`}
              >
                Drafts ({draftCount})
              </button>

              <button
                type="button"
                onClick={() => setProductStatusFilter('Archived')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  productStatusFilter === 'Archived' ? 'bg-emerald-800 text-white shadow-sm' : 'bg-white text-emerald-900 border hover:bg-emerald-100'
                }`}
              >
                Archived ({archivedCount})
              </button>

              <button
                type="button"
                onClick={() => setProductStatusFilter('Trashed')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  productStatusFilter === 'Trashed' ? 'bg-rose-800 text-white shadow-sm' : 'bg-white text-rose-900 border border-rose-200 hover:bg-rose-50'
                }`}
              >
                Trash ({trashedCount})
              </button>
            </div>

            {/* Page & Category Filter Pickers */}
            <div className="flex items-center gap-2 text-xs">
              <label className="font-bold text-emerald-950 flex items-center gap-1">
                <span>Page:</span>
                <select
                  value={filterPage}
                  onChange={(e) => setFilterPage(e.target.value)}
                  className="bg-white border border-emerald-200 rounded-lg px-2 py-1 font-semibold text-xs text-emerald-950 outline-none max-w-[200px] truncate"
                >
                  <option value="All">All Connected Pages</option>
                  {storefrontPages.map(pg => (
                    <option key={pg.id} value={pg.name}>{pg.name}</option>
                  ))}
                </select>
              </label>

              <label className="font-bold text-emerald-950 flex items-center gap-1">
                <span>Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white border border-emerald-200 rounded-lg px-2 py-1 font-semibold text-xs text-emerald-950 outline-none"
                >
                  <option value="All">All Categories</option>
                  {categoryItems.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
            <input
              type="text"
              placeholder="Search by Product Name, SKU, Brand, League, Player Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-emerald-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-emerald-950 font-medium placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Product Table Grid */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-50/80 border-b border-emerald-100 text-emerald-900 font-bold uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Product / Thumbnail</th>
                    <th className="p-3">Page & Category Row</th>
                    <th className="p-3">Brand & Season</th>
                    <th className="p-3">SKU / Code</th>
                    <th className="p-3">Cost vs Selling Price</th>
                    <th className="p-3">Stock & Tags</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100/80">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-emerald-50/30 transition-colors">
                        {/* Thumbnail & Name */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              <img src={prod.uploadedImage || prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              {prod.gallery && prod.gallery.length > 0 && (
                                <span className="absolute bottom-0 right-0 bg-emerald-900 text-white font-mono text-[8px] font-bold px-1 rounded-tl">
                                  +{prod.gallery.length}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-emerald-950 max-w-[220px] truncate">{prod.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded">
                                  {prod.condition || 'Mint'}
                                </span>
                                {prod.gender && (
                                  <span className="bg-gray-100 text-gray-800 text-[9px] font-mono px-1.5 py-0.2 rounded">
                                    {prod.gender}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Page & Category Row */}
                        <td className="p-3 font-mono text-[11px]">
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-950 bg-emerald-100/80 px-2 py-0.5 rounded text-[10px] inline-block border border-emerald-200">
                              {prod.targetPage || prod.pageName || `Page ${prod.pageNumber || 1}`}
                            </span>
                            <p className="text-[10px] text-emerald-700 font-sans font-semibold mt-0.5">
                              {prod.category || 'World Cup'} • Row {prod.categoryRow || 1}
                            </p>
                          </div>
                        </td>

                        {/* Brand & Season */}
                        <td className="p-3 font-medium">
                          <p className="font-bold text-emerald-950">{prod.brand}</p>
                          <p className="text-[10px] text-emerald-700">{prod.season} ({prod.year})</p>
                        </td>

                        {/* SKU */}
                        <td className="p-3 font-mono text-[10px] font-bold text-emerald-800">
                          {prod.sku || 'N/A'}
                        </td>

                        {/* Pricing */}
                        <td className="p-3">
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <p className="font-bold text-emerald-950">{formatPrice(prod.price)}</p>
                            {prod.costPrice ? (
                              <p className="text-[10px] text-emerald-600">Cost: {formatPrice(prod.costPrice)}</p>
                            ) : null}
                          </div>
                        </td>

                        {/* Stock & Tags */}
                        <td className="p-3">
                          <div className="space-y-1">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] inline-block ${
                              prod.stock > (prod.lowStockThreshold || 3) ? 'bg-emerald-100 text-emerald-900' :
                              prod.stock > 0 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                            }`}>
                              {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock'}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {prod.isClearance && (
                                <span className="bg-purple-100 text-purple-900 text-[8px] font-bold px-1 rounded">Clearance</span>
                              )}
                              {prod.isDamaged && (
                                <span className="bg-rose-100 text-rose-900 text-[8px] font-bold px-1 rounded">Damaged ({prod.damagedQty || 1})</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {productStatusFilter === 'Trashed' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRestoreProduct(prod)}
                                  className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer"
                                  title="Restore to Active"
                                >
                                  <RotateCcw size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePermanentDelete(prod.id)}
                                  className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-all cursor-pointer"
                                  title="Delete Permanently"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(prod)}
                                  className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit size={14} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDuplicateProduct(prod)}
                                  className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer"
                                  title="Duplicate Product"
                                >
                                  <Copy size={14} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleArchive(prod)}
                                  className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer"
                                  title={prod.status === 'Archived' ? 'Unarchive' : 'Archive Product'}
                                >
                                  <Archive size={14} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleTrashProduct(prod)}
                                  className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-all cursor-pointer"
                                  title="Move to Trash"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-emerald-600 font-medium">
                        No products found in this category or search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Inventory Metrics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm space-y-1">
              <p className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Total In-Stock Units</p>
              <p className="text-xl font-extrabold text-emerald-950 font-mono">{totalStockUnits}</p>
            </div>

            <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl shadow-sm space-y-1">
              <p className="text-[10px] font-mono text-amber-800 font-bold uppercase flex items-center gap-1">
                <AlertTriangle size={12} /> Low Stock Alert
              </p>
              <p className="text-xl font-extrabold text-amber-950 font-mono">{lowStockCount} items</p>
            </div>

            <div className="bg-rose-50/50 border border-rose-200 p-4 rounded-2xl shadow-sm space-y-1">
              <p className="text-[10px] font-mono text-rose-800 font-bold uppercase flex items-center gap-1">
                <AlertCircle size={12} /> Out of Stock
              </p>
              <p className="text-xl font-extrabold text-rose-950 font-mono">{outOfStockCount} items</p>
            </div>

            <div className="bg-purple-50/50 border border-purple-200 p-4 rounded-2xl shadow-sm space-y-1">
              <p className="text-[10px] font-mono text-purple-800 font-bold uppercase flex items-center gap-1">
                <Tag size={12} /> Clearance Stock
              </p>
              <p className="text-xl font-extrabold text-purple-950 font-mono">{clearanceCount} items</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl shadow-sm space-y-1">
              <p className="text-[10px] font-mono text-gray-800 font-bold uppercase flex items-center gap-1">
                <ShieldCheck size={12} /> Damaged / Write-off
              </p>
              <p className="text-xl font-extrabold text-gray-950 font-mono">{damagedCount} items</p>
            </div>
          </div>

          {/* Sub-Tabs for Inventory Filters */}
          <div className="flex border-b border-emerald-100 gap-2 text-xs font-bold overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setInventorySubTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                inventorySubTab === 'all' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              Current Stock ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setInventorySubTab('low-stock')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                inventorySubTab === 'low-stock' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Low Stock Alerts ({lowStockCount})
            </button>

            <button
              type="button"
              onClick={() => setInventorySubTab('out-of-stock')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                inventorySubTab === 'out-of-stock' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>

            <button
              type="button"
              onClick={() => setInventorySubTab('clearance')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                inventorySubTab === 'clearance' ? 'bg-purple-800 text-white' : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              Clearance Products ({clearanceCount})
            </button>

            <button
              type="button"
              onClick={() => setInventorySubTab('damaged')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                inventorySubTab === 'damaged' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              Damaged / Write-off ({damagedCount})
            </button>

            <button
              type="button"
              onClick={() => setInventorySubTab('history')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                inventorySubTab === 'history' ? 'bg-emerald-950 text-white' : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <History size={13} />
              <span>Stock History Log ({stockLogs.length})</span>
            </button>
          </div>

          {/* INVENTORY TABLE OR STOCK HISTORY LOG TABLE */}
          {inventorySubTab !== 'history' ? (
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-50/80 border-b border-emerald-100 text-emerald-900 font-bold uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Alert Threshold</th>
                      <th className="p-3">Clearance / Damaged Status</th>
                      <th className="p-3 text-right">Quick Stock Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100/80">
                    {inventoryProducts.length > 0 ? (
                      inventoryProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={p.uploadedImage || p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-emerald-100" />
                              <div>
                                <p className="font-bold text-emerald-950">{p.name}</p>
                                <p className="text-[10px] text-emerald-700">{p.brand} • {p.category}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-3 font-mono text-emerald-800 font-bold">
                            {p.sku}
                          </td>

                          <td className="p-3 font-mono font-extrabold text-sm">
                            <span className={`px-2.5 py-1 rounded-lg ${
                              p.stock > (p.lowStockThreshold || 3) ? 'bg-emerald-100 text-emerald-950' :
                              p.stock > 0 ? 'bg-amber-100 text-amber-950' : 'bg-rose-100 text-rose-950'
                            }`}>
                              {p.stock} units
                            </span>
                          </td>

                          <td className="p-3 font-mono text-emerald-700">
                            ≤ {p.lowStockThreshold || 3} units
                          </td>

                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {p.isClearance ? (
                                <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  Clearance Sale
                                </span>
                              ) : <span className="text-[10px] text-emerald-600 font-mono">Standard Stock</span>}
                              {p.isDamaged && (
                                <span className="bg-rose-100 text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  Damaged Qty: {p.damagedQty || 1}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setStockModalProduct(p);
                                setStockChangeAmount(1);
                                setStockReason('Supplier Receiving');
                                setIsStockModalOpen(true);
                              }}
                              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <RefreshCw size={13} />
                              <span>Adjust Stock</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-emerald-600 font-medium">
                          No inventory items match this stock status filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* STOCK HISTORY AUDIT LOG TABLE */
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden space-y-3 p-4">
              <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                <h4 className="font-bold text-xs text-emerald-950 uppercase flex items-center gap-1.5">
                  <History size={15} className="text-emerald-800" />
                  CHRONOLOGICAL STOCK MOVEMENT AUDIT TRAIL
                </h4>
                <span className="text-[10px] font-mono text-emerald-700">Auto-recorded restocks & deductions</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-emerald-50/80 text-emerald-900 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Date & Time</th>
                      <th className="p-2.5">Product Name</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5">Previous Qty</th>
                      <th className="p-2.5">Adjustment</th>
                      <th className="p-2.5">New Qty</th>
                      <th className="p-2.5">Reason</th>
                      <th className="p-2.5">Updated By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {stockLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-emerald-50/40">
                        <td className="p-2.5 text-emerald-800">{log.timestamp}</td>
                        <td className="p-2.5 font-bold font-sans text-emerald-950">{log.productName}</td>
                        <td className="p-2.5 text-emerald-700">{log.sku}</td>
                        <td className="p-2.5 text-gray-600">{log.previousStock}</td>
                        <td className="p-2.5 font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            log.change > 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                          }`}>
                            {log.change > 0 ? `+${log.change}` : log.change}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-emerald-950">{log.newStock}</td>
                        <td className="p-2.5 font-sans font-semibold text-emerald-900">{log.reason}</td>
                        <td className="p-2.5 text-emerald-700">{log.user || 'System'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CATEGORIES & NESTED ROWS */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-bold text-emerald-950 uppercase text-xs">PAGE, CATEGORY & NESTED SUB-CATEGORY MANAGEMENT</h4>
              <p className="text-[10px] text-emerald-700 font-mono">
                Create parent/child nested categories with icons, banner graphics, page assignments, and row sequence order.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Load all 15 preset example categories (World Cup, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Retro, Training, Jackets, Accessories, New In, Clearance, Limited Edition, Player Edition, Thai Premium)?')) {
                    updateConfig({ ...appConfig, categoryItems: defaultCategories });
                    alert('✓ Successfully loaded all 15 preset categories with live instant store persistence!');
                  }
                }}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="Load all 15 preset example categories"
              >
                <RefreshCw size={14} />
                <span>Load 15 Preset Categories</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCatName('');
                  setCatSlug('');
                  setCatParentId('none');
                  setCatPageNum(1);
                  setCatRowOrder(1);
                  setCatDesc('');
                  setCatBannerImage('');
                  setIsCategoryModalOpen(true);
                }}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <FolderPlus size={15} />
                <span>Create Category</span>
              </button>
            </div>
          </div>

          {/* Group Categories by Connected Front Page */}
          {storefrontPages.map((page) => {
            const pageCats = categoryItems
              .filter(c => c.pageNumber === page.pageNumber || c.pageName === page.name || c.targetPage === page.name)
              .sort((a, b) => a.rowOrder - b.rowOrder);

            if (pageCats.length === 0 && page.pageNumber > 4) return null;

            return (
              <div key={page.id} className="bg-white rounded-2xl border border-emerald-100 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-800 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      PAGE {page.pageNumber}
                    </span>
                    <h5 className="font-bold text-xs text-emerald-950 uppercase">
                      {page.name}
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700">
                    {pageCats.length} Categories in Rows
                  </span>
                </div>

                <div className="space-y-3">
                  {pageCats.length > 0 ? (
                    pageCats.map((cat) => {
                      const prodsInCat = products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase());
                      const isChild = !!cat.parentId;
                      const parentCat = categoryItems.find(c => c.id === cat.parentId);
                      const IconComponent = CATEGORY_ICONS.find(i => i.id === cat.icon)?.icon || Shirt;

                      return (
                        <div 
                          key={cat.id} 
                          className={`border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                            isChild ? 'bg-emerald-50/20 border-emerald-200 ml-6 md:ml-10 border-l-4 border-l-emerald-600' : 'bg-white border-emerald-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-emerald-100 text-emerald-800 font-mono text-xs font-black rounded-lg">
                              ROW {cat.rowOrder}
                            </span>

                            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center flex-shrink-0">
                              <IconComponent size={18} />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                {isChild && <CornerDownRight size={14} className="text-emerald-600" />}
                                <p className="font-bold text-xs text-emerald-950">{cat.name}</p>
                                {isChild && parentCat && (
                                  <span className="bg-emerald-100 text-emerald-900 text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold">
                                    Subcategory of {parentCat.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-emerald-700">{cat.description || 'No description provided'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block">
                                  {prodsInCat.length} Linked Shirts
                                </span>
                                {cat.bannerImage && (
                                  <span className="text-[9px] font-mono text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 inline-block">
                                    ✓ Custom Banner Uploaded
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => handleMoveCategoryRow(cat.id, 'up')}
                              className="p-1.5 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-800 rounded-lg cursor-pointer"
                              title="Move Row Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveCategoryRow(cat.id, 'down')}
                              className="p-1.5 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-800 rounded-lg cursor-pointer"
                              title="Move Row Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(cat);
                                setCatName(cat.name);
                                setCatSlug(cat.slug);
                                setCatParentId(cat.parentId || 'none');
                                setCatPageNum(cat.pageNumber);
                                setCatRowOrder(cat.rowOrder);
                                setCatDesc(cat.description || '');
                                setCatIcon(cat.icon || 'Shirt');
                                setCatBannerImage(cat.bannerImage || '');
                                setCatStatus(cat.status || 'Active');
                                setIsCategoryModalOpen(true);
                              }}
                              className="p-1.5 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-emerald-500 font-medium py-3 italic text-center">
                      No categories assigned to {page.name} yet. Click "Create Category" to add one.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: IMPORT / EXPORT DATA */}
      {activeTab === 'import-export' && (
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 space-y-6">
          <div>
            <h4 className="font-bold text-xs text-emerald-950 uppercase">PRODUCT BULK EXPORT & BACKUP TOOLS</h4>
            <p className="text-[10px] text-emerald-700 font-mono">
              Export entire catalog state or restore products from external CSV / JSON files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/40 p-5 rounded-xl border border-emerald-100 space-y-3">
              <h5 className="font-bold text-xs text-emerald-950 flex items-center gap-2">
                <Download size={16} className="text-emerald-800" />
                Download Catalog JSON
              </h5>
              <p className="text-[11px] text-emerald-700">Full backup including images, gallery, specifications, and row ordering.</p>
              <button
                type="button"
                onClick={() => handleExportData('json')}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Download JSON Backup
              </button>
            </div>

            <div className="bg-emerald-50/40 p-5 rounded-xl border border-emerald-100 space-y-3">
              <h5 className="font-bold text-xs text-emerald-950 flex items-center gap-2">
                <Download size={16} className="text-emerald-800" />
                Download Catalog CSV
              </h5>
              <p className="text-[11px] text-emerald-700">Spreadsheet-friendly format for Microsoft Excel or Google Sheets.</p>
              <button
                type="button"
                onClick={() => handleExportData('csv')}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Download CSV Spreadsheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-emerald-100 shadow-2xl p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto text-emerald-950">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-4">
              <div>
                <h4 className="text-sm font-extrabold uppercase text-emerald-950 flex items-center gap-2">
                  <Shirt size={18} className="text-emerald-800" />
                  {editingProduct ? 'Edit Jersey Product Details' : 'Add New Authentic Jersey Product'}
                </h4>
                <p className="text-[10px] text-emerald-700 font-mono">Configure all product fields, sports attributes, prices, gallery & layout position.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-6">
              
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-4">
                <h5 className="text-xs font-mono font-bold uppercase text-emerald-800 border-b border-emerald-100 pb-1">
                  1. Basic Product Identity
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="font-bold text-emerald-950 block mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. England 1998 World Cup Home Shirt"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">SKU / Barcode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JAB-ENG98-001"
                      value={pSku}
                      onChange={(e) => setPSku(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nike / Adidas / Umbro / Puma"
                      value={pBrand}
                      onChange={(e) => setPBrand(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">Season</label>
                    <input
                      type="text"
                      placeholder="e.g. 1998/99 or 2025/26"
                      value={pSeason}
                      onChange={(e) => setPSeason(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">Gender</label>
                    <select
                      value={pGender}
                      onChange={(e) => setPGender(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-medium"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">Short Description</label>
                    <input
                      type="text"
                      placeholder="Brief headline summary"
                      value={pShortDesc}
                      onChange={(e) => setPShortDesc(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">Key Features (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Official Patches, Vintage Collar, Sublimated Sponsor"
                      value={pFeatures}
                      onChange={(e) => setPFeatures(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PAGE ASSIGNMENT, CATEGORY & ROW POSITION */}
              <div className="space-y-4">
                <h5 className="text-xs font-mono font-bold uppercase text-emerald-800 border-b border-emerald-100 pb-1">
                  2. Page Assignment, Category & Row Position
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-emerald-950 block">Target Page *</label>
                      <button
                        type="button"
                        onClick={() => setIsAddPageModalOpen(true)}
                        className="text-[10px] font-mono font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add New Page
                      </button>
                    </div>
                    <select
                      value={pTargetPage}
                      onChange={(e) => {
                        if (e.target.value === 'ADD_NEW') {
                          setIsAddPageModalOpen(true);
                        } else {
                          setPTargetPage(e.target.value);
                          const matchedPg = storefrontPages.find(p => p.name === e.target.value || p.id === e.target.value);
                          if (matchedPg) setPPageNumber(matchedPg.pageNumber);
                        }
                      }}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-bold text-emerald-950"
                    >
                      {storefrontPages.map((pg) => (
                        <option key={pg.id} value={pg.name}>
                          {pg.name}
                        </option>
                      ))}
                      <option value="ADD_NEW" className="font-bold text-emerald-800">+ Add New Page...</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">Category *</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-bold"
                    >
                      {categoryItems.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">Row Order Position</label>
                    <input
                      type="number"
                      min={1}
                      value={pCategoryRow}
                      onChange={(e) => setPCategoryRow(Number(e.target.value))}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: INVENTORY, PRICING & STOCK ALERTS */}
              <div className="space-y-4">
                <h5 className="text-xs font-mono font-bold uppercase text-emerald-800 border-b border-emerald-100 pb-1">
                  3. Inventory, Pricing & Stock Alerts
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <label className="font-bold text-emerald-950 block mb-1 font-sans">Selling Price *</label>
                    <input
                      type="number"
                      required
                      value={pSellingPrice}
                      onChange={(e) => setPSellingPrice(Number(e.target.value))}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1 font-sans">Cost Price</label>
                    <input
                      type="number"
                      value={pCostPrice}
                      onChange={(e) => setPCostPrice(Number(e.target.value))}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1 font-sans">Discount Amount</label>
                    <input
                      type="number"
                      value={pDiscount}
                      onChange={(e) => setPDiscount(Number(e.target.value))}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-emerald-950 block mb-1 font-sans">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={pStock}
                      onChange={(e) => setPStock(Number(e.target.value))}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-emerald-950 block mb-1">Low Stock Alert Threshold</label>
                    <input
                      type="number"
                      value={pLowStockThreshold}
                      onChange={(e) => setPLowStockThreshold(Number(e.target.value))}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="clearanceCheck"
                      checked={pIsClearance}
                      onChange={(e) => setPIsClearance(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <label htmlFor="clearanceCheck" className="font-bold text-emerald-950 cursor-pointer">
                      Tag as Clearance Product
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="damagedCheck"
                      checked={pIsDamaged}
                      onChange={(e) => setPIsDamaged(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <label htmlFor="damagedCheck" className="font-bold text-emerald-950 cursor-pointer">
                      Tag as Damaged Stock
                    </label>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md cursor-pointer"
                >
                  Save Jersey Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-emerald-100 shadow-2xl p-6 space-y-5 text-emerald-950">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
              <h4 className="text-xs font-extrabold uppercase text-emerald-950 flex items-center gap-2">
                <FolderPlus size={16} className="text-emerald-800" />
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h4>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 hover:bg-emerald-50 text-emerald-800 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-emerald-950 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. World Cup or Jackets"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-emerald-950 block mb-1">Nested Parent Category</label>
                  <select
                    value={catParentId}
                    onChange={(e) => setCatParentId(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                  >
                    <option value="none">None (Top Level Category)</option>
                    {categoryItems.filter(c => c.id !== editingCategory?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-emerald-950 block mb-1">Category Icon</label>
                  <select
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                  >
                    {CATEGORY_ICONS.map(i => (
                      <option key={i.id} value={i.id}>{i.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-emerald-950 block mb-1">Target Page Assignment *</label>
                  <select
                    value={catPageNum}
                    onChange={(e) => setCatPageNum(Number(e.target.value))}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-bold"
                  >
                    {storefrontPages.map((pg) => (
                      <option key={pg.id} value={pg.pageNumber}>
                        {pg.name} (Page {pg.pageNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-emerald-950 block mb-1">Row Sequence Order</label>
                  <input
                    type="number"
                    value={catRowOrder}
                    onChange={(e) => setCatRowOrder(Number(e.target.value))}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-emerald-950 block mb-1">Category Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={catBannerImage}
                  onChange={(e) => setCatBannerImage(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-950 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Category description..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUICK STOCK ADJUSTMENT */}
      {isStockModalOpen && stockModalProduct && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-emerald-100 shadow-2xl p-6 space-y-4 text-emerald-950">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
              <h4 className="text-xs font-extrabold uppercase text-emerald-950 flex items-center gap-2">
                <Box size={16} className="text-emerald-800" />
                Quick Stock Adjustment
              </h4>
              <button
                type="button"
                onClick={() => setIsStockModalOpen(false)}
                className="p-1 hover:bg-emerald-50 text-emerald-800 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50/60 p-3 rounded-xl">
                <p className="font-bold text-emerald-950">{stockModalProduct.name}</p>
                <p className="text-[10px] text-emerald-700 font-mono">SKU: {stockModalProduct.sku} • Current Stock: {stockModalProduct.stock}</p>
              </div>

              <div>
                <label className="font-bold block mb-1">Adjustment Quantity (+ / -)</label>
                <input
                  type="number"
                  value={stockChangeAmount}
                  onChange={(e) => setStockChangeAmount(Number(e.target.value))}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-mono font-bold text-sm"
                />
                <p className="text-[10px] text-emerald-600 mt-1 font-mono">
                  New calculated stock: <strong className="text-emerald-950">{Math.max(0, stockModalProduct.stock + stockChangeAmount)}</strong>
                </p>
              </div>

              <div>
                <label className="font-bold block mb-1">Reason for Adjustment</label>
                <select
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value as any)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="Supplier Receiving">Supplier Receiving (Restock)</option>
                  <option value="Initial Restock">Initial Restock</option>
                  <option value="Manual Adjustment">Manual Adjustment</option>
                  <option value="Damaged Write-off">Damaged Write-off</option>
                  <option value="Sale">Sale / Order Fulfilled</option>
                  <option value="Customer Return">Customer Return</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStockAdjust}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl cursor-pointer"
                >
                  Confirm Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BULK IMPORT */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-100 shadow-2xl p-6 space-y-4 text-emerald-950">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
              <h4 className="text-xs font-extrabold uppercase text-emerald-950 flex items-center gap-2">
                <Upload size={16} className="text-emerald-800" />
                Bulk Import Products (JSON)
              </h4>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 hover:bg-emerald-50 text-emerald-800 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-emerald-700">Paste your JSON array of product objects below to import in bulk:</p>
              <textarea
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='[ { "name": "Shirt", "price": 1850, "sku": "JAB-001", "brand": "Nike", "category": "World Cup", "stock": 10 } ]'
                className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl p-3 font-mono text-[11px]"
              />

              {importStatus && (
                <p className={`p-2 rounded-lg font-bold text-[11px] ${
                  importStatus.includes('Successfully') ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }`}>
                  {importStatus}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl cursor-pointer"
                >
                  Import Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PAGE QUICK MODAL */}
      {isAddPageModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] animate-fadeIn">
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-2xl w-full max-w-md p-6 space-y-5 text-emerald-950">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <FolderPlus size={18} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm text-emerald-950">Add New Storefront Page</h4>
                  <p className="text-[10px] text-emerald-700 font-mono">Connect products directly to new front page sections</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPageModalOpen(false)}
                className="p-1.5 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewPage} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1 text-emerald-950">Page Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Champions League Vault"
                  value={newPageNameInput}
                  onChange={(e) => {
                    setNewPageNameInput(e.target.value);
                    if (!newPageSlugInput) {
                      setNewPageSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                    }
                  }}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl p-3 font-semibold text-emerald-950"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-emerald-950">URL Slug / Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. champions-league"
                  value={newPageSlugInput}
                  onChange={(e) => setNewPageSlugInput(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl p-3 font-mono text-emerald-950"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-emerald-950">Header Icon</label>
                <select
                  value={newPageIconInput}
                  onChange={(e) => setNewPageIconInput(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl p-3 font-semibold"
                >
                  {CATEGORY_ICONS.map((i) => (
                    <option key={i.id} value={i.id}>{i.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="showInMenu"
                  checked={newPageShowInMenu}
                  onChange={(e) => setNewPageShowInMenu(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
                />
                <label htmlFor="showInMenu" className="font-bold text-emerald-900 cursor-pointer">
                  Publish to Main Storefront Navigation Bar
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setIsAddPageModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold uppercase tracking-wider cursor-pointer"
                >
                  Save & Connect Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
