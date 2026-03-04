import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/stats.service';
import StatsCard from '../components/dashboard/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Auto-refetch every 30s
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 bg-background h-screen pt-10">{t('dashboard:error')}</div>;
  }

  const defaultStats = {
    revenue: 0,
    totalOrders: 0,
    topSelling: [],
    recentOrders: [],
  };

  const data = stats || defaultStats;

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-textMain">{t('dashboard:title')}</h1>
           <p className="mt-1 text-sm font-medium text-textMuted">{t('dashboard:subtitle')}</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title={t('dashboard:revenue')}
          value={`$${data.revenue.toLocaleString()}`}
          icon={<DollarSign className="text-primary" size={24} />}
          trend={t('dashboard:revenue_trend')}
        />
        <StatsCard
          title={t('dashboard:orders')}
          value={data.totalOrders}
          icon={<ShoppingBag className="text-primary" size={24} />}
        />
        <StatsCard
          title={t('dashboard:avg_order')}
          value={`$${(data.revenue / (data.totalOrders || 1)).toFixed(2)}`}
          icon={<TrendingUp className="text-primary" size={24} />}
        />
      </div>

      {/* Charts & Tables Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Charts (2/3 width) */}
        <div className="lg:col-span-2">
            <SalesChart data={data.topSelling} />
        </div>

        {/* Right Column: Recent Activity (1/3 width) */}
        <div>
            <RecentOrdersTable orders={data.recentOrders} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
