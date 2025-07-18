// index.js
// This script sets up a cron job using 'node-cron' to make an HTTP GET request
// to a specified API endpoint every hour.

// 1. Import necessary libraries
// node-cron: For scheduling recurring tasks.
// Install with: npm install node-cron axios dotenv
const cron = require('node-cron');
// axios: For making HTTP requests.
const axios = require('axios');
// dotenv: For loading environment variables from a .env file (recommended for API keys/URLs).
require('dotenv').config();

// 2. Configuration for the API endpoint
// It's highly recommended to store sensitive information like API URLs
// in environment variables (e.g., in a .env file) and access them via process.env.
// Create a .env file in the same directory as this script with:
// API_ENDPOINT=https://your-api-url.com/your-endpoint
// API_KEY=your_optional_api_key_if_needed
const API_ENDPOINT =  'https://mailerservice-y32x.onrender.com/healthz'; // Default for testing

// 3. Function to hit the API
async function hitApiEndpoint() {
  console.log(`[${new Date().toISOString()}] Attempting to hit API endpoint: ${API_ENDPOINT}`);

  try {
    const headers = {};
    // Make the GET request to the API endpoint
    const response = await axios.get(API_ENDPOINT);

    // Log success and relevant data from the response
    console.log(`[${new Date().toISOString()}] API call successful! Status: ${response.status}`);
    // You can log part of the data or process it further here
    console.log('Response Data (first 100 chars):', JSON.stringify(response.data).substring(0, 100) + '...');

  } catch (error) {
    // Handle errors during the API call
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`[${new Date().toISOString()}] API call failed! Status: ${error.response.status}`);
      console.error('Error Data:', error.response.data);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`[${new Date().toISOString()}] API call failed! No response received.`);
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`[${new Date().toISOString()}] Error setting up API request: ${error.message}`);
    }
    console.error(error.config); // Log the request config for debugging
  }
}

// 4. Schedule the cron job
// The cron syntax '0 * * * *' means:
// 0: At minute 0 (the start of the hour)
// *: Every hour
// *: Every day of the month
// *: Every month
// *: Every day of the week
// So, it runs at 00:00, 01:00, 02:00, etc., every day.
console.log('Cron job scheduler started. Waiting for the next hour mark...');
cron.schedule('0 * * * *', () => {
  console.log(`\n--- Running hourly API hit job ---`);
  hitApiEndpoint();
});


process.on('SIGINT', () => {
  console.log('Shutting down cron job...');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Shutting down cron job...');
  process.exit();
});

