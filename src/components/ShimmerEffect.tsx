import React from 'react';
import { SearchBarShimmer } from './SearchBarShimmer';
import { RestaurantCardShimmer } from './RestaurantCardShimmer';

const ShimmerEffect = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Restaurants</h1>
      <SearchBarShimmer />
      <RestaurantCardShimmer />
    </div>
  );
};

export default ShimmerEffect;