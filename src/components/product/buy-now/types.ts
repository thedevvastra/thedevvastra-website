export interface BuyNowProduct {
  id: string;
  title: string;
  price: number;
  image?: string;
  sellingPrice: number; // ✅ Ensure sellingPrice is available
}

export interface BuyNowSelection {
  color: string | null;
  size: string | null;
  quantity: number;
}

export interface AddressData {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BuyNowProduct;
  selection: BuyNowSelection;
  onOrderSuccess: (orderId: string) => void;
}

export interface CouponData {
  id: string;
  code: string;
  discountType: "FLAT" | "PERCENTAGE";
  discountValue: number;
  minOrderValue: number;
  targetType: "ALL" | "SPECIFIC";
}
