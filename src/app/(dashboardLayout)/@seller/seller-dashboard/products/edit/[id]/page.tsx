"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Package,
  Tag,
  FileText,
  DollarSign,
  Boxes,
  ImageIcon,
  Factory,
  Save,
  X,
  Pencil,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useToast } from "@/src/hooks/use-toast";
import { allCategoriesAction } from "@/src/actions/category.action";
import {
  getProductByIdAction,
  updateProductAction,
} from "@/src/actions/seller.action";

interface Category {
  id: string;
  name: string;
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
  manufacturer: string;
}

type FormErrors = Partial<Record<keyof ProductFormData, string>>;

const INITIAL_FORM_DATA: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
  manufacturer: "",
};

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchData = async () => {
      const [productRes, categoriesRes] = await Promise.all([
        getProductByIdAction(id),
        allCategoriesAction(),
      ]);

      if (productRes.error) {
        toast({
          title: "Error",
          description: productRes.error.message,
          variant: "destructive",
        });
        router.push("/seller-dashboard/products");
        return;
      }

      if (productRes.data) {
        const product = productRes.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock.toString(),
          imageUrl: product.imageUrl || "",
          categoryId: product.categoryId,
          manufacturer: product.manufacturer || "",
        });
      }

      if (categoriesRes.data) {
        setCategories(categoriesRes.data);
      }

      setIsFetching(false);
    };

    fetchData();
  }, [id, router, toast]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    const { data, error } = await updateProductAction(id, {
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
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      toast({
        title: "Product updated",
        description: `${formData.name} has been updated successfully`,
      });
      router.push("/seller-dashboard/products");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));

    if (errors.categoryId) {
      setErrors((prev) => ({ ...prev, categoryId: undefined }));
    }
  };

  const getInputClassName = (fieldName: keyof FormErrors): string => {
    return `h-12 border-2 rounded-xl ${
      errors[fieldName]
        ? "border-red-300 focus-visible:ring-red-500"
        : "border-gray-200 focus:border-amber-500"
    }`;
  };

  if (isFetching) {
    return (
      <div className="p-6">
        <Card className="border-2 border-gray-200 shadow-lg max-w-3xl mx-auto rounded-xl">
          <CardContent className="py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center border-2 border-amber-300">
                <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
              </div>
              <p className="text-gray-700 font-semibold text-lg">
                Loading product details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-11 w-11 border-2 rounded-xl hover:bg-gray-50"
          >
            <Link href="/seller-dashboard/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Pencil className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-600">
                Update your product information
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information Card */}
          <Card className="border-2 border-gray-200 shadow-lg rounded-xl">
            <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center border-2 border-amber-200">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Product Information
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Editing: <span className="font-semibold">{formData.name || "Product"}</span>
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 font-semibold text-gray-900">
                  <Tag className="h-4 w-4 text-gray-600" />
                  Product Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Paracetamol 500mg"
                  className={getInputClassName("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                    <X className="h-3.5 w-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 font-semibold text-gray-900">
                  <FileText className="h-4 w-4 text-gray-600" />
                  Description <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product, its uses, and benefits..."
                  rows={4}
                  className={`border-2 rounded-xl resize-none ${
                    errors.description
                      ? "border-red-300 focus-visible:ring-red-500"
                      : "border-gray-200 focus:border-amber-500"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                    <X className="h-3.5 w-3.5" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2 font-semibold text-gray-900">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    Price (৳) <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      ৳
                    </span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`pl-10 ${getInputClassName("price")}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                      <X className="h-3.5 w-3.5" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="flex items-center gap-2 font-semibold text-gray-900">
                    <Boxes className="h-4 w-4 text-gray-600" />
                    Stock Quantity <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className={getInputClassName("stock")}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                      <X className="h-3.5 w-3.5" />
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-gray-900">
                  <Tag className="h-4 w-4 text-gray-600" />
                  Category <span className="text-red-600">*</span>
                </Label>
                
                {categories.length === 0 ? (
                  <div className="flex items-center gap-3 text-amber-700 h-auto min-h-12 px-4 py-3 border-2 border-amber-300 rounded-xl bg-amber-50">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-semibold">
                      No categories available
                    </p>
                  </div>
                ) : (
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger
                      className={`h-12 border-2 rounded-xl font-medium ${
                        errors.categoryId
                          ? "border-red-300"
                          : "border-gray-200 focus:border-amber-500"
                      }`}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      {categories.map((category) => (
                        <SelectItem 
                          key={category.id} 
                          value={category.id}
                          className="cursor-pointer rounded-lg my-1 mx-1"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {errors.categoryId && (
                  <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                    <X className="h-3.5 w-3.5" />
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2 font-semibold text-gray-900">
                  <ImageIcon className="h-4 w-4 text-gray-600" />
                  Image URL{" "}
                  <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="h-12 border-2 border-gray-200 rounded-xl"
                />
                <p className="text-xs text-gray-600">
                  Provide a direct URL to the product image
                </p>
              </div>

              {/* Manufacturer */}
              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="flex items-center gap-2 font-semibold text-gray-900">
                  <Factory className="h-4 w-4 text-gray-600" />
                  Manufacturer{" "}
                  <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Square Pharmaceuticals"
                  className="h-12 border-2 border-gray-200 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg font-semibold rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Updating Product...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Update Product
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 border-2 rounded-xl hover:bg-gray-50"
              asChild
            >
              <Link href="/seller-dashboard/products">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}