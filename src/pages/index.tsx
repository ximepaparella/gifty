import React from 'react';
import ClientLayout from '@/layouts/ClientLayout';

const Index = () => {
  return (
    <ClientLayout
      title="Gifty - Gift Experiences That Create Lasting Memories"
      description="Discover, purchase, and gift unique experiences to your loved ones with Gifty. From spa days to cooking classes, find the perfect gift for any occasion."
      transparentHeader={true}
    >
      <div className="container mx-auto py-20">
        <h1 className="text-4xl font-bold text-center">Welcome to Gifty!</h1>
        <p className="text-xl text-center mt-4">
          The perfect platform for gifting unique experiences.
        </p>
      </div>
    </ClientLayout>
  );
};

export default Index;
