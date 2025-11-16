// ../api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://flaskapiformealmonkey.onrender.com",
  withCredentials: true, // <--- important!
});

export default API;

//https://flaskapiformealmonkey.onrender...com