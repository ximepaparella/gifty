import React, { useEffect, useState, useMemo, memo } from 'react';
import { OrderFormData } from '../types';
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
  storeInfo 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('https://placehold.co/200x200/png');
  const [hasLoggedOnce, setHasLoggedOnce] = useState(false);

  // Only render if we have data
  if (!data || !data.voucher) {
    return <div>Preview not available</div>;
  }

  // Extract QR code from the data if available - with proper dependency tracking
  useEffect(() => {
    // Check if the voucher object has any QR code property
    const voucherObject = data.voucher as any; // Cast to any to access possible properties
    
    if (voucherObject && typeof voucherObject === 'object') {
      // Check for QR code in different possible locations
      if (voucherObject.qrCode) {
        setQrCodeUrl(voucherObject.qrCode);
        if (!hasLoggedOnce) {
          console.log("Found QR code in voucher:", voucherObject.qrCode);
          setHasLoggedOnce(true);
        }
      } else if (voucherObject.code) {
        // If we have a code but no QR, we generate a URL to a QR code service
        const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${voucherObject.code}`;
        setQrCodeUrl(qrServiceUrl);
        if (!hasLoggedOnce) {
          console.log("Generated QR code URL from code:", qrServiceUrl);
          setHasLoggedOnce(true);
        }
      }
    }
  }, [data.voucher, hasLoggedOnce]);

  // Memoize the template props to prevent unnecessary recalculations
  const templateProps = useMemo(() => {
    // Format date for display in template
    const expirationDate = data.voucher.expirationDate 
      ? new Date(data.voucher.expirationDate).toLocaleDateString() 
      : '';

    // Get code safely from different possible sources
    const voucherCodeValue = voucherCode || 
      ((data.voucher as any).code ? (data.voucher as any).code : 'PREVIEW1234');

    // Only log once after mount or major prop changes
    if (!hasLoggedOnce) {
      console.log('Rendering template:', template, 'with code:', voucherCodeValue);
      console.log('QR Code URL:', qrCodeUrl);
      console.log('Product info:', productInfo?.name);
      console.log('Store info:', storeInfo?.name);
    }

    // Prepare the props that the templates expect
    return {
      // Use actual store name if available, otherwise fallback
      storeName: storeInfo?.name || 'Store Name',
      // Use actual product name if available, otherwise fallback
      productName: productInfo?.name || 'Product Name',
      message: data.voucher.message || '',
      senderName: data.voucher.senderName || '',
      senderEmail: data.voucher.senderEmail || '',
      receiverName: data.voucher.receiverName || '',
      receiverEmail: data.voucher.receiverEmail || '',
      expirationDate: expirationDate,
      code: voucherCodeValue,
      qrCode: qrCodeUrl,
      // Use actual store data if available, with fallbacks for missing properties
      storeAddress: storeInfo?.address || '123 Store Address St, City',
      storeEmail: storeInfo?.email || 'store@example.com',
      storePhone: storeInfo?.phone || '+1 (123) 456-7890',
      storeSocial: '@storename', // Default value since social might not be in the Store type
      storeLogo: 'https://placehold.co/150x150/png', // Default logo
    };
  }, [
    data.voucher, 
    voucherCode, 
    qrCodeUrl, 
    productInfo, 
    storeInfo, 
    template,
    hasLoggedOnce
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