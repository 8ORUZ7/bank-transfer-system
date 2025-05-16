import axios from 'axios';
import { API_URL } from '../constants';

console.log('FROM TRANSACTION:', API_URL);

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// POST request helper
const postRequest = async (endpoint, data, token) => {
  const response = await axios.post(`${API_URL}/api/${endpoint}`, data, authConfig(token));
  return response.data;
};

// GET request helper
const getRequest = async (endpoint, token) => {
  const response = await axios.get(`${API_URL}/api/${endpoint}`, authConfig(token));
  return response.data;
};

const sendMoney = async (transactionData, token) => {
  console.log('🟨 Sending transaction payload:', transactionData);
  return await postRequest('transfer', transactionData, token);
};

const getTransactions = async (userId, token) => {
  return await getRequest(`get_transactions/${userId}`, token);
};

const getMoneySend = async (token) => {
  return await getRequest('get_money_send', token);
};

const getMoneyReceive = async (token) => {
  return await getRequest('get_money_receive', token);
};

const addMoney = async ({ amount }, token) => {
  return await postRequest('deposit', { amount }, token);
};

const transactionService = {
  sendMoney,
  getTransactions,
  getMoneySend,
  getMoneyReceive,
  addMoney,
};

export default transactionService;
