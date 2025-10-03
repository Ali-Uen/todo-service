// Constants for error messages and user feedback
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  USER_ALREADY_EXISTS: 'An account with this email already exists.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  
  // Todo errors
  TODO_NOT_FOUND: 'Todo item not found.',
  TODO_CREATE_FAILED: 'Failed to create todo item.',
  TODO_UPDATE_FAILED: 'Failed to update todo item.',
  TODO_DELETE_FAILED: 'Failed to delete todo item.',
  
  // Validation errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  NAME_TOO_SHORT: 'Name must be at least 2 characters long.',
  INVALID_PASSWORD_FORMAT: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  
  // Generic
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! You have been logged in successfully.',
  REGISTRATION_SUCCESS: 'Account created successfully! Welcome to Todo App.',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  TODO_CREATED: 'Todo item created successfully.',
  TODO_UPDATED: 'Todo item updated successfully.',
  TODO_DELETED: 'Todo item deleted successfully.',
  TODO_COMPLETED: 'Todo item marked as completed.',
  TODO_UNCOMPLETED: 'Todo item marked as incomplete.'
};

// Helper function to get user-friendly error message
export function getUserFriendlyErrorMessage(error) {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }
  
  if (errorMessage.includes('user already exists') || errorMessage.includes('email already')) {
    return ERROR_MESSAGES.USER_ALREADY_EXISTS;
  }
  
  if (errorMessage.includes('invalid credentials') || errorMessage.includes('login failed')) {
    return ERROR_MESSAGES.INVALID_CREDENTIALS;
  }
  
  if (errorMessage.includes('token') && errorMessage.includes('expired')) {
    return ERROR_MESSAGES.TOKEN_EXPIRED;
  }
  
  if (errorMessage.includes('not found') && errorMessage.includes('todo')) {
    return ERROR_MESSAGES.TODO_NOT_FOUND;
  }
  
  // Return original message if no match found, but clean it up
  return error?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
}