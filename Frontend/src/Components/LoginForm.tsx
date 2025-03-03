import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../Stores/useUserStore";
import { ArrowRight, Loader, LogIn,} from "lucide-react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const { login, loading } = useUserStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/admindashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const HandleBack = () => {
    navigate("/");
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold">Login</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mt-2">
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              id="username"
              onChange={HandleChange}
              className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
              required
              placeholder="Enter a username"
            />
          </div>
        </div>
        <div>
          <div className="mt-2">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              id="password"
              onChange={HandleChange}
              className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
              required
              placeholder="Enter a password"
            />
          </div>
        </div>
        <div className="flex justify-between space-x-4">
          <button
            type="button"
            className="w-full flex justify-center px-4 py-3 bg-gray-500  text-white rounded-md hover:bg-gray-600"
            onClick={HandleBack}
          >
            Close
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
                <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                Login
              </>
            )}
          </button>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          Not a Member?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Register here.
            <ArrowRight className="inline h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </form>
    </>
  );
};

export default LoginForm;
