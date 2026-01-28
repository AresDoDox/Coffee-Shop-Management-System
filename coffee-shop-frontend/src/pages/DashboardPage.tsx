import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/stats.service';
import StatsCard from '../components/dashboard/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Auto-refetch every 30s
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F5F2]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4B362F] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 bg-[#F8F5F2] h-screen pt-10">Error loading dashboard data.</div>;
  }

  const defaultStats = {
    revenue: 0,
    totalOrders: 0,
    topSelling: [],
    recentOrders: [],
  };

  const data = stats || defaultStats;

  return (
    <div className="min-h-screen bg-[#F8F5F2] p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-[#2D2626]">Dashboard</h1>
           <p className="text-gray-500">Overview of your coffee shop performance.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="h-10 w-10 overflow-hidden rounded-full bg-white p-1">
                 <img src="https://ui-avatars.com/api/?name=Admin&background=4B362F&color=fff" alt="Admin" className="h-full w-full rounded-full" />
             </div>
             <div>
                <p className="text-sm font-bold text-[#2D2626]">Admin User</p>
                <p className="text-xs text-gray-500">Manager</p>
             </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Revenue"
          value={`$${data.revenue.toLocaleString()}`}
          icon={<DollarSign className="text-[#4B362F]" size={24} />}
          trend="+12% from last month"
        />
        <StatsCard
          title="Total Orders"
          value={data.totalOrders}
          icon={<ShoppingBag className="text-[#4B362F]" size={24} />}
        />
        <StatsCard
          title="Avg. Order Value"
          value={`$${(data.revenue / (data.totalOrders || 1)).toFixed(2)}`}
          icon={<TrendingUp className="text-[#4B362F]" size={24} />}
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
