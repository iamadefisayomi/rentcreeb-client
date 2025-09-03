import { Toaster } from "sonner"


export type ToastType = "success" | "info" | "warning" | "error"

export default function CustomToast () {

  
    return (
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme='light'
          toastOptions={{
            style: {fontSize: '11px'}
          }}
        />
    )
}