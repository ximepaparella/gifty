
import React from 'react';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';

interface PlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText?: string;
}

const PricingPlan: React.FC<PlanProps> = ({ 
  name, 
  price, 
  description, 
  features, 
  popular = false,
  buttonText = "Choose Plan" 
}) => {
  return (
    <div className={cn(
      "flex flex-col bg-white rounded-xl shadow-soft p-6 border border-gray-100 transition-all duration-300 hover:shadow-md",
      popular && "relative border-gifty-500 shadow-md transform -translate-y-2"
    )}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gifty-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-gray-500 ml-1">/month</span>}
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-gifty-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <a 
        href="#" 
        className={cn(
          "text-center py-3 px-4 rounded-lg font-medium transition-colors duration-300",
          popular 
            ? "bg-gifty-500 text-white hover:bg-gifty-600" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        )}
      >
        {buttonText}
      </a>
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for small businesses just getting started with gift vouchers.",
      features: [
        "Up to 10 vouchers per month",
        "3 basic voucher templates",
        "Email delivery",
        "Basic analytics",
        "Single user account"
      ],
      buttonText: "Start for Free"
    },
    {
      name: "Growth",
      price: "$29",
      description: "For growing businesses with increased voucher needs.",
      features: [
        "Up to 100 vouchers per month",
        "All 5 voucher templates",
        "Email & SMS delivery",
        "Detailed analytics",
        "Custom branding",
        "3 user accounts"
      ],
      popular: true
    },
    {
      name: "Pro",
      price: "$79",
      description: "For established businesses with high volume needs.",
      features: [
        "Unlimited vouchers",
        "All templates + custom designs",
        "Email, SMS & print delivery",
        "Advanced analytics & reports",
        "Priority support",
        "Unlimited user accounts",
        "API access"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                Simple, Transparent <span className="text-gradient">Pricing</span>
              </h1>
              <p className="text-xl text-gray-600">
                Choose the perfect plan for your business. No hidden fees, no commitments.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <PricingPlan key={index} {...plan} />
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-semibold mb-4">Looking for something custom?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We offer custom enterprise solutions for businesses with specific needs.
                Contact our sales team for a personalized quote.
              </p>
              <a href="#contact" className="btn-secondary">
                Contact Sales
              </a>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-display font-semibold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Can I upgrade my plan anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Do you offer a free trial?</h3>
                <p className="text-gray-600">Yes! You can use our Basic plan for free with no time limit, or try any paid plan free for 14 days.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Can I cancel my subscription?</h3>
                <p className="text-gray-600">You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Is there a setup fee?</h3>
                <p className="text-gray-600">No, there are no setup fees or hidden charges. You only pay the advertised price for your chosen plan.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Do you offer discounts?</h3>
                <p className="text-gray-600">We offer a 20% discount for annual billing on all paid plans, and special rates for non-profits.</p>
              </div>
            </div>
          </div>
        </section>
        
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default Pricing;
