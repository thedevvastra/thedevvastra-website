import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentSales({ orders }: { orders: any[] }) {
  return (
    <div className="space-y-6">
      {orders.length === 0 && (
        <p className="text-sm text-muted-foreground">No recent orders found.</p>
      )}

      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-8 w-8 md:h-9 md:w-9 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {order.user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 overflow-hidden">
              <p className="text-xs md:text-sm font-medium leading-none truncate pr-2">
                {order.user?.fullName || "Guest User"}
              </p>
              {/* ✅ FIX: Truncate email on mobile */}
              <p className="text-[10px] md:text-xs text-muted-foreground truncate max-w-[120px] md:max-w-none">
                {order.user?.email || "No email"}
              </p>
            </div>
          </div>
          <div className="font-medium text-xs md:text-sm shrink-0 whitespace-nowrap">
            +₹{order.totalAmount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
