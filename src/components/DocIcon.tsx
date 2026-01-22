import React from 'react';

export const DocIcon = ({ size = 24, opacity = 1, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" opacity={opacity}>
        <path d="M13 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L13 2Z" fill={color} fillOpacity="0.04" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M13 2V8H19" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
