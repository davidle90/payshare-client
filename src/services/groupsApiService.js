import apiClient from './baseApiService.js';

export const getGroups = async () => {
  try {
    const response = await apiClient.get('/expense-groups?includes=members,debts,expenses');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch groups:', error);
    throw error;
  }
}

export const getGroup = async (referenceId) => {
  try {
    const response = await apiClient.get('/expense-groups/'+referenceId+'?includes=members,expenses,debts');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch group:', error);
    throw error;
  }
}
