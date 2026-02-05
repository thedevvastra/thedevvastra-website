import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, ShoppingBag, Users, Package } from "lucide-react";

interface StatsProps {
  revenue: number;
  orders: number;
  users: number;
  products: number;
}

export function DashboardStats({ data }: { data: StatsProps }) {
  return (
    // ✅ FIX: grid-cols-2 on mobile (instead of 1) for compact view
    <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
          <CardTitle className="text-xs md:text-sm font-medium">
            Revenue
          </CardTitle>
          <IndianRupee className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-lg md:text-2xl font-bold truncate">
            ₹{data.revenue.toLocaleString()}
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
          <CardTitle className="text-xs md:text-sm font-medium">
            Orders
          </CardTitle>
          <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-lg md:text-2xl font-bold">{data.orders}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">
            +15% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
          <CardTitle className="text-xs md:text-sm font-medium">
            Users
          </CardTitle>
          <Users className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-lg md:text-2xl font-bold">{data.users}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">
            +7 new today
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
          <CardTitle className="text-xs md:text-sm font-medium">
            Products
          </CardTitle>
          <Package className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-lg md:text-2xl font-bold">{data.products}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">
            In stock
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
