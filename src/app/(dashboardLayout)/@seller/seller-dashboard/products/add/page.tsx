"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  Plus,
  Save,
  X,
  AlertCircle,
  Upload,
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
import { createProductAction } from "@/src/actions/seller.action";
import { allCategoriesAction } from "@/src/actions/category.action";

interface Category {
  id: string;
  name: string;
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

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetchingCategories(true);
        setCategoryError(null);
        
        const { data, error } = await allCategoriesAction();

        if (error) {
          console.error("Category fetch error:", error);
          setCategoryError(error.message || "Failed to load categories");
          toast({
            title: "Error",
            description: "Failed to load categories. Please refresh the page.",
            variant: "destructive",
          });
        } else if (data && Array.isArray(data)) {
          console.log("Categories loaded:", data);
          setCategories(data);
          
          if (data.length === 0) {
            setCategoryError("No categories available. Please contact admin to add categories.");
          }
        } else {
          console.error("Invalid category data:", data);
          setCategoryError("Invalid category data received");
        }
      } catch (err) {
        console.error("Unexpected error fetching categories:", err);
        setCategoryError("An unexpected error occurred");
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();
  }, [toast]);

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

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  // Upload image to server
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      // TODO: Implement your upload logic
      const formData = new FormData();
      formData.append('image', file);

      // Example:
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // return data.imageUrl;

      toast({
        title: "Info",
        description: "Implement your image upload API endpoint",
      });
      return imagePreview;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // If user selected a file, upload it
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const { data, error } = await createProductAction({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: finalImageUrl.trim() || undefined,
        categoryId: formData.categoryId,
        manufacturer: formData.manufacturer.trim() || undefined,
      });

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
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        : "border-gray-200 focus:border-emerald-500"
    }`;
  };

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
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-sm text-gray-600">
                Fill in the details to add a new medicine
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information Card */}
          <Card className="border-2 border-gray-200 shadow-lg rounded-xl">
            <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center border-2 border-emerald-200">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Product Information
                </CardTitle>
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
                      : "border-gray-200 focus:border-emerald-500"
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
                
                {isFetchingCategories ? (
                  <div className="flex items-center gap-3 text-gray-600 h-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                    <span className="text-sm font-medium">Loading categories...</span>
                  </div>
                ) : categoryError ? (
                  <div className="flex items-center gap-3 text-red-600 h-auto min-h-12 px-4 py-3 border-2 border-red-300 rounded-xl bg-red-50">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{categoryError}</p>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-red-700 underline text-xs"
                        onClick={() => window.location.reload()}
                      >
                        Try again
                      </Button>
                    </div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="flex items-center gap-3 text-amber-700 h-auto min-h-12 px-4 py-3 border-2 border-amber-300 rounded-xl bg-amber-50">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-semibold">
                      No categories available. Please contact admin to add categories first.
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
                          : "border-gray-200 focus:border-emerald-500"
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

              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 font-semibold text-gray-900">
                  <ImageIcon className="h-4 w-4 text-gray-600" />
                  Product Image <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </Label>

                {imagePreview ? (
                  <div className="relative">
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Click to upload image</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </label>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Or paste an image URL below:
                </p>
                <Input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                      setImageFile(null);
                    }
                  }}
                  placeholder="https://example.com/product-image.jpg"
                  className="h-11 border-2 border-gray-200 rounded-xl"
                />
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
              disabled={isLoading || uploading || isFetchingCategories || categories.length === 0}
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg font-semibold rounded-xl"
            >
              {isLoading || uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {uploading ? "Uploading..." : "Creating Product..."}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Create Product
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