import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, Edit, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageLoader } from "@/components/LoadingSpinner";
import { InventoryAdjustDialog } from "@/components/InventoryAdjustDialog";
import { fetchInventory, initializeSampleData } from "@/lib/dataService";

interface InventoryItem {
  id: string;
  quantity: number;
  reorder_level: number;
  location: string;
  products: {
    name: string;
    sku: string;
    brand: string;
    unit_price: number;
  };
  shops: {
    name: string;
  };
}

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);

  useEffect(() => {
    initializeSampleData();
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await fetchInventory();
      setInventory(data as InventoryItem[]);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", variant: "destructive" as const, color: "text-destructive" };
    } else if (quantity <= reorderLevel * 0.5) {
      return { label: "Critical", variant: "destructive" as const, color: "text-destructive" };
    } else if (quantity <= reorderLevel) {
      return { label: "Low", variant: "default" as const, color: "text-warning" };
    } else if (quantity <= reorderLevel * 2) {
      return { label: "Adequate", variant: "secondary" as const, color: "text-primary" };
    }
    return { label: "Good", variant: "default" as const, color: "text-success" };
  };

  const handleAdjust = (item: InventoryItem) => {
    setSelectedInventory(item);
    setAdjustDialogOpen(true);
  };

  const filteredInventory = inventory.filter((item) =>
    item.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.products?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.products?.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = inventory.filter((item) => item.quantity <= item.reorder_level).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Inventory</h2>
            <p className="text-muted-foreground">
              Manage your stock levels across all locations
            </p>
          </div>
          {lowStockCount > 0 && (
            <Badge variant="destructive" className="text-sm py-1 px-3">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {lowStockCount} items need attention
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name, SKU, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <PageLoader text="Loading inventory..." />
            ) : filteredInventory.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No products found matching your search" : "No inventory items yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item.quantity, item.reorder_level);
                  return (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{item.products?.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {item.products?.sku}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Brand: {item.products?.brand || "N/A"}</span>
                              <span>•</span>
                              <span>Shop: {item.shops?.name}</span>
                              <span>•</span>
                              <span>Location: {item.location || "Not set"}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${status.color}`}>
                                {item.quantity}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Reorder at: {item.reorder_level}
                              </div>
                            </div>
                            <Badge variant={status.variant} className={`min-w-[100px] justify-center ${status.label === "Low" ? "bg-warning text-warning-foreground" : ""}`}>
                              {status.label}
                            </Badge>
                            <div className="text-right min-w-[80px]">
                              <div className="text-lg font-semibold">
                                ${Number(item.products?.unit_price || 0).toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">per unit</div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAdjust(item)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Adjust
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

      {selectedInventory && (
        <InventoryAdjustDialog
          open={adjustDialogOpen}
          onClose={() => setAdjustDialogOpen(false)}
          inventoryId={selectedInventory.id}
          currentQuantity={selectedInventory.quantity}
          currentReorderLevel={selectedInventory.reorder_level}
          productName={selectedInventory.products?.name || "Unknown"}
          onSuccess={loadInventory}
        />
      )}
    </DashboardLayout>
  );
};

export default Inventory;
