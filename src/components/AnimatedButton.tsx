// components/AnimatedButton.tsx
'use client';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: AnimatedButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200';

  const variantStyles = {
    primary: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#6366f1',
      color: 'white',
    },
    outline: {
      border: '2px solid #10b981',
      color: '#10b981',
      backgroundColor: 'transparent',
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${baseClasses} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </motion.button>
  );
}
