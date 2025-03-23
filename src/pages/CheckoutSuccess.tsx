
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Calendar, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Banknote, 
  CreditCard, 
  Landmark 
} from 'lucide-react';

const CheckoutSuccess = () => {
  const location = useLocation();
  const orderInfo = location.state?.orderInfo;
  
  // Redirect to home if no order info is present
  if (!orderInfo) {
    return <Navigate to="/" replace />;
  }
  
  const formattedDate = new Date(orderInfo.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const getPaymentMethodIcon = () => {
    switch (orderInfo.paymentMethod) {
      case 'cash':
        return <Banknote className="h-5 w-5 text-gifty-500" />;
      case 'transfer':
        return <Landmark className="h-5 w-5 text-gifty-500" />;
      case 'mercadopago':
        return <CreditCard className="h-5 w-5 text-gifty-500" />;
      default:
        return null;
    }
  };
  
  const getPaymentMethodName = () => {
    switch (orderInfo.paymentMethod) {
      case 'cash':
        return 'Cash';
      case 'transfer':
        return 'Bank Transfer';
      case 'mercadopago':
        return 'Mercado Pago';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-600">Thank you for your purchase.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border mb-8">
            <div className="p-6 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order #{orderInfo.orderId}</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gifty-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{orderInfo.customerInfo.email}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gifty-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{orderInfo.customerInfo.phone}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gifty-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">
                          {orderInfo.customerInfo.address}, {orderInfo.customerInfo.city}
                          {orderInfo.customerInfo.zipCode && `, ${orderInfo.customerInfo.zipCode}`}, 
                          {orderInfo.customerInfo.country}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      {getPaymentMethodIcon()}
                      <div>
                        <p className="font-medium">Method</p>
                        <p className="text-gray-600">{getPaymentMethodName()}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gifty-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Status</p>
                        <p className="text-green-600 font-medium">Completed</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-4">Order Items</h3>
              <div className="overflow-hidden rounded-lg border mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Item</th>
                      <th className="px-4 py-3 text-right font-medium">Price</th>
                      <th className="px-4 py-3 text-right font-medium">Quantity</th>
                      <th className="px-4 py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orderInfo.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-10 w-10 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-gray-500">{item.store}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-medium">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right">Total</td>
                      <td className="px-4 py-3 text-right">${orderInfo.totalPrice.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Order Confirmation Email</p>
                    <p className="text-blue-700">
                      A confirmation with your order details and voucher codes has been sent to {orderInfo.customerInfo.email}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                Return to Home
              </Button>
            </Link>
            <Link to="/store">
              <Button className="bg-gifty-500 hover:bg-gifty-600 text-white" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
