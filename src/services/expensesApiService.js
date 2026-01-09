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

export const updateExpense = async (referenceId, name, description, category) => {
  try {
    const data = {
      name,
      description,
      category
    }

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
    return { status: response.status === 200};
  } catch (error) {
    console.log('Failed to delete expense:', error);
    throw error;
  }
}

export const createParticipant = async (expenseId, memberId, amountOwed = 0) => {
  try {
    const data = {
      memberId,
      amountOwed: Number(amountOwed) || 0,
    }

    const response = await apiClient.post('/expenses/'+expenseId+'/participants', data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to create participant:', error);
    throw error;
  }
}

export const updateParticipant = async (expenseId, participantId, amountOwed = 0) => {
  if(!participantId) {
    return;
  }

  try {
    const data = {
      amountOwed: Number(amountOwed) || 0,
    }

    const response = await apiClient.put('/expenses/'+expenseId+'/participants/'+participantId, data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to update participant:', error);
    throw error;
  }
}

export const createContributor = async (expenseId, memberId, amountPaid = 0) => {
  try {
    const data = {
      memberId,
      amountPaid: Number(amountPaid) || 0,
    }

    const response = await apiClient.post('/expenses/'+expenseId+'/contributors', data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to create contributor:', error);
    throw error;
  }
}

export const updateContributor = async (expenseId, contributorId, amountPaid = 0) => {
  if(!contributorId) {
    return;
  }

  try {
    const data = {
      amountPaid: Number(amountPaid) || 0,
    }

    const response = await apiClient.put('/expenses/'+expenseId+'/contributors/'+contributorId, data);
    return response.data.data;
  } catch (error) {
    console.log('Failed to update contributor:', error);
    throw error;
  }
}

export const finalizeExpense = async (expenseId) => {
  try {
    const response = await apiClient.post('/expenses/'+expenseId+'/finalize');
    return { success: true, data: response.data.data};
  } catch (error) {
    console.log('Failed to finalize expense:', error);
    return { success: false, message: error.response.data.message }
  }
}