"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Loader2, 
  Package, 
  Search,
  Filter,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Box
} from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { SellerProduct } from "@/src/services/seller.service";
import { useToast } from "@/src/hooks/use-toast";
import { getAllProductsAction } from "@/src/actions/admin.action";

// Type-safe response interface
interface GetAllProductsResponse {
  data?: {
    data?: {
      data?: SellerProduct[];
    };
  };
  error?: {
    message: string;
  };
}

export default function SellerProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getAllProductsAction() as GetAllProductsResponse;
      
      if (response.error) {
        toast({
          title: "Error",
          description: response.error.message || "Failed to fetch products",
          variant: "destructive",
        });
        setProducts([]);
        setFilteredProducts([]);
      } else if (response.data?.data?.data) {
        const productsData = response.data.data.data;
        setProducts(productsData);
        setFilteredProducts(productsData);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Out of Stock
        </Badge>
      );
    }
    if (status === "AVAILABLE") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Available
        </Badge>
      );
    }
    if (status === "DISCONTINUED") {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Discontinued
        </Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  // Calculate stats
  const totalProducts = products.length;
  const availableProducts = products.filter(
    (p) => p.status === "AVAILABLE" && p.stock > 0
  ).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce(
    (sum, p) => sum + parseFloat(p.price) * p.stock,
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground mt-1">
          View and monitor all products in the system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Need restock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription className="mt-1">
                Complete list of all products ({filteredProducts.length} {searchQuery ? "filtered" : "total"})
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">
                  {searchQuery ? "No products found" : "No products available"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "There are no products in the system yet"}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Image</TableHead>
                    <TableHead>Product Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      {/* Product Image */}
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-muted">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Box className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Product Info */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-medium text-sm line-clamp-1">
                            {product.name}
                          </p>
                          {product.manufacturer && (
                            <p className="text-xs text-muted-foreground">
                              by {product.manufacturer}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        {product.category?.name ? (
                          <Badge variant="secondary" className="font-normal">
                            {product.category.name}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right">
                        <span className="font-semibold">
                          ৳{parseFloat(product.price).toLocaleString()}
                        </span>
                      </TableCell>

                      {/* Stock */}
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 10
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </TableCell>

                      {/* Status */}
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
    </div>
  );
}