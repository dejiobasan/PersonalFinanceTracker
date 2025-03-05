import { useState } from "react";
import { useUserStore } from "../../Stores/useUserStore";
import {
  Wallet,
  LayoutDashboard,
  WalletMinimal,
  WalletCards,
  ContactRound,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import TransactionList from "../TransactionList";
import AddTransactionForm from "../AddTransactionForm";
import ViewAllTransactionsList from "../ViewAllTransactionsList";
import ContactAdmin from "../ContactAdmin";
import UserAnalyticsTab from "../UserAnalyticsTab";
import AdminAnalyticsTab from "../AdminAnalyticsTab";

const sidebarItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, active: true },
  { name: "Your Transactions", icon: <WalletMinimal size={20} /> },
  { name: "Add Transaction", icon: <WalletCards size={20} /> },
];

const SideNav = () => {
  const [active, setActive] = useState("Dashboard");
  const { user, logout } = useUserStore();

  const renderComponent = () => {
    switch (active) {
      case "Dashboard":
        return user?.Role === "Admin" ? (
          <AdminAnalyticsTab />
        ) : (
          <UserAnalyticsTab />
        );
      case "Your Transactions":
        return <TransactionList />;
      case "Add Transaction":
        return <AddTransactionForm />;
      case "Contact Admin":
        return <ContactAdmin />;
      case "View All Transactions":
        return <ViewAllTransactionsList />;
      default:
        return user?.Role === "Admin" ? (
          <AdminAnalyticsTab />
        ) : (
          <UserAnalyticsTab />
        );
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-4">
        <div className="mb-6">
          <Link to="/">
            <Wallet color="white" className="h-16 w-16" />
          </Link>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg text-left ${
                active === item.name ? "bg-blue-500" : "hover:bg-blue-900"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
          {user?.Role === "User" && (
            <button
              onClick={() => setActive("Contact Admin")}
              className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg text-left ${
                active === "Contact Admin" ? "bg-blue-500" : "hover:bg-blue-900"
              }`}
            >
              <ContactRound size={20} />
              <span>Contact Admin</span>
            </button>
          )}
          {user?.Role === "Admin" && (
            <button
              onClick={() => setActive("View All Transactions")}
              className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg text-left ${
                active === "View All Transactions"
                  ? "bg-blue-500"
                  : "hover:bg-blue-900"
              }`}
            >
              <WalletMinimal size={20} />
              <span>View All Transactions</span>
            </button>
          )}
        </nav>

        <button
          onClick={logout}
          className="mt-auto px-6 py-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-900 rounded-md w-full text-left"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between bg-white shadow-sm p-4">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-300"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={user?.Image}
                alt={user?.Name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{user?.Name}</span>
            </div>
          </div>
        </header>

        <main className="p-6">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default SideNav;
