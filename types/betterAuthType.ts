import { authClient } from "@/auth-client";



export type BetterAuthUser = typeof authClient.$Infer.Session["user"]