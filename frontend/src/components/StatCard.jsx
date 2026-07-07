import React from 'react';

const StatCard = ({ label, value, colorClass, icon: Icon }) => {
  return (
    <div className="card flex flex-col justify-between h-32 border-l-4" style={{ borderLeftColor: colorClass }}>
      <div className="flex justify-between items-start">
        <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider">{label}</span>
        {Icon && <Icon size={20} className="text-gray-300" />}
      </div>
      <div className="text-3xl font-bold text-primary mt-2">{value}</div>
    </div>
  );
};

export default StatCard;
