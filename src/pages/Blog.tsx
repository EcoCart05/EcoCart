import React from 'react';

const Blog: React.FC = () => (
  <div className="container mx-auto py-12 px-4">
    <h1 className="text-4xl font-bold mb-6">EcoCart Blog</h1>
    <p className="mb-4">Welcome to the EcoCart Blog! Here you'll find the latest tips, news, and stories about sustainable living and eco-friendly shopping.</p>
    <div className="bg-green-50 rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Post: 5 Easy Ways to Reduce Plastic Waste</h2>
      <p className="mb-2">Reducing plastic waste is easier than you think! Here are some simple steps you can take today:</p>
      <ul className="list-disc ml-6 mb-2">
        <li>Use reusable bags and bottles</li>
        <li>Buy in bulk to reduce packaging</li>
        <li>Choose products with minimal or compostable packaging</li>
        <li>Recycle properly</li>
        <li>Support brands with sustainable practices</li>
      </ul>
      <p className="text-gray-600">Stay tuned for more updates and eco-friendly tips!</p>
    </div>
  </div>
);

export default Blog;
