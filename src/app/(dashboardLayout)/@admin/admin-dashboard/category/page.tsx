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

  const categoryCount = categories.length;

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedCategory(null);
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

  const handleAddCategory = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const { error } = await createCategoryAction(formData);
    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Failed to create category");
      return;
    }

    toast.success("Category created successfully");
    setIsAddDialogOpen(false);
    resetForm();
    fetchCategories();
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !validateForm()) return;

    setSubmitting(true);
    const { error } = await updateCategoryAction(selectedCategory.id, formData);
    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Failed to update category");
      return;
    }

    toast.success("Category updated successfully");
    setIsEditDialogOpen(false);
    resetForm();
    fetchCategories();
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
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const updateFormField = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card className="border-2">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="text-muted-foreground font-medium">
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
      <Card className="border-2 shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">All Categories</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {categoryCount} {categoryCount === 1 ? "category" : "categories"} total
                </p>
              </div>
            </div>

            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {categoryCount > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Tag className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-semibold text-foreground">
                          {category.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-muted-foreground line-clamp-2 max-w-xs">
                        {category.description}
                      </p>
                    </TableCell>

                    <TableCell>
                      {category.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-border">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          className="h-9 w-9 p-0 border-2 hover:border-primary/50 hover:bg-primary/5"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(category)}
                          className="h-9 w-9 p-0 border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive"
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
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Categories Found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Get started by creating your first category to organize products.
              </p>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for your products.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="Enter category name"
                className="h-11 border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                placeholder="Enter category description"
                rows={4}
                className="border-2 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                Image URL <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => updateFormField("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-11 border-2"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={submitting}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={submitting}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Pencil className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the category information.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="Enter category name"
                className="h-11 border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                placeholder="Enter category description"
                rows={4}
                className="border-2 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                Image URL <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
              <Input
                id="edit-imageUrl"
                value={formData.imageUrl}
                onChange={(e) => updateFormField("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-11 border-2"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={submitting}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditCategory}
              disabled={submitting}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Update Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  Are you sure you want to delete this category?
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {selectedCategory && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 my-2">
              <p className="font-semibold text-foreground">
                {selectedCategory.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {selectedCategory.description}
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            This action cannot be undone. All products associated with this
            category may be affected.
          </p>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={submitting} className="border-2">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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