import axios from "axios";


const API = axios.create({
  baseURL: "https://bookverse-h548.onrender.com/api",
});
export default API;