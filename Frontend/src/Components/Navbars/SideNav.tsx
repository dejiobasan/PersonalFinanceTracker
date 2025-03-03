
import { useState } from "react";
import { Wallet, LayoutDashboard, WalletMinimal, WalletCards, ContactRound } from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20}  />, active: true},
  { name: "Transactions", icon: <WalletMinimal size={20}  />},
  { name: "Add Transaction", icon: <WalletCards size={20}  />},
  { name: "Contact Admin", icon: <ContactRound size={20}  />},
];




const SideNav = () => {

  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-600 text-white flex flex-col p-4">
        {/* Logo */}
        <div className="text-lg font-semibold mb-6">Brand sidebar with header</div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg text-left ${
                active === item.name ? "bg-indigo-500" : "hover:bg-indigo-500/50"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Teams */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Your teams</h3>
          <div className="space-y-2">
            {teamItems.map((team) => (
              <span key={team} className="flex items-center px-4 py-2 bg-indigo-500/30 rounded-lg text-sm">
                {team.charAt(0)}
                <span className="ml-2">{team}</span>
              </span>
            ))}
          </div>
        </div>
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
            <Bell className="text-gray-500 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">Tom Cook</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <div className="h-full border-2 border-dashed border-gray-300 rounded-lg"></div>
        </main>
      </div>
    </div>
  )
}

export default SideNav