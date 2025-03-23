
import React from 'react';
import FeatureCard from './FeatureCard';
import { Palette, CreditCard, Zap, GiftIcon, SmileIcon, BarChart } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Palette,
      title: "Beautiful Designs",
      description: "Create stunning gift vouchers that reflect your brand with our easy-to-use designer.",
      delay: "delay-0",
      highlight: true
    },
    {
      icon: CreditCard,
      title: "Simple Payments",
      description: "Your customers can buy and send gift vouchers in just a few clicks with secure payments.",
      delay: "delay-100"
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Gift vouchers are delivered instantly via email, ready to be printed or presented digitally.",
      delay: "delay-200"
    },
    {
      icon: GiftIcon,
      title: "Customizable",
      description: "Personalize each voucher with custom messages, imagery, and your unique branding.",
      delay: "delay-300",
      highlight: true
    },
    {
      icon: SmileIcon,
      title: "Customer Friendly",
      description: "Intuitive redemption process makes it easy for gift recipients to use their vouchers.",
      delay: "delay-400"
    },
    {
      icon: BarChart,
      title: "Track Sales",
      description: "Monitor voucher sales, redemptions, and revenue with our simple dashboard.",
      delay: "delay-500"
    }
  ];

  return (
    <section id="features" className="section relative">
      {/* Background blobs */}
      <div className="blob-bg bg-gifty-100 w-[600px] h-[600px] top-[20%] right-[-300px]"></div>
      
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Everything you need for <span className="text-gradient">gift vouchers</span>
          </h2>
          <p className="text-xl text-gray-600">
            Gifty makes it simple for small businesses to offer professional gift vouchers without the hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
              highlight={feature.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
