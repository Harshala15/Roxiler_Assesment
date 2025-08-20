import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-6">
        <Loader2 className="h-12 w-12 animate-spin text-teal-500 mb-4" />
        <p className="text-gray-700 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
