import React from 'react';
import { Layout } from 'antd';
import Head from 'next/head';
import Navbar from '@/features/website/components/Navbar';
import Footer from '@/features/website/components/Footer';

// Import the dedicated Tailwind CSS file
import '@/styles/tailwind.css';

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
      
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ paddingTop: transparentHeader ? '0' : '64px' }}>
          {children}
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default ClientLayout; 