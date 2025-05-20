import React from 'react';

    const ShimmerLoading = ({ lines = 3, className }) => {
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className={`h-4 bg-slate-300 dark:bg-slate-700 rounded ${i === 0 ? 'w-3/4' : i === 1 ? 'w-5/6' : 'w-1/2'}`}></div>
            </div>
          ))}
        </div>
      );
    };

    export default ShimmerLoading;