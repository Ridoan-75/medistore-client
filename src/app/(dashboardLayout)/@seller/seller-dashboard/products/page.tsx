"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Package } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { SellerProduct } from "@/src/services/seller.service";
import { useToast } from "@/src/hooks/use-toast";
import {
  getSellerProductsAction,
  deleteProductAction,
} from "@/src/actions/seller.action";

export default function SellerProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await getSellerProductsAction();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { data, error } = await deleteProductAction(id);

    if (error || !data) {
      toast({
        title: "Delete failed",
        description: error?.message || "Failed to delete product",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      });
      setProducts(products.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (status === "AVAILABLE") {
      return <Badge className="bg-green-500">Available</Badge>;
    }
    if (status === "DISCONTINUED") {
      return <Badge variant="secondary">Discontinued</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Link href="/seller-dashboard/products/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No products yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Start by adding your first product
          </p>
          <Link href="/seller-dashboard/products/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">
                        {product.name}
                      </p>
                      {product.manufacturer && (
                        <p className="text-xs text-muted-foreground">
                          {product.manufacturer}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {product.category?.name || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ৳{parseFloat(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell>
                    {getStatusBadge(product.status, product.stock)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/seller-dashboard/products/edit/${product.id}`}
                      >
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;
                              {product.name}
                              &quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-destructive hover:bg-destructive/90"
                              disabled={deletingId === product.id}
                            >
                              {deletingId === product.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
