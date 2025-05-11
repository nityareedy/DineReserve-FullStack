import React from 'react'

export const RestaurantCardShimmer = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="border rounded p-4 shadow animate-pulse"
          >
            <div className="mb-4 rounded bg-gray-300 h-48 w-full"></div>
            
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  