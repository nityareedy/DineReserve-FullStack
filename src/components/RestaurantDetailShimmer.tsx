import React from 'react';

const RestaurantDetailShimmer = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-video bg-gray-300 rounded-lg"></div>

        <div>
          <div className="h-10 bg-gray-300 mb-4 w-3/4 rounded"></div>
          <div className="h-20 bg-gray-300 mb-4 w-full rounded"></div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="h-4 bg-gray-300 mb-2 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 mb-2 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="h-6 bg-gray-300 mb-2 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-300 mb-2 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-gray-300 w-1/4 rounded"></div>
          <div className="h-10 bg-gray-300 w-32 rounded"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div 
              key={index} 
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
                <div className="h-4 bg-gray-300 w-1/6 rounded"></div>
              </div>
              <div className="h-12 bg-gray-300 mb-2 w-full rounded"></div>
              <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailShimmer;