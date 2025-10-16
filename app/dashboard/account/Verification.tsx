"use client"

import CircularProgress from "@/components/CircularProgressBar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCheck, IdCard, LockKeyhole, Zap } from "lucide-react"
import VerifyModal from "./VerifyModal"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"


export default function Verification ({title}: {title: string, userScore: any}) {
    const verified = false
    return (
        <div className="w-full flex flex-col gap-6 bg-white p-6 rounded-[4px] border">
            <div className="w-full flex items-center justify-between gap-3">
                <h2 className="text-xs font-semibold capitalize pb-2">{title}</h2>

                {
                    verified ? (
                <div className="bg-green-500 cursor-default rounded-2xl text-xs py-1 px-4 text-white flex items-center gap-2">
                    <CheckCheck className="w-5 h-5 text-white"/>
                    verified
                </div>
                    ) : (
                <div className="bg-orange-100 cursor-default rounded-2xl text-xs py-1 px-4 text-slate-950 flex items-center gap-2">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"/>
                    Pending
                </div>
                    )
                }
                
            </div>

            <div className='w-full rounded-2xl p-5 flex items-center gap-4 justify-between bg-blue-100'>
                <span className="w-full  flex items-center gap-2">
                    <span className=' p-2 flex items-center aspect-square justify-center rounded-full bg-blue-500'> <IdCard className="w-5 h-5 text-white" /> </span>
                    <div className='flex flex-col items-start gap-1'>
                        <h2 className='text-xs font-medium'>
                           { verified ? 'Verified By The NIMC' : 'Verify with NIMC' } 
                        </h2>
                        <p className='text-xs text-muted-foreground'>
                            {
                                verified ? "You've unlocked full access to RentCreeb features and boosted your trust score. Enjoy a safer, more trusted experience." : 
                                "Complete identity verification to access all RentCreeb features and increase your trust score."
                            }
                            
                        </p>
                    </div>
                </span>

                {
                    verified ? (
                    <Button size='icon' disabled className="rounded-full bg-slate-50 aspect-square">
                        <CheckCheck className="w-4 h-4 text-primary"/>
                    </Button>
                    ) : (
                    <VerifyModal />
                    )
                }
            </div>

            <Separator className="my-4"/>
            <WhyVerify />
        </div>
    )
}


const WhyVerify = () => {
    return (
        <div className='w-full flex flex-col items-start gap-4'>
            <h2 className='text-xs font-semibold capitalize'>why verify your identity?</h2>
            <div className="w-full grid md:grid-cols-3 grid-cols-1 items-center gap-4 ">
                <span className="w-full  flex items-center gap-2">
                    <span className=' p-2 flex items-center aspect-square justify-center rounded-full bg-green-100'> <IdCard className="w-4 h-4 text-green-400" /> </span>
                    <div className='flex flex-col items-start gap-1'>
                        <h2 className='capitalize text-xs font-medium'>increased trust</h2>
                        <p className='text-xs text-muted-foreground'>Verified profiles get 5x more responses from hosts.</p>
                    </div>
                </span>

                <span className="w-full  flex items-center gap-2">
                    <span className=' p-2 flex items-center aspect-square justify-center rounded-full bg-orange-100'> <Zap className="w-4 h-4 text-orange-400" /> </span>
                    <div className='flex flex-col items-start gap-1'>
                        <h2 className='capitalize text-xs font-medium'>faster bookings</h2>
                        <p className='text-xs text-muted-foreground'>Skip manual verification for future bookings.</p>
                    </div>
                </span>

                <span className="w-full  flex items-center gap-2">
                    <span className=' p-2 flex items-center aspect-square justify-center rounded-full bg-blue-100'> <LockKeyhole className="w-4 h-4 text-blue-400" /> </span>
                    <div className='flex flex-col items-start gap-1'>
                        <h2 className='capitalize text-xs font-medium'>secured platform</h2>
                        <p className='text-xs text-muted-foreground'>We encrypt all your data for maximum security.</p>
                    </div>
                </span>
            </div>
        </div>
    )
}


export const TrustScore = ({userScore}: {userScore: any}) => {

    const [trustScore, setTrustScore] = useState(0)
    const pathname = usePathname()
    const _testScoreTags = {
        "identity verification": {lebel: 'identity verification', level: 60},
        "profile completion": {lebel: 'profile completion', level: userScore || 0},
        "booking history": {lebel: 'booking history', level: 30},
        "reviews": {lebel: 'reviews', level: 70},
        "payment methods": {lebel: 'payment methods', level: 100},
    }
    
    
    useEffect(() => {
    const handleCalculateScore = () => {
        const levels = Object.values(_testScoreTags).map((tag) => tag.level);
        const totalScore = levels.reduce((acc, curr) => acc + curr, 0);
        const average = totalScore / levels.length;
        setTrustScore(Math.round(average));
    };

    handleCalculateScore();
    }, [userScore, pathname, _testScoreTags]);

    
    return (
        <div className="w-full flex items-start flex-col gap-10 bg-white p-6 rounded-[4px] border">
            <h2 className="text-sm font-semibold capitalize">your trust score</h2>

            <div className="w-full md:grid md:grid-cols-5 flex flex-col gap-2">
                <span className="col-span-2"><CircularProgress label='trust score' progress={trustScore || 0} size={200} strokeWidth={10} /></span>

                <div className="w-full gap-4 flex flex-col col-span-3">
                    {
                        Object.entries(_testScoreTags).map(([key, value], index) => (
                        <div key={index} className="w-full flex flex-col gap-[2px]">
                            <div className="w-full items-center flex justify-between gap-2 px-2">
                                <p className="font-medium capitalize text-[11px] text-muted-foreground ">{key}</p>
                                <p className="font-medium capitalize text-[11px] ">{value.level}%</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{width: `${value.level}%`}}></div>
                            </div>
                        </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

