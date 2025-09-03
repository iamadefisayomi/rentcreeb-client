import { Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"




export const SocialAuth = () => {

    const {loginWithSocial} = useAuth()

    return (
        <div className="w-full grid grid-cols-2 gap-4">
            <Button onClick={() => loginWithSocial('facebook')} variant='outline' className="flex items-center justify-center gap-1 text-muted-foreground">
                <Facebook className="text-blue-600"/> 
                Facebook
            </Button>

            <Button onClick={() => loginWithSocial('google')} variant='outline' className="flex items-center justify-center gap-1 text-muted-foreground">
                <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="" className="object-contain flex aspect-square w-6"/>
                Google
            </Button>
        </div>
    )
}

