"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  updateOrderStatus,
  cancelOrderAdmin,
} from "@/app/(admin)/admin/orders/actions";
import { OrderDetailsDialog } from "./order-details-dialog";
import { CancelOrderDialog } from "@/components/orders/cancel-order-dialog";

interface OrdersTableProps {
  orders: any[];
}

const STATUS_CONFIG: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  "Order Placed": {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Clock,
    label: "New Order",
  },
  Confirmed: {
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: CheckCircle,
    label: "Confirmed",
  },
  Processing: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: LoaderIcon,
    label: "Processing",
  },
  Shipped: {
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Truck,
    label: "Shipped",
  },
  "Out for Delivery": {
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: Truck,
    label: "Out for Delivery",
  },
  Delivered: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    label: "Delivered",
  },
  Cancelled: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    label: "Cancelled",
  },
};

function LoaderIcon(props: any) {
  return <Clock {...props} />;
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return (
        matchesSearch &&
        ["Order Placed", "Confirmed", "Processing"].includes(order.status)
      );
    if (activeTab === "shipped")
      return (
        matchesSearch && ["Shipped", "Out for Delivery"].includes(order.status)
      );
    if (activeTab === "delivered")
      return matchesSearch && order.status === "Delivered";
    if (activeTab === "cancelled")
      return matchesSearch && order.status === "Cancelled";

    return matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const loadingToast = toast.loading("Updating status...");
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) toast.success(`Order marked as ${newStatus}`);
    else toast.error("Failed to update status");
    toast.dismiss(loadingToast);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-5 h-auto p-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search order ID or customer..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[120px]">Order ID</TableHead>
                    <TableHead className="w-[250px]">Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-60 text-center text-muted-foreground"
                      >
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusInfo =
                        STATUS_CONFIG[order.status] ||
                        STATUS_CONFIG["Processing"];
                      const StatusIcon = statusInfo.icon;
                      // Determine cancelled by display text
                      const cancelledByText =
                        order.cancelledBy === "admin" ? "Admin" : "Customer";

                      return (
                        <TableRow
                          key={order.id}
                          className="group hover:bg-muted/5 transition-colors cursor-default"
                        >
                          <TableCell className="font-mono font-medium text-xs">
                            <span className="bg-muted px-2 py-1 rounded-md text-foreground border">
                              {order.displayId}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={order.user?.avatarUrl} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                  {order.user?.fullName
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm text-foreground line-clamp-1">
                                  {order.user?.fullName || "Guest"}
                                </span>
                                <span className="text-[11px] text-muted-foreground line-clamp-1">
                                  {order.user?.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            {/* ✅ Updated Status Badge with Tooltip */}
                            {order.status === "Cancelled" ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className={`font-normal gap-1.5 py-1 pr-3 cursor-help ${statusInfo.color}`}
                                    >
                                      <StatusIcon className="h-3 w-3" />
                                      {statusInfo.label}
                                      {/* Info Icon to indicate detail */}
                                      <Info className="h-3 w-3 ml-1 opacity-70" />
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[200px] bg-foreground text-background">
                                    <div className="space-y-1">
                                      <p className="text-xs font-bold">
                                        Cancelled by {cancelledByText}
                                      </p>
                                      <p className="text-xs opacity-90">
                                        "
                                        {order.cancelReason ||
                                          "No reason provided"}
                                        "
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <Badge
                                variant="outline"
                                className={`font-normal gap-1.5 py-1 pr-3 ${statusInfo.color}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {statusInfo.label}
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                            <br />
                            <span className="text-[10px] opacity-70">
                              {format(new Date(order.createdAt), "hh:mm a")}
                            </span>
                          </TableCell>

                          <TableCell className="font-semibold text-foreground">
                            ₹{order.totalAmount.toLocaleString()}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs font-medium text-muted-foreground uppercase">
                                {order.paymentMethod}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => setViewOrderId(order.id)}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {order.status !== "Cancelled" && (
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                      <Truck className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                                      Update Status
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                      <DropdownMenuRadioGroup
                                        value={order.status}
                                        onValueChange={(val) =>
                                          handleStatusChange(order.id, val)
                                        }
                                      >
                                        {Object.keys(STATUS_CONFIG)
                                          .filter((s) => s !== "Cancelled")
                                          .map((status) => (
                                            <DropdownMenuRadioItem
                                              key={status}
                                              value={status}
                                              className="cursor-pointer"
                                            >
                                              {status}
                                            </DropdownMenuRadioItem>
                                          ))}
                                      </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                )}
                                {order.status !== "Cancelled" &&
                                  order.status !== "Delivered" && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                        onClick={() =>
                                          setCancelOrderId(order.id)
                                        }
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />{" "}
                                        Cancel Order
                                      </DropdownMenuItem>
                                    </>
                                  )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <OrderDetailsDialog
        open={!!viewOrderId}
        onOpenChange={(open) => !open && setViewOrderId(null)}
        orderId={viewOrderId}
      />
      {cancelOrderId && (
        <CancelOrderDialog
          open={!!cancelOrderId}
          onOpenChange={(open) => !open && setCancelOrderId(null)}
          orderId={cancelOrderId}
          onConfirmCancel={cancelOrderAdmin}
          triggerType="admin"
        />
      )}
    </div>
  );
}
