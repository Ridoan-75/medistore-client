"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { sellerProductService } from "@/src/services/seller.service";
import { categoryService } from "@/src/services/category.service";
import { useToast } from "@/src/hooks/use-toast";
import { createProductAction } from "@/src/actions/seller.action";
import { allCategoriesAction } from "@/src/actions/category.action";

interface Category {
  id: string;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
    manufacturer: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await allCategoriesAction();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } else if (data) {
        setCategories(data);
      }
      setIsFetchingCategories(false);
    };
    fetchCategories();
  }, [toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const { data, error } = await createProductAction({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      imageUrl: formData.imageUrl.trim() || undefined,
      categoryId: formData.categoryId,
      manufacturer: formData.manufacturer.trim() || undefined,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Failed to create product",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      toast({
        title: "Product created",
        description: `${formData.name} has been added successfully`,
      });
      router.push("/seller-dashboard/products");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller-dashboard/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Add New Product
          </h1>
          <p className="text-muted-foreground">
            Fill in the details to add a new product
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (৳) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className={errors.stock ? "border-destructive" : ""}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            {isFetchingCategories ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading categories...
              </div>
            ) : (
              <Select
                value={formData.categoryId}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, categoryId: value }));
                  if (errors.categoryId) {
                    setErrors((prev) => ({ ...prev, categoryId: "" }));
                  }
                }}
              >
                <SelectTrigger
                  className={errors.categoryId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Enter a direct URL to the product image
            </p>
          </div>

          {/* Manufacturer */}
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Enter manufacturer name"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
          <Link href="/seller-dashboard/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
