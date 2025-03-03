import { useState } from "react";
import { useUserStore } from "../../Stores/useUserStore";
import {
  Wallet,
  LayoutDashboard,
  WalletMinimal,
  WalletCards,
  ContactRound,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const sidebarItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, active: true },
  { name: "Transactions", icon: <WalletMinimal size={20} /> },
  { name: "Add Transaction", icon: <WalletCards size={20} /> },
  { name: "View All Transactions", icon: <WalletMinimal size={20} /> },
  { name: "Contact Admin", icon: <ContactRound size={20} /> },
];

const SideNav = () => {
  const [active, setActive] = useState("Dashboard");
  const { user } = useUserStore();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-500 text-white flex flex-col p-4">
        {/* Logo */}
        <div className="mb-6">
          <Link to="/">
            <Wallet color="white" className="h-16 w-16" />
          </Link>
        </div>

        {/* Navigation */}
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
        </nav>

        <button className="mt-auto px-6 py-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-900 rounded-md w-full text-left">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow-sm p-4">
          {/* Search Bar */}
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Notifications & Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={user?.Image}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{user?.Name}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <div className="h-full border-2 border-dashed border-gray-300 rounded-lg">
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default SideNav;
