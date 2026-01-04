import apiClient from './baseApiService.js';

export const getUserDebts = async (userId) => {
  if(!userId) {
    return;
  }
  
  try {
    const response = await apiClient.get('/expense-debts/by-userid/'+userId);
    return await response.data.data;
  } catch (error) {
    console.log('Failed to fetch groups:', error);
    throw error;
  }
}