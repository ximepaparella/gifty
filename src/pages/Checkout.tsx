
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Building, Check, Landmark, Banknote, ArrowRight, ArrowLeft } from 'lucide-react';

type CheckoutStep = 'customer-info' | 'payment' | 'confirmation';

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

type PaymentMethod = 'cash' | 'transfer' | 'mercadopago';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('customer-info');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateCustomerInfo = () => {
    // Simple validation for required fields
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'country'];
    const missingFields = requiredFields.filter(field => !customerInfo[field as keyof CustomerInfo]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields.`,
        variant: "destructive",
      });
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (currentStep === 'customer-info') {
      if (!validateCustomerInfo()) return;
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation');
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('customer-info');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('payment');
    }
  };
  
  const handleSubmitOrder = () => {
    // Simulate a payment process
    const isSuccess = Math.random() > 0.2; // 80% success rate for demo purposes
    
    if (isSuccess) {
      // Clear the cart on successful order
      clearCart();
      // Redirect to success page
      navigate('/checkout/success', { 
        state: { 
          orderInfo: {
            items,
            totalPrice,
            customerInfo,
            paymentMethod,
            orderId: `ORD-${Date.now()}`,
            orderDate: new Date().toISOString(),
          } 
        } 
      });
    } else {
      // Redirect to error page
      navigate('/checkout/error', { 
        state: { 
          error: "Payment processing failed",
          reason: "The payment could not be processed. Please try again or use a different payment method." 
        } 
      });
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'customer-info' ? 'bg-gifty-500 text-white' : 'bg-white text-gifty-500 border border-gifty-500'}`}>
            1
          </div>
          <div className={`h-1 w-12 sm:w-24 ${currentStep === 'customer-info' ? 'bg-gray-300' : 'bg-gifty-500'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-gifty-500 text-white' : currentStep === 'confirmation' ? 'bg-white text-gifty-500 border border-gifty-500' : 'bg-white text-gray-400 border border-gray-300'}`}>
            2
          </div>
          <div className={`h-1 w-12 sm:w-24 ${currentStep === 'confirmation' ? 'bg-gifty-500' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'confirmation' ? 'bg-gifty-500 text-white' : 'bg-white text-gray-400 border border-gray-300'}`}>
            3
          </div>
        </div>
      </div>
    );
  };
  
  const renderCustomerInfoStep = () => {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              {isLoggedIn 
                ? "Your information is pre-filled based on your account." 
                : "Enter your contact and shipping information."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName"
                  name="fullName"
                  value={customerInfo.fullName}
                  onChange={handleCustomerInfoChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input 
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleCustomerInfoChange}
                placeholder="+1 (123) 456-7890"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea 
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleCustomerInfoChange}
                placeholder="123 Main St, Apt 4B"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input 
                  id="city"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleCustomerInfoChange}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip/Postal Code</Label>
                <Input 
                  id="zipCode"
                  name="zipCode"
                  value={customerInfo.zipCode}
                  onChange={handleCustomerInfoChange}
                  placeholder="10001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input 
                  id="country"
                  name="country"
                  value={customerInfo.country}
                  onChange={handleCustomerInfoChange}
                  placeholder="United States"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/cart')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            <Button 
              onClick={handleNextStep}
              className="bg-gifty-500 hover:bg-gifty-600 text-white"
            >
              Continue to Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderPaymentStep = () => {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Select your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                  <Banknote className="h-5 w-5 text-gifty-500" />
                  <div>
                    <p className="font-medium">Cash</p>
                    <p className="text-sm text-gray-500">Pay at our physical store location</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer">
                  <Landmark className="h-5 w-5 text-gifty-500" />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Pay via bank transfer (details will be provided)</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <RadioGroupItem value="mercadopago" id="mercadopago" />
                <Label htmlFor="mercadopago" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-5 w-5 text-gifty-500" />
                  <div>
                    <p className="font-medium">Mercado Pago</p>
                    <p className="text-sm text-gray-500">Pay with credit/debit card via Mercado Pago</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Information
            </Button>
            <Button 
              onClick={handleNextStep}
              className="bg-gifty-500 hover:bg-gifty-600 text-white"
            >
              Review Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderConfirmationStep = () => {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Review Your Order</CardTitle>
            <CardDescription>
              Please review your order details before finalizing your purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Items</h3>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.store}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p>${item.price.toFixed(2)} x {item.quantity}</p>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <p className="font-semibold text-lg">Total: ${totalPrice.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {customerInfo.fullName}</p>
                  <p><span className="font-medium">Email:</span> {customerInfo.email}</p>
                  <p><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
                  <p><span className="font-medium">Address:</span> {customerInfo.address}</p>
                  <p><span className="font-medium">City:</span> {customerInfo.city}</p>
                  {customerInfo.zipCode && (
                    <p><span className="font-medium">Zip Code:</span> {customerInfo.zipCode}</p>
                  )}
                  <p><span className="font-medium">Country:</span> {customerInfo.country}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Payment Method</h3>
                <div className="text-sm">
                  {paymentMethod === 'cash' && (
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-gifty-500" />
                      <p>Cash payment at our physical store</p>
                    </div>
                  )}
                  {paymentMethod === 'transfer' && (
                    <div className="flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-gifty-500" />
                      <p>Bank transfer (details will be sent via email)</p>
                    </div>
                  )}
                  {paymentMethod === 'mercadopago' && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gifty-500" />
                      <p>Mercado Pago</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Payment
            </Button>
            <Button 
              onClick={handleSubmitOrder}
              className="bg-gifty-500 hover:bg-gifty-600 text-white"
            >
              <Check className="mr-2 h-4 w-4" />
              Complete Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">Checkout</h1>
          
          {renderStepIndicator()}
          
          {currentStep === 'customer-info' && renderCustomerInfoStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'confirmation' && renderConfirmationStep()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
