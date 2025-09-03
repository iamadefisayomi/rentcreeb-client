"use client"

import React, { memo, useMemo, ReactNode } from "react";
import Logo from "@/components/Logo";
import { Facebook, Twitter, Instagram, Linkedin, Phone, MapPin, Mail } from "lucide-react";
import Link from "next/link";

type Menu = {
  header: string;
  list: { label: string; url: string }[];
};

const Footer: React.FC = () => {
  const memoizedFooterListMenu = useMemo(() => footerListMenu, []);

  return (
    <footer>
      <div className="w-full flex items-center justify-center p-6 md:p-2 bg-slate-900">
        <div className="w-full max-w-8xl py-10 flex md:flex-row flex-col gap-10 md:gap-2 items-start justify-between">
          <ContactInfo />

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 w-full gap-12 max-w-4xl">
            {memoizedFooterListMenu.map((menu, index) => (
              <MenuComponent key={index} menu={menu} />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-600 bg-slate-800 text-slate-200">
        <div className="w-full text-slate-300 max-w-8xl mx-auto flex gap-2 flex-col p-2 md:px-0 md:flex-row justify-between items-center py-3">
          <p className="text-[11px] cursor-default">RentCreeb &copy; 2024 All Right Reserved.</p>

          <ul className="flex items-center gap-2 text-[11px] capitalize">
            <li><Link href='/terms'>terms of use</Link></li>
            <li className="w-1 h-1 rounded-full bg-blue-500" />
            <li><Link href='/terms'>disclaimer</Link></li>
            <li className="w-1 h-1 rounded-full bg-blue-500" />
            <li><Link href='/terms'>privacy policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
    
  );
};

const footerListMenu: Menu[] = [
  {
    header: "company",
    list: [
      { label: "about", url: "/about" },
      { label: "blog", url: "/blog" },
      { label: "location map", url: "/map" },
      { label: "faq", url: "/faq" },
      { label: "contact us", url: "/contact" },
    ],
  },
  {
    header: "services",
    list: [
      { label: "meet our agents", url: "/agents" },
      { label: "properties", url: "/listings" },
      { label: "houses", url: "/listings" },
      { label: "gallery", url: "/gallery" },
      { label: "legal assistance", url: "/terms" },
    ],
  },
  {
    header: "popular search",
    list: [
      { label: "apartment low to high", url: "/agents" },
      { label: "property for rent", url: "/listings" },
      { label: "featured properties", url: "/listings" },
      { label: "office", url: "/office-space" },
      { label: "new properties", url: "/terms" },
    ],
  },
];

const ContactInfo: React.FC = memo(() => (
  <div className="flex flex-col items-start gap-6 max-w-sm w-full">
    <div className="flex flex-col gap-4 md:gap-3">
      <Logo isDark />
      <p className="text-xs text-slate-300">
        We are the leading real estate marketplace dedicated to empowering consumers with data,
        inspiration and knowledge around the place they call home.
      </p>
    </div>

    <div className="space-y-3 text-sm">
      <ContactLink
        href="tel:+234-816-920-8730"
        ariaLabel="Our phone"
        title="Our phone"
        icon={<Phone className="w-5 h-5 text-primary" />}
        text="+234 234 567 823"
      />
      <ContactLink
        href="mailto:info@rentcreeb.com"
        ariaLabel="Our email"
        title="Our email"
        icon={<Mail className="w-5 h-5 text-primary" />}
        text="info@rentcreeb.com"
      />
      <ContactLink
        href="https://www.google.com/maps"
        ariaLabel="Our address"
        title="Our address"
        icon={<MapPin className="w-5 h-5 text-primary" />}
        text="House 2, Clarence Avenue TX. USA"
      />

      <div className="flex items-center gap-4 pt-1">
        <SocialIcon icon={<Facebook className="text-primary group-hover:text-slate-300"  />} />
        <SocialIcon icon={<Twitter className="text-primary group-hover:text-slate-300"  />} />
        <SocialIcon icon={<Instagram className="text-primary group-hover:text-slate-300"  />} />
        <SocialIcon icon={<Linkedin className="text-primary group-hover:text-slate-300"  />} />
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

const ContactLink: React.FC<ContactLinkProps> = memo(({ href, ariaLabel, title, icon, text }) => (
  <Link href={href} aria-label={ariaLabel} title={title} className="flex items-center gap-2 font-normal text-xs">
    {icon}
    <p className="text-xs text-slate-300">{text}</p>
  </Link>
  
));

ContactLink.displayName = 'ContactLink'

type MenuComponentProps = {
  menu: Menu;
};

const MenuComponent: React.FC<MenuComponentProps> = memo(({ menu }) => (
  <div className="w-full">
    <h4 className="scroll-m-20 cursor-default text-sm text-primary capitalize font-semibold mb-4 tracking-tight">
      {menu.header}
    </h4>
    <ul className="flex flex-col items-start text-xs capitalize">
      {menu.list.map((item, index) => (
        <Link href={item.url} key={index} className="w-full  pb-1 py-3 border-b border-slate-700 hover:bg-slate-900">
          <li key={index} className=" text-slate-300 w-full">{item.label}</li>
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
