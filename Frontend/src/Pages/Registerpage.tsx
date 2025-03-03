import { motion } from "framer-motion";
import RegisterModal from "../Components/RegisterModal";
import shapeBg from "../Images/Shape.png";

const Registerpage = () => {
  return (
    <div className="relative h-screen bg-blue-500 flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${shapeBg})` }}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <RegisterModal />
      </motion.div>
    </div>
  );
};

export default Registerpage;
