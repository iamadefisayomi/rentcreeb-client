"use client"

import { generateRandomRadius } from '@/utils/generateRandomBorder';
import { useMemo, useState } from 'react';
import { _ourServices, OurServiceProps } from '../ourServices/_ourServices';
import { motion } from "framer-motion";

export default function OurServices () {
  return (
    <div className="w-full bg-slate-900">
      <div className="w-full max-w-8xl mx-auto flex flex-col items-center md:gap-10 md:flex-row md:justify-normal justify-center px-4 py-8 md:py-32">
        <div className="flex flex-col  items-start gap-3 w-full max-w-lg">
            <h4 className="uppercase text-xs font-medium text-white  text-center">customer satisfaction</h4>
            <h1 className="capitalize font-bold text-5xl text-primary text-center">why choose us?</h1>
            <p className="text-xs max-w-sm text-white">
              Welcome to RentCreeb, your ultimate destination for hassle-free renting in Lagos. With our comprehensive range
              of services and commitment to customer satisfaction, choosing us means choosing convenience, reliability,
              and peace of mind.
            </p>
          </div>

          <div className="grid items-center gap-4 mt-6 md:mt-0 md:grid-cols-2">
            {_ourServices.map((service, index) => (
              <ServiceItem {...service} index={index} key={index} />
            ))}
          </div>

      </div>
    </div>
  );
}


const ServiceItem = ({ title, details, icon, index }: OurServiceProps & { index: number }) => {
  const [hovered, setHovered] = useState(false);
  const BorderRadius = useMemo(() => generateRandomRadius(), []);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer relative overflow-hidden bg-white rounded-2xl group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ scale: 1.03 }} 
    >
      <div
        className="bg-blue-600 w-24 h-16 absolute top-4 left-3 
                   group-hover:left-0 group-hover:top-0 
                   group-hover:w-[150%] group-hover:h-[150%] 
                   duration-500 ease-in-out"
        style={{ borderRadius: !hovered ? BorderRadius : "" }}
      />
      <div className="w-full flex flex-col gap-4 px-6 py-8 relative z-10">
        <span>{icon}</span>
        <h2 className="text-sm font-semibold group-hover:text-white">{title}</h2>
        <p className="text-xs text-muted-foreground group-hover:text-white">
          {details}
        </p>
      </div>
    </motion.div>
  );
};
