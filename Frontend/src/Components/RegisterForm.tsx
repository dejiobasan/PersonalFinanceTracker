import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../Stores/useUserStore";
import { ArrowRight, Loader, UserPlus, Upload } from "lucide-react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    number: "",
    image: "",
  });

  const navigate = useNavigate();

  const { register, loading } = useUserStore();

  const HandleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register({ ...formData });
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        number: "",
        image: "",
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed!", error);
    }
  };

  const HandleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData({ ...formData, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const HandleBack = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Register</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mt-2">
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              id="name"
              onChange={HandleChange}
              className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
              required
              placeholder="Enter your name"
            />
          </div>
        </div>
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
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              id="email"
              onChange={HandleChange}
              className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
              required
              placeholder="Enter your email address"
            />
          </div>
        </div>
        <div>
          <div className="mt-2">
            <label
              htmlFor="number"
              className="block text-sm/6 font-medium text-gray-700"
            >
              Phone number
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              id="number"
              onChange={HandleChange}
              className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
              required
              placeholder="Enter your phone number"
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
        <div>
          <div className="mt-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm/6 font-medium text-gray-700 "
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              id="confirmPassword"
              onChange={HandleChange}
              className="block w-full text-2xl border rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 placeholder:text-sm focus:outline-none focus:border-blue-500 sm:text-sm/6"
              required
              placeholder="Confirm your password"
            />
          </div>
        </div>
        <div>
          <div className="mt-2 flex items-center">
            <input
              type="file"
              id="image"
              className="sr-only"
              accept="image/*"
              onChange={HandleImageChange}
            />
            <label
              htmlFor="image"
              className="cursor-pointer bg-blue-950 py-2 px-3 border border-gray-600
          rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-blue-900
          focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-900"
            >
              <Upload className="h-5 w-5 inline-block mr-2" />
              Upload Image
            </label>
            {formData.image && (
              <span className="ml-3 text-sm text-gray-400">Image Uploaded</span>
            )}
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
                <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                Register
              </>
            )}
          </button>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Login here
            <ArrowRight className="inline h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </form>
    </>
  );
};

export default RegisterForm;
