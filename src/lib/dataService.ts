// Data service with localStorage fallback for demo mode
import { supabase } from "@/integrations/supabase/client";
import {
  sampleCategories,
  sampleSuppliers,
  sampleProducts,
  sampleShops,
  generateInventory,
  generateSampleAlerts,
  generateSampleSales,
  generateReorderRequests,
} from "./sampleData";

const STORAGE_KEYS = {
  categories: "autoparts_categories",
  suppliers: "autoparts_suppliers",
  products: "autoparts_products",
  shops: "autoparts_shops",
  inventory: "autoparts_inventory",
  alerts: "autoparts_alerts",
  sales: "autoparts_sales",
  saleItems: "autoparts_sale_items",
  reorderRequests: "autoparts_reorder_requests",
  initialized: "autoparts_initialized",
};

// Initialize localStorage with sample data
export const initializeSampleData = () => {
  if (localStorage.getItem(STORAGE_KEYS.initialized)) return;

  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(sampleCategories));
  localStorage.setItem(STORAGE_KEYS.suppliers, JSON.stringify(sampleSuppliers));
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(sampleProducts));
  localStorage.setItem(STORAGE_KEYS.shops, JSON.stringify(sampleShops));
  localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(generateInventory()));
  localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(generateSampleAlerts()));
  
  const { sales, saleItems } = generateSampleSales();
  localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
  localStorage.setItem(STORAGE_KEYS.saleItems, JSON.stringify(saleItems));
  localStorage.setItem(STORAGE_KEYS.reorderRequests, JSON.stringify(generateReorderRequests()));
  localStorage.setItem(STORAGE_KEYS.initialized, "true");
};

// Generic localStorage helpers
const getFromStorage = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Categories
export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (e) {
    console.log("Using localStorage for categories");
  }
  return getFromStorage(STORAGE_KEYS.categories);
};

export const createCategory = async (category: { name: string; description: string }) => {
  try {
    const { data, error } = await supabase.from("categories").insert([category]).select().single();
    if (error) throw error;
    return data;
  } catch {
    const categories = getFromStorage(STORAGE_KEYS.categories);
    const newCategory = { ...category, id: `cat-${Date.now()}`, created_at: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.categories, [...categories, newCategory]);
    return newCategory;
  }
};

export const updateCategory = async (id: string, category: { name: string; description: string }) => {
  try {
    const { error } = await supabase.from("categories").update(category).eq("id", id);
    if (error) throw error;
  } catch {
    const categories = getFromStorage(STORAGE_KEYS.categories);
    saveToStorage(STORAGE_KEYS.categories, categories.map((c: any) => c.id === id ? { ...c, ...category } : c));
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  } catch {
    const categories = getFromStorage(STORAGE_KEYS.categories);
    saveToStorage(STORAGE_KEYS.categories, categories.filter((c: any) => c.id !== id));
  }
};

// Suppliers
export const fetchSuppliers = async () => {
  try {
    const { data, error } = await supabase.from("suppliers").select("*").order("name");
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (e) {
    console.log("Using localStorage for suppliers");
  }
  return getFromStorage(STORAGE_KEYS.suppliers);
};

export const createSupplier = async (supplier: any) => {
  try {
    const { data, error } = await supabase.from("suppliers").insert([supplier]).select().single();
    if (error) throw error;
    return data;
  } catch {
    const suppliers = getFromStorage(STORAGE_KEYS.suppliers);
    const newSupplier = { ...supplier, id: `sup-${Date.now()}`, created_at: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.suppliers, [...suppliers, newSupplier]);
    return newSupplier;
  }
};

export const updateSupplier = async (id: string, supplier: any) => {
  try {
    const { error } = await supabase.from("suppliers").update(supplier).eq("id", id);
    if (error) throw error;
  } catch {
    const suppliers = getFromStorage(STORAGE_KEYS.suppliers);
    saveToStorage(STORAGE_KEYS.suppliers, suppliers.map((s: any) => s.id === id ? { ...s, ...supplier } : s));
  }
};

export const deleteSupplier = async (id: string) => {
  try {
    const { error } = await supabase.from("suppliers").delete().eq("id", id);
    if (error) throw error;
  } catch {
    const suppliers = getFromStorage(STORAGE_KEYS.suppliers);
    saveToStorage(STORAGE_KEYS.suppliers, suppliers.filter((s: any) => s.id !== id));
  }
};

// Products
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`*, categories (name), suppliers (name)`)
      .order("name");
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (e) {
    console.log("Using localStorage for products");
  }
  
  const products = getFromStorage<any>(STORAGE_KEYS.products);
  const categories = getFromStorage<any>(STORAGE_KEYS.categories);
  const suppliers = getFromStorage<any>(STORAGE_KEYS.suppliers);
  
  return products.map((p: any) => ({
    ...p,
    categories: categories.find((c: any) => c.id === p.category_id) || null,
    suppliers: suppliers.find((s: any) => s.id === p.supplier_id) || null,
  }));
};

export const createProduct = async (product: any) => {
  try {
    const { data, error } = await supabase.from("products").insert([product]).select().single();
    if (error) throw error;
    return data;
  } catch {
    const products = getFromStorage(STORAGE_KEYS.products);
    const newProduct = { ...product, id: `prod-${Date.now()}`, created_at: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.products, [...products, newProduct]);
    return newProduct;
  }
};

export const updateProduct = async (id: string, product: any) => {
  try {
    const { error } = await supabase.from("products").update(product).eq("id", id);
    if (error) throw error;
  } catch {
    const products = getFromStorage(STORAGE_KEYS.products);
    saveToStorage(STORAGE_KEYS.products, products.map((p: any) => p.id === id ? { ...p, ...product } : p));
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  } catch {
    const products = getFromStorage(STORAGE_KEYS.products);
    saveToStorage(STORAGE_KEYS.products, products.filter((p: any) => p.id !== id));
  }
};

// Shops
export const fetchShops = async () => {
  try {
    const { data, error } = await supabase.from("shops").select("*").order("name");
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (e) {
    console.log("Using localStorage for shops");
  }
  return getFromStorage(STORAGE_KEYS.shops);
};

// Inventory
export const fetchInventory = async () => {
  try {
    const { data, error } = await supabase
      .from("inventory")
      .select(`*, products (name, sku, brand, unit_price), shops (name)`)
      .order("quantity", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (e) {
    console.log("Using localStorage for inventory");
  }
  
  const inventory = getFromStorage<any>(STORAGE_KEYS.inventory);
  const products = getFromStorage<any>(STORAGE_KEYS.products);
  const shops = getFromStorage<any>(STORAGE_KEYS.shops);
  
  return inventory.map((i: any) => ({
    ...i,
    products: products.find((p: any) => p.id === i.product_id) || { name: 'Unknown', sku: 'N/A', brand: 'N/A', unit_price: 0 },
    shops: shops.find((s: any) => s.id === i.shop_id) || { name: 'Unknown' },
  }));
};

export const updateInventory = async (id: string, updates: any) => {
  try {
    const { error } = await supabase.from("inventory").update(updates).eq("id", id);
    if (error) throw error;
  } catch {
    const inventory = getFromStorage(STORAGE_KEYS.inventory);
    saveToStorage(STORAGE_KEYS.inventory, inventory.map((i: any) => i.id === id ? { ...i, ...updates } : i));
  }
};

// Alerts
export const fetchAlerts = async () => {
  try {
    const { data, error } = await supabase
      .from("stock_alerts")
      .select(`*, products (name, sku), shops (name)`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (e) {
    console.log("Using localStorage for alerts");
  }
  
  const alerts = getFromStorage<any>(STORAGE_KEYS.alerts);
  const products = getFromStorage<any>(STORAGE_KEYS.products);
  const shops = getFromStorage<any>(STORAGE_KEYS.shops);
  
  return alerts.map((a: any) => ({
    ...a,
    products: products.find((p: any) => p.id === a.product_id) || { name: 'Unknown', sku: 'N/A' },
    shops: shops.find((s: any) => s.id === a.shop_id) || { name: 'Unknown' },
  }));
};

export const acknowledgeAlert = async (id: string) => {
  try {
    const { error } = await supabase
      .from("stock_alerts")
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  } catch {
    const alerts = getFromStorage(STORAGE_KEYS.alerts);
    saveToStorage(STORAGE_KEYS.alerts, alerts.map((a: any) => 
      a.id === id ? { ...a, acknowledged: true, acknowledged_at: new Date().toISOString() } : a
    ));
  }
};

// Sales
export const fetchSales = async () => {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select(`*, shops (name)`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (e) {
    console.log("Using localStorage for sales");
  }
  
  const sales = getFromStorage<any>(STORAGE_KEYS.sales);
  const shops = getFromStorage<any>(STORAGE_KEYS.shops);
  
  return sales.map((s: any) => ({
    ...s,
    shops: shops.find((shop: any) => shop.id === s.shop_id) || { name: 'Unknown' },
  }));
};

export const createSale = async (sale: any, items: any[]) => {
  try {
    const { data: saleData, error: saleError } = await supabase.from("sales").insert([sale]).select().single();
    if (saleError) throw saleError;
    
    const saleItems = items.map((item) => ({ ...item, sale_id: saleData.id }));
    const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);
    if (itemsError) throw itemsError;
    
    return saleData;
  } catch {
    const sales = getFromStorage<any>(STORAGE_KEYS.sales);
    const existingItems = getFromStorage<any>(STORAGE_KEYS.saleItems);
    const newSale = { ...sale, id: `sale-${Date.now()}`, created_at: new Date().toISOString() };
    const newItems = items.map((item, index) => ({ ...item, id: `item-${newSale.id}-${index}`, sale_id: newSale.id }));
    
    saveToStorage(STORAGE_KEYS.sales, [...sales, newSale]);
    saveToStorage(STORAGE_KEYS.saleItems, [...existingItems, ...newItems]);
    
    // Update inventory
    const inventory = getFromStorage<any>(STORAGE_KEYS.inventory);
    items.forEach((item) => {
      const invItem = inventory.find((i: any) => i.product_id === item.product_id && i.shop_id === sale.shop_id);
      if (invItem) {
        invItem.quantity = Math.max(0, invItem.quantity - item.quantity);
      }
    });
    saveToStorage(STORAGE_KEYS.inventory, inventory);
    
    return newSale;
  }
};

// Reorder Requests
export const fetchReorderRequests = async () => {
  try {
    const { data, error } = await supabase
      .from("reorder_requests")
      .select(`*, products (name, sku), suppliers (name), shops (name)`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (e) {
    console.log("Using localStorage for reorder requests");
  }
  
  const requests = getFromStorage<any>(STORAGE_KEYS.reorderRequests);
  const products = getFromStorage<any>(STORAGE_KEYS.products);
  const suppliers = getFromStorage<any>(STORAGE_KEYS.suppliers);
  const shops = getFromStorage<any>(STORAGE_KEYS.shops);
  
  return requests.map((r: any) => ({
    ...r,
    products: products.find((p: any) => p.id === r.product_id) || { name: 'Unknown', sku: 'N/A' },
    suppliers: suppliers.find((s: any) => s.id === r.supplier_id) || { name: 'Unknown' },
    shops: shops.find((s: any) => s.id === r.shop_id) || { name: 'Unknown' },
  }));
};

export const createReorderRequest = async (request: any) => {
  try {
    const { data, error } = await supabase.from("reorder_requests").insert([request]).select().single();
    if (error) throw error;
    return data;
  } catch {
    const requests = getFromStorage(STORAGE_KEYS.reorderRequests);
    const newRequest = { ...request, id: `reorder-${Date.now()}`, created_at: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.reorderRequests, [...requests, newRequest]);
    return newRequest;
  }
};

export const updateReorderRequest = async (id: string, updates: any) => {
  try {
    const { error } = await supabase.from("reorder_requests").update(updates).eq("id", id);
    if (error) throw error;
  } catch {
    const requests = getFromStorage(STORAGE_KEYS.reorderRequests);
    saveToStorage(STORAGE_KEYS.reorderRequests, requests.map((r: any) => r.id === id ? { ...r, ...updates } : r));
    
    // If received, update inventory
    if (updates.status === 'received') {
      const request = requests.find((r: any) => r.id === id) as any;
      if (request) {
        const inventory = getFromStorage<any>(STORAGE_KEYS.inventory);
        const invItem = inventory.find((i: any) => 
          i.product_id === request.product_id && i.shop_id === request.shop_id
        );
        if (invItem) {
          invItem.quantity += request.quantity;
          invItem.last_restocked = new Date().toISOString();
        }
        saveToStorage(STORAGE_KEYS.inventory, inventory);
      }
    }
  }
};

// Dashboard Stats
export const fetchDashboardStats = async () => {
  try {
    const { count: productsCount } = await supabase.from("products").select("*", { count: "exact", head: true });
    const { data: alerts } = await supabase.from("stock_alerts").select("alert_level").eq("acknowledged", false);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todaySalesData } = await supabase.from("sales").select("total_amount").gte("created_at", today.toISOString());
    
    if (productsCount !== null && alerts && todaySalesData) {
      return {
        totalProducts: productsCount,
        lowStockItems: alerts.filter((a) => a.alert_level === "low").length,
        criticalStockItems: alerts.filter((a) => a.alert_level === "critical").length,
        todaySales: todaySalesData.length,
        totalRevenue: todaySalesData.reduce((sum, sale) => sum + Number(sale.total_amount), 0),
      };
    }
  } catch (e) {
    console.log("Using localStorage for dashboard stats");
  }
  
  const products = getFromStorage(STORAGE_KEYS.products);
  const alerts = getFromStorage<any>(STORAGE_KEYS.alerts).filter((a: any) => !a.acknowledged);
  const sales = getFromStorage<any>(STORAGE_KEYS.sales);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySales = sales.filter((s: any) => new Date(s.created_at) >= today);
  
  return {
    totalProducts: products.length,
    lowStockItems: alerts.filter((a: any) => a.alert_level === "low").length,
    criticalStockItems: alerts.filter((a: any) => a.alert_level === "critical").length,
    todaySales: todaySales.length,
    totalRevenue: todaySales.reduce((sum: number, sale: any) => sum + Number(sale.total_amount), 0),
  };
};

// Consolidated data service object for easier imports
export const dataService = {
  // Categories
  getCategories: fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Suppliers
  getSuppliers: fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  
  // Products
  getProducts: fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Shops
  getShops: fetchShops,
  
  // Inventory
  getInventory: fetchInventory,
  updateInventory,
  
  // Alerts
  getAlerts: fetchAlerts,
  acknowledgeAlert,
  
  // Sales
  getSales: fetchSales,
  createSale,
  
  // Reorder Requests
  getReorderRequests: fetchReorderRequests,
  createReorderRequest,
  updateReorderRequest,
  
  // Dashboard
  getDashboardStats: fetchDashboardStats,
  
  // Initialization
  initializeSampleData,
};
