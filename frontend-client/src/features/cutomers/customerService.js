import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";


const getAllClients = async () => {
  const response = await axios.get(`${base_url}user/client`, config);

  return response.data;
};

const getAClient = async (username) => {
  const response = await axios.get(`${base_url}client/${username}`, config);

  return response.data;
};

const createClient = async (clint) => {
  const response = await axios.post(`${base_url}user/client`, clint, config);
  return response.data;
};

const deleteClient = async (id) => {
  const response = await axios.delete(`${base_url}user/client/${id}`, config);

  return response.data;
};


const customerService = {
  getAllClients,
  getAClient,
  createClient,
  deleteClient
};

export default customerService;
