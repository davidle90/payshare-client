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

export const getGroupDebts = async (groupId) => {
  if(!groupId) {
    return;
  }
  
  try {
    const response = await apiClient.get('/expense-groups/'+groupId+'/balance/debts');
    return await response.data.data;
  } catch (error) {
    console.log('Failed to fetch groups:', error);
    throw error;
  }
}

export const calculateBalance = async (groupId) => {
  if(!groupId) {
    return;
  }
  
  try {
    const response = await apiClient.get('/expense-groups/'+groupId+'/balance/calculate');
    return await response.data.data;
  } catch (error) {
    console.log('Failed to fetch groups:', error);
    throw error;
  }
}

export const simplifyBalance = async (groupId) => {
  if(!groupId) {
    return;
  }
  
  try {
    const response = await apiClient.get('/expense-groups/'+groupId+'/balance/simplify');
    return await response.data.data;
  } catch (error) {
    console.log('Failed to fetch groups:', error);
    throw error;
  }
}