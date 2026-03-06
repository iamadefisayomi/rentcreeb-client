const isDev = process.env.NODE_ENV === "development";

export function errorMessage(
  msg: string | Error | unknown
): { success: boolean; message: string | null | undefined | any; data: any | null } {
  const message =
    msg instanceof Error
      ? msg.message
      : typeof msg === "string"
      ? msg
      : "An unknown error occurred";

  const payload = {
    success: false,
    message,
    data: null,
  };

  if (isDev) console.error("[ERROR]", payload);

  return payload;
}

/** ---------------- Environment Constants ---------------- */
export const NEXT_PUBLIC_BASE_URL = isDev
  ? "http://localhost:3000"
  : "https://www.rentcreeb.com";

export const RENDER_SERVER_API = isDev
  ? "http://localhost:4000"
  : "https://rentcreeb-server.onrender.com";