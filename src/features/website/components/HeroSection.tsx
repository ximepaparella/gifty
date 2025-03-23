
import React from 'react';
import { ArrowRight, Gift, SparkleIcon } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden relative">
      {/* Background blobs */}
      <div className="blob-bg bg-gifty-300 w-[500px] h-[500px] top-0 left-[-200px]"></div>
      <div className="blob-bg bg-gifty-200 w-[400px] h-[400px] bottom-0 right-[-100px]"></div>
      
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="w-full md:w-1/2 space-y-6 animate-slide-in">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-gifty-100 text-gifty-700 text-sm font-medium">
              <SparkleIcon className="h-4 w-4" />
              <span>Introducing Gifty for Small Businesses</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold leading-tight">
              Transform services into <span className="text-gradient">the perfect gift</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Help your customers share the joy. Create beautiful digital gift vouchers for your services that are easy to give and delightful to receive.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#get-started" className="btn-primary">
                Start Creating Vouchers
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#how-it-works" className="btn-secondary">
                See How It Works
              </a>
            </div>
            
            <div className="pt-6">
              <p className="text-sm text-gray-500 mb-3">Trusted by local businesses</p>
              <div className="flex flex-wrap gap-6 items-center">
                {['Beauty Salon', 'Yoga Studio', 'Spa', 'Photography'].map((business, index) => (
                  <div 
                    key={index} 
                    className="text-gray-500 font-medium"
                  >
                    {business}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg animate-rotate-in">
              {/* Background decorative elements */}
              <div className="absolute top-0 -left-4 w-72 h-72 bg-gifty-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse-soft"></div>
              <div className="absolute -bottom-8 right-4 w-72 h-72 bg-gifty-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse-soft animation-delay-2000"></div>
              
              {/* Gift card mockup */}
              <div className="relative image-tilt">
                <div className="gift-voucher-card bg-white rounded-xl shadow-soft p-8 animate-float card-highlight">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Gift Voucher</p>
                      <h3 className="text-2xl font-display font-medium text-gray-900">Full Body Massage</h3>
                    </div>
                    <Gift className="text-gifty-500 h-8 w-8" />
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-base font-medium">Sarah</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="text-base font-medium">Michael</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Value</p>
                      <p className="text-xl font-display font-semibold text-gifty-600">$99.00</p>
                    </div>
                  </div>
                </div>
                
                {/* Second card slightly behind */}
                <div className="gift-voucher-card bg-white rounded-xl shadow-soft p-8 absolute -bottom-6 -right-6 -z-10 opacity-70 rotate-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Gift Voucher</p>
                      <h3 className="text-2xl font-display font-medium text-gray-900">Hair Styling</h3>
                    </div>
                    <Gift className="text-gifty-500 h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
