import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
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