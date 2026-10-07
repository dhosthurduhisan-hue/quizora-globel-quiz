import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', text: 'text-base' },
    md: { box: 'w-9 h-9', text: 'text-xl' },
    lg: { box: 'w-12 h-12', text: 'text-2xl' },
    xl: { box: 'w-16 h-16', text: 'text-3xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon Mark */}
      <div className={`relative ${currentSize.box} rounded-xl overflow-hidden shrink-0 shadow-md shadow-indigo-600/30 group`}>
        {/* Generated Brand Logo */}
        <img
          src="/src/assets/images/quizora_brand_logo_1791365581642.jpg"
          alt="Quizora Logo"
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback to SVG if image fails to load
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        {/* Subtle border ring */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/15 pointer-events-none" />
      </div>

      {showText && (
        <span className={`font-display font-extrabold tracking-tight text-white ${currentSize.text} leading-none`}>
          Quizora
        </span>
      )}
    </div>
  );
};
