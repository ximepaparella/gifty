import React, { useEffect, useState, useMemo, memo, useRef } from 'react';
import { OrderFormData, Order } from '../types';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import { Product } from '@/features/product/types';
import { Store } from '@/features/stores/types';

interface OrderPreviewProps {
  data: OrderFormData;
  template: string;
  voucherCode?: string; // Optional voucher code
  productInfo?: Product | null; // Product information
  storeInfo?: Store | null; // Store information
  selectedOrder?: Order | null; // Original order data
}

// Define the template props interface based on what the templates expect
interface TemplateProps {
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  message: string;
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

// Dynamically import templates to avoid SSR issues
const Template1 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template1'), {
  loading: () => <Spin />,
  ssr: false,
});

const Template2 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template2'), {
  loading: () => <Spin />,
  ssr: false,
});

const Template3 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template3'), {
  loading: () => <Spin />,
  ssr: false,
});

const Template4 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template4'), {
  loading: () => <Spin />,
  ssr: false,
});

const Template5 = dynamic(() => import('@/pages/dashboard/vouchers/templates/Template5'), {
  loading: () => <Spin />,
  ssr: false,
});

// Use memo to prevent unnecessary re-renders
const OrderPreview: React.FC<OrderPreviewProps> = memo(({ 
  data, 
  template, 
  voucherCode,
  productInfo,
  storeInfo,
  selectedOrder
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('https://placehold.co/200x200/png');
  const hasLoggedRef = useRef<boolean>(false);
  const renderCountRef = useRef<number>(0);

  // Only render if we have data
  if (!data || !data.voucher) {
    return <div>Preview not available</div>;
  }

  // Log render count to detect infinite loops
  renderCountRef.current += 1;
  if (renderCountRef.current % 10 === 1) {
    console.log(`OrderPreview render count: ${renderCountRef.current}`);
  }

  // Extract QR code from the data if available - with proper dependency tracking
  useEffect(() => {
    // Check if the voucher object has any QR code property
    const voucherObject = data.voucher as any; // Cast to any to access possible properties
    
    if (voucherObject && typeof voucherObject === 'object') {
      // Check for QR code in different possible locations
      if (voucherObject.qrCode) {
        setQrCodeUrl(voucherObject.qrCode);
        if (!hasLoggedRef.current) {
          console.log("Found QR code in voucher:", voucherObject.qrCode);
        }
      } else if (voucherCode || voucherObject.code) {
        // If we have a code but no QR, we generate a URL to a QR code service
        const code = voucherCode || voucherObject.code;
        const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${code}`;
        setQrCodeUrl(qrServiceUrl);
        if (!hasLoggedRef.current) {
          console.log("Generated QR code URL from code:", qrServiceUrl);
          console.log("Using code:", voucherCode || voucherObject.code);
        }
      }
    }
  }, [data.voucher, voucherCode]);

  // Fetch product and store info if needed
  useEffect(() => {
    if (!hasLoggedRef.current) {
      console.log("Current voucher data:", data.voucher);
      console.log("Original voucher object:", data.voucher);
      console.log("Data from form:", data);
      console.log("Sender data:", {
        senderName: data.voucher.senderName,
        senderEmail: data.voucher.senderEmail,
      });
      console.log("Receiver data:", {
        receiverName: data.voucher.receiverName,
        receiverEmail: data.voucher.receiverEmail,
      });
      console.log("Voucher code:", voucherCode);
      console.log("Product info provided:", productInfo);
      console.log("Store info provided:", storeInfo);
      
      // Mark that we've logged debug info
      hasLoggedRef.current = true;
    }
  }, [data, data.voucher, voucherCode, productInfo, storeInfo]);

  // Memoize the template props to prevent unnecessary recalculations
  const templateProps = useMemo(() => {
    // Format date for display in template
    const expirationDate = data.voucher.expirationDate 
      ? new Date(data.voucher.expirationDate).toLocaleDateString() 
      : '';

    // Get code safely from different possible sources
    // IMPORTANT: Use explicitly provided voucherCode first (from API), then fall back to code in data
    const actualCode = voucherCode || 
      ((data.voucher as any).code ? (data.voucher as any).code : 'PREVIEW1234');

    // Enhanced logging for debugging missing fields
    if (renderCountRef.current === 1 || renderCountRef.current % 20 === 0) {
      console.log('Rendering template:', template);
      console.log('Sender Name:', data.voucher.senderName);
      console.log('Sender Email:', data.voucher.senderEmail);
      console.log('Receiver Name:', data.voucher.receiverName);
      console.log('Receiver Email:', data.voucher.receiverEmail);
      console.log('Voucher Code:', actualCode);
      console.log('QR Code URL:', qrCodeUrl);
      console.log('Product info:', productInfo);
      console.log('Store info:', storeInfo);
    }

    // Try to access the raw properties from data.voucher directly
    const rawVoucher = data.voucher as any;

    // Prepare the props that the templates expect
    return {
      // Try multiple fallback options for product name
      productName: 
        (productInfo?.name) || 
        (rawVoucher.productName) || 
        'Gift Voucher',
      
      // Ensure to/from information is always present - use multiple fallback options
      senderName: 
        (rawVoucher.senderName && rawVoucher.senderName !== 'undefined') ? rawVoucher.senderName : 
        (selectedOrder?.voucher?.senderName) || 
        'Gift Sender',
      
      senderEmail: 
        (rawVoucher.senderEmail && rawVoucher.senderEmail !== 'undefined') ? rawVoucher.senderEmail : 
        (selectedOrder?.voucher?.senderEmail) || 
        'sender@example.com',
      
      receiverName: 
        (rawVoucher.receiverName && rawVoucher.receiverName !== 'undefined') ? rawVoucher.receiverName : 
        (selectedOrder?.voucher?.receiverName) || 
        'Gift Recipient',
      
      receiverEmail: 
        (rawVoucher.receiverEmail && rawVoucher.receiverEmail !== 'undefined') ? rawVoucher.receiverEmail : 
        (selectedOrder?.voucher?.receiverEmail) || 
        'recipient@example.com',
      
      // Use multiple fallbacks for store information
      storeName: 
        (storeInfo?.name) || 
        (rawVoucher.storeName) || 
        'Gift Store',
      
      // Remaining fields with improved fallbacks
      message: 
        (rawVoucher.message && rawVoucher.message !== 'undefined') ? rawVoucher.message : 
        'Enjoy your gift!',
        
      expirationDate: expirationDate || 'No expiration date',
      code: actualCode,
      qrCode: qrCodeUrl,
      
      // Store details with better fallbacks
      storeAddress: 
        (storeInfo?.address) || 
        (rawVoucher.storeAddress) || 
        '123 Store Street, City',
      
      storeEmail: 
        (storeInfo?.email) || 
        (rawVoucher.storeEmail) || 
        'store@example.com',
      
      storePhone: 
        (storeInfo?.phone) || 
        (rawVoucher.storePhone) || 
        '+1 (123) 456-7890',
      
      storeSocial: '@storename', // Default value
      storeLogo: 'https://placehold.co/150x150/png', // Default logo since Store doesn't have a logo property
    };
  }, [
    data.voucher, 
    voucherCode, 
    qrCodeUrl, 
    productInfo, 
    storeInfo, 
    template,
    renderCountRef.current,
    selectedOrder
  ]);

  // Render the selected template - ensure case consistency
  const templateName = template.charAt(0).toUpperCase() + template.slice(1).toLowerCase();
  
  switch (templateName) {
    case 'Template1':
      return <Template1 {...templateProps} />;
    case 'Template2':
      return <Template2 {...templateProps} />;
    case 'Template3':
      return <Template3 {...templateProps} />;
    case 'Template4':
      return <Template4 {...templateProps} />;
    case 'Template5':
      return <Template5 {...templateProps} />;
    default:
      return <Template1 {...templateProps} />;
  }
});

// Add displayName for debugging
OrderPreview.displayName = 'OrderPreview';

export default OrderPreview; 