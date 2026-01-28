import React, { type ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-[#2D2626]">{value}</h3>
        {trend && <p className="mt-1 text-xs text-green-600">{trend}</p>}
      </div>
      <div className="rounded-full bg-[#F8F5F2] p-3 text-[#4B362F]">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
