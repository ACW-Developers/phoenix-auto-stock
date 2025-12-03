import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageLoader } from "@/components/LoadingSpinner";
import { Package, Plus, Clock, Truck, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { 
  fetchReorderRequests, 
  createReorderRequest, 
  updateReorderRequest,
  fetchProducts,
  fetchSuppliers,
  fetchShops,
  initializeSampleData 
} from "@/lib/dataService";
import { format } from "date-fns";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-warning text-warning-foreground" },
  ordered: { label: "Ordered", icon: Truck, color: "bg-primary text-primary-foreground" },
  received: { label: "Received", icon: CheckCircle, color: "bg-success text-success-foreground" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-destructive text-destructive-foreground" },
};

const Reorders = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    product_id: "",
    supplier_id: "",
    shop_id: "",
    quantity: 10,
    notes: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    initializeSampleData();
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [requestsData, productsData, suppliersData, shopsData] = await Promise.all([
        fetchReorderRequests(),
        fetchProducts(),
        fetchSuppliers(),
        fetchShops(),
      ]);
      setRequests(requestsData);
      setProducts(productsData);
      setSuppliers(suppliersData);
      setShops(shopsData);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setFormData({
      ...formData,
      product_id: productId,
      supplier_id: product?.supplier_id || product?.suppliers?.id || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || !formData.supplier_id || !formData.shop_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setProcessing(true);
    try {
      await createReorderRequest({
        ...formData,
        status: "pending",
        requested_by: "demo-user",
      });
      toast.success("Reorder request created successfully!");
      setDialogOpen(false);
      setFormData({ product_id: "", supplier_id: "", shop_id: "", quantity: 10, notes: "" });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create reorder request");
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === "ordered") {
        updates.ordered_date = new Date().toISOString();
        updates.expected_date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
      } else if (newStatus === "received") {
        updates.received_date = new Date().toISOString();
      }
      
      await updateReorderRequest(id, updates);
      
      const statusMessages = {
        ordered: "Order has been placed with supplier!",
        received: "Stock received and inventory updated!",
        cancelled: "Reorder request cancelled",
      };
      
      toast.success(statusMessages[newStatus as keyof typeof statusMessages] || "Status updated");
      loadData();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const filteredRequests = requests.filter((r) => 
    statusFilter === "all" || r.status === statusFilter
  );

  const getNextStatus = (currentStatus: string) => {
    if (currentStatus === "pending") return "ordered";
    if (currentStatus === "ordered") return "received";
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Stock Reorders</h2>
            <p className="text-muted-foreground">Manage purchase orders from suppliers</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Reorder
          </Button>
        </div>

        <div className="flex gap-2">
          {["all", "pending", "ordered", "received", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : statusConfig[status as keyof typeof statusConfig]?.label}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <PageLoader text="Loading reorder requests..." />
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reorder requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => {
                  const StatusIcon = statusConfig[request.status as keyof typeof statusConfig]?.icon || Clock;
                  const nextStatus = getNextStatus(request.status);
                  
                  return (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-heading font-semibold text-lg">
                                {request.products?.name || "Unknown Product"}
                              </h3>
                              <Badge className={statusConfig[request.status as keyof typeof statusConfig]?.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig[request.status as keyof typeof statusConfig]?.label}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Supplier:</span>
                                <p className="font-medium">{request.suppliers?.name}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Shop:</span>
                                <p className="font-medium">{request.shops?.name}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Quantity:</span>
                                <p className="font-medium">{request.quantity} units</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Requested:</span>
                                <p className="font-medium">
                                  {format(new Date(request.created_at), "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>

                            {request.status === "ordered" && request.expected_date && (
                              <p className="text-sm text-primary">
                                Expected delivery: {format(new Date(request.expected_date), "MMM d, yyyy")}
                              </p>
                            )}
                            
                            {request.notes && (
                              <p className="text-sm text-muted-foreground italic mt-2">
                                Note: {request.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {nextStatus && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(request.id, nextStatus)}
                              >
                                {nextStatus === "ordered" ? "Mark Ordered" : "Mark Received"}
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            )}
                            {request.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(request.id, "cancelled")}
                              >
                                Cancel
                              </Button>
                            )}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Reorder Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Product *</Label>
              <Select value={formData.product_id} onValueChange={handleProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Supplier *</Label>
              <Select value={formData.supplier_id} onValueChange={(v) => setFormData({ ...formData, supplier_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Shop *</Label>
              <Select value={formData.shop_id} onValueChange={(v) => setFormData({ ...formData, shop_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shop" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes for this order..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? "Creating..." : "Create Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Reorders;
