import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Registerpage from "./Pages/Registerpage";
import Loginpage from "./Pages/Loginpage";
import { useUserStore } from "./Stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./Components/LoadingSpinner";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/register" element={!user ? <Registerpage /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <Loginpage /> : <Navigate to="/" />} />
      <Route path="/admindashboard" element={user?.Role === "Admin" ? <AdminDashboard />  : <Navigate to="/" />} />
    </Routes>
  )
}

export default App;
