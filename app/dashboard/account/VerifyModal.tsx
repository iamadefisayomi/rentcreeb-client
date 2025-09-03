"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import PhotoCapture from "@/sections/camera/PhotoCapture"
import { ChevronLeft, IdCard } from "lucide-react"
import { useEffect, useState } from "react"

export default function VerifyModal () {
    const [verify, setVerify] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) {
            return setVerify(false)
        }
    }, [open])

  return (
    <Dialog onOpenChange={setOpen} >
      <form>
        <DialogTrigger asChild>
          <Button size='sm'>
            Verify Now
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]  overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium">
                {confirm ? (
                    <Button size="icon" variant='outline' onClick={() => setConfirm(false)}>
                        <ChevronLeft className="w-4" />
                    </Button>
                    ) : (
                    verify ? 'NIN Verification' : 'Verify your identity'
                )}
            </DialogTitle>
          </DialogHeader>

          {
            verify ? (
                <MainVerificationForm confirm={confirm} setConfirm={setConfirm} /> 
            ) : (
        <div className="w-full flex items-center gap-4 flex-col mt-4">
                <span className=' p-4 flex items-center aspect-square justify-center rounded-full bg-blue-500'> <IdCard className="w-10 h-10 text-white" /> </span>
                <p className="text-center max-w-[350px] text-xs">Verify your identity with NIMC to access all features and build trust in the RentCreeb community.</p>
                <p className="text-center max-w-[350px] text-muted-foreground text-xs">Verification takes less than 2 minutes</p>
                <Button className="w-full" onClick={() => setVerify(true)}>
                    Verify With NIN
                </Button>
                <p className="text-center max-w-[300px] text-muted-foreground text-[11px]">Your data is encrypted and processed securely</p>
          </div>
            )
          }

        </DialogContent>
      </form>
    </Dialog>
  )
}


const MainVerificationForm = ({confirm, setConfirm}: {confirm: boolean, setConfirm: any}) => {
    
    const [query, setQuery] = useState<{nin: string, photo: Base64URLString | null}>({nin: '', photo: null})
    return (
        <div className="w-full flex flex-col gap-6">
            {
                confirm ? (
                    <PhotoCapture query={query} setQuery={setQuery} />
                ) : (
                    <>
                     <div className="w-full flex flex-col gap-1">
                        <p className="text-xs font-medium ">{"National Identification Number (NIN)"}</p>
                        <Input 
                            placeholder="Enter 11-digit NIN"
                            value={query.nin}
                            onChange={(e) => setQuery({...query, nin: e.target.value})}
                            type="number"
                            className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none border rounded px-3 py-2"
                        />
                        <p className="text-[11px] text-muted-foreground ">{"Your NIN is the 11-digit number on your NIMC card"}</p>
                    </div>

                    <div className="w-full flex items-start gap-2">
                        <Checkbox />
                        <p className="text-xs text-muted-foreground ">I agree to share my NIN for identity verification and confirm that I have read and accept the <span className="text-primary font-semibold">Privacy Policy</span></p>
                    </div>
                    </>
                )
            }
            {/*  */}
           

            {query.nin && query.nin.length === 11 && confirm ? null :
            <Button className="w-full" onClick={() => query.nin && query.nin.length === 11 ? setConfirm(true) : null}>
               Continue
            </Button>}

            {!confirm && 
            <span className="p-3 bg-blue-100 rounded-xl flex items-center justify-center">
                <p className="text-[11px] text-muted-foreground ">🔒 Your data is secure: We use bank-level encryption to protect your information. Your NIN is only used for verification and is not stored in our database.</p>
            </span>}
        </div>
    )
}