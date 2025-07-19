/**
 * Simple health check controller
 */

const healthCheck = async (req, res) => {
  try {
    return res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error during health check'
    });
  }
};

export default healthCheck;
