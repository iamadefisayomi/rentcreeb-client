import Routes from "@/Routes";

export const navConfig = [
  {
    title: "Home",
    href: Routes.home,
  },
  {
    title: "Listings",
    menu: {
      buy: { label: "For Sale", href: Routes.buy },
      rent: { label: "For Rent", href: Routes.rent },
      shortLet: { label: "Short Let", href: Routes.shortLet },
      // newHomes: { label: "New Homes", href: Routes.newHomes },
      // luxury: { label: "Luxury Homes", href: Routes.luxury },
      // commercial: { label: "Commercial", href: Routes.commercial },
      land: { label: "Land", href: Routes.land },
    },
  },
  {
    title: "Neighborhoods",
    href: Routes.neighborhoods,
  },
  {
    title: "Agents",
    href: Routes.agents,
  },
  {
    title: "Mortgage",
    menu: {
      mortgage: { label: "Mortgage Overview", href: Routes.mortgage },
      calculator: { label: "Mortgage Calculator", href: Routes.calculator },
    },
  },
  {
    title: "Resources",
    menu: {
      blog: { label: "Blog", href: Routes.blog },
      faq: { label: "FAQ", href: Routes.faq },
      careers: { label: "Careers", href: Routes.careers },
      services: { label: "Services", href: Routes.services },
    },
  },
  {
    title: "About Us",
    href: Routes.aboutUs,
  },
  {
    title: "Contact",
    href: Routes.contact,
  },
];
