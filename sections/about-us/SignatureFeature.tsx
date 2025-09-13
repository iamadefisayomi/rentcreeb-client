"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { generateRandomRadius } from "@/utils/generateRandomBorder";
import { _features } from "./_features";

export default function SignatureFeature() {
  return (
    <div className="w-full mx-auto max-w-8xl flex flex-col gap-5 md:gap-8 px-4 py-8 md:min-h-screen md:items-center md:justify-center">
      {/* Header */}
      <div className="w-full flex flex-col items-center justify-center gap-2 ">
        <h3 className="text-xs font-medium uppercase text-primary text-center">
          signature features
        </h3>
        <h1 className="text-2xl capitalize font-bold text-slate-900 text-center">
          Masterful Design: A Showcase <br /> of Quality and Craftsmanship
        </h1>
      </div>

      {/* Signature Cards */}
      <div className="flex flex-col gap-5 w-full md:grid md:grid-cols-2">
        {_features.map((props, index) => (
          <Signatures key={index} props={props} index={index} />
        ))}
      </div>
    </div>
  );
}

const Signatures = ({
  props,
  index,
}: {
  props: { title: string; details: string; icon: any };
  index: number;
}) => {
  const { details, icon, title } = props;
  const [hovered, setHovered] = useState(false);
  const BorderRadius = useMemo(() => generateRandomRadius(), []);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full relative overflow-hidden rounded-2xl border border-blue-200 bg-white cursor-pointer group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ scale: 1.03 }}
    >
      <div
        className="bg-blue-600 w-0 h-0 absolute top-[50%] -left-[10%]
                   group-hover:left-0 group-hover:top-0
                   group-hover:w-[150%] group-hover:h-[150%]
                   duration-500 ease-in-out"
        style={{ borderRadius: !hovered ? BorderRadius : "" }}
      />

      <div className="relative z-10 flex items-center gap-4 p-6">
        <span className="w-fit p-3 border border-blue-300 rounded-md md:rounded-2xl bg-theme-main group-hover:bg-white duration-300">
          {icon}
        </span>
        <span className="flex flex-col items-start gap-2">
          <h1 className="text-sm capitalize font-bold group-hover:text-white text-slate-800">
            {title}
          </h1>
          <p className="text-[11px] capitalize text-muted-foreground group-hover:text-white">
            {details}
          </p>
        </span>
      </div>
    </motion.div>
  );
};


