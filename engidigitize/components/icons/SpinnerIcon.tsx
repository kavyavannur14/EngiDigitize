import React from 'react';

export const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
    className={`animate-spin ${props.className || ''}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2a10 10 0 00-7.071 17.071M12 22a10 10 0 007.071-17.071"
      opacity="0.25"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2v0a10 10 0 0110 10h0"
      className="text-cyan-400"
    />
  </svg>
);
