import React, { type ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-textMuted">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-textMain">{value}</h3>
        {trend && <p className="mt-1 text-xs text-green-600">{trend}</p>}
      </div>
      <div className="rounded-full bg-background p-3 text-primary">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
