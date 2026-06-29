import Log from '../models/Log.js';

export const getLogs = async (req, res, next) => {
  try {
    // If you want isolation here too, you could filter by user.
    // For now, let's just return all logs as it's an admin-only route.
    const logs = await Log.find({}).sort('-createdAt').limit(50);
    
    res.json({
      success: true,
      message: 'Logs retrieved successfully',
      data: logs
    });
  } catch (error) {
    next(error);
  }
};
