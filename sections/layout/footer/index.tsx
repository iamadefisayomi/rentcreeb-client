"use client"

import React, { memo, useMemo, ReactNode } from "react";
import Logo from "@/components/Logo";
import { Facebook, Twitter, Instagram, Linkedin, Phone, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import Routes from "@/Routes";


const ContactLink: React.FC<ContactLinkProps> = memo(({ href, ariaLabel, title, icon, text }) => (
  <Link href={href} aria-label={ariaLabel} title={title} className="flex items-center gap-2 font-normal text-xs">
    {icon}
    <p className="text-xs text-slate-400 lowercase">{text}</p>
  </Link>
  
));

ContactLink.displayName = 'ContactLink'

type Menu = {
  header: string;
  list: { label: string | ReactNode; url?: string }[];
};

const Footer: React.FC = () => {
  const memoizedFooterListMenu = useMemo(() => footerListMenu, []);

  return (
    <footer className="bg-[#0A111F] ">
      <div className="w-full flex items-center justify-center p-6 md:p-2">
        <div className="w-full max-w-8xl py-10 flex md:flex-row flex-col gap-10 md:gap-2 items-start justify-between">
          <ContactInfo />

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 w-full gap-12 max-w-4xl">
            {memoizedFooterListMenu.map((menu, index) => (
              <MenuComponent key={index} menu={menu} />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full ">
        <div className="w-full  border-t border-slate-600 max-w-8xl mx-auto flex gap-2 flex-col p-2 md:px-0 py-10 md:flex-row justify-between items-center">
          <p className="text-xs cursor-default text-slate-400">&copy; 2025 RentCreeb. All rights reserved.</p>

          <ul className="flex items-center gap-2 text-xs text-slate-400 font-medium capitalize">
            <li><Link href='/terms'>privacy policy</Link></li>
            <li><Link href='/terms'>terms of service</Link></li>
            <li><Link href='/terms'>cookie policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
    
  );
};

const footerListMenu: Menu[] = [
  {
    header: "about rentcreeb",
    list: [
      { label: "about us", url: Routes.aboutUs },
      { label: "how it works", url: `${Routes.home}#how-it-works` },
      { label: "our team", url: `${Routes.home}#our-team` },
      { label: "careers", url: Routes.careers },
    ],
  },
  {
    header: "quick links",
    list: [
      { label: "list property", url: `${Routes.rent}?type=house` },
      { label: "Find agent", url: Routes.agents },
      { label: "Legal services", url: Routes.legal },
      { label: "book inspection", url: Routes.inspection },
    ],
  },
  {
    header: "help & support",
    list: [
      { label: <ContactLink
                href="mailto:enquiry@rentcreeb.com"
                ariaLabel="Our email"
                title="Our email"
                icon={<Mail className="size-4 text-slate-400" />}
                text="enquiry@rentcreeb.com"
              />, url: "mailto:enquiry@rentcreeb.com"},
      { label: <ContactLink
                href="tel:+234-816-920-8730"
                ariaLabel="Our phone"
                title="Our phone"
                icon={<Phone className="size-4 text-slate-400" />}
                text="+234 234 567 823"
              />, url: "tel:+234-816-920-8730" },
      { label: <ContactLink
                href="https://www.google.com/maps"
                ariaLabel="Our address"
                title="Our address"
                icon={<MapPin className="size-4 text-slate-400" />}
                text="123 Victoria Island, Lagos, Nigeria"
              />, url: "https://www.google.com/maps"},
    ],
  }
];

const ContactInfo: React.FC = memo(() => (
  <div className="flex flex-col items-start gap-6 max-w-sm w-full">
    <div className="flex flex-col gap-4 md:gap-3">
      <Logo isDark />
      <p className="text-xs text-slate-400">
       Nigeria’s most trusted platform for buying, renting, and listing properties — offering a seamless experience that connects you with verified agents, quality homes, and the best real estate deals nationwide.
      </p>
    </div>

    <div className="space-y-3 text-sm">

      <div className="flex items-center gap-4 pt-1">
        <Link href="https://www.facebook.com/Rentcreeb" target="_blank"><Facebook className="text-muted-foreground hover:rotate-[360deg] hover:text-primary duration-500 ease-in-out size-[18px] "  /></Link>
        <Link href="https://www.linkedin.com/company/rentcreeb/?viewAsMember=true" target="_blank"><Twitter className="text-muted-foreground hover:rotate-[360deg] hover:text-primary size-[18px] duration-500 ease-in-out"  /></Link>
        <Link href="https://www.instagram.com/therentcreeb/" target="_blank"><Instagram className="text-muted-foreground hover:rotate-[360deg] hover:text-primary size-[18px] duration-500 ease-in-out"  /></Link>
        <Link href="https://www.linkedin.com/company/rentcreeb/?viewAsMember=true" target="_blank"><Linkedin className="text-muted-foreground hover:rotate-[360deg] hover:text-primary size-[18px] duration-500 ease-in-out"  /></Link>
      </div>
    </div>
  </div>
  
));
ContactInfo.displayName = 'ContactInfo'

type ContactLinkProps = {
  href: string;
  ariaLabel: string;
  title: string;
  icon: ReactNode;
  text: string;
};



type MenuComponentProps = {
  menu: Menu;
};

const MenuComponent: React.FC<MenuComponentProps> = memo(({ menu }) => (
  <div className="w-full">
    <h4 className="scroll-m-20 cursor-default text-sm text-white capitalize font-semibold mb-4 tracking-tight">
      {menu.header}
    </h4>
    <ul className="flex flex-col items-start text-xs capitalize">
      {menu.list.map((item, index) => (
        <Link href={item.url || "#"} key={index} className="w-full py-2 rounded-lg hover:bg-slate-900 hover:pl-2 duration-500 ease-in-out">
          <li key={index} className=" text-slate-400 w-full">{item.label}</li>
        </Link>
      ))}
    </ul>
  </div>
  
));

MenuComponent.displayName = 'MenuComponent'
type SocialIconProps = {
  icon: ReactNode;
};

const SocialIcon: React.FC<SocialIconProps> = memo(({ icon }) => (
  <span className="p-1 border rounded-full border-primary w-7 h-7 flex items-center justify-center hover:border-slate-300 group cursor-pointer duration-200">
    {icon}
  </span>
));

SocialIcon.displayName = 'SocialIcon'
Footer.displayName = 'Footer'
export default Footer;
