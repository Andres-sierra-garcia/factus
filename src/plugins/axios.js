import axios from "axios";

const apiClient = axios.create({
/*     baseURL: "https://backend-factus.onrender.com/factus", */
    baseURL:"http://localhost:3999/factus"
});

apiClient.interceptors.request.use(
    (config) => {
        const dataStore = JSON.parse(localStorage.getItem("tienda"));
        const token = dataStore?.token || "";
            config.headers.Authorization = `Bearer ${token}`
            config.headers["Content-Type"]= "application/json"
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
