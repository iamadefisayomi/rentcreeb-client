"use client";

import React from 'react';

interface CircularProgressProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  label,
  size = 35,
  strokeWidth = 3,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          stroke="#e5e7eb"
          fill="transparent"
        />
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 stroke-primary"
        />
      </svg>
      
      {/* Text content centered absolutely over the SVG */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[10px] font-medium text-slate-800">
        <span className='text-4xl font-bold'>{Math.round(progress)}%</span>
        <span className='capitalize'>{label}</span>
      </div>
    </div>
  );
};

export default CircularProgress;
