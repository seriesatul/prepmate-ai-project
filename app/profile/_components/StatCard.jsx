import React from 'react';

const StatCard = ({ icon: Icon, label, value, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="mt-4 text-center">
        <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
        <p className="text-base font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;