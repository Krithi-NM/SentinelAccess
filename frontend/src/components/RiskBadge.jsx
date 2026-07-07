import React from 'react';

const RiskBadge = ({ tier }) => {
  const getBadgeClass = () => {
    switch (tier?.toLowerCase()) {
      case 'low': return 'badge-low';
      case 'medium': return 'badge-medium';
      case 'high': return 'badge-high';
      case 'critical': return 'badge-critical';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {tier}
    </span>
  );
};

export default RiskBadge;
