
import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Gifty has been a game-changer for our salon. Our clients love being able to gift our services, and it's opened up a whole new revenue stream for us.",
      author: "Alexandra Chen",
      role: "Owner",
      company: "Glow Beauty Salon",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      delay: "delay-0"
    },
    {
      quote: "The voucher system is incredibly easy to use, both for us and our customers. The professional design makes our small yoga studio look so much more established.",
      author: "David Miller",
      role: "Founder",
      company: "Serenity Yoga",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      delay: "delay-100"
    },
    {
      quote: "We've seen a 30% increase in new clients coming through gift vouchers. It's the best marketing tool we've ever invested in.",
      author: "Sarah Johnson",
      role: "Manager",
      company: "Urban Day Spa",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      delay: "delay-200"
    }
  ];

  return (
    <section id="testimonials" className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Trusted by business owners
          </h2>
          <p className="text-xl text-gray-600">
            See what other small businesses are saying about Gifty
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              image={testimonial.image}
              delay={testimonial.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
