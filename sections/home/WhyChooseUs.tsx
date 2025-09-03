"use client"

import { ReactNode } from 'react';

type Service = {
  title: string;
  icon: ReactNode; // Change type to ReactNode
  details: string;
};

const _services: Service[] = [
  {
    title: 'Seamless Experience',
    icon: <img src="/icon3.svg" alt="icon" width={24} height={24} />,
    details: 'Ensuring a smooth and hassle-free renting process from start to finish.',
  },
  {
    title: 'Client-Focused Approach',
    icon: <img src="/icon2.svg" alt="icon" width={24} height={24} />,
    details: 'Putting tenants needs and interests at the forefront of our services.',
  },
  {
    title: 'Tenant Advocacy',
    icon: <img src="/icon1.svg" alt="icon" width={24} height={24} />,
    details: 'Acting as advocates for tenants rights and interests in all rental matters.',
  },
  {
    title: 'Personalised Support',
    icon: <img src="/icon4.svg" alt="icon" width={24} height={24} />,
    details: 'Tailored assistance to meet individual tenant needs and preferences.',
  },
];

export default function WhyChooseUs() {
  return (
    <div className="w-full bg-slate-900">
      <div className="w-full max-w-8xl mx-auto flex flex-col items-center md:gap-10 md:flex-row md:justify-normal justify-center px-4 py-8 md:py-32">
        <div className="flex flex-col  items-start gap-1 w-full max-w-lg">
            <h4 className="uppercase text-xs text-slate-300  text-center">customer satisfaction</h4>
            <h1 className="capitalize font-semibold text-[33px] text-primary text-center">why choose us?</h1>
            <p className="text-[11px] max-w-sm text-slate-300">
              Welcome to RentCreeb, your ultimate destination for hassle-free renting in Lagos. With our comprehensive range
              of services and commitment to customer satisfaction, choosing us means choosing convenience, reliability,
              and peace of mind.
            </p>
          </div>

          <div className="grid items-center gap-4 mt-6 md:mt-0 md:grid-cols-2">
            {_services.map((service, index) => (
              <ServiceComponent title={service.title} details={service.details} icon={service.icon} key={index} />
            ))}
          </div>

      </div>
    </div>
  );
}

const ServiceComponent = ({ details, icon, title }: Service) => {
  return (
    <div className=" flex border aspect-square md:aspect-auto p-10 border-muted-foreground h-full cursor-pointer items-center justify-center flex-col gap-4 w-full hover:bg-slate-900 duration-300 hover:scale-105 rounded-xl">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary">{icon}</div>
      <h4 className="capitalize font-semibold text-primary text-xs  text-center">{title}</h4>
      <p className="text-xs text-center text-slate-300">{details}</p>
    </div>
  );
};
