"use client"

import { generateRandomRadius } from '@/utils/generateRandomBorder';
import { useMemo, useState } from 'react';
import { OurJoinsProps, _ourJoinUs } from './_joinUs';
import { motion } from "framer-motion";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function JoinUsItem () {
  return (
    <div className="w-full bg-slate-950">
      <div className="w-full max-w-8xl mx-auto flex flex-col items-center md:gap-10 md:justify-normal justify-center px-4 py-8 md:py-32">
        <div className="flex flex-col items-center gap-3 w-full">
            <h4 className="uppercase text-xs font-medium text-primary  text-center">RentCreeb 2.0 — coming soon</h4>
            <h1 className="font-semibold capitalize text-3xl text-white">One Platform. Every Property Need.</h1>
            <p className="text-xs  text-muted-foreground" >RentCreeb 2.0 is a complete property ecosystem built for landlords, renters, artisans and developers. <br /> One place for verified users, digital agreements, maintenance tracking, and smart rent savings.</p>
          </div>

          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto max-w-2xl'>
            <span className='bg-blue-900/95 rounded-2xl py-2 px-4 text-white text-[11px]'>Verified landlords & tenants</span>
            <span className='bg-blue-900/95 rounded-2xl py-2 px-4 text-white text-[11px]'>Digital rental agreements</span>
            <span className='bg-blue-900/95 rounded-2xl py-2 px-4 text-white text-[11px]'>Property management system</span>
            <span className='bg-blue-900/95 rounded-2xl py-2 px-4 text-white text-[11px]'>Maintenance request & tracking</span>
            <span className='bg-blue-900/95 rounded-2xl py-2 px-4 text-white text-[11px]'>Verified artisan network</span>
            <span className='bg-blue-900/95 rounded-2xl py-2 px-4 text-white text-[11px]'>Rent savings — RentKeepa</span>
          </div>

          <div className="grid gap-6 mt-6 md:mt-0 md:grid-cols-4">
            {_ourJoinUs.map((service, index) => (
              <JoinItem {...service} index={index} key={index} />
            ))}
          </div>

          <Link href="/waitlist">
                <Button
                  className=" flex items-center gap-2"
                >
                  Join The Waitlist
                  <ArrowRight className="size-3" />
                </Button>
              </Link>

      </div>
    </div>
  );
}

const JoinItem = ({ title, details, index }: OurJoinsProps & { index: number }) => {
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
      <div className="w-full flex flex-col gap-4 px-4 py-8 relative z-10 ">
        <span className="size-10 rounded-xl bg-blue-900/95 flex items-center justify-center text-xs text-blue-400">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="text-xs  font-medium group-hover:text-white text-white mt-4">{title}</h2>
        <p className="text-[11px]  text-muted-foreground group-hover:text-white">
          {details}
        </p>
      </div>
    </motion.div>
  );
};