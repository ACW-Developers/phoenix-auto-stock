import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, AlertTriangle, TrendingUp, ShoppingCart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { PageLoader } from "@/components/LoadingSpinner";
import { fetchDashboardStats, fetchAlerts, fetchSales, initializeSampleData } from "@/lib/dataService";
import { format } from "date-fns";

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  criticalStockItems: number;
  todaySales: number;
  totalRevenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    criticalStockItems: 0,
    todaySales: 0,
    totalRevenue: 0,
  });
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSampleData();
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, alertsData, salesData] = await Promise.all([
        fetchDashboardStats(),
        fetchAlerts(),
        fetchSales(),
      ]);
      setStats(statsData);
      setRecentAlerts(alertsData.filter((a: any) => !a.acknowledged).slice(0, 5));
      setRecentSales(salesData.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Today's Sales",
      value: stats.todaySales,
      icon: ShoppingCart,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Revenue Today",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Critical Stock",
      value: stats.criticalStockItems,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Phoenix Auto Parts Inventory Management
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-3">
                    <Package className="h-6 w-6 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All stock levels are healthy!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {alert.products?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.shops?.name}
                        </p>
                      </div>
                      <Badge
                        variant={alert.alert_level === "critical" ? "destructive" : "default"}
                        className={alert.alert_level === "low" ? "bg-warning text-warning-foreground" : ""}
                      >
                        {alert.alert_level}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                Recent Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentSales.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No recent sales
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {sale.customer_name || "Walk-in Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(sale.created_at), "MMM d, h:mm a")} • {sale.shops?.name}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-success">
                        ${Number(sale.total_amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Today's Sales Count</p>
                <p className="text-2xl font-bold">{stats.todaySales}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Average Sale</p>
                <p className="text-2xl font-bold">
                  ${stats.todaySales > 0 ? (stats.totalRevenue / stats.todaySales).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
