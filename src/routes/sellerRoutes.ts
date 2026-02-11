import { Route } from "@/src/types";

export const sellerRoutes: Route[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/seller-dashboard",
      },
    ],
  },
  {
    title: "My Store",
    items: [
      {
        title: "Products",
        url: "/seller-dashboard/products",
      },
      {
        title: "Add Product",
        url: "/seller-dashboard/products/add",
      },
      {
        title: "Orders",
        url: "/seller-dashboard/orders",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Back to Home",
        url: "/",
      },
    ],
  },
];
