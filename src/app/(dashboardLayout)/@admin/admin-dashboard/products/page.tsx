"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Loader2,
  Package,
  ImageIcon,
  Tag,
  Factory,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Boxes,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
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

type ProductStatus = "AVAILABLE" | "DISCONTINUED" | "OUT_OF_STOCK";

interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
  icon: typeof CheckCircle;
  label: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  AVAILABLE: {
    variant: "default",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle,
    label: "Available",
  },
  DISCONTINUED: {
    variant: "secondary",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: AlertTriangle,
    label: "Discontinued",
  },
  OUT_OF_STOCK: {
    variant: "destructive",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
    label: "Out of Stock",
  },
};

const formatCurrency = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `৳${numPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

const getStockColor = (stock: number): string => {
  if (stock === 0) return "text-red-600";
  if (stock <= 10) return "text-amber-600";
  return "text-green-600";
};

export default function AllProductsPage() {
  const { toast } = useToast();

  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const productCount = products.length;
  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const fetchProducts = async (showRefreshToast = false) => {
    if (showRefreshToast) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const { data, error } = await getAllProductsAction();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      const productData = data?.data?.data || [];
      setProducts(productData);
      setFilteredProducts(productData);

      if (showRefreshToast) {
        toast({
          title: "Refreshed",
          description: "Product list updated successfully",
        });
      }
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.manufacturer?.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const getStatusBadge = (status: string, stock: number) => {
    const effectiveStatus = stock === 0 ? "OUT_OF_STOCK" : status;
    const config = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.AVAILABLE;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`${config.className} font-semibold`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="border-2">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="text-muted-foreground font-medium">Loading products...</p>
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
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">All Products</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {productCount} products in the system
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{inStockCount} In Stock</span>
                </div>
                {outOfStockCount > 0 && (
                  <div className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{outOfStockCount} Out</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 w-64 border-2"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProducts(true)}
                disabled={isRefreshing}
                className="h-10 border-2"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? "No Products Found" : "No Products Yet"}
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? `No products matching "${searchQuery}"`
                  : "Products will appear here when sellers add them."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-16 font-semibold">Image</TableHead>
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="text-right font-semibold">Price</TableHead>
                    <TableHead className="text-right font-semibold">Stock</TableHead>
                    <TableHead className="text-right font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/30">
                      <TableCell>
                        {product.imageUrl ? (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-border bg-muted">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground line-clamp-1">
                            {product.name}
                          </p>
                          {product.manufacturer && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Factory className="h-3 w-3" />
                              <span>{product.manufacturer}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {product.category?.name ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                            <Tag className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {product.category.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(product.price)}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Boxes className={`h-4 w-4 ${getStockColor(product.stock)}`} />
                          <span className={`font-semibold ${getStockColor(product.stock)}`}>
                            {product.stock}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        {getStatusBadge(product.status, product.stock)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredProducts.length > 0 && searchQuery && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredProducts.length} of {productCount} products
        </p>
      )}
    </div>
  );
}