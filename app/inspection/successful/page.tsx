'use client';

import { BadgeCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import {validateInspectionSuccess} from '@/actions/subscription'

export default function InspectionSuccessfulPage() {
  const searchParams = useSearchParams();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const router = useRouter()

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const details = useMemo(() => ({
    reference: searchParams.get('reference'),
    amount: searchParams.get('amount'),
    email: searchParams.get('email'),
    code: searchParams.get('code'),
    propertyId: searchParams.get('propertyId'),
    propertyTitle: searchParams.get('property_title'),
    date: searchParams.get('date'),
    time: searchParams.get('time'),
    location: searchParams.get('location'),
    agent: searchParams.get('agent'),
  }), [searchParams]);

   const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!details.reference) {
      router.replace("/");
      return;
    }

    async function check() {
      const res = await validateInspectionSuccess(details.reference as string);

      if (!res.success) {
        router.replace("/");
      } else {
        setAllowed(true);
      }
    }

    check();
  }, [details.reference]);

  if (!allowed) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={300}
        gravity={0.3}
        recycle={false}
      />

      <div className="z-10 flex items-center flex-col gap-4 max-w-sm w-full bg-white p-6 rounded-xl shadow-lg">
        <span className='bg-green-100 rounded-full w-16 h-16 flex items-center justify-center'>
          <BadgeCheck className='text-green-500 w-8 h-8'/>
        </span>

        <h1 className="text-xl font-semibold text-green-600">Inspection Booked</h1>
        <p className="text-gray-700 text-sm text-center">Your inspection has been successfully booked. Here are the details:</p>

        <div className="flex flex-col gap-2 mb-4 bg-blue-100 w-full p-4 rounded-xl text-xs capitalize text-slate-700">
          <p className="flex justify-between"><span>Reference:</span> {details.reference}</p>
          <p className="flex justify-between"><span>Property:</span> {details.propertyTitle}</p>
          <p className="flex justify-between"><span>Inspection Code:</span> {details.code}{details.amount}</p>
          <p className="flex justify-between"><span>Date:</span> {details.date}</p>
          <p className="flex justify-between"><span>Time:</span> {details.time}</p>
          <p className="flex justify-between"><span>Agent:</span> {details.agent}</p>
          <p className="flex justify-between"><span>location:</span> {details.location}</p>
        </div>

        <p className='text-gray-600 text-xs text-center'>You'll receive a reminder 24 hours before your inspection. The agent will contact you with the exact meeting point.</p>

        <a 
          href={`/property/${details.propertyId}`} 
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold w-full hover:bg-blue-700 transition text-center"
        >
          View Property Details
        </a>
      </div>
    </div>
  );
}