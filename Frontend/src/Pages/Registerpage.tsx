import { useState } from "react";
import { useUserStore } from "../Stores/useUserStore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import shapeBg from "../Images/Shape.png";

const Registerpage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    number: "",
    image: "",
  });

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
  return (
    <div className="relative h-screen bg-blue-500 flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${shapeBg})` }}
      ></div>
      <motion.div
        className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Register</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="mb-4">
            <label className="block text-gray-700 text-xl font-medium mb-1">
              Name:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              className="w-full text-2xl border border-gray-300 bg-gray-50 rounded-md px-4 py-3 placeholder:text-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Registerpage;
