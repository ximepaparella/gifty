
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Template1, Template2, Template3, Template4, Template5 } from './templates';
import { Mail, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export interface VoucherData {
  sender_name: string;
  sender_email: string;
  receiver_name: string;
  receiver_email: string;
  message: string;
  template: string;
  productName: string;
  storeName: string;
  storeAddress: string;
  storeEmail: string;
  storePhone: string;
  storeSocial: string;
  storeLogo: string;
  expirationDate: string;
  code: string;
  qrCode: string;
}

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    store: string;
    price: number;
    image: string;
  };
}

const VoucherFormModal: React.FC<VoucherFormModalProps> = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [voucherData, setVoucherData] = useState<VoucherData>({
    sender_name: '',
    sender_email: '',
    receiver_name: '',
    receiver_email: '',
    message: '',
    template: '1',
    productName: product.name,
    storeName: product.store,
    storeAddress: '123 Main St, Anytown, USA',
    storeEmail: 'contact@example.com',
    storePhone: '(555) 123-4567',
    storeSocial: '@store_social',
    storeLogo: '/placeholder.svg',
    expirationDate: '12/31/2024',
    code: 'GIFT123456',
    qrCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVoucherData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (value: string) => {
    setVoucherData(prev => ({
      ...prev,
      template: value
    }));
  };

  const handleContinue = () => {
    // Add to cart with personalized details
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      store: product.store,
    });
    
    toast({
      title: "Voucher personalized!",
      description: "Proceeding to checkout...",
    });
    
    // Close the modal
    onClose();
    
    // Navigate to checkout
    navigate('/checkout');
  };

  const renderTemplatePreview = () => {
    const commonProps = {
      ...voucherData
    };

    switch (voucherData.template) {
      case '1':
        return <Template1 {...commonProps} />;
      case '2':
        return <Template2 {...commonProps} />;
      case '3':
        return <Template3 {...commonProps} />;
      case '4':
        return <Template4 {...commonProps} />;
      case '5':
        return <Template5 {...commonProps} />;
      default:
        return <Template1 {...commonProps} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalize Your Gift Voucher</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-1.5">
                <User className="h-4 w-4 text-gifty-500" />
                <span>From (Your Name)</span>
              </Label>
              <Input 
                name="sender_name"
                value={voucherData.sender_name}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-1.5">
                <Mail className="h-4 w-4 text-gifty-500" />
                <span>Your Email</span>
              </Label>
              <Input 
                name="sender_email"
                value={voucherData.sender_email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                type="email"
              />
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-1.5">
                <User className="h-4 w-4 text-gifty-500" />
                <span>To (Recipient's Name)</span>
              </Label>
              <Input 
                name="receiver_name"
                value={voucherData.receiver_name}
                onChange={handleInputChange}
                placeholder="Recipient's name"
              />
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-1.5">
                <Mail className="h-4 w-4 text-gifty-500" />
                <span>Recipient's Email</span>
              </Label>
              <Input 
                name="receiver_email"
                value={voucherData.receiver_email}
                onChange={handleInputChange}
                placeholder="recipient.email@example.com"
                type="email"
              />
            </div>
            
            <div>
              <Label className="block mb-1.5">Personal Message</Label>
              <Textarea 
                name="message"
                value={voucherData.message}
                onChange={handleInputChange}
                placeholder="Add a personal message for the recipient..."
                rows={4}
              />
            </div>
            
            <div>
              <Label className="block mb-1.5">Template Style</Label>
              <Select 
                value={voucherData.template} 
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Classic Black</SelectItem>
                  <SelectItem value="2">Purple Elegance</SelectItem>
                  <SelectItem value="3">Gradient Purple</SelectItem>
                  <SelectItem value="4">Golden Luxury</SelectItem>
                  <SelectItem value="5">Blue Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border">
            <h3 className="text-xl font-medium mb-4">Voucher Preview</h3>
            <div className="mt-4 rounded-lg border overflow-hidden">
              {renderTemplatePreview()}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-gifty-500 hover:bg-gifty-600 text-white"
            onClick={handleContinue}
          >
            Continue to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoucherFormModal;
