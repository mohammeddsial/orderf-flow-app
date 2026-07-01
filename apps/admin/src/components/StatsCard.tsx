import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};