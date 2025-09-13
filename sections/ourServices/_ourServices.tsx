import { HandCoins, Headset, ShieldCheck, Users } from "lucide-react";
import { ReactNode } from "react";

export type OurServiceProps = {
  title: string;
  icon: ReactNode; // Change type to ReactNode
  details: string;
};

export const _ourServices: OurServiceProps[] = [
  {
    title: 'Seamless Experience',
    icon: <ShieldCheck className="w-9 h-9 text-white" />,
    details:
      'We simplify the entire renting journey — from searching for the right property to finalizing agreements — ensuring a stress-free and transparent process every step of the way.',
  },
  {
    title: 'Client-Focused Approach',
    icon: <HandCoins className="w-9 h-9 text-white" />,
    details:
      'Our services are designed with tenants in mind. Every recommendation, negotiation, and interaction is centered on delivering maximum value and satisfaction to our clients.',
  },
  {
    title: 'Tenant Advocacy',
    icon: <Users className="w-9 h-9 text-white" />,
    details:
      'We stand firmly on the side of tenants, ensuring fair treatment, protecting rights, and providing clear guidance in all rental matters, from agreements to dispute resolution.',
  },
  {
    title: 'Personalised Support',
    icon: <Headset className="w-9 h-9 text-white" />,
    details:
      'Every tenant has unique needs, and we cater to them with tailored support — whether it’s finding properties within a budget, scheduling viewings, or assisting with documentation.',
  },
];
