
import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTASection = () => {
  const benefits = [
    "No monthly subscription fees",
    "Pay only when you sell a voucher",
    "Free setup and customization",
    "Unlimited voucher designs"
  ];

  return (
    <section id="get-started" className="py-20 md:py-28 relative">
      {/* Background blobs */}
      <div className="blob-bg bg-gifty-200 w-[500px] h-[500px] bottom-[-200px] left-[10%]"></div>
      
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden gradient-card">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4 animate-fade-up">
                Ready to offer <span className="text-gradient">gift vouchers?</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 animate-fade-up delay-100">
                Start creating beautiful gift vouchers for your business today. No technical skills required.
              </p>
              
              <ul className="space-y-4 mb-8 animate-fade-up delay-200">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-gifty-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 animate-fade-up delay-300">
                <a href="#contact" className="btn-primary">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a href="#contact" className="btn-secondary">
                  Schedule a Demo
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 bg-gifty-500 flex items-center justify-center p-8 md:p-0">
              <div className="max-w-md animate-fade-up image-tilt">
                <img 
                  src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3" 
                  alt="Gift voucher example" 
                  className="rounded-lg shadow-md" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
