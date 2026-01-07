import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from './utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, subtitle, className, children }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('text-center mb-12 md:mb-16', className)}
    >
      <div className="relative inline-block">
        {/* Decorative underline with animation */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#6b8e6b] via-[#8b6f47] to-[#6b8e6b] rounded-full"
        />
        
        {/* Main heading with outline effect */}
        <h2 className="relative text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#3d2817] mb-4 tracking-tight">
          {/* Outline effect using multiple text shadows */}
          <span 
            className="relative z-10 inline-block"
            style={{
              textShadow: `
                -2px -2px 0 #8b6f47,
                2px -2px 0 #8b6f47,
                -2px 2px 0 #8b6f47,
                2px 2px 0 #8b6f47,
                0 0 10px rgba(139, 111, 71, 0.3),
                0 0 20px rgba(107, 142, 107, 0.2)
              `,
            }}
          >
            {title}
          </span>
        </h2>
      </div>
      
      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl lg:text-2xl text-[#2c1810]/80 font-medium mt-4"
        >
          {subtitle}
        </motion.p>
      )}
      
      {/* Additional children content */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

