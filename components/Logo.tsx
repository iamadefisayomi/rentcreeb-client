"use client";

import { Loader2 } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  isDark?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ isDark = false, className }) => {
  const logoSrc = isDark ? "/logo-dark.svg" : "/logo-light.svg";

  return (
    <div className="flex items-center">
      <Link href="/" className="flex w-fit items-center gap-1">
        <Image
          src={logoSrc}
          alt="logo"
          width={140}
          height={40} // Adjust dimensions as needed
          className={clsx("h-auto", className)}
          draggable={false}
          priority
          unoptimized // Since the image is from the public folder
        />
      </Link>
    </div>
  );
};

export default Logo;
