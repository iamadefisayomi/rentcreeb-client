import { House, Search, User } from "lucide-react";



export default function HowWeWork () {
    return (
        <div className="w-full flex items-center justify-center py-10 px-2 bg-white" id="how-it-works">
            <div className="w-full max-w-8xl flex flex-col items-center gap-16 justify-between">
                <h2 className="text-2xl capitalize font-semibold text-slate-700">How RentCreeb Works</h2>

                <div className="w-full grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-3 ">
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full flex items-center gap-1 justify-center">
                            <span className="h-[2px] flex-grow bg-transparent md:flex hidden"/>
                            <span className="size-16 bg-primary rounded-full flex items-center justify-center relative">
                                <Search className="text-white size-8" />
                                <span className='absolute -top-1 text-[10px] border-2 border-white text-white bg-slate-900 p-2 rounded-full size-6 flex items-center justify-center -right-2'>01</span>
                            </span>
                            <span className="h-[2px] flex-grow bg-muted md:flex hidden"/>
                        </div>
                        <div className="w-full flex flex-col items-center gap-3 max-w-[80%] mx-auto">
                            <h2 className="font-semibold text-md capitalize text-center text-slate-700">search properties</h2>
                            <p className="text-xs text-slate-600 text-center">Browse through thousands of verified listings across Nigeria with advanced filters.</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full flex items-center gap-1 justify-center">
                            <span className="h-[2px] flex-grow bg-muted md:flex hidden"/>
                            <span className="size-16 bg-primary rounded-full flex items-center justify-center relative">
                                <User className="text-white size-8" />
                                <span className='absolute border-2 border-white -top-1 text-[10px] text-white bg-slate-900 p-2 rounded-full size-6 flex items-center justify-center -right-2'>02</span>
                            </span>
                            <span className="h-[2px] flex-grow bg-muted md:flex hidden"/>
                        </div>
                        <div className="w-full flex flex-col items-center gap-3 max-w-[80%] mx-auto">
                            <h2 className="font-semibold text-md capitalize text-center text-slate-700">Connect with Verified Agents</h2>
                            <p className="text-xs text-slate-600 text-center">Get matched with trusted agents who will guide you through the entire process.</p>
                        </div>
                    </div>


                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full flex items-center gap-1 justify-center">
                            <span className="h-[2px] flex-grow bg-muted md:flex hidden"/>
                            <span className="size-16 bg-primary rounded-full flex items-center justify-center relative">
                                <House className="text-white size-8" />
                                <span className='absolute border-2 border-white -top-1 text-[10px] text-white bg-slate-900 p-2 rounded-full size-6 flex items-center justify-center -right-2'>03</span>
                            </span>
                            <span className="h-[2px] flex-grow bg-transparent md:flex hidden"/>
                        </div>
                        <div className="w-full flex flex-col items-center gap-3 max-w-[80%] mx-auto">
                            <h2 className="font-semibold text-md capitalize text-center text-slate-700">Rent or Buy Securely</h2>
                            <p className="text-xs text-slate-600 text-center">Complete your transaction safely with our secure payment and escrow system.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}