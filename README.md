Slack Cohere Agent
A Slack agent application that leverages the Cohere AI platform to generate intelligent responses to user messages. This agent integrates seamlessly with Slack to provide real-time responses while filtering out bot-generated content.

Features
- Slack Integration: Listens to user messages in Slack channels and threads.
- Cohere AI-Powered Responses: Utilizes Cohere's AI capabilities for generating contextually relevant replies.
- Threaded Conversations: Replies in threads for an organized chat experience.
- Message Deduplication: Prevents responding to the same message multiple times.
- Bot Self-Filtering: Ensures it doesn’t respond to its own messages or other bot-generated content.

Requirements
- Node.js (v16+ recommended)
- A Slack bot app with the necessary permissions
- A Cohere account and API key

Setup
1. Clone the repository
2. Install dependencies
3. Environment Variables: Create a .env file in the project root and add the following:
  - COHERE_API_KEY=your-cohere-api-key
  - SLACK_BOT_TOKEN=your-slack-bot-token
  - BOT_USER_ID=your-bot-user-id
4. Run the application

Deployment
To deploy the bot, host the application on a cloud platform like Heroku, AWS, or Google Cloud, and configure the public URL in Slack's Event Subscriptions settings.

Slack Event Subscriptions: Ensure your Slack app is set up to receive events:
1. Go to your Slack app's Event Subscriptions in the Slack API dashboard.
2. Enable events and set the request URL to: https://your-server-url/slack/events.
3. Subscribe to the following bot events:
  - message.channels
  - message.groups
  - message.im
  - message.mpim

File Structure
- ├── app.js               # Main application logic
- ├── package.json         # Node.js dependencies and scripts
- └── .env                 # Environment variables (not included in version control)

Known Issues
- Rate Limits: Ensure that your bot does not hit Slack's API rate limits when handling multiple messages.
- Message Length: Cohere's response may be truncated if it exceeds the token limit.

Contributing
- Contributions are welcome! Fork the repository and submit a pull request with your improvements.

License
- This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgements
- Cohere AI for their powerful language models.
- Slack API for enabling seamless integration.
