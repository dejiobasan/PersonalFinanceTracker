import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Registerpage from "./Pages/Registerpage";
import Loginpage from "./Pages/Loginpage";
import { useUserStore } from "./Stores/useUserStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./Components/LoadingSpinner";
import AdminDashboard from "./Pages/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";
import UpdateTransactionPage from "./Pages/UpdateTransactionPage";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/register"
          element={
            !user ? (
              <Registerpage />
            ) : (
              <Navigate
                to={
                  user?.Role === "Admin" ? "/admindashboard" : "/userdashboard"
                }
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            !user ? (
              <Loginpage />
            ) : (
              <Navigate
                to={
                  user?.Role === "Admin" ? "/admindashboard" : "/userdashboard"
                }
              />
            )
          }
        />
        <Route
          path="/admindashboard"
          element={
            user?.Role === "Admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to={user ? "/userdashboard" : "/login"} />
            )
          }
        />
        <Route
          path="/userdashboard"
          element={
            user?.Role === "User" ? (
              <UserDashboard />
            ) : (
              <Navigate to={user ? "/admindashboard" : "/login"} />
            )
          }
        />
        <Route path="/edit/:id" element={<UpdateTransactionPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
