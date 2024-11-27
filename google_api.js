require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const app = express();

// Set up OAuth2 Client with credentials
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3001/oauth2callback"
);

// Set credentials from environment variables
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    access_token: process.env.GOOGLE_ACCESS_TOKEN
});

// Step 1: Route to initiate OAuth flow
app.get('/auth', (req, res) => {
    console.log("Received request at /auth");  // Debugging log
    const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',  // Make sure this is set
        scope: scopes,
    });
    res.redirect(url);  // Redirect to Google OAuth consent page
});

// Step 2: Callback route for OAuth
app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code; // Get the authorization code
    console.log('Authorization code received:', code); // Log the code

    try {
        const { tokens } = await oauth2Client.getToken(code); // Exchange code for tokens
        oauth2Client.setCredentials(tokens); // Set the credentials in the OAuth client

        console.log('Access Token:', tokens.access_token); // Log the access token
        console.log('Refresh Token:', tokens.refresh_token); // Log the refresh token

        // Store refresh token if it exists
        if (tokens.refresh_token) {
            console.log('Storing refresh token:', tokens.refresh_token);
            // Save the refresh token to your environment or a secure place.
            // Example: You could append it to a .env file (not recommended for production)
            // You might also want to store it in a database or a secure vault
        } else {
            console.log('No refresh token returned. Make sure access_type=offline was set.');
        }

        res.send('Access Token obtained! Check the console.'); // Send a response to the user
    } catch (error) {
        console.error('Error retrieving access token:', error); // Log any errors
        res.status(500).send('Error retrieving access token');
    }
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Visit this URL to start the authorization process: http://localhost:${port}/auth`);
});