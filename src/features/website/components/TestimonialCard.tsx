
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/features/website/utils/utils';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  stars?: number;
  image?: string;
  className?: string;
  delay?: string;
}

const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  stars = 5,
  image,
  className,
  delay = "delay-0"
}: TestimonialCardProps) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-xl p-6 shadow-soft transition-custom hover:shadow-hover animate-fade-up',
        delay,
        className
      )}
    >
      <div className="flex mb-4">
        {[...Array(stars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-gifty-400 text-gifty-400" />
        ))}
      </div>
      
      <blockquote className="text-gray-700 mb-6">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center">
        {image && (
          <img 
            src={image} 
            alt={author} 
            className="w-12 h-12 rounded-full object-cover mr-4" 
          />
        )}
        <div>
          <h4 className="font-medium text-gray-900">{author}</h4>
          <p className="text-sm text-gray-500">{role}, {company}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
