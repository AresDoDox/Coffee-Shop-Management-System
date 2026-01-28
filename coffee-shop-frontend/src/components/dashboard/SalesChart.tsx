import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SalesChartProps {
  data: { name: string; totalSold: number; revenue: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-textMain">{t('top_selling')}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{ fill: '#4B5563', fontSize: 12 }} 
                axisLine={false}
                tickLine={false}
            />
            <Tooltip 
                cursor={{ fill: 'var(--color-background)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="totalSold" radius={[0, 4, 4, 0]}>
                {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
