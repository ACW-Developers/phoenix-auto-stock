import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Search, Mail, Phone, MapPin, Plus, Edit, Trash2, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { SupplierDialog } from "@/components/SupplierDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageLoader, LoadingSpinner } from "@/components/LoadingSpinner";
import { dataService } from "@/lib/dataService";
import { Badge } from "@/components/ui/badge";

interface Supplier {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  notes: string | null;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  supplier_id: string | null;
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedSupplierForOrder, setSelectedSupplierForOrder] = useState<Supplier | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [suppliersData, productsData] = await Promise.all([
        dataService.getSuppliers(),
        dataService.getProducts()
      ]);
      setSuppliers(suppliersData as Supplier[]);
      setProducts(productsData as Product[]);
    } catch (error: any) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;

    try {
      await dataService.deleteSupplier(supplierToDelete);
      toast.success("Supplier deleted successfully");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete supplier");
    } finally {
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  const handleOrderStock = (supplier: Supplier) => {
    setSelectedSupplierForOrder(supplier);
    setOrderDialogOpen(true);
  };

  const getSupplierProducts = (supplierId: string) => {
    return products.filter(p => p.supplier_id === supplierId);
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader text="Loading suppliers..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Suppliers</h2>
            <p className="text-muted-foreground">Manage your supplier network and order stock</p>
          </div>
          <Button onClick={() => { setSelectedSupplier(undefined); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Suppliers</p>
                  <p className="text-2xl font-bold">{suppliers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Package className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products Supplied</p>
                  <p className="text-2xl font-bold">{products.filter(p => p.supplier_id).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <ShoppingCart className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Partners</p>
                  <p className="text-2xl font-bold">{suppliers.filter(s => getSupplierProducts(s.id).length > 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers by name or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No suppliers found matching your search" : "No suppliers yet"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSuppliers.map((supplier) => {
                  const supplierProducts = getSupplierProducts(supplier.id);
                  return (
                    <Card key={supplier.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-start justify-between">
                              <h3 className="font-heading font-semibold text-lg mb-1">
                                {supplier.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {supplierProducts.length} products
                              </Badge>
                            </div>
                            {supplier.contact_person && (
                              <p className="text-sm text-muted-foreground">
                                Contact: {supplier.contact_person}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 text-sm">
                            {supplier.email && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4 shrink-0" />
                                <a
                                  href={`mailto:${supplier.email}`}
                                  className="hover:text-primary transition-colors truncate"
                                >
                                  {supplier.email}
                                </a>
                              </div>
                            )}
                            {supplier.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4 shrink-0" />
                                <a
                                  href={`tel:${supplier.phone}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {supplier.phone}
                                </a>
                              </div>
                            )}
                            {(supplier.address || supplier.city || supplier.state) && (
                              <div className="flex items-start gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                  {supplier.address && <div>{supplier.address}</div>}
                                  {(supplier.city || supplier.state) && (
                                    <div>
                                      {supplier.city}
                                      {supplier.city && supplier.state && ", "}
                                      {supplier.state} {supplier.zip_code}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {supplier.notes && (
                            <div className="pt-2 border-t">
                              <p className="text-xs text-muted-foreground italic line-clamp-2">
                                {supplier.notes}
                              </p>
                            </div>
                          )}

                          {/* Products list */}
                          {supplierProducts.length > 0 && (
                            <div className="pt-2 border-t">
                              <p className="text-xs font-medium text-muted-foreground mb-2">Supplies:</p>
                              <div className="flex flex-wrap gap-1">
                                {supplierProducts.slice(0, 3).map(p => (
                                  <Badge key={p.id} variant="secondary" className="text-xs">
                                    {p.name}
                                  </Badge>
                                ))}
                                {supplierProducts.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{supplierProducts.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="flex-1"
                              onClick={() => handleOrderStock(supplier)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Order Stock
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(supplier)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSupplierToDelete(supplier.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SupplierDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        supplier={selectedSupplier}
        onSuccess={loadData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently delete this supplier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order Stock Dialog */}
      <OrderStockDialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        supplier={selectedSupplierForOrder}
        products={products.filter(p => p.supplier_id === selectedSupplierForOrder?.id)}
        onSuccess={loadData}
      />
    </DashboardLayout>
  );
};

// Order Stock Dialog Component
interface OrderStockDialogProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  products: Product[];
  onSuccess: () => void;
}

const OrderStockDialog = ({ open, onClose, supplier, products, onSuccess }: OrderStockDialogProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(50);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || !selectedProduct) return;

    setLoading(true);
    try {
      await dataService.createReorderRequest({
        supplier_id: supplier.id,
        product_id: selectedProduct,
        quantity,
        notes,
        status: 'pending'
      });
      toast.success("Stock order created successfully!");
      onSuccess();
      onClose();
      setSelectedProduct("");
      setQuantity(50);
      setNotes("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Order Stock from {supplier?.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Create a reorder request for products from this supplier.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
              required
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit" disabled={loading || !selectedProduct}>
              {loading ? <LoadingSpinner size="sm" /> : "Create Order"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Suppliers;
