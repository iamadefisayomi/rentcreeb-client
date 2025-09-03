const isDev = process.env.NODE_ENV === 'development'

export async function errorMessage(
  msg: string | Error | unknown
): Promise<{ success: boolean; message: string; data: any }> {
  const message =
    msg instanceof Error ? msg.message : typeof msg === "string" ? msg : "An unknown error occurred";

  const payload = {
    success: false,
    message,
    data: null,
  };

  if (isDev) console.error("[ERROR]", payload);

  return payload;
}

export const NEXT_PUBLIC_BASE_URL = isDev ? 'http://localhost:3000' : 'https://rent-pro-virid.vercel.app'
export const RENDER_SERVER_API = isDev ? 'http://localhost:4000' : 'https://rentcreeb-server.onrender.com'