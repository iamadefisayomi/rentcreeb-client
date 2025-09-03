"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { Dot, Menu, Wrench, X } from "lucide-react";
import { navConfig } from "./navConfig";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Notification from "@/components/Notification";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Routes from "@/Routes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import MessageNotification from "@/components/MessageNotification";
import { cn } from "@/lib/utils";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const { user } = useAuth();
  const avatarFallback = user && user?.name?.slice(0, 2) || user?.email?.slice(0, 2) || "G";

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsSticky(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsSticky(false);
      }, 3000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={cn("w-full h-full flex items-center justify-between px-2 min-h-16 py-4 shadow-sm z-[50] bg-background/50 border-b backdrop-blur-md transition-all duration-300", isSticky ? "sticky top-0 left-0" : "static top-0 left-0", open && "opacity-0 pointer-events-none z-0")}
    >
      <div className="flex items-center justify-start">{!open && <Logo />}</div>

      <div className="flex items-center justify-end gap-4">
        {
          user && 
          <div className="flex items-center gap-1">
            <Notification />
            <Dot className="text-primary" />
            <MessageNotification />
          </div>
        }
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            {user ? (
                <Avatar className="w-10 h-10 border-2 border-muted p-[1px] cursor-pointer ">
                    <AvatarImage
                      src={user.image || ""}
                      className="w-full h-full object-cover rounded-full"
                      alt="User Avatar"
                    />
                    <AvatarFallback className="uppercase text-sm">{avatarFallback}</AvatarFallback>
                </Avatar>
            ) : (
              <Button size="icon" className="rounded-[8px]">
                <Menu className="w-4" />
              </Button>
            )}
          </SheetTrigger>

          <SheetContent className="bg-slate-50 border-0 p-0">
            <SheetHeader className="bg-slate-900 px-4 min-h-16 flex items-start flex-row justify-between">
              <div className="flex flex-col gap-1 items-start">
                <Logo isDark />
                <p className="text-[11px] lowercase text-muted">One home at a time...</p>
              </div>

              <button onClick={() => setOpen(false)} className="bg-slate-900 z-[100] outline-none border-none">
                <X className="text-muted " />
              </button>
            </SheetHeader>

            <div className="flex items-start flex-col w-full overflow-y-auto">
              {navConfig.map((nav, index) => (
                <div key={index} className="w-full">
                  {nav.menu ? (
                    <Accordion type="single" collapsible>
                      <AccordionItem value={nav.title}>
                        <AccordionTrigger className="w-full hover:text-primary rounded-none text-xs text-gray-700 p-4 text-[11px] capitalize font-medium hover:bg-slate-100 text-muted-foreground px-4 py-4 cursor-pointer border-b border-muted">
                            {nav.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          {Object.values(nav.menu).map((menuItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={menuItem.href}
                              onClick={() => setOpen(false)}
                              className="block w-full rounded-none px-6 py-3 text-[11px] font-medium text-gray-600 hover:text-primary hover:bg-slate-100 border-b"
                            >
                              {menuItem.label}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      href={nav.href || "#"}
                      onClick={() => setOpen(false)}
                    >
                      <p className="text-[11px] hover:text-primary capitalize font-medium hover:bg-slate-100 text-muted-foreground px-4 py-4 cursor-pointer border-b border-muted">
                        {nav.title}
                      </p>
                    </Link>
                  )}
                </div>
              ))}

              {user && <div className='mt-4 w-full'><DashboardNav setOpen={setOpen} /></div>}
            </div>

            <SheetFooter>
              <div className="w-full flex items-center justify-center border-t p-4 rounded-b-md mt-4">
                <p className="text-[10px] cursor-default text-muted-foreground">
                  RentCreeb &copy; 2024 All Right Reserved.
                </p>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function DashboardNav({ setOpen }: { setOpen: Function }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <Accordion type="multiple" className="w-full gap-0">
      <div className="h-12 px-4 flex items-center gap-2 bg-muted">
        <h2 className="text-xs text-gray-600 font-semibold uppercase">
          Dashboard
        </h2>
        <Wrench className="w-4 text-primary" />
      </div>

      {Object.entries(Routes.dashboard).map(([section, items], index) => {
        if (section === "professional tools" && user?.role !== "agent")
          return null;
        return (
          <div key={index} className="w-full">
            <AccordionItem value={section}>
              <AccordionTrigger className="w-full font-medium text-[11px] rounded-none hover:no-underline hover:bg-slate-100 text-gray-700 p-4 pl-6 border-b capitalize">
                {section}
              </AccordionTrigger>

              <AccordionContent>
                {typeof items === "string" ? (
                  <div onClick={() => handleNavigation(items)}>
                    <div className="w-full hover:border-primary border-b p-4 h-[45px] text-muted-foreground flex items-center duration-100 hover:text-primary cursor-pointer">
                      <p className="text-[11px] font-medium capitalize pl-6">
                        {section}
                      </p>
                    </div>
                  </div>
                ) : (
                  Object.entries(items).map(([label, path], subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => handleNavigation(path)}
                    >
                      <div className="w-full hover:border-primary text-muted-foreground duration-100 border-b p-4 h-[45px] flex items-center hover:text-primary cursor-pointer">
                        <p className="text-[11px] font-medium capitalize pl-6">
                          {label}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </AccordionContent>
            </AccordionItem>
          </div>
        );
      })}
    </Accordion>
  );
}
