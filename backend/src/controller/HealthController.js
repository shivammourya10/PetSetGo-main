/**
 * Health check controller for API status monitoring
 * Provides detailed diagnostics about the server and database connection
 */

import mongoose from 'mongoose';
import os from 'os';

const healthCheck = async (req, res) => {
  try {
    // Prepare basic system information
    const systemInfo = {
      hostname: os.hostname(),
      platform: process.platform,
      uptime: Math.floor(process.uptime()) + ' seconds',
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
        free: Math.round(os.freemem() / 1024 / 1024) + ' MB',
        usage: Math.round((os.totalmem() - os.freemem()) / os.totalmem() * 100) + '%'
      },
      nodeVersion: process.version
    };

    // Check database connection status
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      status: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    };

    // If connected, add more database details
    if (dbStatus.connected) {
      try {
        // Perform a simple db operation to verify real connectivity
        const adminDb = mongoose.connection.db.admin();
        const serverStatus = await adminDb.serverStatus();
        
        dbStatus.version = serverStatus.version;
        dbStatus.uptime = Math.floor(serverStatus.uptime) + ' seconds';
        dbStatus.connections = serverStatus.connections;
      } catch (dbError) {
        // DB operation failed even though connection appeared active
        dbStatus.error = dbError.message;
        dbStatus.connected = false;
        dbStatus.status = 'error';
      }
    }

    // Determine overall health status
    const isHealthy = dbStatus.connected;
    
    return res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'ok' : 'degraded',
      message: isHealthy ? 'API is running normally' : 'API is running but database connection issues detected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      systemInfo,
      database: dbStatus,
      serverTime: new Date().toISOString(),
      // Include connection information that client can use to debug
      clientInfo: {
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        acceptLanguage: req.headers['accept-language']
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      serverTime: new Date().toISOString()
    });
  }
};

export default healthCheck;
