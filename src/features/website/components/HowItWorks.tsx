
import React from 'react';
import { CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Set up your business profile",
      description: "Create your business account and customize your voucher branding in minutes.",
      image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      benefits: ["One-time setup", "Brand customization", "Multiple services"]
    },
    {
      number: "02",
      title: "Create your gift vouchers",
      description: "Design gift vouchers for your services with our intuitive drag-and-drop editor.",
      image: "https://images.unsplash.com/photo-1676632703044-ba6b2ebea7f4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      benefits: ["Beautiful templates", "Custom amounts", "Add your branding"]
    },
    {
      number: "03",
      title: "Share & sell your vouchers",
      description: "Customers purchase vouchers online and share them as gifts to friends and family.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      benefits: ["Digital delivery", "Social sharing", "Print options"]
    }
  ];

  return (
    <section id="how-it-works" className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            How Gifty works
          </h2>
          <p className="text-xl text-gray-600">
            Start offering professional gift vouchers in three simple steps
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16 animate-fade-up`}
            >
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-gifty-100 text-gifty-700 text-sm font-medium">
                  <span>Step {step.number}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-display font-semibold text-gray-900">
                  {step.title}
                </h3>
                
                <p className="text-lg text-gray-600">
                  {step.description}
                </p>
                
                <ul className="space-y-3 pt-2">
                  {step.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-gifty-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-soft">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105" 
                    style={{ height: '350px' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
