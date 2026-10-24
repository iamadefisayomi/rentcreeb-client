"use client"

import { generateRandomRadius } from '@/utils/generateRandomBorder';
import { useMemo, useState } from 'react';
import { _ourServices, OurServiceProps } from '../ourServices/_ourServices';
import { motion } from "framer-motion";

export default function OurServices () {
  return (
    <div className="w-full bg-slate-950">
      <div className="w-full max-w-8xl mx-auto flex flex-col items-start md:gap-10 md:justify-normal justify-center px-4 py-8 md:py-32">
        <div className="flex flex-col  items-start gap-3 w-full max-w-lg">
            <h4 className="uppercase text-xs font-medium text-primary  text-center">why rentcreeb?</h4>
            <h1 className="font-semibold text-4xl text-white">A Smarter Way to <br /> Navigate Property. </h1>
          </div>

          <div className="grid gap-6 mt-6 md:mt-0 md:grid-cols-4">
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
      className="cursor-pointer relative overflow-hidden bg-slate-900 rounded-2xl group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ scale: 1.03 }} 
    >
      <div
        className="bg-blue-900/95 size-12 rounded-xl absolute top-4 left-[13px] 
                   group-hover:left-0 group-hover:top-0 
                   group-hover:w-[150%] group-hover:h-[150%] 
                   duration-500 ease-in-out"
      />
      <div className="w-full flex flex-col gap-4  py-8 relative z-10 ">
        <span className='px-6'>{icon}</span>
        <h2 className="text-xs px-4 font-medium group-hover:text-white text-white mt-4">{title}</h2>
        <p className="text-[11px] px-4 text-muted-foreground group-hover:text-white">
          {details}
        </p>
      </div>
    </motion.div>
  );
};