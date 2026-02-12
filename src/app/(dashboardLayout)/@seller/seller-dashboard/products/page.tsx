"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
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
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
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

type ProductStatus = "AVAILABLE" | "DISCONTINUED" | "OUT_OF_STOCK";

interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline";
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: typeof CheckCircle;
  label: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  AVAILABLE: {
    variant: "default",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-300",
    icon: CheckCircle,
    label: "Available",
  },
  DISCONTINUED: {
    variant: "secondary",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
    icon: AlertTriangle,
    label: "Discontinued",
  },
  OUT_OF_STOCK: {
    variant: "destructive",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-300",
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
  return "text-emerald-600";
};

const getStockBgColor = (stock: number): string => {
  if (stock === 0) return "bg-red-100 border-red-300";
  if (stock <= 10) return "bg-amber-100 border-amber-300";
  return "bg-emerald-100 border-emerald-300";
};

export default function SellerProductsPage() {
  const { toast } = useToast();

  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const productCount = products.length;
  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;

  const fetchProducts = async (showRefreshToast = false) => {
    if (showRefreshToast) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const { data, error } = await getSellerProductsAction();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setProducts(data);
      setFilteredProducts(data);

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
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }

    setDeletingId(null);
  };

  const getStatusBadge = (status: string, stock: number) => {
    const effectiveStatus = stock === 0 ? "OUT_OF_STOCK" : status;
    const config = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.AVAILABLE;
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 ${config.borderColor} ${config.bgColor} ${config.textColor} font-semibold text-sm shadow-sm`}>
        <Icon className="h-4 w-4" />
        <span>{config.label}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="border-2 border-gray-200 shadow-lg rounded-xl">
          <CardContent className="py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center border-2 border-blue-300">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <p className="text-gray-700 font-semibold text-lg">
                Loading your products...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Products</p>
                <h3 className="text-3xl font-bold text-blue-900 mt-2">{productCount}</h3>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">In Stock</p>
                <h3 className="text-3xl font-bold text-emerald-900 mt-2">{inStockCount}</h3>
              </div>
              <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Low Stock</p>
                <h3 className="text-3xl font-bold text-amber-900 mt-2">{lowStockCount}</h3>
              </div>
              <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Out of Stock</p>
                <h3 className="text-3xl font-bold text-red-900 mt-2">{outOfStockCount}</h3>
              </div>
              <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <XCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="border-2 border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Product Inventory</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your product catalog
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 w-64 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProducts(true)}
                disabled={isRefreshing}
                className="h-11 px-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <Button 
                asChild 
                className="h-11 px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-xl font-semibold"
              >
                <Link href="/seller-dashboard/products/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-gray-300">
                <Package className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery ? "No Products Found" : "No Products Yet"}
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto mb-6">
                {searchQuery
                  ? `No products matching "${searchQuery}"`
                  : "Start building your inventory by adding your first product."}
              </p>
              {searchQuery ? (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="h-11 px-6 border-2 rounded-xl"
                >
                  Clear Search
                </Button>
              ) : (
                <Button 
                  asChild
                  className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg rounded-xl"
                >
                  <Link href="/seller-dashboard/products/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2">
                    <TableHead className="w-20 font-bold text-gray-900">Image</TableHead>
                    <TableHead className="font-bold text-gray-900">Product Details</TableHead>
                    <TableHead className="font-bold text-gray-900">Category</TableHead>
                    <TableHead className="text-right font-bold text-gray-900">Price</TableHead>
                    <TableHead className="text-center font-bold text-gray-900">Stock</TableHead>
                    <TableHead className="font-bold text-gray-900">Status</TableHead>
                    <TableHead className="text-right font-bold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-blue-50/50 transition-colors border-b">
                      <TableCell>
                        {product.imageUrl ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-7 w-7 text-gray-400" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1.5">
                          <p className="font-semibold text-gray-900 line-clamp-2 leading-snug">
                            {product.name}
                          </p>
                          {product.manufacturer && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg w-fit border border-gray-200">
                              <Factory className="h-3.5 w-3.5" />
                              <span className="font-medium">{product.manufacturer}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {product.category?.name ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl border-2 border-blue-200 shadow-sm">
                            <Tag className="h-3.5 w-3.5" />
                            <span className="text-sm font-semibold">
                              {product.category.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 px-4 py-2 rounded-xl border-2 border-emerald-200 inline-block shadow-sm">
                          <span className="text-lg font-bold text-emerald-700">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 ${getStockBgColor(product.stock)} shadow-sm`}>
                          <Boxes className={`h-4 w-4 ${getStockColor(product.stock)}`} />
                          <span className={`font-bold ${getStockColor(product.stock)}`}>
                            {product.stock}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {getStatusBadge(product.status, product.stock)}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 p-0 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 rounded-xl"
                          >
                            <Link href={`/seller-dashboard/products/edit/${product.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 p-0 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-xl"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="rounded-2xl border-2">
                              <AlertDialogHeader>
                                <div className="flex items-center gap-4 mb-3">
                                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center border-2 border-red-300">
                                    <AlertTriangle className="h-7 w-7 text-red-600" />
                                  </div>
                                  <div>
                                    <AlertDialogTitle className="text-xl font-bold text-gray-900">
                                      Delete Product
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="mt-1 text-gray-600">
                                      Are you sure you want to delete this product?
                                    </AlertDialogDescription>
                                  </div>
                                </div>
                              </AlertDialogHeader>

                              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 my-3">
                                <p className="font-bold text-gray-900 text-lg">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  This action cannot be undone. The product will be permanently removed.
                                </p>
                              </div>

                              <AlertDialogFooter className="gap-3">
                                <AlertDialogCancel className="h-11 px-6 border-2 rounded-xl">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="h-11 px-6 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-lg"
                                  disabled={deletingId === product.id}
                                >
                                  {deletingId === product.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Product
                                    </>
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
        </CardContent>
      </Card>

      {filteredProducts.length > 0 && searchQuery && (
        <div className="text-center">
          <p className="text-sm text-gray-600 bg-gray-100 inline-block px-4 py-2 rounded-xl border border-gray-200">
            Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of <span className="font-bold text-gray-900">{productCount}</span> products
          </p>
        </div>
      )}
    </div>
  );
}