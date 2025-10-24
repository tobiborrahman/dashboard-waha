"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";

const OrderSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  deliveryAddress: z.string().min(1, "Delivery address required"),
  productIds: z.array(z.string()).nonempty("Select at least one product"),
  quantities: z.array(z.number().min(1, "Quantity must be at least 1")),
  paymentStatus: z.enum(["Paid", "Pending", "Refunded"]),
  deliveryStatus: z.enum(["Pending", "Shipped", "Delivered", "Canceled"]),
  expectedDeliveryDate: z.string().min(1, "Expected date required"),
});

export type OrderFormValues = z.infer<typeof OrderSchema>;

type OrderFormProps = {
  onSubmit: (values: OrderFormValues) => void | Promise<void>;
};

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const [products, setProducts] = useState<any[]>([]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      clientName: "",
      deliveryAddress: "",
      productIds: [],
      quantities: [],
      paymentStatus: "Pending",
      deliveryStatus: "Pending",
      expectedDeliveryDate: "",
    },
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products");
      const json = await res.json();
      setProducts(json.data || []);
    })();
  }, []);

  const productIds = watch("productIds");
  const quantities = watch("quantities");

  useEffect(() => {
    const currentQuantities = watch("quantities") || [];
    const newQuantities = productIds.map((_, i) => Number(currentQuantities[i] ?? 1));
    setValue("quantities", newQuantities, { shouldValidate: true });
  }, [productIds, setValue, watch]);

  const total = useMemo(() => {
    if (!productIds || !quantities) return 0;
    return productIds.reduce((acc, id, idx) => {
      const prod = products.find((p) => p.id === id);
      const qty = Number(quantities[idx] || 0);
      return acc + (prod?.price || 0) * qty;
    }, 0);
  }, [productIds, quantities, products]);


  const CustomerNameCon = (
    <Controller
      control={control}
      name="clientName"
      render={({ field }) => (
        <Input
          {...field}
          label="Client Name"
          placeholder="Enter client name"
          error={!!errors.clientName}
          helperText={errors.clientName?.message}
        />
      )}
    />
  );

  const DeliveryAddressCon = (
    <Controller
      control={control}
      name="deliveryAddress"
      render={({ field }) => (
        <Textarea
          {...field}
          label="Delivery Address"
          placeholder="Full delivery address"
          error={!!errors.deliveryAddress}
          helperText={errors.deliveryAddress?.message}
        />
      )}
    />
  );

  const ExpectedDeliveryDateCon = (
    <Controller
      control={control}
      name="expectedDeliveryDate"
      render={({ field }) => (
        <Input
          {...field}
          type="date"
          label="Expected Delivery Date"
          error={!!errors.expectedDeliveryDate}
          helperText={errors.expectedDeliveryDate?.message}
        />
      )}
    />
  );

  const ProductSelectCon = (
    <Controller
      control={control}
      name="productIds"
      render={({ field }) => (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">
            Products <span className="text-red-500">*</span>
          </label>
          <select
            multiple
            className="w-full rounded-md border px-3 py-2"
            value={field.value || []}
            onChange={(e) =>
              field.onChange(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatCurrency(p.price)}
              </option>
            ))}
          </select>
          {errors.productIds && (
            <p className="text-sm text-red-600">{errors.productIds.message}</p>
          )}
        </div>
      )}
    />
  );

  const PaymentStatusCon = (
    <Controller
      control={control}
      name="paymentStatus"
      render={({ field }) => (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Payment Status</label>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );

  const DeliveryStatusCon = (
    <Controller
      control={control}
      name="deliveryStatus"
      render={({ field }) => (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Delivery Status</label>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );

  const QuantityInputsCon = productIds.map((pid, idx) => {
    const prod = products.find((p) => p.id === pid);
    return (
      <Controller
        key={pid}
        control={control}
        name={`quantities.${idx}` as any}
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Input
              {...field}
              type="number"
              min={1}
              label={`Quantity for ${prod?.name}`}
              value={field.value || 1}
              onChange={(e) => field.onChange(Number(e.target.value) || 1)}
            />
            <span className="text-sm text-gray-500">
              {formatCurrency((prod?.price || 0) * Number(field.value || 1))}
            </span>
          </div>
        )}
      />
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CustomerNameCon}
              {ExpectedDeliveryDateCon}
            </div>
            {DeliveryAddressCon}
            {ProductSelectCon}
            <div className="space-y-3">{QuantityInputsCon}</div>
            <div className="grid grid-cols-2 gap-4">
              {PaymentStatusCon}
              {DeliveryStatusCon}
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Create Order"}
              </Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-6">
          {productIds.map((pid, idx) => {
            const prod = products.find((x) => x.id === pid);
            const qty = Number(quantities[idx] || 0);
            return (
              <div key={pid} className="flex justify-between text-sm border-b pb-2">
                <span>{prod?.name} × {qty}</span>
                <span>{formatCurrency((prod?.price || 0) * qty)}</span>
              </div>
            );
          })}
          <div className="flex justify-between font-medium pt-2">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
