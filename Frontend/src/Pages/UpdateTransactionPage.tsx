import {  useState, useEffect } from "react";
import { useTransactionStore } from "../Stores/useTransactionStore";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, Plus } from "lucide-react";

const UpdateTransactionPage = () => {
  const { transactions, updateTransaction, loading, fetchUserTransactions } = useTransactionStore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: 0,
    type: "Credit",
  });

  useEffect(() => {
    fetchUserTransactions();
  }, [fetchUserTransactions]);
  
  const transaction = transactions?.find((t) => t._id === id);

  useEffect(() => {
    if (transaction) {
      setFormData ({
        date: transaction.Date || "",
        description: transaction.Description || "",
        amount: transaction.Amount || 0,
        type: transaction.Type || "",
      });
    }
  }, [transaction]);

  if (!id)
    return <p className="text-center text-blue-500">Invalid Transaction ID</p>;

  if (!transaction)
    return <p className="text-center text-blue-500">Transaction not found</p>;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateTransaction(id, {
        ...formData,
        amount: Number(formData.amount),
      });
      navigate("/admindashboard");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleBack = () => {
    navigate("/admindashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Update Transaction</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="mt-2">
              <label
                htmlFor="date"
                className="block text-sm/6 font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                id="date"
                onChange={handleChange}
                className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
                required
                placeholder="Enter the date"
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="amount"
                className="block text-sm/6 font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                id="amount"
                onChange={handleChange}
                className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
                required
                placeholder="Enter the transaction amount"
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="description"
                className="block text-sm/6 font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                id="description"
                onChange={handleChange}
                className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
                required
                placeholder="Describe the transaction"
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="type"
                className="block text-sm/6 font-medium text-gray-700"
              >
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                id="type"
                onChange={handleChange}
                className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
                required
              >
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </select>
            </div>
            <div className="flex mt-7 justify-between space-x-4">
              <button
                type="button"
                className="w-full flex justify-center px-4 py-3 bg-gray-500  text-white rounded-md hover:bg-gray-600"
                onClick={handleBack}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full flex justify-center px-4 py-3 bg-blue-600  text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader
                      className="mr-2 w-5 h-5 animate-spin"
                      aria-hidden="true"
                    />
                    Loading...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTransactionPage;
