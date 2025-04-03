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

const Template5: React.FC<TemplateProps> = ({
  senderName,
  senderEmail,
  receiverName,
  receiverEmail,
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
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          {storeLogo && (
            <img 
              src={storeLogo} 
              alt={storeName} 
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '50%',
                marginRight: '15px'
              }}
            />
          )}
          <div>
            <h2 style={{ margin: '0', color: '#333' }}>{storeName}</h2>
            <div style={{ color: '#666', fontSize: '14px' }}>
              <div>{storeAddress}</div>
              <div>{storeEmail} | {storePhone}</div>
              <div className="social-links" style={{ marginTop: '10px' }}>
                {storeSocial.facebook && (
                  <a 
                    href={storeSocial.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      marginRight: '15px',
                      color: '#1877f2',
                      textDecoration: 'none'
                    }}
                  >
                    Facebook
                  </a>
                )}
                {storeSocial.instagram && (
                  <a 
                    href={storeSocial.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      marginRight: '15px',
                      color: '#e4405f',
                      textDecoration: 'none'
                    }}
                  >
                    Instagram
                  </a>
                )}
                {storeSocial.tiktok && (
                  <a 
                    href={storeSocial.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      marginRight: '15px',
                      color: '#000000',
                      textDecoration: 'none'
                    }}
                  >
                    TikTok
                  </a>
                )}
                {storeSocial.youtube && (
                  <a 
                    href={storeSocial.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      marginRight: '15px',
                      color: '#ff0000',
                      textDecoration: 'none'
                    }}
                  >
                    YouTube
                  </a>
                )}
                {storeSocial.others?.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      marginRight: '15px',
                      color: '#666',
                      textDecoration: 'none'
                    }}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Gift Details</h3>
          <p style={{ margin: '5px 0', color: '#666' }}>
            <strong>Product:</strong> {productName}
          </p>
          <p style={{ margin: '5px 0', color: '#666' }}>
            <strong>From:</strong> {senderName} ({senderEmail})
          </p>
          <p style={{ margin: '5px 0', color: '#666' }}>
            <strong>To:</strong> {receiverName} ({receiverEmail})
          </p>
          <p style={{ margin: '15px 0', color: '#666' }}>
            <em>"{message}"</em>
          </p>
        </div>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Voucher Code</h3>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#007bff',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {code}
          </div>
          {qrCode && (
            <img 
              src={qrCode} 
              alt="QR Code" 
              style={{
                width: '150px',
                height: '150px',
                marginBottom: '15px'
              }}
            />
          )}
          <p style={{ margin: '5px 0', color: '#666' }}>
            <strong>Valid until:</strong> {expirationDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Template5; 