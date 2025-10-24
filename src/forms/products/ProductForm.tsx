'use client';

import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '@/lib/format';

const ProductSchema = z.object({
	name: z.string().min(1, 'Product name is required'),
	sku: z
		.string()
		.min(1, 'SKU required')
		.transform((s) => s.toUpperCase()),
	category: z.string().min(1, 'Select a category'),
	price: z
		.number({
			error: 'Price is required',
		})
		.min(0.01, 'Price must be positive'),
	stock: z
		.number({
			error: 'Stock is required',
		})
		.min(0, 'Stock must be >= 0'),
	description: z.string().optional(),
	active: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

export default function ProductForm({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: Partial<ProductFormValues> & { imageUrl?: string };
	onSubmit: (
		values: ProductFormValues & { imageFile?: File | null }
	) => Promise<void>;
}) {
	const [imagePreview, setImagePreview] = useState<string | null>(
		defaultValues?.imageUrl || null
	);
	const [imageFile, setImageFile] = useState<File | null>(null);

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<ProductFormValues>({
		resolver: zodResolver(ProductSchema),
		defaultValues: {
			name: defaultValues?.name ?? '',
			sku: defaultValues?.sku ?? '',
			category: defaultValues?.category ?? '',
			price: defaultValues?.price ?? 0,
			stock: defaultValues?.stock ?? 0,
			description: defaultValues?.description ?? '',
			active: defaultValues?.active ?? true,
		},
	});

	const onFormSubmit: SubmitHandler<ProductFormValues> = async (vals) => {
		try {
			await onSubmit({ ...vals, imageFile });
		} catch (err) {
			toast.error('Failed to save product.');
			console.error(err);
		}
	};

	const handleImageChange = (file?: File) => {
		if (!file) {
			setImageFile(null);
			setImagePreview(null);
			return;
		}
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
			{/* Grid for main inputs */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Product Name */}
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<Input
							{...field}
							label={
								<>
									Product Name{' '}
									<span className="text-red-500">*</span>
								</>
							}
							placeholder="e.g. Wireless Headphones"
							error={!!errors.name?.message}
							helperText={errors.name?.message}
						/>
					)}
				/>

				{/* SKU */}
				<Controller
					control={control}
					name="sku"
					render={({ field }) => (
						<Input
							{...field}
							label={
								<>
									SKU <span className="text-red-500">*</span>
								</>
							}
							placeholder="Auto-uppercase SKU"
							error={!!errors.sku?.message}
							helperText={errors.sku?.message}
							onChange={(e) =>
								setValue('sku', e.target.value.toUpperCase())
							}
						/>
					)}
				/>

				{/* Category */}
				<Controller
					control={control}
					name="category"
					render={({ field }) => (
						<div className="flex flex-col">
							<label className="text-sm font-medium">
								Category <span className="text-red-500">*</span>
							</label>
							<select
								{...field}
								className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							>
								<option value="">Select...</option>
								<option value="Electronics">Electronics</option>
								<option value="Furniture">Furniture</option>
								<option value="Clothing">Clothing</option>
								<option value="Accessories">Accessories</option>
							</select>
						</div>
					)}
				/>

				{/* Price */}
				<Controller
					control={control}
					name="price"
					render={({ field }) => (
						<Input
							{...field}
							type="number"
							step={0.01}
							label={
								<>
									Price{' '}
									<span className="text-red-500">*</span>
								</>
							}
							placeholder="0.00"
							error={!!errors.price?.message}
							helperText={
								errors.price?.message ||
								`Preview: ${formatCurrency(
									Number(field.value) || 0
								)}`
							}
							onChange={(e) =>
								field.onChange(e.target.valueAsNumber)
							}
						/>
					)}
				/>

				{/* Stock */}
				<Controller
					control={control}
					name="stock"
					render={({ field }) => (
						<Input
							{...field}
							type="number"
							label={
								<>
									Stock Quantity{' '}
									<span className="text-red-500">*</span>
								</>
							}
							error={!!errors.stock?.message}
							helperText={errors.stock?.message}
							onChange={(e) =>
								field.onChange(e.target.valueAsNumber)
							}
						/>
					)}
				/>
			</div>

			{/* Description */}
			<Controller
				control={control}
				name="description"
				render={({ field }) => (
					<div className="flex flex-col">
						<label className="text-sm font-medium">
							Description
						</label>
						<textarea
							{...field}
							className="mt-1 block w-full rounded-md border px-3 py-2"
							rows={4}
							placeholder="Optional description"
						/>
					</div>
				)}
			/>

			{/* Image Upload */}
			<div className="flex flex-col md:flex-row items-start gap-4">
				<div>
					<label className="block text-sm font-medium">
						Product Image
					</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => handleImageChange(e.target.files?.[0])}
						className="mt-1"
					/>
				</div>
				{imagePreview && (
					<div className="w-28 h-28 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
						<img
							src={imagePreview}
							alt="preview"
							className="object-cover w-full h-full"
						/>
					</div>
				)}
			</div>

			{/* Active Switch */}
			<Controller
				control={control}
				name="active"
				render={({ field }) => (
					<div className="flex items-center gap-2">
						<Switch
							checked={field.value}
							onCheckedChange={field.onChange}
						/>
						<span className="text-sm">Active</span>
					</div>
				)}
			/>

			{/* Buttons */}
			<div className="flex items-center gap-3">
				<Button type="submit" disabled={isSubmitting}>
					Save Product
				</Button>
				<Button type="button" variant="outline">
					Cancel
				</Button>
			</div>
		</form>
	);
}
