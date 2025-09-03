import { createAuthClient } from "better-auth/react"
import { NEXT_PUBLIC_BASE_URL } from "./constants";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: NEXT_PUBLIC_BASE_URL as string,
    plugins: [
      inferAdditionalFields<typeof auth>(),
      adminClient()
    ],
})
