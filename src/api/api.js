// ../api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true, // <--- important!
});

export default API;

//https://flaskapiformealmonkey.onrender...com