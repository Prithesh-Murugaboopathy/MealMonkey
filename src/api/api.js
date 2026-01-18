// ../api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://flaskapiformealmonkey.onrender.com",
  withCredentials: true,
});

export default API;

//https://flaskapiformealmonkey.onrender...com