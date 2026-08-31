import axios from "axios";

const API = axios.create({
  baseURL: "https://readora-backend-jjmj.onrender.com/api",
});

export default API;