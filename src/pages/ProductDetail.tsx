import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, MapPin, Clock, Calendar, Gift } from 'lucide-react';
import VoucherFormModal from '@/components/VoucherFormModal';

// Mock product data
const mockProducts = [
  { 
    id: 1, 
    name: 'Spa Day Package', 
    store: 'Serenity Spa', 
    price: 120, 
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2940&auto=format&fit=crop',
    description: 'Give the gift of relaxation with our premium spa day package. Includes a full-body massage, facial treatment, and access to all spa facilities for a day of complete rejuvenation.',
    location: '123 Tranquil Ave, Relaxville',
    duration: '3 hours',
    validityPeriod: '12 months from purchase',
    rating: 4.8,
    reviews: 156
  },
  { 
    id: 2, 
    name: 'Fine Dining Experience', 
    store: 'Gourmet Restaurant', 
    price: 150, 
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940&auto=format&fit=crop',
    description: 'Treat someone special to an unforgettable dining experience with our 5-course tasting menu prepared by award-winning chefs, paired with premium wines in an elegant atmosphere.',
    location: '456 Culinary Blvd, Tasteville',
    duration: '2.5 hours',
    validityPeriod: '6 months from purchase',
    rating: 4.9,
    reviews: 203
  },
  { 
    id: 3, 
    name: 'Wine Tasting Tour', 
    store: 'Vineyard Ventures', 
    price: 80, 
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2940&auto=format&fit=crop',
    description: 'A guided tour through scenic vineyards with expert commentary and tastings of premium wines. Includes transportation, light appetizers, and a complimentary wine glass.',
    location: '789 Grape Lane, Vineville',
    duration: '4 hours',
    validityPeriod: '9 months from purchase',
    rating: 4.7,
    reviews: 118
  },
  { 
    id: 4, 
    name: 'Photography Session', 
    store: 'Capture Moments', 
    price: 200, 
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2932&auto=format&fit=crop',
    description: 'Professional photography session with an experienced photographer. Package includes a 1-hour shoot at your chosen location, digital editing, and 10 high-resolution digital images.',
    location: 'Various locations available',
    duration: '1 hour',
    validityPeriod: '12 months from purchase',
    rating: 4.6,
    reviews: 92
  },
  { 
    id: 5, 
    name: 'Cooking Class', 
    store: 'Culinary Arts', 
    price: 90, 
    image: 'https://images.unsplash.com/photo-1556909114-44e3e9699e2b?q=80&w=2940&auto=format&fit=crop',
    description: 'Learn to cook like a professional chef with our hands-on cooking class. Participants will prepare a complete three-course meal under expert guidance and enjoy their creations afterward.',
    location: '101 Chef Street, Flavortown',
    duration: '3 hours',
    validityPeriod: '6 months from purchase',
    rating: 4.8,
    reviews: 87
  },
  { 
    id: 6, 
    name: 'Adventure Day Trip', 
    store: 'Wild Expeditions', 
    price: 140, 
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2940&auto=format&fit=crop',
    description: 'An adrenaline-packed day of outdoor adventures including zip-lining, rock climbing, and white-water rafting. All equipment and safety gear provided, along with lunch and refreshments.',
    location: 'Adventure Park, Thrill City',
    duration: '6 hours',
    validityPeriod: '12 months from purchase',
    rating: 4.9,
    reviews: 142
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Find the product with the matching ID
  const product = mockProducts.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const handleBuyNow = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative h-[400px] md:h-full overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300"
                  onClick={() => toast({
                    title: "Added to Favorites",
                    description: `${product.name} has been added to your favorites.`,
                    duration: 3000,
                  })}
                >
                  <Heart className="h-6 w-6 text-gifty-500" />
                </button>
              </div>
              
              {/* Product Info */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col h-full">
                  <div className="mb-auto">
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-gray-900">{product.name}</h1>
                    <p className="text-lg text-gifty-500 mb-3">{product.store}</p>
                    
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600">({product.reviews} reviews)</span>
                    </div>
                    
                    <p className="text-gray-700 mb-6">{product.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gifty-500" />
                        <span className="text-gray-700">{product.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gifty-500" />
                        <span className="text-gray-700">{product.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gifty-500" />
                        <span className="text-gray-700">{product.validityPeriod}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-gifty-500" />
                        <span className="text-gray-700">Digital Voucher</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-3xl font-bold text-gray-900">${product.price}</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        className="w-full md:w-auto md:min-w-[200px] bg-gifty-500 hover:bg-gifty-600 text-white"
                        size="lg"
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <VoucherFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
