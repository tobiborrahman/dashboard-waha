export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Failed";

export type Order = {
  id: string;
  clientName: string;
  orderDate: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  quantities: number[];
  products: {
    id: string;
    name: string;
    quantities: number;
    price: number;
  }[];
};
