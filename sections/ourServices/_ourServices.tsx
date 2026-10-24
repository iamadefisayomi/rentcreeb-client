import { BadgeCheck, BriefcaseBusiness, HandCoins, Headset, ShieldCheck, ShieldUser, Users,  } from "lucide-react";
import { ReactNode } from "react";

export type OurServiceProps = {
  title: string;
  icon: ReactNode; // Change type to ReactNode
  details: string;
};

export const _ourServices: OurServiceProps[] = [
  {
    title: 'Trust Comes First',
    icon: <BadgeCheck className="size-6 text-primary" />,
    details:
      'Connect with verified renters, landlords, and agents through a platform designed to promote transparency and reduce rental risks.',
  },
  {
    title: 'Save Towards Rent',
    icon: <ShieldUser className="size-6 text-primary" />,
    details:
      'With RentKeepa, renters can work towards their rent goals through structured savings plans designed to make preparation easier.',
  },
  {
    title: 'Renting Made Simpler',
    icon: <BriefcaseBusiness className="size-6 text-primary" />,
    details:
      'Keep rental information organised, communicate more easily, and access digital rental documentation in one convenient place.',
  },
  {
    title: 'Property Care, Connected',
    icon: <Headset className="size-6 text-primary" />,
    details:
      'Bring landlords, renters, and artisans together to coordinate maintenance requests and keep properties in better condition.',
  },
];
