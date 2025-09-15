import { saveQuery, getQueries, updateQueryStatus } from './database';

// Handle form submission
export const handleFormSubmission = async (formData: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => {
  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Missing required fields');
    }

    // Save query to database
    const savedQuery = await saveQuery(formData);
    
    return {
      success: true,
      data: savedQuery,
      message: 'Your query has been submitted successfully!'
    };
  } catch (error) {
    console.error('Error submitting query:', error);
    return {
      success: false,
      message: error.message || 'Failed to submit query. Please try again.'
    };
  }
};

// Get queries for admin dashboard
export const fetchQueries = async (status?: string) => {
  try {
    const queries = await getQueries(status);
    return {
      success: true,
      data: queries
    };
  } catch (error) {
    console.error('Error fetching queries:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch queries.'
    };
  }
};

// Update query status
export const changeQueryStatus = async (id: number, status: string) => {
  try {
    const updatedQuery = await updateQueryStatus(id, status);
    return {
      success: true,
      data: updatedQuery
    };
  } catch (error) {
    console.error('Error updating query status:', error);
    return {
      success: false,
      message: error.message || 'Failed to update query status.'
    };
  }
};