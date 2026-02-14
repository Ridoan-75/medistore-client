"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getAllCategoriesAction,
  deleteCategorybyIdAction,
  createCategoryAction,
  updateCategoryAction,
} from "@/src/actions/admin.action";
import { Category } from "@/src/services/category.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Tag,
  ImageIcon,
  FileText,
  FolderOpen,
  AlertTriangle,
  Layers,
  CheckCircle,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
}

const INITIAL_FORM_DATA: CategoryFormData = {
  name: "",
  description: "",
  imageUrl: "",
};

export default function AllCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const categoryCount = categories.length;

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await getAllCategoriesAction();

    if (error) {
      toast.error(error.message || "Failed to fetch categories");
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedCategory(null);
    setImageFile(null);
    setImagePreview("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Category description is required");
      return false;
    }
    return true;
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
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

  // Upload image to your server/storage
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      // TODO: Replace with your actual upload logic
      // This is a placeholder - you need to implement your own upload endpoint
      const formData = new FormData();
      formData.append('image', file);

      // Example upload to your API
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // return data.imageUrl;

      // For now, return the preview URL (you'll need to replace this)
      toast.info("Note: Implement your image upload API endpoint");
      return imagePreview;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // If user selected a file, upload it
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const { error } = await createCategoryAction({
        ...formData,
        imageUrl: finalImageUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to create category");
        return;
      }

      toast.success("Category created successfully");
      setIsAddDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !validateForm()) return;

    setSubmitting(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // If user selected a new file, upload it
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const { error } = await updateCategoryAction(selectedCategory.id, {
        ...formData,
        imageUrl: finalImageUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to update category");
        return;
      }

      toast.success("Category updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setSubmitting(true);
    const { error } = await deleteCategorybyIdAction(selectedCategory.id);
    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Failed to delete category");
      return;
    }

    toast.success("Category deleted successfully");
    setIsDeleteDialogOpen(false);
    resetForm();
    fetchCategories();
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl || "",
    });
    setImagePreview(category.imageUrl || "");
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const updateFormField = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image Upload Component
  const ImageUploadSection = () => (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 font-semibold text-gray-900">
        <ImageIcon className="h-4 w-4 text-gray-600" />
        Category Image <span className="text-gray-500 text-xs font-normal">(Optional)</span>
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
        value={formData.imageUrl}
        onChange={(e) => {
          updateFormField("imageUrl", e.target.value);
          if (e.target.value) {
            setImagePreview(e.target.value);
            setImageFile(null);
          }
        }}
        placeholder="https://example.com/category-image.jpg"
        className="h-11 border-2 border-gray-200 rounded-xl"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <Card className="border-2 border-gray-200 shadow-lg rounded-xl">
          <CardContent className="py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center border-2 border-emerald-300">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
              </div>
              <p className="text-gray-700 font-semibold text-lg">
                Loading categories...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Card */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700">Total Categories</p>
                <h3 className="text-3xl font-bold text-emerald-900 mt-1">{categoryCount}</h3>
              </div>
            </div>
            <Button
              onClick={openAddDialog}
              className="h-11 px-5 bg-emerald-600 hover:bg-emerald-700 shadow-lg rounded-xl font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="border-2 border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">All Categories</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage product categories
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {categoryCount > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2">
                  <TableHead className="font-bold text-gray-900">Category</TableHead>
                  <TableHead className="font-bold text-gray-900">Description</TableHead>
                  <TableHead className="font-bold text-gray-900">Image</TableHead>
                  <TableHead className="text-right font-bold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-emerald-50/50 transition-colors border-b">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                          <Tag className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-gray-700 line-clamp-2 max-w-md leading-relaxed">
                        {category.description}
                      </p>
                    </TableCell>

                    <TableCell>
                      {category.imageUrl ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                          <ImageIcon className="h-7 w-7 text-gray-400" />
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          className="h-10 w-10 p-0 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 rounded-xl"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(category)}
                          className="h-10 w-10 p-0 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-gray-300">
                <FolderOpen className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Categories Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Get started by creating your first category to organize products.
              </p>
              <Button 
                onClick={openAddDialog}
                className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 shadow-lg rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-2 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center border-2 border-emerald-300">
                <Plus className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">Add New Category</DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Create a new category for your products.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 font-semibold text-gray-900">
                <Tag className="h-4 w-4 text-gray-600" />
                Category Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="e.g., Pain Relief, Vitamins"
                className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2 font-semibold text-gray-900">
                <FileText className="h-4 w-4 text-gray-600" />
                Description <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                placeholder="Describe the category..."
                rows={4}
                className="border-2 border-gray-200 rounded-xl resize-none focus:border-emerald-500"
              />
            </div>

            <ImageUploadSection />
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={submitting || uploading}
              className="h-11 px-6 border-2 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={submitting || uploading}
              className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold shadow-lg"
            >
              {submitting || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploading ? "Uploading..." : "Creating..."}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-2 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-amber-300">
                <Pencil className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">Edit Category</DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Update the category information.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="flex items-center gap-2 font-semibold text-gray-900">
                <Tag className="h-4 w-4 text-gray-600" />
                Category Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="Enter category name"
                className="h-12 border-2 border-gray-200 rounded-xl focus:border-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description" className="flex items-center gap-2 font-semibold text-gray-900">
                <FileText className="h-4 w-4 text-gray-600" />
                Description <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                placeholder="Enter category description"
                rows={4}
                className="border-2 border-gray-200 rounded-xl resize-none focus:border-amber-500"
              />
            </div>

            <ImageUploadSection />
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={submitting || uploading}
              className="h-11 px-6 border-2 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditCategory}
              disabled={submitting || uploading}
              className="h-11 px-6 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold shadow-lg"
            >
              {submitting || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploading ? "Uploading..." : "Updating..."}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Update Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog - Same as before */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl border-2">
          <AlertDialogHeader>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center border-2 border-red-300">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-gray-900">Delete Category</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600 mt-1">
                  Are you sure you want to delete this category?
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {selectedCategory && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 my-3">
              <p className="font-bold text-gray-900 text-lg">
                {selectedCategory.name}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {selectedCategory.description}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <strong>Warning:</strong> This action cannot be undone. All products associated with this
            category may be affected.
          </p>

          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel disabled={submitting} className="h-11 px-6 border-2 rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={submitting}
              className="h-11 px-6 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Category
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}