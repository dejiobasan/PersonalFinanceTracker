import { useDashboardStore } from "../Stores/useDashboardStore";
import { useEffect } from "react";
import { Wallet, CreditCard, DollarSign, ChartColumn } from "lucide-react";
import UserBarChart from "./UserBarChart";

const UserAnalyticsTab = () => {
  const {
    fetchUserDashboardData,
    totalUserCreditTransactions,
    totalUserDebitTransactions,
    totalUserTransactions,
    averageUserTransactions,
  } = useDashboardStore();

  useEffect(() => {
    fetchUserDashboardData();
  }, [fetchUserDashboardData]);

  return <div className="p-6">
  <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
      <div className="bg-yellow-100 p-3 rounded-full">
        <span className="text-yellow-500 text-xl">
          <Wallet />
        </span>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">Total Transactions</p>
        <p className="text-lg font-semibold">{totalUserTransactions}</p>
      </div>
    </div>

    <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
      <div className="bg-red-100 p-3 rounded-full">
        <span className="text-red-500 text-xl">
          <CreditCard />
        </span>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">Total Debit Transactions</p>
        <p className="text-lg font-semibold">{totalUserDebitTransactions}</p>
      </div>
    </div>

    <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
      <div className="bg-blue-100 p-3 rounded-full">
        <span className="text-blue-500 text-xl">
          <DollarSign />
        </span>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">Total Credit Transactions</p>
        <p className="text-lg font-semibold">{totalUserCreditTransactions}</p>
      </div>
    </div>

    <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
      <div className="bg-green-100 p-3 rounded-full">
        <span className="text-green-500 text-xl">
          <ChartColumn />
        </span>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">Avg Transactions Amount</p>
        <p className="text-lg font-semibold">
          &#8358;{averageUserTransactions}
        </p>
      </div>
    </div>
  </div>
  <UserBarChart />
</div>;
};

export default UserAnalyticsTab;
