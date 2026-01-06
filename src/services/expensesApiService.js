import apiClient from './baseApiService.js';

export const getExpenses = async () => {
  try {
    const response = await apiClient.get('/expenses');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch expenses:', error);
    throw error;
  }
}

export const getExpense = async (referenceId) => {
  try {
    const response = await apiClient.get('/expenses/'+referenceId+'?includes=contributors,participants');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch expense:', error);
    throw error;
  }
}

export const createExpense = async (groupId, name, description, category = '') => {
  try {

    const data = {
      groupId,
      name,
      description,
      category
    }

    const response = await apiClient.post('/expenses', data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to create expense:', error);
    throw error;
  }
}

export const updateExpense = async (referenceId, data) => {
  try {
    const response = await apiClient.put('/expenses/'+referenceId, data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to update expense:', error);
    throw error;
  }
}

export const deleteExpense = async (referenceId) => {
  try {
    const response = await apiClient.delete('/expenses/'+referenceId);
    return response.data.data;
  } catch (error) {
    console.log('Failed to delete expense:', error);
    throw error;
  }
}