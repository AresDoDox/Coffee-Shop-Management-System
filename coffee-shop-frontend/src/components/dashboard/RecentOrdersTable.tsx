import React from 'react';

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: { name: string };
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-[#2D2626]">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-500">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Staff</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="group hover:bg-[#F8F5F2]">
                <td className="py-3 font-medium text-[#2D2626]">#{order.id}</td>
                <td className="py-3 text-gray-600">{order.user?.name}</td>
                <td className="py-3 font-bold text-[#4B362F]">${order.totalAmount.toLocaleString()}</td>
                <td className="py-3 text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
