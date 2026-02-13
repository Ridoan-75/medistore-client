import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { env } from "./../env";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
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