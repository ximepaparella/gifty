
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const CheckoutError = () => {
  const location = useLocation();
  const errorDetails = location.state?.error;
  const errorReason = location.state?.reason;
  
  // Redirect to home if no error info is present
  if (!errorDetails && !errorReason) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Payment Failed</h1>
            <p className="text-xl text-gray-600 mb-2">We're sorry, but there was an issue with your payment.</p>
            <p className="text-gray-600">{errorReason || "Please try again or contact customer support for assistance."}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4">What happened?</h2>
            <p className="mb-4">
              {errorDetails || "Your payment could not be processed. This could be due to:"}
            </p>
            
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Insufficient funds in your account</li>
              <li>Card has expired or was declined</li>
              <li>Incorrect payment information</li>
              <li>Bank security measures or restrictions</li>
              <li>Technical issues with the payment processor</li>
            </ul>
            
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Don't worry</p>
                  <p className="text-blue-700">
                    Your order has not been confirmed and you have not been charged. Your cart items are still saved.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cart">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Cart
              </Button>
            </Link>
            <Link to="/checkout">
              <Button className="bg-gifty-500 hover:bg-gifty-600 text-white" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutError;
