import { Route } from "@/src/types";

export const adminRoutes: Route[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/admin-dashboard",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Products",
        url: "/admin-dashboard/products",
      },
      {
        title: "Orders",
        url: "/admin-dashboard/orders",
      },
      {
        title: "Users",
        url: "/admin-dashboard/users",
      },
      {
        title: "Category",
        url: "/admin-dashboard/category",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Back To Store",
        url: "/",
      },
    ],
  },
];
