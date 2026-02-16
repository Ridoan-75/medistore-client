import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
    onError(context) {
      console.error("Auth client error:", context.error);
    },
    onSuccess(context) {
      console.log("Auth success:", context.response.status);
    },
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false },
        phone: { type: "string", required: false },
        address: { type: "string", required: false },
        status: { type: "string", required: false },
      },
    }),
  ],
});