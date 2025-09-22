import axios from "axios";

export const api = axios.create({
  baseURL: "https://low-carb-back-end.onrender.com",
});
