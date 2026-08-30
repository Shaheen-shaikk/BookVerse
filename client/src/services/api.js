import axios from "axios";

const API = axios.create({
  baseURL: "https://readora-backend-jmj.onrender.com/api",
});

export default API;