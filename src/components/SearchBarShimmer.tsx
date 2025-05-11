import React from 'react'

export const SearchBarShimmer = () => {
    return (
      <div className="w-full px-4 py-2 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
          <div className="flex-shrink-0">
            <div className="h-10 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
};