
import { Link } from "react-router-dom";
import { Wallet } from 'lucide-react';

const HomeNav = () => {
  return (
    <nav className="w-full flex justify-between lg:max-w-[90%] mx-auto px-8 py-12">
      <div>
        <Link to="/">
          <Wallet color="white" className="h-16 w-16" />
        </Link>
      </div>

      <div className="w-[150px] flex justify-between items-center">
      <Link
          to='/register'
          className="flex items-center bg-blue-950 text-white py-3 px-4 rounded-lg hover:bg-blue-900 transition-all duration-300 mr-4"
        >
           Register
        </Link>
        <Link
          to='/login'
          className="flex items-center bg-blue-950 text-white py-3 px-4 rounded-lg hover:bg-blue-900 transition-all duration-300"
        >
           Login
        </Link>
      </div>
    </nav>
  )
};

export default HomeNav;