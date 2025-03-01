
import { CircleX } from "lucide-react";
import RegisterForm from "./RegisterForm";

const RegisterModal = () => {  
  return (
    <div className="fixed inset-0 w-full h-screen bg-opacity-40 bg-gray-600 backdrop-blur-sm  z-[1000] transition-all duration-500">
        <div className="px-10 md:px-20 py-14 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 w-11/12 lg:w-1/3 max-h-[95%] overflow-y-auto">
            <span className="absolute right-12 top-12">
                <CircleX />
            Ï</span>
            <RegisterForm/>
        </div>
    </div>

              
  );
};

export default RegisterModal;
