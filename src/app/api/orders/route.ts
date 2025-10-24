// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { uid } from "@/lib/generateId";

export type Order = {
  id: string;
  clientName: string;
  deliveryAddress: string;
  productIds: string[];
  quantity: number[];
  paymentStatus: "Paid" | "Pending" | "Refunded";
  deliveryStatus: "Pending" | "Shipped" | "Delivered" | "Canceled";
  expectedDelivery: string;
  createdAt: string;
  totalAmount: number;
};

let DB: Order[] = [];

export async function GET() {
  return NextResponse.json({ data: DB, total: DB.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newOrder: Order = {
    id: uid("order_"),
    ...body,
    createdAt: new Date().toISOString(),
  };
  DB.unshift(newOrder);
  return NextResponse.json({ data: newOrder }, { status: 201 });
}
