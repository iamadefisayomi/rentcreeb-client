"use client";

import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { navConfig } from "./navConfig";
import UserMenu from "./userMenu";
import Notification from "@/components/Notification";
import MessageNotification from "@/components/MessageNotification";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Dot } from "lucide-react";


export default function DesktopHeader() {

  const {user} = useAuth()
  
  return (
    <header className="w-full min-h-16 shadow-sm z-[50] bg-background/50 backdrop-blur-md flex items-center justify-center sticky top-0 left-0">
      <div className="w-full max-w-8xl grid items-center grid-cols-5 gap-2 px-2 py-3">
        <Logo />
        <div className="flex items-center justify-center col-span-3">
          <DesktopNavigation />
        </div>
        <div className="flex items-center justify-end gap-4">
          {
            user && 
            <div className="flex items-center gap-2">
              <Notification />
              <Dot className="text-primary" />
              <MessageNotification />
            </div>
          }
          <UserMenu />
        </div>
      </div>
    </header>
    
  );
}

export function DesktopNavigation() {
  const pathname = usePathname();
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {navConfig.map((item) => {
          const isActive = pathname === item.href;

          return (
            <NavigationMenuItem key={item.title}>
              {/* 🔹 If menu has dropdown */}
              {item.menu ? (
                <>
                  <NavigationMenuTrigger
                    className={`text-xs capitalize text-gray-600 font-medium rounded-md p-2 bg-transparent hover:bg-muted ${
                      isActive ? "border-b-2 border-primary rounded-b-none" : ""
                    }`}
                  >
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 w-full">
                      {Object.entries(item.menu).map(([key, menuItem]) => {
                        const isSubActive = pathname === menuItem.href;
                        return (
                          <li key={key}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={menuItem.href}
                                className={`whitespace-nowrap truncate overflow-hidden text-ellipsis text-xs capitalize font-medium rounded-md p-2 bg-transparent hover:bg-muted ${
                                  isSubActive
                                    ? "border-b-2 border-primary text-primary rounded-b-none"
                                    : "text-gray-600"
                                }`}
                              >
                                {menuItem.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                // 🔹 Simple link
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link
                    href={item.href || "#"}
                    className={`block text-xs capitalize text-gray-600 font-medium rounded-md p-2 bg-transparent hover:bg-muted ${
                      isActive
                        ? "border-b-2 border-primary rounded-b-none"
                        : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}