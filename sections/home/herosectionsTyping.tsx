"use client";

import { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";

export const HeroHeadline = () => {
  const headlines = [
    "Your Home Search Journey Ends and Adventure Begins here",
    "Find your perfect home and start your next adventure today",
    "Discover where comfort meets adventure in your new home",
    "Your dream home is waiting — begin your journey today",
    "Where home meets adventure — your search ends here",
    "Adventure begins where your home search ends",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % headlines.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Typewriter
      options={{ delay: 50, deleteSpeed: 30 }}
      onInit={(tw) => {
        tw.typeString(headlines[index]).start();
      }}
    />
  );
};

export const HeroSubtext = () => {
  const subtexts = [
    "Welcome to the future of hassle-free living in Lagos! Experience the true essence of Lagos living, minus the agent wahala.",
    "Discover a smarter way to find your dream home in Lagos — simple, transparent, and stress-free.",
    "Say goodbye to agent stress and hidden fees! Find your perfect Lagos home the easy way.",
    "Your Lagos home search just got easier — experience freedom, convenience, and peace of mind.",
    "Lagos living made effortless! Explore verified listings without the usual agent drama.",
    "Step into the new era of Lagos housing — where finding a home is smooth and easy.",
    "We’re redefining how you rent and buy in Lagos — no middlemen, no stress, just results.",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % subtexts.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Typewriter
      options={{ delay: 40, deleteSpeed: 25 }}
      onInit={(tw) => {
        tw.typeString(subtexts[index]).start();
      }}
    />
  );
};