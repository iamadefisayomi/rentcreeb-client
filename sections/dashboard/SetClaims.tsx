"use client";

import { useState } from "react";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
    AlertDialog,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useAlert from "@/hooks/useAlert";
import { Headphones, UserRound } from "lucide-react";
import { authClient } from "@/auth-client";

export default function SetClaims() {

    const [accType, setAcctype] = useState('');
    const [updating, setUpdating] = useState(false);
    const { setAlert } = useAlert();

    const handleSetrole = async () => {
        if (accType === 'renter' || accType === 'agent') {
            try {
                setUpdating(true);
                const {data, error} = await authClient.updateUser({
                    role: accType
                })
                if (error) throw new Error(error.message)
            }
            catch(err: any) {
                return setAlert(err.message, 'error')
            }
            finally {
                setUpdating(false);
            }
        }
    };

    return (
        <AlertDialog open={true}>
            <AlertDialogContent className="w-[400px] rounded-[40px] p-10 flex flex-col justify-between items-center gap-8">
                <h2 className="text-xs">Select an account</h2>

                <ToggleGroup type="single" variant="outline" onValueChange={setAcctype} className="w-full flex items-center gap-3">
                    <ToggleGroupItem value="renter" aria-label="Toggle bold" className="h-24 w-24 rounded-full text-[11px] flex flex-col items-center justify-center gap-2">
                        <UserRound className="w-4" />
                        renter
                    </ToggleGroupItem>
                    <ToggleGroupItem value="agent" aria-label="Toggle italic" className="h-24 w-24 rounded-full text-[11px] flex flex-col items-center justify-center gap-2">
                        <Headphones className="w-4" />
                        agent
                    </ToggleGroupItem>
                </ToggleGroup>

                <Button loading={updating} className="w-full" size='lg' onClick={handleSetrole} >
                    Continue {accType && <>as <span className="lowercase pl-2">{accType}</span></>}
                </Button>
            </AlertDialogContent>
        </AlertDialog>
    );
}