import React from 'react';
import ClientLayout from '@/layouts/ClientLayout';

const Store = () => {
  return (
    <ClientLayout
      title="Gifty Store - Explore Gift Experiences"
      description="Discover and purchase unique gift experiences for your loved ones. From spa days to adventures, find the perfect gift for any occasion."
    >
      <div className="container mx-auto py-20">
        <h1 className="text-4xl font-bold text-center">Gifty Store</h1>
        <p className="text-xl text-center mt-4">
          Explore our collection of unique experiences.
        </p>
      </div>
    </ClientLayout>
  );
};

export default Store;
