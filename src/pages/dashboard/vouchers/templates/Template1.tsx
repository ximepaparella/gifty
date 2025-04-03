import React from 'react';
import { StoreSocial } from '@/features/stores/types';

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
  storeSocial: StoreSocial;
  storeLogo: string | null;
  expirationDate: string;
  code: string;
  qrCode: string;
}

const Template1: React.FC<TemplateProps> = ({
  senderName,
  receiverName,
  message,
  productName,
  storeName,
  storeAddress,
  storeEmail,
  storePhone,
  storeSocial,
  storeLogo,
  expirationDate,
  code,
  qrCode
}) => {
  return (
    <div className="voucher-preview" style={{ maxHeight: '500px', overflow: 'auto' }}>
      <div style={{
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '20px auto',
          border: '1px solid #ddd',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          display: 'flex',
          backgroundColor: '#fff',
        }}>
          <div style={{
            width: '240px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRight: '1px solid #eee',
          }}>
            <img src={storeLogo || '/placeholder-logo.png'} alt={storeName} style={{
              maxWidth: '150px',
              marginBottom: '20px',
            }} />
            <div style={{
              marginTop: '40px',
              fontSize: '14px',
              lineHeight: 1.5,
            }}>
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                <p style={{ margin: '5px 0' }}>
                  <span style={{ marginRight: '10px', fontSize: '18px' }}>📍</span>
                  <span>{storeAddress}</span>
                </p>
                <p style={{ margin: '5px 0' }}>
                  <span style={{ marginRight: '10px', fontSize: '18px' }}>✉️</span>
                  <span>{storeEmail}</span>
                </p>
                <p style={{ margin: '5px 0' }}>
                  <span style={{ marginRight: '10px', fontSize: '18px' }}>📞</span>
                  <span>{storePhone}</span>
                </p>
                <div style={{ margin: '10px 0' }}>
                  {storeSocial.facebook && (
                    <p style={{ margin: '5px 0' }}>
                      <span style={{ marginRight: '10px', fontSize: '18px' }}>📱</span>
                      <span>Facebook: {storeSocial.facebook}</span>
                    </p>
                  )}
                  {storeSocial.instagram && (
                    <p style={{ margin: '5px 0' }}>
                      <span style={{ marginRight: '10px', fontSize: '18px' }}>📱</span>
                      <span>Instagram: {storeSocial.instagram}</span>
                    </p>
                  )}
                  {storeSocial.tiktok && (
                    <p style={{ margin: '5px 0' }}>
                      <span style={{ marginRight: '10px', fontSize: '18px' }}>📱</span>
                      <span>TikTok: {storeSocial.tiktok}</span>
                    </p>
                  )}
                  {storeSocial.youtube && (
                    <p style={{ margin: '5px 0' }}>
                      <span style={{ marginRight: '10px', fontSize: '18px' }}>📱</span>
                      <span>YouTube: {storeSocial.youtube}</span>
                    </p>
                  )}
                  {storeSocial.others?.map((social, index) => (
                    <p key={index} style={{ margin: '5px 0' }}>
                      <span style={{ marginRight: '10px', fontSize: '18px' }}>📱</span>
                      <span>{social.name}: {social.url}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#000',
            color: '#fff',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>FROM:</div>
              <div style={{ fontSize: '16px', marginBottom: '15px' }}>{senderName}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>TO:</div>
              <div style={{ fontSize: '16px', marginBottom: '15px' }}>{receiverName}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>PRODUCT:</div>
              <div style={{ fontSize: '16px', marginBottom: '15px' }}>{productName}</div>
            </div>
            
            <div style={{ margin: '30px 0', textAlign: 'center', fontSize: '18px', lineHeight: 1.5 }}>
              <div>Message: {message}</div>
            </div>
            
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              {qrCode ? (
                <img src={qrCode} alt="Scan to redeem" style={{ maxWidth: '150px' }} />
              ) : (
                <div style={{ width: '150px', height: '150px', backgroundColor: '#333', margin: '0 auto' }}></div>
              )}
            </div>
            
            <div style={{ fontSize: '14px', marginTop: '20px' }}>expiration date: {expirationDate}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px', textAlign: 'right' }}>code: {code}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1; 