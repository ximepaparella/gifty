
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Your Cart</h1>
          
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 inline-flex p-6 rounded-full mb-6">
                <ShoppingCart className="h-12 w-12 text-gifty-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any vouchers to your cart yet.</p>
              <Link to="/store">
                <Button size="lg">
                  Browse Vouchers
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Shopping Cart ({totalItems} items)</h2>
                  </div>
                  
                  <ul className="divide-y">
                    {items.map(item => (
                      <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.store}</p>
                            </div>
                            <div className="text-lg font-semibold">${item.price * item.quantity}</div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border rounded-md">
                              <button 
                                className="px-3 py-1 border-r"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button 
                                className="px-3 py-1 border-l"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button 
                              className="text-red-500 hover:text-red-700 transition-colors"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 font-semibold flex justify-between">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gifty-500 hover:bg-gifty-600 text-white"
                    size="lg"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
