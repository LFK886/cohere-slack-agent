require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { CohereClient } = require('cohere-ai');
const fetch = require('node-fetch'); 

console.log("Cohere API Key:", process.env.COHERE_API_KEY);
console.log("Bot User ID:", process.env.BOT_USER_ID); 

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const app = express();
app.use(bodyParser.json());

const respondedMessages = new Set();

// Root route
app.get('/', (req, res) => {
    res.send('Hello, your Slack Cohere Bot is running!');
});

app.post('/slack/events', async (req, res) => {
    console.log('Received request:', JSON.stringify(req.body, null, 2));

    if (req.body.type === 'url_verification') {
        return res.json({ challenge: req.body.challenge });
    }

    try {
        const slackEvent = req.body.event;

        console.log('Slack Event:', JSON.stringify(slackEvent, null, 2));

        // Check for bot message indicators
        if (slackEvent && slackEvent.type === 'message') {
            const userMessage = slackEvent.text; 

            // Exit if message is from the bot by checking user ID, bot_id, subtype, and is_bot
            if (
                slackEvent.user === process.env.BOT_USER_ID ||
                slackEvent.subtype === 'bot_message' ||
                slackEvent.bot_id || 
                slackEvent.is_bot
            ) {
                console.log("Ignoring message from the bot or another bot.");
                return res.status(200).send();
            }

            if (respondedMessages.has(slackEvent.client_msg_id)) {
                console.log("Already responded to this message. Ignoring.");
                return res.status(200).send();
            }

            respondedMessages.add(slackEvent.client_msg_id);

            const chatHistory = [
                { role: 'USER', message: userMessage }
            ];

            const coherePayload = {
                prompt: userMessage,
                max_tokens: 50,
            };

            console.log("Sending payload to Cohere:", JSON.stringify(coherePayload, null, 2));

            const response = await cohere.generate(coherePayload);

            const chatStream = await cohere.chatStream({
                chatHistory: chatHistory,
                message: userMessage,
            });

            let fullResponse = '';

            for await (const message of chatStream) {
                console.log('Received message:', message);

                if (message.eventType === 'text-generation') {
                    fullResponse += message.text;
                }
            }

            console.log("Final response to send to Slack:", fullResponse);

            await sendMessageToSlack(slackEvent.channel, fullResponse, slackEvent.ts);
        }

        res.status(200).send();
    } catch (error) {
        console.error('Error generating or sending response:', error);
        res.status(500).send('Error generating response');
    }
});

async function sendMessageToSlack(channel, text, threadTs) {
    const url = `https://slack.com/api/chat.postMessage`;
    const payload = {
        channel: channel,
        text: text,
    };

    if (threadTs) {
        payload.thread_ts = threadTs;
    }

    console.log("Sending message to Slack with payload:", payload);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
            },
            body: JSON.stringify(payload),
        });

        console.log("Slack API response status:", response.status);
        const responseData = await response.json();
        console.log("Slack API response data:", responseData);

        if (!response.ok) {
            console.error('Error sending message to Slack:', responseData.error);
        }
    } catch (error) {
        console.error("Failed to send message to Slack:", error);
    }
}

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});