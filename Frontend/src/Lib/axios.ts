import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? 'https://personalfinancetrackerbackend.onrender.com' : "/api",
    withCredentials: true,
});

export default axiosInstance;