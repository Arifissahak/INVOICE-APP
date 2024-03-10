import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getAllInvoice = async () => {
    const response = await axios.get(`${base_url}invoice/`, config);
  
    return response.data;
};

const getAInvoice = async (invoiceId) => {
    const response = await axios.get(`${base_url}invoice/${invoiceId}`, config);
  
    return response.data;
};

const createInvoice = async (invoice, selectedClient) => {
    const response = await axios.post(`${base_url}invoice/${selectedClient}`, invoice, config);
    return response.data;
};

const deleteInvoice = async (id, username) => {
    const response = await axios.delete(`${base_url}invoice/${id}/${username}`, config);
  
    return response.data;
};
const invoiceService = {
    getAllInvoice,
    getAInvoice,
    createInvoice,
    deleteInvoice
};

export default invoiceService;