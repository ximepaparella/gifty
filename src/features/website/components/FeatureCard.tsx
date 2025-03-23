
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/features/website/utils/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconColor?: string;
  delay?: string;
  highlight?: boolean;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  className,
  iconColor = "text-gifty-500",
  delay = "delay-0",
  highlight = false
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-xl p-6 shadow-soft transition-custom hover:shadow-hover animate-fade-up gradient-card',
        highlight && 'card-highlight',
        delay,
        className
      )}
    >
      <div className={cn("rounded-full w-12 h-12 flex items-center justify-center bg-gifty-100 mb-5")}>
        <Icon className={cn("h-6 w-6", iconColor)} />
      </div>
      <h3 className="text-xl font-display font-medium text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
