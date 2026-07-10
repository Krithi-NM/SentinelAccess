import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatCard = ({ label, value, colorClass, icon: Icon, premium, small }) => {
  // Resolve possible default exports (some bundlers export components as { default: Component })
  const ResolvedIcon = Icon && (Icon.default ? Icon.default : Icon);
  const CountUpComponent = CountUp && (CountUp.default ? CountUp.default : CountUp);
  const isCountUpRenderable = typeof CountUpComponent === 'function' || (CountUpComponent && CountUpComponent.$$typeof);
  const formattedValue = typeof value === 'number' ? new Intl.NumberFormat().format(value) : value;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`card h-full flex flex-col justify-between border-l-[8px] relative overflow-hidden ${premium ? 'card-premium pt-10 pb-10' : 'pt-8 pb-8'}`}
      style={{ borderLeftColor: colorClass }}
    >
      {premium && (
        <div 
          className="absolute top-0 right-0 p-6 opacity-5 animate-risk-pulse"
          style={{ color: colorClass }}
        >
          {ResolvedIcon && <ResolvedIcon size={140} />}
        </div>
      )}
      
      <div className="flex justify-between items-start relative z-10 px-2">
        <span className={`font-black uppercase tracking-[0.2em] ${small ? 'text-[10px] text-gray-400' : 'text-[12px] text-gray-500'}`}>
          {label}
        </span>
        {ResolvedIcon && !premium && <ResolvedIcon size={small ? 20 : 26} className="text-gray-300" />}
      </div>

      <div className="relative z-10 flex items-baseline gap-3 px-2">
        <span className={`font-display font-black text-primary ${premium ? 'text-8xl' : small ? 'text-4xl' : 'text-6xl'}`}>
          {typeof value === 'number' ? (isCountUpRenderable ? <CountUpComponent end={value} duration={2} separator="," /> : formattedValue) : value}
        </span>
        {premium && (
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Active</span>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Threats</span>
          </div>
        )}
        {small && typeof value === 'number' && label.includes('%') && (
          <span className="text-lg font-bold text-gray-400 -ml-2">%</span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
