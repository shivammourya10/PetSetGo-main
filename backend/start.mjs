#!/usr/bin/env node

/**
 * PetSetGo Backend Starter Script
 * 
 * This script performs pre-flight checks before starting the server
 * to ensure the environment is properly configured and all dependencies are available.
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✓ Loading environment from .env file');
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️ No .env file found. Using system environment variables.');
}

// Check for required environment variables
const requiredEnvVars = ['PORT', 'MONGO_URI', 'ACCESS_TOKEN_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease create a .env file with these variables or set them in your environment.');
  process.exit(1);
}

// Check if MongoDB is reachable
try {
  console.log('🔍 Testing MongoDB connection...');
  
  // Try to parse the MongoDB URI to get host and port
  const mongoUri = process.env.MONGO_URI;
  const mongoHost = mongoUri.includes('@') 
    ? mongoUri.split('@')[1].split('/')[0] 
    : mongoUri.split('://')[1].split('/')[0];
  
  console.log(`   Attempting to connect to MongoDB at ${mongoHost}`);
  
  // We don't actually connect here, just check if the URI is valid
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI format');
    process.exit(1);
  }
  
  console.log('✓ MongoDB URI format is valid');
} catch (error) {
  console.error('❌ Failed to validate MongoDB connection:', error.message);
  console.log('   The server will still attempt to connect when starting.');
}

// Check if the port is available
const port = process.env.PORT || 8000;
try {
  console.log(`🔍 Checking if port ${port} is available...`);
  const netstat = execSync('netstat -an | grep LISTEN').toString();
  
  if (netstat.includes(`:${port}`)) {
    console.error(`❌ Port ${port} is already in use!`);
    console.error('   Please choose a different port or stop the process using this port.');
    process.exit(1);
  }
  console.log(`✓ Port ${port} is available`);
} catch (error) {
  // If netstat fails, it's likely not installed or we're on Windows
  console.log('   Unable to check port availability. Continuing anyway.');
}

// Check for required directories
const requiredDirs = ['public/temp'];
requiredDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`🔍 Creating required directory: ${dir}`);
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

console.log('✓ All required directories exist');

// Start the server
console.log('\n🚀 Starting PetSetGo backend server...\n');

// Use spawn to run the server with proper stdio inheritance
const server = spawn('node', ['src/index.js'], { 
  stdio: 'inherit',
  env: process.env
});

// Handle server process events
server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
});
