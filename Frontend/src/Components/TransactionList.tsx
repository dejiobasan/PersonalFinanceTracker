import { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react";
import { useTransactionStore } from "../Stores/useTransactionStore";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const TransactionList = () => {
  const { transactions, fetchUserTransactions, deleteTransaction } =
    useTransactionStore();
  const [filter, setFilter] = useState<"all" | "Credit" | "Debit">("all");

  useEffect(() => {
    fetchUserTransactions();
  }, [fetchUserTransactions]);

  const filteredTransactions = transactions.filter((t) =>
    filter === "all" ? true : t.Type === filter
  );

  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>

      <div className="flex gap-3 mb-4">
        {["all", "Credit", "Debit"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as "all" | "Credit" | "Debit")}
            className={`px-4 py-2 rounded-md ${
              filter === type ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr key={t._id} className="border-b">
                  <td className="p-2">{dayjs(t.Date).format("LL")}</td>
                  <td className="p-2">{t.Description}</td>
                  <td
                    className={`p-2 font-semibold ${
                      t.Type === "Credit" ? "text-blue-500" : "text-red-500"
                    }`}
                  >
                    &#8358;
                    {t.Amount < 0 ? `${Math.abs(t.Amount)}` : `${t.Amount}`}
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit/${t._id}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => deleteTransaction(t._id)}
                      className="text-blue-500 hover:bg-blue-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
