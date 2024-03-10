import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";
const login = async (user) => {
  const response = await axios.post(`${base_url}user/login`, user);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};
const register = async (user) => {
  const response = await axios.post(`${base_url}user/register`, user);
  return response.data;
};
const getAllClient = async () => {
  const response = await axios.get(`${base_url}user/
  client`, config);

  return response.data;
};
const getClient = async (username) => {
  const response = await axios.post(
    `${base_url}user/client/${username}`,
    "",
    config
  );

  return response.data;
};

const logOut = async () => {
  const response = await axios.get(`${base_url}user/logout`, config);

  return response.data;
};

const authService = {
  login,
  register,
  getAllClient,
  getClient,
  logOut
};

export default authService;
