import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-bright-sun-400 focus:ring-offset-2 focus:ring-offset-mine-shaft-950 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-bright-sun-400 text-black hover:bg-bright-sun-500",
    secondary: "bg-mine-shaft-800 text-mine-shaft-50 hover:bg-mine-shaft-700",
    outline: "border border-mine-shaft-600 bg-transparent hover:bg-mine-shaft-800 text-mine-shaft-100 hover:text-mine-shaft-50",
    ghost: "hover:bg-mine-shaft-800 text-mine-shaft-300 hover:text-mine-shaft-50",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-6 py-2",
    lg: "h-14 px-8 text-lg",
    icon: "h-12 w-12 p-2",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};