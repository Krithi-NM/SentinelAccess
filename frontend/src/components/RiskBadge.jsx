import React from 'react';

const RiskBadge = ({ tier }) => {
  const getBadgeClass = () => {
    switch (tier?.toLowerCase()) {
      case 'low': return 'badge-low border-risk-low/20';
      case 'medium': return 'badge-medium border-risk-medium/20';
      case 'high': return 'badge-high border-risk-high/20';
      case 'critical': return 'badge-critical border-risk-critical/20';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <span className={`badge border-2 shadow-sm ${getBadgeClass()}`}>
      {String(tier || 'Unknown')}
    </span>
  );
};

export default RiskBadge;
