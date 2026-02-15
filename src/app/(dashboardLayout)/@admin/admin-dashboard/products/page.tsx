"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Package } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import { SellerProduct } from "@/src/services/seller.service";
import { useToast } from "@/src/hooks/use-toast";
import { getAllProductsAction } from "@/src/actions/admin.action";

export default function SellerProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await getAllProductsAction();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setProducts(data?.data?.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Products</h1>
        <p className="text-muted-foreground">View all products in the system</p>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No products found
          </h2>
          <p className="text-muted-foreground mb-4">
            There are no products in the system
          </p>
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
                <TableHead className="text-right">Status</TableHead>
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
                  <TableCell className="text-right">
                    {getStatusBadge(product.status, product.stock)}
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
