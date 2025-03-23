import React from 'react';
import { Layout } from 'antd';
import Head from 'next/head';
import Navbar from '@/features/website/components/Navbar';
import Footer from '@/features/website/components/Footer';

// Import the client-specific CSS
import '@/styles/client.css';

const { Content } = Layout;

interface ClientLayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
  title?: string;
  description?: string;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ 
  children, 
  transparentHeader = false,
  title = 'Gifty - Gift Experiences',
  description = 'Discover, purchase, and gift unique experiences to your loved ones with Gifty.'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      
      {/* Apply the .tailwind class to scope Tailwind styles */}
      <div className="tailwind">
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar transparent={transparentHeader} />
          <Content style={{ paddingTop: transparentHeader ? '0' : '64px' }}>
            {children}
          </Content>
          <Footer />
        </Layout>
      </div>
    </>
  );
};

export default ClientLayout; 