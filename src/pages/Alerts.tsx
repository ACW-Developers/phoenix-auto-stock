import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Package, Bell, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageLoader, LoadingSpinner } from "@/components/LoadingSpinner";
import { dataService } from "@/lib/dataService";

interface StockAlert {
  id: string;
  alert_level: string;
  message: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
  created_at: string;
  product_id: string;
  shop_id: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface Shop {
  id: string;
  name: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertsData, productsData, shopsData] = await Promise.all([
        dataService.getAlerts(),
        dataService.getProducts(),
        dataService.getShops()
      ]);
      setAlerts(alertsData as StockAlert[]);
      setProducts(productsData as Product[]);
      setShops(shopsData as Shop[]);
    } catch (error: any) {
      toast.error("Failed to load alerts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || "Unknown Product";
  };

  const getProductSku = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.sku || "";
  };

  const getShopName = (shopId: string) => {
    const shop = shops.find(s => s.id === shopId);
    return shop?.name || "Unknown Shop";
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await dataService.acknowledgeAlert(alertId);
      toast.success("Alert acknowledged");
      loadData();
    } catch (error: any) {
      toast.error("Failed to acknowledge alert");
      console.error(error);
    }
  };

  const getAlertVariant = (level: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (level) {
      case "critical":
        return "destructive";
      case "low":
        return "default";
      case "adequate":
        return "secondary";
      default:
        return "default";
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "low":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Package className="h-5 w-5 text-primary" />;
    }
  };

  const getBorderColor = (level: string) => {
    switch (level) {
      case "critical":
        return "border-l-destructive";
      case "low":
        return "border-l-warning";
      default:
        return "border-l-primary";
    }
  };

  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged);
  const criticalCount = activeAlerts.filter(a => a.alert_level === 'critical').length;
  const lowCount = activeAlerts.filter(a => a.alert_level === 'low').length;

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader text="Loading alerts..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Stock Alerts</h2>
          <p className="text-muted-foreground">
            Monitor and manage stock level notifications
          </p>
        </div>

        {/* Alert Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-warning">{lowCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold">{activeAlerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Acknowledged</p>
                  <p className="text-2xl font-bold text-success">{acknowledgedAlerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Active Alerts ({activeAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-16 w-16 text-success mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">
                    No active alerts. All stock levels are healthy.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <Card key={alert.id} className={`border-l-4 ${getBorderColor(alert.alert_level)} hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            {getAlertIcon(alert.alert_level)}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold">
                                  {getProductName(alert.product_id)}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {getProductSku(alert.product_id)}
                                </Badge>
                                <Badge variant={getAlertVariant(alert.alert_level)}>
                                  {alert.alert_level.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  {getShopName(alert.shop_id)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(alert.created_at).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="shrink-0"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Acknowledge
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {acknowledgedAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Acknowledged Alerts ({acknowledgedAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {acknowledgedAlerts.slice(0, 10).map((alert) => (
                    <Card key={alert.id} className="opacity-60 hover:opacity-80 transition-opacity">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.alert_level)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm">
                                {getProductName(alert.product_id)}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {getProductSku(alert.product_id)}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Resolved
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {alert.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{getShopName(alert.shop_id)}</span>
                              <span>
                                Acknowledged: {alert.acknowledged_at 
                                  ? new Date(alert.acknowledged_at).toLocaleString()
                                  : new Date(alert.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
