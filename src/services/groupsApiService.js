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

export const createGroup = async (name, currency = 'SEK') => {
  try {

    const data = {
      name,
      currency
    }

    const response = await apiClient.post('/expense-groups/', data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to create group:', error);
    throw error;
  }
}

export const updateGroup = async (referenceId, name) => {
  try {

    const data = {
      name
    }

    const response = await apiClient.put('/expense-groups/'+referenceId, data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to update group:', error);
    throw error;
  }
}

export const deleteGroup = async (referenceId) => {
  try {
    const response = await apiClient.delete('/expense-groups/'+referenceId);
    return response.data.data;
  } catch (error) {
    console.log('Failed to delete group:', error);
    throw error;
  }
}

export const joinGroup = async (referenceId, userId) => {
  try {
    const data = {
      userId
    }

    const response = await apiClient.post('/expense-groups/'+referenceId+'/members', data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to join group:', error);
    throw error;
  }
}

export const leaveGroup = async (referenceId, memberId) => {
  try {
    const response = await apiClient.delete('/expense-groups/'+referenceId+'/members/'+memberId);
    return response.data.data;
  } catch (error) {
    console.log('Failed to leave group:', error);
    throw error;
  }
}

export const getGroupMembers = async (referenceId) => {
  try {
    const response = await apiClient.get('/expense-groups/'+referenceId+'/members')
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch group members: ', error)
    throw error;
  }
}

export const removeGroupMembers = async (referenceId, memberIds) => {
  const values = Object.values(memberIds);
  for (const memberId of values) {
    await leaveGroup(referenceId, memberId);
  }
}
