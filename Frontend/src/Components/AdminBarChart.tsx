import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboardStore } from "../Stores/useDashboardStore";
import { useUserStore } from "../Stores/useUserStore";
import { useEffect } from "react";

const AdminBarChart = () => {
  const {
    fetchDashboardData,
    totalCreditTransactions,
    totalDebitTransactions,
  } = useDashboardStore();

  const { user } = useUserStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const barChartData = [
    {
      name: user?.Name,
      totalCreditTransactions: totalCreditTransactions,
      totalDebitTransactions: totalDebitTransactions,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4">Transaction Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={barChartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalDebitTransactions" fill="#f87171" />
          <Bar dataKey="totalCreditTransactions" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminBarChart;
