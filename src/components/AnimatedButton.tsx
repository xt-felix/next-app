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
  const baseClasses = 'px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-600 text-white hover:bg-gray-700',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white dark:text-primary-400 dark:border-primary-400'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
