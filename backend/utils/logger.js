import Log from '../models/Log.js';

export const logActivity = async (action, userId, details = '') => {
  try {
    await Log.create({
      action,
      user: userId,
      details,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
