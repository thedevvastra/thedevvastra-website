import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardStats } from "./actions";
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { OverviewChart } from "@/components/admin/dashboard/overview-chart";
import { RecentSales } from "@/components/admin/dashboard/recent-sales";
import { StatusPieChart } from "@/components/admin/dashboard/status-pie-chart";
import { DateFilter } from "@/components/admin/dashboard/date-filter";
import { Loader2 } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  // ✅ FIX 1: Type ko Promise banana padega
  searchParams: Promise<{ range?: string }>;
}) {
  // ✅ FIX 2: searchParams ko await karna padega
  const resolvedParams = await searchParams;
  const range = resolvedParams.range || "7d";

  const stats = await getDashboardStats(range);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6 max-w-[1600px] mx-auto overflow-hidden">
      {/* 1. HEADER & FILTER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1 hidden md:block">
            Track your store performance and sales analytics.
          </p>
        </div>
        {/* Date Filter */}
        <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <DateFilter />
        </div>
      </div>

      {/* 2. KEY METRICS */}
      <DashboardStats
        data={{
          revenue: stats.revenue,
          orders: stats.ordersCount,
          users: stats.usersCount,
          products: stats.productsCount,
        }}
      />

      {/* 3. CHARTS ROW */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Main Area Chart (Revenue) */}
        <Card className="col-span-1 lg:col-span-4 border-none shadow-md bg-gradient-to-br from-card to-muted/20 overflow-hidden">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">
              Revenue Trends
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Comparing sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pr-2 md:pl-2">
            <Suspense
              fallback={
                <div className="h-[250px] md:h-[350px] flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              }
            >
              <OverviewChart data={stats.graphData} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Pie Chart (Order Status) */}
        <Card className="col-span-1 lg:col-span-3 border-none shadow-md overflow-hidden">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Order Status</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Breakdown of statuses.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <StatusPieChart data={stats.pieData} />
          </CardContent>
        </Card>
      </div>

      {/* 4. RECENT ORDERS */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">
            Recent Transactions
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Latest orders placed by customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <RecentSales orders={stats.recentOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
