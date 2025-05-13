'use client';

import { Card } from '@/components/ui/card';
// import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import IconBadge from '../common/IconBadge';
// import FrostedGlassIcon from './frosted-glass-icon';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  accentColor = 'rgba(120, 120, 255, 0.5)',
}: FeatureCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Adjust accent color opacity for dark mode
  const adjustedAccentColor = isDark
    ? accentColor.replace(
        /rgba$$(\d+),\s*(\d+),\s*(\d+),\s*[\d.]+$$/,
        'rgba($1, $2, $3, 0.3)',
      )
    : accentColor;

  return (
    <div className="relative group h-full">
      <Card className="h-full overflow-hidden bg-background/60 backdrop-blur-sm border transition-all duration-300 hover:shadow-lg dark:bg-background/80">
        <div className="p-6 h-full flex flex-col relative z-10">
          <IconBadge
            icon={icon}
            color={accentColor}
            className="mb-4 self-start"
          />

          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground flex-grow">{description}</p>
        </div>

        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30" />
      </Card>
    </div>
  );
}
